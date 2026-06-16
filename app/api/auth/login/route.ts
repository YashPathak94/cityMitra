import { NextRequest, NextResponse } from "next/server";
import { authConfigured, createSessionToken, emailPattern, SESSION_COOKIE, sessionCookieOptions, verifyPassword } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getUserByEmail } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const limit = rateLimit(`login:${clientIp(request)}`, 8, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  if (!authConfigured()) {
    return NextResponse.json({ error: "Accounts are not enabled yet." }, { status: 503 });
  }

  const payload = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = String(payload?.email || "").trim().toLowerCase().slice(0, 120);
  const password = String(payload?.password || "");

  if (!emailPattern.test(email) || !password) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
    }

    const token = createSessionToken(email);
    const response = NextResponse.json({ ok: true, email, isPro: user.isPro });
    if (token) response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    return response;
  } catch (error) {
    console.error("login failed", error);
    return NextResponse.json({ error: "Could not log in. Please try again." }, { status: 500 });
  }
}
