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

function SoccerBall({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#fff" stroke="#0f172a" strokeWidth="1.2" />
      <polygon points="12,6.5 16,9.5 14.5,14 9.5,14 8,9.5" fill="#0f172a" />
      <path
        d="M12 1.2 V5 M2.5 8.5 L7.5 10 M21.5 8.5 L16.5 10 M5.5 21 L9.2 15.5 M18.5 21 L14.8 15.5"
        stroke="#0f172a"
        strokeWidth="1.1"
        fill="none"
      />
    </svg>
  );
}

function PlayerDribbler() {
  return (
    <svg className="offerPlayer" viewBox="0 0 44 40" aria-hidden="true">
      <circle cx="24" cy="8" r="4" fill="#fff" />
      <path d="M24 12 q-3 6 -3 10" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M22 16 l-7 1.5 M22 16 l7 -1" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M21 22 l-3 9" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path className="offerKick" d="M21 22 l9 3" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function OfferRibbon({ city }: { city: string }) {
  const offers = useMemo(() => offersForToday(city, new Date()), [city]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // With motion reduced the scene parks centre, so cycle offers on a timer instead.
  useEffect(() => {
    if (!reduce || paused || offers.length < 2) return;
    const id = setInterval(() => setIndex((value) => (value + 1) % offers.length), 4200);
    return () => clearInterval(id);
  }, [reduce, paused, offers.length]);

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
      {/* ambient footballs rolling across the lane */}
      <span className="offerBallBg offerBallBg1" aria-hidden="true">
        <SoccerBall />
      </span>
      <span className="offerBallBg offerBallBg2" aria-hidden="true">
        <SoccerBall />
      </span>

      <div
        className={reduce ? "offerScene offerSceneStatic" : "offerScene"}
        aria-hidden="true"
        onAnimationIteration={(event) => {
          // Only the scene's own slide loop advances the offer — ignore the
          // spinning-ball / kicking-leg iterations that bubble up.
          if (!reduce && event.target === event.currentTarget) {
            setIndex((value) => (value + 1) % offers.length);
          }
        }}
      >
        <span className="offerBanner">
          <span className="offerBadge">{offer.icon}</span>
          <span className="offerText">{offer.text}</span>
          {offer.tag && <span className="offerTag">{offer.tag}</span>}
        </span>
        <span className="offerDribble">
          <PlayerDribbler />
          <SoccerBall className="offerBall" />
        </span>
      </div>

      <span className="srOnly">Special offers: {offers.map((item) => item.text).join(". ")}.</span>
    </div>
  );
}
