"use client";

import Link from "next/link";
import { ArrowRight, MapPinned, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ConciergePip, { type LocalPicks } from "@/app/components/ConciergePip";
import type { ConciergeGroup } from "@/app/components/ConciergeCard";
import type { CategoryKey } from "@/data/city-directory";
import { buildBookingOptions, bookingCategoryLabels, categoryToBooking } from "@/lib/booking";
import { buildGeneratedResults } from "@/lib/city-intel";
import { trackActivity } from "@/lib/tracking";
import styles from "./CategoryConcierge.module.css";

type Props = {
  city: string;
  categoryKey: CategoryKey;
  categoryLabel: string;
};

export default function CategoryConcierge({ city, categoryKey, categoryLabel }: Props) {
  const [open, setOpen] = useState(false);

  const localPicks = useMemo<LocalPicks>(() => ({
    city,
    label: categoryLabel,
    items: buildGeneratedResults(city, categoryKey, 12).map((item) => ({
      name: item.name,
      area: item.area,
      query: item.query
    }))
  }), [categoryKey, categoryLabel, city]);

  const groups = useMemo<ConciergeGroup[]>(() => {
    const bookingCategory = categoryToBooking[categoryKey];
    if (!bookingCategory) return [];
    const options = buildBookingOptions(bookingCategory, { city, destination: city });
    return options.length > 0
      ? [{ category: bookingCategory, label: bookingCategoryLabels[bookingCategory], options }]
      : [];
  }, [categoryKey, city]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("concierge") !== "1") return;
    const timer = window.setTimeout(() => setOpen(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function openConcierge(label: string) {
    setOpen(true);
    trackActivity({ type: "concierge_quick_action", city, category: categoryKey, label });
  }

  const chatQuestion = `Compare ${categoryLabel.toLowerCase()} in ${city}. Rank neighbourhoods, give me 10 useful options, a route order and one nearby backup.`;

  return (
    <div className={styles.launcher}>
      <div className={styles.identity}>
        <span className={styles.mark}><Sparkles aria-hidden="true" size={18} /></span>
        <div>
          <span>Live local concierge</span>
          <strong>{categoryLabel} · {city}</strong>
        </div>
      </div>

      <p>Open a focused shortlist with map-ready options and booking comparisons where relevant.</p>

      <div className={styles.actions}>
        <button onClick={() => openConcierge("category_page")} type="button">
          <MapPinned size={17} /> Show local concierge
        </button>
        <Link href={`/chat?q=${encodeURIComponent(chatQuestion)}`}>
          Ask AI guide <ArrowRight size={15} />
        </Link>
      </div>

      <ConciergePip
        city={city}
        groups={open ? groups : null}
        localPicks={open ? localPicks : null}
        onClose={() => setOpen(false)}
        onOpen={(provider, bookingCategory) =>
          trackActivity({ type: "concierge_open", city, category: categoryKey, label: `${bookingCategory}:${provider}` })
        }
      />
    </div>
  );
}
