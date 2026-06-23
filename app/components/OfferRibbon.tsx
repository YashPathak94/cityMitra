"use client";

import { Flag, Gift, PartyPopper, Plane, Sparkles, Sun, Tag, Trophy, Umbrella } from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";

type Offer = { id: string; icon: ReactNode; text: string; tag?: string };

// Date/occasion-aware offers. Kept as honest, generic travel teasers (no fake
// "guaranteed" discounts) so the ribbon stays truthful while feeling timely.
function offersForToday(city: string, now: Date): Offer[] {
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const time = now.getTime();
  const list: Offer[] = [];
  const add = (id: string, icon: ReactNode, text: string, tag?: string) => list.push({ id, icon, text, tag });

  // FIFA World Cup 2026: Jun 11 – Jul 19, 2026 — surfaced first while it runs
  if (time >= Date.UTC(2026, 5, 11) && time <= Date.UTC(2026, 6, 19, 23, 59)) {
    add("fifa", <Trophy size={15} />, "FIFA World Cup 2026 is live — watch at fan zones & screenings", "LIVE");
  }

  if (month === 1 && day >= 18) add("republic", <Flag size={15} />, "Republic Day weekend — explore India");
  if (month === 3 && day <= 18) add("holi", <PartyPopper size={15} />, "Holi getaways — plan ahead");
  if (month >= 4 && month <= 5) add("summer", <Sun size={15} />, "Summer break — hill & beach escapes");
  if (month >= 6 && month <= 8) add("monsoon", <Umbrella size={15} />, `Monsoon escapes — cosy stays in ${city}`);
  if (month === 8 && day >= 8 && day <= 16) add("independence", <Flag size={15} />, "Independence Day long weekend");
  if (month >= 10 && month <= 11) add("festive", <Sparkles size={15} />, "Festive season — plan your Diwali trips");
  if (month === 12) add("yearend", <Gift size={15} />, "Year-end getaways — finish 2026 in style");

  // Evergreen teasers so the ribbon is never empty
  add("weekend", <Plane size={15} />, `Weekend trips from ${city} — ask City Chat`);
  add("compare", <Tag size={15} />, "Compare cabs, flights & hotels in one place");

  return list;
}

export default function OfferRibbon({ city }: { city: string }) {
  const offers = useMemo(() => offersForToday(city, new Date()), [city]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Cycle offers on a timer; hovering the banner pauses it so users can read/act.
  useEffect(() => {
    if (paused || offers.length < 2) return;
    const id = setInterval(() => setIndex((value) => (value + 1) % offers.length), 4200);
    return () => clearInterval(id);
  }, [paused, offers.length]);

  const active = index % offers.length;
  const offer = offers[active];

  return (
    <div
      className="offerRibbon"
      role="region"
      aria-label="Special offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="offerStage">
        {/* key remounts the card so the 3D flip-in replays on every change */}
        <div className="offerCard" key={offer.id} aria-hidden="true">
          <span className="offerBadge">{offer.icon}</span>
          <span className="offerText">{offer.text}</span>
          {offer.tag && <span className="offerTag">{offer.tag}</span>}
        </div>
      </div>

      <div className="offerDots" aria-hidden="true">
        {offers.map((item, i) => (
          <span key={item.id} className={i === active ? "offerDot active" : "offerDot"} />
        ))}
      </div>

      <span className="srOnly">Special offers: {offers.map((item) => item.text).join(". ")}.</span>
    </div>
  );
}
