import type { CategoryKey } from "@/data/city-directory";

export type ManualPlace = {
  name: string;
  area: string;
  summary: string;
  bestFor: string;
  mapQuery: string;
  website?: string;
  phone?: string;
  image?: string;
  sourceUrl: string;
  checkedOn: string;
};

export type CityCategoryOverride = {
  intro?: string;
  editorNote?: string;
  places?: ManualPlace[];
  customPageHref?: string;
};

// Add source-backed records here. The generic route automatically prefers
// these entries over area discovery prompts. Never add a rating, phone number,
// opening time or “verified” label without a source URL and checkedOn date.
export const cityCategoryOverrides: Partial<Record<`${string}:${CategoryKey}`, CityCategoryOverride>> = {
  "delhi:markets": {
    intro: "Delhi wholesale works lane by lane. Start with the product, compare three quotes and arrange parcel movement before buying volume.",
    editorNote: "The dedicated Sadar Bazaar guide is CityMitra's handcrafted reference page for this category.",
    customPageHref: "/cities/delhi/wholesale",
    places: [
      {
        name: "Sadar Bazar Shopping",
        area: "Pahari Dhiraj, Sadar Bazaar",
        summary: "A dense wholesale cluster for household goods, toys, accessories, packaging and seasonal stock.",
        bestFor: "Buyer-first lane planning and bulk comparison",
        mapQuery: "Sadar Bazar Shopping Green Market Pahari Dhiraj New Delhi 110006",
        website: "https://sadarbazarmarket.com",
        image: "/images/delhi-wholesale/sadar-bazaar-hero.png",
        sourceUrl: "https://sadarbazarmarket.com",
        checkedOn: "2026-07-20"
      }
    ]
  }
};

export function getCityCategoryOverride(citySlug: string, categoryKey: CategoryKey) {
  return cityCategoryOverrides[`${citySlug}:${categoryKey}`];
}
