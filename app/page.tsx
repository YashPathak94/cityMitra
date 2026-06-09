"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  ArrowRight,
  Bot,
  Building2,
  Camera,
  Clock3,
  Compass,
  ExternalLink,
  Map,
  MapPinned,
  Navigation,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2
} from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Mesh } from "three";
import { categories, CategoryKey, cities, directory } from "@/data/city-directory";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const starterMessage =
  "Tell me the city, vibe, budget, and time you have. I will map the spots, backup services, and time-saving route. Yes, an actual plan, not a 47-tab research spiral.";

const knownChatCities = [
  "Agra",
  "Ahmedabad",
  "Amritsar",
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

function detectCityFromMessage(message: string) {
  const lowerMessage = message.toLowerCase();
  const aliasMatch = Object.entries(cityAliases).find(([alias]) => new RegExp(`\\b${alias}\\b`, "i").test(message));

  if (aliasMatch) return aliasMatch[1];

  const knownMatch = knownChatCities.find((knownCity) => new RegExp(`\\b${knownCity}\\b`, "i").test(message));

  if (knownMatch) return knownMatch;

  const patternMatch = lowerMessage.match(
    /\b(?:city|in|to|for|at|near|around|visit|visiting|trip to|going to)\s+([a-z]+(?:\s+[a-z]+){0,2})/
  );

  if (!patternMatch) return null;

  const stopWords = new Set(["the", "a", "an", "my", "this", "that", "nearby", "food", "hotel", "hotels", "trip"]);
  const cityGuess = patternMatch[1]
    .split(/\s+/)
    .filter((part) => !stopWords.has(part))
    .join(" ");

  return cityGuess.length > 2 ? titleCaseCity(cityGuess) : null;
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
  const [question, setQuestion] = useState("Plan a Leh trip with places, altitude, hospitals, petrol, repairs, hotels and shopping.");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: starterMessage
    }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const visibleCities = useMemo(() => (cities.includes(city as (typeof cities)[number]) ? cities : [city, ...cities]), [city]);
  const selectedItems = directory.filter((item) => item.city === city && item.category === category).slice(0, 6);
  const citySuggestions = directory
    .filter((item) => item.city === city && item.category !== category)
    .slice(0, 3);
  const categorySuggestions = directory
    .filter((item) => item.city !== city && item.category === category)
    .slice(0, 3);
  const nearbyItems = (selectedItems.length > 0 ? selectedItems : citySuggestions).slice(0, 5);
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  function mapSearchUrl(query: string) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  function clearChat() {
    setMessages([{ role: "assistant", content: starterMessage }]);
    setQuestion("");
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
              <CityScene />
              <div className="photoChip">
                <Camera size={15} />
                {cityVisual.label}
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
                "Plan Leh for 3 days",
                "Prayagraj hotels and food",
                "Tell me about Indore food",
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
                <div className="chatWindow" aria-live="polite">
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
                  {nearbyItems.length > 0 ? (
                    nearbyItems.map((item) => (
                      <a href={mapSearchUrl(`${item.name} ${item.area} ${item.city}`)} key={item.name} target="_blank" rel="noreferrer">
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
