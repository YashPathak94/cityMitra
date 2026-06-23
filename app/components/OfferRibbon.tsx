"use client";

import { Flag, Gift, PartyPopper, Plane, Sparkles, Sun, Tag, Umbrella } from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";

type Offer = { id: string; icon: ReactNode; text: string };

// Date/occasion-aware offers. Kept as honest, generic travel teasers (no fake
// "guaranteed" discounts) so the ribbon stays truthful while feeling timely.
function offersForToday(city: string, now: Date): Offer[] {
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const seasonal: Offer[] = [];
  const add = (id: string, icon: ReactNode, text: string) => seasonal.push({ id, icon, text });

  if (month === 1 && day >= 18) add("republic", <Flag size={14} />, "Republic Day weekend — explore India");
  if (month === 3 && day <= 18) add("holi", <PartyPopper size={14} />, "Holi getaways — plan ahead");
  if (month >= 4 && month <= 5) add("summer", <Sun size={14} />, "Summer break — hill & beach escapes");
  if (month >= 6 && month <= 8) add("monsoon", <Umbrella size={14} />, `Monsoon escapes — cosy stays in ${city}`);
  if (month === 8 && day >= 8 && day <= 16) add("independence", <Flag size={14} />, "Independence Day long weekend");
  if (month >= 10 && month <= 11) add("festive", <Sparkles size={14} />, "Festive season — plan your Diwali trips");
  if (month === 12) add("yearend", <Gift size={14} />, "Year-end getaways — finish 2026 in style");

  // Evergreen teasers so the ribbon is never empty
  add("weekend", <Plane size={14} />, `Weekend trips from ${city} — ask City Chat`);
  add("compare", <Tag size={14} />, "Compare cabs, flights & hotels in one place");

  return seasonal;
}

export default function OfferRibbon({ city }: { city: string }) {
  const offers = useMemo(() => offersForToday(city, new Date()), [city]);
  const [index, setIndex] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // When motion is reduced the plane parks in the centre, so cycle offers on a timer.
  useEffect(() => {
    if (!reduce || offers.length < 2) return;
    const id = setInterval(() => setIndex((value) => (value + 1) % offers.length), 4500);
    return () => clearInterval(id);
  }, [reduce, offers.length]);

  const offer = offers[index % offers.length];

  return (
    <div className="offerRibbon" role="region" aria-label="Special offers">
      <div
        className={reduce ? "offerFlyer offerFlyerStatic" : "offerFlyer"}
        aria-hidden="true"
        onAnimationIteration={() => {
          if (!reduce) setIndex((value) => (value + 1) % offers.length);
        }}
      >
        <span className="offerBanner">
          <span className="offerBannerIcon">{offer.icon}</span>
          {offer.text}
        </span>
        <span className="offerTow" />
        <svg className="offerPlane" viewBox="0 0 40 32">
          <defs>
            <linearGradient id="offerPlaneTop" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#93c5fd" />
              <stop offset="1" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <path d="M2 5 L39 16 L2 27 L9 16 Z" fill="url(#offerPlaneTop)" />
          <path d="M9 16 L39 16 L2 27 Z" fill="#1d4ed8" opacity="0.55" />
          <circle cx="33" cy="16" r="1.6" fill="#ea580c" />
        </svg>
      </div>
      <span className="srOnly">Special offers: {offers.map((item) => item.text).join(". ")}.</span>
    </div>
  );
}
