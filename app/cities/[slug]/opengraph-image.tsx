import { ImageResponse } from "next/og";
import { getCityGuide } from "@/data/city-guides";

export const alt = "CityMitra city guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Per-city OG card: big city name + state + tagline, so shared guide links
// look like a destination card in WhatsApp/X previews.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getCityGuide(slug);
  const name = guide?.name || "City Guide";
  const state = guide?.state || "India";
  const tagline = guide?.tagline || "Markets, food, transport, and local tips.";

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
          background: "linear-gradient(135deg, #0f172a 0%, #172554 55%, #7c2d12 100%)",
          color: "#fff",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                width: 52,
                height: 52,
                borderRadius: 15,
                background: "linear-gradient(135deg, #fb923c, #ea580c 55%, #2563eb)"
              }}
            />
            <div style={{ display: "flex", fontSize: 36, fontWeight: 800 }}>CityMitra</div>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "rgba(255,255,255,0.6)" }}>City Guide</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#fdba74", textTransform: "uppercase", letterSpacing: 4 }}>
            {state}
          </div>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 800, lineHeight: 1, letterSpacing: -2 }}>{name}</div>
          <div style={{ display: "flex", fontSize: 28, color: "rgba(255,255,255,0.78)", maxWidth: 980, lineHeight: 1.35 }}>
            {tagline.slice(0, 120)}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#fdba74" }}>ctmitra.com</div>
          <div style={{ display: "flex", fontSize: 24, color: "rgba(255,255,255,0.6)" }}>
            Markets · Food · Transport · Local tips
          </div>
        </div>
      </div>
    ),
    size
  );
}
