import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  buildCalculatorPlan,
  CardAdvice,
  HotelTier,
  PlanInstrument,
  RiskLevel,
  TransportMode,
  TransportOption,
  TravelPlanInput
} from "@/lib/travel-plan";

export const runtime = "nodejs";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const TRANSPORT_MODES: TransportMode[] = ["flight", "train", "bus", "car", "bike"];

function sanitize(body: Record<string, unknown>): TravelPlanInput | null {
  const destination = String(body.destination || "").slice(0, 80).trim();
  const travelDateISO = String(body.travelDateISO || "").slice(0, 20).trim();
  const targetBudget = Number(body.targetBudget);
  const monthlyCapacityRaw = Number(body.monthlyCapacity);
  const risk = String(body.riskLevel || "medium") as RiskLevel;
  if (!destination || !travelDateISO || !Number.isFinite(targetBudget) || targetBudget <= 0) return null;
  const modes = Array.isArray(body.modes)
    ? (body.modes.map(String).filter((mode) => TRANSPORT_MODES.includes(mode as TransportMode)) as TransportMode[])
    : undefined;
  const cards = Array.isArray(body.cards)
    ? body.cards.map((card) => String(card).slice(0, 60).trim()).filter(Boolean).slice(0, 4)
    : undefined;
  const origin = String(body.origin || "").slice(0, 80).trim();
  const travelers = Math.max(1, Math.min(20, Math.round(Number(body.travelers) || 1)));
  const nights = Math.max(1, Math.min(60, Math.round(Number(body.nights) || 3)));
  return {
    destination,
    origin: origin || undefined,
    travelers,
    nights,
    travelDateISO,
    targetBudget: Math.min(targetBudget, 100000000),
    monthlyCapacity: Number.isFinite(monthlyCapacityRaw) && monthlyCapacityRaw > 0 ? monthlyCapacityRaw : undefined,
    riskLevel: ["low", "medium", "high"].includes(risk) ? risk : "medium",
    modes: modes && modes.length ? modes : undefined,
    cards: cards && cards.length ? cards : undefined
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

function num(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : fallback;
}

function coerceTransport(value: unknown): TransportOption[] {
  if (!Array.isArray(value)) return [];
  const out: TransportOption[] = [];
  for (const item of value) {
    const record = item as Record<string, unknown>;
    const mode = String(record.mode || "");
    if (!TRANSPORT_MODES.includes(mode as TransportMode)) continue;
    out.push({
      mode: mode as TransportMode,
      priceFrom: num(record.priceFrom),
      duration: String(record.duration || "").slice(0, 30).trim() || "—",
      note: String(record.note || "").slice(0, 140).trim(),
      best: Boolean(record.best)
    });
    if (out.length >= 5) break;
  }
  return out;
}

function coerceHotels(value: unknown): HotelTier[] {
  if (!Array.isArray(value)) return [];
  const out: HotelTier[] = [];
  for (const item of value) {
    const record = item as Record<string, unknown>;
    const tier = String(record.tier || "").slice(0, 40).trim();
    if (!tier) continue;
    out.push({
      tier,
      nightlyFrom: num(record.nightlyFrom),
      platform: String(record.platform || "").slice(0, 50).trim(),
      note: String(record.note || "").slice(0, 140).trim()
    });
    if (out.length >= 4) break;
  }
  return out;
}

function coerceCardAdvice(value: unknown): CardAdvice[] {
  if (!Array.isArray(value)) return [];
  const out: CardAdvice[] = [];
  for (const item of value) {
    const record = item as Record<string, unknown>;
    const card = String(record.card || "").slice(0, 60).trim();
    if (!card) continue;
    out.push({
      card,
      useFor: String(record.useFor || "").slice(0, 50).trim(),
      benefit: String(record.benefit || "").slice(0, 160).trim()
    });
    if (out.length >= 5) break;
  }
  return out;
}

function coerceStrings(value: unknown, max: number): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).slice(0, 180).trim()).filter(Boolean).slice(0, max);
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
    `non-confusing plan that shows how disciplined investing + smart transport/hotel choices + card offers fund a trip. ` +
    `India context only. Estimate realistic prices/durations from ${input.destination}'s typical origin cities. Prefer ` +
    `index funds for short horizons; name real well-known Indian options but keep them illustrative. Do NOT invent ` +
    `time-bound "current offers" — describe typical offer types. No guaranteed returns. Be tight; never confuse.\n\n` +
    `Inputs: from=${input.origin || "user's city"}, to=${input.destination}, travellers=${input.travelers || 1}, ` +
    `nights=${input.nights || 3}, monthsToGo=${base.monthsToGo}, riskLevel=${input.riskLevel}, ` +
    `targetBudget=₹${input.targetBudget}, recommendedMonthly=₹${base.recommendedMonthly}, ` +
    `projectedValue=₹${base.projectedValue}, investmentGains=₹${base.investmentGains}, cardSavings=₹${base.cardSavings}, ` +
    `freeTravelPct=${base.freeTravelPct}%, equity/debt=${base.allocation.equityPct}/${base.allocation.debtPct}, ` +
    `transportModes=${(input.modes || ["flight", "train", "bus", "car", "bike"]).join(",")}, ` +
    `userCards=${(input.cards || []).join(",") || "none provided"}.\n\n` +
    `For transport, price the actual ${input.origin || "origin"}→${input.destination} route per mode (realistic INR for ${input.travelers || 1} traveller(s)) and pick the genuinely best mode. Size hotels for ${input.nights || 3} night(s).\n\n` +
    `Return ONLY JSON: {` +
    `"summary": string (<=420 chars, mention the freeTravelPct framing), ` +
    `"strategy": string[] (4-6 short imperative steps), ` +
    `"instruments": [{"kind":"stock"|"mutual_fund"|"card","name":string,"detail":string(<=140),"tag":string}] (6-8: mutual funds + 2 trending large-cap stocks + 2 cards), ` +
    `"transport": [{"mode":"flight"|"train"|"bus"|"car"|"bike","priceFrom":number(INR),"duration":string,"note":string(<=120),"best":boolean}] (one per requested mode, mark the best value/time true), ` +
    `"hotels": [{"tier":string,"nightlyFrom":number(INR),"platform":string,"note":string(<=120)}] (3 tiers budget/comfort/premium), ` +
    `"cardAdvice": [{"card":string,"useFor":string,"benefit":string(<=140)}] (if userCards given, advise per card; else suggest 2 ideal card types), ` +
    `"deals": string[] (3-4 concrete money-saving booking tips)}.`;

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
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const instruments = coerceInstruments(parsed.instruments);
      const strategy = coerceStrings(parsed.strategy, 6);
      const transport = coerceTransport(parsed.transport);
      const hotels = coerceHotels(parsed.hotels);
      const cardAdvice = coerceCardAdvice(parsed.cardAdvice);
      const deals = coerceStrings(parsed.deals, 4);
      return NextResponse.json({
        plan: {
          ...base,
          summary: typeof parsed.summary === "string" && parsed.summary.trim() ? parsed.summary.trim().slice(0, 500) : base.summary,
          strategy: strategy.length ? strategy : base.strategy,
          instruments: instruments.length ? instruments : base.instruments,
          transport: transport.length ? transport : base.transport,
          hotels: hotels.length ? hotels : base.hotels,
          cardAdvice: cardAdvice.length ? cardAdvice : base.cardAdvice,
          deals: deals.length ? deals : base.deals,
          source: "ai"
        }
      });
    }
  } catch (error) {
    console.error("travel-plan generation failed", error);
  }

  return NextResponse.json({ plan: base });
}
