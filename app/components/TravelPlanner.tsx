"use client";

import {
  ArrowRight,
  Bike,
  Bus,
  Calculator,
  Car,
  Check,
  Clock,
  CreditCard,
  Hotel,
  LineChart,
  PiggyBank,
  Plane,
  Plus,
  Sparkles,
  Tag,
  TrainFront,
  TrendingUp,
  Wallet,
  X
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { indiaCities } from "@/lib/india-cities";
import { buildCalculatorPlan, type RiskLevel, type TransportMode, type TravelPlan } from "@/lib/travel-plan";

const inr = (value: number) => `₹${Math.max(0, Math.round(value)).toLocaleString("en-IN")}`;
const budgetPresets = [25000, 50000, 100000, 200000, 500000];
const popularCards = [
  "HDFC Regalia",
  "HDFC Diners Club Black",
  "HDFC Millennia",
  "HDFC Tata Neu Infinity",
  "Axis Magnus",
  "Axis Atlas",
  "Axis Reserve",
  "Axis ACE",
  "Flipkart Axis",
  "SBI Card ELITE",
  "SBI Card PRIME",
  "SBI SimplyCLICK",
  "SBI Cashback",
  "SBI IRCTC",
  "ICICI Amazon Pay",
  "ICICI Sapphiro",
  "ICICI Emeralde",
  "Amex Platinum Travel",
  "Amex Membership Rewards",
  "IDFC FIRST Wealth",
  "Kotak White Reserve",
  "RBL World Safari",
  "AU LIT",
  "Standard Chartered Smart",
  "Yes Bank Marquee",
  "Federal Scapia",
  "IndusInd Legend",
  "HSBC Cashback"
];

const transportMeta: Record<TransportMode, { label: string; icon: typeof Plane }> = {
  flight: { label: "Flight", icon: Plane },
  train: { label: "Train", icon: TrainFront },
  bus: { label: "Bus", icon: Bus },
  car: { label: "Car", icon: Car },
  bike: { label: "Bike", icon: Bike }
};
const allModes = Object.keys(transportMeta) as TransportMode[];

// Illustrative per-person fare ranges for the pre-submit radar; the AI
// research pass replaces these with live, route-specific candidates.
const fareRanges: Record<TransportMode, [number, number]> = {
  flight: [4500, 7200],
  train: [1200, 2400],
  bus: [900, 1600],
  car: [3800, 6000],
  bike: [1500, 2600]
};
const fareRadarMax = 7200;

const riskOptions: Array<{ id: RiskLevel; label: string; sub: string }> = [
  { id: "low", label: "Low", sub: "safety · ~6% p.a." },
  { id: "medium", label: "Balanced", sub: "~10% p.a." },
  { id: "high", label: "Growth", sub: "~13% p.a." }
];

const kindMeta = {
  mutual_fund: { label: "Mutual funds", icon: LineChart },
  stock: { label: "Trending stocks", icon: TrendingUp },
  card: { label: "Card offers", icon: CreditCard }
} as const;

function defaultDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 6);
  return d.toISOString().slice(0, 10);
}

export default function TravelPlanner() {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("Goa");
  const [travelers, setTravelers] = useState(2);
  const [nights, setNights] = useState(4);
  const [travelDateISO, setTravelDateISO] = useState(defaultDate());
  const [targetBudget, setTargetBudget] = useState(100000);
  const [monthlyCapacity, setMonthlyCapacity] = useState("");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("medium");
  const [modes, setModes] = useState<TransportMode[]>(allModes);
  const [cards, setCards] = useState<string[]>([]);
  const [customCard, setCustomCard] = useState("");
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleMode(mode: TransportMode) {
    setModes((current) => (current.includes(mode) ? current.filter((m) => m !== mode) : [...current, mode]));
  }
  function toggleCard(card: string) {
    setCards((current) => (current.includes(card) ? current.filter((c) => c !== card) : [...current, card].slice(0, 4)));
  }
  function addCustomCard() {
    const value = customCard.trim();
    if (value && !cards.includes(value)) setCards((current) => [...current, value].slice(0, 4));
    setCustomCard("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/travel-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin,
          destination,
          travelers,
          nights,
          travelDateISO,
          targetBudget,
          monthlyCapacity: monthlyCapacity ? Number(monthlyCapacity) : undefined,
          riskLevel,
          modes,
          cards
        })
      });
      const data = (await response.json().catch(() => ({}))) as { plan?: TravelPlan; error?: string };
      if (!response.ok || !data.plan) {
        setError(data.error || "Could not build your plan. Please try again.");
        return;
      }
      setPlan(data.plan);
      setTimeout(() => document.getElementById("planResult")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch {
      setError("Could not reach the planner. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Deterministic calculator, recomputed live from the form (no AI, no network).
  const liveCalc = useMemo(
    () =>
      buildCalculatorPlan({
        origin,
        destination,
        travelers,
        nights,
        travelDateISO,
        targetBudget,
        monthlyCapacity: monthlyCapacity ? Number(monthlyCapacity) : undefined,
        riskLevel,
        modes,
        cards
      }),
    [origin, destination, travelers, nights, travelDateISO, targetBudget, monthlyCapacity, riskLevel, modes, cards]
  );

  const calc = plan ?? liveCalc;
  const transportMax = plan && plan.transport.length ? Math.max(...plan.transport.map((t) => t.priceFrom || 1), 1) : 1;
  const routeLabel = `${origin.trim() || "Your city"} → ${destination.trim() || "Goa"}`;
  const offsetPct = Math.min(100, Math.max(1, calc.freeTravelPct));

  // Month-by-month corpus climb for the mini chart (capped at 12 bars).
  const barMonths = Math.min(12, Math.max(1, calc.monthsToGo));
  const monthlyRate = calc.assumedAnnualReturnPct / 100 / 12;
  const corpusBars = Array.from({ length: barMonths }, (_, index) => {
    const k = Math.round(((index + 1) / barMonths) * calc.monthsToGo);
    const value = calc.recommendedMonthly * k * (1 + monthlyRate * (k / 2));
    return {
      month: k,
      height: Math.min(100, Math.max(6, Math.round((value / Math.max(1, targetBudget)) * 100))),
      tip: `M${k} · ${inr(value)}`
    };
  });

  const radarModes = modes.length ? modes : (["flight"] as TransportMode[]);

  return (
    <div className="travelPlan">
      <div className="travelPlanGrid" id="planResult">
        {/* ===================== FORM ===================== */}
        <form className="travelPlanForm tpCard" onSubmit={submit}>
          <b className="tpFormTitle">Build your funding plan</b>
          <datalist id="indiaCitiesList">
            {indiaCities.map((cityName) => (
              <option key={cityName} value={cityName} />
            ))}
          </datalist>

          <div className="travelPlanRow">
            <label>
              From
              <input list="indiaCitiesList" placeholder="Your city" value={origin} onChange={(event) => setOrigin(event.target.value)} />
            </label>
            <label>
              To
              <input list="indiaCitiesList" placeholder="Destination" value={destination} onChange={(event) => setDestination(event.target.value)} />
            </label>
          </div>

          <div className="travelPlanRow">
            <label>
              Travel date
              <input type="date" value={travelDateISO} min={new Date().toISOString().slice(0, 10)} onChange={(event) => setTravelDateISO(event.target.value)} />
            </label>
            <label>
              Trip budget
              <input type="number" min={1000} step={1000} value={targetBudget} onChange={(event) => setTargetBudget(Number(event.target.value))} />
            </label>
          </div>

          <div className="travelPlanRow">
            <div className="tpStepperField">
              <span className="travelPlanFieldLabel">Travellers</span>
              <div className="tpStepper">
                <button type="button" onClick={() => setTravelers((v) => Math.max(1, v - 1))} aria-label="Fewer travellers">−</button>
                <b>{travelers}</b>
                <button type="button" onClick={() => setTravelers((v) => Math.min(20, v + 1))} aria-label="More travellers">+</button>
              </div>
            </div>
            <div className="tpStepperField">
              <span className="travelPlanFieldLabel">Nights</span>
              <div className="tpStepper">
                <button type="button" onClick={() => setNights((v) => Math.max(1, v - 1))} aria-label="Fewer nights">−</button>
                <b>{nights}</b>
                <button type="button" onClick={() => setNights((v) => Math.min(60, v + 1))} aria-label="More nights">+</button>
              </div>
            </div>
          </div>

          <div className="travelPlanPresets">
            {budgetPresets.map((preset) => (
              <button type="button" key={preset} className={targetBudget === preset ? "active" : ""} onClick={() => setTargetBudget(preset)}>
                {preset >= 100000 ? `₹${preset / 100000}L` : `₹${preset / 1000}k`}
              </button>
            ))}
          </div>

          <div className="travelPlanField">
            <span className="travelPlanFieldLabel">Transport you&apos;d consider</span>
            <div className="travelPlanChips">
              {allModes.map((mode) => {
                const Icon = transportMeta[mode].icon;
                return (
                  <button type="button" key={mode} className={modes.includes(mode) ? "chip active" : "chip"} onClick={() => toggleMode(mode)}>
                    <Icon size={15} /> {transportMeta[mode].label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="travelPlanField">
            <span className="travelPlanFieldLabel">Your cards <small>(for tailored offers)</small></span>
            <div className="travelPlanChips cardChips">
              {popularCards.map((card) => (
                <button type="button" key={card} className={cards.includes(card) ? "chip active" : "chip"} onClick={() => toggleCard(card)}>
                  {cards.includes(card) ? <Check size={14} /> : <Plus size={14} />} {card}
                </button>
              ))}
            </div>
            <div className="travelPlanCustomCard">
              <input
                value={customCard}
                placeholder="Add another card…"
                onChange={(event) => setCustomCard(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addCustomCard();
                  }
                }}
              />
              <button type="button" onClick={addCustomCard} aria-label="Add card">
                <Plus size={16} />
              </button>
            </div>
            {cards.length > 0 && (
              <div className="travelPlanSelected">
                {cards.map((card) => (
                  <span key={card}>
                    {card}
                    <button type="button" onClick={() => toggleCard(card)} aria-label={`Remove ${card}`}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <label>
            Monthly amount you can invest <small>(optional)</small>
            <input type="number" min={0} step={500} placeholder="We'll calculate it for you" value={monthlyCapacity} onChange={(event) => setMonthlyCapacity(event.target.value)} />
          </label>

          <div className="travelPlanField">
            <span className="travelPlanFieldLabel">Risk appetite</span>
            <div className="tpRiskRow">
              {riskOptions.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={riskLevel === option.id ? "tpRisk active" : "tpRisk"}
                  onClick={() => setRiskLevel(option.id)}
                >
                  {option.label}
                  <small>{option.sub}</small>
                </button>
              ))}
            </div>
          </div>

          <button className="travelPlanSubmit" type="submit" disabled={loading}>
            {loading ? "Building your plan…" : "Build my savings plan"}
            {!loading && <ArrowRight size={17} />}
          </button>
          {error && <p className="travelPlanError">{error}</p>}
        </form>

        {/* ===================== RESULTS ===================== */}
        <div className="travelPlanResult">
          {/* Deterministic calculator — live, math only, no AI */}
          <section className="tpCard tpCalcCard">
            <div className="tpRingRow">
              <div
                className="tpRing"
                style={{ background: `conic-gradient(var(--teal) ${offsetPct}%, var(--chip) 0)` }}
                role="img"
                aria-label={`${offsetPct} percent of trip cost offset`}
              >
                <div className="tpRingInner">
                  <strong>{offsetPct}%</strong>
                  <span>offset</span>
                </div>
              </div>
              <div>
                <b className="tpRouteLabel">{routeLabel}</b>
                <p>
                  of the trip cost covered by projected returns + card rewards over {calc.monthsToGo} months.
                  Deterministic math, updated live.
                </p>
                <span className="travelPlanSource calc">
                  <Calculator size={12} /> Deterministic math
                </span>
              </div>
            </div>

            <div className="tpTiles">
              <div>
                <span><Wallet size={13} /> Save / month</span>
                <strong className="isOrange">{inr(calc.recommendedMonthly)}</strong>
              </div>
              <div>
                <span><PiggyBank size={13} /> Projected corpus</span>
                <strong>{inr(calc.projectedValue)}</strong>
              </div>
              <div>
                <span><TrendingUp size={13} /> Growth + rewards</span>
                <strong className="isTeal">{inr(calc.investmentGains + calc.netCardRewards)}</strong>
              </div>
              <div>
                <span><Plane size={13} /> Your top-up</span>
                <strong>{inr(calc.outOfPocket)}</strong>
              </div>
            </div>

            <div className="tpBars" aria-hidden="true">
              {corpusBars.map((bar) => (
                <span key={bar.month} title={bar.tip} style={{ height: `${bar.height}%` }} />
              ))}
            </div>
            <div className="tpBarsAxis">
              <span>M1</span>
              <span>corpus by month</span>
              <span>M{calc.monthsToGo}</span>
            </div>

            <div className="calcMeta">
              <span><b>{calc.monthsToGo} mo</b> horizon</span>
              <span><b>{calc.assumedAnnualReturnPct}% p.a.</b> assumed ({riskLevel} risk)</span>
              <span><b>{inr(calc.cardFeeEstimate)}/yr</b> est. card fee</span>
              <span><b>{calc.allocation.equityPct}/{calc.allocation.debtPct}</b> growth/stable</span>
            </div>

            <p className="calcGuardrail">
              Math estimate only — returns are illustrative ({calc.assumedAnnualReturnPct}% assumed, markets can fall) and travel
              prices vary. Treat as a guardrail, not a quote. Not investment advice.
            </p>
          </section>

          {/* Fare radar + stay tiers — illustrative until the AI pass runs */}
          <section className="tpCard tpFareCard">
            <div className="tpFareHead">
              <b>Fare radar — {routeLabel}</b>
              <span>per person · illustrative</span>
            </div>
            <div className="tpFareRows">
              {radarModes.map((mode) => {
                const [low, high] = fareRanges[mode];
                const Icon = transportMeta[mode].icon;
                return (
                  <div className="tpFareRow" key={mode}>
                    <span className="tpFareMode"><Icon size={14} /> {transportMeta[mode].label}</span>
                    <div className="tpFareTrack">
                      <span style={{ width: `${Math.round((high / fareRadarMax) * 100)}%` }} />
                    </div>
                    <span className="tpFareRange">{inr(low)}–{inr(high)}</span>
                  </div>
                );
              })}
            </div>
            <div className="tpStayChips">
              <span className="isOrange">Stay · budget {inr(1800 * nights)}</span>
              <span className="isBlue">comfort {inr(4500 * nights)}</span>
              <span className="isTeal">premium {inr(9000 * nights)}</span>
            </div>
          </section>

          {/* AI research candidates — only after submit */}
          {!plan && !loading && (
            <div className="researchPrompt">
              <span className="researchPromptIcon"><Sparkles size={22} /></span>
              <h3>AI research candidates</h3>
              <p>Submit to generate named card, mutual-fund and stock candidates, transport + hotel price targets and a month-by-month plan. These are starting points you must verify before acting.</p>
            </div>
          )}

          {loading && <div className="travelPlanEmpty"><span className="travelPlanSpinner" />Researching cards, funds, transport &amp; hotels…</div>}

          {plan && !loading && (
            <div className="planStack">
              <div className="researchHeader">
                <h2 className="researchHeading">AI research candidates</h2>
                <span className={plan.source === "ai" ? "travelPlanSource ai" : "travelPlanSource warn"}>
                  <Sparkles size={12} /> {plan.source === "ai" ? "AI-generated · verify before acting" : "Sample data · AI unavailable, verify before acting"}
                </span>
              </div>

              <p className="travelPlanSummary">{plan.summary}</p>

              {/* 2 · transport comparison */}
              {plan.transport.length > 0 && (
                <section className="planStackCard" style={{ top: 98 }}>
                  <h3 className="planSectionTitle"><Car size={17} /> Best way to reach {plan.destination}</h3>
                  <div className="transportList">
                    {plan.transport.map((option) => {
                      const Icon = transportMeta[option.mode].icon;
                      return (
                        <div className={option.best ? "transportRow best" : "transportRow"} key={option.mode}>
                          <span className="transportMode"><Icon size={16} /> {transportMeta[option.mode].label}</span>
                          <div className="transportMeta">
                            <span className="transportPrice">{inr(option.priceFrom)}+</span>
                            <span className="transportTime"><Clock size={12} /> {option.duration}</span>
                            {option.best && <span className="transportBadge">Best value</span>}
                          </div>
                          <div className="transportBar"><span style={{ width: `${Math.max(8, (option.priceFrom / transportMax) * 100)}%` }} /></div>
                          <p>{option.note}</p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 3 · hotels comparison */}
              {plan.hotels.length > 0 && (
                <section className="planStackCard" style={{ top: 112 }}>
                  <h3 className="planSectionTitle"><Hotel size={17} /> Where to stay &amp; rates</h3>
                  <div className="hotelGrid">
                    {plan.hotels.map((tier) => (
                      <div className="hotelTier" key={tier.tier}>
                        <span className="hotelTierName">{tier.tier}</span>
                        <strong>{inr(tier.nightlyFrom)}<small>/night</small></strong>
                        <span className="hotelPlatform">{tier.platform}</span>
                        <p>{tier.note}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 4 · card advice */}
              {plan.cardAdvice.length > 0 && (
                <section className="planStackCard" style={{ top: 126 }}>
                  <h3 className="planSectionTitle"><CreditCard size={17} /> How to pay for maximum rewards</h3>
                  <div className="cardAdviceList">
                    {plan.cardAdvice.map((advice) => (
                      <div className="cardAdvice" key={advice.card}>
                        <strong>{advice.card}</strong>
                        <span className="cardAdviceTag">{advice.useFor}</span>
                        <p>{advice.benefit}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 5 · investments */}
              <section className="planStackCard" style={{ top: 140 }}>
                <h3 className="planSectionTitle"><LineChart size={17} /> Grow the money: funds, stocks &amp; cards</h3>
                <div className="travelPlanInstruments">
                  {(["mutual_fund", "stock", "card"] as const).map((kind) => {
                    const items = plan.instruments.filter((item) => item.kind === kind);
                    if (items.length === 0) return null;
                    const Meta = kindMeta[kind];
                    const Icon = Meta.icon;
                    return (
                      <div className="travelPlanInstrGroup" key={kind}>
                        <h4><Icon size={16} /> {Meta.label}</h4>
                        {items.map((item) => (
                          <div className="travelPlanInstr" key={`${kind}-${item.name}`}>
                            <div>
                              <strong>{item.name}</strong>
                              {item.tag && <span className="travelPlanTag">{item.tag}</span>}
                            </div>
                            <p>{item.detail}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 6 · strategy + deals */}
              <section className="planStackCard" style={{ top: 154 }}>
                <h3 className="planSectionTitle"><PiggyBank size={17} /> Your month-by-month strategy</h3>
                <ol className="travelPlanStrategy">
                  {plan.strategy.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
                {plan.deals.length > 0 && (
                  <>
                    <h3 className="planSectionTitle dealsTitle"><Tag size={17} /> Money-saving deals</h3>
                    <ul className="dealsList">
                      {plan.deals.map((deal, index) => (
                        <li key={index}><Check size={14} /> {deal}</li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="travelPlanDisclaimer">{plan.disclaimer}</p>
              </section>
            </div>
          )}

          <Link href="/chat" className="tpChatCta">
            Refine it with City Chat <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
