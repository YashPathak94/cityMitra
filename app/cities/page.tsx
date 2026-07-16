import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";
import { cityGuides } from "@/data/city-guides";
import CityAskWidget from "@/app/components/CityAskWidget";
import PageShell from "@/app/components/PageShell";

export const metadata: Metadata = {
  title: "Indian City Guides",
  description:
    "Original, practical guides to Indian cities: best markets, key areas, timing, transport, and local tips for Delhi, Mumbai, Jaipur, Leh, Varanasi, and more.",
  alternates: { canonical: "/cities" }
};

export default function CitiesIndexPage() {
  return (
    <PageShell>
      <section className="guideIndexHero">
        <span className="sectionKicker">City Guides</span>
        <h1>Practical guides to Indian cities</h1>
        <p>
          Written for people who plan by neighbourhood: which market cluster to pick, when to go, how to move,
          and what locals would tell you before you leave. Pair any guide with the{" "}
          <Link href="/#ai">AI planner</Link> for a personalised route.
        </p>
      </section>

      <section className="guideGrid" aria-label="All city guides">
        {cityGuides.map((guide) => (
          <Link className="guideCard" href={`/cities/${guide.slug}`} key={guide.slug}>
            <div
              className="guideCardImage"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.05), rgba(15, 23, 42, 0.72)), url("/api/city-image?city=${encodeURIComponent(guide.name)}&topic=city")`
              }}
            >
              <span>
                <MapPinned size={14} />
                {guide.state}
              </span>
            </div>
            <div className="guideCardBody">
              <h2>{guide.name}</h2>
              <p>{guide.tagline}</p>
              <strong>
                Read the guide <ArrowRight size={15} />
              </strong>
            </div>
          </Link>
        ))}
      </section>
      <CityAskWidget />
    </PageShell>
  );
}
