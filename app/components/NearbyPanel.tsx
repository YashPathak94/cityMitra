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

// A diverse pool of premium city / travel / service photos, one per pick so all
// 20 cards differ. Any that fails to load falls back to a distinct seeded image.
const PICK_IMAGES = [
  unsplash("1566073771259-6a8506099945"),
  unsplash("1414235077428-338989a2e8c0"),
  unsplash("1555396273-367ea4eb4db5"),
  unsplash("1524492412937-b28074a5d7da"),
  unsplash("1488646953014-85cb44e25828"),
  unsplash("1502602898657-3e91760cbb34"),
  unsplash("1480714378408-67cf0d13bc1b"),
  unsplash("1517248135467-4c7edcad34c4"),
  unsplash("1441986300917-64674bd600d8"),
  unsplash("1498049794561-7780e7231661"),
  unsplash("1571019613454-1cb2f99b2d8b"),
  unsplash("1469854523086-cc02fe5d8800"),
  unsplash("1506905925346-21bda4d32df4"),
  unsplash("1507525428034-b723cf961d3e"),
  unsplash("1501785888041-af3ef285b470"),
  unsplash("1519494026892-80bbd2d6fd0d"),
  unsplash("1503376780353-7e6692767b70"),
  unsplash("1436491865332-7a61a109cc05"),
  unsplash("1520250497591-112f2f40a3f4"),
  unsplash("1517840901100-8179e982acb7"),
  unsplash("1513475382585-d06e58bcb0e0"),
  unsplash("1551882547-ff40c63fe5fa")
];

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
                    src={PICK_IMAGES[index % PICK_IMAGES.length]}
                    alt={labelForCategory(item.category)}
                    loading="lazy"
                    onError={(event) => {
                      const target = event.currentTarget;
                      const fallback = seededFallback(`${item.name}-${index}`);
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
