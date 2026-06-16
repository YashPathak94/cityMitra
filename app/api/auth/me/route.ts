import { NextRequest, NextResponse } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { getUserByEmail } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ user: null });
  }

  try {
    const user = await getUserByEmail(session.email);
    if (!user) return NextResponse.json({ user: null });
    return NextResponse.json({ user: { email: user.email, isPro: user.isPro } });
  } catch {
    // session is valid even if the profile lookup hiccups
    return NextResponse.json({ user: { email: session.email, isPro: false } });
  }
}
