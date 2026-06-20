export type RiskLevel = "low" | "medium" | "high";

export type TravelPlanInput = {
  destination: string;
  travelDateISO: string;
  targetBudget: number;
  monthlyCapacity?: number;
  riskLevel: RiskLevel;
};

export type PlanInstrument = {
  kind: "stock" | "mutual_fund" | "card";
  name: string;
  detail: string;
  tag?: string;
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
  outOfPocket: number;
  freeTravelPct: number;
  allocation: { equityPct: number; debtPct: number };
  summary: string;
  strategy: string[];
  instruments: PlanInstrument[];
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
    { kind: "stock", name: "Blue-chip large caps (e.g. HDFC Bank, TCS, Reliance)", detail: "Illustrative examples only — prefer index funds for short horizons.", tag: "Large cap · Example" }
  ];
  const debt: PlanInstrument[] = [
    { kind: "mutual_fund", name: "Liquid / Ultra-short Debt Fund", detail: "Parks money safely for near-term goals with steadier returns than equity.", tag: "Debt · Stable" }
  ];
  const cards: PlanInstrument[] = [
    { kind: "card", name: "Co-branded travel card (air-mile)", detail: "Typically 2–5% value back on flights & hotels; waived fuel surcharge.", tag: "~2–5% travel value" },
    { kind: "card", name: "Flat-cashback card", detail: "Steady cashback on everyday spends you redirect into your travel SIP.", tag: "~1.5–2% cashback" }
  ];
  if (risk === "low") return [...debt, equity[0], ...cards];
  if (risk === "high") return [...equity, ...cards];
  return [equity[0], equity[1], ...debt, ...cards];
};

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
  const outOfPocket = inr(budget - investmentGains - cardSavings);
  const freeTravelPct = budget > 0 ? Math.min(100, Math.round(((investmentGains + cardSavings) / budget) * 100)) : 0;

  const equityPct = EQUITY_BY_RISK[input.riskLevel];

  return {
    destination: input.destination,
    monthsToGo: months,
    assumedAnnualReturnPct: annual,
    recommendedMonthly: inr(monthly),
    contributions,
    projectedValue,
    investmentGains,
    cardSavings,
    outOfPocket,
    freeTravelPct,
    allocation: { equityPct, debtPct: 100 - equityPct },
    summary:
      `Invest about ₹${inr(monthly).toLocaleString("en-IN")}/month for ${months} month${months > 1 ? "s" : ""} at an illustrative ` +
      `${annual}% p.a. By your travel date your money could grow to ~₹${projectedValue.toLocaleString("en-IN")}, with ` +
      `~₹${investmentGains.toLocaleString("en-IN")} of that being growth. Add ~₹${cardSavings.toLocaleString("en-IN")} from smart card offers ` +
      `and roughly ${freeTravelPct}% of your ${input.destination} trip is funded by returns and rewards — not your pocket.`,
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
    disclaimer: DISCLAIMER,
    source: "calculator"
  };
}

export { DISCLAIMER };
