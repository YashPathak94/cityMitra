"use client";

import { ChevronDown, ChevronUp, ExternalLink, ListChecks, MapPinned, Navigation } from "lucide-react";
import { useState } from "react";
import { categories, CategoryKey } from "@/data/city-directory";
import { NearbyCard, UserLocation } from "@/lib/city-intel";
import ImageAccordion from "@/app/components/ImageAccordion";

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
  const activeNearbyPick = nearbyCards[nearbyFrameIndex] || nearbyCards[0];
  const [showAll, setShowAll] = useState(false);

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
        <div className="nearbyBarActions">
          <button type="button" className={userLocation ? "nearbyLocBtn on" : "nearbyLocBtn"} onClick={onRequestLocation}>
            <Navigation size={14} />
            {userLocation ? "Location on" : "Use my location"}
          </button>
          <button type="button" className="nearbyMapBtn" onClick={onOpenNearbyOptions}>
            Open Maps <ExternalLink size={14} />
          </button>
        </div>
      </div>
      <p className="nearbyStatus">{locationStatus}</p>

      <div className="nearbyList" key={`${city}-${category}-nearby`}>
        <div className="nearbyListHeader">
          <div>
            <h3>Top 20 curated nearby picks</h3>
            <span>
              {userLocation?.city ? `${userLocation.city} live-route mode` : userLocation ? "Live-route mode" : "City-smart mode"} · {nearbyCards.length} smart suggestions
            </span>
          </div>
          <div className="nearbyFrameControls" aria-label="Nearby picks controls">
            <button type="button" onClick={() => onMoveFrame(-1)} aria-label="Previous nearby pick">
              <ChevronUp size={14} />
            </button>
            <button type="button" onClick={() => onMoveFrame(1)} aria-label="Next nearby pick">
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
        {nearbyCards.length > 0 ? (
          <div className="nearbyDeck">
            <button
              className="nearbyFocusCard"
              type="button"
              onClick={() => activeNearbyPick && onOpenMap(activeNearbyPick.query, `nearby_${activeNearbyPick.name}`)}
            >
              <span className="nearbyIndex">{String(nearbyFrameIndex + 1).padStart(2, "0")} / {nearbyCards.length}</span>
              <strong>{activeNearbyPick?.name}</strong>
              <small>
                {categories.find((cat) => cat.key === activeNearbyPick?.category)?.label || "City"} · {activeNearbyPick?.area} · {activeNearbyPick?.eta}
              </small>
              <em>{userLocation ? "Routes from your current location" : "Enable location for live-start routing"}</em>
            </button>

            <div className="nearbyDots" aria-label="Nearby picks progress">
              {nearbyCards.map((item, index) => (
                <button
                  aria-label={`Show ${item.name}`}
                  className={index === nearbyFrameIndex ? "active" : ""}
                  key={`${item.name}-nearby-dot-${index}`}
                  onClick={() => onSetFrame(index)}
                  type="button"
                />
              ))}
            </div>

            <button type="button" className="nearbyViewAllToggle" onClick={() => setShowAll((current) => !current)} aria-expanded={showAll}>
              <ListChecks size={15} />
              {showAll ? "Hide all 20" : "View all 20 suggestions"}
              {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showAll && (
              <div className="nearbyAllDrawer" aria-label="All top 20 nearby picks">
                {nearbyCards.map((item, index) => (
                  <button
                    type="button"
                    onClick={() => {
                      onSetFrame(index);
                      onOpenMap(item.query, `nearby_all_${item.name}`);
                    }}
                    key={`${city}-${category}-${index}-${item.name}`}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <b>{item.name}</b>
                    <small>{item.area}</small>
                  </button>
                ))}
              </div>
            )}
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
    </aside>
  );
}
