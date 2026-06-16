import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { googleConfigured } from "@/lib/auth";

export const runtime = "nodejs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function GET() {
  if (!googleConfigured()) {
    return NextResponse.redirect(`${siteUrl}/pro?auth=google_unavailable`);
  }

  const state = randomBytes(16).toString("hex");
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    redirect_uri: `${siteUrl}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state
  });

  const response = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  // CSRF guard: state echoed back on callback
  response.cookies.set("citymitra_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600
  });
  return response;
}
