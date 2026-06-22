"use client";

import { useRouter } from "next/navigation";
import { BedDouble, Car, Plane, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { categories, CategoryKey } from "@/data/city-directory";
import { buildBookingOptions, BookingCategory, bookingCategoryLabels, categoryToBooking } from "@/lib/booking";
import { buildGeneratedResults } from "@/lib/city-intel";
import { imageForTheme } from "@/lib/category-images";
import { trackActivity } from "@/lib/tracking";
import ConciergePip, { LocalPicks } from "@/app/components/ConciergePip";
import ConciergeSelector, { ConciergePanel } from "@/app/components/ConciergeSelector";
import { ConciergeGroup } from "@/app/components/ConciergeCard";

type AiTeaserProps = {
  city: string;
  category: CategoryKey;
};

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

  const conciergePanels: ConciergePanel[] = [
    {
      key: "ai",
      title: "Ask the AI Guide",
      description: `Plan your ${city} trip in seconds`,
      image: "/concierge-city-chat.jpg",
      fallbackImage: imageForTheme("ai"),
      icon: <Sparkles size={20} />,
      actionLabel: "Open City chat",
      onAction: () => {
        trackActivity({ type: "open_chat", city, category, label: "selector" });
        router.push("/chat");
      }
    },
    {
      key: "cab",
      title: "Book a Cab",
      description: `Quick rides across ${city}`,
      image: imageForTheme("cab"),
      icon: <Car size={20} />,
      actionLabel: "Book a cab",
      onAction: () => openBooking("cabs")
    },
    {
      key: "flight",
      title: "Book Flights",
      description: `Fares to & from ${city}`,
      image: imageForTheme("flight"),
      icon: <Plane size={20} />,
      actionLabel: "Find flights",
      onAction: () => openBooking("flights")
    },
    {
      key: "hotel",
      title: "Book Hotels",
      description: `Top stays in ${city}`,
      image: imageForTheme("hotel"),
      icon: <BedDouble size={20} />,
      actionLabel: "Find hotels",
      onAction: () => openBooking("hotels")
    },
    {
      key: "wholesale",
      title: "Explore Wholesale",
      description: `Markets & bulk deals in ${city}`,
      image: imageForTheme("wholesale"),
      icon: <ShoppingBag size={20} />,
      actionLabel: "Explore markets",
      onAction: () => document.getElementById("directory")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  ];

  return (
    <section className="aiBand" id="ai">
      <div className="aiPanel aiPanelStacked">
        <ConciergeSelector panels={conciergePanels} />
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
