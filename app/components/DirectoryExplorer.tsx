"use client";

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Map, MapPin, Navigation, Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";
import { categories, CategoryKey, DirectoryItem } from "@/data/city-directory";
import { cityAliases, NearbyCard, photoSearchImage, titleCaseCity } from "@/lib/city-intel";

const autoRotateIntervalMs = 1500;

const chipSpring = { type: "spring", stiffness: 420, damping: 24 } as const;

// Staggered reveal for the category grid (21st.dev IconGrid pattern).
const gridContainerVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
} as const;

const gridItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
} as const;

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
  const [citySearch, setCitySearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState<number | null>(null);
  const [fullHeight, setFullHeight] = useState<number | null>(null);
  const [hiddenCategoryCount, setHiddenCategoryCount] = useState(0);
  const reduceMotion = useReducedMotion();
  const resultCount = selectedItems.length;
  const resultsRef = useRef<HTMLDivElement>(null);
  const categoryGridRef = useRef<HTMLDivElement>(null);

  const filteredCities = visibleCities.filter((item) => item.toLowerCase().includes(citySearch.trim().toLowerCase()));
  const filteredCategories = categories.filter((item) =>
    item.label.toLowerCase().includes(categorySearch.trim().toLowerCase())
  );
  const isSearchingCategories = categorySearch.trim().length > 0;

  // Measure where the third row begins so the grid can show exactly two rows
  // when collapsed — robust across phone/tablet/desktop column counts.
  useEffect(() => {
    const grid = categoryGridRef.current;
    if (!grid) return;

    const measure = () => {
      const tiles = Array.from(grid.querySelectorAll<HTMLElement>("[data-cat-tile]"));
      if (tiles.length === 0) {
        setCollapsedHeight(null);
        setHiddenCategoryCount(0);
        return;
      }
      const rowTops: number[] = [];
      tiles.forEach((tile) => {
        const top = tile.offsetTop;
        if (!rowTops.some((existing) => Math.abs(existing - top) < 4)) rowTops.push(top);
      });
      rowTops.sort((a, b) => a - b);
      setFullHeight(grid.scrollHeight);
      if (rowTops.length <= 2) {
        setCollapsedHeight(null);
        setHiddenCategoryCount(0);
        return;
      }
      const row3Top = rowTops[2];
      setCollapsedHeight(Math.max(0, row3Top - 2));
      setHiddenCategoryCount(tiles.filter((tile) => tile.offsetTop >= row3Top - 2).length);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [filteredCategories.length]);

  const canCollapseCategories = !isSearchingCategories && hiddenCategoryCount > 0;
  const categoryGridMaxHeight = isSearchingCategories
    ? undefined
    : showAllCategories
      ? fullHeight ?? undefined
      : collapsedHeight ?? undefined;

  // Bring the results into view after a pick. Always scrolls the results step
  // to the top (under the fixed navbar via scroll-margin) on every device.
  function revealResults() {
    if (typeof window === "undefined") return;
    window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  }

  function handleSelectCity(nextCity: string) {
    onSelectCity(nextCity);
    revealResults();
  }

  function handleSelectCategory(nextCategory: CategoryKey) {
    onSelectCategory(nextCategory);
    revealResults();
  }

  // Resolve a free-typed city like the header search does: alias → existing chip
  // → any title-cased city, so users can search ANY city, not just the chips.
  function resolveTypedCity(raw: string) {
    const query = raw.trim();
    if (!query) return null;
    const alias = cityAliases[query.toLowerCase()];
    if (alias) return alias;
    const chipMatch = filteredCities[0];
    if (chipMatch) return chipMatch;
    const titled = titleCaseCity(query);
    return titled.length > 1 ? titled : null;
  }

  function submitCitySearch(event: FormEvent) {
    event.preventDefault();
    const resolved = resolveTypedCity(citySearch);
    if (!resolved) return;
    handleSelectCity(resolved);
    setCitySearch("");
  }

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
          <h2>What are you looking for in {city}?</h2>
        </div>
        <p>Pick your city, tap a category, and get map-ready picks in seconds.</p>
      </div>

      <div className="filters">
        <div className="filterBlock">
          <div className="filterTop">
            <span className="filterLabel">
              <b>1</b> <MapPin size={14} /> Choose your city
            </span>
            <form className="filterSearch" onSubmit={submitCitySearch} role="search">
              <Search size={15} />
              <input
                aria-label="Search any city"
                placeholder="Search any city…"
                value={citySearch}
                onChange={(event) => setCitySearch(event.target.value)}
              />
            </form>
          </div>
          <div className="filterGroup" aria-label="City selector">
            {filteredCities.length > 0 ? (
              filteredCities.map((item) => (
                <motion.button
                  className={city === item ? "active" : ""}
                  key={item}
                  onClick={() => handleSelectCity(item)}
                  whileHover={{ y: -3, scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  transition={chipSpring}
                >
                  {item}
                </motion.button>
              ))
            ) : (
              <button type="button" className="filterUseTyped" onClick={() => submitCitySearch({ preventDefault: () => {} } as FormEvent)}>
                <Search size={14} />
                Go to “{titleCaseCity(citySearch) || citySearch}”
              </button>
            )}
          </div>
        </div>

        <div className="filterBlock">
          <div className="filterTop">
            <span className="filterLabel">
              <b>2</b> Pick a category in {city}
            </span>
            <div className="filterSearch">
              <Search size={15} />
              <input
                aria-label="Search category"
                placeholder="Search category…"
                value={categorySearch}
                onChange={(event) => setCategorySearch(event.target.value)}
              />
            </div>
          </div>
          <div className="categoryGridWrap" style={{ maxHeight: categoryGridMaxHeight }}>
            <motion.div
              className="categoryGrid"
              ref={categoryGridRef}
              variants={gridContainerVariants}
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
            >
              {filteredCategories.length > 0 ? (
                filteredCategories.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      data-cat-tile
                      className={category === item.key ? "category active" : "category"}
                      key={item.key}
                      onClick={() => handleSelectCategory(item.key)}
                      title={item.label}
                      variants={gridItemVariants}
                      whileHover={{ y: -3, scale: 1.04 }}
                      whileTap={{ scale: 0.94 }}
                      style={{ ["--cat-tint" as string]: item.tint }}
                    >
                      <span className="categoryIcon" aria-hidden>
                        <Icon size={20} />
                      </span>
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })
              ) : (
                <span className="filterEmpty">No category matches “{categorySearch}”.</span>
              )}
            </motion.div>
          </div>
          {canCollapseCategories && (
            <button
              type="button"
              className="categoryMoreBtn"
              onClick={() => setShowAllCategories((current) => !current)}
              aria-expanded={showAllCategories}
            >
              {showAllCategories ? (
                <>
                  Show less <ChevronUp size={16} />
                </>
              ) : (
                <>
                  +{hiddenCategoryCount} more categories <ChevronDown size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="filterLabel resultsStepLabel" ref={resultsRef}>
        <b>3</b> Your results — swipe the cards, then open the map
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
