import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/app/components/PageShell";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Editorial Methodology",
  description:
    "How CityMitra creates city guides, labels AI suggestions, verifies map-ready recommendations, and keeps ctmitra.com useful for real city planning.",
  alternates: { canonical: "/methodology" }
};

const reviewSteps = [
  {
    title: "Neighbourhood-first writing",
    body:
      "Every city guide starts with how the city is actually used: market clusters, transit reality, timing traps, hospital or fuel backups, and the areas locals mention when planning a day."
  },
  {
    title: "Human-written city context",
    body:
      "Our city pulse sections are written and edited for CityMitra. They connect culture, people, local contributions, etiquette, and small on-ground moments instead of repeating tourism-board slogans or publishing interchangeable listicles."
  },
  {
    title: "Directory plus map handoff",
    body:
      "CityMitra keeps a hand-curated seed directory for known city anchors, then builds map-ready searches for wider categories. Google Maps is used for live hours, distance, reviews, and navigation because those details change daily."
  },
  {
    title: "AI is labelled as assistance",
    body:
      "The AI guide helps shape routes and alternatives, but it does not claim live availability, medical certainty, or guaranteed prices. Users are reminded to verify important details before travelling."
  },
  {
    title: "Corrections are part of the product",
    body:
      "Feedback, map-open behaviour, and manual checks guide what gets updated next. Incorrect listings, outdated areas, and thin category results are treated as product bugs, not permanent content."
  }
];

const contentStandards = [
  "A guide should explain why an area matters, not only list place names.",
  "City mood, culture, and etiquette must be specific enough to help a visitor behave with context.",
  "We do not copy reviews, manufacture ratings, or present a search prompt as a verified business listing.",
  "Travel, health, fuel, repair, and hotel suggestions should include a backup-planning angle.",
  "Affiliate or sponsored links must be visibly useful and not replace editorial guidance.",
  "AI-generated answers must stay practical, cautious, and verifiable through maps or official provider pages.",
  "Pages should help a reader make one real decision faster: where to go, when to go, what to check, or what to avoid."
];

export default function MethodologyPage() {
  return (
    <PageShell>
      <article className="policyPage">
        <h1>Editorial Methodology</h1>
        <p>
          CityMitra is built to be useful before it is monetised. ctmitra.com combines original city writing,
          a practical category directory, map-ready search flows, and AI-assisted planning. This page explains how
          we keep the content helpful, transparent, and reviewable.
        </p>

        <h2>How city pages are created</h2>
        <p>
          We write city pages around real planning questions: which neighbourhood is worth choosing, what time
          saves the most effort, where a backup service should be saved, and which local mistake wastes time.
          That is why guides include transport notes, budget notes, key areas, half-day route ideas, and checks
          before leaving.
        </p>

        <h2>Where facts and recommendations come from</h2>
        <p>
          CityMitra separates durable editorial context from live operational data. Historical or cultural claims
          are checked against official tourism, district, heritage, or institutional sources where available.
          Practical route notes are written around neighbourhood geography and common planning constraints. Hours,
          prices, phone numbers, weather, access rules, and service availability are handed off to current Maps or
          official listings because those facts can change after publication.
        </p>

        <div className={styles.methodGrid}>
          {reviewSteps.map((step) => (
            <section key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </section>
          ))}
        </div>

        <h2>Our content standards</h2>
        <ul>
          {contentStandards.map((standard) => (
            <li key={standard}>{standard}</li>
          ))}
        </ul>

        <h2>What users should verify</h2>
        <p>
          CityMitra is a planning layer, not a live operations database. Opening hours, exact prices, hospital
          availability, permits, weather, traffic, and booking inventory should always be verified on Google Maps,
          official provider pages, or by calling the business before leaving.
        </p>

        <h2>How to report a correction</h2>
        <p>
          Use the feedback strip on the home page or contact us at <Link href="/contact">Contact</Link>. Helpful
          correction reports include the city, category, place name, and what changed.
        </p>
      </article>
    </PageShell>
  );
}
