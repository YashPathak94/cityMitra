"use client";

import {
  Bike,
  Bus,
  Car,
  FileDown,
  Heart,
  Hotel,
  Loader2,
  Plane,
  Share2,
  Sparkles,
  Tag,
  TrainFront,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { indiaCities } from "@/lib/india-cities";
import {
  buildCalculatorPlan,
  buildCompareOptions,
  isInternationalDestination,
  monthsToTravel,
  sipFutureValue,
  type CompareOption,
  type TransportMode,
  type TravelPlan
} from "@/lib/travel-plan";
import CityAskWidget from "@/app/components/CityAskWidget";
import { openTravelPlanPdf } from "@/lib/travel-plan-pdf";
import { trackActivity } from "@/lib/tracking";

const inr = (value: number) => `₹${Math.max(0, Math.round(value)).toLocaleString("en-IN")}`;

type StackMode = TransportMode | "hotel";

const modeMeta: Record<StackMode, { label: string; icon: typeof Plane }> = {
  flight: { label: "Flights", icon: Plane },
  train: { label: "Trains", icon: TrainFront },
  bus: { label: "Bus", icon: Bus },
  car: { label: "Cars", icon: Car },
  bike: { label: "Bikes", icon: Bike },
  hotel: { label: "Hotels", icon: Hotel }
};
const transportModes: TransportMode[] = ["flight", "train", "bus", "car", "bike"];

const vibeOptions = [
  { emoji: "⚡", label: "Balanced" },
  { emoji: "🌊", label: "Beach reset" },
  { emoji: "🏔️", label: "Adventure" },
  { emoji: "🍜", label: "Food crawl" },
  { emoji: "🎧", label: "Concert trip" },
  { emoji: "🛕", label: "Spiritual" },
  { emoji: "✨", label: "Luxury soft life" }
];

const cardChoices = [
  "HDFC Regalia",
  "Axis Magnus",
  "SBI Cashback",
  "ICICI Amazon Pay",
  "Amex Platinum Travel",
  "Federal Scapia",
  "Flipkart Axis",
  "HSBC Cashback"
];

const budgetPresets = [25000, 50000, 100000, 200000, 500000];
const surprisePlaces = ["Goa", "Jaipur", "Leh", "Pondicherry", "Shillong", "Udaipur", "Varanasi", "Rishikesh"];

// Fallback tappable offers until the AI pass returns researched ones.
const defaultOffers = [
  { option: "Issuer travel portal", offer: "5X-style accelerated rewards on flights", saving: "~₹900", saveAmount: 900, validTill: "Standing offer" },
  { option: "Platform + bank card", offer: "10-12% instant discount, capped", saving: "~₹700", saveAmount: 700, validTill: "Check at checkout" },
  { option: "App-only deal", offer: "Extra discount on first app booking", saving: "~₹500", saveAmount: 500, validTill: "Check at checkout" }
];

function defaultDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 6);
  return d.toISOString().slice(0, 10);
}

type SortKey = "best" | "cheap" | "save";

export default function TravelPlanner() {
  // ---- inputs ----
  const [origin, setOrigin] = useState("Delhi");
  const [destination, setDestination] = useState("Goa");
  const [travelDateISO, setTravelDateISO] = useState(defaultDate());
  const [nights, setNights] = useState(4);
  const [travelers, setTravelers] = useState(2);
  const [roundTrip, setRoundTrip] = useState(true);
  const [tripBudget, setTripBudget] = useState(75000);
  const [vibe, setVibe] = useState("Balanced");
  const [modes, setModes] = useState<TransportMode[]>(["flight", "train"]);
  const [cards, setCards] = useState<string[]>(["HDFC Regalia"]);
  const [sip, setSip] = useState(5000);
  const [liquid, setLiquid] = useState(3500);

  // ---- output state ----
  const [tab, setTab] = useState<StackMode>("flight");
  const [sort, setSort] = useState<SortKey>("best");
  const [picks, setPicks] = useState<Partial<Record<StackMode, number>>>({ flight: 0, hotel: 0 });
  const [appliedOffers, setAppliedOffers] = useState<Set<number>>(new Set([0, 1]));
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [toast, setToast] = useState("");

  const months = useMemo(() => monthsToTravel(travelDateISO), [travelDateISO]);
  const endDateISO = useMemo(() => {
    const d = new Date(travelDateISO);
    d.setDate(d.getDate() + nights);
    return d.toISOString().slice(0, 10);
  }, [travelDateISO, nights]);

  function setEndDate(iso: string) {
    const diff = Math.round((new Date(iso).getTime() - new Date(travelDateISO).getTime()) / 86400000);
    if (Number.isFinite(diff) && diff >= 1) setNights(Math.min(60, diff));
  }

  const monthly = sip + liquid;

  // One "monthly saving budget" input drives both buckets (60/40 split);
  // the sliders below stay available for fine-tuning.
  function setSavingBudget(value: number) {
    const total = Math.max(0, Math.min(30000, value));
    const nextSip = Math.min(15000, Math.round((total * 0.6) / 500) * 500);
    setSip(nextSip);
    setLiquid(Math.min(15000, Math.max(0, total - nextSip)));
  }

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  }

  useEffect(() => {
    if (!resultsOpen && !loading) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) setResultsOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [resultsOpen, loading]);

  const isInternational = useMemo(() => isInternationalDestination(destination), [destination]);
  // Across borders only flights make sense — land modes are auto-parked.
  const effectiveModes = useMemo<TransportMode[]>(
    () => (isInternational ? ["flight"] : modes),
    [isInternational, modes]
  );

  // Instant local options; the AI pass swaps in route-specific ones.
  const compare: CompareOption[] = useMemo(
    () =>
      plan?.compare?.length
        ? plan.compare
        : buildCompareOptions({ travelers, nights, modes: effectiveModes, origin, destination, roundTrip }),
    [plan, travelers, nights, effectiveModes, origin, destination, roundTrip]
  );

  const activeTabs: StackMode[] = useMemo(() => {
    const present = new Set(compare.map((o) => o.mode));
    return [...transportModes.filter((m) => present.has(m)), ...(present.has("hotel") ? (["hotel"] as StackMode[]) : [])];
  }, [compare]);

  const currentTab: StackMode = activeTabs.includes(tab) ? tab : activeTabs[0] || "flight";

  const tabOptions = useMemo(() => {
    const list = compare.filter((o) => o.mode === currentTab);
    if (sort === "cheap") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "save") return [...list].sort((a, b) => b.save - a.save);
    return list;
  }, [compare, currentTab, sort]);

  const offers = plan?.fareIntel?.offers?.length ? plan.fareIntel.offers : defaultOffers;

  // Top-10 starter picks — AI-researched after Build, curated defaults before.
  const topPicks = useMemo(() => {
    if (plan?.instruments?.length) return plan.instruments.slice(0, 10);
    return buildCalculatorPlan({
      origin,
      destination,
      travelers,
      nights,
      travelDateISO,
      targetBudget: Math.max(10000, tripBudget),
      riskLevel: sip >= liquid ? "medium" : "low",
      modes,
      cards
    }).instruments.slice(0, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, sip, liquid, travelDateISO]);

  // ---- stack math ----
  const stack = useMemo(() => {
    const entries: Array<{ mode: StackMode; option: CompareOption }> = [];
    for (const mode of activeTabs) {
      const index = picks[mode];
      if (index === undefined) continue;
      const list = compare.filter((o) => o.mode === mode);
      const option = list[Math.min(index, list.length - 1)];
      if (option) entries.push({ mode, option });
    }
    return entries;
  }, [picks, compare, activeTabs]);

  // Coherent trip math — every figure reconciles: stickerTotal - youSave = payable.
  // stackTotal is the price AFTER travel discounts (what booking sites show as
  // "final"); stickerTotal is before. Card offers + investment growth are the
  // extra ways CityMitra shaves the net out-of-pocket further.
  const stickerTotal = stack.reduce((sum, item) => sum + item.option.oldPrice, 0);
  const stackTotal = stack.reduce((sum, item) => sum + item.option.price, 0);
  const travelSave = Math.max(0, stickerTotal - stackTotal);
  // Card offers can't exceed what's left of the fare after travel discounts.
  const offerSave = Math.min(
    stackTotal,
    offers.reduce((sum, offer, index) => (appliedOffers.has(index) ? sum + (offer.saveAmount || 0) : sum), 0)
  );
  // Investing only meaningfully funds a trip with runway — under ~2 months it
  // can't grow in time, so we don't pretend it offsets the bill.
  const canInvest = months >= 2;
  const growth = canInvest
    ? Math.max(0, Math.round(sipFutureValue(sip, 10, months) + sipFutureValue(liquid, 6, months) - monthly * months))
    : 0;
  const payable = Math.max(0, stackTotal - offerSave - growth);
  const youSave = Math.max(0, stickerTotal - payable);
  const offsetPct = stickerTotal > 0 ? Math.min(90, Math.max(0, Math.round((youSave / stickerTotal) * 100))) : 0;
  const budgetDelta = tripBudget - payable;

  function toggleMode(mode: TransportMode) {
    setModes((current) => (current.includes(mode) ? current.filter((m) => m !== mode) : [...current, mode]));
    setPlan(null);
  }
  function toggleCard(card: string) {
    setCards((current) => (current.includes(card) ? current.filter((c) => c !== card) : [...current, card].slice(0, 4)));
  }
  function choose(index: number) {
    setPicks((current) => ({ ...current, [currentTab]: index }));
    showToast("Added to your smart stack ✨");
  }
  function removePick(mode: StackMode) {
    setPicks((current) => {
      const next = { ...current };
      delete next[mode];
      return next;
    });
  }
  function surprise() {
    const place = surprisePlaces[Math.floor(Math.random() * surprisePlaces.length)];
    setDestination(place);
    setPlan(null);
    showToast(`Destination unlocked: ${place} 🎲`);
  }

  async function build() {
    setResultsOpen(true);
    setLoading(true);
    trackActivity({ type: "scene_action", city: destination || "Goa", category: "markets", label: "smart_stack_build" });
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
          targetBudget: Math.max(10000, tripBudget),
          monthlyCapacity: monthly || undefined,
          riskLevel: sip >= liquid ? "medium" : "low",
          modes: effectiveModes.length ? effectiveModes : transportModes,
          cards,
          vibe,
          roundTrip
        })
      });
      const data = (await response.json().catch(() => ({}))) as { plan?: TravelPlan; error?: string };
      if (data.plan) {
        setPlan(data.plan);
        // Fresh option lists — reset selections so nothing points at a
        // stale index from the previous list (the misaligned-card bug).
        setPicks({ flight: 0, hotel: 0 });
        setSort("best");
        setTab((current) => (data.plan?.compare?.some((o) => o.mode === current) ? current : "flight"));
        setAppliedOffers(new Set([0, 1]));
        showToast(data.plan.source === "ai" ? "Live options loaded ✨" : "Smart estimates loaded — verify with the links");
      } else {
        showToast(data.error || "Couldn't refresh options — showing estimates");
      }
    } catch {
      showToast("Couldn't refresh options — showing estimates");
    } finally {
      setLoading(false);
    }
  }

  function toggleOffer(index: number) {
    setAppliedOffers((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    showToast("Offer stack updated");
  }

  const summaryLine = `${travelers} travellers · ${nights} nights · ${vibe} · ${stack.map((s) => modeMeta[s.mode].label).join(" + ") || "no picks yet"}`;

  async function share() {
    const dateLabel = new Date(travelDateISO).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    const endLabel = new Date(endDateISO).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    const lines = [
      `🌏 ${destination} smart stack — ${origin} → ${destination}`,
      `${dateLabel} → ${endLabel} · ${summaryLine}`,
      ``,
      `🧳 THE STACK`,
      ...stack.map((s) => `• ${modeMeta[s.mode].label}: ${s.option.name} — ${inr(s.option.price)} (saved ${inr(s.option.save)})`),
      ``,
      `💰 Trip price ${inr(stickerTotal)} → you pay ${inr(payable)} after funding (budget ${inr(tripBudget)}, ${budgetDelta >= 0 ? `${inr(budgetDelta)} to spare` : `${inr(-budgetDelta)} over`})`,
      `You save ${inr(youSave)} (~${offsetPct}% of the trip)`,
      `📈 Funding it: ${inr(monthly)}/month for ${months} months (illustrative growth ${inr(growth)})`,
      ...(offerSave ? [`💳 Offers stacked: ${inr(offerSave)}`] : []),
      ``,
      `Planned on CityMitra → ctmitra.com/travel-plan (estimates — verify before booking)`
    ].join("\n");
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: `${destination} smart stack`, text: lines });
        showToast("Stack shared ✨");
        return;
      } catch {
        /* fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(lines);
      showToast("Stack copied for the group chat 🔗");
    } catch {
      showToast("Couldn't copy — screenshot works too 📸");
    }
  }

  function downloadPdf() {
    const liveCalc = buildCalculatorPlan({
      origin,
      destination,
      travelers,
      nights,
      travelDateISO,
      targetBudget: Math.max(10000, tripBudget),
      monthlyCapacity: monthly || undefined,
      riskLevel: "medium",
      modes,
      cards
    });
    openTravelPlanPdf({
      planName: `${destination} smart stack`,
      origin,
      destination,
      startDateISO: travelDateISO,
      endDateISO,
      travelers,
      nights,
      vibe,
      stay: "comfort",
      moments: [],
      riskLevel: sip >= liquid ? "medium" : "low",
      targetBudget: tripBudget,
      offsetPct,
      milestones: [1, Math.max(1, Math.round(months / 2)), months]
        .filter((m, i, arr) => arr.indexOf(m) === i)
        .map((m) => ({ month: m, value: monthly * m })),
      calc: liveCalc,
      aiPlan: plan
    });
    showToast("PDF ready — Save as PDF in the print dialog 📄");
  }

  return (
    <div className="smartPlan">
      {/* ============ HERO + TRIP STRIP ============ */}
      <section className="spHero">
        <span className="spEyebrow">✨ Trip funding, but make it smart</span>
        <h1>
          Your next trip just entered its <em>funded era.</em>
        </h1>
        <p>
          Compare flights, stays and rides, stack the best offers and build a monthly plan that softens the bill.
        </p>
        <div className="spStrip">
          <datalist id="indiaCitiesList">
            {indiaCities.map((cityName) => (
              <option key={cityName} value={cityName} />
            ))}
          </datalist>
          <div className="spField">
            <label htmlFor="spFrom">From</label>
            <input
              id="spFrom"
              list="indiaCitiesList"
              value={origin}
              onChange={(e) => { setOrigin(e.target.value); setPlan(null); }}
              placeholder="Your city"
            />
          </div>
          <div className="spField">
            <label htmlFor="spTo">To</label>
            <input
              id="spTo"
              list="indiaCitiesList"
              value={destination}
              onChange={(e) => { setDestination(e.target.value); setPlan(null); }}
              placeholder="Dream spot"
            />
          </div>
          <div className="spField">
            <label htmlFor="spStart">Trip starts</label>
            <input id="spStart" type="date" min={new Date().toISOString().slice(0, 10)} value={travelDateISO} onChange={(e) => e.target.value && setTravelDateISO(e.target.value)} />
          </div>
          <div className="spField">
            <label htmlFor="spEnd">Trip ends</label>
            <input id="spEnd" type="date" min={travelDateISO} value={endDateISO} onChange={(e) => e.target.value && setEndDate(e.target.value)} />
          </div>
          <div className="spField">
            <span className="spFieldLabel">Trip type</span>
            <div className="spTripType" role="radiogroup" aria-label="Trip type">
              <button type="button" role="radio" aria-checked={roundTrip} className={roundTrip ? "active" : ""} onClick={() => { setRoundTrip(true); setPlan(null); }}>
                Round
              </button>
              <button type="button" role="radio" aria-checked={!roundTrip} className={!roundTrip ? "active" : ""} onClick={() => { setRoundTrip(false); setPlan(null); }}>
                1-way
              </button>
            </div>
          </div>
          <div className="spField">
            <label htmlFor="spTrav">Travellers</label>
            <select id="spTrav" value={travelers} onChange={(e) => setTravelers(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <button type="button" className="spBuild" onClick={build} disabled={loading}>
            {loading ? "Researching…" : "Fund My Trip ✨"}
          </button>
        </div>
      </section>

      {/* ============ INPUTS + FUNDING SCORE ============ */}
      <div className="spTopGrid">
        <section className="spCard">
          <div className="spCardHead">
            <div>
              <h2>Set your plan</h2>
              <p>Budget, savings, vibe, transport and cards — the output adapts to every choice.</p>
            </div>
            <button type="button" className="spMini" onClick={surprise}>🎲 Surprise me</button>
          </div>

          <div className="spInputRow">
            <div className="spInputField">
              <label htmlFor="spBudget">Trip budget (₹)</label>
              <input
                id="spBudget"
                type="number"
                min={5000}
                step={5000}
                value={tripBudget}
                onChange={(e) => setTripBudget(Math.max(0, Number(e.target.value)))}
              />
              <div className="spPresetRow">
                {budgetPresets.map((preset) => (
                  <button key={preset} type="button" className={tripBudget === preset ? "spPreset active" : "spPreset"} onClick={() => setTripBudget(preset)}>
                    {preset >= 100000 ? `₹${preset / 100000}L` : `₹${preset / 1000}k`}
                  </button>
                ))}
              </div>
            </div>
            <div className="spInputField">
              <label htmlFor="spSaving">Saving budget (₹/month)</label>
              <input
                id="spSaving"
                type="number"
                min={0}
                step={500}
                value={monthly}
                onChange={(e) => setSavingBudget(Number(e.target.value))}
              />
              <small className="spInputHint">
                Split {inr(sip)} SIP + {inr(liquid)} liquid · fine-tune in Fund-it →
              </small>
            </div>
          </div>

          <span className="spGroupLabel">Trip vibe</span>
          <div className="spChipRow">
            {vibeOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                className={vibe === option.label ? "spVibe active" : "spVibe"}
                onClick={() => { setVibe(option.label); showToast(`${option.label} vibe applied`); }}
              >
                {option.emoji} {option.label}
              </button>
            ))}
          </div>

          <span className="spGroupLabel">Transport you&apos;d consider</span>
          {isInternational && (
            <p className="spIntlHint">🌍 International route — comparing flights + stays (trains, buses &amp; rentals don&apos;t cross this border).</p>
          )}
          <div className="spChipRow">
            {transportModes.map((mode) => {
              const Icon = modeMeta[mode].icon;
              const disabled = isInternational && mode !== "flight";
              const active = effectiveModes.includes(mode);
              return (
                <button
                  key={mode}
                  type="button"
                  className={disabled ? "spChip isDisabled" : active ? "spChip active" : "spChip"}
                  onClick={() => !disabled && toggleMode(mode)}
                  disabled={disabled}
                  title={disabled ? "Not available on international routes" : undefined}
                >
                  <Icon size={14} /> {modeMeta[mode].label}
                </button>
              );
            })}
          </div>

          <span className="spGroupLabel">Your cards <em>(for tailored offers, up to 4)</em></span>
          <div className="spChipRow">
            {cardChoices.map((card) => (
              <button key={card} type="button" className={cards.includes(card) ? "spChip active" : "spChip"} onClick={() => toggleCard(card)}>
                {card}
              </button>
            ))}
          </div>
        </section>

        <div className="spScoreCol">
        <section className="spCard spScore">
          <div className="spScoreTop">
            <div>
              <span className="spKicker">Smart funding score</span>
              <h2>
                Trip is <em>{offsetPct}% funded</em>
              </h2>
              <p>{canInvest ? "Travel discounts + card offers + projected growth" : "Travel discounts + card offers (too soon to invest)"}</p>
            </div>
            <div className="spRing" style={{ background: `conic-gradient(var(--green) ${offsetPct}%, #ece5dc 0)` }} role="img" aria-label={`${offsetPct} percent funded`}>
              <div className="spRingInner">
                <strong>{offsetPct}%</strong>
                <span>offset</span>
              </div>
            </div>
          </div>
          <div className="spKpis">
            <div><small>Trip price</small><b>{inr(stickerTotal)}</b></div>
            <div><small>You save</small><b className="isGreen">{inr(youSave)}</b></div>
            <div><small>Save monthly</small><b className="isOrange">{inr(monthly)}</b></div>
            <div><small>Final top-up</small><b>{inr(payable)}</b></div>
          </div>
          <div className={budgetDelta >= 0 ? "spBudgetFit isOk" : "spBudgetFit isOver"}>
            {budgetDelta >= 0
              ? `✅ Within your ${inr(tripBudget)} budget — ${inr(budgetDelta)} headroom`
              : `⚠️ ${inr(-budgetDelta)} over your ${inr(tripBudget)} budget — try a cheaper option or stretch the timeline`}
          </div>
          <div className="spProgress"><span style={{ width: `${offsetPct}%` }} /></div>
        </section>

        <section className="spCard">
          <div className="spCardHead">
            <div>
              <h3>Fund-it options</h3>
              <p>Your {inr(monthly)}/month feeds the score above.</p>
            </div>
          </div>
          <div className="spSlider">
            <div className="spSliderTop">
              <div><strong>Index SIP</strong><small>Broad-market option</small></div>
              <span className="spRisk">Medium risk</span>
            </div>
            <input type="range" min={0} max={15000} step={500} value={sip} onChange={(e) => setSip(Number(e.target.value))} aria-label="Index SIP per month" />
            <div className="spSliderScale"><small>₹0</small><b>{inr(sip)}/mo</b><small>₹15k</small></div>
          </div>
          <div className="spSlider">
            <div className="spSliderTop">
              <div><strong>Liquid fund bucket</strong><small>Short-term parking</small></div>
              <span className="spRisk low">Lower risk</span>
            </div>
            <input type="range" min={0} max={15000} step={500} value={liquid} onChange={(e) => setLiquid(Number(e.target.value))} aria-label="Liquid fund per month" />
            <div className="spSliderScale"><small>₹0</small><b>{inr(liquid)}/mo</b><small>₹15k</small></div>
          </div>
          <p className="disclaimerSmall">*Illustrative only — market-linked investments can fall and do not guarantee trip funding. Not investment advice.</p>
        </section>
        </div>
      </div>

      {/* ============ COMPARE + SIDEBAR ============ */}
      <section className="spOutputLauncher spCard">
        <div>
          <span className="spKicker">Interactive output</span>
          <h2>Your complete travel stack, without the endless scroll.</h2>
          <p>Build the plan and compare routes, offers, funding and savings in one focused screen.</p>
        </div>
        <div className="spOutputActions">
          <button type="button" className="spBuild" onClick={() => void build()} disabled={loading}>
            {loading ? "Building magic…" : "Build smart plan"}
          </button>
          <button type="button" className="spActionBtn" onClick={() => setResultsOpen(true)} disabled={!plan}>
            Open current output
          </button>
        </div>
      </section>

      {(resultsOpen || loading) && (
        <div className="spModalOverlay" role="dialog" aria-modal="true" aria-label="CityMitra travel plan output">
          {loading ? (
            <section className="spMagicLoader" role="status" aria-live="polite">
              <div className="spMagicOrb"><Loader2 size={42} /></div>
              <span className="spKicker">CityMitra is planning</span>
              <h2>Hey CityMitra user, sit back and relax, magic is going on.</h2>
              <p>Comparing your route, offers and funding plan while keeping the corrected production calculations intact.</p>
              <div className="spMagicBar"><span /></div>
            </section>
          ) : (
            <section className="spPlanModal">
              <div className="spModalHead">
                <div>
                  <span className="spKicker">{origin || "Your city"} → {destination || "Your destination"}</span>
                  <h2>{destination || "Your destination"} smart travel stack</h2>
                  <p>{summaryLine}</p>
                </div>
                <div className="spModalActions">
                  <button type="button" className="spActionBtn" onClick={share}><Share2 size={16} /> Share</button>
                  <button type="button" className="spActionBtn spModalDownloadBtn" onClick={downloadPdf}><FileDown size={16} /> PDF</button>
                  <button type="button" className="spCloseBtn" onClick={() => setResultsOpen(false)} aria-label="Close travel plan output"><X size={20} /></button>
                </div>
              </div>
              <div className="spModalBody">
      <div className="spResults spResultsInModal">
        <main>
          <section className="spCard">
            <div className="spCardHead">
              <div>
                <h2>Compare your travel stack</h2>
                <p>{plan?.source === "ai" ? "Live AI research — prices include the strongest eligible offer." : "Smart estimates — hit Build for live AI research."}</p>
              </div>
              <div className="spSorts">
                {([["best", "Best vibe"], ["cheap", "Cheapest"], ["save", "Most saved"]] as Array<[SortKey, string]>).map(([key, label]) => (
                  <button key={key} type="button" className={sort === key ? "spChip active" : "spChip"} onClick={() => setSort(key)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="spTabs">
              {activeTabs.map((mode) => {
                const Icon = modeMeta[mode].icon;
                return (
                  <button key={mode} type="button" className={currentTab === mode ? "spTab active" : "spTab"} onClick={() => setTab(mode)}>
                    <Icon size={14} /> {modeMeta[mode].label}
                    {picks[mode] !== undefined && <span className="spTabDot" aria-label="selected" />}
                  </button>
                );
              })}
            </div>
            <div className={loading ? "spOptionList isLoading" : "spOptionList"} aria-busy={loading}>
              {tabOptions.map((option) => {
                const originalIndex = compare.filter((o) => o.mode === currentTab).indexOf(option);
                const isSelected = picks[currentTab] === originalIndex;
                return (
                  <article key={option.name + option.price} className={isSelected ? "spOption selected" : "spOption"}>
                    <div className="spOptionTop">
                      <div>
                        <strong>{option.name}</strong>
                        <span className="spOptionMode">{modeMeta[option.mode].label.toUpperCase()} OPTION</span>
                      </div>
                      <span className="spBadge">{option.tag}</span>
                    </div>
                    <div className="spOptionGrid">
                      <div><small>Schedule / stay</small><b>{option.line1 || "—"}</b></div>
                      <div><small>Details</small><b>{option.line2 || "—"}</b></div>
                      <div><small>Included</small><b>{option.line3 || "—"}</b></div>
                      <div><small>You save</small><b className="isGreen">{inr(option.save)}</b></div>
                    </div>
                    <div className="spOptionFoot">
                      <div>
                        <small>
                          Final payable after offer
                          {option.mode !== "hotel" && option.mode !== "car" && option.mode !== "bike"
                            ? ` · ${roundTrip ? "round trip" : "one-way"} · ${travelers} traveller${travelers > 1 ? "s" : ""}`
                            : ""}
                        </small>
                        <div className="spPriceLine">
                          <span className="spPrice">{inr(option.price)}</span>
                          {option.oldPrice > option.price && <span className="spOld">{inr(option.oldPrice)}</span>}
                        </div>
                      </div>
                      {isSelected ? (
                        <button type="button" className="spSelect isOn" onClick={() => removePick(currentTab)}>
                          Selected ✓
                        </button>
                      ) : (
                        <button type="button" className="spSelect" onClick={() => choose(originalIndex)}>
                          Choose this
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
              {loading && <div className="spLoadingNote">Researching live options for {origin || "your city"} → {destination}…</div>}
            </div>
            <p className="calcGuardrail">
              {plan?.source === "ai"
                ? "AI-researched estimates — final prices are session-based, verify at checkout."
                : "Illustrative estimates until you build — tap Build my smart trip for AI research on your route."}
            </p>
          </section>

          {plan?.fareIntel && (
            <section className="spCard spIntel">
              <div className="spCardHead">
                <div>
                  <h2>✈️ Fare intel — {origin || "Your city"} → {destination}</h2>
                  <p>{plan.fareIntel.headline}</p>
                </div>
              </div>
              {plan.fareIntel.flight && (
                <div className="tpFlightSpot">
                  <span className="tpFlightName">✈️ {plan.fareIntel.flight.name}</span>
                  <span>{plan.fareIntel.flight.timing}</span>
                  {plan.fareIntel.flight.duration && <span>⏱ {plan.fareIntel.flight.duration}</span>}
                  {plan.fareIntel.flight.benchmark && <span className="tpFlightFare">{plan.fareIntel.flight.benchmark}</span>}
                </div>
              )}
              <div className="tpIntelStats">
                {plan.fareIntel.expectedRange && <div><span>Expected range</span><strong>{plan.fareIntel.expectedRange}</strong></div>}
                {plan.fareIntel.targetPrice && <div><span>Target after offers</span><strong className="isTeal">{plan.fareIntel.targetPrice}</strong></div>}
                {plan.fareIntel.acceptablePrice && <div><span>Acceptable up to</span><strong>{plan.fareIntel.acceptablePrice}</strong></div>}
              </div>
              {plan.fareIntel.recommendation.length > 0 && (
                <>
                  <h4 className="tpIntelSub">🎯 My recommendation</h4>
                  <ol className="tpIntelRec">
                    {plan.fareIntel.recommendation.map((move, index) => (
                      <li key={index}>{move}</li>
                    ))}
                  </ol>
                </>
              )}
            </section>
          )}

          {plan && plan.vibeInsight && (
            <p className="tpVibeInsight">
              <span aria-hidden="true">{vibeOptions.find((v) => v.label === vibe)?.emoji || "✨"}</span> {plan.vibeInsight}
            </p>
          )}
        </main>

        <aside className="spAside">
          <section className="spCard spDark">
            <span className="spKicker light">Total savings stack</span>
            <div className="spSaveBig">{inr(youSave)}</div>
            <p>You keep this instead of paying full sticker price.</p>
            <div className="spStackBar" aria-hidden="true">
              <span style={{ width: `${Math.max(4, (travelSave / Math.max(1, youSave)) * 100)}%` }} />
              <span style={{ width: `${Math.max(4, (offerSave / Math.max(1, youSave)) * 100)}%` }} />
              <span style={{ width: `${Math.max(4, (growth / Math.max(1, youSave)) * 100)}%` }} />
            </div>
            <div className="spLegend">
              <div><span>Travel discount</span><b>{inr(travelSave)}</b></div>
              <div><span>Card offers</span><b>{inr(offerSave)}</b></div>
              <div><span>Growth*</span><b>{inr(growth)}</b></div>
              <div><span>Months to go</span><b>{months}</b></div>
            </div>
          </section>

          <section className="spCard">
            <div className="spCardHead">
              <div>
                <h3>Card offers to stack</h3>
                <p>Tap to apply or remove.</p>
              </div>
            </div>
            <div className="spOffers">
              {offers.map((offer, index) => (
                <button
                  key={offer.option + index}
                  type="button"
                  className={appliedOffers.has(index) ? "spOffer isOn" : "spOffer"}
                  onClick={() => toggleOffer(index)}
                >
                  <span>
                    <strong>{offer.option}</strong>
                    <small>{offer.offer}</small>
                    <small className="spOfferTill">{offer.validTill || "Check at checkout"}</small>
                  </span>
                  <b>{offer.saving || (offer.saveAmount ? inr(offer.saveAmount) : "")}</b>
                </button>
              ))}
            </div>
          </section>

          <div className="spActions">
            <button type="button" className="spActionBtn" onClick={share}><Share2 size={15} /> Share stack</button>
            <button type="button" className="spActionBtn" onClick={downloadPdf}><FileDown size={15} /> PDF</button>
            <button type="button" className="spActionBtn" onClick={() => showToast("Saved to your vibe board ♡")}><Heart size={15} /> Save</button>
          </div>
        </aside>
      </div>

      {/* ============ AI EXTRAS (post-build) ============ */}
      {plan && plan.source === "ai" && (
        <section className="spCard spExtras">
          <div className="spCardHead">
            <div>
              <h2><Sparkles size={18} /> The money strategy</h2>
              <p>{plan.summary}</p>
            </div>
          </div>
          <div className="spExtrasGrid">
            <div>
              <h4>📈 Month-by-month</h4>
              <ol className="tpIntelRec">
                {plan.strategy.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
            <div>
              <h4>💳 Card plays</h4>
              {plan.cardAdvice.map((advice) => (
                <p key={advice.card} className="spCardPlay">
                  <strong>{advice.card}</strong> → {advice.useFor}
                  {advice.offer && <span className="cardAdviceOffer"><Tag size={11} /> {advice.offer}</span>}
                </p>
              ))}
              <h4>🔥 Deals</h4>
              <ul className="spDeals">
                {plan.deals.map((deal, index) => (
                  <li key={index}>{deal}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="calcGuardrail">{plan.disclaimer}</p>
        </section>
      )}

      {/* ============ TOP 10 TO START INVESTING ============ */}
      <section className="spCard spExtras">
        <div className="spCardHead">
          <div>
            <h2>📊 Top 10 to start investing</h2>
            <p>
              {plan?.source === "ai"
                ? `Researched for your ${months}-month horizon and risk mix — verify with a SEBI-registered advisor.`
                : "Curated starter picks for a short horizon — Build refreshes these for your exact plan."}
            </p>
          </div>
        </div>
        <ol className="spPicksGrid">
          {topPicks.map((pick, index) => (
            <li key={pick.name} className="spPick">
              <span className="spPickNo">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{pick.name}</strong>
                <span className={`spPickKind is-${pick.kind}`}>
                  {pick.kind === "mutual_fund" ? "Mutual fund" : pick.kind === "stock" ? "Stock" : "Card"}
                  {pick.tag ? ` · ${pick.tag}` : ""}
                </span>
                <p>{pick.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="calcGuardrail">Illustrative starting points, not investment advice — markets can fall; verify before investing.</p>
      </section>

      {/* ============ KEEP PLANNING IN CITY CHAT ============ */}
      <CityAskWidget
        city={destination || "your city"}
        suggestions={[
          `Plan my ${nights}-night ${vibe} trip to ${destination || "Goa"} day-by-day`,
          `Best areas to stay in ${destination || "Goa"} for a ${vibe.toLowerCase()} trip`,
          `Hidden gems and local food in ${destination || "Goa"}`
        ]}
      />

      {/* ============ STICKY DOCK ============ */}
      <div className="spDock">
        <div>
          <small>Best funded payable</small>
          <b>{inr(payable)}</b>
        </div>
        <button type="button" onClick={() => void build()} disabled={loading}>
          {loading ? "Researching…" : plan ? "Refresh live prices →" : "Lock my smart stack →"}
        </button>
      </div>
              </div>
            </section>
          )}
        </div>
      )}

      <div className={toast ? "tpToast show" : "tpToast"} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  );
}
