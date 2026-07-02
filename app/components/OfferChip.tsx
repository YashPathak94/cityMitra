"use client";

import { ArrowUpRight, Clock } from "lucide-react";
import { Offer } from "@/data/offers";
import { trackActivity } from "@/lib/tracking";

// Compact flip chip for the home page rail: front shows brand + offer %,
// hovering (or keyboard-focusing) flips it to reveal the full tagline.
// Clicking anywhere always fires the action — the flip is a hover bonus,
// not a gate — so a tap on mobile (no hover) still redirects instantly.
export default function OfferChip({ offer, duplicate = false }: { offer: Offer; duplicate?: boolean }) {
  const live = Boolean(offer.url);

  const faces = (
    <span className="dealChipFlip">
      <span className="dealChipFace dealChipFront">
        <span className="dealChipAvatar" style={{ background: offer.accent }} aria-hidden="true">
          {offer.provider.charAt(0)}
        </span>
        <span className="dealChipFrontText">
          <strong className="dealChipProvider">{offer.provider}</strong>
          <span className="dealChipBadge" style={{ color: offer.accent }}>
            {offer.badge}
          </span>
        </span>
      </span>

      <span className="dealChipFace dealChipBack" style={{ background: offer.accent }}>
        <span className="dealChipTagline">{offer.tagline}</span>
        <span className="dealChipCta">
          {live ? (
            <>
              Grab this offer <ArrowUpRight size={13} />
            </>
          ) : (
            <>
              <Clock size={12} /> Coming soon
            </>
          )}
        </span>
      </span>
    </span>
  );

  if (!live) {
    return (
      <div
        className="dealChip dealChipDisabled"
        aria-disabled="true"
        aria-hidden={duplicate || undefined}
        tabIndex={duplicate ? -1 : undefined}
        aria-label={duplicate ? undefined : `${offer.provider}: ${offer.tagline} (coming soon)`}
      >
        {faces}
      </div>
    );
  }

  return (
    <a
      className="dealChip"
      href={offer.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
      aria-label={duplicate ? undefined : `${offer.provider}: ${offer.tagline}`}
      onClick={() => trackActivity({ type: "offer_click", category: offer.category, label: offer.provider })}
    >
      {faces}
    </a>
  );
}
