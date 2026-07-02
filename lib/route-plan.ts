// Route Planner (Phase 1): no paid mapping/routing API is wired in yet, so
// distance, timing, hop points, fuel stops and local contacts are AI
// estimates for planning only — never treated as live/verified data. The
// live, authoritative route (with real traffic + drag-to-reroute) is always
// one click away via the Google Maps deep link built in lib/maps.ts.

export type TravelMode = "car" | "bike" | "cab";

export type RoutePreference = "avoidTolls" | "scenicRoute" | "fastestRoute" | "avoidNightDriving";

export type RoutePlanInput = {
  origin: string;
  destination: string;
  travelMode: TravelMode;
  preferences: RoutePreference[];
};

export type RouteOption = {
  name: string;
  viaSummary: string;
  distanceKm: number;
  durationHours: number;
  roadCondition: string;
  pros: string[];
  cons: string[];
};

export type HopPoint = {
  name: string;
  distanceFromOriginKm: number;
  stopType: string;
  note: string;
};

export type FuelStop = {
  areaName: string;
  types: string[];
  note: string;
};

export type LocalEmergencyContact = {
  label: string;
  number: string;
  region: string;
};

export type RoutePlan = {
  origin: string;
  destination: string;
  travelMode: TravelMode;
  preferences: RoutePreference[];
  distanceKm: number;
  durationHoursMin: number;
  durationHoursMax: number;
  bestTimeToTravel: string;
  routeOptions: RouteOption[];
  hopPoints: HopPoint[];
  localItineraryTips: string[];
  fuelStops: FuelStop[];
  localEmergencyContacts: LocalEmergencyContact[];
  disclaimer: string;
  source: "ai" | "unavailable";
};

export const PREFERENCE_LABELS: Record<RoutePreference, string> = {
  avoidTolls: "Avoid tolls",
  scenicRoute: "Scenic route",
  fastestRoute: "Fastest route",
  avoidNightDriving: "Avoid night driving"
};

export const TRAVEL_MODE_LABELS: Record<TravelMode, string> = {
  car: "Car",
  bike: "Bike",
  cab: "Cab"
};

// India's official, pan-India helplines — kept to only the numbers we're
// confident are correct and current, hardcoded rather than left to an AI
// guess. Always shown first; these are the numbers a traveller can actually
// trust in an emergency, before anything AI-suggested below them.
export const NATIONAL_EMERGENCY_NUMBERS: LocalEmergencyContact[] = [
  { label: "All-in-one emergency (police / fire / medical)", number: "112", region: "All India" },
  { label: "Ambulance", number: "108", region: "Most states" },
  { label: "Police", number: "100", region: "All India" },
  { label: "Fire", number: "101", region: "All India" },
  { label: "Women's helpline", number: "1091", region: "All India" },
  { label: "Child helpline", number: "1098", region: "All India" }
];

export const DISCLAIMER =
  "Route, distance, timing, fuel-stop and local-contact details on this page are AI-generated estimates for planning " +
  "only — not live traffic or verified local data. Confirm road conditions, timings and local emergency contacts " +
  "before you travel, and use the Google Maps link above for live, turn-by-turn, traffic-aware navigation.";

function num(value: unknown, min: number, max: number, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n * 10) / 10));
}

function str(value: unknown, max: number): string {
  return String(value ?? "").trim().slice(0, max);
}

function strArray(value: unknown, itemMax: number, arrMax: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => str(item, itemMax))
    .filter(Boolean)
    .slice(0, arrMax);
}

export function coerceRouteOptions(value: unknown): RouteOption[] {
  if (!Array.isArray(value)) return [];
  const out: RouteOption[] = [];
  for (const item of value) {
    const record = item as Record<string, unknown>;
    const name = str(record.name, 60);
    if (!name) continue;
    out.push({
      name,
      viaSummary: str(record.viaSummary, 100),
      distanceKm: num(record.distanceKm, 1, 5000, 0),
      durationHours: num(record.durationHours, 0.5, 200, 0),
      roadCondition: str(record.roadCondition, 140),
      pros: strArray(record.pros, 90, 3),
      cons: strArray(record.cons, 90, 3)
    });
    if (out.length >= 3) break;
  }
  return out;
}

export function coerceHopPoints(value: unknown): HopPoint[] {
  if (!Array.isArray(value)) return [];
  const out: HopPoint[] = [];
  for (const item of value) {
    const record = item as Record<string, unknown>;
    const name = str(record.name, 60);
    if (!name) continue;
    out.push({
      name,
      distanceFromOriginKm: num(record.distanceFromOriginKm, 0, 5000, 0),
      stopType: str(record.stopType, 40),
      note: str(record.note, 140)
    });
    if (out.length >= 10) break;
  }
  return out.sort((a, b) => a.distanceFromOriginKm - b.distanceFromOriginKm);
}

export function coerceFuelStops(value: unknown): FuelStop[] {
  if (!Array.isArray(value)) return [];
  const allowedTypes = new Set(["Petrol", "Diesel", "CNG", "EV Charging"]);
  const out: FuelStop[] = [];
  for (const item of value) {
    const record = item as Record<string, unknown>;
    const areaName = str(record.areaName, 60);
    if (!areaName) continue;
    const types = Array.isArray(record.types)
      ? record.types.map((t) => str(t, 20)).filter((t) => allowedTypes.has(t)).slice(0, 4)
      : [];
    out.push({ areaName, types, note: str(record.note, 140) });
    if (out.length >= 8) break;
  }
  return out;
}

export function coerceLocalEmergencyContacts(value: unknown): LocalEmergencyContact[] {
  if (!Array.isArray(value)) return [];
  const out: LocalEmergencyContact[] = [];
  for (const item of value) {
    const record = item as Record<string, unknown>;
    const label = str(record.label, 60);
    const number = str(record.number, 20);
    if (!label || !number) continue;
    out.push({ label, number, region: str(record.region, 60) });
    if (out.length >= 6) break;
  }
  return out;
}
