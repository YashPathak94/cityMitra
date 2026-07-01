"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { offers } from "@/data/offers";
import OfferCard from "@/app/components/OfferCard";

export default function OffersSection() {
  const railRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>(".dealCard");
    const step = (card?.offsetWidth || 260) + 14;
    rail.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  return (
    <section className="dealsBand" id="offers" aria-labelledby="dealsHeading">
      <div className="dealsHeader">
        <div className="dealsHeaderText">
          <span className="dealsKicker">
            <Tag size={13} /> Exclusive offers
          </span>
          <h2 id="dealsHeading">Deals worth planning around</h2>
          <p>Hand-picked discounts on hotels, flights, cabs and food — refreshed as partners update them.</p>
        </div>
        <Link className="dealsViewAll" href="/offers">
          View all offers <ArrowRight size={15} />
        </Link>
      </div>

      <div className="dealsRailWrap">
        <button
          type="button"
          className="dealsArrow dealsArrowPrev"
          aria-label="Scroll to previous offers"
          onClick={() => scrollByCard(-1)}
        >
          <ChevronLeft size={18} />
        </button>

        <div className="dealsRail" ref={railRef}>
          {offers.map((offer) => (
            <div className="dealsRailItem" key={offer.id}>
              <OfferCard offer={offer} />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="dealsArrow dealsArrowNext"
          aria-label="Scroll to next offers"
          onClick={() => scrollByCard(1)}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
