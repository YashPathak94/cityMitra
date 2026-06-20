import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { buildCalculatorPlan, PlanInstrument, RiskLevel, TravelPlanInput } from "@/lib/travel-plan";

export const runtime = "nodejs";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function sanitize(body: Record<string, unknown>): TravelPlanInput | null {
  const destination = String(body.destination || "").slice(0, 80).trim();
  const travelDateISO = String(body.travelDateISO || "").slice(0, 20).trim();
  const targetBudget = Number(body.targetBudget);
  const monthlyCapacityRaw = Number(body.monthlyCapacity);
  const risk = String(body.riskLevel || "medium") as RiskLevel;
  if (!destination || !travelDateISO || !Number.isFinite(targetBudget) || targetBudget <= 0) return null;
  return {
    destination,
    travelDateISO,
    targetBudget: Math.min(targetBudget, 100000000),
    monthlyCapacity: Number.isFinite(monthlyCapacityRaw) && monthlyCapacityRaw > 0 ? monthlyCapacityRaw : undefined,
    riskLevel: ["low", "medium", "high"].includes(risk) ? risk : "medium"
  };
}

function coerceInstruments(value: unknown): PlanInstrument[] {
  if (!Array.isArray(value)) return [];
  const out: PlanInstrument[] = [];
  for (const item of value) {
    const record = item as Record<string, unknown>;
    const kind = String(record.kind || "");
    if (!["stock", "mutual_fund", "card"].includes(kind)) continue;
    const name = String(record.name || "").slice(0, 90).trim();
    if (!name) continue;
    out.push({
      kind: kind as PlanInstrument["kind"],
      name,
      detail: String(record.detail || "").slice(0, 200).trim(),
      tag: record.tag ? String(record.tag).slice(0, 40).trim() : undefined
    });
    if (out.length >= 8) break;
  }
  return out;
}

export async function POST(request: NextRequest) {
  if (!rateLimit(`travel-plan:${clientIp(request)}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const input = sanitize(body);
  if (!input) {
    return NextResponse.json({ error: "Please enter a destination, travel date and a valid budget." }, { status: 400 });
  }

  const base = buildCalculatorPlan(input);

  if (!openai) {
    return NextResponse.json({ plan: base });
  }

  const prompt =
    `You are CityMitra's travel-funding strategist for Indian users (INR). Using the numbers below, write a concise, ` +
    `non-confusing plan that shows how disciplined investing + smart card offers can fund a trip. India context only. ` +
    `Recommend well-known, broadly-available instruments; prefer index funds for short horizons. Name real, well-known ` +
    `Indian options but clearly keep them illustrative. Do NOT invent time-bound "current offers" — describe typical offer ` +
    `types. No guaranteed returns. Keep it tight so the user is never confused.\n\n` +
    `Inputs: destination=${input.destination}, monthsToGo=${base.monthsToGo}, riskLevel=${input.riskLevel}, ` +
    `targetBudget=₹${input.targetBudget}, recommendedMonthly=₹${base.recommendedMonthly}, ` +
    `projectedValue=₹${base.projectedValue}, investmentGains=₹${base.investmentGains}, cardSavings=₹${base.cardSavings}, ` +
    `freeTravelPct=${base.freeTravelPct}%, equity/debt=${base.allocation.equityPct}/${base.allocation.debtPct}.\n\n` +
    `Return ONLY JSON: {"summary": string (<=420 chars, mention the freeTravelPct framing), ` +
    `"strategy": string[] (4-6 short imperative steps), ` +
    `"instruments": [{"kind":"stock"|"mutual_fund"|"card","name":string,"detail":string(<=140 chars),"tag":string}] ` +
    `(6-8 items: a mix of mutual funds, a couple of trending large-cap stocks, and 2 travel/cashback cards)}.`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 22_000);
    const completion = await openai.chat.completions.create(
      {
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      },
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    const raw = completion.choices?.[0]?.message?.content;
    if (raw) {
      const parsed = JSON.parse(raw) as { summary?: unknown; strategy?: unknown; instruments?: unknown };
      const instruments = coerceInstruments(parsed.instruments);
      const strategy = Array.isArray(parsed.strategy)
        ? parsed.strategy.map((step) => String(step).slice(0, 200).trim()).filter(Boolean).slice(0, 6)
        : [];
      return NextResponse.json({
        plan: {
          ...base,
          summary: typeof parsed.summary === "string" && parsed.summary.trim() ? parsed.summary.trim().slice(0, 500) : base.summary,
          strategy: strategy.length ? strategy : base.strategy,
          instruments: instruments.length ? instruments : base.instruments,
          source: "ai"
        }
      });
    }
  } catch (error) {
    console.error("travel-plan generation failed", error);
  }

  return NextResponse.json({ plan: base });
}
