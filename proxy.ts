import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdminCookie } from "@/lib/admin-auth";

export function proxy(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");

  if (!isAdminPage || isLoginPage) {
    return NextResponse.next();
  }

  const adminCookie = request.cookies.get(ADMIN_COOKIE)?.value;

  if (isAdminCookie(adminCookie)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"]
};
