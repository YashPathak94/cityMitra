import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdminCookie } from "@/lib/admin-auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { addSubscriber, readSubscribers } from "@/lib/storage";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function GET(request: NextRequest) {
  if (!isAdminCookie(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  }

  try {
    const subscribers = await readSubscribers();
    return NextResponse.json({ count: subscribers.length, subscribers: subscribers.slice(0, 500) });
  } catch (error) {
    console.error("newsletter read failed", error);
    return NextResponse.json({ error: "Subscriber storage unavailable" }, { status: 503 });
  }
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

  try {
    await addSubscriber(email);
  } catch (error) {
    console.error("newsletter write failed", error);
    return NextResponse.json(
      { error: "Subscriptions are temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}
