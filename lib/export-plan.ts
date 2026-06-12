import { categories, CategoryKey } from "@/data/city-directory";
import { escapeHtml, NearbyCard, UserLocation } from "@/lib/city-intel";
import { mapDirectionsUrl, mapEmbedUrl } from "@/lib/maps";

export type PlanExportContext = {
  city: string;
  categoryLabel: string;
  category: CategoryKey;
  cityVisual: { image: string; position: string };
  userLocation: UserLocation | null;
  nearbyCards: NearbyCard[];
  generatedCategoryResults: NearbyCard[];
  plan: string;
};

export function openPdfPlan(context: PlanExportContext) {
  const { city, categoryLabel, cityVisual, userLocation, nearbyCards, generatedCategoryResults, plan } = context;
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const sourceText = userLocation ? `${userLocation.lat}, ${userLocation.lng}` : "Current location not enabled";
  const mapPreview = mapEmbedUrl(`${city} India ${categoryLabel}`);
  const routeRows = nearbyCards
    .map(
      (item) =>
        `<tr>
          <td><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(categories.find((cat) => cat.key === item.category)?.label || "City")}</small></td>
          <td>${escapeHtml(item.area)}</td>
          <td>${escapeHtml(item.eta)}<small>${userLocation ? "From current location: open Maps for live time" : "Enable nearby location in CityMitra for current-location routing"}</small></td>
          <td><a href="${mapDirectionsUrl(item.query, userLocation)}">${escapeHtml(item.query)}</a></td>
        </tr>`
    )
    .join("");
  const selectedRows = generatedCategoryResults
    .map(
      (item, index) =>
        `<tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(item.name)}</td>
          <td>${escapeHtml(item.area)}</td>
          <td><a href="${mapDirectionsUrl(item.query, userLocation)}">Open route</a></td>
        </tr>`
    )
    .join("");

  printWindow.document.write(`<!doctype html>
    <html>
      <head>
        <title>CityMitra ${city} plan</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; background: #fff7ed; color: #0f172a; font-family: Arial, sans-serif; }
          .cover { min-height: 280px; padding: 34px; color: #fff; background: linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(234, 88, 12, 0.78)), url("${cityVisual.image}"); background-size: cover; background-position: ${cityVisual.position}; }
          .kicker { color: #fed7aa; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
          h1 { max-width: 760px; margin: 10px 0; font-size: 48px; line-height: 0.95; }
          h2 { margin: 0 0 12px; font-size: 24px; }
          p { line-height: 1.55; }
          .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
          .chips span { border: 1px solid rgba(255,255,255,0.35); border-radius: 999px; background: rgba(255,255,255,0.12); padding: 8px 11px; font-size: 12px; font-weight: 800; }
          main { padding: 24px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 18px; }
          .card { border: 1px solid #fed7aa; border-radius: 12px; background: #fff; padding: 14px; box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08); }
          .card b { display: block; color: #ea580c; font-size: 22px; }
          .mapFrame { overflow: hidden; border: 4px solid #fff; border-radius: 14px; box-shadow: 0 18px 50px rgba(15, 23, 42, 0.18); }
          iframe { width: 100%; height: 300px; border: 0; }
          .plan { white-space: pre-wrap; line-height: 1.55; border-left: 5px solid #2563eb; background: #eff6ff; padding: 16px; border-radius: 12px; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0 28px; overflow: hidden; border-radius: 12px; background: #fff; }
          th, td { border: 1px solid #fed7aa; padding: 10px; text-align: left; vertical-align: top; font-size: 12px; }
          th { background: linear-gradient(135deg, #ea580c, #2563eb); color: #fff; }
          td small { display: block; margin-top: 5px; color: #64748b; line-height: 1.35; }
          a { color: #2563eb; font-weight: 800; }
          .note { border: 1px dashed #fb923c; border-radius: 12px; background: #fff7ed; padding: 14px; color: #64748b; }
          @page { margin: 14mm; }
          @media print { .cover { break-after: avoid; } a { color: #0f172a; } }
        </style>
      </head>
      <body>
        <section class="cover">
          <span class="kicker">CityMitra mature planner PDF</span>
          <h1>${escapeHtml(city)} ${escapeHtml(categoryLabel)} Route Plan</h1>
          <p>Vibrant planner for route decisions, nearby categories, map links, photos, backup services, and time checks.</p>
          <div class="chips">
            <span>From: ${escapeHtml(sourceText)}</span>
            <span>City: ${escapeHtml(city)}</span>
            <span>Category: ${escapeHtml(categoryLabel)}</span>
            <span>Top picks: ${nearbyCards.length}</span>
          </div>
        </section>
        <main>
          <section class="grid">
            <div class="card"><b>${categories.length}</b>categories covered</div>
            <div class="card"><b>${nearbyCards.length}</b>curated route stops</div>
            <div class="card"><b>${userLocation ? "Live" : "City"}</b>${userLocation ? "current-location routing" : "map-search routing"}</div>
          </section>
          <section class="card">
            <h2>Map Preview</h2>
            <div class="mapFrame"><iframe src="${mapPreview}" title="${escapeHtml(city)} map preview"></iframe></div>
            <p><a href="${mapDirectionsUrl(`${categoryLabel} near ${city}`, userLocation)}">Open route from ${escapeHtml(sourceText)}</a></p>
          </section>
          <section class="card">
            <h2>AI Planner Notes</h2>
            <div class="plan">${escapeHtml(plan)}</div>
          </section>
          <h2>Top 20 Curated Route Sheet</h2>
        <table>
          <thead><tr><th>Stop</th><th>Area</th><th>Time</th><th>Map Route</th></tr></thead>
          <tbody>${routeRows}</tbody>
        </table>
          <h2>Selected Category: 10 More Options</h2>
          <table>
            <thead><tr><th>#</th><th>Option</th><th>Area Type</th><th>Route</th></tr></thead>
            <tbody>${selectedRows}</tbody>
          </table>
          <div class="note">
            <strong>Planner maturity check:</strong> map time, opening hours, rush, road closures, medical availability,
            parking, and altitude safety must be verified in live Maps or by calling the venue before leaving.
          </div>
        </main>
      </body>
    </html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

export function downloadCsvPlan(context: Pick<PlanExportContext, "city" | "categoryLabel" | "nearbyCards" | "plan">) {
  const { city, categoryLabel, nearbyCards, plan } = context;
  const rows = [
    ["City", "Category", "Stop", "Area", "Distance/Time", "Map Search"],
    ...nearbyCards.map((item) => [city, categoryLabel, item.name, item.area, item.eta, item.query])
  ];
  const chatRows = [["Chat Plan"], [plan]];
  const csv = [...rows, [], ...chatRows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `citymitra-${city.toLowerCase().replace(/\s+/g, "-")}-plan.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
