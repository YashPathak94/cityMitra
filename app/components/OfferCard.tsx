"use client";

import { ArrowUpRight, Clock } from "lucide-react";
import { Offer, offerCategoryLabels } from "@/data/offers";
import { trackActivity } from "@/lib/tracking";

export default function OfferCard({ offer }: { offer: Offer }) {
  const live = Boolean(offer.url);

  const inner = (
    <>
      <span className="dealCardTop" style={{ background: `linear-gradient(120deg, ${offer.accent}, ${offer.accent}cc)` }}>
        <span className="dealCardBadge">{offer.badge}</span>
        <span className="dealCardCategory">{offerCategoryLabels[offer.category]}</span>
      </span>
      <span className="dealCardBody">
        <span className="dealCardAvatar" style={{ background: offer.accent }} aria-hidden="true">
          {offer.provider.charAt(0)}
        </span>
        <span className="dealCardText">
          <strong className="dealCardProvider">{offer.provider}</strong>
          <span className="dealCardTagline">{offer.tagline}</span>
        </span>
      </span>
      <span className={live ? "dealCardCta" : "dealCardCta dealCardCtaMuted"}>
        {live ? (
          <>
            Grab this offer <ArrowUpRight size={15} />
          </>
        ) : (
          <>
            <Clock size={13} /> Coming soon
          </>
        )}
      </span>
    </>
  );

  if (!live) {
    return (
      <div className="dealCard dealCardDisabled" aria-disabled="true">
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
      onClick={() => trackActivity({ type: "offer_click", category: offer.category, label: offer.provider })}
    >
      {inner}
    </a>
  );
}
