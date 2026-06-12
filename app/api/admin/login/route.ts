import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminSessionToken, isValidAdminPassword } from "@/lib/admin-auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const limit = rateLimit(`admin-login:${clientIp(request)}`, 5, 5 * 60 * 1000);

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const payload = (await request.json().catch(() => null)) as { password?: string } | null;
  const token = adminSessionToken();

  if (!token || !isValidAdminPassword(payload?.password)) {
    return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
