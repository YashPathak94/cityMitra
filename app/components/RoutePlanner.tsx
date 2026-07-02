"use client";

import {
  AlertTriangle,
  Bike,
  Car,
  Check,
  Clock,
  Download,
  ExternalLink,
  Fuel,
  MapPin,
  Phone,
  Printer,
  Route,
  Sparkles
} from "lucide-react";
import { FormEvent, useState } from "react";
import { indiaCities } from "@/lib/india-cities";
import { mapDirectionsBetween } from "@/lib/maps";
import { downloadRoutePlanText, openRoutePlanPdf } from "@/lib/route-plan-export";
import { NATIONAL_EMERGENCY_NUMBERS, PREFERENCE_LABELS, RoutePlan, RoutePreference, TravelMode } from "@/lib/route-plan";

const travelModeMeta: Record<TravelMode, { label: string; icon: typeof Car }> = {
  car: { label: "Car", icon: Car },
  bike: { label: "Bike", icon: Bike },
  cab: { label: "Cab", icon: Car }
};
const allModes = Object.keys(travelModeMeta) as TravelMode[];
const allPreferences = Object.keys(PREFERENCE_LABELS) as RoutePreference[];

export default function RoutePlanner() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [travelMode, setTravelMode] = useState<TravelMode>("car");
  const [preferences, setPreferences] = useState<RoutePreference[]>([]);
  const [plan, setPlan] = useState<RoutePlan | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function togglePreference(pref: RoutePreference) {
    setPreferences((current) => (current.includes(pref) ? current.filter((p) => p !== pref) : [...current, pref]));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!origin.trim() || !destination.trim()) {
      setError("Enter both a starting point and a destination.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/route-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination, travelMode, preferences })
      });
      const data = (await response.json().catch(() => ({}))) as { plan?: RoutePlan; error?: string };
      if (!response.ok || !data.plan) {
        setError(data.error || "Could not plan this route. Please try again.");
        return;
      }
      setPlan(data.plan);
      setSelectedRouteIndex(0);
      setTimeout(() => document.getElementById("routeResult")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch {
      setError("Could not reach the route planner. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const selectedRoute = plan?.routeOptions[selectedRouteIndex];
  const mapsUrl = plan
    ? mapDirectionsBetween(plan.origin, plan.destination, {
        avoidTolls: plan.preferences.includes("avoidTolls")
      })
    : "";

  return (
    <div className="travelPlan">
      <header className="travelPlanHero">
        <span className="travelPlanBadge">
          <Route size={15} /> Phase 1 · AI route planner
        </span>
        <h1>
          Plan the drive. <span>Not just the destination.</span>
        </h1>
        <p>
          Enter where you&apos;re starting from and where you&apos;re headed. CityMitra&apos;s AI sketches route options, hop
          points, fuel stops and local tips — then hands you off to Google Maps for the live, turn-by-turn drive.
        </p>
      </header>

      <div className="travelPlanGrid" id="routeResult">
        <form className="travelPlanForm" onSubmit={submit}>
          <datalist id="indiaCitiesListRoute">
            {indiaCities.map((cityName) => (
              <option key={cityName} value={cityName} />
            ))}
          </datalist>

          <div className="travelPlanRow">
            <label>
              From
              <input
                list="indiaCitiesListRoute"
                placeholder="Starting point"
                value={origin}
                onChange={(event) => setOrigin(event.target.value)}
              />
            </label>
            <label>
              To
              <input
                list="indiaCitiesListRoute"
                placeholder="Destination"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
              />
            </label>
          </div>

          <div className="travelPlanField">
            <span className="travelPlanFieldLabel">Travelling by</span>
            <div className="travelPlanChips">
              {allModes.map((mode) => {
                const Icon = travelModeMeta[mode].icon;
                return (
                  <button
                    type="button"
                    key={mode}
                    className={travelMode === mode ? "chip active" : "chip"}
                    onClick={() => setTravelMode(mode)}
                  >
                    <Icon size={15} /> {travelModeMeta[mode].label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="travelPlanField">
            <span className="travelPlanFieldLabel">Preferences</span>
            <div className="travelPlanChips">
              {allPreferences.map((pref) => (
                <button
                  type="button"
                  key={pref}
                  className={preferences.includes(pref) ? "chip active" : "chip"}
                  onClick={() => togglePreference(pref)}
                >
                  {preferences.includes(pref) ? <Check size={14} /> : null} {PREFERENCE_LABELS[pref]}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="travelPlanError">{error}</p>}

          <button type="submit" className="travelPlanSubmit" disabled={loading}>
            {loading ? "Planning your route…" : plan ? "Regenerate route" : "Plan my route"}
          </button>
        </form>

        <div className="travelPlanResult">
          {!plan && !loading && (
            <div className="travelPlanEmpty">
              <MapPin size={26} />
              <p>Your route breakdown, hop points, fuel stops and emergency numbers will appear here.</p>
            </div>
          )}

          {loading && (
            <div className="travelPlanEmpty">
              <span className="travelPlanSpinner" />
              Sketching route options, hop points &amp; local tips…
            </div>
          )}

          {plan && !loading && (
            <div className="planStack">
              <section className="planStackCard">
                <div className="routePlanSummaryTop">
                  <h2>
                    {plan.origin} <span>&rarr;</span> {plan.destination}
                  </h2>
                  <span className={plan.source === "ai" ? "travelPlanSource ai" : "travelPlanSource warn"}>
                    <Sparkles size={12} />{" "}
                    {plan.source === "ai" ? "AI-generated · verify before travelling" : "AI unavailable · showing verified numbers + Maps only"}
                  </span>
                </div>

                {plan.source === "ai" && (
                  <div className="travelPlanStats">
                    <div>
                      <b>~{plan.distanceKm} km</b>
                      <span>Approx. distance</span>
                    </div>
                    <div>
                      <b>
                        {plan.durationHoursMin}–{plan.durationHoursMax} hrs
                      </b>
                      <span>Approx. drive time</span>
                    </div>
                    <div className="routePlanBestTime">
                      <Clock size={16} />
                      <span>{plan.bestTimeToTravel || "No specific timing guidance"}</span>
                    </div>
                  </div>
                )}

                <a className="routePlanMapsCta" href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} /> Open live route in Google Maps
                </a>
                <p className="routePlanMapsNote">
                  Google Maps gives you real traffic, turn-by-turn navigation, and lets you drag the route to change it —
                  that&apos;s the live interactive map. Everything below is planning context around it.
                </p>
              </section>

              {plan.routeOptions.length > 0 && (
                <section className="planStackCard">
                  <h3 className="planSectionTitle">
                    <Route size={17} /> Route options
                  </h3>
                  <div className="routeOptionList">
                    {plan.routeOptions.map((route, index) => (
                      <button
                        type="button"
                        key={route.name + index}
                        className={index === selectedRouteIndex ? "routeOptionCard active" : "routeOptionCard"}
                        onClick={() => setSelectedRouteIndex(index)}
                      >
                        <div className="routeOptionHead">
                          <strong>{route.name}</strong>
                          <span>
                            ~{route.distanceKm} km · ~{route.durationHours} hrs
                          </span>
                        </div>
                        <p className="routeOptionVia">{route.viaSummary}</p>
                        {route.roadCondition && <p className="routeOptionRoad">{route.roadCondition}</p>}
                        {(route.pros.length > 0 || route.cons.length > 0) && (
                          <div className="routeOptionProsCons">
                            {route.pros.length > 0 && (
                              <ul className="routeOptionPros">
                                {route.pros.map((pro, i) => (
                                  <li key={i}>{pro}</li>
                                ))}
                              </ul>
                            )}
                            {route.cons.length > 0 && (
                              <ul className="routeOptionCons">
                                {route.cons.map((con, i) => (
                                  <li key={i}>{con}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedRoute && <p className="routeOptionHint">Selected: {selectedRoute.name} — reflected in the Maps link above.</p>}
                </section>
              )}

              {plan.hopPoints.length > 0 && (
                <section className="planStackCard">
                  <h3 className="planSectionTitle">
                    <MapPin size={17} /> Hop points along the way
                  </h3>
                  <ol className="hopPointList">
                    {plan.hopPoints.map((hop, index) => (
                      <li key={index}>
                        <div className="hopPointHead">
                          <strong>{hop.name}</strong>
                          <span>~{hop.distanceFromOriginKm} km in</span>
                        </div>
                        <span className="hopPointType">{hop.stopType}</span>
                        {hop.note && <p>{hop.note}</p>}
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {plan.localItineraryTips.length > 0 && (
                <section className="planStackCard">
                  <h3 className="planSectionTitle">
                    <Sparkles size={17} /> Local itinerary tips
                  </h3>
                  <ul className="dealsList">
                    {plan.localItineraryTips.map((tip, index) => (
                      <li key={index}>
                        <Check size={14} /> {tip}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {plan.fuelStops.length > 0 && (
                <section className="planStackCard">
                  <h3 className="planSectionTitle">
                    <Fuel size={17} /> Fuel &amp; charging stops
                  </h3>
                  <p className="unverifiedNote">AI-suggested general areas — verify exact stations locally before you rely on them.</p>
                  <ul className="fuelStopList">
                    {plan.fuelStops.map((stop, index) => (
                      <li key={index}>
                        <strong>{stop.areaName}</strong>
                        {stop.types.length > 0 && (
                          <span className="fuelStopTypes">
                            {stop.types.map((type) => (
                              <span key={type}>{type}</span>
                            ))}
                          </span>
                        )}
                        {stop.note && <p>{stop.note}</p>}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="planStackCard">
                <h3 className="planSectionTitle">
                  <Phone size={17} /> Emergency numbers
                </h3>
                <p className="emergencyGroupLabel emergencyGroupLabelSafe">
                  <AlertTriangle size={14} /> National — always accurate, dial these first
                </p>
                <ul className="emergencyList">
                  {NATIONAL_EMERGENCY_NUMBERS.map((contact) => (
                    <li key={contact.label}>
                      <strong>{contact.number}</strong>
                      <span>
                        {contact.label} <small>({contact.region})</small>
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.localEmergencyContacts.length > 0 && (
                  <>
                    <p className="emergencyGroupLabel emergencyGroupLabelUnverified">
                      <AlertTriangle size={14} /> Local — AI-suggested, unverified, confirm before you travel
                    </p>
                    <ul className="emergencyList">
                      {plan.localEmergencyContacts.map((contact, index) => (
                        <li key={index}>
                          <strong>{contact.number}</strong>
                          <span>
                            {contact.label} <small>({contact.region})</small>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </section>

              <section className="planStackCard">
                <div className="routePlanExportRow">
                  <button type="button" onClick={() => downloadRoutePlanText(plan, mapsUrl)}>
                    <Download size={15} /> Download plan (.txt)
                  </button>
                  <button type="button" onClick={() => openRoutePlanPdf(plan, mapsUrl)}>
                    <Printer size={15} /> Print / Save as PDF
                  </button>
                </div>
                <p className="travelPlanDisclaimer">{plan.disclaimer}</p>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
