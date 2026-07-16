import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  buildCalculatorPlan,
  CardAdvice,
  CompareOption,
  FareIntel,
  HotelTier,
  PlanInstrument,
  RentalOption,
  RiskLevel,
  TransportMode,
  TransportOption,
  TravelPlanInput
} from "@/lib/travel-plan";

export const runtime = "nodejs";
// The research call can take well over Vercel's 10s default — without this
// the function is killed mid-generation and users only ever see sample data.
export const maxDuration = 60;

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
  const moments = Array.isArray(body.moments)
    ? body.moments.map((m) => String(m).slice(0, 40).trim()).filter(Boolean).slice(0, 6)
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
    cards: cards && cards.length ? cards : undefined,
    vibe: String(body.vibe || "").slice(0, 40).trim() || undefined,
    stay: String(body.stay || "").slice(0, 30).trim() || undefined,
    moments: moments && moments.length ? moments : undefined
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
      priceTo: record.priceTo ? num(record.priceTo) : undefined,
      duration: String(record.duration || "").slice(0, 30).trim() || "—",
      note: String(record.note || "").slice(0, 140).trim(),
      platform: record.platform ? String(record.platform).slice(0, 70).trim() : undefined,
      operator: record.operator ? String(record.operator).slice(0, 70).trim() : undefined,
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
      platform: String(record.platform || "").slice(0, 60).trim(),
      note: String(record.note || "").slice(0, 140).trim(),
      example: record.example ? String(record.example).slice(0, 90).trim() : undefined,
      offer: record.offer ? String(record.offer).slice(0, 90).trim() : undefined
    });
    if (out.length >= 4) break;
  }
  return out;
}

function coerceRentals(value: unknown): RentalOption[] {
  if (!Array.isArray(value)) return [];
  const out: RentalOption[] = [];
  for (const item of value) {
    const record = item as Record<string, unknown>;
    const type = String(record.type || "");
    if (type !== "car" && type !== "bike") continue;
    const vendor = String(record.vendor || "").slice(0, 70).trim();
    if (!vendor) continue;
    out.push({
      type,
      vendor,
      perDayFrom: num(record.perDayFrom),
      perDayTo: record.perDayTo ? num(record.perDayTo) : undefined,
      note: String(record.note || "").slice(0, 140).trim()
    });
    if (out.length >= 2) break;
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
      benefit: String(record.benefit || "").slice(0, 160).trim(),
      offer: record.offer ? String(record.offer).slice(0, 90).trim() : undefined
    });
    if (out.length >= 5) break;
  }
  return out;
}

function coerceStrings(value: unknown, max: number): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).slice(0, 180).trim()).filter(Boolean).slice(0, max);
}

const COMPARE_MODES = [...TRANSPORT_MODES, "hotel"];

function coerceCompare(value: unknown): CompareOption[] {
  if (!Array.isArray(value)) return [];
  const out: CompareOption[] = [];
  for (const item of value) {
    const record = item as Record<string, unknown>;
    const mode = String(record.mode || "");
    if (!COMPARE_MODES.includes(mode)) continue;
    const name = String(record.name || "").slice(0, 70).trim();
    const price = num(record.price);
    if (!name || !price) continue;
    const oldPrice = Math.max(price, num(record.oldPrice, price));
    out.push({
      mode: mode as CompareOption["mode"],
      name,
      tag: String(record.tag || "").slice(0, 30).trim() || "Option",
      line1: String(record.line1 || "").slice(0, 60).trim(),
      line2: String(record.line2 || "").slice(0, 60).trim(),
      line3: String(record.line3 || "").slice(0, 60).trim(),
      price,
      oldPrice,
      save: Math.min(oldPrice - price + num(record.save, 0), oldPrice) || Math.max(0, oldPrice - price)
    });
    if (out.length >= 20) break;
  }
  return out;
}

function coerceFareIntel(value: unknown): FareIntel | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  const headline = String(record.headline || "").slice(0, 220).trim();
  if (!headline) return undefined;
  const offers = Array.isArray(record.offers)
    ? (record.offers as Array<Record<string, unknown>>)
        .map((o) => ({
          option: String(o.option || "").slice(0, 70).trim(),
          offer: String(o.offer || "").slice(0, 140).trim(),
          saving: String(o.saving || "").slice(0, 50).trim(),
          saveAmount: o.saveAmount ? num(o.saveAmount) : undefined,
          validTill: o.validTill ? String(o.validTill).slice(0, 60).trim() : undefined
        }))
        .filter((o) => o.option && o.offer)
        .slice(0, 6)
    : [];
  const flightRecord = record.flight as Record<string, unknown> | undefined;
  const flight =
    flightRecord && String(flightRecord.name || "").trim()
      ? {
          name: String(flightRecord.name || "").slice(0, 60).trim(),
          timing: String(flightRecord.timing || "").slice(0, 90).trim(),
          duration: String(flightRecord.duration || "").slice(0, 30).trim(),
          benchmark: String(flightRecord.benchmark || "").slice(0, 80).trim()
        }
      : undefined;
  return {
    headline,
    flight,
    expectedRange: String(record.expectedRange || "").slice(0, 60).trim(),
    targetPrice: String(record.targetPrice || "").slice(0, 60).trim(),
    acceptablePrice: String(record.acceptablePrice || "").slice(0, 60).trim(),
    recommendation: coerceStrings(record.recommendation, 4),
    offers
  };
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

  const rentalModes = (input.modes || []).filter((mode) => mode === "car" || mode === "bike");
  const prompt =
    `You are CityMitra's travel-funding strategist for Indian users (INR). Audience is Gen-Z — keep every line ` +
    `punchy, friendly and jargon-free, but the numbers must feel like real quotes. Using the inputs below, produce a ` +
    `plan where disciplined investing + smart transport/hotel choices + card offers fund the trip. India context only.\n\n` +
    `Realism rules: price the ACTUAL ${input.origin || "metro origin"} → ${input.destination} route for the travel ` +
    `month of ${input.travelDateISO}. Flights: give the typical booking-platform range (MakeMyTrip / Goibibo / ` +
    `Skyscanner) and name the airlines that actually fly it. Trains: IRCTC class + fare. Bus: RedBus-style operator + ` +
    `fare. Car/bike (only if requested): per-day SELF-DRIVE RENTAL pricing from Zoomcar/Savaari/Revv (car) or Royal ` +
    `Brothers/Onn Bikes (bike). Hotels: name 2-3 real example properties per tier in ${input.destination} with typical ` +
    `nightly rates for ${input.nights || 3} night(s). Cards: describe each card's REAL standing reward structure and ` +
    `issuer portal (e.g. HDFC SmartBuy 5X, Axis Travel EDGE, Amex offers) — no invented expiry-dated promos. Prefer ` +
    `index funds for short horizons; name real well-known Indian options but keep them illustrative. No guaranteed returns.\n\n` +
    `Inputs: from=${input.origin || "user's city"}, to=${input.destination}, travellers=${input.travelers || 1}, ` +
    `nights=${input.nights || 3}, travelDate=${input.travelDateISO}, monthsToGo=${base.monthsToGo}, ` +
    `riskLevel=${input.riskLevel}, tripVibe=${input.vibe || "any"}, stayStyle=${input.stay || "comfort"}, ` +
    `mustHaves=${(input.moments || []).join("/") || "none"}, targetBudget=₹${input.targetBudget}, ` +
    `recommendedMonthly=₹${base.recommendedMonthly}, projectedValue=₹${base.projectedValue}, ` +
    `investmentGains=₹${base.investmentGains}, cardSavings=₹${base.cardSavings}, freeTravelPct=${base.freeTravelPct}%, ` +
    `equity/debt=${base.allocation.equityPct}/${base.allocation.debtPct}, ` +
    `transportModes=${(input.modes || TRANSPORT_MODES).join(",")}, ` +
    `userCards=${(input.cards || []).join(",") || "none provided"}.\n\n` +
    `${input.vibe === "Spiritual" ? "The vibe is Spiritual — lean into temple towns, darshan timing, modest dress notes and early-morning slots in the tips.\n\n" : ""}` +
    `Return ONLY JSON: {` +
    `"summary": string (<=420 chars, mention the freeTravelPct framing, Gen-Z friendly), ` +
    `"strategy": string[] (4-6 short imperative steps), ` +
    `"instruments": [{"kind":"stock"|"mutual_fund"|"card","name":string,"detail":string(<=140),"tag":string}] (6-8: mutual funds + 2 trending large-cap stocks + 2 cards), ` +
    `"transport": [{"mode":"flight"|"train"|"bus"|"car"|"bike","priceFrom":number(INR),"priceTo":number(INR),"duration":string,"operator":string(airlines/operators),"platform":string(booking sites),"note":string(<=120),"best":boolean}] (one per requested mode; car/bike priced per rental day; mark the genuinely best one true), ` +
    `"compare": [{"mode":"flight"|"train"|"bus"|"car"|"bike"|"hotel","name":string(operator + flight/train number or property name),"tag":string(short Gen-Z label with emoji, e.g. "\u{1F525} Best value"/"\u{1F4A8} Fastest"/"\u{1FA99} Cheapest"),"line1":string(schedule or stay length),"line2":string(key detail),"line3":string(what's included),"price":number(TOTAL INR for ${input.travelers || 1} traveller(s)${input.nights ? ` / ${input.nights} nights for hotels` : ""}, AFTER the strongest common offer),"oldPrice":number(sticker price before offers),"save":number(INR saved)}] (2-3 DIFFERENT real options per requested transport mode + exactly 3 hotel options at different price points — this is the main comparison users see, make every row concrete and bookable-sounding), ` +
    `"hotels": [{"tier":string,"nightlyFrom":number(INR),"platform":string,"example":string(2-3 named properties in ${input.destination}),"offer":string(the standing platform/card hotel offer for this tier, e.g. GOSTAYS-style code or card discount, with cap),"note":string(<=120)}] (3 tiers budget/comfort/premium), ` +
    `${rentalModes.length ? `"rentals": [{"type":"car"|"bike","vendor":string,"perDayFrom":number(INR),"perDayTo":number(INR),"note":string(<=120)}] (one per requested rental mode: ${rentalModes.join(",")}), ` : ""}` +
    `"cardAdvice": [{"card":string,"useFor":string,"offer":string(real standing reward structure + portal),"benefit":string(<=140, written like texting a money-smart friend — Gen-Z, zero banker-speak)}] (if userCards given, advise per card; else suggest 2 ideal card types), ` +
    `"fareIntel": {"headline":string(<=200: the single best concrete option for the primary mode — e.g. typical airline + departure window + duration for this route),"expectedRange":string(e.g. "₹5,300–₹6,500"),"targetPrice":string("good deal below X after offers"),"acceptablePrice":string,"recommendation":string[](3-4 ordered booking moves: which site first, which offer to apply, what to compare, what to avoid),"offers":[{"option":string(platform + payment method),"offer":string(the standing offer pattern, incl. code ONLY if it is a stable long-running one),"saving":string(estimated ₹ saving on this fare)}] (4-6 rows)}, ` +
    `"vibeInsight": string (<=260 chars: read the ${input.vibe || "trip"} vibe like a friend — what to prioritise in ${input.destination}, best time of day, one insider move${input.vibe === "Spiritual" ? ", darshan/aarti slots" : ""}), ` +
    `"deals": string[] (4-5 concrete money-saving booking tips${input.vibe === "Spiritual" ? ", incl. darshan/aarti timing" : ""})}.`;

  // gpt-4o-mini leads: this is a large structured-JSON retrieval task and
  // 4o-mini finishes it in ~5-12s, while gpt-5-mini (even at minimal
  // reasoning effort) regularly overruns any timeout that fits two attempts
  // into the 60s function window. OPENAI_MODEL still overrides the primary.
  const models = [...new Set([process.env.OPENAI_MODEL || "gpt-4o-mini", "gpt-4o-mini"])];
  for (const model of models) {
    try {
      const controller = new AbortController();
      // 28s per attempt so the fallback model still fits inside maxDuration.
      const timeout = setTimeout(() => controller.abort(), 28_000);
      const completion = await openai.chat.completions.create(
        {
          model,
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          // gpt-5 family defaults to heavy reasoning, which blows past any
          // sane API timeout on a schema this large — minimal keeps it fast
          // without hurting a mostly retrieval/formatting task.
          ...(model.startsWith("gpt-5") ? { reasoning_effort: "minimal" as const } : {})
        },
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      const raw = completion.choices?.[0]?.message?.content;
      if (!raw) continue;
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const instruments = coerceInstruments(parsed.instruments);
      const strategy = coerceStrings(parsed.strategy, 6);
      const transport = coerceTransport(parsed.transport);
      const hotels = coerceHotels(parsed.hotels);
      const rentals = coerceRentals(parsed.rentals);
      const cardAdvice = coerceCardAdvice(parsed.cardAdvice);
      const deals = coerceStrings(parsed.deals, 5);
      const compare = coerceCompare(parsed.compare);
      const fareIntel = coerceFareIntel(parsed.fareIntel);
      const vibeInsight = typeof parsed.vibeInsight === "string" ? parsed.vibeInsight.trim().slice(0, 300) : "";
      return NextResponse.json({
        plan: {
          ...base,
          compare: compare.length ? compare : base.compare,
          fareIntel,
          vibeInsight: vibeInsight || undefined,
          summary: typeof parsed.summary === "string" && parsed.summary.trim() ? parsed.summary.trim().slice(0, 500) : base.summary,
          strategy: strategy.length ? strategy : base.strategy,
          instruments: instruments.length ? instruments : base.instruments,
          transport: transport.length ? transport : base.transport,
          hotels: hotels.length ? hotels : base.hotels,
          rentals: rentals.length ? rentals : base.rentals,
          cardAdvice: cardAdvice.length ? cardAdvice : base.cardAdvice,
          deals: deals.length ? deals : base.deals,
          source: "ai"
        }
      });
    } catch (error) {
      console.error(`travel-plan generation failed (model: ${model})`, error);
    }
  }

  return NextResponse.json({ plan: base });
}
