import { categories, CategoryKey } from "@/data/city-directory";

export type NearbyCard = {
  name: string;
  area: string;
  eta: string;
  query: string;
  category?: CategoryKey;
  image?: string;
  why?: string;
};

export type UserLocation = {
  lat: number;
  lng: number;
  city?: string;
};

export const locationPromptKey = "citymitra-location-prompt-choice";
export const locationDataKey = "citymitra-user-location";

export const knownChatCities = [
  "Agra",
  "Ahmedabad",
  "Amritsar",
  "Ayodhya",
  "Bhopal",
  "Chandigarh",
  "Chennai",
  "Delhi",
  "Goa",
  "Guwahati",
  "Indore",
  "Jaipur",
  "Kanpur",
  "Kochi",
  "Kolkata",
  "Leh",
  "Lucknow",
  "Mumbai",
  "Mysuru",
  "Pune",
  "Prayagraj",
  "Rishikesh",
  "Shimla",
  "Shillong",
  "Varanasi"
];

export const cityAliases: Record<string, string> = {
  allahabad: "Prayagraj",
  bangalore: "Bengaluru",
  benaras: "Varanasi",
  bombay: "Mumbai",
  calcutta: "Kolkata"
};

export const cityVisuals: Record<string, { image: string; label: string; position: string }> = {
  Agra: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Taj%20Mahal%20in%20March%202004.jpg",
    label: "Agra heritage",
    position: "center"
  },
  Ayodhya: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ram%20Mandir%2C%20Ayodhya%20Dham.jpg",
    label: "Ayodhya dham",
    position: "center"
  },
  Indore: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rajwada%2C%20Indore.jpg",
    label: "Indore city",
    position: "center"
  },
  Delhi: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Red%20Fort%20in%20Delhi%2003-2016%20img1.jpg",
    label: "Delhi markets",
    position: "center"
  },
  Mumbai: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Gateway%20Of%20India.jpg",
    label: "Mumbai streets",
    position: "center"
  },
  Bengaluru: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Vidhana%20Soudha-1-bangalore-India.jpg",
    label: "Bengaluru city",
    position: "center"
  },
  Jaipur: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Hawa%20Mahal%20Jaipur%20front%20view.jpg",
    label: "Jaipur bazaar",
    position: "center"
  },
  Surat: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Surat%20Clock%20Tower.jpg",
    label: "Surat trade",
    position: "center"
  },
  Hyderabad: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Charminar%20Hyderabad%201.jpg",
    label: "Hyderabad heritage",
    position: "center"
  },
  Leh: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Leh%20Palace%2C%20Leh%2C%20Ladakh.jpg",
    label: "Leh Ladakh",
    position: "center"
  },
  Prayagraj: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Sangam-Prayagraj.jpg",
    label: "Prayagraj ghats",
    position: "center"
  },
  Varanasi: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Varanasi%20Ghats%20on%20the%20Ganges.jpg",
    label: "Varanasi ghats",
    position: "center"
  },
  Kolkata: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Victoria%20Memorial%20situated%20in%20Kolkata.jpg",
    label: "Kolkata city",
    position: "center"
  },
  Pune: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Shaniwar%20wada%20Pune.jpg",
    label: "Pune city",
    position: "center"
  }
};

export const categoryResultBlueprints: Record<CategoryKey, string[]> = {
  markets: ["main wholesale market", "old city bazaar", "textile market", "daily trade lanes", "wedding goods market", "spice market", "hardware market", "paper market", "commercial street", "bulk buying area"],
  sarees: ["silk saree store", "wedding saree showroom", "handloom saree market", "designer saree boutique", "traditional saree lane", "lehenga saree stores", "cotton saree shop", "bridal shopping area", "family saree showroom", "ethnic wear market"],
  electronics: ["electronics market", "mobile repair market", "computer parts store", "camera shop", "gadget mall", "laptop repair center", "appliance showroom", "component market", "authorized electronics store", "gaming accessories shop"],
  hospitals: ["multi specialty hospital", "emergency hospital", "diagnostic center", "children hospital", "orthopedic hospital", "eye hospital", "dental clinic", "cardiac hospital", "pharmacy near hospital", "urgent care clinic"],
  malls: ["shopping mall", "cinema mall", "family mall", "premium mall", "food court mall", "kids activity mall", "brand outlet mall", "lifestyle mall", "parking friendly mall", "late evening mall"],
  play: ["play arena", "bowling arcade", "trampoline park", "sports complex", "kids play zone", "go karting", "gaming cafe", "football turf", "badminton court", "adventure park"],
  schools: ["CBSE school", "ICSE school", "international school", "boarding school", "primary school", "senior secondary school", "preschool", "coaching hub", "music school", "sports academy"],
  food: ["street food market", "breakfast place", "local snacks", "famous sweets", "cafe street", "family restaurant", "quick bites", "chaat corner", "bakery", "late night food"],
  grooming: ["premium salon", "men grooming salon", "bridal makeup studio", "spa", "barber shop", "skin clinic", "nail studio", "wedding grooming package", "unisex salon", "hair treatment salon"],
  repair: ["car repair workshop", "bike service center", "puncture repair", "authorized service center", "highway mechanic", "battery shop", "tyre shop", "washing service", "emergency mechanic", "spare parts market"],
  petrol: ["petrol pump", "CNG station", "EV charging station", "highway fuel station", "24 hour petrol pump", "diesel pump", "fuel station with air", "petrol pump near market", "fuel station near hotel", "fuel station near route"],
  hotels: ["business hotel", "budget hotel", "family hotel", "premium hotel", "boutique stay", "hotel near railway station", "hotel near airport", "homestay", "resort", "hotel with parking"],
  dinner: ["fine dining restaurant", "rooftop restaurant", "family dinner restaurant", "date night restaurant", "local cuisine dinner", "buffet restaurant", "late night dinner", "veg restaurant", "non veg restaurant", "river view restaurant"],
  sightseeing: ["heritage site", "viewpoint", "museum", "temple", "fort", "lake", "garden", "walking tour", "photo spot", "sunset point"]
};

export function titleCaseCity(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

const cityIntentWords = new Set([
  "about",
  "area",
  "areas",
  "best",
  "budget",
  "cafes",
  "category",
  "city",
  "dining",
  "dinner",
  "electronics",
  "eateries",
  "food",
  "fuel",
  "guide",
  "hospital",
  "hospitals",
  "hotel",
  "hotels",
  "market",
  "markets",
  "mall",
  "malls",
  "map",
  "near",
  "nearby",
  "petrol",
  "places",
  "planner",
  "repair",
  "route",
  "saree",
  "sarees",
  "school",
  "schools",
  "shopping",
  "sightseeing",
  "spots",
  "store",
  "stores",
  "tour",
  "travel",
  "trip",
  "vehicle",
  "visit",
  "with",
  "wholesale"
]);

const cityDetectorPatterns = [
  /\b(?:about|city|in|to|near|around|at|for|visit|visiting)\s+([a-z][a-z\s]{2,44}?)(?=\s+(?:for|with|trip|travel|planner|hotels?|food|eateries|map|places?|route|shopping|markets?|hospital|petrol|repair|dinner|sightseeing|cafes?|mall|stores?)\b|[?.!,]|$)/i,
  /\b(?:plan|make|create|build|suggest|show|find)\s+(?:a\s+)?(?:trip|travel|planner|route|guide|places?)?\s*(?:for|to|in)?\s+([a-z][a-z\s]{2,44}?)(?=\s+(?:trip|travel|planner|route|guide|with|for|hotels?|food|places?|map)\b|[?.!,]|$)/i,
  /^([a-z][a-z\s]{2,44}?)(?=\s+(?:trip|travel|planner|hotels?|food|eateries|map|places?|tour|guide|route|shopping|markets?|hospital|petrol|repair|dinner|sightseeing|cafes?|mall)\b|[?.!,]|$)/i
];

export const categoryKeywords: Array<{ key: CategoryKey; words: string[] }> = [
  { key: "markets", words: ["wholesale", "market", "markets", "shopkeeper", "stores", "shopping"] },
  { key: "sarees", words: ["saree", "sarees", "silk"] },
  { key: "electronics", words: ["electronics", "mobile", "laptop", "computer"] },
  { key: "hospitals", words: ["hospital", "hospitals", "clinic", "medical"] },
  { key: "malls", words: ["mall", "malls"] },
  { key: "play", words: ["play", "arena", "games", "sports"] },
  { key: "schools", words: ["school", "schools", "college", "education"] },
  { key: "food", words: ["food", "eateries", "cafe", "cafes", "snacks"] },
  { key: "grooming", words: ["groom", "grooming", "salon", "barber"] },
  { key: "repair", words: ["repair", "mechanic", "garage", "vehicle", "auto"] },
  { key: "petrol", words: ["petrol", "fuel", "pump", "pumps"] },
  { key: "hotels", words: ["hotel", "hotels", "stay", "stays"] },
  { key: "dinner", words: ["dinner", "dining", "restaurant", "restaurants"] },
  { key: "sightseeing", words: ["sightseeing", "places", "tour", "viewpoint", "viewpoints"] }
];

export function cleanCityCandidate(value: string) {
  const words = value
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !cityIntentWords.has(word));

  if (words.length === 0 || words.length > 4) return null;

  const cityGuess = titleCaseCity(words.join(" "));
  return cityGuess.length > 2 ? cityGuess : null;
}

export function detectCityFromMessage(message: string) {
  const lowerMessage = message.toLowerCase();
  const aliasMatch = Object.entries(cityAliases).find(([alias]) => new RegExp(`\\b${alias}\\b`, "i").test(message));

  if (aliasMatch) return aliasMatch[1];

  const knownMatch = knownChatCities.find((knownCity) => new RegExp(`\\b${knownCity}\\b`, "i").test(message));

  if (knownMatch) return knownMatch;

  const patternMatch = cityDetectorPatterns.map((pattern) => lowerMessage.match(pattern)).find(Boolean);

  if (!patternMatch) return null;

  return cleanCityCandidate(patternMatch[1]);
}

// High-confidence only: matches an explicitly named known city or alias. Used by
// the chat so commands like "plan a trip" never get mis-read as a city named
// "Plan" and swap the selected city / background image.
export function detectKnownCity(message: string) {
  const aliasMatch = Object.entries(cityAliases).find(([alias]) => new RegExp(`\\b${alias}\\b`, "i").test(message));

  if (aliasMatch) return aliasMatch[1];

  return knownChatCities.find((knownCity) => new RegExp(`\\b${knownCity}\\b`, "i").test(message)) || null;
}

export function detectCategoryFromText(value: string) {
  const lowerValue = value.toLowerCase();
  const directMatch = categories.find(
    (item) => lowerValue.includes(item.key) || lowerValue.includes(item.label.toLowerCase())
  );

  if (directMatch) return directMatch.key;

  return categoryKeywords.find((item) => item.words.some((word) => new RegExp(`\\b${word}\\b`, "i").test(value)))?.key || null;
}

export function cityImageUrl(cityName: string, topic = "city") {
  return `/api/city-image?city=${encodeURIComponent(cityName)}&topic=${encodeURIComponent(topic)}`;
}

export function photoSearchImage(cityName: string, topic: string, index = 0) {
  return `/api/city-image?city=${encodeURIComponent(cityName)}&topic=${encodeURIComponent(`${topic} ${index}`)}`;
}

export function buildGeneratedResults(cityName: string, categoryKey: CategoryKey, count = 10): NearbyCard[] {
  const selected = categories.find((item) => item.key === categoryKey);
  const blueprints = categoryResultBlueprints[categoryKey] || categoryResultBlueprints.sightseeing;

  return blueprints.slice(0, count).map((topic, index) => ({
    name: `${titleCaseCity(topic)} in ${cityName}`,
    area: index < 3 ? "Top city zone" : index < 7 ? "Nearby cluster" : "Backup option",
    eta: index < 4 ? "15-30 min map check" : index < 8 ? "30-45 min map check" : "Verify traffic",
    query: `${topic} in ${cityName}`,
    category: categoryKey,
    image: photoSearchImage(cityName, topic, index),
    why: `${selected?.label || "City"} option curated for quick comparison, maps, photos, and fallback planning.`
  }));
}

export function buildCategoryMatrix(cityName: string) {
  return categories.map((item) => ({
    ...item,
    results: buildGeneratedResults(cityName, item.key, 10)
  }));
}

export function escapeHtml(value: string) {
  return value.replace(/[<>&"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[char] || char);
}
