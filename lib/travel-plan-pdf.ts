import { escapeHtml } from "@/lib/city-intel";
import type { FareIntel, RentalOption, TravelPlan } from "@/lib/travel-plan";

const inr = (value: number) => `₹${Math.max(0, Math.round(value)).toLocaleString("en-IN")}`;

const PDF_STYLE = `
  * { box-sizing: border-box; }
  body { margin: 0; background: #fff7ed; color: #0f172a; font-family: Arial, Helvetica, sans-serif; }
  .cover { padding: 32px 34px; color: #fff; background: linear-gradient(135deg, #fb923c, #ea580c 55%, #2563eb); }
  .kicker { color: #ffedd5; font-size: 11px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; }
  h1 { margin: 8px 0 4px; font-size: 34px; line-height: 1.05; }
  .cover p { margin: 4px 0 0; color: rgba(255,255,255,.92); font-size: 13px; }
  .chips { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 14px; }
  .chips span { border: 1px solid rgba(255,255,255,.4); border-radius: 999px; background: rgba(255,255,255,.14); padding: 6px 11px; font-size: 11px; font-weight: 800; }
  main { padding: 22px 26px 30px; }
  h2 { margin: 22px 0 8px; font-size: 17px; color: #ea580c; }
  h2:first-child { margin-top: 0; }
  p, li { font-size: 12.5px; line-height: 1.55; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0 4px; background: #fff; border-radius: 10px; overflow: hidden; }
  th, td { border: 1px solid #fed7aa; padding: 8px 9px; text-align: left; vertical-align: top; font-size: 11.5px; }
  th { background: #ea580c; color: #fff; }
  td small { display: block; margin-top: 3px; color: #64748b; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 10px 0 4px; }
  .stat { border: 1px solid #fed7aa; border-radius: 10px; background: #fff; padding: 10px; }
  .stat span { display: block; font-size: 9.5px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #64748b; }
  .stat b { display: block; margin-top: 3px; font-size: 16px; }
  .note { border: 1px dashed #fb923c; border-radius: 10px; background: #fff7ed; padding: 10px 12px; color: #64748b; font-size: 11px; margin-top: 18px; }
  ol, ul { margin: 6px 0; padding-left: 20px; }
  .summaryBox { border-left: 4px solid #2563eb; background: #eff6ff; border-radius: 8px; padding: 10px 12px; }
  @page { margin: 12mm; }
`;

export type TravelPlanPdfContext = {
  planName: string;
  origin: string;
  destination: string;
  startDateISO: string;
  endDateISO: string;
  travelers: number;
  nights: number;
  vibe: string;
  stay: string;
  moments: string[];
  riskLevel: string;
  targetBudget: number;
  offsetPct: number;
  milestones: Array<{ month: number; value: number }>;
  calc: TravelPlan;
  aiPlan: TravelPlan | null;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

function fareIntelHtml(intel: FareIntel): string {
  const rows = intel.offers
    .map((o) => `<tr><td>${escapeHtml(o.option)}</td><td>${escapeHtml(o.offer)}</td><td>${escapeHtml(o.saving)}</td></tr>`)
    .join("");
  return `
    <h2>Fare intel</h2>
    <p><strong>${escapeHtml(intel.headline)}</strong></p>
    <p>Expected range: <strong>${escapeHtml(intel.expectedRange)}</strong> · Target after offers: <strong>${escapeHtml(intel.targetPrice)}</strong> · Acceptable up to: <strong>${escapeHtml(intel.acceptablePrice)}</strong></p>
    ${rows ? `<table><thead><tr><th>Booking option</th><th>Offer</th><th>Estimated saving</th></tr></thead><tbody>${rows}</tbody></table>` : ""}
    ${intel.recommendation.length ? `<ol>${intel.recommendation.map((r) => `<li>${escapeHtml(r)}</li>`).join("")}</ol>` : ""}`;
}

function rentalsHtml(rentals: RentalOption[]): string {
  if (!rentals.length) return "";
  const rows = rentals
    .map(
      (r) =>
        `<tr><td>${r.type === "car" ? "Self-drive car" : "Bike / scooter"}</td><td>${inr(r.perDayFrom)}${r.perDayTo ? `–${inr(r.perDayTo)}` : ""}/day</td><td>${escapeHtml(r.vendor)}<small>${escapeHtml(r.note)}</small></td></tr>`
    )
    .join("");
  return `<h2>Rentals on arrival</h2><table><thead><tr><th>Type</th><th>Per day</th><th>Vendor & notes</th></tr></thead><tbody>${rows}</tbody></table>`;
}

// Opens a print-ready window with the complete funding + trip plan; the
// browser's print dialog handles "Save as PDF" on every platform.
export function openTravelPlanPdf(ctx: TravelPlanPdfContext) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const plan = ctx.aiPlan ?? ctx.calc;
  const route = `${ctx.origin || "Your city"} → ${ctx.destination}`;
  const transportRows = plan.transport
    .map((o) => {
      const rental = o.mode === "car" || o.mode === "bike";
      return `<tr><td>${escapeHtml(o.mode)}${o.best ? " ⭐" : ""}</td><td>${inr(o.priceFrom)}${o.priceTo ? `–${inr(o.priceTo)}` : "+"}${rental ? "/day" : ""}</td><td>${escapeHtml(o.duration)}</td><td>${escapeHtml(o.operator || "")}<small>${escapeHtml([o.platform, o.note].filter(Boolean).join(" · "))}</small></td></tr>`;
    })
    .join("");
  const hotelRows = plan.hotels
    .map((h) => `<tr><td>${escapeHtml(h.tier)}</td><td>${inr(h.nightlyFrom)}/night</td><td>${escapeHtml(h.example || "")}<small>${escapeHtml([h.platform, h.note].filter(Boolean).join(" · "))}</small></td></tr>`)
    .join("");
  const cardRows = plan.cardAdvice
    .map((c) => `<tr><td>${escapeHtml(c.card)}</td><td>${escapeHtml(c.useFor)}</td><td>${escapeHtml(c.offer || "")}<small>${escapeHtml(c.benefit)}</small></td></tr>`)
    .join("");
  const milestoneChips = ctx.milestones.map((m) => `<span>M${m.month}: ${inr(m.value)}</span>`).join("");
  const instruments = plan.instruments
    .map((i) => `<li><strong>${escapeHtml(i.name)}</strong>${i.tag ? ` (${escapeHtml(i.tag)})` : ""} — ${escapeHtml(i.detail)}</li>`)
    .join("");

  printWindow.document.write(`<!doctype html><html><head><title>${escapeHtml(ctx.planName)} — CityMitra travel plan</title><style>${PDF_STYLE}</style></head><body>
    <section class="cover">
      <span class="kicker">CityMitra · AI travel-funding plan</span>
      <h1>${escapeHtml(ctx.planName)}</h1>
      <p>${escapeHtml(route)} · ${fmtDate(ctx.startDateISO)} → ${fmtDate(ctx.endDateISO)}</p>
      <div class="chips">
        <span>${ctx.travelers} travellers</span><span>${ctx.nights} nights</span><span>${escapeHtml(ctx.vibe)}</span>
        <span>${escapeHtml(ctx.stay)} stay</span>${ctx.moments.map((m) => `<span>${escapeHtml(m)}</span>`).join("")}
      </div>
    </section>
    <main>
      <h2>The money plan</h2>
      <div class="grid">
        <div class="stat"><span>Save / month</span><b>${inr(ctx.calc.recommendedMonthly)}</b></div>
        <div class="stat"><span>Trip corpus</span><b>${inr(ctx.calc.projectedValue)}</b></div>
        <div class="stat"><span>Growth + rewards</span><b>${inr(ctx.calc.investmentGains + ctx.calc.netCardRewards)} (~${ctx.offsetPct}%)</b></div>
        <div class="stat"><span>Your top-up</span><b>${inr(ctx.calc.outOfPocket)}</b></div>
      </div>
      <p>${ctx.calc.monthsToGo} months to departure · ${ctx.calc.assumedAnnualReturnPct}% p.a. assumed (${escapeHtml(ctx.riskLevel)} risk) · ${ctx.calc.allocation.equityPct}/${ctx.calc.allocation.debtPct} growth/stable split · budget ${inr(ctx.targetBudget)}</p>
      <div class="chips" style="margin-top:6px">${milestoneChips}</div>
      ${plan.summary ? `<h2>Plan summary</h2><p class="summaryBox">${escapeHtml(plan.summary)}</p>` : ""}
      ${plan.vibeInsight ? `<h2>Vibe read</h2><p>${escapeHtml(plan.vibeInsight)}</p>` : ""}
      ${plan.fareIntel ? fareIntelHtml(plan.fareIntel) : ""}
      <h2>Getting there${ctx.aiPlan ? "" : " (estimates)"}</h2>
      <table><thead><tr><th>Mode</th><th>Fare</th><th>Duration</th><th>Operators & booking</th></tr></thead><tbody>${transportRows}</tbody></table>
      ${rentalsHtml(plan.rentals)}
      <h2>Where to stay</h2>
      <table><thead><tr><th>Tier</th><th>Rate</th><th>Examples & platforms</th></tr></thead><tbody>${hotelRows}</tbody></table>
      ${cardRows ? `<h2>Card plays</h2><table><thead><tr><th>Card</th><th>Use for</th><th>Offer & benefit</th></tr></thead><tbody>${cardRows}</tbody></table>` : ""}
      ${plan.strategy.length ? `<h2>Month-by-month strategy</h2><ol>${plan.strategy.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol>` : ""}
      ${instruments ? `<h2>Grow the money</h2><ul>${instruments}</ul>` : ""}
      ${plan.deals.length ? `<h2>Money-saving tips</h2><ul>${plan.deals.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul>` : ""}
      <div class="note">${escapeHtml(plan.disclaimer)} Prices are ${ctx.aiPlan ? "AI-researched estimates" : "smart estimates"} — verify at checkout before paying.</div>
    </main>
  </body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

// Minimal markdown → HTML for chat itineraries (headings, bold, bullets,
// pipe tables) — enough for a clean printable page without a parser dep.
function mdToBasicHtml(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;
  let inTable = false;
  const closeList = () => { if (inList) { out.push("</ul>"); inList = false; } };
  const closeTable = () => { if (inTable) { out.push("</tbody></table>"); inTable = false; } };
  const inline = (s: string) =>
    escapeHtml(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^\s*\|/.test(line)) {
      const cells = line.replace(/^\s*\||\|\s*$/g, "").split("|").map((c) => inline(c.trim()));
      if (/^[\s|:-]+$/.test(line)) continue;
      if (!inTable) {
        closeList();
        out.push(`<table><thead><tr>${cells.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>`);
        inTable = true;
      } else {
        out.push(`<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`);
      }
      continue;
    }
    closeTable();
    if (/^#{1,3}\s/.test(line)) {
      closeList();
      out.push(`<h2>${inline(line.replace(/^#{1,3}\s*/, ""))}</h2>`);
    } else if (/^\s*[-*]\s+/.test(line)) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${inline(line.replace(/^\s*[-*]\s+/, ""))}</li>`);
    } else if (line.trim() === "") {
      closeList();
    } else {
      closeList();
      out.push(`<p>${inline(line)}</p>`);
    }
  }
  closeList();
  closeTable();
  return out.join("\n");
}

export function openItineraryPdf(title: string, markdown: string) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(`<!doctype html><html><head><title>${escapeHtml(title)} — CityMitra itinerary</title><style>${PDF_STYLE}</style></head><body>
    <section class="cover">
      <span class="kicker">CityMitra · City Chat itinerary</span>
      <h1>${escapeHtml(title)}</h1>
      <p>Planned with CityMitra — verify hours, fares and availability before you go.</p>
    </section>
    <main>${mdToBasicHtml(markdown)}
      <div class="note">Generated by CityMitra City Chat. Estimates only — confirm timings, prices and bookings on the official apps before paying.</div>
    </main>
  </body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
