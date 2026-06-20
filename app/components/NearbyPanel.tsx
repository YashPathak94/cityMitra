"use client";

import { ArrowUpRight, Clock } from "lucide-react";
import { useEffect, useRef } from "react";
import { categories, CategoryKey } from "@/data/city-directory";
import { NearbyCard, UserLocation } from "@/lib/city-intel";
import { imageForCategory } from "@/lib/category-images";
import ImageAccordion from "@/app/components/ImageAccordion";
import NearbyDock from "@/app/components/NearbyDock";

type PhotoBlock = {
  title: string;
  text: string;
  image: string;
  query: string;
};

type NearbyPanelProps = {
  city: string;
  category: CategoryKey;
  userLocation: UserLocation | null;
  nearbyCards: NearbyCard[];
  nearbyFrameIndex: number;
  photoBlocks: PhotoBlock[];
  onRequestLocation: () => void;
  onSetFrame: (index: number) => void;
  onOpenMap: (query: string, label: string) => void;
  onOpenNearbyOptions: () => void;
};

const seededFallback = (seed: string) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/640/400`;

function labelForCategory(key?: CategoryKey) {
  return categories.find((cat) => cat.key === key)?.label || "City";
}

export default function NearbyPanel({
  city,
  category,
  userLocation,
  nearbyCards,
  nearbyFrameIndex,
  photoBlocks,
  onRequestLocation,
  onSetFrame,
  onOpenMap,
  onOpenNearbyOptions
}: NearbyPanelProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Center the selected pick inside the carousel only — never scroll the page.
  useEffect(() => {
    const rail = carouselRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>(`[data-idx="${nearbyFrameIndex}"]`);
    if (card) rail.scrollTo({ left: card.offsetLeft - 4, behavior: "smooth" });
  }, [nearbyFrameIndex]);

  const total = nearbyCards.length;

  return (
    <aside className="nearbyPanel nearbyPanelCompact" id="nearby" aria-label="Nearby map and places">
      <div className="nearbyList" key={`${city}-${category}-nearby`}>
        <div className="nearbyListHeader">
          <div>
            <h3>Top {total} curated nearby picks</h3>
            <span>
              {userLocation?.city ? `${userLocation.city} live-route mode` : userLocation ? "Live-route mode" : "City-smart mode"} · {total} smart suggestions
            </span>
          </div>
        </div>

        {total > 0 ? (
          <div className="nearbyCarousel" ref={carouselRef}>
            {nearbyCards.map((item, index) => (
              <button
                type="button"
                data-idx={index}
                className={index === nearbyFrameIndex ? "nearbyPickCard active" : "nearbyPickCard"}
                key={`${city}-${category}-${index}-${item.name}`}
                onClick={() => {
                  onSetFrame(index);
                  onOpenMap(item.query, `nearby_${item.name}`);
                }}
              >
                <span className="nearbyPickImg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageForCategory(item.category, index)}
                    alt={labelForCategory(item.category)}
                    loading="lazy"
                    onError={(event) => {
                      const target = event.currentTarget;
                      const fallback = seededFallback(`${item.category || "city"}-${index}`);
                      if (target.src !== fallback) target.src = fallback;
                    }}
                  />
                  <span className="nearbyPickTag">{labelForCategory(item.category)}</span>
                </span>
                <span className="nearbyPickBody">
                  <strong className="nearbyPickName">{item.name}</strong>
                  <span className="nearbyPickArea">{item.area}</span>
                  <span className="nearbyPickFoot">
                    <span className="nearbyPickEta">
                      <Clock size={13} />
                      {item.eta}
                    </span>
                    <span className="nearbyPickCta">
                      Open route <ArrowUpRight size={14} />
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p>Ask CityMitra for live-style suggestions, then open the map search for that city.</p>
        )}
      </div>

      {photoBlocks.length > 0 && (
        <ImageAccordion
          items={photoBlocks.map((item) => ({
            id: `${item.title}-${item.query}`,
            title: item.title,
            subtitle: item.text,
            image: item.image,
            onClick: () => onOpenMap(item.query, `photo_${item.title}`)
          }))}
        />
      )}

      <NearbyDock locationOn={Boolean(userLocation)} onLocation={onRequestLocation} onOpenMaps={onOpenNearbyOptions} />
    </aside>
  );
}
