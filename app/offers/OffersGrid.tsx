"use client";

import { useMemo, useState } from "react";
import { Offer, OfferCategory, offerCategoryLabels, offers } from "@/data/offers";
import OfferCard from "@/app/components/OfferCard";

const categories: Array<OfferCategory | "all"> = ["all", "hotels", "flights", "cabs", "food", "trains", "cards", "shopping"];

export default function OffersGrid() {
  const [active, setActive] = useState<OfferCategory | "all">("all");

  const filtered = useMemo<Offer[]>(
    () => (active === "all" ? offers : offers.filter((offer) => offer.category === active)),
    [active]
  );

  return (
    <>
      <div className="dealsFilterRow" role="tablist" aria-label="Filter offers by category">
        {categories.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            className={active === key ? "dealsFilterChip active" : "dealsFilterChip"}
            onClick={() => setActive(key)}
          >
            {key === "all" ? "All offers" : offerCategoryLabels[key]}
          </button>
        ))}
      </div>

      <div className="dealsGrid">
        {filtered.map((offer) => (
          <OfferCard offer={offer} key={offer.id} />
        ))}
      </div>
    </>
  );
}
