"use client";

import { ReactLenis } from "lenis/react";
import { ArrowRight } from "lucide-react";
import { MotionValue, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ReactNode, useRef } from "react";
import { imageForTheme } from "@/lib/category-images";

export type StackCard = {
  index: number;
  label: string;
  title: ReactNode;
  subtitle: string;
  description: string;
  imageUrl: string;
  accentColor: string;
};

const DEFAULT_CARDS: StackCard[] = [
  {
    index: 1,
    label: "Step 01",
    title: (
      <>
        Set your trip
        <br />& your budget
      </>
    ),
    subtitle: "Where you're going",
    description: "Tell us the destination, dates and travellers. That's the number we work backwards from.",
    imageUrl: imageForTheme("city"),
    accentColor: "#ea580c"
  },
  {
    index: 2,
    label: "Step 02",
    title: (
      <>
        AI builds your
        <br />saving plan
      </>
    ),
    subtitle: "How you'll fund it",
    description: "A month-by-month plan across SIPs, mutual funds and stocks sized to your risk and timeline.",
    imageUrl: imageForTheme("ai"),
    accentColor: "#2563eb"
  },
  {
    index: 3,
    label: "Step 03",
    title: (
      <>
        Compare every
        <br />way to travel
      </>
    ),
    subtitle: "Flights, trains, cabs",
    description: "Real fare ranges per mode for your exact route, so you pick on price and time — not guesswork.",
    imageUrl: imageForTheme("flight"),
    accentColor: "#0891b2"
  },
  {
    index: 4,
    label: "Step 04",
    title: (
      <>
        Pick hotels
        <br />that fit
      </>
    ),
    subtitle: "Where you'll stay",
    description: "Budget, comfort and premium tiers, priced for your nights, so the stay matches the plan.",
    imageUrl: imageForTheme("hotel"),
    accentColor: "#f97316"
  },
  {
    index: 5,
    label: "Step 05",
    title: (
      <>
        Travel funded,
        <br />not just booked
      </>
    ),
    subtitle: "The payoff",
    description: "Investment growth plus card rewards offset part of the cost — the rest is your planned top-up.",
    imageUrl: imageForTheme("cab"),
    accentColor: "#059669"
  }
];

function scrollToCalculator() {
  document.getElementById("planResult")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function CardItem({
  card,
  progress,
  range,
  targetScale,
  total
}: {
  card: StackCard;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  total: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: localProgress } = useScroll({ target: containerRef, offset: ["start end", "start start"] });

  const imageScale = useTransform(localProgress, [0, 1], [1.18, 1]);
  const imageOpacity = useTransform(localProgress, [0, 0.6], [0.4, 1]);
  const cardScale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={containerRef} className="stackCardWrap" style={{ zIndex: card.index }} role="group" aria-label={`Step ${card.index} of ${total}`}>
      <motion.article
        style={{ scale: cardScale, top: `${card.index * 22}px`, transformOrigin: "top center" }}
        className="stackCard"
      >
        <motion.div className="stackCardImageWrap" aria-hidden="true" style={{ scale: imageScale, opacity: imageOpacity }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={card.imageUrl} alt="" className="stackCardImage" />
        </motion.div>

        <div className="stackCardOverlay" aria-hidden="true" />
        <div className="stackCardStrip" aria-hidden="true" style={{ background: card.accentColor }} />

        <div className="stackCardLabel">
          <span className="stackCardDot" aria-hidden="true" style={{ background: card.accentColor }} />
          <span style={{ color: card.accentColor }}>{card.label}</span>
        </div>

        <div className="stackCardGhost" aria-hidden="true" style={{ WebkitTextStroke: `1px ${card.accentColor}` }}>
          {String(card.index).padStart(2, "0")}
        </div>

        <div className="stackCardContent">
          <p className="stackCardSubtitle" style={{ color: card.accentColor }}>
            {card.subtitle}
          </p>
          <h2 className="stackCardTitle">{card.title}</h2>
          <div className="stackCardDescRow">
            <span className="stackCardDivider" aria-hidden="true" style={{ background: card.accentColor }} />
            <p className="stackCardDesc">{card.description}</p>
          </div>
          <button type="button" className="stackCardCta" style={{ color: card.accentColor }} onClick={scrollToCalculator}>
            Start with this step
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="stackCardCounter" aria-hidden="true">
          <span>
            {card.index} / {total}
          </span>
        </div>
      </motion.article>
    </div>
  );
}

// Scroll-driven "how it works" explainer for Travel Plan. Cards pin sticky and
// scale down as the next one scrolls over — an intentional scroll-jack (the
// prior hero used the same technique and was removed for feeling gimmicky; if
// this one gets the same feedback, revert to a static grid, not a fancier
// scroll effect). Lenis is mounted at `root`, so it smooth-scrolls the whole
// page for as long as this component is on screen, not just this section.
export default function TravelPlanStack({ cards = DEFAULT_CARDS }: { cards?: StackCard[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const total = cards.length;

  if (reduceMotion) {
    return (
      <div className="stackStatic">
        <p className="stackStaticKicker">How it works</p>
        <h2 className="stackStaticTitle">From destination to departure</h2>
        <div className="stackStaticGrid">
          {cards.map((card) => (
            <div className="stackStaticCard" key={card.index}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.imageUrl} alt="" className="stackStaticImage" />
              <div className="stackStaticBody">
                <span className="stackStaticLabel" style={{ color: card.accentColor }}>
                  {card.label}
                </span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="stackStaticCta" onClick={scrollToCalculator}>
          Build my plan <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  return (
    <ReactLenis root options={{ lerp: 0.07, duration: 1.4 }}>
      <div ref={containerRef}>
        <section className="stackHero" aria-label="How Travel Plan works">
          <div className="stackGridTexture" aria-hidden="true" />
          <div className="stackHeroInner">
            <h1 className="stackHeroTitle">HOW IT WORKS</h1>
            <div className="stackHeroSubRow">
              <span className="stackHeroDivider" aria-hidden="true" />
              <p className="stackHeroSubtitle">Scroll to see how a trip gets funded, step by step.</p>
              <span className="stackHeroDivider" aria-hidden="true" />
            </div>
            <div className="stackScrollCue" aria-hidden="true">
              <span>Scroll</span>
              <div className="stackScrollCueTrack">
                <motion.div
                  className="stackScrollCueBar"
                  animate={{ y: ["0%", "100%"], height: ["0%", "100%"] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="stackCardsBand" aria-label="Steps">
          {cards.map((card, i) => {
            const targetScale = 1 - (total - i) * 0.04;
            const segmentSize = 1 / total;
            return (
              <CardItem
                key={card.index}
                card={card}
                progress={scrollYProgress}
                range={[i * segmentSize, (i + 1) * segmentSize]}
                targetScale={targetScale}
                total={total}
              />
            );
          })}
        </section>

        <footer className="stackFooter">
          <div className="stackGridTexture" aria-hidden="true" />
          <p className="stackFooterKicker">Ready when you are</p>
          <button type="button" className="stackFooterCta" onClick={scrollToCalculator}>
            Build my plan <ArrowRight size={16} />
          </button>
        </footer>
      </div>
    </ReactLenis>
  );
}
