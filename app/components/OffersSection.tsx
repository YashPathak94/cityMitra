"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { offers } from "@/data/offers";
import OfferChip from "@/app/components/OfferChip";

const LOOP_OFFERS = [...offers, ...offers];

export default function OffersSection() {
  const railRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Continuously drifts the rail to the right at a steady pace, then snaps
  // back by half its (doubled) width once the first copy scrolls past —
  // an invisible loop since the second copy is identical.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let last = performance.now();
    let frame = requestAnimationFrame(tick);
    const pxPerSecond = 38;

    function tick(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      if (!pausedRef.current && rail) {
        rail.scrollLeft += pxPerSecond * dt;
        const half = rail.scrollWidth / 2;
        if (rail.scrollLeft >= half) rail.scrollLeft -= half;
      }
      frame = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(frame);
  }, []);

  function pause() {
    pausedRef.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }

  function resume(delay: number) {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      pausedRef.current = false;
    }, delay);
  }

  function scrollByCard(direction: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    pause();
    const card = rail.querySelector<HTMLElement>(".dealChip");
    const step = (card?.offsetWidth || 176) + 10;
    rail.scrollBy({ left: step * direction, behavior: "smooth" });
    resume(900);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByCard(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByCard(-1);
    }
  }

  return (
    <section className="dealsBand" id="offers" aria-label="Offers and deals">
      <div className="dealsHeader">
        <span className="dealsKicker">
          <Tag size={13} /> Offers
        </span>
        <Link className="dealsViewAll" href="/offers">
          View all <ArrowRight size={14} />
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

        <div
          className="dealsRail"
          ref={railRef}
          tabIndex={0}
          role="group"
          aria-label="Offers — use the left and right arrow keys to scroll"
          onKeyDown={onKeyDown}
          onMouseEnter={pause}
          onMouseLeave={() => resume(0)}
          onFocus={pause}
          onBlur={() => resume(0)}
          onTouchStart={pause}
          onTouchEnd={() => resume(700)}
        >
          {LOOP_OFFERS.map((offer, i) => (
            <div className="dealsRailItem" key={`${offer.id}-${i}`}>
              <OfferChip offer={offer} duplicate={i >= offers.length} />
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
