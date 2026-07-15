"use client";

import Reveal from "@/app/components/Reveal";

const STEPS: Array<{ no: string; tone: "orange" | "teal" | "blue"; title: string; text: string }> = [
  { no: "01", tone: "orange", title: "Set the trip", text: "Destination, dates, crew — the number we work backwards from." },
  { no: "02", tone: "teal", title: "AI builds the plan", text: "Month-by-month across SIPs, funds & stocks, sized to your risk." },
  { no: "03", tone: "blue", title: "Compare every ride", text: "Real fare ranges per mode — pick on price and time, not vibes." },
  { no: "04", tone: "orange", title: "Stays that fit", text: "Budget, comfort, premium — priced for your exact nights." }
];

// Travel-plan intro: the funding-engine pitch plus the five-step "how it
// works" row from the design handoff. Replaces the full-screen scroll stack
// with something faster to read and lighter to load.
export default function TravelPlanIntro() {
  return (
    <>
      <header className="planIntro">
        <span className="planIntroBadge">
          <span className="planIntroPulse" aria-hidden="true" />
          Industry-first · AI travel-funding engine
        </span>
        <h1>
          Don&apos;t just book it.
          <br />
          <em>Fund it.</em>
        </h1>
        <p>
          Set the trip. The AI sizes a monthly plan across SIPs, funds and card rewards — so returns cover part of the
          bill, not your pocket.
        </p>
      </header>

      <Reveal>
        <div className="planSteps">
          {STEPS.map((step) => (
            <article key={step.no} className="planStep">
              <span className={`planStepNo planStepNo--${step.tone}`}>{step.no}</span>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </article>
          ))}
          <article className="planStep planStepPayoff">
            <span className="planStepNo planStepNo--white">05</span>
            <strong>The payoff</strong>
            <p>Returns + rewards offset the cost. The rest is a planned top-up.</p>
          </article>
        </div>
      </Reveal>
    </>
  );
}
