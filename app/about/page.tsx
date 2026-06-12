import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/app/components/PageShell";

export const metadata: Metadata = {
  title: "About",
  description:
    "CityMitra is an AI-assisted city guide for India, built to make city decisions — markets, hospitals, hotels, food, repairs, sightseeing — faster and less chaotic.",
  alternates: { canonical: "/about" }
};

export default function AboutPage() {
  return (
    <PageShell>
      <article className="policyPage">
        <h1>About CityMitra</h1>
        <p>
          CityMitra is an independent city guide for India that combines hand-curated local knowledge with an AI
          planning assistant. It exists for one reason: choosing where to go in an Indian city — the right wholesale
          market, a trustworthy hospital, a saree street, a late-night food lane — usually means juggling a dozen
          tabs, outdated forum posts, and guesswork. We compress that into one decision flow.
        </p>
        <h2>What we actually do</h2>
        <ul>
          <li>
            <b>Curated city guides.</b> Our <Link href="/cities">city guides</Link> are written and maintained by us —
            market clusters, timing advice, transport reality, and the tips locals give friends.
          </li>
          <li>
            <b>A category directory.</b> Markets, hospitals, hotels, eateries, repairs, petrol pumps, schools, malls,
            and sightseeing, organised so a half-day plan takes minutes to build.
          </li>
          <li>
            <b>An AI planning chat.</b> Ask for a route, a backup plan, or a comparison; every answer points to maps
            you can verify before leaving.
          </li>
        </ul>
        <h2>What we are careful about</h2>
        <p>
          CityMitra never claims live availability, current opening hours, or medical certainty. Suggestions are
          starting points to verify in maps or by calling ahead — and the interface says so wherever it matters. AI
          answers are clearly part of a chat you initiated, not disguised as editorial content.
        </p>
        <h2>Who runs CityMitra</h2>
        <p>
          CityMitra is built and operated by an independent developer team based in India. Business enquiries —
          featured listings, sponsorships, partnerships — are welcome via the <Link href="/contact">contact page</Link>.
        </p>
      </article>
    </PageShell>
  );
}
