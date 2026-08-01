"use client";

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Map, MapPin, Navigation, Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";
import { categories, categoryHref, CategoryKey, DirectoryItem } from "@/data/city-directory";
import { cityGuides } from "@/data/city-guides";
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
  const router = useRouter();
  const selectedCategory = categories.find((item) => item.key === category);
  const SelectedCategoryIcon = selectedCategory?.icon;
  const activeCategoryResult = selectedItems[categoryFrameIndex] || selectedItems[0];
  const [hovered, setHovered] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [showAllCities, setShowAllCities] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [hasHiddenCategories, setHasHiddenCategories] = useState(false);
  const reduceMotion = useReducedMotion();
  const resultCount = selectedItems.length;
  const resultsRef = useRef<HTMLDivElement>(null);
  const categoryGridRef = useRef<HTMLDivElement>(null);

  const filteredCities = visibleCities.filter((item) => item.toLowerCase().includes(citySearch.trim().toLowerCase()));
  const isSearchingCities = citySearch.trim().length > 0;
  const cityPreviewLimit = 12;
  const previewCities = filteredCities.slice(0, cityPreviewLimit);
  const displayedCities =
    isSearchingCities || showAllCities
      ? filteredCities
      : city && !previewCities.includes(city)
        ? [city, ...previewCities.filter((item) => item !== city)].slice(0, cityPreviewLimit)
        : previewCities;
  const hasMoreCities = !isSearchingCities && filteredCities.length > cityPreviewLimit;
  const filteredCategories = categories.filter((item) =>
    item.label.toLowerCase().includes(categorySearch.trim().toLowerCase())
  );
  const isSearchingCategories = categorySearch.trim().length > 0;

  // The grid is clipped to two rows by CSS; here we only detect whether any
  // tiles spill past those two rows, so the toggle appears only when it has a
  // job to do. scrollHeight is the full height (the wrapper does the clipping).
  useEffect(() => {
    const grid = categoryGridRef.current;
    if (!grid) return;

    const measure = () => {
      const tiles = grid.querySelectorAll<HTMLElement>("[data-cat-tile]");
      if (tiles.length === 0) {
        setHasHiddenCategories(false);
        return;
      }
      const tileHeight = tiles[0].offsetHeight;
      const rowGap = parseFloat(getComputedStyle(grid).rowGap || "0") || 0;
      // visible rows differ by breakpoint (2 on desktop, 3 on phones)
      const wrapper = grid.parentElement;
      const rows = wrapper ? parseInt(getComputedStyle(wrapper).getPropertyValue("--cat-rows"), 10) || 2 : 2;
      const visibleHeight = tileHeight * rows + rowGap * (rows - 1);
      setHasHiddenCategories(grid.scrollHeight > visibleHeight + 4);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [filteredCategories.length]);

  // Show the toggle only when there is something hidden and we're not filtering.
  const canCollapseCategories = !isSearchingCategories && hasHiddenCategories;
  // Reveal everything while searching, or when the user expanded the grid.
  const showCategoryGridExpanded = isSearchingCategories || showAllCategories;

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
    const cityGuide = cityGuides.find((guide) => guide.name.toLowerCase() === city.toLowerCase());
    if (cityGuide) {
      router.push(`${categoryHref(cityGuide.slug, nextCategory)}?concierge=1`);
      return;
    }
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
        <div className="finderSearchRow">
          <form className="filterSearch" onSubmit={submitCitySearch} role="search">
            <Search size={15} />
            <input
              aria-label="Search any city"
              placeholder="Search any city…"
              value={citySearch}
              onChange={(event) => setCitySearch(event.target.value)}
            />
          </form>
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

        <div className="filterBlock">
          <div className="filterTop">
            <span className="filterLabel">
              <b>1</b> <MapPin size={14} /> Choose your city
            </span>
          </div>
          <div className="filterGroup" id="home-city-selector" aria-label="City selector">
            {displayedCities.length > 0 ? (
              displayedCities.map((item) => (
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
          {hasMoreCities && (
            <button
              type="button"
              className="categoryMoreBtn cityMoreBtn"
              onClick={() => setShowAllCities((current) => !current)}
              aria-expanded={showAllCities}
              aria-controls="home-city-selector"
            >
              {showAllCities ? (
                <>
                  Show fewer cities <ChevronUp size={16} />
                </>
              ) : (
                <>
                  Show all {filteredCities.length} cities <ChevronDown size={16} />
                </>
              )}
            </button>
          )}
        </div>

        <div className="filterBlock">
          <div className="filterTop">
            <span className="filterLabel">
              <b>2</b> Pick a category in {city}
            </span>
          </div>
          <div className={showCategoryGridExpanded ? "categoryGridWrap expanded" : "categoryGridWrap"}>
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
                  Show more <ChevronDown size={16} />
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
