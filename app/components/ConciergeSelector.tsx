"use client";

import { ArrowUpRight } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

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

export default function ConciergeSelector({ panels }: { panels: ConciergePanel[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState<number[]>([]);

  useEffect(() => {
    const timers = panels.map((_, index) =>
      setTimeout(() => setRevealed((prev) => (prev.includes(index) ? prev : [...prev, index])), 140 * index)
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panels.length]);

  return (
    <div className="conciergeSelector" role="list">
      {panels.map((panel, index) => {
        const active = index === activeIndex;
        return (
          <div
            role="listitem"
            key={panel.key}
            className={active ? "conciergePanel active" : "conciergePanel"}
            style={{
              backgroundImage: `linear-gradient(to top, rgba(15,23,42,0.9), rgba(15,23,42,0.1)), url('${panel.image}')${panel.fallbackImage ? `, url('${panel.fallbackImage}')` : ""}`,
              flexGrow: active ? 7 : 1,
              opacity: revealed.includes(index) ? 1 : 0,
              transform: revealed.includes(index) ? "translate(0)" : "translateX(-40px)"
            }}
            onClick={() => setActiveIndex(index)}
            aria-current={active}
          >
            <div className="conciergePanelLabel">
              <span className="conciergePanelIcon">{panel.icon}</span>
              <div className="conciergePanelInfo">
                <div className="conciergePanelTitle">{panel.title}</div>
                <div className="conciergePanelDesc">{panel.description}</div>
                {active && (
                  <button
                    type="button"
                    className="conciergePanelAction"
                    onClick={(event) => {
                      event.stopPropagation();
                      panel.onAction();
                    }}
                  >
                    {panel.actionLabel} <ArrowUpRight size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
