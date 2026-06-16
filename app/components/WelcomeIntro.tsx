"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Compass, MapPinned, Navigation, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

const seenKey = "citymitra-welcome-seen";

type WelcomeIntroProps = {
  onAskAI: () => void;
  onEnableLocation: () => void;
};

const highlights = [
  { icon: Compass, text: "Smart picks for any Indian city — markets, food, hotels, repairs, more" },
  { icon: Sparkles, text: "An AI guide that plans routes and compares bookings in one tap" },
  { icon: MapPinned, text: "Maps, photos, and backup stops, synced to where you are" }
];

export default function WelcomeIntro({ onAskAI, onEnableLocation }: WelcomeIntroProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(seenKey)) return;
    const timer = window.setTimeout(() => setOpen(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  function dismiss() {
    window.sessionStorage.setItem(seenKey, "1");
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="welcomeBackdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            aria-hidden="true"
          />
          <motion.aside
            className="welcomeCard"
            role="dialog"
            aria-modal="true"
            aria-label="Welcome to CityMitra"
            initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
          >
            <button className="welcomeClose" type="button" onClick={dismiss} aria-label="Close">
              <X size={18} />
            </button>

            <div className="welcomeGrid">
              <div className="welcomeMain">
                <span className="welcomeBadge">
                  <span className="welcomeBadgeMark">
                    <Navigation size={15} />
                  </span>
                  CityMitra
                </span>

                <h2>Your AI companion for Indian cities</h2>
                <p>
                  Skip the 47-tab research spiral. Tell CityMitra where you are headed and get curated places, smart
                  routes, and one-tap bookings — for any city.
                </p>

                <div className="welcomeActions">
                  <button
                    className="primaryButton"
                    type="button"
                    onClick={() => {
                      dismiss();
                      onAskAI();
                    }}
                  >
                    Start with the AI guide <ArrowRight size={16} />
                  </button>
                  <button
                    className="secondaryButton"
                    type="button"
                    onClick={() => {
                      dismiss();
                      onEnableLocation();
                    }}
                  >
                    <Navigation size={15} />
                    Auto-detect my location
                  </button>
                </div>
              </div>

              <ul className="welcomeHighlights">
                {highlights.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={item.text}
                      initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + index * 0.08 }}
                    >
                      <span className="welcomeHighlightIcon">
                        <Icon size={16} />
                      </span>
                      {item.text}
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
