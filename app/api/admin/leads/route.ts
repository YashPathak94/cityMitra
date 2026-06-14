import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdminCookie } from "@/lib/admin-auth";
import { ActivityRecord, readRecentActivity } from "@/lib/storage";

export const runtime = "nodejs";

// High-intent events worth treating as "leads" — these are the actions a paying
// vendor cares about (someone heading toward their shop / asking about it).
const leadTypes = ["map_open", "chat_submit", "search_submit", "export_pdf", "export_csv"];

const leadTypeLabels: Record<string, string> = {
  map_open: "Map opened",
  chat_submit: "Asked AI",
  search_submit: "Searched",
  export_pdf: "Exported PDF",
  export_csv: "Exported Excel"
};

function groupCount(records: ActivityRecord[], key: "city" | "category") {
  return Object.entries(
    records.reduce<Record<string, number>>((totals, record) => {
      const value = record[key] || "Unknown";
      totals[value] = (totals[value] || 0) + 1;
      return totals;
    }, {})
  )
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function groupByDay(records: ActivityRecord[]) {
  return Object.entries(
    records.reduce<Record<string, number>>((totals, record) => {
      const day = record.timestamp.slice(0, 10);
      totals[day] = (totals[day] || 0) + 1;
      return totals;
    }, {})
  )
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.label.localeCompare(a.label))
    .slice(0, 14);
}

function toCsv(rows: ActivityRecord[]) {
  const header = ["Timestamp", "Lead type", "City", "Category", "Detail"];
  const lines = rows.map((record) =>
    [
      record.timestamp,
      leadTypeLabels[record.type] || record.type,
      record.city || "",
      record.category || "",
      record.label || ""
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header.join(","), ...lines].join("\n");
}

export async function GET(request: NextRequest) {
  if (!isAdminCookie(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  }

  const all = await readRecentActivity().catch(() => [] as ActivityRecord[]);
  const leads = all
    .filter((record) => leadTypes.includes(record.type))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  if (request.nextUrl.searchParams.get("format") === "csv") {
    return new NextResponse(toCsv(leads), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="citymitra-leads-${new Date().toISOString().slice(0, 10)}.csv"`
      }
    });
  }

  return NextResponse.json({
    total: leads.length,
    byCity: groupCount(leads, "city").slice(0, 12),
    byCategory: groupCount(leads, "category").slice(0, 12),
    byDay: groupByDay(leads),
    recent: leads.slice(0, 50).map((record) => ({
      type: record.type,
      typeLabel: leadTypeLabels[record.type] || record.type,
      city: record.city,
      category: record.category,
      label: record.label,
      timestamp: record.timestamp
    }))
  });
}
