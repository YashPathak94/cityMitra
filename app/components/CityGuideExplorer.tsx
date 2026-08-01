"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPinned, Search, SlidersHorizontal } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { CityGuide } from "@/data/city-guides";
import { cityEditorials, cityThemeLabels, type CityTheme } from "@/data/city-editorials";
import styles from "./CityGuideExplorer.module.css";

const filters: Array<{ key: "all" | CityTheme; label: string }> = [
  { key: "all", label: "All cities" },
  { key: "hill", label: cityThemeLabels.hill },
  { key: "spiritual", label: cityThemeLabels.spiritual },
  { key: "heritage", label: cityThemeLabels.heritage },
  { key: "culture", label: cityThemeLabels.culture },
  { key: "commerce", label: cityThemeLabels.commerce }
];

export default function CityGuideExplorer({ guides }: { guides: CityGuide[] }) {
  const [filter, setFilter] = useState<"all" | CityTheme>("all");
  const [query, setQuery] = useState("");
  const reduceMotion = useReducedMotion();

  const visibleGuides = useMemo(() => {
    const term = query.trim().toLowerCase();
    return guides.filter((guide) => {
      const editorial = cityEditorials[guide.slug];
      const matchesTheme = filter === "all" || editorial?.themes.includes(filter);
      const haystack = [
        guide.name,
        guide.state,
        guide.tagline,
        editorial?.label,
        editorial?.themes.map((theme) => cityThemeLabels[theme]).join(" ")
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesTheme && (!term || haystack.includes(term));
    });
  }, [filter, guides, query]);

  return (
    <section className={styles.explorer} aria-label="Find a CityMitra city guide">
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={17} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search city, state, hill, culture..."
            aria-label="Search city guides"
          />
        </div>
        <div className={styles.themeFilters} aria-label="Filter city guides">
          <SlidersHorizontal size={16} aria-hidden="true" />
          {filters.map((item) => (
            <button
              className={filter === item.key ? styles.active : ""}
              type="button"
              key={item.key}
              onClick={() => setFilter(item.key)}
              aria-pressed={filter === item.key}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.resultLine} aria-live="polite">
        <strong>{visibleGuides.length}</strong> human-written city guides
        <span>Neighbourhoods, local rhythm, culture, nearby needs, and practical routes.</span>
      </div>

      <motion.div className="guideGrid" layout>
        <AnimatePresence mode="popLayout">
          {visibleGuides.map((guide) => {
            const editorial = cityEditorials[guide.slug];
            return (
              <motion.div
                key={guide.slug}
                layout
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.22 }}
              >
                <Link className="guideCard" href={`/cities/${guide.slug}`}>
                  <div
                    className="guideCardImage"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.05), rgba(15, 23, 42, 0.76)), url("/api/city-image?city=${encodeURIComponent(guide.name)}&topic=${encodeURIComponent(`${guide.name} city travel culture`)}")`
                    }}
                  >
                    <span>
                      <MapPinned size={14} />
                      {guide.state}
                    </span>
                  </div>
                  <div className="guideCardBody">
                    <div className={styles.cardThemes}>
                      {(editorial?.themes || []).slice(0, 3).map((theme) => (
                        <span key={theme}>{cityThemeLabels[theme]}</span>
                      ))}
                    </div>
                    <h2>{guide.name}</h2>
                    <p>{guide.tagline}</p>
                    {editorial && <small>{editorial.label}: {editorial.vibe}</small>}
                    <strong>
                      Enter the city <ArrowRight size={15} />
                    </strong>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {visibleGuides.length === 0 && (
        <div className={styles.empty}>
          <strong>No city matches that filter yet.</strong>
          <button type="button" onClick={() => { setFilter("all"); setQuery(""); }}>Show every city</button>
        </div>
      )}
    </section>
  );
}
