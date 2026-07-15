"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useCountUp } from "@/app/components/motion/useCountUp";
import { trackActivity } from "@/lib/tracking";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

type CinematicHeroProps = {
  city: string;
  onExploreDirectory: () => void;
};

function HeroStat({ target, suffix, label }: { target: number; suffix?: string; label: string }) {
  const { ref, value } = useCountUp(target);
  return (
    <div className="cmHeroStat">
      <strong ref={ref as React.Ref<HTMLElement>}>
        {value}
        {suffix}
      </strong>
      <span>{label}</span>
    </div>
  );
}

// Cinematic home hero: warm paper stage, a muted looping travel film fading
// in below the copy, and the funding-first pitch. Type stays the site's own
// sans stack — only the em accents pick up the brand gradient.
export default function CinematicHero({ city, onExploreDirectory }: CinematicHeroProps) {
  const reduceMotion = useReducedMotion();
  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const }
        };

  return (
    <header className="cmHero">
      <video
        className="cmHeroVideo"
        src={HERO_VIDEO}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
      <div className="cmHeroVeil" aria-hidden="true" />

      <div className="cmHeroContent">
        <motion.p className="cmHeroKicker" {...rise(0)}>
          Travel &amp; earn · Wholesale markets · 500+ cities
        </motion.p>
        <motion.h1 {...rise(0.05)}>
          Travel <em>and earn.</em>
          <br />
          Wholesale, <em>sorted.</em>
        </motion.h1>
        <motion.p className="cmHeroSub" {...rise(0.2)}>
          Fund the trip with SIPs and card rewards, source smarter from India&apos;s wholesale markets, and let one
          Mitra map the route — backups included.
        </motion.p>
        <motion.div className="cmHeroActions" {...rise(0.4)}>
          <Link
            href="/travel-plan"
            className="cmHeroCta"
            onClick={() => trackActivity({ type: "scene_action", city, category: "markets", label: "hero_fund_trip" })}
          >
            Fund my trip
          </Link>
          <button type="button" className="cmHeroLink" onClick={onExploreDirectory}>
            Explore wholesale markets →
          </button>
        </motion.div>
        <motion.div className="cmHeroStats" {...rise(0.5)}>
          <HeroStat target={30} label="categories" />
          <HeroStat target={500} suffix="+" label="cities" />
          <HeroStat target={20} label="picks / route" />
        </motion.div>
      </div>
    </header>
  );
}
