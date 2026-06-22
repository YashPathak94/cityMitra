"use client";

import { ArrowUpRight } from "lucide-react";
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

// Premium image accordion: the active panel expands while the rest collapse to
// slim, labelled rails. The artwork sits in a real <img> layer (kept crisp,
// lazily decoded, with a graceful fallback) under a legibility scrim.
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
              alt=""
              aria-hidden="true"
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              onError={(event) => {
                const fallback = panel.fallbackImage || imageForTheme("city");
                if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
              }}
            />
            <span className="conciergePanelScrim" aria-hidden="true" />

            {/* Collapsed state: a slim vertical rail so every tab stays identifiable */}
            <span className="conciergePanelRail" aria-hidden="true">
              <span className="conciergePanelIcon">{panel.icon}</span>
              <span className="conciergePanelRailText">{panel.title}</span>
            </span>

            {/* Expanded state: full label + action pill */}
            <span className="conciergePanelLabel">
              <span className="conciergePanelIcon">{panel.icon}</span>
              <span className="conciergePanelInfo">
                <span className="conciergePanelTitle">{panel.title}</span>
                <span className="conciergePanelDesc">{panel.description}</span>
                <span className="conciergePanelAction">
                  {panel.actionLabel} <ArrowUpRight size={15} />
                </span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
