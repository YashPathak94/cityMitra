import { NextRequest, NextResponse } from "next/server";
import { authConfigured, createSessionToken, emailPattern, hashPassword, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { createUser, getUserByEmail } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const limit = rateLimit(`signup:${clientIp(request)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  if (!authConfigured()) {
    return NextResponse.json({ error: "Accounts are not enabled yet." }, { status: 503 });
  }

  const payload = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = String(payload?.email || "").trim().toLowerCase().slice(0, 120);
  const password = String(payload?.password || "");

  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  try {
    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists. Please log in." }, { status: 409 });
    }

    await createUser(email, hashPassword(password));
    const token = createSessionToken(email);
    const response = NextResponse.json({ ok: true, email, isPro: false });
    if (token) response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    return response;
  } catch (error) {
    console.error("signup failed", error);
    return NextResponse.json({ error: "Could not create the account. Please try again." }, { status: 500 });
  }
}
