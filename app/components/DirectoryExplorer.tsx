"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { categories, CategoryKey, DirectoryItem } from "@/data/city-directory";
import { NearbyCard, photoSearchImage } from "@/lib/city-intel";
import CircularGallery from "@/app/components/CircularGallery";
import Reveal from "@/app/components/motion/Reveal";

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

  const galleryItems = selectedItems.map((item, index) => {
    const isVerified = exactDirectoryItems.some((exact) => exact.name === item.name);
    return {
      id: `${city}-${category}-${item.name}-${index}`,
      title: item.name,
      subtitle: item.area || "Smart result",
      meta: item.eta,
      badge: isVerified ? "Verified" : "Smart",
      image: item.image || photoSearchImage(city, item.query, index),
      actionLabel: "Open route",
      onAction: () => onOpenMap(item.query, `directory_${item.name}`)
    };
  });

  return (
    <section className="controlBand" id="directory">
      <Reveal>
        <div className="sectionHeader">
          <div>
            <span className="sectionKicker">Destination Finder</span>
            <h2>Choose a city and category</h2>
          </div>
          <p>Built for quick decisions: where to go, what the area is known for, and how to avoid wasted trips.</p>
        </div>
      </Reveal>

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

      <div className="categoryResultFrame" aria-label={`${selectedCategory?.label || category} circular gallery of results`}>
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
                <strong>{activeCategoryResult?.name || "All options deck"}</strong>
                <small>{activeCategoryResult?.area || activeCategoryResult?.eta || "Map check"}</small>
              </div>
              <button type="button" onClick={() => onMoveFrame(1)} aria-label="Next category result">
                Next
                <ChevronDown size={16} />
              </button>
            </div>

            <CircularGallery
              items={galleryItems}
              activeIndex={categoryFrameIndex}
              onActiveIndexChange={onSetFrame}
            />

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
