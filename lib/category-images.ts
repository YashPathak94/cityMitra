import { CategoryKey } from "@/data/city-directory";

const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

export type ImageTheme =
  | "hotel"
  | "food"
  | "market"
  | "wholesale"
  | "hospital"
  | "repair"
  | "electrician"
  | "fuel"
  | "gym"
  | "salon"
  | "school"
  | "city"
  | "cab"
  | "flight"
  | "ai";

// Premium, theme-matched photo sets. The first entry of each set is the most
// reliable one (used where there is no graceful fallback).
const THEMES: Record<ImageTheme, string[]> = {
  hotel: [u("1566073771259-6a8506099945"), u("1551882547-ff40c63fe5fa"), u("1564501049412-61c2a3083791")],
  food: [u("1414235077428-338989a2e8c0"), u("1517248135467-4c7edcad34c4"), u("1504674900247-0877df9cc836")],
  market: [u("1555396273-367ea4eb4db5"), u("1441986300917-64674bd600d8"), u("1488459716781-31db52582fe9")],
  wholesale: [u("1555396273-367ea4eb4db5"), u("1556740738-b6a63e27c4df"), u("1581339291435-c1c1f3b1f1f9")],
  hospital: [u("1519494026892-80bbd2d6fd0d"), u("1538108149393-fbbd81895907"), u("1586773860418-d37222d8fce3")],
  repair: [u("1530046339160-ce3e530c7d2f"), u("1486262715619-67b85e0b08d3"), u("1632823471565-1ecdf5c6da77")],
  electrician: [u("1621905251918-48416bd8575a"), u("1558618666-fcd25c85cd64")],
  fuel: [u("1545262810-77515befe149"), u("1611374243147-44a702c2d44c")],
  gym: [u("1571019613454-1cb2f99b2d8b"), u("1534438327276-14e5300c3a48")],
  salon: [u("1560066984-138dadb4c035"), u("1521590832167-7bcbfaa6381f")],
  school: [u("1503676260728-1c00da094a0b"), u("1580582932707-520aed937b7b")],
  city: [u("1524492412937-b28074a5d7da"), u("1506905925346-21bda4d32df4"), u("1480714378408-67cf0d13bc1b")],
  cab: [u("1503376780353-7e6692767b70"), u("1502877338535-766e1452684a")],
  flight: [u("1436491865332-7a61a109cc05"), u("1556388158-158ea5ccacbd")],
  ai: [u("1488646953014-85cb44e25828"), u("1498050108023-c5249f4df085")]
};

const CATEGORY_THEME: Record<CategoryKey, ImageTheme> = {
  markets: "wholesale",
  sarees: "market",
  electronics: "market",
  hospitals: "hospital",
  malls: "market",
  play: "city",
  schools: "school",
  food: "food",
  grooming: "salon",
  repair: "repair",
  petrol: "fuel",
  hotels: "hotel",
  dinner: "food",
  sightseeing: "city",
  plumber: "repair",
  electrician: "electrician",
  carpenter: "repair",
  pandit: "city",
  movers: "repair",
  gym: "gym",
  salon: "salon",
  laundry: "repair",
  acrepair: "repair",
  pestcontrol: "repair",
  doctors: "hospital",
  sportsacademy: "gym",
  evcharging: "fuel",
  restrooms: "city",
  news: "city",
  agriculture: "market"
};

export function imageForTheme(theme: ImageTheme, variant = 0): string {
  const set = THEMES[theme] || THEMES.city;
  return set[Math.abs(variant) % set.length];
}

export function imageForCategory(category: CategoryKey | undefined, variant = 0): string {
  const theme = (category && CATEGORY_THEME[category]) || "city";
  return imageForTheme(theme, variant);
}
