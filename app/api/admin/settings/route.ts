import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdminCookie } from "@/lib/admin-auth";

export const runtime = "nodejs";

type AdminSettings = {
  leadValue: number;
  featuredListingPrice: number;
};

const activityDir = path.join(process.cwd(), ".citymitra");
const settingsFile = path.join(activityDir, "admin-settings.json");
const defaultSettings: AdminSettings = {
  leadValue: 12,
  featuredListingPrice: 999
};

function isAdmin(request: NextRequest) {
  return isAdminCookie(request.cookies.get(ADMIN_COOKIE)?.value);
}

async function readSettings(): Promise<AdminSettings> {
  try {
    const raw = await readFile(settingsFile, "utf-8");
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  }

  return NextResponse.json(await readSettings());
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as Partial<AdminSettings> | null;
  const settings = await readSettings();
  const nextSettings: AdminSettings = {
    leadValue: Math.max(0, Number(payload?.leadValue ?? settings.leadValue)),
    featuredListingPrice: Math.max(0, Number(payload?.featuredListingPrice ?? settings.featuredListingPrice))
  };

  await mkdir(activityDir, { recursive: true });
  await writeFile(settingsFile, JSON.stringify(nextSettings, null, 2));

  return NextResponse.json(nextSettings);
}
