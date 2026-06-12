"use client";

import { ArrowRight, Camera, Compass, Map, MapPinned, Navigation, Sparkles } from "lucide-react";
import { categories, cities } from "@/data/city-directory";
import { UserLocation } from "@/lib/city-intel";
import { mapEmbedUrl, mapSearchUrl } from "@/lib/maps";

type HeroProps = {
  city: string;
  categoryLabel: string;
  cityVisual: { image: string; label: string; position: string };
  nearbyCount: number;
  userLocation: UserLocation | null;
  onSceneAction: (action: "sync" | "map" | "route") => void;
  onOpenMap: (query: string, label: string) => void;
  headerSlot: React.ReactNode;
};

export default function Hero({
  city,
  categoryLabel,
  cityVisual,
  nearbyCount,
  userLocation,
  onSceneAction,
  onOpenMap,
  headerSlot
}: HeroProps) {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `linear-gradient(110deg, rgba(246, 244, 238, 0.97), rgba(246, 244, 238, 0.58)), url("${cityVisual.image}")`,
        backgroundPosition: cityVisual.position
      }}
    >
      <div className="heroContent">
        {headerSlot}

        <div className="heroGrid" id="top">
          <div className="heroCopy">
            <div className="eyebrow">
              <Sparkles size={16} />
              AI city navigation for Indian commerce
            </div>
            <h1>CityMitra</h1>
            <p>
              Find the right Indian city destination for shopping, wholesale, healthcare, food, repairs, schools,
              entertainment, dinner, and sightseeing without losing time across endless searches.
            </p>
            <div className="heroButtons">
              <a className="primaryButton" href="#ai">
                Ask AI Guide <ArrowRight size={18} />
              </a>
              <a className="secondaryButton" href="#directory">
                Browse Categories
              </a>
            </div>
            <div className="metrics">
              <span>
                <b>{categories.length}</b> categories
              </span>
              <span>
                <b>{cities.length}</b> launch cities
              </span>
              <span>
                <b>AI</b> route advice
              </span>
            </div>
            <div className="demoFlow" aria-label="CityMitra product flow">
              {[
                ["01", "Choose city"],
                ["02", "Pick category"],
                ["03", "Ask AI"],
                ["04", "Open map"]
              ].map(([step, label]) => (
                <span key={step}>
                  <b>{step}</b>
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="sceneWrap" aria-label="Animated 3D city directory map">
            <div
              className="motionBackdrop"
              style={{
                backgroundImage: `linear-gradient(120deg, rgba(15, 23, 42, 0.32), rgba(255, 247, 237, 0.2)), url("${cityVisual.image}")`
              }}
            >
              <span className="mountainLayer mountainLayerOne" />
              <span className="mountainLayer mountainLayerTwo" />
              <span className="citySkyline" />
              <span className="motionRouteLine" />
              <span className="motionTraveler" />
            </div>
            <div
              className="sceneCanvasPane"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.12), rgba(255, 247, 237, 0.7)), url("${cityVisual.image}")`
              }}
            >
              <div className="motionSceneHeader">
                <span>
                  <Sparkles size={14} />
                  City sync active
                </span>
                <strong>{cityVisual.label}</strong>
              </div>
              <a
                className="motionScenePhoto"
                href={mapSearchUrl(`${city} ${categoryLabel} places photos`, userLocation)}
                target="_blank"
                rel="noreferrer"
              >
                <img alt={`${city} ${categoryLabel} motion frame`} src={cityVisual.image} loading="lazy" />
                <span>
                  <Camera size={14} />
                  View city photos
                </span>
              </a>
              <div className="motionRouteBoard" aria-label={`${city} route motion frame`}>
                <div className="routeNodes">
                  {[
                    ["01", "Start"],
                    ["02", categoryLabel],
                    ["03", "Nearby"],
                    ["04", "Backup"]
                  ].map(([step, label]) => (
                    <span key={step}>
                      <b>{step}</b>
                      {label}
                    </span>
                  ))}
                </div>
                <div className="placeTicket">
                  <MapPinned size={15} />
                  <span>
                    <b>{city}</b>
                    {categoryLabel} route, maps, photos, and fallback stops.
                  </span>
                </div>
              </div>
              <div className="motionStats" aria-label="CityMitra live route stats">
                <span>
                  <b>{nearbyCount}</b>
                  nearby picks
                </span>
                <span>
                  <b>Maps</b>
                  one tap
                </span>
                <span>
                  <b>AI</b>
                  planner
                </span>
              </div>
              <div className="liveRoutePills" aria-label="Live 3D features">
                <button type="button" onClick={() => onSceneAction("sync")}>
                  <Sparkles size={14} />
                  City sync
                </button>
                <button type="button" onClick={() => onSceneAction("map")}>
                  <MapPinned size={14} />
                  Map picks
                </button>
                <button type="button" onClick={() => onSceneAction("route")}>
                  <Compass size={14} />
                  Route mode
                </button>
              </div>
            </div>
            <div className="sceneMediaRail" aria-label={`${city} photo and map preview`}>
              <a
                className="cityImageCard"
                href={mapSearchUrl(`photos of ${city} ${categoryLabel}`, userLocation)}
                target="_blank"
                rel="noreferrer"
              >
                <img alt={`${city} city visual`} src={cityVisual.image} loading="lazy" />
                <span>
                  <Camera size={14} />
                  {city} photos
                </span>
              </a>
              <div className="routePulseCard" aria-label={`${city} smart route highlights`}>
                <span>
                  <Navigation size={14} />
                  Live route mood
                </span>
                <b>{city}</b>
                <p>{categoryLabel} picks, photo proof, map route, and backup stops synced in one frame.</p>
              </div>
              <div className="mapPreviewCard">
                <iframe
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapEmbedUrl(`${city} India ${categoryLabel}`)}
                  title={`${city} map preview`}
                />
                <button type="button" onClick={() => onOpenMap(`${categoryLabel} near ${city}`, "hero_map_preview")}>
                  <MapPinned size={14} />
                  Open live map
                </button>
              </div>
            </div>
            <div className="sceneBadge">
              <Map size={16} />
              Maps, location & photos
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
