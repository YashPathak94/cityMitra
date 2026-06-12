import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function GET(request: NextRequest) {
  const lat = Number(request.nextUrl.searchParams.get("lat"));
  const lng = Number(request.nextUrl.searchParams.get("lng"));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("zoom", "10");
  url.searchParams.set("addressdetails", "1");

  try {
    const response = await fetch(url, {
      headers: {
        "Accept-Language": "en-IN,en;q=0.9",
        "User-Agent": "CityMitra/1.0 reverse location"
      },
      next: { revalidate: 3600 }
    });
    const payload = await response.json();
    const address = payload?.address || {};
    const city =
      address.city ||
      address.town ||
      address.municipality ||
      address.county ||
      address.state_district ||
      address.state;

    if (!city) {
      return NextResponse.json({ city: null });
    }

    return NextResponse.json({
      city: titleCase(String(city)),
      displayName: payload?.display_name || null
    });
  } catch {
    return NextResponse.json({ city: null }, { status: 200 });
  }
}
