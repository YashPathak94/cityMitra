"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const STEPS = [
  { no: "01", title: "Set the trip", text: "Destination, dates, crew — the number we work backwards from." },
  { no: "02", title: "AI builds the plan", text: "Month-by-month across SIPs, funds & stocks, sized to your risk." },
  { no: "03", title: "Compare every ride", text: "Real fare ranges per mode — pick on price and time, not vibes." },
  { no: "04", title: "Stays that fit", text: "Budget, comfort, premium — priced for your exact nights." },
  { no: "05", title: "The payoff", text: "Returns + rewards offset the cost. The rest is a planned top-up." }
];

// Compact travel-plan hero: small headline on the left, the five-step
// walkthrough stacked tight on the right. The steps auto-advance like a
// looping explainer (paused under prefers-reduced-motion) so first-time
// visitors "watch" how funding a trip works without a video download.
export default function TravelPlanIntro() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => setActive((current) => (current + 1) % STEPS.length), 2600);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  return (
    <header className="planIntro">
      <div className="planIntroCopy">
        <span className="planIntroBadge">
          <span className="planIntroPulse" aria-hidden="true" />
          Industry-first · AI travel-funding engine
        </span>
        <h1>
          Don&apos;t just book it. <em>Fund it.</em>
        </h1>
        <p>
          Set the trip. The AI sizes a monthly plan across SIPs, funds and card rewards — so returns cover part of the
          bill, not your pocket.
        </p>
      </div>

      <ol className="planIntroSteps" aria-label="How the funding engine works">
        {STEPS.map((step, index) => (
          <li
            key={step.no}
            className={index === active ? "planIntroStep isActive" : "planIntroStep"}
            onMouseEnter={() => setActive(index)}
          >
            <span className="planIntroStepNo">{step.no}</span>
            <span className="planIntroStepBody">
              <strong>{step.title}</strong>
              <small>{step.text}</small>
            </span>
            {index === active && !reduceMotion && <span className="planIntroStepTimer" aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </header>
  );
}
