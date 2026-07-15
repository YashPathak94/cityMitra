"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { categories, CategoryKey } from "@/data/city-directory";
import { buildBookingOptions, BookingCategory, bookingCategoryLabels, categoryToBooking } from "@/lib/booking";
import { buildGeneratedResults } from "@/lib/city-intel";
import { trackActivity } from "@/lib/tracking";
import ConciergePip, { LocalPicks } from "@/app/components/ConciergePip";
import { ConciergeGroup } from "@/app/components/ConciergeCard";
import { useCountUp } from "@/app/components/motion/useCountUp";

type AiTeaserProps = {
  city: string;
  category: CategoryKey;
};

function BentoStat({ target, suffix, label }: { target: number; suffix?: string; label: string }) {
  const { ref, value } = useCountUp(target);
  return (
    <div className="cmBentoStat">
      <strong ref={ref as React.Ref<HTMLElement>}>
        {value}
        {suffix}
      </strong>
      <span>{label}</span>
    </div>
  );
}

// The concierge, as a bento: one large City Chat card (the signature entry
// point) surrounded by booking shortcuts that open the provider pip, plus a
// gradient stat band. All booking/pip/tracking behavior is unchanged.
export default function AiTeaser({ city, category }: AiTeaserProps) {
  const router = useRouter();
  const [pip, setPip] = useState<{ groups: ConciergeGroup[]; local: LocalPicks | null } | null>(null);
  const initialised = useRef(false);

  function localPicksFor(categoryKey: CategoryKey): LocalPicks {
    const label = categories.find((item) => item.key === categoryKey)?.label || "Top picks";
    const items = buildGeneratedResults(city, categoryKey, 12).map((result) => ({
      name: result.name,
      area: result.area,
      query: result.query
    }));
    return { label, city, items };
  }

  function openBooking(bookingCategory: BookingCategory) {
    const options = buildBookingOptions(bookingCategory, { city, destination: city });
    setPip({ groups: options.length ? [{ category: bookingCategory, label: bookingCategoryLabels[bookingCategory], options }] : [], local: null });
    trackActivity({ type: "concierge_quick_action", city, category, label: bookingCategory });
  }

  function openChat() {
    trackActivity({ type: "open_chat", city, category, label: "bento" });
    router.push("/chat");
  }

  // Open the concierge only when the user actively switches category — never on
  // first load or when returning from /chat (those don't change the category),
  // and not when the city changes on its own (location restore/geolocation).
  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;
      return;
    }
    const booking = categoryToBooking[category];
    const groups: ConciergeGroup[] = booking
      ? [{ category: booking, label: bookingCategoryLabels[booking], options: buildBookingOptions(booking, { city, destination: city }) }]
      : [];
    setPip({ groups, local: localPicksFor(category) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <section className="aiBand" id="ai">
      <div className="cmBentoHead">
        <div>
          <p className="eyebrow">Concierge</p>
          <h2>
            One tap. <em>Handled.</em>
          </h2>
        </div>
        <p className="cmBentoHeadSub">Chat, cabs, flights, stays, wholesale runs — the whole trip from one screen.</p>
      </div>

      <div className="cmBentoGrid">
        <button type="button" className="cmBentoCard cmBentoChat" onClick={openChat}>
          <div>
            <span className="cmBentoKicker">Ask City Guide</span>
            <strong className="cmBentoChatTitle">Plan your {city} trip in seconds</strong>
          </div>
          <div className="cmBentoChatPreview" aria-hidden="true">
            <span className="cmBentoBubble cmBentoBubbleAi">
              Chai first, then the old market. Route&apos;s ready — 4 stops, metro all the way.
            </span>
            <span className="cmBentoBubble cmBentoBubbleUser">Weekend in {city} under ₹2k?</span>
          </div>
          <span className="cmBentoCardAction">
            Open City Chat <span aria-hidden="true">→</span>
          </span>
        </button>

        <button type="button" className="cmBentoCard" onClick={() => openBooking("cabs")}>
          <span className="cmBentoGlyph cmBentoGlyphDot" aria-hidden="true" />
          <div>
            <strong>Book a cab</strong>
            <p>Quick rides, compared</p>
          </div>
        </button>

        <button type="button" className="cmBentoCard" onClick={() => openBooking("flights")}>
          <span className="cmBentoGlyph cmBentoGlyphDiamond" aria-hidden="true" />
          <div>
            <strong>Book flights</strong>
            <p>Fares to &amp; from {city}</p>
          </div>
        </button>

        <button type="button" className="cmBentoCard cmBentoWide" onClick={() => openBooking("hotels")}>
          <div>
            <span className="cmBentoBarRow" aria-hidden="true">
              <span className="isOn" />
              <span />
              <span />
            </span>
            <strong>Book hotels</strong>
            <p>Top stays, tiered to your budget</p>
          </div>
          <span className="cmBentoCardMeta">up to −60%</span>
        </button>

        <button
          type="button"
          className="cmBentoCard cmBentoWide"
          onClick={() => {
            trackActivity({ type: "concierge_quick_action", city, category, label: "wholesale" });
            document.getElementById("directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <div>
            <span className="cmBentoDotGrid" aria-hidden="true">
              <span className="isOn" />
              <span className="isMut" />
              <span />
              <span className="isOn" />
            </span>
            <strong>Explore wholesale</strong>
            <p>Markets &amp; bulk deals, mapped</p>
          </div>
          <span className="cmBentoCardMeta">trader mode</span>
        </button>

        <div className="cmBentoCard cmBentoStatBand">
          <BentoStat target={500} suffix="+" label="cities live" />
          <span className="cmBentoStatDivider" aria-hidden="true" />
          <BentoStat target={30} label="categories" />
          <span className="cmBentoStatDivider" aria-hidden="true" />
          <BentoStat target={4} label="taps to a map" />
        </div>
      </div>

      <ConciergePip
        groups={pip?.groups ?? null}
        localPicks={pip?.local ?? null}
        city={city}
        onClose={() => setPip(null)}
        onOpen={(provider, bookingCategory) => trackActivity({ type: "concierge_open", city, category, label: `${bookingCategory}:${provider}` })}
      />
    </section>
  );
}
