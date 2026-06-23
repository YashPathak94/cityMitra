"use client";

import { ReactNode, useEffect, useState } from "react";
import { imageForTheme } from "@/lib/category-images";

export type ConciergePanel = {
  key: string;
  title: string;
  description: string;
  image: string;
  fallbackImage?: string;
  icon: ReactNode;
  actionLabel: string;
  onAction: () => void;
};

// Image accordion of self-contained banners: the active panel expands to the
// banner's native 7:2 ratio (so the artwork is never cropped and needs no text
// overlay), while collapsed tabs show a small glass icon for wayfinding.
export default function ConciergeSelector({ panels }: { panels: ConciergePanel[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState<number[]>([]);

  useEffect(() => {
    const timers = panels.map((_, index) =>
      setTimeout(() => setRevealed((prev) => (prev.includes(index) ? prev : [...prev, index])), 120 * index)
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panels.length]);

  return (
    <div className="conciergeSelector" role="group" aria-label="CityMitra concierge">
      {panels.map((panel, index) => {
        const active = index === activeIndex;
        return (
          <button
            type="button"
            key={panel.key}
            className={active ? "conciergePanel active" : "conciergePanel"}
            style={{
              flexGrow: active ? 7 : 1,
              opacity: revealed.includes(index) ? 1 : 0,
              transform: revealed.includes(index) ? "translateX(0)" : "translateX(-32px)"
            }}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onClick={() => (active ? panel.onAction() : setActiveIndex(index))}
            aria-label={`${panel.title} — ${panel.actionLabel}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="conciergePanelImg"
              src={panel.image}
              alt={panel.title}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              onError={(event) => {
                const fallback = panel.fallbackImage || imageForTheme("city");
                if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
              }}
            />
            <span className="conciergePanelIcon" aria-hidden="true">{panel.icon}</span>
          </button>
        );
      })}
    </div>
  );
}
