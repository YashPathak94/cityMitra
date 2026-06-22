"use client";

import { ArrowUpRight } from "lucide-react";
import { ReactNode } from "react";
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

// Banner grid: each card holds a fixed 3:1 banner so uploaded artwork sits
// perfectly (no awkward cropping). The first card spans full width as a hero.
export default function ConciergeSelector({ panels }: { panels: ConciergePanel[] }) {
  return (
    <div className="conciergeGrid" role="list">
      {panels.map((panel, index) => (
        <button
          type="button"
          role="listitem"
          key={panel.key}
          className={index === 0 ? "conciergeCard hero" : "conciergeCard"}
          onClick={panel.onAction}
          aria-label={`${panel.title} — ${panel.actionLabel}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="conciergeCardImg"
            src={panel.image}
            alt={panel.title}
            loading={index === 0 ? "eager" : "lazy"}
            onError={(event) => {
              const fallback = panel.fallbackImage || imageForTheme("city");
              if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
            }}
          />
          <span className="conciergeCardChip">
            {panel.icon}
            {panel.actionLabel}
            <ArrowUpRight size={15} />
          </span>
        </button>
      ))}
    </div>
  );
}
