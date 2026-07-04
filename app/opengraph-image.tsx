import { ImageResponse } from "next/og";

export const alt = "CityMitra — AI city guide for Indian cities";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site-wide default OG card (home + any page without its own opengraph-image).
// Pure text/gradient — no remote images — so link previews render instantly
// and never break on a fetch failure.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 62%, #7c2d12 100%)",
          color: "#fff",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg, #fb923c, #ea580c 55%, #2563eb)"
            }}
          />
          <div style={{ display: "flex", fontSize: 44, fontWeight: 800 }}>CityMitra</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1 }}>
            Your AI guide to Indian cities
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "rgba(255,255,255,0.75)" }}>
            Markets · Hotels · Doctors · EV charging · Travel plans · Deals
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#fdba74" }}>ctmitra.com</div>
          <div style={{ display: "flex", fontSize: 24, color: "rgba(255,255,255,0.6)" }}>
            Free · No sign-up · Map-ready picks
          </div>
        </div>
      </div>
    ),
    size
  );
}
