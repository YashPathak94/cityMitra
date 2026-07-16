export type RiskLevel = "low" | "medium" | "high";

export type TransportMode = "flight" | "train" | "bus" | "car" | "bike";

export type TravelPlanInput = {
  destination: string;
  origin?: string;
  travelers?: number;
  nights?: number;
  travelDateISO: string;
  targetBudget: number;
  monthlyCapacity?: number;
  riskLevel: RiskLevel;
  modes?: TransportMode[];
  cards?: string[];
  vibe?: string;
  stay?: string;
  moments?: string[];
};

export type PlanInstrument = {
  kind: "stock" | "mutual_fund" | "card";
  name: string;
  detail: string;
  tag?: string;
};

export type TransportOption = {
  mode: TransportMode;
  priceFrom: number;
  priceTo?: number;
  duration: string;
  note: string;
  /** Where to book/compare — e.g. "MakeMyTrip · Goibibo · Skyscanner". */
  platform?: string;
  /** Typical operators on the route — e.g. "IndiGo · Akasa Air". */
  operator?: string;
  best?: boolean;
};

export type HotelTier = {
  tier: string;
  nightlyFrom: number;
  platform: string;
  note: string;
  /** Named example properties — e.g. "Ginger Panjim · Zostel Goa". */
  example?: string;
  /** Standing platform/card offer for this tier — e.g. "Goibibo GOSTAYS ~10% off". */
  offer?: string;
};

export type RentalOption = {
  type: "car" | "bike";
  vendor: string;
  perDayFrom: number;
  perDayTo?: number;
  note: string;
};

export type CardAdvice = {
  card: string;
  useFor: string;
  benefit: string;
  /** The issuer portal that carries the offer — e.g. "HDFC SmartBuy · 5X". */
  offer?: string;
};

export type FareOffer = {
  option: string;
  offer: string;
  saving: string;
  /** Numeric estimate of the saving in INR, for stacking math. */
  saveAmount?: number;
  /** Published end date of the offer, or "check at checkout". */
  validTill?: string;
};

/** One bookable option in the compare stack (2-3 per mode + hotels). */
export type CompareOption = {
  mode: TransportMode | "hotel";
  name: string;
  tag: string;
  line1: string;
  line2: string;
  line3: string;
  price: number;
  oldPrice: number;
  save: number;
};

/** Rich fare intelligence for the primary route — the "is this a good price?" brief. */
export type FareIntel = {
  headline: string;
  /** Concrete flight spotlight — e.g. { name: "IndiGo 6E 2349", timing: "10:55 Delhi → 12:20 Prayagraj", duration: "1h 25m", benchmark: "₹5,668 before add-ons" }. */
  flight?: { name: string; timing: string; duration: string; benchmark: string };
  expectedRange: string;
  targetPrice: string;
  acceptablePrice: string;
  recommendation: string[];
  offers: FareOffer[];
};

export type TravelPlan = {
  destination: string;
  monthsToGo: number;
  assumedAnnualReturnPct: number;
  recommendedMonthly: number;
  contributions: number;
  projectedValue: number;
  investmentGains: number;
  cardSavings: number;
  cardFeeEstimate: number;
  netCardRewards: number;
  outOfPocket: number;
  freeTravelPct: number;
  allocation: { equityPct: number; debtPct: number };
  summary: string;
  strategy: string[];
  instruments: PlanInstrument[];
  transport: TransportOption[];
  hotels: HotelTier[];
  rentals: RentalOption[];
  cardAdvice: CardAdvice[];
  deals: string[];
  compare?: CompareOption[];
  fareIntel?: FareIntel;
  vibeInsight?: string;
  disclaimer: string;
  source: "ai" | "calculator";
};

const RETURN_BY_RISK: Record<RiskLevel, number> = { low: 6, medium: 10, high: 13 };
const EQUITY_BY_RISK: Record<RiskLevel, number> = { low: 25, medium: 55, high: 80 };

const DISCLAIMER =
  "Educational planning only — not investment advice. Returns are illustrative assumptions, not guarantees; markets can fall. " +
  "Verify card offers with the issuer and consult a SEBI-registered advisor before investing.";

export function monthsToTravel(travelDateISO: string, from = new Date()): number {
  const target = new Date(travelDateISO);
  if (Number.isNaN(target.getTime())) return 1;
  const days = (target.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(1, Math.round(days / 30.44));
}

// Future value of a monthly SIP (annuity due) at a given annual return.
export function sipFutureValue(monthly: number, annualPct: number, months: number): number {
  const r = annualPct / 100 / 12;
  if (r === 0) return monthly * months;
  return monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
}

// Monthly SIP needed to reach a target in N months at a given annual return.
export function requiredMonthly(target: number, annualPct: number, months: number): number {
  if (months <= 0) return target;
  const r = annualPct / 100 / 12;
  if (r === 0) return target / months;
  const factor = ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  return target / factor;
}

const inr = (value: number) => Math.max(0, Math.round(value));

const fallbackInstruments = (risk: RiskLevel): PlanInstrument[] => {
  const equity: PlanInstrument[] = [
    { kind: "mutual_fund", name: "Nifty 50 Index Fund", detail: "Low-cost, diversified large-cap exposure for the growth portion.", tag: "Index · Low cost" },
    { kind: "mutual_fund", name: "Nifty Next 50 Index Fund", detail: "Slightly higher growth potential than Nifty 50, still diversified.", tag: "Index · Growth" },
    { kind: "mutual_fund", name: "Flexi-cap Fund", detail: "Actively managed across market caps — pick a 5★-rated, low-expense one.", tag: "Flexi · Active" },
    { kind: "mutual_fund", name: "Sensex Index Fund", detail: "30 blue-chips, ultra-low cost — a simple second index leg.", tag: "Index · Core" },
    { kind: "stock", name: "HDFC Bank", detail: "Illustrative large-cap example — prefer index funds for short horizons.", tag: "Large cap" },
    { kind: "stock", name: "TCS", detail: "Illustrative IT large-cap example with steady dividends.", tag: "Large cap" },
    { kind: "stock", name: "Reliance Industries", detail: "Illustrative diversified conglomerate example.", tag: "Large cap" }
  ];
  const debt: PlanInstrument[] = [
    { kind: "mutual_fund", name: "Liquid / Ultra-short Debt Fund", detail: "Parks money safely for near-term goals with steadier returns than equity.", tag: "Debt · Stable" }
  ];
  const cards: PlanInstrument[] = [
    { kind: "card", name: "Co-branded travel card (air-mile)", detail: "Typically 2–5% value back on flights & hotels; waived fuel surcharge.", tag: "~2–5% travel value" },
    { kind: "card", name: "Flat-cashback card", detail: "Steady cashback on everyday spends you redirect into your travel SIP.", tag: "~1.5–2% cashback" }
  ];
  if (risk === "low") return [...debt, equity[0], equity[1], equity[3], ...cards, equity[2], equity[4], equity[5]].slice(0, 10);
  if (risk === "high") return [...equity, ...debt, ...cards].slice(0, 10);
  return [equity[0], equity[1], equity[2], equity[3], ...debt, equity[4], equity[5], equity[6], ...cards].slice(0, 10);
};

const TRANSPORT_BASE: Record<
  TransportMode,
  { priceFrom: number; priceTo: number; duration: string; note: string; platform: string; operator: string }
> = {
  flight: {
    priceFrom: 3500,
    priceTo: 7200,
    duration: "1–3 hrs",
    note: "Fastest; book 3–6 weeks early for the lowest fares.",
    platform: "MakeMyTrip · Goibibo · Skyscanner",
    operator: "IndiGo · Air India Express · Akasa Air"
  },
  train: {
    priceFrom: 600,
    priceTo: 2400,
    duration: "6–18 hrs",
    note: "Best value; book the moment the IRCTC window opens.",
    platform: "IRCTC · ixigo · ConfirmTkt",
    operator: "Superfast / AC Express"
  },
  bus: {
    priceFrom: 500,
    priceTo: 1600,
    duration: "8–20 hrs",
    note: "Cheapest AC option; sleeper coaches for overnight legs.",
    platform: "RedBus · AbhiBus",
    operator: "VRL · Orange · state RTC Volvos"
  },
  car: {
    priceFrom: 2500,
    priceTo: 4500,
    duration: "Flexible",
    note: "Self-drive rental per day — factor fuel + tolls + rest stops.",
    platform: "Zoomcar · Savaari · Revv",
    operator: "Self-drive hatchback / SUV"
  },
  bike: {
    priceFrom: 600,
    priceTo: 1400,
    duration: "Longest",
    note: "Rental per day; cheapest on fuel and a real adventure.",
    platform: "Royal Brothers · Onn Bikes",
    operator: "Classic 350 / Activa class"
  }
};

function buildTransport(modes?: TransportMode[]): TransportOption[] {
  const chosen = modes && modes.length ? modes : (["flight", "train", "bus", "car", "bike"] as TransportMode[]);
  const options = chosen.map((mode) => ({ mode, ...TRANSPORT_BASE[mode] }));
  // mark the cheapest as best value
  let bestIndex = 0;
  options.forEach((option, index) => {
    if (option.priceFrom < options[bestIndex].priceFrom) bestIndex = index;
  });
  return options.map((option, index) => ({ ...option, best: index === bestIndex }));
}

function buildHotels(): HotelTier[] {
  return [
    {
      tier: "Smart budget",
      nightlyFrom: 1200,
      platform: "Goibibo · OYO",
      note: "Clean, central stays for short trips.",
      example: "e.g. Zostel · FabHotel · Ginger"
    },
    {
      tier: "Comfort 3–4★",
      nightlyFrom: 3000,
      platform: "MakeMyTrip · Booking.com",
      note: "Best balance of price, location and reviews.",
      example: "e.g. Lemon Tree · ibis · Royal Orchid"
    },
    {
      tier: "Premium 5★",
      nightlyFrom: 7000,
      platform: "Booking.com · Agoda",
      note: "Splurge nights — pay with a hotel-rewards card.",
      example: "e.g. Taj · Marriott · Radisson Blu"
    }
  ];
}

// Fallback compare stack — instant, plausible options per mode so the page
// is useful before (or without) the AI research pass. Prices scale with the
// party size / nights; the AI pass replaces these with route-specific rows.
export function buildCompareOptions(input: { travelers?: number; nights?: number; modes?: TransportMode[] }): CompareOption[] {
  const travelers = Math.max(1, input.travelers || 2);
  const nights = Math.max(1, input.nights || 4);
  const chosen = input.modes && input.modes.length ? input.modes : (["flight", "train"] as TransportMode[]);
  const out: CompareOption[] = [];

  if (chosen.includes("flight")) {
    const base = 3800 * travelers;
    out.push(
      { mode: "flight", name: "IndiGo · direct", tag: "🔥 Best value", line1: "Morning departure", line2: "Direct · cabin 7kg + 15kg", line3: "Web check-in free", price: Math.round(base * 1.18), oldPrice: Math.round(base * 1.34), save: Math.round(base * 0.16) },
      { mode: "flight", name: "Air India · direct", tag: "💨 Fastest", line1: "Midday departure", line2: "Direct · 20kg baggage", line3: "Meal included", price: Math.round(base * 1.26), oldPrice: Math.round(base * 1.4), save: Math.round(base * 0.14) },
      { mode: "flight", name: "Air India Express", tag: "🪙 Cheapest", line1: "Evening departure", line2: "Direct · 15kg baggage", line3: "Paid seats", price: Math.round(base * 1.08), oldPrice: Math.round(base * 1.24), save: Math.round(base * 0.16) },
      { mode: "flight", name: "Akasa Air", tag: "🌱 New fleet", line1: "Early morning", line2: "Direct · 15kg baggage", line3: "Café menu onboard", price: Math.round(base * 1.14), oldPrice: Math.round(base * 1.28), save: Math.round(base * 0.14) },
      { mode: "flight", name: "SpiceJet · 1 stop", tag: "🧳 Flexi fare", line1: "Afternoon departure", line2: "1 stop · 15kg baggage", line3: "Free date change", price: Math.round(base * 1.02), oldPrice: Math.round(base * 1.2), save: Math.round(base * 0.18) }
    );
  }
  if (chosen.includes("train")) {
    const base = 1400 * travelers;
    out.push(
      { mode: "train", name: "Rajdhani-class · 2A", tag: "⭐ Reliable", line1: "Overnight", line2: "Meals included", line3: "Book on IRCTC day 1", price: Math.round(base * 1.5), oldPrice: Math.round(base * 1.66), save: Math.round(base * 0.16) },
      { mode: "train", name: "Superfast Express · 3A", tag: "🪙 Value", line1: "Overnight", line2: "AC 3-tier", line3: "ConfirmTkt predicts seats", price: base, oldPrice: Math.round(base * 1.15), save: Math.round(base * 0.15) },
      { mode: "train", name: "Duronto-class · 2A", tag: "💨 Fast rail", line1: "Overnight", line2: "Fewer stops · meals", line3: "Bedding included", price: Math.round(base * 1.35), oldPrice: Math.round(base * 1.5), save: Math.round(base * 0.15) },
      { mode: "train", name: "Vande Bharat / Chair car", tag: "✨ Day train", line1: "Daytime", line2: "CC · on-board catering", line3: "Fastest day option", price: Math.round(base * 1.2), oldPrice: Math.round(base * 1.32), save: Math.round(base * 0.12) }
    );
  }
  if (chosen.includes("bus")) {
    const base = 1100 * travelers;
    out.push(
      { mode: "bus", name: "Volvo AC Sleeper", tag: "🪙 Value", line1: "Overnight", line2: "AC sleeper · 1 stop", line3: "USB + blanket", price: base, oldPrice: Math.round(base * 1.2), save: Math.round(base * 0.2) },
      { mode: "bus", name: "Premium Sleeper", tag: "😴 Comfort", line1: "Overnight", line2: "Private berth", line3: "Live tracking", price: Math.round(base * 1.25), oldPrice: Math.round(base * 1.44), save: Math.round(base * 0.19) },
      { mode: "bus", name: "State RTC Volvo", tag: "✅ Reliable", line1: "Overnight", line2: "AC seater-sleeper", line3: "Official counters", price: Math.round(base * 0.9), oldPrice: Math.round(base * 1.02), save: Math.round(base * 0.12) },
      { mode: "bus", name: "Electric AC coach", tag: "🌱 Eco pick", line1: "Overnight", line2: "Quiet e-coach", line3: "USB + wifi", price: Math.round(base * 1.1), oldPrice: Math.round(base * 1.26), save: Math.round(base * 0.16) }
    );
  }
  if (chosen.includes("car")) {
    const perDay = 2800;
    const days = Math.max(1, nights);
    out.push(
      { mode: "car", name: "Self-drive hatchback", tag: "⚡ Flexible", line1: `${days} day${days > 1 ? "s" : ""}`, line2: "Zoomcar / Revv class", line3: "Unlimited-km plans", price: perDay * days, oldPrice: Math.round(perDay * days * 1.18), save: Math.round(perDay * days * 0.18) },
      { mode: "car", name: "Chauffeur cab · airport + local", tag: "✅ Verified", line1: "Sedan", line2: "45 km/day included", line3: "Tolls extra", price: Math.round(1600 * days), oldPrice: Math.round(1950 * days), save: Math.round(350 * days) }
    );
  }
  if (chosen.includes("bike")) {
    const days = Math.max(1, nights);
    out.push(
      { mode: "bike", name: "Scooter rental", tag: "🔥 Most booked", line1: `${days} day${days > 1 ? "s" : ""}`, line2: "Royal Brothers / Onn class", line3: "2 helmets included", price: 650 * days, oldPrice: Math.round(650 * days * 1.25), save: Math.round(650 * days * 0.25) },
      { mode: "bike", name: "Classic 350 rental", tag: "🏍 Tourer", line1: `${days} day${days > 1 ? "s" : ""}`, line2: "Highway-ready", line3: "Carry DL + deposit", price: 1250 * days, oldPrice: Math.round(1250 * days * 1.16), save: Math.round(1250 * days * 0.16) }
    );
  }
  const rooms = Math.max(1, Math.ceil(travelers / 2));
  out.push(
    { mode: "hotel", name: "Boutique stay · 4.5★ rated", tag: "✨ Gen-Z pick", line1: `${nights} night${nights > 1 ? "s" : ""} · ${rooms} room${rooms > 1 ? "s" : ""}`, line2: "Breakfast included", line3: "Free cancellation", price: 4200 * nights * rooms, oldPrice: Math.round(4200 * nights * rooms * 1.17), save: Math.round(4200 * nights * rooms * 0.17) },
    { mode: "hotel", name: "Comfort 3–4★ chain", tag: "⚖️ Balanced", line1: `${nights} night${nights > 1 ? "s" : ""} · ${rooms} room${rooms > 1 ? "s" : ""}`, line2: "Central location", line3: "Pay at hotel", price: 3000 * nights * rooms, oldPrice: Math.round(3000 * nights * rooms * 1.16), save: Math.round(3000 * nights * rooms * 0.16) },
    { mode: "hotel", name: "Smart budget / hostel-core", tag: "🪙 Cheapest", line1: `${nights} night${nights > 1 ? "s" : ""}`, line2: "Clean + social", line3: "Lockers & wifi", price: 1400 * nights * rooms, oldPrice: Math.round(1400 * nights * rooms * 1.2), save: Math.round(1400 * nights * rooms * 0.2) }
  );
  return out;
}

function buildRentals(modes?: TransportMode[]): RentalOption[] {
  const chosen = modes && modes.length ? modes : [];
  const out: RentalOption[] = [];
  if (chosen.includes("car")) {
    out.push({
      type: "car",
      vendor: "Zoomcar · Savaari · Revv",
      perDayFrom: 2500,
      perDayTo: 4500,
      note: "Self-drive hatchback to SUV, unlimited-km plans available; keep DL + ID handy."
    });
  }
  if (chosen.includes("bike")) {
    out.push({
      type: "bike",
      vendor: "Royal Brothers · Onn Bikes",
      perDayFrom: 600,
      perDayTo: 1400,
      note: "Scooters from ~₹600/day, Classic 350 class ~₹1,200/day; helmet included, carry DL."
    });
  }
  return out;
}

function buildCardAdvice(cards?: string[]): CardAdvice[] {
  const list = (cards || []).map((card) => card.trim()).filter(Boolean).slice(0, 4);
  if (list.length === 0) {
    return [
      { card: "A co-branded travel card", useFor: "Flights & hotels", benefit: "Earn air-miles / 2–5% value back on travel spends." },
      { card: "A flat-cashback card", useFor: "Everyday spends", benefit: "Sweep 1.5–2% cashback into your travel SIP." }
    ];
  }
  return list.map((card, index) => ({
    card,
    useFor: index === 0 ? "Flights & big bookings" : index === 1 ? "Hotels & dining" : "Everyday spends",
    benefit:
      index === 0
        ? "Put flight bookings here to maximise miles / accelerated rewards."
        : index === 1
          ? "Use for hotels & dining to capture category bonuses and offers."
          : "Route daily spends here and redirect the cashback into your SIP."
  }));
}

const DEFAULT_DEALS = [
  "Book flights 3–6 weeks ahead and fly mid-week for the lowest fares.",
  "Bundle hotel + flight as a package for an instant combined discount.",
  "Pay via your card's offers portal for extra cashback on travel partners.",
  "Set a fare alert now so you book the dip, not the spike."
];

export function buildCalculatorPlan(input: TravelPlanInput): TravelPlan {
  const months = monthsToTravel(input.travelDateISO);
  const annual = RETURN_BY_RISK[input.riskLevel];
  const budget = Math.max(0, input.targetBudget || 0);

  const needed = requiredMonthly(budget, annual, months);
  const monthly = input.monthlyCapacity && input.monthlyCapacity > 0 ? input.monthlyCapacity : needed;

  const projectedValue = inr(sipFutureValue(monthly, annual, months));
  const contributions = inr(monthly * months);
  const investmentGains = inr(projectedValue - contributions);
  const cardSavings = inr(budget * 0.04);
  const cardFeeEstimate = input.cards && input.cards.length ? 2000 : 0;
  const netCardRewards = Math.max(0, cardSavings - cardFeeEstimate);
  const outOfPocket = inr(budget - investmentGains - netCardRewards);
  const freeTravelPct = budget > 0 ? Math.min(100, Math.round(((investmentGains + netCardRewards) / budget) * 100)) : 0;

  const equityPct = EQUITY_BY_RISK[input.riskLevel];
  const routeLabel = input.origin ? `${input.origin} → ${input.destination}` : input.destination;
  const partyLabel = input.travelers && input.travelers > 1 ? ` for ${input.travelers} travellers` : "";

  return {
    destination: input.destination,
    monthsToGo: months,
    assumedAnnualReturnPct: annual,
    recommendedMonthly: inr(monthly),
    contributions,
    projectedValue,
    investmentGains,
    cardSavings,
    cardFeeEstimate,
    netCardRewards,
    outOfPocket,
    freeTravelPct,
    allocation: { equityPct, debtPct: 100 - equityPct },
    summary:
      `Invest about ₹${inr(monthly).toLocaleString("en-IN")}/month for ${months} month${months > 1 ? "s" : ""} at an illustrative ` +
      `${annual}% p.a. By your travel date your money could grow to ~₹${projectedValue.toLocaleString("en-IN")}, with ` +
      `~₹${investmentGains.toLocaleString("en-IN")} of that being potential growth (illustrative, not guaranteed). Add ~₹${netCardRewards.toLocaleString("en-IN")} in estimated card rewards after annual fees ` +
      `and you could offset roughly ${freeTravelPct}% of your ${routeLabel} trip${partyLabel} cost through planned saving, estimated rewards and verified discounts.`,
    strategy: [
      `Open an automated monthly SIP of ₹${inr(monthly).toLocaleString("en-IN")} the day after payday so it never gets skipped.`,
      `Split it ${equityPct}% growth / ${100 - equityPct}% stable to match a ${input.riskLevel}-risk, ${months}-month horizon.`,
      "Route everyday spends through a rewards card and sweep the cashback into the same SIP.",
      months <= 12
        ? "With under a year to go, lean on stable debt funds — equity is volatile over short windows."
        : "With a longer runway, let the equity portion compound and review allocation every quarter.",
      "One month before travel, move the corpus to a liquid fund so a market dip can't derail the trip."
    ],
    instruments: fallbackInstruments(input.riskLevel),
    transport: buildTransport(input.modes),
    hotels: buildHotels(),
    rentals: buildRentals(input.modes),
    compare: buildCompareOptions(input),
    cardAdvice: buildCardAdvice(input.cards),
    deals: DEFAULT_DEALS,
    disclaimer: DISCLAIMER,
    source: "calculator"
  };
}

export { DISCLAIMER };
