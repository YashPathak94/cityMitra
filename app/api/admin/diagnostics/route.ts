import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdminCookie } from "@/lib/admin-auth";
import { runStorageDiagnostics } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isAdminCookie(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  }

  try {
    const result = await runStorageDiagnostics();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Diagnostics failed unexpectedly." },
      { status: 500 }
    );
  }
}
