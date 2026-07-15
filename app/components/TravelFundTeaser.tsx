"use client";

import Link from "next/link";
import { useCountUp } from "@/app/components/motion/useCountUp";
import { trackActivity } from "@/lib/tracking";

const BAR_HEIGHTS = [22, 34, 46, 62, 78, 100];

// The travel-funding teaser band: the industry-first pitch on the signature
// gradient, with a counted-up rupee figure and a simple month-by-month climb.
export default function TravelFundTeaser({ city }: { city: string }) {
  const { ref, value } = useCountUp(6873);

  return (
    <section className="fundTeaserBand" aria-label="AI travel-funding engine">
      <div className="fundTeaser">
        <div className="fundTeaserCopy">
          <p className="fundTeaserKicker">Industry-first · AI travel-funding engine</p>
          <h2>
            Your trip, <em>funded.</em>
          </h2>
          <p className="fundTeaserSub">
            SIPs, mutual funds and card rewards chip away at the cost before you even pack. Deterministic math, zero
            vibes-based budgeting.
          </p>
          <Link
            href="/travel-plan"
            className="fundTeaserCta"
            onClick={() => trackActivity({ type: "scene_action", city, category: "markets", label: "fund_teaser_cta" })}
          >
            Fund my trip <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="fundTeaserViz">
          <div>
            <strong ref={ref as React.Ref<HTMLElement>} className="fundTeaserAmount">
              ₹{value.toLocaleString("en-IN")}
            </strong>
            <p>of a ₹1,00,000 trip covered by returns + rewards — in 6 months</p>
          </div>
          <div className="fundTeaserBars" aria-hidden="true">
            {BAR_HEIGHTS.map((height, index) => (
              <span
                key={height}
                className={index === BAR_HEIGHTS.length - 1 ? "isFinal" : undefined}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <small>Illustrative math — not investment advice. Markets can fall.</small>
        </div>
      </div>
    </section>
  );
}
