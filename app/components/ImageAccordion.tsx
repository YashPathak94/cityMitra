"use client";

import { useState } from "react";

export type AccordionItem = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  onClick?: () => void;
};

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
            style={{ backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.05), rgba(15,23,42,0.78)), url("${item.image}")` }}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => {
              if (isActive) item.onClick?.();
              else setActive(index);
            }}
            aria-label={item.title}
          >
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
