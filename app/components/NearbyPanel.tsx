"use client";

import { ArrowUpRight, Clock } from "lucide-react";
import { useEffect, useRef } from "react";
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
  nearbyCards: NearbyCard[];
  nearbyFrameIndex: number;
  photoBlocks: PhotoBlock[];
  onRequestLocation: () => void;
  onSetFrame: (index: number) => void;
  onOpenMap: (query: string, label: string) => void;
  onOpenNearbyOptions: () => void;
};

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&q=80`;
const FALLBACK_IMAGE = unsplash("1524492412937-b28074a5d7da");

// Premium imagery picked to match each pick's category.
const CATEGORY_IMAGES: Partial<Record<CategoryKey, string>> = {
  hotels: unsplash("1566073771259-6a8506099945"),
  food: unsplash("1414235077428-338989a2e8c0"),
  dinner: unsplash("1517248135467-4c7edcad34c4"),
  markets: unsplash("1555396273-367ea4eb4db5"),
  sarees: unsplash("1610030469983-98e550d6193c"),
  electronics: unsplash("1498049794561-7780e7231661"),
  malls: unsplash("1441986300917-64674bd600d8"),
  hospitals: unsplash("1519494026892-80bbd2d6fd0d"),
  petrol: unsplash("1545262810-77515befe149"),
  repair: unsplash("1530046339160-ce3e530c7d2f"),
  acrepair: unsplash("1530046339160-ce3e530c7d2f"),
  plumber: unsplash("1530046339160-ce3e530c7d2f"),
  electrician: unsplash("1621905251918-48416bd8575a"),
  carpenter: unsplash("1530046339160-ce3e530c7d2f"),
  movers: unsplash("1600518464441-9154a4dea21b"),
  gym: unsplash("1571019613454-1cb2f99b2d8b"),
  salon: unsplash("1560066984-138dadb4c035"),
  grooming: unsplash("1503951914875-452162b0f3f1"),
  schools: unsplash("1503676260728-1c00da094a0b"),
  sightseeing: unsplash("1524492412937-b28074a5d7da")
};

function labelForCategory(key?: CategoryKey) {
  return categories.find((cat) => cat.key === key)?.label || "City";
}

function imageForCategory(key?: CategoryKey) {
  return (key && CATEGORY_IMAGES[key]) || FALLBACK_IMAGE;
}

export default function NearbyPanel({
  city,
  category,
  categoryLabel,
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
                    src={imageForCategory(item.category)}
                    alt={labelForCategory(item.category)}
                    loading="lazy"
                    onError={(event) => {
                      const target = event.currentTarget;
                      if (target.src !== FALLBACK_IMAGE) target.src = FALLBACK_IMAGE;
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
