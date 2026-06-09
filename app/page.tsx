"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  ArrowRight,
  Bot,
  Building2,
  Camera,
  ChevronDown,
  ChevronUp,
  Clock3,
  Compass,
  ExternalLink,
  FileText,
  Map,
  MapPinned,
  Navigation,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Table,
  Trash2
} from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Mesh } from "three";
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

function CityBlocks() {
  const group = useRef<Mesh>(null);
  const blocks = useMemo(
    () =>
      Array.from({ length: 42 }, (_, index) => ({
        x: (index % 7) * 1.1 - 3.3,
        z: Math.floor(index / 7) * 1.1 - 3.2,
        h: 0.35 + ((index * 7) % 9) * 0.12,
        color: ["#1f7a8c", "#bf4342", "#f2b705", "#52616b", "#2f4858", "#4f7cac"][index % 6]
      })),
    []
  );

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.18) * 0.08;
    }
  });

  return (
    <group ref={group} rotation={[0.42, -0.55, 0]}>
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <boxGeometry args={[9.4, 0.12, 7.8]} />
        <meshStandardMaterial color="#d7dde1" roughness={0.72} />
      </mesh>
      {blocks.map((block, index) => (
        <mesh key={index} position={[block.x, block.h / 2, block.z]} castShadow receiveShadow>
          <boxGeometry args={[0.78, block.h, 0.78]} />
          <meshStandardMaterial color={block.color} roughness={0.48} metalness={0.05} />
        </mesh>
      ))}
      <mesh position={[0.25, 1.4, -0.2]}>
        <torusGeometry args={[2.9, 0.018, 8, 80]} />
        <meshStandardMaterial color="#111827" emissive="#f2b705" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[1.6, 1.95, -1.15]}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial color="#f2b705" emissive="#f2b705" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

function CityScene() {
  return (
    <Canvas camera={{ position: [0, 5.4, 7.2], fov: 45 }} shadows style={{ height: "100%", inset: 0, position: "absolute", width: "100%" }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 7, 5]} intensity={1.8} castShadow />
      <pointLight position={[-3, 3, 2]} intensity={0.8} color="#f2b705" />
      <CityBlocks />
    </Canvas>
  );
}

export default function Home() {
  const [city, setCity] = useState<string>("Delhi");
  const [category, setCategory] = useState<CategoryKey>("markets");
  const [searchText, setSearchText] = useState("");
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
  const selectedItems = directory.filter((item) => item.city === city && item.category === category).slice(0, 6);
  const citySuggestions = directory
    .filter((item) => item.city === city && item.category !== category)
    .slice(0, 3);
  const categorySuggestions = directory
    .filter((item) => item.city !== city && item.category === category)
    .slice(0, 3);
  const seededNearbyItems = (selectedItems.length > 0 ? selectedItems : citySuggestions).slice(0, 5);
  const selectedCategory = categories.find((item) => item.key === category);
  const cityVisual = cityVisuals[city] || {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/India%20Gate%20in%20New%20Delhi%2003-2016%20img3.jpg",
    label: `${city} city`,
    position: "center"
  };
  const photoBlocks = [
    {
      title: "Hotels",
      text: "Stays near the route",
      image: cityVisual.image,
      query: `best hotels in ${city}`
    },
    {
      title: "Places",
      text: "Must-cover spots",
      image: cityVisual.image,
      query: `best places to visit in ${city}`
    },
    {
      title: "Fine Dining",
      text: "Dinner without guesswork",
      image: cityVisual.image,
      query: `fine dining restaurants in ${city}`
    },
    {
      title: selectedCategory?.label || "Category",
      text: "Selected category nearby",
      image: cityVisual.image,
      query: `${selectedCategory?.label || category} near ${city}`
    }
  ];
  const generatedNearbyItems: NearbyCard[] = [
    {
      name: `${selectedCategory?.label || "Places"} near ${city}`,
      area: "Selected category",
      eta: "Map search",
      query: `${selectedCategory?.label || category} near ${city}`
    },
    {
      name: `Hotels in ${city}`,
      area: "Stay options",
      eta: "Map search",
      query: `best hotels in ${city}`
    },
    {
      name: `Places to visit in ${city}`,
      area: "Sightseeing",
      eta: "Map search",
      query: `best places to visit in ${city}`
    },
    {
      name: `Fine dining in ${city}`,
      area: "Dinner",
      eta: "Map search",
      query: `fine dining restaurants in ${city}`
    },
    {
      name: `Hospitals, fuel and repair in ${city}`,
      area: "Backup layer",
      eta: "Map search",
      query: `hospitals petrol pumps vehicle repair near ${city}`
    }
  ];
  const nearbyCards: NearbyCard[] =
    seededNearbyItems.length > 0
      ? seededNearbyItems.map((item) => ({
          name: item.name,
          area: item.area,
          eta: item.eta,
          query: `${item.name} ${item.area} ${item.city}`
        }))
      : generatedNearbyItems;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  function mapSearchUrl(query: string) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  function mapEmbedUrl(query: string) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=12&output=embed`;
  }

  function clearChat() {
    setMessages([{ role: "assistant", content: starterMessage }]);
    setQuestion("");
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
      setCity(cityAliases[cityFromText.toLowerCase()] || cityFromText);
    }

    if (detectedCategory) {
      setCategory(detectedCategory);
    }

    const activeCity = cityFromText || city;
    const activeCategory = detectedCategory
      ? categories.find((item) => item.key === detectedCategory)?.label
      : selectedCategory?.label;
    setQuestion(`Plan ${activeCity} ${activeCategory || "city"} options with nearby maps, photos, route timing, and backup stops.`);
    setSearchText("");
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
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const plan = latestAssistantPlan();
    const routeRows = nearbyCards
      .map(
        (item) =>
          `<tr><td>${item.name}</td><td>${item.area}</td><td>${item.eta}</td><td>${item.query}</td></tr>`
      )
      .join("");

    printWindow.document.write(`<!doctype html>
      <html>
        <head>
          <title>CityMitra ${city} plan</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 32px; color: #121417; }
            h1 { margin-bottom: 4px; }
            pre { white-space: pre-wrap; line-height: 1.5; background: #f6f4ee; padding: 16px; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 18px; }
            th, td { border: 1px solid #d8dee4; padding: 8px; text-align: left; vertical-align: top; }
            th { background: #eef3f1; }
          </style>
        </head>
        <body>
          <h1>CityMitra ${city} Travel Plan</h1>
          <p>Category: ${selectedCategory?.label || category}</p>
          <pre>${plan.replace(/[<>&]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[char] || char)}</pre>
          <h2>Map Route Sheet</h2>
          <table>
            <thead><tr><th>Stop</th><th>Area</th><th>Distance/Time</th><th>Map Search</th></tr></thead>
            <tbody>${routeRows}</tbody>
          </table>
        </body>
      </html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  function downloadCsvPlan() {
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
      setCity(detectedCity);
    }

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmedQuestion },
      { role: "assistant", content: "" }
    ];

    setLoading(true);
    setQuestion("");
    setMessages(nextMessages);

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
            </div>
            <div className="sceneWrap" aria-label="Animated 3D city directory map">
              <div className="sceneCanvasPane">
                <CityScene />
                <div className="photoChip">
                  <Camera size={15} />
                  {cityVisual.label}
                </div>
                <div className="liveRoutePills" aria-label="Live 3D features">
                  <span>
                    <Sparkles size={14} />
                    City sync
                  </span>
                  <span>
                    <MapPinned size={14} />
                    Map picks
                  </span>
                  <span>
                    <Compass size={14} />
                    Route mode
                  </span>
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
                <div className="mapPreviewCard">
                  <iframe
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapEmbedUrl(`${city} India ${selectedCategory?.label || ""}`)}
                    title={`${city} map preview`}
                  />
                  <a href={mapSearchUrl(`${selectedCategory?.label || category} near ${city}`)} target="_blank" rel="noreferrer">
                    <MapPinned size={14} />
                    Open live map
                  </a>
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
              <button className={city === item ? "active" : ""} key={item} onClick={() => setCity(item)}>
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
                  onClick={() => setCategory(item.key)}
                  title={item.label}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="directoryGrid">
          {selectedItems.map((item) => (
            <article className="listing" key={`${item.name}-${item.city}`}>
              <div className="listingTop">
                <span className="pin">
                  <MapPinned size={16} />
                  {item.area}
                </span>
                <span className="score">
                  <Star size={15} />
                  {item.trust}
                </span>
              </div>
              <h3>{item.name}</h3>
              <p>{item.bestFor}</p>
              <div className="listingMeta">
                <span>
                  <Clock3 size={15} />
                  {item.eta}
                </span>
                <span>
                  <ShieldCheck size={15} />
                  {item.volume}
                </span>
              </div>
              {item.altitude && <span className="altitude">{item.altitude}</span>}
              <strong>{item.tip}</strong>
            </article>
          ))}
        </div>

        {selectedItems.length === 0 && (
          <div className="emptyState">
            <h3>No exact {selectedCategory?.label.toLowerCase()} listing in {city} yet</h3>
            <p>
              The directory will not mix unrelated city/category results. Use the AI guide for expanded options, or try
              one of these nearby matches.
            </p>
          </div>
        )}

        {selectedItems.length === 0 && (
          <div className="suggestionRows">
            <div>
              <h3>More in {city}</h3>
              {citySuggestions.map((item) => (
                <button key={item.name} onClick={() => setCategory(item.category)}>
                  {item.name} <span>{categories.find((cat) => cat.key === item.category)?.label}</span>
                </button>
              ))}
            </div>
            <div>
              <h3>{selectedCategory?.label} in other cities</h3>
              {categorySuggestions.map((item) => (
                <button key={item.name} onClick={() => setCity(item.city)}>
                  {item.name} <span>{item.city}</span>
                </button>
              ))}
            </div>
          </div>
        )}
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
                <button key={prompt} type="button" onClick={() => setQuestion(prompt)}>
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
                <a className="mapPrimaryLink" href={mapSearchUrl(`${selectedCategory?.label || category} near ${city}`)} target="_blank" rel="noreferrer">
                  Open nearby on Maps <ExternalLink size={15} />
                </a>
                <div className="nearbyList">
                  <h3>Nearby picks</h3>
                  {nearbyCards.length > 0 ? (
                    nearbyCards.map((item) => (
                      <a href={mapSearchUrl(item.query)} key={item.name} target="_blank" rel="noreferrer">
                        <span>{item.name}</span>
                        <small>{item.area} · {item.eta}</small>
                      </a>
                    ))
                  ) : (
                    <p>Ask CityMitra for live-style suggestions, then open the map search for that city.</p>
                  )}
                </div>
                <div className="photoBlocks">
                  {photoBlocks.map((item) => (
                    <a
                      className="photoBlock"
                      href={mapSearchUrl(item.query)}
                      key={item.title}
                      style={{ backgroundImage: `linear-gradient(180deg, rgba(18, 20, 23, 0.05), rgba(18, 20, 23, 0.76)), url("${item.image}")` }}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>{item.title}</span>
                      <small>{item.text}</small>
                    </a>
                  ))}
                </div>
                <div className="nearbyActions">
                  {["hospitals", "petrol pumps", "vehicle repair", "hotels"].map((item) => (
                    <a href={mapSearchUrl(`${item} near ${city}`)} key={item} target="_blank" rel="noreferrer">
                      {item}
                    </a>
                  ))}
                </div>
              </aside>
            </div>
          </form>
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
    </main>
  );
}
