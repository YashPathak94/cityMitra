import { escapeHtml } from "@/lib/city-intel";
import { mapEmbedUrl } from "@/lib/maps";
import { NATIONAL_EMERGENCY_NUMBERS, PREFERENCE_LABELS, RoutePlan, TRAVEL_MODE_LABELS } from "@/lib/route-plan";

function fileSlug(plan: RoutePlan) {
  return `citymitra-route-${plan.origin}-to-${plan.destination}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function downloadRoutePlanText(plan: RoutePlan, mapsUrl: string) {
  const lines: string[] = [];
  lines.push(`CityMitra Route Plan: ${plan.origin} -> ${plan.destination}`);
  lines.push(`Mode: ${TRAVEL_MODE_LABELS[plan.travelMode]}`);
  if (plan.preferences.length) lines.push(`Preferences: ${plan.preferences.map((p) => PREFERENCE_LABELS[p]).join(", ")}`);
  lines.push("");

  if (plan.source === "ai") {
    lines.push(`Approx. distance: ${plan.distanceKm} km`);
    lines.push(`Approx. duration: ${plan.durationHoursMin}-${plan.durationHoursMax} hours`);
    if (plan.bestTimeToTravel) lines.push(`Best time to travel: ${plan.bestTimeToTravel}`);
    lines.push("");

    if (plan.routeOptions.length) {
      lines.push("ROUTE OPTIONS");
      plan.routeOptions.forEach((route, index) => {
        lines.push(`${index + 1}. ${route.name} (${route.viaSummary}) - ~${route.distanceKm} km, ~${route.durationHours} hrs`);
        if (route.roadCondition) lines.push(`   Road condition: ${route.roadCondition}`);
        if (route.pros.length) lines.push(`   Pros: ${route.pros.join("; ")}`);
        if (route.cons.length) lines.push(`   Cons: ${route.cons.join("; ")}`);
      });
      lines.push("");
    }

    if (plan.hopPoints.length) {
      lines.push("HOP POINTS");
      plan.hopPoints.forEach((hop) => lines.push(`- ${hop.name} (~${hop.distanceFromOriginKm} km in) - ${hop.stopType}: ${hop.note}`));
      lines.push("");
    }

    if (plan.localItineraryTips.length) {
      lines.push("LOCAL ITINERARY TIPS");
      plan.localItineraryTips.forEach((tip) => lines.push(`- ${tip}`));
      lines.push("");
    }

    if (plan.fuelStops.length) {
      lines.push("FUEL / CHARGING STOPS (AI-suggested — verify locally)");
      plan.fuelStops.forEach((stop) => lines.push(`- ${stop.areaName} [${stop.types.join(", ") || "type unspecified"}] ${stop.note}`));
      lines.push("");
    }
  } else {
    lines.push("AI route details were unavailable for this request — showing only the verified national emergency");
    lines.push("numbers and the live Google Maps link below.");
    lines.push("");
  }

  lines.push("EMERGENCY NUMBERS");
  lines.push("National (always accurate):");
  NATIONAL_EMERGENCY_NUMBERS.forEach((contact) => lines.push(`- ${contact.label}: ${contact.number}`));
  if (plan.localEmergencyContacts.length) {
    lines.push("");
    lines.push("Local (AI-suggested — unverified, confirm before you travel):");
    plan.localEmergencyContacts.forEach((contact) => lines.push(`- ${contact.label} (${contact.region}): ${contact.number}`));
  }

  lines.push("");
  lines.push(`Live route (Google Maps): ${mapsUrl}`);
  lines.push("");
  lines.push(plan.disclaimer);

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileSlug(plan)}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

export function openRoutePlanPdf(plan: RoutePlan, mapsUrl: string) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const mapPreview = mapEmbedUrl(`${plan.origin} to ${plan.destination}`);

  const routeRows = plan.routeOptions
    .map(
      (route) =>
        `<tr>
          <td><strong>${escapeHtml(route.name)}</strong><small>${escapeHtml(route.viaSummary)}</small></td>
          <td>~${route.distanceKm} km</td>
          <td>~${route.durationHours} hrs</td>
          <td>${escapeHtml(route.roadCondition)}</td>
        </tr>`
    )
    .join("");

  const hopRows = plan.hopPoints
    .map(
      (hop) =>
        `<tr>
          <td>${escapeHtml(hop.name)}</td>
          <td>~${hop.distanceFromOriginKm} km</td>
          <td>${escapeHtml(hop.stopType)}</td>
          <td>${escapeHtml(hop.note)}</td>
        </tr>`
    )
    .join("");

  const nationalRows = NATIONAL_EMERGENCY_NUMBERS.map(
    (contact) => `<tr><td><strong>${escapeHtml(contact.label)}</strong></td><td>${escapeHtml(contact.number)}</td><td>${escapeHtml(contact.region)}</td></tr>`
  ).join("");

  const localRows = plan.localEmergencyContacts
    .map(
      (contact) =>
        `<tr><td><strong>${escapeHtml(contact.label)}</strong></td><td>${escapeHtml(contact.number)}</td><td>${escapeHtml(contact.region)}</td></tr>`
    )
    .join("");

  printWindow.document.write(`<!doctype html>
    <html>
      <head>
        <title>CityMitra route: ${escapeHtml(plan.origin)} to ${escapeHtml(plan.destination)}</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; background: #fff7ed; color: #0f172a; font-family: Arial, sans-serif; }
          .cover { padding: 34px; color: #fff; background: linear-gradient(135deg, #0f172a, #ea580c); }
          .kicker { color: #fed7aa; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
          h1 { max-width: 760px; margin: 10px 0; font-size: 36px; line-height: 1.05; }
          h2 { margin: 0 0 12px; font-size: 22px; }
          p { line-height: 1.55; }
          .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
          .chips span { border: 1px solid rgba(255,255,255,0.35); border-radius: 999px; background: rgba(255,255,255,0.12); padding: 8px 11px; font-size: 12px; font-weight: 800; }
          main { padding: 24px; }
          .card { border: 1px solid #fed7aa; border-radius: 12px; background: #fff; padding: 14px; box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08); margin-bottom: 18px; }
          .mapFrame { overflow: hidden; border: 4px solid #fff; border-radius: 14px; box-shadow: 0 18px 50px rgba(15, 23, 42, 0.18); }
          iframe { width: 100%; height: 280px; border: 0; }
          table { width: 100%; border-collapse: collapse; margin: 12px 0 8px; overflow: hidden; border-radius: 12px; background: #fff; }
          th, td { border: 1px solid #fed7aa; padding: 10px; text-align: left; vertical-align: top; font-size: 12px; }
          th { background: linear-gradient(135deg, #ea580c, #2563eb); color: #fff; }
          td small { display: block; margin-top: 5px; color: #64748b; line-height: 1.35; }
          a { color: #2563eb; font-weight: 800; word-break: break-all; }
          ul { margin: 8px 0; padding-left: 20px; line-height: 1.6; }
          .note { border: 1px dashed #fb923c; border-radius: 12px; background: #fff7ed; padding: 14px; color: #64748b; }
          .unavailable { border: 1px dashed #fb923c; border-radius: 12px; background: #fff7ed; padding: 14px; color: #7c2d12; font-weight: 700; }
          @page { margin: 14mm; }
        </style>
      </head>
      <body>
        <section class="cover">
          <span class="kicker">CityMitra Route Planner</span>
          <h1>${escapeHtml(plan.origin)} &rarr; ${escapeHtml(plan.destination)}</h1>
          <div class="chips">
            <span>Mode: ${escapeHtml(TRAVEL_MODE_LABELS[plan.travelMode])}</span>
            ${plan.source === "ai" ? `<span>Approx. distance: ${plan.distanceKm} km</span>` : ""}
            ${plan.source === "ai" ? `<span>Approx. duration: ${plan.durationHoursMin}-${plan.durationHoursMax} hrs</span>` : ""}
          </div>
        </section>
        <main>
          <div class="card">
            <h2>Live route</h2>
            <div class="mapFrame"><iframe src="${mapPreview}" title="Route preview"></iframe></div>
            <p><a href="${mapsUrl}">${mapsUrl}</a></p>
          </div>

          ${
            plan.source === "ai"
              ? `
          ${plan.bestTimeToTravel ? `<div class="card"><h2>Best time to travel</h2><p>${escapeHtml(plan.bestTimeToTravel)}</p></div>` : ""}
          ${
            routeRows
              ? `<div class="card"><h2>Route options</h2>
                <table><thead><tr><th>Route</th><th>Distance</th><th>Duration</th><th>Road condition</th></tr></thead><tbody>${routeRows}</tbody></table></div>`
              : ""
          }
          ${
            hopRows
              ? `<div class="card"><h2>Hop points</h2>
                <table><thead><tr><th>Place</th><th>Distance in</th><th>Stop type</th><th>Note</th></tr></thead><tbody>${hopRows}</tbody></table></div>`
              : ""
          }
          ${
            plan.localItineraryTips.length
              ? `<div class="card"><h2>Local itinerary tips</h2><ul>${plan.localItineraryTips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}</ul></div>`
              : ""
          }
          ${
            plan.fuelStops.length
              ? `<div class="card"><h2>Fuel / charging stops (AI-suggested — verify locally)</h2><ul>${plan.fuelStops
                  .map((stop) => `<li><strong>${escapeHtml(stop.areaName)}</strong> [${escapeHtml(stop.types.join(", ") || "type unspecified")}] — ${escapeHtml(stop.note)}</li>`)
                  .join("")}</ul></div>`
              : ""
          }`
              : `<div class="unavailable">AI route details were unavailable for this request — showing only the verified national emergency numbers and the live Maps link.</div>`
          }

          <div class="card">
            <h2>Emergency numbers</h2>
            <p><strong>National (always accurate):</strong></p>
            <table><thead><tr><th>Service</th><th>Number</th><th>Coverage</th></tr></thead><tbody>${nationalRows}</tbody></table>
            ${
              localRows
                ? `<p><strong>Local (AI-suggested — unverified, confirm before you travel):</strong></p>
                  <table><thead><tr><th>Service</th><th>Number</th><th>Region</th></tr></thead><tbody>${localRows}</tbody></table>`
                : ""
            }
          </div>

          <div class="note">${escapeHtml(plan.disclaimer)}</div>
        </main>
      </body>
    </html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
