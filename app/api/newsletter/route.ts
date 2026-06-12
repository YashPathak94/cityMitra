import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdminCookie } from "@/lib/admin-auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

type Subscriber = {
  email: string;
  subscribedAt: string;
};

const storageDir = path.join(process.cwd(), ".citymitra");
const subscribersFile = path.join(storageDir, "newsletter.json");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const maxSubscribers = 20000;

async function readSubscribers(): Promise<Subscriber[]> {
  try {
    const raw = await readFile(subscribersFile, "utf-8");
    return JSON.parse(raw) as Subscriber[];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  if (!isAdminCookie(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  }

  const subscribers = await readSubscribers();
  return NextResponse.json({ count: subscribers.length, subscribers: subscribers.slice(-500).reverse() });
}

export async function POST(request: NextRequest) {
  const limit = rateLimit(`newsletter:${clientIp(request)}`, 5, 60 * 1000);

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const payload = (await request.json().catch(() => null)) as { email?: string; website?: string } | null;
  // honeypot field: real users never fill "website"
  if (payload?.website) {
    return NextResponse.json({ ok: true });
  }

  const email = String(payload?.email || "").trim().toLowerCase().slice(0, 120);

  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  await mkdir(storageDir, { recursive: true });
  const subscribers = await readSubscribers();

  if (!subscribers.some((subscriber) => subscriber.email === email)) {
    const next = [...subscribers, { email, subscribedAt: new Date().toISOString() }].slice(-maxSubscribers);
    await writeFile(subscribersFile, JSON.stringify(next, null, 2));
  }

  return NextResponse.json({ ok: true });
}
