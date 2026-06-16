import { NextRequest, NextResponse } from "next/server";
import { authConfigured, createResetToken, emailPattern } from "@/lib/auth";
import { emailConfigured, sendEmail } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getUserByEmail } from "@/lib/storage";

export const runtime = "nodejs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  const limit = rateLimit(`forgot:${clientIp(request)}`, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  if (!authConfigured()) {
    return NextResponse.json({ error: "Accounts are not enabled yet." }, { status: 503 });
  }

  const payload = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = String(payload?.email || "").trim().toLowerCase().slice(0, 120);

  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  // Always return success to avoid leaking which emails exist.
  const genericOk = { ok: true, message: "If an account exists, a reset link has been sent." };

  try {
    const user = await getUserByEmail(email);
    if (!user || !user.passwordHash) {
      // No account, or a Google-only account with no password to reset.
      return NextResponse.json(genericOk);
    }

    const token = createResetToken(email, user.passwordHash);
    if (!token) return NextResponse.json(genericOk);

    const resetUrl = `${siteUrl}/reset?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
    const sent = await sendEmail(
      email,
      "Reset your CityMitra password",
      `<p>Tap the link below to set a new password. It expires in 1 hour.</p><p><a href="${resetUrl}">Reset my password</a></p><p>If you didn't request this, you can ignore this email.</p>`
    );

    // In dev / when email isn't configured, return the link so the flow is testable.
    if (!sent && !emailConfigured()) {
      return NextResponse.json({ ...genericOk, devResetUrl: resetUrl });
    }

    return NextResponse.json(genericOk);
  } catch (error) {
    console.error("forgot password failed", error);
    return NextResponse.json(genericOk);
  }
}
