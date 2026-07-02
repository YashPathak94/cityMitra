import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  coerceFuelStops,
  coerceHopPoints,
  coerceLocalEmergencyContacts,
  coerceRouteOptions,
  DISCLAIMER,
  PREFERENCE_LABELS,
  RoutePlan,
  RoutePlanInput,
  RoutePreference,
  TravelMode
} from "@/lib/route-plan";

export const runtime = "nodejs";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const TRAVEL_MODES: TravelMode[] = ["car", "bike", "cab"];
const PREFERENCES: RoutePreference[] = ["avoidTolls", "scenicRoute", "fastestRoute", "avoidNightDriving"];

function sanitize(body: Record<string, unknown>): RoutePlanInput | null {
  const origin = String(body.origin || "").slice(0, 80).trim();
  const destination = String(body.destination || "").slice(0, 80).trim();
  if (!origin || !destination) return null;

  const travelMode = String(body.travelMode || "car") as TravelMode;
  const preferences = Array.isArray(body.preferences)
    ? (body.preferences.map(String).filter((p) => PREFERENCES.includes(p as RoutePreference)) as RoutePreference[])
    : [];

  return {
    origin,
    destination,
    travelMode: TRAVEL_MODES.includes(travelMode) ? travelMode : "car",
    preferences: preferences.slice(0, 4)
  };
}

function unavailablePlan(input: RoutePlanInput): RoutePlan {
  return {
    ...input,
    distanceKm: 0,
    durationHoursMin: 0,
    durationHoursMax: 0,
    bestTimeToTravel: "",
    routeOptions: [],
    hopPoints: [],
    localItineraryTips: [],
    fuelStops: [],
    localEmergencyContacts: [],
    disclaimer: DISCLAIMER,
    source: "unavailable"
  };
}

export async function POST(request: NextRequest) {
  const limit = rateLimit(`route-plan:${clientIp(request)}`, 10, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const input = sanitize(body);
  if (!input) {
    return NextResponse.json({ error: "Please enter both a starting point and a destination." }, { status: 400 });
  }

  if (!openai) {
    return NextResponse.json({ plan: unavailablePlan(input) });
  }

  const prefLabels = input.preferences.map((p) => PREFERENCE_LABELS[p]);
  const prompt =
    `You are CityMitra's road-trip route-planning assistant for Indian travellers. Using general knowledge of Indian ` +
    `roads and highways, generate a realistic but APPROXIMATE route plan for a private vehicle under normal (non-monsoon, ` +
    `non-landslide) conditions. This is NOT live traffic or verified data — always frame numbers as typical/approximate, ` +
    `never as guaranteed or live facts. Never state exact live traffic, current road closures, or current fuel prices as fact.\n\n` +
    `Trip: from ${input.origin} to ${input.destination}. Travel mode: ${input.travelMode}. ` +
    `User preferences: ${prefLabels.join(", ") || "none specified"}. Apply these to how you frame/select route options ` +
    `(e.g. if avoiding tolls, prefer/label toll-free options; if scenic, prioritise a scenic option; if avoiding night ` +
    `driving, note an early-departure recommendation in bestTimeToTravel).\n\n` +
    `For remote or mountain routes (e.g. involving Leh, Spiti, or high mountain passes), include altitude ` +
    `acclimatisation guidance and seasonal road-closure cautions in bestTimeToTravel.\n\n` +
    `Return ONLY JSON: {` +
    `"distanceKm": number (approximate total driving distance), ` +
    `"durationHoursMin": number, "durationHoursMax": number (typical non-stop driving time range in hours), ` +
    `"bestTimeToTravel": string (<=200 chars, season + time-of-day guidance specific to this route), ` +
    `"routeOptions": [{"name":string(<=60),"viaSummary":string(<=100),"distanceKm":number,"durationHours":number,"roadCondition":string(<=140),"pros":string[](<=3 items, each <=90 chars),"cons":string[](<=3 items, each <=90 chars)}] ` +
    `(2-3 realistically distinct route options if they exist; if there is genuinely only one sensible road route, return just 1), ` +
    `"hopPoints": [{"name":string(<=60, a real town/city along the way),"distanceFromOriginKm":number,"stopType":string(<=40, e.g. "fuel + food" or "overnight halt"),"note":string(<=140)}] (6-10, roughly ordered along the route), ` +
    `"localItineraryTips": string[] (4-6 items, each <=180 chars — things worth doing/seeing at hop points or the destination), ` +
    `"fuelStops": [{"areaName":string(<=60, a general town/area name, not a specific brand or address you cannot verify),"types":string[] (subset of "Petrol","Diesel","CNG","EV Charging"),"note":string(<=140)}] (4-8), ` +
    `"localEmergencyContacts": [{"label":string(<=60),"number":string(<=20),"region":string(<=60)}] (2-6 region/state-specific helplines relevant to this route, e.g. state highway police or a district hospital helpline — do NOT repeat national numbers 112, 100, 101, 108, 1091, 1098, those are shown separately)}.`;

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
      const plan: RoutePlan = {
        ...input,
        distanceKm: Math.min(5000, Math.max(0, Math.round(Number(parsed.distanceKm) || 0))),
        durationHoursMin: Math.min(300, Math.max(0, Number(parsed.durationHoursMin) || 0)),
        durationHoursMax: Math.min(300, Math.max(0, Number(parsed.durationHoursMax) || 0)),
        bestTimeToTravel: String(parsed.bestTimeToTravel || "").slice(0, 200).trim(),
        routeOptions: coerceRouteOptions(parsed.routeOptions),
        hopPoints: coerceHopPoints(parsed.hopPoints),
        localItineraryTips: Array.isArray(parsed.localItineraryTips)
          ? parsed.localItineraryTips.map((t) => String(t).slice(0, 180).trim()).filter(Boolean).slice(0, 6)
          : [],
        fuelStops: coerceFuelStops(parsed.fuelStops),
        localEmergencyContacts: coerceLocalEmergencyContacts(parsed.localEmergencyContacts),
        disclaimer: DISCLAIMER,
        source: "ai"
      };
      return NextResponse.json({ plan });
    }
  } catch (error) {
    console.error("route-plan generation failed", error);
  }

  return NextResponse.json({ plan: unavailablePlan(input) });
}
