"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { imageForTheme } from "@/lib/category-images";

export type ConciergePanel = {
  key: string;
  title: string;
  description: string;
  image: string;
  fallbackImage?: string;
  icon: ReactNode;
  actionLabel: string;
  onAction: () => void;
};

function imgFallback(panel: ConciergePanel) {
  return (event: React.SyntheticEvent<HTMLImageElement>) => {
    const fallback = panel.fallbackImage || imageForTheme("city");
    if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
  };
}

// The concierge adapts to the viewport: a premium expanding accordion on desktop
// and a one-at-a-time banner carousel on mobile. Both fire the panel action only
// from the explicit CTA button — never from an incidental tap on the artwork.
export default function ConciergeSelector({ panels }: { panels: ConciergePanel[] }) {
  return (
    <>
      <div className="conciergeAccordion">
        <ConciergeAccordion panels={panels} />
      </div>
      <div className="conciergeCarousel">
        <ConciergeCarousel panels={panels} />
      </div>
    </>
  );
}

/* ----------------------------- Desktop accordion ----------------------------- */
function ConciergeAccordion({ panels }: { panels: ConciergePanel[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState<number[]>([]);

  useEffect(() => {
    const timers = panels.map((_, index) =>
      setTimeout(() => setRevealed((prev) => (prev.includes(index) ? prev : [...prev, index])), 120 * index)
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panels.length]);

  return (
    <div className="conciergeSelector" role="group" aria-label="CityMitra concierge">
      {panels.map((panel, index) => {
        const active = index === activeIndex;
        return (
          <div
            role="button"
            tabIndex={0}
            key={panel.key}
            className={active ? "conciergePanel active" : "conciergePanel"}
            style={{
              flexGrow: active ? 7 : 1,
              opacity: revealed.includes(index) ? 1 : 0,
              transform: revealed.includes(index) ? "translateX(0)" : "translateX(-32px)"
            }}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setActiveIndex(index);
              }
            }}
            aria-label={panel.title}
            aria-expanded={active}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="conciergePanelImg"
              src={panel.image}
              alt=""
              aria-hidden="true"
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              onError={imgFallback(panel)}
            />
            <span className="conciergePanelScrim" aria-hidden="true" />

            <span className="conciergePanelRail" aria-hidden="true">
              <span className="conciergePanelIcon">{panel.icon}</span>
              <span className="conciergePanelRailText">{panel.title}</span>
            </span>

            <span className="conciergePanelLabel">
              <span className="conciergePanelIcon">{panel.icon}</span>
              <span className="conciergePanelInfo">
                <span className="conciergePanelTitle">{panel.title}</span>
                <span className="conciergePanelDesc">{panel.description}</span>
                <button
                  type="button"
                  className="conciergePanelAction"
                  tabIndex={active ? 0 : -1}
                  onClick={(event) => {
                    event.stopPropagation();
                    panel.onAction();
                  }}
                >
                  {panel.actionLabel} <ArrowUpRight size={15} />
                </button>
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------ Mobile carousel ------------------------------ */
function ConciergeCarousel({ panels }: { panels: ConciergePanel[] }) {
  const count = panels.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  // Only treat this as the active layout (and autoplay) on small screens.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isMobile || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((current) => (current + 1) % count), 5000);
    return () => clearInterval(id);
  }, [isMobile, paused, index, count]);

  function onTouchStart(event: React.TouchEvent) {
    touchX.current = event.touches[0].clientX;
  }
  function onTouchEnd(event: React.TouchEvent) {
    if (touchX.current === null) return;
    const dx = event.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    touchX.current = null;
  }

  return (
    <div className="cCarousel" role="group" aria-roledescription="carousel" aria-label="CityMitra concierge">
      <div className="cCarouselViewport" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="cCarouselTrack" style={{ transform: `translateX(-${index * 100}%)` }}>
          {panels.map((panel, i) => (
            <div
              className="cSlide"
              key={panel.key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${panel.title}`}
              aria-hidden={i !== index}
            >
              <div className="cSlideBanner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={panel.image}
                  alt={panel.title}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  onError={imgFallback(panel)}
                />
              </div>
              <div className="cSlideCaption">
                <span className="cSlideIcon">{panel.icon}</span>
                <span className="cSlideText">
                  <span className="cSlideTitle">{panel.title}</span>
                  <span className="cSlideDesc">{panel.description}</span>
                </span>
                <button
                  type="button"
                  className="cSlideCta"
                  tabIndex={i === index ? 0 : -1}
                  onClick={panel.onAction}
                >
                  {panel.actionLabel} <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="cArrow cArrowPrev" type="button" aria-label="Previous" onClick={() => go(index - 1)}>
          <ChevronLeft size={20} />
        </button>
        <button className="cArrow cArrowNext" type="button" aria-label="Next" onClick={() => go(index + 1)}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="cControls">
        <div className="cDots">
          {panels.map((panel, i) => (
            <button
              key={panel.key}
              type="button"
              aria-label={`Show ${panel.title}`}
              aria-current={i === index}
              className={i === index ? "cDot active" : "cDot"}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button
          className="cPause"
          type="button"
          aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>
    </div>
  );
}
