"use client";

import { ChevronDown, ChevronUp, ExternalLink, MapPinned, Navigation } from "lucide-react";
import { categories, CategoryKey } from "@/data/city-directory";
import { NearbyCard, UserLocation } from "@/lib/city-intel";

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

  return (
    <aside className="nearbyPanel" id="nearby" aria-label="Nearby map and places">
      <div className="miniMap">
        <MapPinned size={22} />
        <span>{city}</span>
        <strong>{userLocation?.city ? `Near you · ${categoryLabel}` : categoryLabel}</strong>
      </div>
      <div className="locationBox">
        <button type="button" onClick={onRequestLocation}>
          <Navigation size={15} />
          {userLocation ? "Nearby location enabled" : "Use my nearby location"}
        </button>
        <p>{locationStatus}</p>
      </div>
      <button className="mapPrimaryLink" type="button" onClick={onOpenNearbyOptions}>
        Show nearby options on Maps <ExternalLink size={15} />
      </button>
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

            <div className="nearbyAllDrawer" aria-label="All top 20 nearby picks">
              <strong>All 20 smart nearby suggestions</strong>
              <div>
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
            </div>
          </div>
        ) : (
          <p>Ask CityMitra for live-style suggestions, then open the map search for that city.</p>
        )}
      </div>
      <div className="photoBlocks">
        {photoBlocks.map((item) => (
          <button
            className="photoBlock"
            key={`${item.title}-${item.query}`}
            onClick={() => onOpenMap(item.query, `photo_${item.title}`)}
            style={{ backgroundImage: `linear-gradient(180deg, rgba(18, 20, 23, 0.05), rgba(18, 20, 23, 0.76)), url("${item.image}")` }}
            type="button"
          >
            <span>{item.title}</span>
            <small>{item.text}</small>
          </button>
        ))}
      </div>
      <div className="nearbyActions">
        {["hospitals", "petrol pumps", "vehicle repair", "hotels"].map((item) => (
          <button type="button" onClick={() => onOpenMap(`${item} near ${city}`, `backup_${item}`)} key={item}>
            {item}
          </button>
        ))}
      </div>
    </aside>
  );
}
