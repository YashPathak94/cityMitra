import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, googleConfigured, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { findOrCreateOAuthUser } from "@/lib/storage";

export const runtime = "nodejs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  if (!googleConfigured()) {
    return NextResponse.redirect(`${siteUrl}/pro?auth=google_unavailable`);
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get("citymitra_oauth_state")?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(`${siteUrl}/pro?auth=google_failed`);
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        redirect_uri: `${siteUrl}/api/auth/google/callback`,
        grant_type: "authorization_code"
      })
    });
    const tokens = (await tokenResponse.json()) as { access_token?: string };
    if (!tokens.access_token) {
      return NextResponse.redirect(`${siteUrl}/pro?auth=google_failed`);
    }

    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    const profile = (await profileResponse.json()) as { email?: string; email_verified?: boolean };

    if (!profile.email) {
      return NextResponse.redirect(`${siteUrl}/pro?auth=google_failed`);
    }

    const email = profile.email.trim().toLowerCase();
    await findOrCreateOAuthUser(email, "google");
    const session = createSessionToken(email);

    const response = NextResponse.redirect(`${siteUrl}/pro?auth=google_ok`);
    if (session) response.cookies.set(SESSION_COOKIE, session, sessionCookieOptions);
    response.cookies.set("citymitra_oauth_state", "", { path: "/", maxAge: 0 });
    return response;
  } catch (error) {
    console.error("google oauth failed", error);
    return NextResponse.redirect(`${siteUrl}/pro?auth=google_failed`);
  }
}
