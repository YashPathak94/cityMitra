import { ImageResponse } from "next/og";
import { getBlogPost } from "@/data/blog-posts";

export const alt = "CityMitra blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Per-post OG card: post title + tags on the brand gradient, so every share
// into WhatsApp/X/LinkedIn gets a rich preview instead of a bare link.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const title = post?.title || "CityMitra Blog";
  const tags = post?.tags?.slice(0, 3) || [];

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
          <div style={{ display: "flex", fontSize: 24, color: "rgba(255,255,255,0.6)" }}>Blog</div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 60 ? 54 : 64,
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: -1,
            maxWidth: 1020
          }}
        >
          {title.slice(0, 110)}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#fdba74",
                  border: "2px solid rgba(253,186,116,0.45)",
                  borderRadius: 999,
                  padding: "8px 22px"
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#fdba74" }}>ctmitra.com</div>
        </div>
      </div>
    ),
    size
  );
}
