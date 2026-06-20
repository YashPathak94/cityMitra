"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  CreditCard,
  LineChart,
  PiggyBank,
  Plane,
  Sparkles,
  TrendingUp,
  Wallet
} from "lucide-react";
import { FormEvent, useState } from "react";
import { cities } from "@/data/city-directory";
import type { RiskLevel, TravelPlan } from "@/lib/travel-plan";

const inr = (value: number) => `₹${Math.max(0, Math.round(value)).toLocaleString("en-IN")}`;
const budgetPresets = [25000, 50000, 100000, 200000, 500000];
const destinations = Array.from(new Set([...cities, "Goa", "Manali", "Kerala", "Udaipur", "Rishikesh", "Shimla"]));
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
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          riskLevel
        })
      });
      const data = (await response.json().catch(() => ({}))) as { plan?: TravelPlan; error?: string };
      if (!response.ok || !data.plan) {
        setError(data.error || "Could not build your plan. Please try again.");
        return;
      }
      setPlan(data.plan);
    } catch {
      setError("Could not reach the planner. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="travelPlan">
      <header className="travelPlanHero">
        <span className="travelPlanBadge">
          <Sparkles size={15} /> Industry-first · AI travel-funding engine
        </span>
        <h1>
          Travel now. Let smart investing <span>pay the bill.</span>
        </h1>
        <p>
          Tell us where and when you want to go. CityMitra&apos;s AI builds a month-by-month plan — SIPs, trending funds &amp;
          stocks, and the right card offers — so your trip is funded by returns and rewards, not your pocket.
        </p>
      </header>

      <div className="travelPlanGrid">
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
            <input
              type="number"
              min={1000}
              step={1000}
              value={targetBudget}
              onChange={(event) => setTargetBudget(Number(event.target.value))}
            />
          </label>
          <div className="travelPlanPresets">
            {budgetPresets.map((preset) => (
              <button
                type="button"
                key={preset}
                className={targetBudget === preset ? "active" : ""}
                onClick={() => setTargetBudget(preset)}
              >
                {inr(preset)}
              </button>
            ))}
          </div>

          <label>
            Monthly amount you can invest <small>(optional)</small>
            <input
              type="number"
              min={0}
              step={500}
              placeholder="We'll calculate it for you"
              value={monthlyCapacity}
              onChange={(event) => setMonthlyCapacity(event.target.value)}
            />
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
              <p>Fill the details and we&apos;ll show exactly how to fund your {destination} trip through smart investing &amp; offers.</p>
            </div>
          )}

          {loading && <div className="travelPlanEmpty"><span className="travelPlanSpinner" />Building your personalised plan…</div>}

          {plan && !loading && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="travelPlanHeadline">
                <div className="travelPlanFreePct">
                  <strong>{plan.freeTravelPct}%</strong>
                  <span>of your trip funded by returns + rewards</span>
                </div>
                <span className={plan.source === "ai" ? "travelPlanSource ai" : "travelPlanSource"}>
                  <Sparkles size={12} /> {plan.source === "ai" ? "AI recommended" : "Smart calculator"}
                </span>
              </div>

              <div className="travelPlanStats">
                <div>
                  <Wallet size={16} />
                  <b>{inr(plan.recommendedMonthly)}</b>
                  <span>per month · {plan.monthsToGo} mo</span>
                </div>
                <div>
                  <PiggyBank size={16} />
                  <b>{inr(plan.projectedValue)}</b>
                  <span>projected corpus</span>
                </div>
                <div>
                  <TrendingUp size={16} />
                  <b>{inr(plan.investmentGains + plan.cardSavings)}</b>
                  <span>growth + card savings</span>
                </div>
                <div>
                  <Plane size={16} />
                  <b>{inr(plan.outOfPocket)}</b>
                  <span>out of pocket</span>
                </div>
              </div>

              <p className="travelPlanSummary">{plan.summary}</p>

              <div className="travelPlanAllocation" aria-label="Suggested allocation">
                <span className="allocBar">
                  <span className="allocEquity" style={{ width: `${plan.allocation.equityPct}%` }} />
                </span>
                <small>
                  {plan.allocation.equityPct}% growth · {plan.allocation.debtPct}% stable
                </small>
              </div>

              <div className="travelPlanStrategy">
                <h3>Your month-by-month strategy</h3>
                <ol>
                  {plan.strategy.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="travelPlanInstruments">
                {(["mutual_fund", "stock", "card"] as const).map((kind) => {
                  const items = plan.instruments.filter((item) => item.kind === kind);
                  if (items.length === 0) return null;
                  const Meta = kindMeta[kind];
                  const Icon = Meta.icon;
                  return (
                    <div className="travelPlanInstrGroup" key={kind}>
                      <h4>
                        <Icon size={16} /> {Meta.label}
                      </h4>
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

              <p className="travelPlanDisclaimer">{plan.disclaimer}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
