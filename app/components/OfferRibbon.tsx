"use client";

import { Flag, Gift, PartyPopper, Plane, Sparkles, Sun, Tag, Trophy, Umbrella } from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";

type Motif = "car" | "football";
type Offer = { id: string; icon: ReactNode; text: string; tag?: string; motif: Motif };

// Date/occasion-aware offers. Kept as honest, generic travel teasers (no fake
// "guaranteed" discounts) so the ribbon stays truthful while feeling timely.
function offersForToday(city: string, now: Date): Offer[] {
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const time = now.getTime();
  const list: Offer[] = [];
  const add = (id: string, icon: ReactNode, text: string, motif: Motif = "car", tag?: string) =>
    list.push({ id, icon, text, motif, tag });

  // FIFA World Cup 2026: Jun 11 – Jul 19, 2026 — surfaced first while it runs
  if (time >= Date.UTC(2026, 5, 11) && time <= Date.UTC(2026, 6, 19, 23, 59)) {
    add("fifa", <Trophy size={15} />, "FIFA World Cup 2026 is live — watch at fan zones & screenings", "football", "LIVE");
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

// A toy car whose passenger pops out of the window pointing at the offer.
function CarScene() {
  return (
    <svg className="offerMotif" viewBox="0 0 132 52" aria-hidden="true">
      <defs>
        <linearGradient id="offerCarBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fb923c" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <ellipse cx="70" cy="47" rx="52" ry="4" fill="rgba(15,23,42,0.12)" />

      {/* passenger — drawn first so the car body hides everything below the roof */}
      <g className="offerPerson">
        <circle cx="66" cy="12" r="6" fill="#f7c9a0" stroke="#b45309" strokeWidth="0.7" />
        <path d="M58 23 q8 -9 16 0 Z" fill="#2563eb" />
        <path d="M73 17 q7 -2 10 -9" stroke="#f7c9a0" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      </g>

      <g className="offerCar">
        <path
          d="M28 45 L28 41 Q28 26 46 26 L86 26 Q102 26 107 34 L116 38 Q121 40 121 45 Z"
          fill="url(#offerCarBody)"
          stroke="#c2410c"
          strokeWidth="1"
        />
        <path d="M49 29 L66 29 L66 35 L44 35 Z" fill="#cfe5ff" opacity="0.95" />
        <path d="M70 29 L84 29 L88 35 L70 35 Z" fill="#cfe5ff" opacity="0.95" />
        <circle cx="48" cy="45" r="6.5" fill="#1f2937" />
        <circle cx="48" cy="45" r="2.4" fill="#9ca3af" />
        <circle cx="104" cy="45" r="6.5" fill="#1f2937" />
        <circle cx="104" cy="45" r="2.4" fill="#9ca3af" />
      </g>

      <g className="offerSpeech">
        <rect x="80" y="0" width="50" height="16" rx="5" fill="#fff" stroke="#e5e7eb" />
        <path d="M84 15 l1 6 l6 -5 Z" fill="#fff" stroke="#e5e7eb" />
        <text x="105" y="11" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#ea580c">
          Look here!
        </text>
      </g>
    </svg>
  );
}

// Two players passing a ball — football motif for the FIFA offer.
function FootballScene() {
  return (
    <svg className="offerMotif" viewBox="0 0 132 52" aria-hidden="true">
      <ellipse cx="66" cy="47" rx="56" ry="4" fill="rgba(15,23,42,0.1)" />

      {/* left player (blue) */}
      <g className="offerP offerPLeft" stroke="#2563eb" strokeWidth="3" fill="none" strokeLinecap="round">
        <circle cx="20" cy="13" r="5" fill="#f7c9a0" stroke="#b45309" strokeWidth="1" />
        <path d="M20 18 L18 31" />
        <path d="M18 31 L13 43 M18 31 L25 41" />
        <path d="M19 22 L11 25 M19 22 L27 24" />
      </g>

      {/* right player (orange) */}
      <g className="offerP offerPRight" stroke="#ea580c" strokeWidth="3" fill="none" strokeLinecap="round">
        <circle cx="112" cy="13" r="5" fill="#f7c9a0" stroke="#b45309" strokeWidth="1" />
        <path d="M112 18 L114 31" />
        <path d="M114 31 L119 43 M114 31 L107 41" />
        <path d="M113 22 L121 25 M113 22 L105 24" />
      </g>

      {/* passing ball */}
      <g className="offerPassBall">
        <circle cx="0" cy="0" r="5.5" fill="#fff" stroke="#0f172a" strokeWidth="1" />
        <polygon points="0,-3 3,0 1.6,3.4 -1.6,3.4 -3,0" fill="#0f172a" />
      </g>
    </svg>
  );
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

  // The slide loop drives the cycle; with reduced motion fall back to a timer.
  useEffect(() => {
    if (!reduce || offers.length < 2) return;
    const id = setInterval(() => setIndex((value) => (value + 1) % offers.length), 5000);
    return () => clearInterval(id);
  }, [reduce, offers.length]);

  const offer = offers[index % offers.length];

  return (
    <div className="offerRibbon" role="region" aria-label="Special offers">
      <div
        className={reduce ? "offerRow offerRowStatic" : "offerRow"}
        aria-hidden="true"
        onAnimationIteration={(event) => {
          // Only the row's own slide loop advances the offer — ignore the
          // popping / ball-pass iterations that bubble up from children.
          if (!reduce && event.target === event.currentTarget) {
            setIndex((value) => (value + 1) % offers.length);
          }
        }}
      >
        <span className="offerMotifWrap">{offer.motif === "football" ? <FootballScene /> : <CarScene />}</span>
        <span className="offerCopy">
          <span className="offerBadge">{offer.icon}</span>
          <span className="offerText">{offer.text}</span>
          {offer.tag && <span className="offerTag">{offer.tag}</span>}
        </span>
      </div>

      <span className="srOnly">Special offers: {offers.map((item) => item.text).join(". ")}.</span>
    </div>
  );
}
