import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminPassword, adminSessionToken } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => null)) as { password?: string } | null;

  if (!payload?.password || payload.password !== adminPassword()) {
    return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, adminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
