import { NextRequest, NextResponse } from "next/server";
import { authConfigured, createSessionToken, emailPattern, hashPassword, readResetToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getUserByEmail, updateUserPassword } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const limit = rateLimit(`reset:${clientIp(request)}`, 8, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  if (!authConfigured()) {
    return NextResponse.json({ error: "Accounts are not enabled yet." }, { status: 503 });
  }

  const payload = (await request.json().catch(() => null)) as { email?: string; token?: string; password?: string } | null;
  const email = String(payload?.email || "").trim().toLowerCase().slice(0, 120);
  const token = String(payload?.token || "");
  const password = String(payload?.password || "");

  if (!emailPattern.test(email) || !token) {
    return NextResponse.json({ error: "Invalid reset link." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  try {
    const user = await getUserByEmail(email);
    // Token is signed with the CURRENT password hash, so it's single-use.
    if (!user || !user.passwordHash || !readResetToken(token, user.passwordHash)) {
      return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
    }

    await updateUserPassword(email, hashPassword(password));

    const session = createSessionToken(email);
    const response = NextResponse.json({ ok: true });
    if (session) response.cookies.set(SESSION_COOKIE, session, sessionCookieOptions);
    return response;
  } catch (error) {
    console.error("reset password failed", error);
    return NextResponse.json({ error: "Could not reset the password. Please try again." }, { status: 500 });
  }
}
