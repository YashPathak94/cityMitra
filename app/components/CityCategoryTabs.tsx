"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import { categories } from "@/data/city-directory";
import styles from "./CityCategoryTabs.module.css";

const groups = [
  {
    id: "essentials",
    label: "Essentials",
    keys: ["markets", "sarees", "electronics", "hospitals", "hotels", "food", "petrol", "sightseeing", "pharmacies", "cabs", "malls", "doctors"]
  },
  {
    id: "eat-play",
    label: "Eat & play",
    keys: ["food", "dinner", "cafes", "bakeries", "nightlife", "cinemas", "parks", "play", "sportsacademy", "malls", "sightseeing", "wedding"]
  },
  {
    id: "health",
    label: "Health",
    keys: ["hospitals", "doctors", "pharmacies", "dentists", "diagnostics", "gym", "grooming", "salon", "pet-care", "restrooms"]
  },
  {
    id: "home",
    label: "Home & life",
    keys: ["plumber", "electrician", "carpenter", "movers", "laundry", "acrepair", "pestcontrol", "furniture", "groceries", "courier", "schools", "pandit", "agriculture", "news"]
  },
  {
    id: "move",
    label: "Move",
    keys: ["repair", "petrol", "evcharging", "cabs", "bike-rental", "car-rental", "restrooms", "hotels", "coworking"]
  },
  { id: "all", label: "All 50", keys: categories.map((category) => category.key) }
] as const;

export default function CityCategoryTabs({ city, citySlug }: { city: string; citySlug: string }) {
  const [activeGroup, setActiveGroup] = useState("essentials");
  const [query, setQuery] = useState("");

  const visibleCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery) {
      return categories.filter((category) =>
        `${category.label} ${category.slug} ${category.key}`.toLowerCase().includes(normalizedQuery)
      );
    }

    const group = groups.find((item) => item.id === activeGroup) || groups[0];
    const keys = new Set<string>(group.keys);
    return categories.filter((category) => keys.has(category.key));
  }, [activeGroup, query]);

  return (
    <div className={styles.dock}>
      <div className={styles.controls}>
        <div className={styles.tabs} role="tablist" aria-label={`Browse local categories in ${city}`}>
          {groups.map((group) => (
            <button
              aria-controls="city-category-panel"
              aria-selected={!query && activeGroup === group.id}
              className={!query && activeGroup === group.id ? styles.activeTab : ""}
              key={group.id}
              onClick={() => {
                setActiveGroup(group.id);
                setQuery("");
              }}
              role="tab"
              type="button"
            >
              {group.label}
            </button>
          ))}
        </div>

        <label className={styles.search}>
          <Search aria-hidden="true" size={16} />
          <span className="srOnly">Find a category in {city}</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a category"
            type="search"
            value={query}
          />
          {query && (
            <button aria-label="Clear category search" onClick={() => setQuery("")} type="button">
              <X size={14} />
            </button>
          )}
        </label>
      </div>

      <div className={styles.panel} id="city-category-panel" role="tabpanel">
        {visibleCategories.length > 0 ? (
          visibleCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                href={`/cities/${citySlug}/${category.slug}?concierge=1`}
                key={category.key}
                style={{ "--category-color": category.tint } as CSSProperties}
              >
                <span className={styles.icon}><Icon aria-hidden="true" size={16} /></span>
                <span>{category.label}</span>
              </Link>
            );
          })
        ) : (
          <p className={styles.empty}>No category matches “{query}”.</p>
        )}
      </div>

      <div className={styles.status} aria-live="polite">
        <span>{visibleCategories.length} options</span>
        <span>Neighbourhood guide + live map handoff</span>
      </div>
    </div>
  );
}
