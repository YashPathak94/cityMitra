"use client";

import { MapPinned, Navigation } from "lucide-react";

type LocationPromptProps = {
  open: boolean;
  hasLocation: boolean;
  city: string;
  onEnable: () => void;
  onDismiss: () => void;
};

export default function LocationPrompt({ open, hasLocation, city, onEnable, onDismiss }: LocationPromptProps) {
  if (!open) return null;

  return (
    <div className="locationPromptOverlay" role="dialog" aria-modal="true" aria-labelledby="locationPromptTitle">
      <div className="locationPromptCard">
        <span className="locationPromptIcon">
          <MapPinned size={24} />
        </span>
        <div>
          <span className="sectionKicker">Nearby Recommendations</span>
          <h2 id="locationPromptTitle">{hasLocation ? "Auto-detect your current city" : "Enable location for curated city picks"}</h2>
          <p>
            {hasLocation
              ? `You selected ${city}. Auto-detect again to sync the city tab, pictures, maps, and top 20 recommendations with where you are now.`
              : "CityMitra can show the top 20 nearby places, route-ready suggestions, hotels, food, fuel, repairs, and backup stops from where you are starting."}
          </p>
        </div>
        <div className="locationPromptActions">
          <button className="primaryButton" type="button" onClick={onEnable}>
            {hasLocation ? "Auto-detect location" : "Enable nearby recommendations"} <Navigation size={17} />
          </button>
          <button className="secondaryButton" type="button" onClick={onDismiss}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
