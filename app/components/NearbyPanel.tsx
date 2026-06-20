"use client";

import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock, ListChecks, MapPinned } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { categories, CategoryKey } from "@/data/city-directory";
import { NearbyCard, UserLocation } from "@/lib/city-intel";
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
  categoryLabel: string;
  userLocation: UserLocation | null;
  locationStatus: string;
  nearbyCards: NearbyCard[];
  nearbyFrameIndex: number;
  photoBlocks: PhotoBlock[];
  onRequestLocation: () => void;
  onMoveFrame: (direction: -1 | 1) => void;
  onSetFrame: (index: number) => void;
  onOpenMap: (query: string, label: string) => void;
  onOpenNearbyOptions: () => void;
};

function labelForCategory(key?: CategoryKey) {
  return categories.find((cat) => cat.key === key)?.label || "City";
}

export default function NearbyPanel({
  city,
  category,
  categoryLabel,
  userLocation,
  locationStatus,
  nearbyCards,
  nearbyFrameIndex,
  photoBlocks,
  onRequestLocation,
  onMoveFrame,
  onSetFrame,
  onOpenMap,
  onOpenNearbyOptions
}: NearbyPanelProps) {
  const [showAll, setShowAll] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Keep the selected pick scrolled into view inside the carousel only — never
  // scroll the whole page.
  useEffect(() => {
    const rail = carouselRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>(`[data-idx="${nearbyFrameIndex}"]`);
    if (card) rail.scrollTo({ left: card.offsetLeft - 4, behavior: "smooth" });
  }, [nearbyFrameIndex]);

  const total = nearbyCards.length;
  const progress = total > 0 ? ((nearbyFrameIndex + 1) / total) * 100 : 0;

  return (
    <aside className="nearbyPanel nearbyPanelCompact" id="nearby" aria-label="Nearby map and places">
      <div className="nearbyBar">
        <div className="nearbyBarHead">
          <span className="nearbyBarIcon">
            <MapPinned size={18} />
          </span>
          <div>
            <strong>{city}</strong>
            <span>{userLocation?.city ? `Near you · ${categoryLabel}` : categoryLabel}</span>
          </div>
        </div>
        <p className="nearbyStatus">{locationStatus}</p>
      </div>

      <div className="nearbyList" key={`${city}-${category}-nearby`}>
        <div className="nearbyListHeader">
          <div>
            <h3>Top {total} curated nearby picks</h3>
            <span>
              {userLocation?.city ? `${userLocation.city} live-route mode` : userLocation ? "Live-route mode" : "City-smart mode"} · {total} smart suggestions
            </span>
          </div>
          {total > 0 && (
            <div className="nearbyHeaderRight">
              <span className="nearbyCounter">
                {String(nearbyFrameIndex + 1).padStart(2, "0")} <i>/ {total}</i>
              </span>
              <div className="nearbyFrameControls" aria-label="Nearby picks controls">
                <button type="button" onClick={() => onMoveFrame(-1)} aria-label="Previous nearby pick">
                  <ChevronLeft size={16} />
                </button>
                <button type="button" onClick={() => onMoveFrame(1)} aria-label="Next nearby pick">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {total > 0 ? (
          <>
            <div className="nearbyProgress" aria-hidden>
              <span style={{ width: `${progress}%` }} />
            </div>

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
                  <span className="nearbyPickTop">
                    <span className="nearbyPickRank">{String(index + 1).padStart(2, "0")}</span>
                    <span className="nearbyPickTag">{labelForCategory(item.category)}</span>
                  </span>
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
                </button>
              ))}
            </div>

            <button type="button" className="nearbyViewAllToggle" onClick={() => setShowAll((current) => !current)} aria-expanded={showAll}>
              <ListChecks size={15} />
              {showAll ? "Hide all" : `View all ${total} suggestions`}
              {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showAll && (
              <div className="nearbyAllDrawer" aria-label={`All ${total} nearby picks`}>
                {nearbyCards.map((item, index) => (
                  <button
                    type="button"
                    onClick={() => {
                      onSetFrame(index);
                      onOpenMap(item.query, `nearby_all_${item.name}`);
                    }}
                    key={`${city}-${category}-all-${index}-${item.name}`}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <b>{item.name}</b>
                    <small>{item.area}</small>
                  </button>
                ))}
              </div>
            )}
          </>
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
