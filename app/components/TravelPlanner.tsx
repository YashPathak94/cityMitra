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
  Share2,
  Sparkles,
  Tag,
  TrainFront,
  TrendingUp,
  Wallet,
  X
} from "lucide-react";
import { useMemo, useState } from "react";
import { indiaCities } from "@/lib/india-cities";
import { buildCalculatorPlan, monthsToTravel, type RiskLevel, type TransportMode, type TravelPlan } from "@/lib/travel-plan";
import { trackActivity } from "@/lib/tracking";

const inr = (value: number) => `₹${Math.max(0, Math.round(value)).toLocaleString("en-IN")}`;

const popularCards = [
  "HDFC Regalia",
  "Axis Magnus",
  "SBI Cashback",
  "ICICI Amazon Pay",
  "Amex Platinum Travel",
  "Federal Scapia",
  "Flipkart Axis",
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

// Illustrative per-person fare ranges for the radar; the AI research pass
// replaces these with live, route-specific candidates after "Generate".
const fareRanges: Record<TransportMode, [number, number]> = {
  flight: [4500, 7200],
  train: [1200, 2400],
  bus: [900, 1600],
  car: [3800, 6000],
  bike: [1500, 2600]
};
const fareRadarMax = 7200;

const vibes = [
  { emoji: "🌊", label: "Beach reset", sub: "Slow mornings + sunsets" },
  { emoji: "🏔️", label: "Adventure", sub: "Treks, rides and chaos" },
  { emoji: "🍜", label: "Food crawl", sub: "Save room for everything" },
  { emoji: "🎧", label: "Concert trip", sub: "Core memory unlocked" },
  { emoji: "🛕", label: "Spiritual", sub: "Temples, ghats & peace" },
  { emoji: "✨", label: "Luxury soft life", sub: "Premium, but planned" },
  { emoji: "🎲", label: "Surprise me", sub: "Let the algorithm cook" }
];

const stayStyles = ["Budget", "Comfort", "Premium", "Hostel-core"];
const momentOptions = ["Sunset spot", "Nightlife", "Local food", "Content-worthy cafés", "Hidden gems"];

const personas = [
  { emoji: "📋", label: "The planner", sub: "Spreadsheets are love" },
  { emoji: "🫡", label: "Just tell me when", sub: "Low effort, high vibes" },
  { emoji: "💸", label: "Deal hunter", sub: "Never pays full price" }
];

const riskOptions: Array<{ id: RiskLevel; emoji: string; label: string; sub: string }> = [
  { id: "low", emoji: "🛟", label: "Chill", sub: "Safer, ~6% p.a." },
  { id: "medium", emoji: "⚖️", label: "Balanced", sub: "Mix it up, ~10% p.a." },
  { id: "high", emoji: "🚀", label: "Growth", sub: "More swings, ~13% p.a." }
];

const surprisePlaces = ["Jaipur", "Leh", "Pondicherry", "Shillong", "Udaipur", "Varanasi", "Rishikesh", "Amritsar"];

// Real, always-valid compare links per mode — free-text Google Travel /
// Search queries, so users can verify every estimate in one tap.
function compareUrl(mode: TransportMode, origin: string, destination: string, dateISO: string) {
  const from = origin || "Delhi";
  const to = destination || "Goa";
  const queries: Record<TransportMode, string> = {
    flight: `https://www.google.com/travel/flights?q=${encodeURIComponent(`Flights from ${from} to ${to} on ${dateISO}`)}`,
    train: `https://www.google.com/search?q=${encodeURIComponent(`trains from ${from} to ${to} IRCTC fare`)}`,
    bus: `https://www.google.com/search?q=${encodeURIComponent(`${from} to ${to} bus RedBus fare`)}`,
    car: `https://www.google.com/search?q=${encodeURIComponent(`self drive car rental ${to} Zoomcar price per day`)}`,
    bike: `https://www.google.com/search?q=${encodeURIComponent(`bike rental ${to} Royal Brothers price per day`)}`
  };
  return queries[mode];
}

function hotelsUrl(tier: string, destination: string) {
  return `https://www.google.com/travel/hotels?q=${encodeURIComponent(`${tier} hotels in ${destination || "Goa"}`)}`;
}

const stepTitles = ["Where are we going?", "Who's coming?", "What feels comfortable?", "Personalise the plan"];

const kindMeta = {
  mutual_fund: { label: "Mutual funds", icon: LineChart },
  stock: { label: "Trending stocks", icon: TrendingUp },
  card: { label: "Card offers", icon: CreditCard }
} as const;

function dateFromMonths(months: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export default function TravelPlanner() {
  const [step, setStep] = useState(1);
  const [origin, setOrigin] = useState("Delhi");
  const [destination, setDestination] = useState("Goa");
  const [vibe, setVibe] = useState("Beach reset");
  const [travelers, setTravelers] = useState(2);
  const [nights, setNights] = useState(4);
  const [modes, setModes] = useState<TransportMode[]>(["flight", "train"]);
  const [stay, setStay] = useState("Comfort");
  const [moments, setMoments] = useState<string[]>(["Sunset spot", "Local food"]);
  const [targetBudget, setTargetBudget] = useState(100000);
  const [travelDateISO, setTravelDateISO] = useState(() => dateFromMonths(6));
  const [monthlyCapacity, setMonthlyCapacity] = useState("");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("medium");
  const [cards, setCards] = useState<string[]>(["HDFC Regalia"]);
  const [customCard, setCustomCard] = useState("");
  const [persona, setPersona] = useState("The planner");
  const [planName, setPlanName] = useState("Goa glow-up trip ✨");
  const [chart, setChart] = useState<"corpus" | "fare">("corpus");
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // The date is the source of truth; the months slider reads/writes it.
  const months = useMemo(() => monthsToTravel(travelDateISO), [travelDateISO]);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(""), 2600);
  }

  function pickVibe(label: string) {
    if (label === "Surprise me") {
      const place = surprisePlaces[Math.floor(Math.random() * surprisePlaces.length)];
      const nextVibe = vibes[Math.floor(Math.random() * 5)].label;
      setDestination(place);
      setVibe(nextVibe);
      setPlanName(`${place} ${nextVibe.toLowerCase()} ✨`);
      showToast(`Rolled the dice: ${nextVibe} in ${place} 🎲`);
      return;
    }
    setVibe(label);
  }

  function loadDemo() {
    setOrigin("Bengaluru");
    setDestination("Mumbai");
    setVibe("Concert trip");
    setTravelers(4);
    setNights(3);
    setTargetBudget(85000);
    setTravelDateISO(dateFromMonths(4));
    setPlanName("Mumbai concert weekend 🎧");
    setStep(1);
    showToast("Gen-Z concert weekend loaded 🎧");
    trackActivity({ type: "scene_action", city: "Mumbai", category: "markets", label: "travel_plan_demo" });
  }

  function toggleMode(mode: TransportMode) {
    setModes((current) => (current.includes(mode) ? current.filter((m) => m !== mode) : [...current, mode]));
  }
  function toggleMoment(moment: string) {
    setMoments((current) => (current.includes(moment) ? current.filter((m) => m !== moment) : [...current, moment]));
  }
  function toggleCard(card: string) {
    setCards((current) => (current.includes(card) ? current.filter((c) => c !== card) : [...current, card].slice(0, 4)));
  }
  function addCustomCard() {
    const value = customCard.trim();
    if (value && !cards.includes(value)) setCards((current) => [...current, value].slice(0, 4));
    setCustomCard("");
  }

  async function generate() {
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
          modes: modes.length ? modes : allModes,
          cards,
          vibe,
          stay,
          moments
        })
      });
      const data = (await response.json().catch(() => ({}))) as { plan?: TravelPlan; error?: string };
      if (!response.ok || !data.plan) {
        setError(data.error || "Could not build your plan. Please try again.");
        return;
      }
      setPlan(data.plan);
      showToast("Your plan is ready. Main character energy unlocked ✨");
      setTimeout(() => document.getElementById("aiPlan")?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    } catch {
      setError("Could not reach the planner. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function next() {
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    void generate();
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
        modes: modes.length ? modes : allModes,
        cards
      }),
    [origin, destination, travelers, nights, travelDateISO, targetBudget, monthlyCapacity, riskLevel, modes, cards]
  );

  const calc = plan ?? liveCalc;
  const transportMax = plan && plan.transport.length ? Math.max(...plan.transport.map((t) => t.priceFrom || 1), 1) : 1;
  const routeLabel = `${origin.trim() || "Your city"} → ${destination.trim() || "Goa"}`;
  const offsetPct = Math.min(100, Math.max(1, calc.freeTravelPct));
  const summaryLine = `${travelers} travellers · ${nights} nights · ${stay.toLowerCase()} stay · ${
    modes.length ? modes.map((m) => transportMeta[m].label).join(" + ") : "flexible transport"
  }`;

  const barMonths = Math.min(12, Math.max(1, calc.monthsToGo));
  const monthlyRate = calc.assumedAnnualReturnPct / 100 / 12;
  const corpusBars = Array.from({ length: barMonths }, (_, index) => {
    const k = Math.round(((index + 1) / barMonths) * calc.monthsToGo);
    const value = calc.recommendedMonthly * k * (1 + monthlyRate * (k / 2));
    return {
      month: k,
      height: Math.min(100, Math.max(8, Math.round((value / Math.max(1, targetBudget)) * 100))),
      tip: `M${k} · ${inr(value)}`
    };
  });

  const radarModes = modes.length ? modes : (["flight"] as TransportMode[]);

  // Full-fledged shareable plan — the whole itinerary + money plan as text,
  // ready for the group chat (native share sheet on mobile, clipboard on web).
  async function sharePlan() {
    const dateLabel = new Date(travelDateISO).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    const activePlan = plan;
    const transportLines = (activePlan?.transport.length ? activePlan.transport : radarModes.map((mode) => {
      const [low, high] = fareRanges[mode];
      return { mode, priceFrom: low, priceTo: high, duration: "", operator: "", note: "", best: false, platform: "" };
    })).map((option) => {
      const isRental = option.mode === "car" || option.mode === "bike";
      const price = `${inr(option.priceFrom)}${option.priceTo ? `–${inr(option.priceTo)}` : "+"}${isRental ? "/day" : ""}`;
      return `• ${transportMeta[option.mode].label}: ${price}${option.operator ? ` · ${option.operator}` : ""}${option.best ? " ⭐ best value" : ""}`;
    });
    const hotelLines = (activePlan?.hotels.length ? activePlan.hotels : []).map(
      (tier) => `• ${tier.tier}: ${inr(tier.nightlyFrom)}/night${tier.example ? ` (${tier.example})` : ""} · ${tier.platform}`
    );
    const rentalLines = (activePlan?.rentals ?? []).map(
      (rental) => `• ${rental.type === "car" ? "Self-drive car" : "Bike"}: ${inr(rental.perDayFrom)}${rental.perDayTo ? `–${inr(rental.perDayTo)}` : ""}/day · ${rental.vendor}`
    );
    const cardLines = (activePlan?.cardAdvice ?? []).map(
      (advice) => `• ${advice.card} → ${advice.useFor}${advice.offer ? ` (${advice.offer})` : ""}`
    );
    const dealLines = (activePlan?.deals ?? []).slice(0, 4).map((deal) => `• ${deal}`);
    const midMonth = Math.max(1, Math.round(calc.monthsToGo / 2));
    const milestone = (k: number) => inr(calc.recommendedMonthly * k * (1 + monthlyRate * (k / 2)));

    const text = [
      `🌏 ${planName || "My next trip ✨"}`,
      `${routeLabel} · ${dateLabel}`,
      `${travelers} travellers · ${nights} nights · ${vibe} · ${stay.toLowerCase()} stay${moments.length ? ` · must-haves: ${moments.join(", ")}` : ""}`,
      ``,
      `💰 THE MONEY PLAN`,
      `Budget ${inr(targetBudget)} · save ${inr(calc.recommendedMonthly)}/month for ${calc.monthsToGo} months (${riskLevel} risk, ${calc.assumedAnnualReturnPct}% p.a. illustrative)`,
      `Corpus M1 ${milestone(1)} → M${midMonth} ${milestone(midMonth)} → M${calc.monthsToGo} ${inr(calc.projectedValue)}`,
      `Growth + card rewards ≈ ${inr(calc.investmentGains + calc.netCardRewards)} (~${offsetPct}% of the trip) · your top-up ${inr(calc.outOfPocket)}`,
      ``,
      `🚀 GETTING THERE (est.)`,
      ...transportLines,
      ...(rentalLines.length ? ["", "🛞 RENTALS ON ARRIVAL", ...rentalLines] : []),
      ...(hotelLines.length ? ["", "🏨 STAY (per night, est.)", ...hotelLines] : ["", "🏨 STAY (est.)", `• Budget ${inr(1800 * nights)} · comfort ${inr(4500 * nights)} · premium ${inr(9000 * nights)} for ${nights} nights`]),
      ...(cardLines.length ? ["", "💳 CARD PLAYS", ...cardLines] : []),
      ...(dealLines.length ? ["", "🔥 TOP TIPS", ...dealLines] : []),
      ``,
      `Planned on CityMitra → ctmitra.com/travel-plan (estimates — verify before booking; not investment advice)`
    ].join("\n");

    const shareData = { title: planName || "CityMitra travel plan", text };
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        showToast("Plan shared. Main character energy ✨");
        return;
      } catch {
        // fall through to clipboard (user may have dismissed the sheet)
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast("Full plan copied. Send it to the group chat 🔗");
    } catch {
      showToast("Couldn't copy — screenshot works too 📸");
    }
    trackActivity({ type: "scene_action", city: destination || "Goa", category: "markets", label: "travel_plan_share" });
  }

  return (
    <div className="travelPlan">
      <div className="travelPlanGrid" id="planResult">
        {/* ===================== WIZARD ===================== */}
        <section className="travelPlanForm tpCard" aria-label="Trip plan builder">
          <div className="tpWizHead">
            <div>
              <small>Step {step} of 4</small>
              <h2>{stepTitles[step - 1]}</h2>
            </div>
            <div className="tpWizTools">
              <div className="tpProgress" role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={step}>
                <span style={{ width: `${step * 25}%` }} />
              </div>
              <button type="button" className="tpMiniBtn" onClick={loadDemo}>
                🎧 Load demo
              </button>
            </div>
          </div>

          <datalist id="indiaCitiesList">
            {indiaCities.map((cityName) => (
              <option key={cityName} value={cityName} />
            ))}
          </datalist>

          {step === 1 && (
            <div className="tpStep">
              <div className="travelPlanRow">
                <label>
                  From
                  <input list="indiaCitiesList" placeholder="Your city" value={origin} onChange={(event) => setOrigin(event.target.value)} />
                </label>
                <label>
                  To
                  <input list="indiaCitiesList" placeholder="Dream destination" value={destination} onChange={(event) => setDestination(event.target.value)} />
                </label>
              </div>
              <label className="tpGap">
                Travel date <small>(when does the trip start?)</small>
                <input
                  type="date"
                  value={travelDateISO}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(event) => event.target.value && setTravelDateISO(event.target.value)}
                />
              </label>
              <span className="travelPlanFieldLabel tpGap">Pick your trip vibe</span>
              <div className="tpVibeGrid">
                {vibes.map((option) => (
                  <button
                    type="button"
                    key={option.label}
                    className={vibe === option.label ? "tpVibe active" : "tpVibe"}
                    onClick={() => pickVibe(option.label)}
                  >
                    <span className="tpVibeEmoji" aria-hidden="true">{option.emoji}</span>
                    <b>{option.label}</b>
                    <span>{option.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="tpStep">
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

              <span className="travelPlanFieldLabel tpGap">Transport you&apos;d consider</span>
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

              <span className="travelPlanFieldLabel tpGap">Stay style</span>
              <div className="travelPlanChips">
                {stayStyles.map((style) => (
                  <button type="button" key={style} className={stay === style ? "chip active" : "chip"} onClick={() => setStay(style)}>
                    {style}
                  </button>
                ))}
              </div>

              <span className="travelPlanFieldLabel tpGap">Must-have moments</span>
              <div className="travelPlanChips">
                {momentOptions.map((moment) => (
                  <button type="button" key={moment} className={moments.includes(moment) ? "chip active" : "chip"} onClick={() => toggleMoment(moment)}>
                    {moment}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="tpStep">
              <div className="tpRangeRow">
                <div className="tpRangeTop">
                  <span className="travelPlanFieldLabel">Trip budget</span>
                  <span className="tpRangeValue">{inr(targetBudget)}</span>
                </div>
                <input
                  type="range"
                  min={25000}
                  max={500000}
                  step={5000}
                  value={targetBudget}
                  onChange={(event) => setTargetBudget(Number(event.target.value))}
                  aria-label="Trip budget"
                />
              </div>

              <div className="tpRangeRow">
                <div className="tpRangeTop">
                  <span className="travelPlanFieldLabel">Months to departure</span>
                  <span className="tpRangeValue">{months} months · {new Date(travelDateISO).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={18}
                  step={1}
                  value={Math.min(18, Math.max(3, months))}
                  onChange={(event) => setTravelDateISO(dateFromMonths(Number(event.target.value)))}
                  aria-label="Months to departure"
                />
              </div>

              <span className="travelPlanFieldLabel tpGap">Risk comfort</span>
              <div className="tpVibeGrid tpVibeGrid3">
                {riskOptions.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    className={riskLevel === option.id ? "tpVibe active" : "tpVibe"}
                    onClick={() => setRiskLevel(option.id)}
                  >
                    <span className="tpVibeEmoji" aria-hidden="true">{option.emoji}</span>
                    <b>{option.label}</b>
                    <span>{option.sub}</span>
                  </button>
                ))}
              </div>

              <label className="tpGap">
                Monthly amount you can invest <small>(optional — we&apos;ll calculate it otherwise)</small>
                <input
                  type="number"
                  min={0}
                  step={500}
                  placeholder="We'll calculate it for you"
                  value={monthlyCapacity}
                  onChange={(event) => setMonthlyCapacity(event.target.value)}
                />
              </label>
            </div>
          )}

          {step === 4 && (
            <div className="tpStep">
              <span className="travelPlanFieldLabel">Cards you use <small>(for tailored rewards, up to 4)</small></span>
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

              <span className="travelPlanFieldLabel tpGap">Group-chat personality</span>
              <div className="tpVibeGrid tpVibeGrid3">
                {personas.map((option) => (
                  <button
                    type="button"
                    key={option.label}
                    className={persona === option.label ? "tpVibe active" : "tpVibe"}
                    onClick={() => setPersona(option.label)}
                  >
                    <span className="tpVibeEmoji" aria-hidden="true">{option.emoji}</span>
                    <b>{option.label}</b>
                    <span>{option.sub}</span>
                  </button>
                ))}
              </div>

              <label className="tpGap">
                Plan name
                <input value={planName} onChange={(event) => setPlanName(event.target.value)} placeholder="My next trip ✨" />
              </label>
            </div>
          )}

          <div className="tpWizActions">
            <button type="button" className="tpBack" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
              Back
            </button>
            <button type="button" className="travelPlanSubmit tpNext" onClick={next} disabled={loading}>
              {loading ? "Building your plan…" : step === 4 ? "Generate my plan ✨" : "Next"}
              {!loading && step < 4 && <ArrowRight size={17} />}
            </button>
          </div>
          {error && <p className="travelPlanError">{error}</p>}
        </section>

        {/* ===================== LIVE RESULTS ===================== */}
        <div className="travelPlanResult">
          <section className="tpCard tpCalcCard">
            <div className="tpRouteRow">
              <b className="tpRouteLabel">{routeLabel}</b>
              <span className="tpLive">● LIVE PLAN</span>
            </div>
            <div className="tpRingRow">
              <div
                className="tpRing"
                style={{ background: `conic-gradient(var(--orange) ${offsetPct}%, var(--chip) 0)` }}
                role="img"
                aria-label={`${offsetPct} percent of trip cost offset`}
              >
                <div className="tpRingInner">
                  <strong>{offsetPct}%</strong>
                  <span>offset</span>
                </div>
              </div>
              <div>
                <b className="tpVibeTitle">{vibe}, funded smarter.</b>
                <p>
                  Projected returns + card rewards can offset part of your {calc.monthsToGo}-month plan. Everything
                  updates as you tap.
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
                <span><PiggyBank size={13} /> Trip corpus</span>
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

            <p className="calcGuardrail">
              Math estimate only — {calc.assumedAnnualReturnPct}% p.a. assumed ({riskLevel} risk), markets can fall,
              prices vary. A guardrail, not a quote. Not investment advice.
            </p>
          </section>

          <section className="tpCard tpFareCard">
            <div className="tpFareHead">
              <b>Money momentum</b>
              <div className="tpToggle" role="tablist" aria-label="Chart view">
                <button
                  type="button"
                  role="tab"
                  aria-selected={chart === "corpus"}
                  className={chart === "corpus" ? "active" : ""}
                  onClick={() => setChart("corpus")}
                >
                  Corpus
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={chart === "fare"}
                  className={chart === "fare" ? "active" : ""}
                  onClick={() => setChart("fare")}
                >
                  Fare radar
                </button>
              </div>
            </div>

            {chart === "corpus" ? (
              <>
                <div className="tpBars" aria-hidden="true">
                  {corpusBars.map((bar) => (
                    <span key={bar.month} title={bar.tip} style={{ height: `${bar.height}%` }} />
                  ))}
                </div>
                <div className="tpBarsAxis">
                  <span>M1</span>
                  <span>growing month by month</span>
                  <span>M{calc.monthsToGo}</span>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </section>

          <section className="tpCard tpSummaryCard">
            <h4>{planName || "My next trip ✨"}</h4>
            <p>{summaryLine}</p>
            <button type="button" className="tpShareBtn" onClick={sharePlan}>
              <Share2 size={15} /> Save &amp; share plan
            </button>
          </section>

          {!plan && !loading && (
            <div className="researchPrompt">
              <span className="researchPromptIcon"><Sparkles size={22} /></span>
              <h3>AI research candidates</h3>
              <p>Finish the 4 steps and hit &quot;Generate my plan&quot; for named card, fund and stock candidates, transport + hotel price targets and a month-by-month plan — starting points you must verify before acting.</p>
            </div>
          )}

          {loading && <div className="travelPlanEmpty"><span className="travelPlanSpinner" />Researching cards, funds, transport &amp; hotels…</div>}
        </div>
      </div>

      {/* ===================== AI RESEARCH (after generate) ===================== */}
      {plan && !loading && (
        <div className="planStack tpAiStack" id="aiPlan">
          <div className="researchHeader">
            <h2 className="researchHeading">AI research candidates</h2>
            <span className={plan.source === "ai" ? "travelPlanSource ai" : "travelPlanSource warn"}>
              <Sparkles size={12} /> {plan.source === "ai" ? "AI-researched estimates · verify before booking" : "Smart estimates · live AI research is offline right now — tap the compare links to verify"}
            </span>
          </div>

          <p className="travelPlanSummary">{plan.summary}</p>

          {plan.transport.length > 0 && (
            <section className="planStackCard" style={{ top: 98 }}>
              <h3 className="planSectionTitle"><Car size={17} /> Best way to reach {plan.destination}</h3>
              <div className="transportList">
                {plan.transport.map((option) => {
                  const Icon = transportMeta[option.mode].icon;
                  const isRental = option.mode === "car" || option.mode === "bike";
                  return (
                    <div className={option.best ? "transportRow best" : "transportRow"} key={option.mode}>
                      <span className="transportMode"><Icon size={16} /> {transportMeta[option.mode].label}</span>
                      <div className="transportMeta">
                        <span className="transportPrice">
                          {inr(option.priceFrom)}
                          {option.priceTo ? `–${inr(option.priceTo)}` : "+"}
                          {isRental && <small>/day</small>}
                        </span>
                        <span className="transportTime"><Clock size={12} /> {option.duration}</span>
                        {option.best && <span className="transportBadge">Best value</span>}
                      </div>
                      <div className="transportBar"><span style={{ width: `${Math.max(8, (option.priceFrom / transportMax) * 100)}%` }} /></div>
                      <p>{[option.operator, option.note].filter(Boolean).join(" — ")}</p>
                      <div className="tpRowFoot">
                        {option.platform && <span>{option.platform}</span>}
                        <a href={compareUrl(option.mode, origin, plan.destination, travelDateISO)} target="_blank" rel="noreferrer">
                          Compare live ↗
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {plan.rentals.length > 0 && (
            <section className="planStackCard" style={{ top: 105 }}>
              <h3 className="planSectionTitle"><Car size={17} /> Rentals on arrival</h3>
              <div className="hotelGrid">
                {plan.rentals.map((rental) => (
                  <div className="hotelTier" key={rental.type}>
                    <span className="hotelTierName">{rental.type === "car" ? "🚗 Self-drive car" : "🛵 Bike / scooter"}</span>
                    <strong>
                      {inr(rental.perDayFrom)}
                      {rental.perDayTo ? `–${inr(rental.perDayTo)}` : ""}
                      <small>/day</small>
                    </strong>
                    <span className="hotelPlatform">{rental.vendor}</span>
                    <p>{rental.note}</p>
                    <a className="tpCompareLink" href={compareUrl(rental.type, origin, plan.destination, travelDateISO)} target="_blank" rel="noreferrer">
                      Check live rates ↗
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {plan.hotels.length > 0 && (
            <section className="planStackCard" style={{ top: 112 }}>
              <h3 className="planSectionTitle"><Hotel size={17} /> Where to stay &amp; rates</h3>
              <div className="hotelGrid">
                {plan.hotels.map((tier) => (
                  <div className="hotelTier" key={tier.tier}>
                    <span className="hotelTierName">{tier.tier}</span>
                    <strong>{inr(tier.nightlyFrom)}<small>/night</small></strong>
                    <span className="hotelPlatform">{tier.platform}</span>
                    {tier.example && <em className="hotelExample">{tier.example}</em>}
                    <p>{tier.note}</p>
                    <a className="tpCompareLink" href={hotelsUrl(tier.tier, plan.destination)} target="_blank" rel="noreferrer">
                      See live prices ↗
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {plan.cardAdvice.length > 0 && (
            <section className="planStackCard" style={{ top: 126 }}>
              <h3 className="planSectionTitle"><CreditCard size={17} /> How to pay for maximum rewards</h3>
              <div className="cardAdviceList">
                {plan.cardAdvice.map((advice) => (
                  <div className="cardAdvice" key={advice.card}>
                    <strong>{advice.card}</strong>
                    <span className="cardAdviceTag">{advice.useFor}</span>
                    {advice.offer && <span className="cardAdviceOffer"><Tag size={11} /> {advice.offer}</span>}
                    <p>{advice.benefit}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

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

          <section className="planStackCard" style={{ top: 154 }}>
            <h3 className="planSectionTitle"><PiggyBank size={17} /> Your month-by-month strategy</h3>
            <ol className="travelPlanStrategy">
              {plan.strategy.map((stepText, index) => (
                <li key={index}>{stepText}</li>
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

      <div className={toast ? "tpToast show" : "tpToast"} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  );
}
