"use client";

import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  Bot,
  Car,
  Compass,
  MessageSquarePlus,
  Plane,
  Search,
  Sparkles,
  Stethoscope,
  TrainFront,
  UtensilsCrossed
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { categories, CategoryKey } from "@/data/city-directory";
import { buildBookingOptions, BookingCategory, bookingCategoryLabels, categoryToBooking } from "@/lib/booking";
import { buildGeneratedResults } from "@/lib/city-intel";
import { trackActivity } from "@/lib/tracking";
import ConciergePip, { LocalPicks } from "@/app/components/ConciergePip";
import { ConciergeGroup } from "@/app/components/ConciergeCard";

type AiTeaserProps = {
  city: string;
  category: CategoryKey;
  categoryLabel: string;
  nearbyPanel: React.ReactNode;
};

const actionChips: Array<{ category: BookingCategory; label: string; icon: typeof Plane }> = [
  { category: "hotels", label: "Book hotels", icon: BedDouble },
  { category: "flights", label: "Book flights", icon: Plane },
  { category: "trains", label: "Book trains", icon: TrainFront },
  { category: "food", label: "Reserve a table", icon: UtensilsCrossed },
  { category: "cabs", label: "Book a cab", icon: Car },
  { category: "doctor", label: "Doctor visit", icon: Stethoscope }
];

export default function AiTeaser({ city, category, categoryLabel, nearbyPanel }: AiTeaserProps) {
  const [pip, setPip] = useState<{ groups: ConciergeGroup[]; local: LocalPicks | null } | null>(null);
  const initialised = useRef(false);

  const prompts = [
    `Plan a 2-day trip to ${city}`,
    `Best ${categoryLabel.toLowerCase()} in ${city}`,
    `${city} food and hidden gems`,
    "Hotels, cabs and bookings"
  ];

  function chatHref(prompt?: string) {
    return prompt ? `/chat?q=${encodeURIComponent(prompt)}` : "/chat";
  }

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

  // When a category is selected, open the concierge with that category's local
  // picks plus its matching booking options (skip the first render).
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
  }, [category, city]);

  return (
    <section className="aiBand" id="ai">
      <div className="aiPanel">
        <div className="aiIntro">
          <span className="sectionKicker">AI Assistant</span>
          <h2>Ask CityMitra before you leave</h2>
          <p>
            A focused city assistant for trip plans, market runs, hospitals, fuel stops, hotels, repairs, food, and
            quick backups when plans change — with one-tap bookings and saved conversations.
          </p>
          <div className="agentStack">
            <span>
              <Search size={16} />
              Intent finder
            </span>
            <span>
              <Compass size={16} />
              Route planner
            </span>
            <span>
              <Bot size={16} />
              Booking concierge
            </span>
          </div>
          <Link className="primaryButton" href={chatHref()} onClick={() => trackActivity({ type: "open_chat", city, category, label: "intro" })}>
            <MessageSquarePlus size={18} />
            Open the AI Assistant
          </Link>
        </div>

        <div className="aiTeaserGrid">
          <div className="aiTeaserCard">
            <div className="aiTeaserPreview">
              <div className="aiTeaserBubble assistant">
                <span><Sparkles size={13} /> CityMitra</span>
                <p>Tell me a city and what you need — I’ll map the spots, routes, and backups, then offer one-tap bookings.</p>
              </div>
              <div className="aiTeaserBubble user">
                <p>Plan a weekend in {city}</p>
              </div>
            </div>

            <div className="aiTeaserActions" aria-label="Quick booking concierge">
              {actionChips.map((chip) => {
                const Icon = chip.icon;
                return (
                  <button key={chip.category} type="button" onClick={() => openBooking(chip.category)}>
                    <Icon size={14} />
                    {chip.label}
                  </button>
                );
              })}
            </div>

            <div className="aiTeaserPrompts">
              {prompts.map((prompt) => (
                <Link
                  key={prompt}
                  href={chatHref(prompt)}
                  onClick={() => trackActivity({ type: "open_chat", city, category, label: prompt })}
                >
                  {prompt}
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>

            <Link className="aiTeaserCta" href={chatHref()} onClick={() => trackActivity({ type: "open_chat", city, category, label: "cta" })}>
              Start chatting — it’s saved for you <ArrowRight size={16} />
            </Link>
          </div>

          {nearbyPanel}
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
