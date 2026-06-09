"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  ArrowRight,
  Bot,
  Building2,
  Clock3,
  Compass,
  LocateFixed,
  MapPinned,
  Navigation,
  Search,
  ShieldCheck,
  Sparkles,
  Star
} from "lucide-react";
import { FormEvent, useMemo, useRef, useState } from "react";
import { Mesh } from "three";
import { categories, CategoryKey, cities, directory } from "@/data/city-directory";

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
  const [question, setQuestion] = useState("Where should I go for wholesale wedding shopping without wasting time?");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedItems = directory.filter((item) => item.city === city || item.category === category).slice(0, 6);
  const selectedCategory = categories.find((item) => item.key === category);

  async function askGuide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, city, category })
      });

      if (!response.body) {
        setAnswer(await response.text());
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedAnswer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        streamedAnswer += decoder.decode(value, { stream: true });
        setAnswer(streamedAnswer);
      }

      streamedAnswer += decoder.decode();
      setAnswer(streamedAnswer || "CityMitra could not answer that yet.");
    } catch {
      setAnswer("CityMitra is offline right now. Try again once the server is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="hero">
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
                  <b>12</b> categories
                </span>
                <span>
                  <b>6</b> launch cities
                </span>
                <span>
                  <b>AI</b> route advice
                </span>
              </div>
            </div>
            <div className="sceneWrap" aria-label="Animated 3D city directory map">
              <CityScene />
              <div className="sceneBadge">
                <LocateFixed size={16} />
                Smart area picking
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
            {cities.map((item) => (
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
              <strong>{item.tip}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="aiBand" id="ai">
        <div className="aiPanel">
          <div className="aiIntro">
            <span className="sectionKicker">AI Agent</span>
            <h2>Ask CityMitra before you leave</h2>
            <p>
              The AI guide combines city, category, popularity, area, time-saving tips, and local intent so people can
              move directly toward a useful destination.
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
            <label htmlFor="question">Ask about {selectedCategory?.label.toLowerCase()} in {city}</label>
            <textarea id="question" value={question} onChange={(event) => setQuestion(event.target.value)} />
            <button className="primaryButton" disabled={loading} type="submit">
              {loading ? "Finding..." : "Get answer"} <ArrowRight size={18} />
            </button>
            {answer && <pre className="answer">{answer}</pre>}
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
