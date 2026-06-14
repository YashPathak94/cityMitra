import { readFile } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdminCookie } from "@/lib/admin-auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { ActivityRecord, appendActivity, hasDurableStorage, readRecentActivity } from "@/lib/storage";

export const runtime = "nodejs";

const settingsDir = path.join(process.cwd(), ".citymitra");
const settingsFile = path.join(settingsDir, "admin-settings.json");
const visitorCookie = "citymitra_visitor";

type AdminSettings = {
  leadValue: number;
  featuredListingPrice: number;
};

async function readSettings(): Promise<AdminSettings> {
  try {
    const raw = await readFile(settingsFile, "utf-8");
    return { leadValue: 12, featuredListingPrice: 999, ...JSON.parse(raw) };
  } catch {
    return { leadValue: 12, featuredListingPrice: 999 };
  }
}

function countBy(records: ActivityRecord[], key: "city" | "category" | "type") {
  return Object.entries(
    records.reduce<Record<string, number>>((totals, record) => {
      const value = record[key] || "Unknown";
      totals[value] = (totals[value] || 0) + 1;
      return totals;
    }, {})
  )
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export async function GET(request: NextRequest) {
  if (!isAdminCookie(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  }

  const records = await readRecentActivity().catch(() => [] as ActivityRecord[]);
  const settings = await readSettings();
  const visitors = new Set(records.filter((record) => record.type === "page_view").map((record) => record.sessionId).filter(Boolean));
  const sessions = new Set(records.map((record) => record.sessionId).filter(Boolean));
  const pageViews = records.filter((record) => record.type === "page_view").length;
  const totalTime = records
    .filter((record) => record.type === "time_spent")
    .reduce((total, record) => total + (record.value || 0), 0);
  const monetizableEvents = records.filter((record) =>
    ["map_open", "export_pdf", "export_csv", "chat_submit", "search_submit"].includes(record.type)
  ).length;

  return NextResponse.json({
    storage: hasDurableStorage() ? "supabase" : "ephemeral-file",
    totals: {
      events: records.length,
      pageViews,
      uniqueVisitors: visitors.size,
      sessions: sessions.size,
      timeSpentSeconds: totalTime,
      monetizableEvents,
      estimatedLeadValue: monetizableEvents * settings.leadValue,
      leadValue: settings.leadValue,
      featuredListingPrice: settings.featuredListingPrice
    },
    charts: {
      cities: countBy(records, "city"),
      categories: countBy(records, "category"),
      events: countBy(records, "type")
    },
    recent: records.slice(-20).reverse()
  });
}

export async function POST(request: NextRequest) {
  const limit = rateLimit(`activity:${clientIp(request)}`, 120, 60 * 1000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Too many events" }, { status: 429 });
  }

  const payload = (await request.json().catch(() => null)) as Partial<ActivityRecord> | null;

  if (!payload?.type) {
    return NextResponse.json({ error: "Missing event type" }, { status: 400 });
  }

  const existingVisitorId = request.cookies.get(visitorCookie)?.value;
  const visitorId = existingVisitorId || randomUUID();
  const safeValue =
    typeof payload.value === "number" && Number.isFinite(payload.value)
      ? Math.max(0, Math.min(Math.round(payload.value), 60 * 60 * 24))
      : undefined;
  const nextRecord: ActivityRecord = {
    type: String(payload.type).slice(0, 80),
    city: payload.city ? String(payload.city).slice(0, 80) : undefined,
    category: payload.category ? String(payload.category).slice(0, 80) : undefined,
    label: payload.label ? String(payload.label).slice(0, 160) : undefined,
    value: safeValue,
    path: payload.path ? String(payload.path).slice(0, 120) : undefined,
    sessionId: visitorId,
    timestamp: new Date().toISOString()
  };

  // analytics must never break the page; swallow storage failures
  await appendActivity(nextRecord).catch((error) => {
    console.error("activity write failed", error);
  });

  const response = NextResponse.json({ ok: true });

  if (!existingVisitorId) {
    response.cookies.set(visitorCookie, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365
    });
  }

  return response;
}
