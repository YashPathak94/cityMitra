"use client";

import { useState } from "react";

export type AccordionItem = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  onClick?: () => void;
};

// Known-good Unsplash image used if a panel's image fails to load.
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80";

export default function ImageAccordion({ items, initialActive = 0 }: { items: AccordionItem[]; initialActive?: number }) {
  const [active, setActive] = useState(initialActive);

  return (
    <div className="imgAccordion" role="list">
      {items.map((item, index) => {
        const isActive = index === active;
        return (
          <button
            type="button"
            role="listitem"
            key={item.id}
            className={isActive ? "imgAccordionItem active" : "imgAccordionItem"}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => {
              setActive(index);
              item.onClick?.();
            }}
            aria-label={item.title}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="imgAccordionImg"
              src={item.image}
              alt={item.title}
              loading="lazy"
              onError={(event) => {
                const target = event.currentTarget;
                if (target.src !== FALLBACK_IMAGE) target.src = FALLBACK_IMAGE;
              }}
            />
            <span className="imgAccordionShade" />
            <span className="imgAccordionLabel">
              <b>{item.title}</b>
              {item.subtitle && isActive && <small>{item.subtitle}</small>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
