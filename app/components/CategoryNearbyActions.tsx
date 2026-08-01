"use client";

import { ExternalLink, LocateFixed, MapPinned, MessageCircleMore } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { CategoryKey } from "@/data/city-directory";
import { locationDataKey, type UserLocation } from "@/lib/city-intel";
import { mapSearchUrl } from "@/lib/maps";
import { trackActivity } from "@/lib/tracking";

type Props = {
  city: string;
  categoryKey: CategoryKey;
  categoryLabel: string;
  nearbyPrompt: string;
  classNames: {
    actions: string;
    primary: string;
    secondary: string;
    status: string;
  };
};

function savedLocation() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(locationDataKey) || "null") as UserLocation | null;
    return parsed && Number.isFinite(parsed.lat) && Number.isFinite(parsed.lng) ? parsed : null;
  } catch {
    return null;
  }
}

export default function CategoryNearbyActions({ city, categoryKey, categoryLabel, nearbyPrompt, classNames }: Props) {
  const [status, setStatus] = useState("Use your location to rank nearby options on Maps.");
  const query = `${nearbyPrompt} near ${city}`;
  const chatQuestion = `Compare the best ${categoryLabel.toLowerCase()} in ${city}. Give me neighbourhood choices, what to verify, a nearby backup and a time-saving route.`;

  function openNearby(location: UserLocation | null) {
    trackActivity({ type: "map_search", city, category: categoryKey, label: location ? "category_nearby_live" : "category_nearby_city" });
    window.open(mapSearchUrl(query, location), "_blank", "noreferrer");
  }

  function enableNearby() {
    const stored = savedLocation();
    if (stored) {
      setStatus("Nearby mode restored. Opening options around your saved location.");
      openNearby(stored);
      return;
    }

    if (!navigator.geolocation) {
      setStatus("Location is unavailable in this browser. Opening a city-level search instead.");
      openNearby(null);
      return;
    }

    setStatus("Detecting your location…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
          city
        };
        window.localStorage.setItem(locationDataKey, JSON.stringify(location));
        setStatus("Location enabled. Your nearby comparison is ready.");
        openNearby(location);
      },
      () => {
        setStatus("Permission was not enabled. Opening city-level options instead.");
        openNearby(null);
      },
      { enableHighAccuracy: true, maximumAge: 300_000, timeout: 10_000 }
    );
  }

  return (
    <>
      <div className={classNames.actions}>
        <button type="button" className={classNames.primary} onClick={enableNearby}>
          <LocateFixed size={18} /> Find nearby options
        </button>
        <button type="button" className={classNames.secondary} onClick={() => openNearby(null)}>
          <MapPinned size={18} /> Browse {city} map
        </button>
        <Link className={classNames.secondary} href={`/chat?q=${encodeURIComponent(chatQuestion)}`}>
          <MessageCircleMore size={18} /> Ask concierge
        </Link>
      </div>
      <p className={classNames.status} role="status">{status} <ExternalLink size={13} aria-hidden="true" /></p>
    </>
  );
}
