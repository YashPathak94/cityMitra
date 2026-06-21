"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  Bike,
  Bus,
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
import { FormEvent, useState } from "react";
import { cities } from "@/data/city-directory";
import type { RiskLevel, TransportMode, TravelPlan } from "@/lib/travel-plan";
import { ContainerScroll } from "@/app/components/ContainerScroll";

const inr = (value: number) => `₹${Math.max(0, Math.round(value)).toLocaleString("en-IN")}`;
const budgetPresets = [25000, 50000, 100000, 200000, 500000];
const destinations = Array.from(new Set([...cities, "Goa", "Manali", "Kerala", "Udaipur", "Rishikesh", "Shimla"]));
const popularCards = [
  "HDFC Regalia",
  "Axis Magnus",
  "SBI Card ELITE",
  "ICICI Amazon Pay",
  "Amex Platinum Travel",
  "Axis Atlas",
  "HDFC Millennia",
  "SBI SimplyCLICK"
];

const transportMeta: Record<TransportMode, { label: string; icon: typeof Plane }> = {
  flight: { label: "Flight", icon: Plane },
  train: { label: "Train", icon: TrainFront },
  bus: { label: "Bus", icon: Bus },
  car: { label: "Car", icon: Car },
  bike: { label: "Bike", icon: Bike }
};
const allModes = Object.keys(transportMeta) as TransportMode[];

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
  const [destination, setDestination] = useState<string>(cities[0] || "Goa");
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
          destination,
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

  const fundTotal = plan ? plan.investmentGains + plan.cardSavings + plan.outOfPocket || 1 : 1;
  const transportMax = plan && plan.transport.length ? Math.max(...plan.transport.map((t) => t.priceFrom || 1), 1) : 1;

  return (
    <div className="travelPlan">
      <ContainerScroll
        titleComponent={
          <div className="travelPlanHero">
            <span className="travelPlanBadge">
              <Sparkles size={15} /> Industry-first · AI travel-funding engine
            </span>
            <h1>
              Travel now. Let smart investing <span>pay the bill.</span>
            </h1>
            <p>
              Pick your destination, date, transport and cards. CityMitra&apos;s AI compares fares, hotels and card
              offers, then builds a SIP + investing plan so your trip is funded by returns — not your pocket.
            </p>
          </div>
        }
      >
        <div className="planMock">
          <div className="planMockTop">
            <span>Goa · 6 months</span>
            <span className="planMockPill"><Sparkles size={12} /> AI plan</span>
          </div>
          <div className="planMockHeadline">
            <strong>68%</strong>
            <span>of your trip funded by returns + rewards</span>
          </div>
          <div className="planMockBar">
            <span style={{ width: "46%", background: "linear-gradient(90deg,#ea580c,#f97316)" }} />
            <span style={{ width: "22%", background: "#2563eb" }} />
            <span style={{ width: "32%", background: "#cbd5e1" }} />
          </div>
          <div className="planMockModes">
            {allModes.map((mode) => {
              const Icon = transportMeta[mode].icon;
              return (
                <span key={mode}>
                  <Icon size={16} />
                </span>
              );
            })}
          </div>
        </div>
      </ContainerScroll>

      <div className="travelPlanGrid" id="planResult">
        <form className="travelPlanForm" onSubmit={submit}>
          <label>
            Destination
            <select value={destination} onChange={(event) => setDestination(event.target.value)}>
              {destinations.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
          </label>

          <label>
            Travel date
            <input type="date" value={travelDateISO} min={new Date().toISOString().slice(0, 10)} onChange={(event) => setTravelDateISO(event.target.value)} />
          </label>

          <label>
            Trip budget
            <input type="number" min={1000} step={1000} value={targetBudget} onChange={(event) => setTargetBudget(Number(event.target.value))} />
          </label>
          <div className="travelPlanPresets">
            {budgetPresets.map((preset) => (
              <button type="button" key={preset} className={targetBudget === preset ? "active" : ""} onClick={() => setTargetBudget(preset)}>
                {inr(preset)}
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
            <div className="travelPlanChips">
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

          <label>
            Risk appetite
            <select value={riskLevel} onChange={(event) => setRiskLevel(event.target.value as RiskLevel)}>
              <option value="low">Low · safety first (~6% p.a.)</option>
              <option value="medium">Balanced (~10% p.a.)</option>
              <option value="high">Growth (~13% p.a.)</option>
            </select>
          </label>

          <button className="travelPlanSubmit" type="submit" disabled={loading}>
            {loading ? "Building your plan…" : "Build my free-travel plan"}
            {!loading && <ArrowRight size={17} />}
          </button>
          {error && <p className="travelPlanError">{error}</p>}
        </form>

        <div className="travelPlanResult">
          {!plan && !loading && (
            <div className="travelPlanEmpty">
              <Plane size={30} />
              <h3>Your plan appears here</h3>
              <p>Fill the details and we&apos;ll compare transport, hotels &amp; offers and show how to fund your {destination} trip.</p>
            </div>
          )}

          {loading && <div className="travelPlanEmpty"><span className="travelPlanSpinner" />Comparing fares, hotels, offers &amp; building your plan…</div>}

          {plan && !loading && (
            <div className="planStack">
              {/* 1 · funding headline */}
              <motion.section className="planStackCard" style={{ top: 84 }} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="travelPlanHeadline">
                  <div className="travelPlanFreePct">
                    <strong>{plan.freeTravelPct}%</strong>
                    <span>of your trip funded by returns + rewards</span>
                  </div>
                  <span className={plan.source === "ai" ? "travelPlanSource ai" : "travelPlanSource"}>
                    <Sparkles size={12} /> {plan.source === "ai" ? "AI recommended" : "Smart calculator"}
                  </span>
                </div>

                <div className="fundingBar" aria-label="How your trip is funded">
                  <span className="fundReturns" style={{ width: `${(plan.investmentGains / fundTotal) * 100}%` }} />
                  <span className="fundCards" style={{ width: `${(plan.cardSavings / fundTotal) * 100}%` }} />
                  <span className="fundSelf" style={{ width: `${(plan.outOfPocket / fundTotal) * 100}%` }} />
                </div>
                <div className="fundingLegend">
                  <span><i className="dotReturns" /> Returns {inr(plan.investmentGains)}</span>
                  <span><i className="dotCards" /> Card rewards {inr(plan.cardSavings)}</span>
                  <span><i className="dotSelf" /> Your top-up {inr(plan.outOfPocket)}</span>
                </div>

                <div className="travelPlanStats">
                  <div><Wallet size={16} /><b>{inr(plan.recommendedMonthly)}</b><span>per month · {plan.monthsToGo} mo</span></div>
                  <div><PiggyBank size={16} /><b>{inr(plan.projectedValue)}</b><span>projected corpus</span></div>
                  <div><TrendingUp size={16} /><b>{inr(plan.investmentGains + plan.cardSavings)}</b><span>growth + rewards</span></div>
                  <div><Plane size={16} /><b>{inr(plan.outOfPocket)}</b><span>out of pocket</span></div>
                </div>
                <p className="travelPlanSummary">{plan.summary}</p>
                <div className="travelPlanAllocation">
                  <span className="allocBar"><span className="allocEquity" style={{ width: `${plan.allocation.equityPct}%` }} /></span>
                  <small>{plan.allocation.equityPct}% growth · {plan.allocation.debtPct}% stable</small>
                </div>
              </motion.section>

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
        </div>
      </div>
    </div>
  );
}
