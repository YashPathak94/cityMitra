"use client";

import { ArrowUpRight, Clock } from "lucide-react";
import { Offer, offerCategoryLabels } from "@/data/offers";
import { trackActivity } from "@/lib/tracking";

export default function OfferCard({ offer }: { offer: Offer }) {
  const live = Boolean(offer.url);
  const label = `${offer.provider} — ${offerCategoryLabels[offer.category]}: ${offer.tagline}${live ? "" : " (coming soon)"}`;

  const inner = (
    <>
      <span className="dealCardAvatar" style={{ background: offer.accent }} aria-hidden="true">
        {offer.provider.charAt(0)}
      </span>
      <span className="dealCardText">
        <span className="dealCardTopRow">
          <strong className="dealCardProvider">{offer.provider}</strong>
          <span className="dealCardBadge" style={live ? { color: offer.accent } : undefined}>
            {offer.badge}
          </span>
        </span>
        <span className="dealCardTagline">{offer.tagline}</span>
      </span>
      <span className={live ? "dealCardArrow" : "dealCardArrow dealCardArrowMuted"} aria-hidden="true">
        {live ? <ArrowUpRight size={15} /> : <Clock size={13} />}
      </span>
    </>
  );

  if (!live) {
    return (
      <div className="dealCard dealCardDisabled" aria-disabled="true" aria-label={label}>
        {inner}
      </div>
    );
  }

  return (
    <a
      className="dealCard"
      href={offer.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={label}
      onClick={() => trackActivity({ type: "offer_click", category: offer.category, label: offer.provider })}
    >
      {inner}
    </a>
  );
}
