"use client";

import { useEffect, useState } from "react";
import ConciergePip, { type LocalPicks } from "@/app/components/ConciergePip";
import type { ConciergeGroup } from "@/app/components/ConciergeCard";
import { categories, type CategoryKey } from "@/data/city-directory";
import { buildBookingOptions, bookingCategoryLabels, categoryToBooking } from "@/lib/booking";
import { buildGeneratedResults } from "@/lib/city-intel";
import { trackActivity } from "@/lib/tracking";

type ConciergeRequest = {
  city: string;
  category: CategoryKey;
  nonce: number;
};

type OpenConcierge = {
  city: string;
  category: CategoryKey;
  groups: ConciergeGroup[];
  localPicks: LocalPicks;
};

export default function HomeDynamicConcierge({ request }: { request: ConciergeRequest | null }) {
  const [concierge, setConcierge] = useState<OpenConcierge | null>(null);

  useEffect(() => {
    if (!request) return;

    const label = categories.find((item) => item.key === request.category)?.label || "Top picks";
    const bookingCategory = categoryToBooking[request.category];
    const groups: ConciergeGroup[] = bookingCategory
      ? [{
          category: bookingCategory,
          label: bookingCategoryLabels[bookingCategory],
          options: buildBookingOptions(bookingCategory, { city: request.city, destination: request.city })
        }]
      : [];
    const localPicks: LocalPicks = {
      city: request.city,
      label,
      items: buildGeneratedResults(request.city, request.category, 12).map((item) => ({
        name: item.name,
        area: item.area,
        query: item.query
      }))
    };

    const timer = window.setTimeout(() => {
      setConcierge({ city: request.city, category: request.category, groups, localPicks });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [request]);

  return (
    <ConciergePip
      city={concierge?.city || request?.city || "Your city"}
      groups={concierge?.groups || null}
      localPicks={concierge?.localPicks || null}
      onClose={() => setConcierge(null)}
      onOpen={(provider, bookingCategory) => {
        if (!concierge) return;
        trackActivity({
          type: "concierge_open",
          city: concierge.city,
          category: concierge.category,
          label: `${bookingCategory}:${provider}`
        });
      }}
    />
  );
}
