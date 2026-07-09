import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CityMitra",
    short_name: "CityMitra",
    description:
      "AI-powered city guide for India: markets, hospitals, hotels, food, repairs, and sightseeing with smart routes.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff7ed",
    theme_color: "#ea580c",
    icons: [
      { src: "/brand/citymitra-icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/citymitra-icon-1024.png", sizes: "1024x1024", type: "image/png" }
    ]
  };
}
