"use client";

import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  Camera,
  ChevronDown,
  ChevronUp,
  Clock3,
  Compass,
  ExternalLink,
  FileText,
  Instagram,
  Layers3,
  Linkedin,
  Mail,
  Map,
  MapPinned,
  Navigation,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Table,
  Trash2
} from "lucide-react";
import { CSSProperties, FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { categories, CategoryKey, cities, directory } from "@/data/city-directory";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type NearbyCard = {
  name: string;
  area: string;
  eta: string;
  query: string;
  category?: CategoryKey;
  image?: string;
  why?: string;
};

type UserLocation = {
  lat: number;
  lng: number;
};

type ActivityEvent = {
  type: string;
  city?: string;
  category?: string;
  label?: string;
  value?: number;
};

const starterMessage =
  "Tell me the city, vibe, budget, and time you have. I will map the spots, backup services, and time-saving route. Yes, an actual plan, not a 47-tab research spiral.";

const knownChatCities = [
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

const cityAliases: Record<string, string> = {
  allahabad: "Prayagraj",
  bangalore: "Bengaluru",
  benaras: "Varanasi",
  bombay: "Mumbai",
  calcutta: "Kolkata"
};

const cityVisuals: Record<string, { image: string; label: string; position: string }> = {
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

const categoryResultBlueprints: Record<CategoryKey, string[]> = {
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

function titleCaseCity(value: string) {
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

const categoryKeywords: Array<{ key: CategoryKey; words: string[] }> = [
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

function cleanCityCandidate(value: string) {
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

function detectCityFromMessage(message: string) {
  const lowerMessage = message.toLowerCase();
  const aliasMatch = Object.entries(cityAliases).find(([alias]) => new RegExp(`\\b${alias}\\b`, "i").test(message));

  if (aliasMatch) return aliasMatch[1];

  const knownMatch = knownChatCities.find((knownCity) => new RegExp(`\\b${knownCity}\\b`, "i").test(message));

  if (knownMatch) return knownMatch;

  const patternMatch = cityDetectorPatterns.map((pattern) => lowerMessage.match(pattern)).find(Boolean);

  if (!patternMatch) return null;

  return cleanCityCandidate(patternMatch[1]);
}

function detectCategoryFromText(value: string) {
  const lowerValue = value.toLowerCase();
  const directMatch = categories.find(
    (item) => lowerValue.includes(item.key) || lowerValue.includes(item.label.toLowerCase())
  );

  if (directMatch) return directMatch.key;

  return categoryKeywords.find((item) => item.words.some((word) => new RegExp(`\\b${word}\\b`, "i").test(value)))?.key || null;
}

function cityImageUrl(cityName: string, topic = "city") {
  return `https://source.unsplash.com/900x700/?${encodeURIComponent(`${cityName} India ${topic}`)}`;
}

function photoSearchImage(cityName: string, topic: string, index = 0) {
  return `https://source.unsplash.com/720x520/?${encodeURIComponent(`${cityName} India ${topic}`)}&sig=${encodeURIComponent(`${cityName}-${topic}-${index}`)}`;
}

function buildGeneratedResults(cityName: string, categoryKey: CategoryKey, count = 10): NearbyCard[] {
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

function buildCategoryMatrix(cityName: string) {
  return categories.map((item) => ({
    ...item,
    results: buildGeneratedResults(cityName, item.key, 10)
  }));
}

function escapeHtml(value: string) {
  return value.replace(/[<>&"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[char] || char);
}

function getSessionId() {
  if (typeof window === "undefined") return "server";

  const existingSession = window.localStorage.getItem("citymitra-session-id");
  if (existingSession) return existingSession;

  const nextSession = crypto.randomUUID();
  window.localStorage.setItem("citymitra-session-id", nextSession);
  return nextSession;
}

function trackActivity(event: ActivityEvent) {
  if (typeof window === "undefined") return;

  const payload = {
    ...event,
    path: window.location.pathname,
    sessionId: getSessionId(),
    timestamp: new Date().toISOString()
  };

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/activity", new Blob([body], { type: "application/json" }));
    return;
  }

  fetch("/api/activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  }).catch(() => undefined);
}

export default function Home() {
  const [city, setCity] = useState<string>("Delhi");
  const [category, setCategory] = useState<CategoryKey>("markets");
  const [searchText, setSearchText] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationStatus, setLocationStatus] = useState("Use nearby location for smarter map routes.");
  const [intelCategory, setIntelCategory] = useState<CategoryKey>("markets");
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const [categoryStageIndex, setCategoryStageIndex] = useState(0);
  const [categoryFrameIndex, setCategoryFrameIndex] = useState(0);
  const [question, setQuestion] = useState("Plan a Leh trip with places, altitude, hospitals, petrol, repairs, hotels and shopping.");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: starterMessage
    }
  ]);
  const [loading, setLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const visibleCities = useMemo(() => (cities.includes(city as (typeof cities)[number]) ? cities : [city, ...cities]), [city]);
  const exactDirectoryItems = directory.filter((item) => item.city === city && item.category === category);
  const categoryMatrix = useMemo(() => buildCategoryMatrix(city), [city]);
  const activeIntelIndex = Math.max(0, categoryMatrix.findIndex((item) => item.key === intelCategory));
  const activeIntelGroup = categoryMatrix[activeIntelIndex] || categoryMatrix[0];
  const activeIntelResult = activeIntelGroup.results[activeResultIndex] || activeIntelGroup.results[0];
  const generatedCategoryResults = useMemo(() => buildGeneratedResults(city, category, 10), [city, category]);
  const selectedItems: NearbyCard[] = [
    ...exactDirectoryItems.map((item) => ({
      name: item.name,
      area: item.area,
      eta: item.eta,
      query: `${item.name} ${item.area} ${item.city}`,
      category: item.category,
      why: item.tip
    })),
    ...generatedCategoryResults.filter(
      (generated) => !exactDirectoryItems.some((item) => generated.query.toLowerCase().includes(item.name.toLowerCase()))
    )
  ].slice(0, 10);
  const categoryResultStages = useMemo(
    () =>
      ["Top city zone", "Nearby cluster", "Backup option"].map((stage) => ({
        stage,
        results: selectedItems.filter((item, index) =>
          stage === "Top city zone"
            ? item.area === stage || exactDirectoryItems.some((exact) => exact.name === item.name) || index < 3
            : item.area === stage
        )
      })),
    [exactDirectoryItems, selectedItems]
  );
  const activeCategoryStage = categoryResultStages[categoryStageIndex] || categoryResultStages[0];
  const activeCategoryResult = activeCategoryStage.results[categoryFrameIndex] || activeCategoryStage.results[0];
  const topTwentyPicks = categoryMatrix.flatMap((item) => item.results.slice(0, 2)).slice(0, 20);
  const citySuggestions = directory
    .filter((item) => item.city === city && item.category !== category)
    .slice(0, 3);
  const categorySuggestions = directory
    .filter((item) => item.city !== city && item.category === category)
    .slice(0, 3);
  const seededNearbyItems: NearbyCard[] = (
    selectedItems.length > 0
      ? selectedItems
      : citySuggestions.map((item) => ({
          name: item.name,
          area: item.area,
          eta: item.eta,
          query: `${item.name} ${item.area} ${item.city}`,
          category: item.category,
          why: item.tip
        }))
  ).slice(0, 5);
  const selectedCategory = categories.find((item) => item.key === category);
  const SelectedCategoryIcon = selectedCategory?.icon;
  const cityVisual = cityVisuals[city] || {
    image: cityImageUrl(city),
    label: `${city} city`,
    position: "center"
  };
  const photoBlocks = [
    {
      title: "Hotels",
      text: "Stays near the route",
      image: photoSearchImage(city, "hotels", 1),
      query: `best hotels in ${city}`
    },
    {
      title: "Places",
      text: "Must-cover spots",
      image: photoSearchImage(city, "tourist places", 2),
      query: `best places to visit in ${city}`
    },
    {
      title: "Fine Dining",
      text: "Dinner without guesswork",
      image: photoSearchImage(city, "fine dining", 3),
      query: `fine dining restaurants in ${city}`
    },
    {
      title: selectedCategory?.label || "Category",
      text: "Selected category nearby",
      image: photoSearchImage(city, selectedCategory?.label || category, 4),
      query: `${selectedCategory?.label || category} near ${city}`
    }
  ];
  const nearbyCards: NearbyCard[] = [...seededNearbyItems, ...topTwentyPicks].slice(0, 20);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    setIntelCategory(category);
  }, [category]);

  useEffect(() => {
    setActiveResultIndex(0);
  }, [city, intelCategory]);

  useEffect(() => {
    setCategoryStageIndex(0);
    setCategoryFrameIndex(0);
  }, [city, category]);

  useEffect(() => {
    const startedAt = Date.now();
    trackActivity({ type: "page_view", city, category });

    return () => {
      trackActivity({
        type: "time_spent",
        city,
        category,
        value: Math.max(1, Math.round((Date.now() - startedAt) / 1000))
      });
    };
  }, []);

  function mapSearchUrl(query: string) {
    if (userLocation) {
      return `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${userLocation.lat},${userLocation.lng},13z`;
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  function mapDirectionsUrl(query: string) {
    if (!userLocation) return mapSearchUrl(query);

    return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${encodeURIComponent(query)}&travelmode=driving`;
  }

  function mapEmbedUrl(query: string) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=12&output=embed`;
  }

  function clearChat() {
    setMessages([{ role: "assistant", content: starterMessage }]);
    setQuestion("");
    trackActivity({ type: "chat_clear", city, category });
  }

  function selectCity(nextCity: string, label = "selector") {
    setCity(nextCity);
    trackActivity({ type: "city_change", city: nextCity, category, label });
  }

  function selectCategory(nextCategory: CategoryKey, label = "selector") {
    setCategory(nextCategory);
    setIntelCategory(nextCategory);
    trackActivity({ type: "category_change", city, category: nextCategory, label });
  }

  function moveIntelCategory(direction: -1 | 1) {
    const nextIndex = (activeIntelIndex + direction + categoryMatrix.length) % categoryMatrix.length;
    const nextCategory = categoryMatrix[nextIndex]?.key;
    if (!nextCategory) return;

    setIntelCategory(nextCategory);
    trackActivity({ type: "city_intel_category", city, category: nextCategory, label: direction > 0 ? "next" : "previous" });
  }

  function moveIntelResult(direction: -1 | 1) {
    const resultCount = activeIntelGroup.results.length || 1;
    const nextIndex = (activeResultIndex + direction + resultCount) % resultCount;
    setActiveResultIndex(nextIndex);
    trackActivity({ type: "city_intel_result", city, category: intelCategory, label: `${nextIndex + 1}` });
  }

  function moveCategoryStage(direction: -1 | 1) {
    const nextIndex = (categoryStageIndex + direction + categoryResultStages.length) % categoryResultStages.length;
    setCategoryStageIndex(nextIndex);
    setCategoryFrameIndex(0);
    trackActivity({ type: "category_stage", city, category, label: categoryResultStages[nextIndex]?.stage || "stage" });
  }

  function moveCategoryFrame(direction: -1 | 1) {
    const resultCount = activeCategoryStage.results.length || 1;
    const nextIndex = (categoryFrameIndex + direction + resultCount) % resultCount;
    setCategoryFrameIndex(nextIndex);
    trackActivity({ type: "category_result_frame", city, category, label: `${nextIndex + 1}` });
  }

  function openTrackedMap(query: string, label: string) {
    trackActivity({ type: "map_open", city, category, label });
    window.open(mapDirectionsUrl(query), "_blank", "noreferrer");
  }

  function requestNearbyLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Location is not supported in this browser. Maps will use city search instead.");
      return;
    }

    setLocationStatus("Asking browser for location permission...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6))
        };
        setUserLocation(nextLocation);
        setLocationStatus("Nearby mode on. Maps and PDF routes now start from your current location.");
        trackActivity({ type: "location_enabled", city, category, label: `${nextLocation.lat},${nextLocation.lng}` });
      },
      () => {
        setLocationStatus("Location permission was not enabled. CityMitra will still use city-level map searches.");
        trackActivity({ type: "location_denied", city, category });
      },
      { enableHighAccuracy: true, maximumAge: 300000, timeout: 10000 }
    );
  }

  function handleSceneAction(action: "sync" | "map" | "route") {
    if (action === "sync") {
      document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" });
      trackActivity({ type: "scene_action", city, category, label: "city_sync" });
      return;
    }

    if (action === "map") {
      openTrackedMap(`${selectedCategory?.label || category} near ${city}`, "scene_map_picks");
      return;
    }

    setQuestion(`Build a route plan for ${city} with ${selectedCategory?.label || "city"} stops, distance, map links, and backup services.`);
    document.getElementById("ai")?.scrollIntoView({ behavior: "smooth" });
    trackActivity({ type: "scene_action", city, category, label: "route_mode" });
  }

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedSearch = searchText.trim();
    if (!trimmedSearch) return;

    const detectedCategory = detectCategoryFromText(trimmedSearch);
    const cityFromText =
      detectCityFromMessage(trimmedSearch) ||
      cleanCityCandidate(
        categoryKeywords.reduce(
          (current, item) => item.words.reduce((text, word) => text.replace(new RegExp(`\\b${word}\\b`, "gi"), " "), current),
          trimmedSearch
        )
      );

    if (cityFromText) {
      selectCity(cityAliases[cityFromText.toLowerCase()] || cityFromText, "top_search");
    }

    if (detectedCategory) {
      selectCategory(detectedCategory, "top_search");
    }

    const activeCity = cityFromText || city;
    const activeCategory = detectedCategory
      ? categories.find((item) => item.key === detectedCategory)?.label
      : selectedCategory?.label;
    setQuestion(`Plan ${activeCity} ${activeCategory || "city"} options with nearby maps, photos, route timing, and backup stops.`);
    setSearchText("");
    trackActivity({ type: "search_submit", city: activeCity, category: detectedCategory || category, label: trimmedSearch });
  }

  function scrollChat(position: "top" | "bottom") {
    const chatWindow = chatWindowRef.current;
    if (!chatWindow) return;

    chatWindow.scrollTo({
      top: position === "top" ? 0 : chatWindow.scrollHeight,
      behavior: "smooth"
    });
  }

  function latestAssistantPlan() {
    return [...messages].reverse().find((message) => message.role === "assistant" && message.content.trim())?.content || starterMessage;
  }

  function openPdfPlan() {
    trackActivity({ type: "export_pdf", city, category });
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const plan = latestAssistantPlan();
    const sourceText = userLocation ? `${userLocation.lat}, ${userLocation.lng}` : "Current location not enabled";
    const mapPreview = mapEmbedUrl(`${city} India ${selectedCategory?.label || category}`);
    const routeRows = nearbyCards
      .map(
        (item) =>
          `<tr>
            <td><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(categories.find((cat) => cat.key === item.category)?.label || "City")}</small></td>
            <td>${escapeHtml(item.area)}</td>
            <td>${escapeHtml(item.eta)}<small>${userLocation ? "From current location: open Maps for live time" : "Enable nearby location in CityMitra for current-location routing"}</small></td>
            <td><a href="${mapDirectionsUrl(item.query)}">${escapeHtml(item.query)}</a></td>
          </tr>`
      )
      .join("");
    const selectedRows = generatedCategoryResults
      .map(
        (item, index) =>
          `<tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(item.name)}</td>
            <td>${escapeHtml(item.area)}</td>
            <td><a href="${mapDirectionsUrl(item.query)}">Open route</a></td>
          </tr>`
      )
      .join("");

    printWindow.document.write(`<!doctype html>
      <html>
        <head>
          <title>CityMitra ${city} plan</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; background: #fff7ed; color: #0f172a; font-family: Arial, sans-serif; }
            .cover { min-height: 280px; padding: 34px; color: #fff; background: linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(234, 88, 12, 0.78)), url("${cityVisual.image}"); background-size: cover; background-position: ${cityVisual.position}; }
            .kicker { color: #fed7aa; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
            h1 { max-width: 760px; margin: 10px 0; font-size: 48px; line-height: 0.95; }
            h2 { margin: 0 0 12px; font-size: 24px; }
            p { line-height: 1.55; }
            .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
            .chips span { border: 1px solid rgba(255,255,255,0.35); border-radius: 999px; background: rgba(255,255,255,0.12); padding: 8px 11px; font-size: 12px; font-weight: 800; }
            main { padding: 24px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 18px; }
            .card { border: 1px solid #fed7aa; border-radius: 12px; background: #fff; padding: 14px; box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08); }
            .card b { display: block; color: #ea580c; font-size: 22px; }
            .mapFrame { overflow: hidden; border: 4px solid #fff; border-radius: 14px; box-shadow: 0 18px 50px rgba(15, 23, 42, 0.18); }
            iframe { width: 100%; height: 300px; border: 0; }
            .plan { white-space: pre-wrap; line-height: 1.55; border-left: 5px solid #2563eb; background: #eff6ff; padding: 16px; border-radius: 12px; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0 28px; overflow: hidden; border-radius: 12px; background: #fff; }
            th, td { border: 1px solid #fed7aa; padding: 10px; text-align: left; vertical-align: top; font-size: 12px; }
            th { background: linear-gradient(135deg, #ea580c, #2563eb); color: #fff; }
            td small { display: block; margin-top: 5px; color: #64748b; line-height: 1.35; }
            a { color: #2563eb; font-weight: 800; }
            .note { border: 1px dashed #fb923c; border-radius: 12px; background: #fff7ed; padding: 14px; color: #64748b; }
            @page { margin: 14mm; }
            @media print { .cover { break-after: avoid; } a { color: #0f172a; } }
          </style>
        </head>
        <body>
          <section class="cover">
            <span class="kicker">CityMitra mature planner PDF</span>
            <h1>${escapeHtml(city)} ${escapeHtml(selectedCategory?.label || category)} Route Plan</h1>
            <p>Vibrant planner for route decisions, nearby categories, map links, photos, backup services, and time checks.</p>
            <div class="chips">
              <span>From: ${escapeHtml(sourceText)}</span>
              <span>City: ${escapeHtml(city)}</span>
              <span>Category: ${escapeHtml(selectedCategory?.label || category)}</span>
              <span>Top picks: ${nearbyCards.length}</span>
            </div>
          </section>
          <main>
            <section class="grid">
              <div class="card"><b>${categories.length}</b>categories covered</div>
              <div class="card"><b>${nearbyCards.length}</b>curated route stops</div>
              <div class="card"><b>${userLocation ? "Live" : "City"}</b>${userLocation ? "current-location routing" : "map-search routing"}</div>
            </section>
            <section class="card">
              <h2>Map Preview</h2>
              <div class="mapFrame"><iframe src="${mapPreview}" title="${escapeHtml(city)} map preview"></iframe></div>
              <p><a href="${mapDirectionsUrl(`${selectedCategory?.label || category} near ${city}`)}">Open route from ${escapeHtml(sourceText)}</a></p>
            </section>
            <section class="card">
              <h2>AI Planner Notes</h2>
              <div class="plan">${escapeHtml(plan)}</div>
            </section>
            <h2>Top 20 Curated Route Sheet</h2>
          <table>
            <thead><tr><th>Stop</th><th>Area</th><th>Time</th><th>Map Route</th></tr></thead>
            <tbody>${routeRows}</tbody>
          </table>
            <h2>Selected Category: 10 More Options</h2>
            <table>
              <thead><tr><th>#</th><th>Option</th><th>Area Type</th><th>Route</th></tr></thead>
              <tbody>${selectedRows}</tbody>
            </table>
            <div class="note">
              <strong>Planner maturity check:</strong> map time, opening hours, rush, road closures, medical availability,
              parking, and altitude safety must be verified in live Maps or by calling the venue before leaving.
            </div>
          </main>
        </body>
      </html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  function downloadCsvPlan() {
    trackActivity({ type: "export_csv", city, category });
    const rows = [
      ["City", "Category", "Stop", "Area", "Distance/Time", "Map Search"],
      ...nearbyCards.map((item) => [city, selectedCategory?.label || category, item.name, item.area, item.eta, item.query])
    ];
    const chatRows = [["Chat Plan"], [latestAssistantPlan()]];
    const csv = [...rows, [], ...chatRows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `citymitra-${city.toLowerCase().replace(/\s+/g, "-")}-plan.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function askGuide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || loading) return;
    const detectedCity = detectCityFromMessage(trimmedQuestion);
    const activeCity = detectedCity || city;

    if (detectedCity && detectedCity !== city) {
      selectCity(detectedCity, "chat_detected");
    }

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmedQuestion },
      { role: "assistant", content: "" }
    ];

    setLoading(true);
    setQuestion("");
    setMessages(nextMessages);
    trackActivity({ type: "chat_submit", city: activeCity, category, label: trimmedQuestion.slice(0, 80) });

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmedQuestion,
          city: activeCity,
          category,
          messages: nextMessages.slice(0, -1)
        })
      });

      if (!response.body) {
        const fallbackText = await response.text();
        setMessages((current) =>
          current.map((message, index) =>
            index === current.length - 1 ? { ...message, content: fallbackText } : message
          )
        );
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedAnswer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        streamedAnswer += decoder.decode(value, { stream: true });
        setMessages((current) =>
          current.map((message, index) =>
            index === current.length - 1 ? { ...message, content: streamedAnswer } : message
          )
        );
      }

      streamedAnswer += decoder.decode();
      setMessages((current) =>
        current.map((message, index) =>
          index === current.length - 1
            ? { ...message, content: streamedAnswer || "CityMitra could not answer that yet." }
            : message
        )
      );
    } catch {
      setMessages((current) =>
        current.map((message, index) =>
          index === current.length - 1
            ? { ...message, content: "CityMitra is offline right now. Try again once the server is running." }
            : message
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function handleQuestionKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  function subscribeNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = newsletterEmail.trim();

    if (!email || !email.includes("@")) {
      setNewsletterStatus("Drop a valid email so the city intel lands in the right inbox.");
      return;
    }

    setNewsletterEmail("");
    setNewsletterStatus("You are on the CityMitra list. Clean city intel, no spam parade.");
    trackActivity({ type: "newsletter_subscribe", city, category, label: email.split("@")[1] });
  }

  return (
    <main>
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(110deg, rgba(246, 244, 238, 0.97), rgba(246, 244, 238, 0.58)), url("${cityVisual.image}")`,
          backgroundPosition: cityVisual.position
        }}
      >
        <div className="heroContent">
          <nav className="topbar">
            <a className="brand" href="#top" aria-label="CityMitra home">
              <span className="brandMark">
                <Navigation size={18} />
              </span>
              CityMitra
            </a>
            <form className="topSearch" onSubmit={applySearch} role="search">
              <Search size={16} />
              <input
                aria-label="Search any city or category"
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search city, food, hotels, repair..."
                value={searchText}
              />
              <button type="submit">Search</button>
            </form>
            <div className="navActions">
              <a href="#directory">Directory</a>
              <a href="#ai">AI Guide</a>
              <a href="#monetize">Monetize</a>
              <a href="#about">About</a>
              <a href="#coverage">Coverage</a>
            </div>
          </nav>

          <div className="heroGrid" id="top">
            <div className="heroCopy">
              <div className="eyebrow">
                <Sparkles size={16} />
                AI city navigation for Indian commerce
              </div>
              <h1>CityMitra</h1>
              <p>
                Find the right Indian city destination for shopping, wholesale, healthcare, food, repairs, schools,
                entertainment, dinner, and sightseeing without losing time across endless searches.
              </p>
              <div className="heroButtons">
                <a className="primaryButton" href="#ai">
                  Ask AI Guide <ArrowRight size={18} />
                </a>
                <a className="secondaryButton" href="#directory">
                  Browse Categories
                </a>
              </div>
              <div className="metrics">
                <span>
                  <b>{categories.length}</b> categories
                </span>
                <span>
                  <b>{cities.length}</b> launch cities
                </span>
                <span>
                  <b>AI</b> route advice
                </span>
              </div>
              <div className="demoFlow" aria-label="CityMitra product flow">
                {[
                  ["01", "Choose city"],
                  ["02", "Pick category"],
                  ["03", "Ask AI"],
                  ["04", "Open map"]
                ].map(([step, label]) => (
                  <span key={step}>
                    <b>{step}</b>
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="sceneWrap" aria-label="Animated 3D city directory map">
              <div
                className="motionBackdrop"
                style={{
                  backgroundImage: `linear-gradient(120deg, rgba(15, 23, 42, 0.32), rgba(255, 247, 237, 0.2)), url("${cityVisual.image}")`
                }}
              >
                <span className="mountainLayer mountainLayerOne" />
                <span className="mountainLayer mountainLayerTwo" />
                <span className="citySkyline" />
                <span className="motionRouteLine" />
                <span className="motionTraveler" />
              </div>
              <div
                className="sceneCanvasPane"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.12), rgba(255, 247, 237, 0.7)), url("${cityVisual.image}")`
                }}
              >
                <div className="motionSceneHeader">
                  <span>
                    <Sparkles size={14} />
                    City sync active
                  </span>
                  <strong>{cityVisual.label}</strong>
                </div>
                <a
                  className="motionScenePhoto"
                  href={mapSearchUrl(`${city} ${selectedCategory?.label || category} places photos`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img alt={`${city} ${selectedCategory?.label || category} motion frame`} src={cityVisual.image} />
                  <span>
                    <Camera size={14} />
                    View city photos
                  </span>
                </a>
                <div className="motionRouteBoard" aria-label={`${city} route motion frame`}>
                  <div className="routeNodes">
                    {[
                      ["01", "Start"],
                      ["02", selectedCategory?.label || "Pick"],
                      ["03", "Nearby"],
                      ["04", "Backup"]
                    ].map(([step, label]) => (
                      <span key={step}>
                        <b>{step}</b>
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="placeTicket">
                    <MapPinned size={15} />
                    <span>
                      <b>{city}</b>
                      {selectedCategory?.label || "City"} route, maps, photos, and fallback stops.
                    </span>
                  </div>
                </div>
                <div className="motionStats" aria-label="CityMitra live route stats">
                  <span>
                    <b>{nearbyCards.length}</b>
                    nearby picks
                  </span>
                  <span>
                    <b>Maps</b>
                    one tap
                  </span>
                  <span>
                    <b>AI</b>
                    planner
                  </span>
                </div>
                <div className="liveRoutePills" aria-label="Live 3D features">
                  <button type="button" onClick={() => handleSceneAction("sync")}>
                    <Sparkles size={14} />
                    City sync
                  </button>
                  <button type="button" onClick={() => handleSceneAction("map")}>
                    <MapPinned size={14} />
                    Map picks
                  </button>
                  <button type="button" onClick={() => handleSceneAction("route")}>
                    <Compass size={14} />
                    Route mode
                  </button>
                </div>
              </div>
              <div className="sceneMediaRail" aria-label={`${city} photo and map preview`}>
                <a
                  className="cityImageCard"
                  href={mapSearchUrl(`photos of ${city} ${selectedCategory?.label || ""}`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img alt={`${city} city visual`} src={cityVisual.image} />
                  <span>
                    <Camera size={14} />
                    {city} photos
                  </span>
                </a>
                <div className="routePulseCard" aria-label={`${city} smart route highlights`}>
                  <span>
                    <Navigation size={14} />
                    Live route mood
                  </span>
                  <b>{city}</b>
                  <p>{selectedCategory?.label || "City"} picks, photo proof, map route, and backup stops synced in one frame.</p>
                </div>
                <div className="mapPreviewCard">
                  <iframe
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapEmbedUrl(`${city} India ${selectedCategory?.label || ""}`)}
                    title={`${city} map preview`}
                  />
                  <button type="button" onClick={() => openTrackedMap(`${selectedCategory?.label || category} near ${city}`, "hero_map_preview")}>
                    <MapPinned size={14} />
                    Open live map
                  </button>
                </div>
              </div>
              <div className="sceneBadge">
                <Map size={16} />
                Maps, location & photos
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="controlBand" id="directory">
        <div className="sectionHeader">
          <div>
            <span className="sectionKicker">Destination Finder</span>
            <h2>Choose a city and category</h2>
          </div>
          <p>Built for quick decisions: where to go, what the area is known for, and how to avoid wasted trips.</p>
        </div>

        <div className="filters">
          <div className="filterGroup" aria-label="City selector">
            {visibleCities.map((item) => (
              <button className={city === item ? "active" : ""} key={item} onClick={() => selectCity(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="categoryGrid">
            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  className={category === item.key ? "category active" : "category"}
                  key={item.key}
                  onClick={() => selectCategory(item.key)}
                  title={item.label}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="categoryResultFrame" aria-label={`${selectedCategory?.label || category} rotating category results`}>
          <div className="intelFocusCard categoryFocusCard">
            <header>
              <span>
                {SelectedCategoryIcon && <SelectedCategoryIcon size={20} />}
                {selectedCategory?.label || "Category"} in {city}
              </span>
              <strong>{selectedItems.length} map-ready options</strong>
            </header>

            <div className="categoryStageNav intelTabs" aria-label="Category result zones">
              {categoryResultStages.map((stage, index) => (
                <button
                  className={index === categoryStageIndex ? "active" : ""}
                  key={stage.stage}
                  onClick={() => {
                    setCategoryStageIndex(index);
                    setCategoryFrameIndex(0);
                  }}
                  type="button"
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {stage.stage}
                  <small>{stage.results.length}</small>
                </button>
              ))}
            </div>

            <div className="resultFrameModule categoryResultModule">
              <div className="resultFrameHeader">
                <button type="button" onClick={() => moveCategoryFrame(-1)} aria-label="Previous category result">
                  <ChevronUp size={16} />
                  Previous
                </button>
                <div>
                  <span>{String(categoryFrameIndex + 1).padStart(2, "0")} / {activeCategoryStage.results.length || 0}</span>
                  <strong>{activeCategoryStage.stage}</strong>
                  <small>{activeCategoryResult?.eta || "Map check"}</small>
                </div>
                <button type="button" onClick={() => moveCategoryFrame(1)} aria-label="Next category result">
                  Next
                  <ChevronDown size={16} />
                </button>
              </div>

              <div className="rotatingResultFrame categoryResultMotion" aria-live="polite">
                <div
                  className="frameBackdrop"
                  style={{
                    backgroundImage: `linear-gradient(145deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.72)), url("${photoSearchImage(city, `${selectedCategory?.label || category} ${activeCategoryStage.stage}`, categoryFrameIndex)}")`
                  }}
                >
                  <span>{activeCategoryStage.stage}</span>
                  <b>{selectedCategory?.label || "Category"}</b>
                </div>

                <div className="rotatingDeck">
                  {activeCategoryStage.results.map((item, index) => {
                    const rawOffset = index - categoryFrameIndex;
                    const resultCount = activeCategoryStage.results.length;
                    const offset = rawOffset > resultCount / 2 ? rawOffset - resultCount : rawOffset < -resultCount / 2 ? rawOffset + resultCount : rawOffset;
                    const visible = Math.abs(offset) <= 2;
                    const isVerified = exactDirectoryItems.some((exact) => exact.name === item.name);

                    return (
                      <article
                        className={offset === 0 ? "rotatingCard categoryRouteCard active" : visible ? "rotatingCard categoryRouteCard visible" : "rotatingCard categoryRouteCard"}
                        key={`${activeCategoryStage.stage}-${item.name}`}
                        style={{ "--card-offset": offset, "--card-abs": Math.abs(offset) } as CSSProperties}
                      >
                        <span className="resultIndex">{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <h3>{item.name}</h3>
                          <p>{item.why || `Curated ${selectedCategory?.label.toLowerCase() || "city"} option for ${city} with maps, photos, and route checks.`}</p>
                        </div>
                        <div className="intelMeta">
                          <span>{isVerified ? item.area : activeCategoryStage.stage}</span>
                          <span>{item.eta}</span>
                          <span>{isVerified ? "Verified" : "Smart"}</span>
                        </div>
                        <button type="button" onClick={() => openTrackedMap(item.query, `directory_${item.name}`)}>
                          Open route <ExternalLink size={14} />
                        </button>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="resultDots" aria-label="Category result progress">
                {activeCategoryStage.results.map((item, index) => (
                  <button
                    aria-label={`Show ${item.name}`}
                    className={index === categoryFrameIndex ? "active" : ""}
                    key={`${item.name}-category-dot`}
                    onClick={() => setCategoryFrameIndex(index)}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {exactDirectoryItems.length === 0 && (
          <div className="emptyState">
            <h3>No exact {selectedCategory?.label.toLowerCase()} listing in {city} yet</h3>
            <p>
              Showing smart generated map-ready results for this city/category. Verify photos, distance, and timings in
              Maps before leaving.
            </p>
          </div>
        )}

        {exactDirectoryItems.length === 0 && (
          <div className="suggestionRows">
            <div>
              <h3>More in {city}</h3>
              {categoryMatrix.slice(0, 7).map((item) => (
                <button key={item.key} onClick={() => selectCategory(item.key, "suggested_city_category")}>
                  {item.results[0]?.name} <span>{item.label}</span>
                </button>
              ))}
            </div>
            <div>
              <h3>{selectedCategory?.label} in other cities</h3>
              {categorySuggestions.map((item) => (
                <button key={item.name} onClick={() => selectCity(item.city, "suggested_category_city")}>
                  {item.name} <span>{item.city}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="categoryMatrix" aria-label={`10 category results for ${city}`}>
          <div className="sectionHeader compactHeader">
            <div>
              <span className="sectionKicker">City Intelligence</span>
              <h2>Browse 10 smart results per category for {city}</h2>
            </div>
            <p>Use category tabs or next/previous to scan one focused set at a time. Open any item to verify photos, distance, traffic, and hours.</p>
          </div>

          <div className="intelBrowser">
            <div className="intelControls">
              <button type="button" onClick={() => moveIntelCategory(-1)} aria-label="Previous category">
                <ChevronUp size={16} />
                Previous
              </button>
              <div>
                <span>{activeIntelIndex + 1} / {categoryMatrix.length}</span>
                <strong>{activeIntelGroup.label}</strong>
              </div>
              <button type="button" onClick={() => moveIntelCategory(1)} aria-label="Next category">
                Next
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="intelTabs" aria-label="City intelligence categories">
              {categoryMatrix.map((group) => {
                const Icon = group.icon;
                return (
                  <button
                    className={intelCategory === group.key ? "active" : ""}
                    key={group.key}
                    onClick={() => {
                      setIntelCategory(group.key);
                      trackActivity({ type: "city_intel_category", city, category: group.key, label: "tab" });
                    }}
                    type="button"
                  >
                    <Icon size={16} />
                    {group.label}
                  </button>
                );
              })}
            </div>

            <div className="intelFocusCard">
              {(() => {
                const Icon = activeIntelGroup.icon;
                return (
                  <header>
                    <span>
                      <Icon size={20} />
                      {activeIntelGroup.label}
                    </span>
                    <strong>{activeIntelGroup.results.length} map-ready options</strong>
                  </header>
                );
              })()}

              <div className="resultFrameModule">
                <div className="resultFrameHeader">
                  <button type="button" onClick={() => moveIntelResult(-1)} aria-label="Previous result">
                    <ChevronUp size={16} />
                    Previous
                  </button>
                  <div>
                    <span>{String(activeResultIndex + 1).padStart(2, "0")} / {activeIntelGroup.results.length}</span>
                    <strong>{activeIntelResult?.area}</strong>
                    <small>{activeIntelResult?.eta}</small>
                  </div>
                  <button type="button" onClick={() => moveIntelResult(1)} aria-label="Next result">
                    Next
                    <ChevronDown size={16} />
                  </button>
                </div>

                <div className="rotatingResultFrame" aria-live="polite">
                  <div className="frameBackdrop">
                    <span>{activeIntelResult?.area}</span>
                    <b>{activeIntelGroup.label}</b>
                  </div>

                  <div className="rotatingDeck">
                    {activeIntelGroup.results.map((item, index) => {
                      const rawOffset = index - activeResultIndex;
                      const resultCount = activeIntelGroup.results.length;
                      const offset = rawOffset > resultCount / 2 ? rawOffset - resultCount : rawOffset < -resultCount / 2 ? rawOffset + resultCount : rawOffset;
                      const visible = Math.abs(offset) <= 2;

                      return (
                        <article
                          className={offset === 0 ? "rotatingCard active" : visible ? "rotatingCard visible" : "rotatingCard"}
                          key={`${activeIntelGroup.key}-${item.name}`}
                          style={{ "--card-offset": offset, "--card-abs": Math.abs(offset) } as CSSProperties}
                        >
                          <span className="resultIndex">{String(index + 1).padStart(2, "0")}</span>
                          <div>
                            <h3>{item.name}</h3>
                            <p>{item.why}</p>
                          </div>
                          <div className="intelMeta">
                            <span>{item.area}</span>
                            <span>{item.eta}</span>
                          </div>
                          <button type="button" onClick={() => openTrackedMap(item.query, `matrix_${activeIntelGroup.key}_${item.name}`)}>
                            Open route <ExternalLink size={14} />
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </div>

                <div className="resultDots" aria-label="Result carousel progress">
                  {activeIntelGroup.results.map((item, index) => (
                    <button
                      aria-label={`Show ${item.name}`}
                      className={index === activeResultIndex ? "active" : ""}
                      key={`${item.name}-dot`}
                      onClick={() => setActiveResultIndex(index)}
                      type="button"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <details className="intelOverview">
            <summary>See all categories at a glance</summary>
            <div>
              {categoryMatrix.map((group) => {
                const Icon = group.icon;
                return (
                  <button key={group.key} onClick={() => setIntelCategory(group.key)} type="button">
                    <Icon size={15} />
                    <span>{group.label}</span>
                    <small>{group.results.length} results</small>
                  </button>
                );
              })}
            </div>
          </details>
        </div>
      </section>

      <section className="platformBand" id="platform">
        <div className="sectionHeader">
          <div>
            <span className="sectionKicker">Production Layer</span>
            <h2>One city graph for discovery, maps, agents, and commerce</h2>
          </div>
          <p>CityMitra connects what people ask, where they click, and which local categories drive intent.</p>
        </div>
        <div className="platformGrid">
          {[
            {
              icon: Layers3,
              title: "City graph",
              text: "Cities, categories, nearby picks, photos, maps, and backup services update together."
            },
            {
              icon: Bot,
              title: "AI concierge",
              text: "The chat can answer route plans, shopping runs, trip timing, hospitals, fuel, repairs, and hotels."
            },
            {
              icon: BarChart3,
              title: "Activity intelligence",
              text: "Page views, searches, map opens, city changes, exports, and chat intent flow into admin analytics."
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title}>
                <Icon size={22} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="aiBand" id="ai">
        <div className="aiPanel">
          <div className="aiIntro">
            <span className="sectionKicker">AI Agent</span>
            <h2>Ask CityMitra before you leave</h2>
            <p>
              A clean city chat for trip plans, market runs, hospitals, fuel stops, hotels, repairs, food, and quick
              backup options when your plan changes.
            </p>
            <div className="agentStack">
              <span>
                <Search size={16} />
                Intent finder
              </span>
              <span>
                <Compass size={16} />
                Route planner
              </span>
              <span>
                <Bot size={16} />
                OpenAI-ready
              </span>
            </div>
          </div>

          <form className="askBox" onSubmit={askGuide}>
            <div className="chatHeader">
              <div>
                <span className="liveDot" />
                <label htmlFor="question">Ask about {selectedCategory?.label.toLowerCase()} in {city}</label>
              </div>
              <div className="chatHeaderActions">
                <strong>{loading ? "Planning live" : "Ready"}</strong>
                <button className="iconButton" type="button" onClick={clearChat} title="Clear chat" aria-label="Clear chat">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="quickPrompts">
              {[
                "Plan Leh for 3 days with route table",
                "Prayagraj hotels and food",
                "Ayodhya trip planner",
                "Tell me about Indore food",
                "Darjeeling route planner",
                "Shillong cafes and viewpoints",
                "Best dinner under 45 minutes",
                "Shopping plus hospital backup",
                "Petrol and repair before a road trip"
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setQuestion(prompt);
                    trackActivity({ type: "quick_prompt", city, category, label: prompt });
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="chatMapGrid">
              <div className="chatColumn">
                <div className="exportBar">
                  <button type="button" onClick={openPdfPlan}>
                    <FileText size={15} />
                    PDF
                  </button>
                  <button type="button" onClick={downloadCsvPlan}>
                    <Table size={15} />
                    Excel
                  </button>
                  <button type="button" onClick={() => scrollChat("top")} title="Scroll chat up" aria-label="Scroll chat up">
                    <ChevronUp size={15} />
                  </button>
                  <button type="button" onClick={() => scrollChat("bottom")} title="Scroll chat down" aria-label="Scroll chat down">
                    <ChevronDown size={15} />
                  </button>
                </div>
                <div className="chatWindow" ref={chatWindowRef} aria-live="polite">
                  {messages.map((message, index) => (
                    <div className={message.role === "user" ? "chatBubble userBubble" : "chatBubble assistantBubble"} key={index}>
                      <span>{message.role === "user" ? "You" : "CityMitra"}</span>
                      <p>{message.content || "Thinking..."}</p>
                    </div>
                  ))}
                  {loading && (
                    <div className="typingRow" aria-label="CityMitra is typing">
                      <i />
                      <i />
                      <i />
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="composerRow">
                  <textarea
                    id="question"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    onKeyDown={handleQuestionKeyDown}
                    placeholder="Ask anything city-related. Press Enter to send, Shift+Enter for a new line."
                  />
                  <button className="primaryButton" disabled={loading} type="submit">
                    {loading ? "Mapping..." : "Send"} <ArrowRight size={18} />
                  </button>
                </div>

                <span className="inputHint">Enter sends. Shift+Enter adds a new line.</span>
              </div>

              <aside className="nearbyPanel" aria-label="Nearby map and places">
                <div className="miniMap">
                  <MapPinned size={22} />
                  <span>{city}</span>
                  <strong>{selectedCategory?.label}</strong>
                </div>
                <div className="locationBox">
                  <button type="button" onClick={requestNearbyLocation}>
                    <Navigation size={15} />
                    {userLocation ? "Nearby location enabled" : "Use my nearby location"}
                  </button>
                  <p>{locationStatus}</p>
                </div>
                <button className="mapPrimaryLink" type="button" onClick={() => openTrackedMap(`${selectedCategory?.label || category} near ${city}`, "nearby_primary")}>
                  Open nearby on Maps <ExternalLink size={15} />
                </button>
                <div className="nearbyList" key={`${city}-${category}-nearby`}>
                  <h3>Top 20 curated nearby picks</h3>
                  {nearbyCards.length > 0 ? (
                    nearbyCards.map((item, index) => (
                      <button type="button" onClick={() => openTrackedMap(item.query, `nearby_${item.name}`)} key={`${city}-${category}-${index}-${item.name}`}>
                        <span>{item.name}</span>
                        <small>
                          {categories.find((cat) => cat.key === item.category)?.label || "City"} · {item.area} · {item.eta}
                        </small>
                      </button>
                    ))
                  ) : (
                    <p>Ask CityMitra for live-style suggestions, then open the map search for that city.</p>
                  )}
                </div>
                <div className="photoBlocks">
                  {photoBlocks.map((item) => (
                    <button
                      className="photoBlock"
                      key={`${item.title}-${item.query}`}
                      onClick={() => openTrackedMap(item.query, `photo_${item.title}`)}
                      style={{ backgroundImage: `linear-gradient(180deg, rgba(18, 20, 23, 0.05), rgba(18, 20, 23, 0.76)), url("${item.image}")` }}
                      type="button"
                    >
                      <span>{item.title}</span>
                      <small>{item.text}</small>
                    </button>
                  ))}
                </div>
                <div className="nearbyActions">
                  {["hospitals", "petrol pumps", "vehicle repair", "hotels"].map((item) => (
                    <button type="button" onClick={() => openTrackedMap(`${item} near ${city}`, `backup_${item}`)} key={item}>
                      {item}
                    </button>
                  ))}
                </div>
              </aside>
            </div>
          </form>
        </div>
      </section>

      <section className="monetizeBand" id="monetize">
        <div className="sectionHeader">
          <div>
            <span className="sectionKicker">Revenue Engine</span>
            <h2>Monetize local intent without making the app noisy</h2>
          </div>
          <p>Keep the user experience minimal, then charge businesses for useful placement, trust, and analytics.</p>
        </div>
        <div className="monetizeGrid">
          {[
            ["Featured listings", "Shopkeepers pay for verified placement, photos, offers, and peak-hour visibility."],
            ["Lead routing", "Hotels, repair shops, clinics, and stores receive qualified clicks from high-intent searches."],
            ["Vendor dashboard", "Paid partners track views, map opens, category demand, and chat-driven leads."],
            ["City sponsorships", "Local brands sponsor categories like food trails, shopping routes, and travel plans."]
          ].map(([title, text], index) => (
            <article key={title}>
              <span>{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="coverage" id="coverage">
        <div className="sectionHeader">
          <div>
            <span className="sectionKicker">Launch Roadmap</span>
            <h2>From directory to city operating layer</h2>
          </div>
        </div>
        <div className="roadmap">
          {[
            ["Verified listings", "Shopkeeper volume, specialties, hours, photos, phone, price band, and trust score."],
            ["Live navigation", "Map links, nearby parking, metro access, wait time, and route safety notes."],
            ["Vendor dashboard", "Owners can claim listings, update stock, offers, peak hours, and service availability."],
            ["Agent network", "Specialized agents for shopping, healthcare, food, education, repairs, and tourism."]
          ].map(([title, text]) => (
            <article key={title}>
              <Building2 size={20} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="aboutBand" id="about">
        <div className="aboutGrid">
          <div>
            <span className="sectionKicker">About CityMitra</span>
            <h2>Built to make Indian city decisions faster, cleaner, and less chaotic</h2>
            <p>
              CityMitra is an AI-assisted city companion for shopping streets, wholesale markets, hospitals, hotels,
              food trails, vehicle support, schools, malls, play arenas, and sightseeing. The goal is simple: help
              people choose where to go, what to expect, and what backup options sit nearby before they leave.
            </p>
          </div>
          <div className="aboutCards">
            {[
              ["Human intent", "Search by city, category, or plain chat. CityMitra syncs the interface around the user."],
              ["Map-first actions", "Every suggestion points toward maps, routes, photos, and useful nearby fallbacks."],
              ["Business ready", "The platform is shaped for verified listings, paid placement, and privacy-aware analytics."]
            ].map(([title, text]) => (
              <article key={title}>
                <Sparkles size={18} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="siteFooter">
        <div className="footerGrid">
          <div className="footerBrand">
            <a className="brand" href="#top" aria-label="CityMitra home">
              <span className="brandMark">
                <Navigation size={18} />
              </span>
              CityMitra
            </a>
            <p>AI city navigation for Indian commerce, travel, services, and everyday decisions.</p>
            <div className="socialLinks" aria-label="Social links">
              <a href="https://x.com" target="_blank" rel="noreferrer">X</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram size={17} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Linkedin size={17} />
              </a>
            </div>
          </div>

          <div className="footerLinks">
            <h3>Explore</h3>
            <a href="#directory">Directory</a>
            <a href="#ai">AI Guide</a>
            <a href="#monetize">Monetize</a>
            <a href="#coverage">Roadmap</a>
          </div>

          <div className="footerPrivacy" id="privacy">
            <h3>Privacy Policy</h3>
            <p>
              CityMitra records lightweight activity such as page views, city/category choices, map opens, and chat
              intent to improve recommendations and admin analytics. Admin analytics are protected behind login.
            </p>
          </div>

          <div className="newsletterCard">
            <h3>Subscribe to the city brief</h3>
            <p>Get launch updates, city intelligence, and vendor roadmap notes.</p>
            <form onSubmit={subscribeNewsletter}>
              <label htmlFor="newsletterEmail">
                <Mail size={16} />
                Email
              </label>
              <div>
                <input
                  id="newsletterEmail"
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  value={newsletterEmail}
                />
                <button type="submit" aria-label="Subscribe">
                  <Send size={16} />
                </button>
              </div>
            </form>
            {newsletterStatus && <strong>{newsletterStatus}</strong>}
          </div>
        </div>
        <div className="footerBottom">
          <span>© {new Date().getFullYear()} CityMitra. All rights reserved.</span>
          <a href="#privacy">Privacy Policy</a>
        </div>
      </footer>
    </main>
  );
}
