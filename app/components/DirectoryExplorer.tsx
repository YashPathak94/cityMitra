"use client";

import { ChevronLeft, ChevronRight, Map, MapPin, Navigation } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { CSSProperties, useEffect, useState } from "react";
import { categories, CategoryKey, DirectoryItem } from "@/data/city-directory";
import { NearbyCard, photoSearchImage } from "@/lib/city-intel";

const autoRotateIntervalMs = 1500;

const chipSpring = { type: "spring", stiffness: 420, damping: 24 } as const;

type DirectoryExplorerProps = {
  city: string;
  category: CategoryKey;
  visibleCities: string[];
  selectedItems: NearbyCard[];
  exactDirectoryItems: DirectoryItem[];
  categoryFrameIndex: number;
  onSelectCity: (city: string) => void;
  onSelectCategory: (category: CategoryKey) => void;
  onMoveFrame: (direction: -1 | 1) => void;
  onSetFrame: (index: number) => void;
  onOpenMap: (query: string, label: string) => void;
  onSearchMap: (query: string, label: string) => void;
};

export default function DirectoryExplorer({
  city,
  category,
  visibleCities,
  selectedItems,
  exactDirectoryItems,
  categoryFrameIndex,
  onSelectCity,
  onSelectCategory,
  onMoveFrame,
  onSetFrame,
  onOpenMap,
  onSearchMap
}: DirectoryExplorerProps) {
  const selectedCategory = categories.find((item) => item.key === category);
  const SelectedCategoryIcon = selectedCategory?.icon;
  const activeCategoryResult = selectedItems[categoryFrameIndex] || selectedItems[0];
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();
  const resultCount = selectedItems.length;

  useEffect(() => {
    if (hovered || reduceMotion || resultCount < 2) return;

    const timer = window.setInterval(() => {
      onSetFrame((categoryFrameIndex + 1) % resultCount);
    }, autoRotateIntervalMs);

    return () => window.clearInterval(timer);
  }, [hovered, reduceMotion, resultCount, categoryFrameIndex, onSetFrame]);

  return (
    <section className="controlBand" id="directory">
      <div className="sectionHeader">
        <div>
          <span className="sectionKicker">Destination Finder</span>
          <h2>Choose a city and category</h2>
        </div>
        <p>Built for quick decisions: where to go, what the area is known for, and how to avoid wasted trips.</p>
      </div>

      <div className="filters">
        <div className="filterBlock">
          <span className="filterLabel">
            <b>1</b> Choose your city
          </span>
          <div className="filterGroup" aria-label="City selector">
            {visibleCities.map((item) => (
              <motion.button
                className={city === item ? "active" : ""}
                key={item}
                onClick={() => onSelectCity(item)}
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                transition={chipSpring}
              >
                {item}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="filterBlock">
          <span className="filterLabel">
            <b>2</b> Pick a category in {city}
          </span>
          <div className="categoryGrid">
            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  className={category === item.key ? "category active" : "category"}
                  key={item.key}
                  onClick={() => onSelectCategory(item.key)}
                  title={item.label}
                  whileHover={{ y: -3, scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  transition={chipSpring}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </div>
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

          <div
            className="resultFrameModule categoryResultModule"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocusCapture={() => setHovered(true)}
            onBlurCapture={() => setHovered(false)}
          >
            <div className="resultFrameHeader compact">
              <div>
                <span>{String(categoryFrameIndex + 1).padStart(2, "0")} / {selectedItems.length || 0}</span>
                <strong>All options deck</strong>
                <small>{activeCategoryResult?.area || activeCategoryResult?.eta || "Map check"}</small>
              </div>
            </div>

            <div className="rotatingResultFrame categoryResultMotion" aria-live="polite">
              <button
                className="deckArrow deckArrowPrev"
                type="button"
                onClick={() => onMoveFrame(-1)}
                aria-label="Previous card"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                className="deckArrow deckArrowNext"
                type="button"
                onClick={() => onMoveFrame(1)}
                aria-label="Next card"
              >
                <ChevronRight size={22} />
              </button>
              <div className="frameBackdrop">
                <span
                  className="frameBackdropImage"
                  aria-hidden="true"
                  style={{
                    backgroundImage: `linear-gradient(145deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.72)), url("${photoSearchImage(city, activeCategoryResult?.query || selectedCategory?.label || category, categoryFrameIndex)}")`
                  }}
                />
                <span>{activeCategoryResult?.area || "City route"}</span>
                <b>{selectedCategory?.label || "Category"}</b>
              </div>

              <div className="rotatingDeck">
                {selectedItems.map((item, index) => {
                  const rawOffset = index - categoryFrameIndex;
                  const resultCount = selectedItems.length;
                  const offset = rawOffset > resultCount / 2 ? rawOffset - resultCount : rawOffset < -resultCount / 2 ? rawOffset + resultCount : rawOffset;
                  const visible = Math.abs(offset) <= 2;
                  const isVerified = exactDirectoryItems.some((exact) => exact.name === item.name);

                  return (
                    <article
                      className={offset === 0 ? "rotatingCard categoryRouteCard active" : visible ? "rotatingCard categoryRouteCard visible" : "rotatingCard categoryRouteCard"}
                      key={`${item.name}-${item.query}`}
                      style={{ "--card-offset": offset, "--card-abs": Math.abs(offset) } as CSSProperties}
                    >
                      <span className="resultIndex">{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <h3>{item.name}</h3>
                        <p>{item.why || `Curated ${selectedCategory?.label.toLowerCase() || "city"} option for ${city} with maps, photos, and route checks.`}</p>
                      </div>
                      <div className="intelMeta">
                        <span>{item.area || "Smart result"}</span>
                        <span>{item.eta}</span>
                        <span>{isVerified ? "Verified" : "Smart"}</span>
                      </div>
                      <div className="cardMapActions">
                        <button type="button" onClick={() => onSearchMap(item.query, `directory_show_${item.name}`)}>
                          <MapPin size={14} />
                          Show on map
                        </button>
                        <button type="button" className="ghostMapBtn" onClick={() => onOpenMap(item.query, `directory_route_${item.name}`)}>
                          <Navigation size={14} />
                          Directions
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              className="viewAllOnMap"
              onClick={() => onSearchMap(`top ${selectedCategory?.label || category} in ${city}`, "directory_all_map")}
            >
              <Map size={15} />
              View all top {selectedCategory?.label?.toLowerCase() || "spots"} in {city} on the map
            </button>

            <div className="resultDots" aria-label="Category result progress">
              {selectedItems.map((item, index) => (
                <button
                  aria-label={`Show ${item.name}`}
                  className={index === categoryFrameIndex ? "active" : ""}
                  key={`${item.name}-category-dot`}
                  onClick={() => onSetFrame(index)}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
