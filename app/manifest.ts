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
    theme_color: "#ea580c"
  };
}
