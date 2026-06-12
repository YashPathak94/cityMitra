"use client";

import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { CSSProperties } from "react";
import { categories, CategoryKey, DirectoryItem } from "@/data/city-directory";
import { NearbyCard, photoSearchImage } from "@/lib/city-intel";

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
  onOpenMap
}: DirectoryExplorerProps) {
  const selectedCategory = categories.find((item) => item.key === category);
  const SelectedCategoryIcon = selectedCategory?.icon;
  const activeCategoryResult = selectedItems[categoryFrameIndex] || selectedItems[0];

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
        <div className="filterGroup" aria-label="City selector">
          {visibleCities.map((item) => (
            <button className={city === item ? "active" : ""} key={item} onClick={() => onSelectCity(item)}>
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
                onClick={() => onSelectCategory(item.key)}
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

          <div className="resultFrameModule categoryResultModule">
            <div className="resultFrameHeader">
              <button type="button" onClick={() => onMoveFrame(-1)} aria-label="Previous category result">
                <ChevronUp size={16} />
                Previous
              </button>
              <div>
                <span>{String(categoryFrameIndex + 1).padStart(2, "0")} / {selectedItems.length || 0}</span>
                <strong>All options deck</strong>
                <small>{activeCategoryResult?.area || activeCategoryResult?.eta || "Map check"}</small>
              </div>
              <button type="button" onClick={() => onMoveFrame(1)} aria-label="Next category result">
                Next
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="rotatingResultFrame categoryResultMotion" aria-live="polite">
              <div
                className="frameBackdrop"
                style={{
                  backgroundImage: `linear-gradient(145deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.72)), url("${photoSearchImage(city, activeCategoryResult?.query || selectedCategory?.label || category, categoryFrameIndex)}")`
                }}
              >
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
                      <button type="button" onClick={() => onOpenMap(item.query, `directory_${item.name}`)}>
                        Open route <ExternalLink size={14} />
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>

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
