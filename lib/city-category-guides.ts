import { categories, categoryBySlug, type CategoryKey } from "@/data/city-directory";
import { getCityCategoryOverride } from "@/data/city-category-overrides";
import { categoryProfiles } from "@/data/city-category-profiles";
import { cityGuides, getCityGuide } from "@/data/city-guides";
import { categoryResultBlueprints, titleCaseCity } from "@/lib/city-intel";

export type CategoryDiscovery = {
  name: string;
  area: string;
  summary: string;
  bestFor: string;
  query: string;
  sourceUrl?: string;
  website?: string;
  phone?: string;
  image?: string;
  checkedOn?: string;
  recordType: "source-backed" | "area-discovery";
};

function stableOffset(value: string, size: number) {
  if (size <= 0) return 0;
  return [...value].reduce((sum, character) => sum + character.charCodeAt(0), 0) % size;
}

export function getCityCategoryGuide(citySlug: string, categorySlug: string) {
  const city = getCityGuide(citySlug);
  const category = categoryBySlug(categorySlug);
  if (!city || !category) return null;

  const profile = categoryProfiles[category.key];
  const override = getCityCategoryOverride(city.slug, category.key);
  const blueprints = categoryResultBlueprints[category.key];
  const areaDiscoveries: CategoryDiscovery[] = blueprints.slice(0, 8).map((topic, index) => {
    const area = city.keyAreas[index % city.keyAreas.length];
    return {
      name: `${titleCaseCity(topic)} around ${area.name}`,
      area: area.name,
      summary: `${area.name} is known for ${area.knownFor}. Use this as a discovery zone, then compare current listings on Maps before leaving.`,
      bestFor: `${category.label} searches near a known ${city.name} cluster`,
      query: `${topic} near ${area.name} ${city.name}`,
      recordType: "area-discovery"
    };
  });

  const sourceBacked: CategoryDiscovery[] = (override?.places || []).map((place) => ({
    ...place,
    query: place.mapQuery,
    recordType: "source-backed"
  }));

  const start = stableOffset(`${city.slug}:${category.key}`, categories.length);
  const relatedCategories = Array.from({ length: categories.length }, (_, index) => categories[(start + index) % categories.length])
    .filter((item) => item.key !== category.key)
    .slice(0, 8);

  return {
    city,
    category,
    profile,
    override,
    discoveries: [...sourceBacked, ...areaDiscoveries].slice(0, 10),
    relatedCategories,
    intro:
      override?.intro ||
      `${profile.intro} In ${city.name}, plan this around ${city.keyAreas.slice(0, 3).map((area) => area.name).join(", ")} rather than treating the whole city as one search result.`,
    uniqueSummary: `${city.localBrief.description} For ${category.label.toLowerCase()}, CityMitra prioritises ${profile.compare.join(", ").toLowerCase()}.`
  };
}

export function cityCategoryStaticParams() {
  return cityGuides.flatMap((city) => categories.map((category) => ({ slug: city.slug, category: category.slug })));
}

export function categoryUrl(citySlug: string, categoryKey: CategoryKey) {
  const category = categories.find((item) => item.key === categoryKey);
  return `/cities/${citySlug}/${category?.slug || categoryKey}`;
}
