import type { Metadata } from "next";
import Link from "next/link";
import { cityGuides } from "@/data/city-guides";
import CityAskWidget from "@/app/components/CityAskWidget";
import CityGuideExplorer from "@/app/components/CityGuideExplorer";
import PageShell from "@/app/components/PageShell";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Human-Written City Guides, Hill Stations & Spiritual Cities",
  description:
    "Explore original CityMitra guides to city culture, local people, hill stations, spiritual cities, neighbourhoods, food, timing, transport, and nearby essentials.",
  alternates: { canonical: "/cities" }
};

export default function CitiesIndexPage() {
  return (
    <PageShell>
      <section className={`guideIndexHero ${styles.hero}`}>
        <h1>Read the city before you route through it.</h1>
        <div className={styles.intro}>
          <span className="sectionKicker">City Guides</span>
          <p>
            Human-written guides to city mood, neighbourhood culture, local people, achievements, food, etiquette,
            nearby essentials, and the route choices that search snippets miss. Pair any guide with the{" "}
            <Link href="/#ai">AI planner</Link> for a personalised route.
          </p>
        </div>
      </section>

      <CityGuideExplorer guides={cityGuides} />
      <CityAskWidget />
    </PageShell>
  );
}
