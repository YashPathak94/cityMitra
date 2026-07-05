import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, Bus, CalendarDays, Lightbulb, MapPinned, Wallet } from "lucide-react";
import { cityGuides, getCityGuide } from "@/data/city-guides";
import { categories, directory } from "@/data/city-directory";
import PageShell from "@/app/components/PageShell";
import ShareRow from "@/app/components/ShareRow";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ctmitra.com";

export function generateStaticParams() {
  return cityGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getCityGuide(slug);

  if (!guide) return { title: "City guide not found" };

  return {
    title: `${guide.name} City Guide — Markets, Areas, Tips`,
    description: `${guide.tagline} Best time to visit, key market areas, transport, and practical local tips for ${guide.name}.`,
    alternates: { canonical: `/cities/${guide.slug}` },
    openGraph: {
      title: `${guide.name} City Guide | CityMitra`,
      description: guide.tagline,
      url: `${siteUrl}/cities/${guide.slug}`,
      type: "article"
    }
  };
}

export default async function CityGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getCityGuide(slug);

  if (!guide) notFound();

  const verifiedPicks = directory.filter((item) => item.city === guide.name).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${guide.name} City Guide`,
    description: guide.tagline,
    author: { "@type": "Organization", name: "CityMitra" },
    publisher: { "@type": "Organization", name: "CityMitra", url: siteUrl },
    mainEntityOfPage: `${siteUrl}/cities/${guide.slug}`,
    about: { "@type": "City", name: guide.name, containedInPlace: { "@type": "State", name: guide.state } }
  };

  return (
    <PageShell>
      <article className="guidePage">
        <header
          className="guideHero"
          style={{
            backgroundImage: `linear-gradient(110deg, rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.45)), url("/api/city-image?city=${encodeURIComponent(guide.name)}&topic=city")`
          }}
        >
          <nav className="guideCrumbs" aria-label="Breadcrumb">
            <Link href="/cities">City Guides</Link>
            <span>/</span>
            <b>{guide.name}</b>
          </nav>
          <h1>{guide.name}</h1>
          <p>{guide.tagline}</p>
        </header>

        <ShareRow title={`${guide.name} city guide on CityMitra — markets, food, transport & local tips`} />

        <section className="guideIntro">
          {guide.intro.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>

        <section className="guideFacts" aria-label="Quick facts">
          <div>
            <CalendarDays size={18} />
            <h2>Best time</h2>
            <p>{guide.bestTime}</p>
          </div>
          <div>
            <Bus size={18} />
            <h2>Getting around</h2>
            <p>{guide.gettingAround}</p>
          </div>
          <div>
            <Wallet size={18} />
            <h2>Budget note</h2>
            <p>{guide.budgetNote}</p>
          </div>
        </section>

        <section className="guideAreas">
          <h2>Key areas and what they are good for</h2>
          <ul>
            {guide.keyAreas.map((area) => (
              <li key={area.name}>
                <MapPinned size={16} />
                <div>
                  <h3>{area.name}</h3>
                  <p>{area.knownFor}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {verifiedPicks.length > 0 && (
          <section className="guidePicks">
            <h2>Curated picks in {guide.name}</h2>
            <div>
              {verifiedPicks.map((item) => (
                <article key={item.name}>
                  <span className="guidePickBadge">
                    <BadgeCheck size={14} />
                    {categories.find((cat) => cat.key === item.category)?.label || "City"}
                  </span>
                  <h3>{item.name}</h3>
                  <p>
                    {item.area} · {item.bestFor}
                  </p>
                  <small>{item.tip}</small>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="guideTips">
          <h2>Local tips before you go</h2>
          <ul>
            {guide.tips.map((tip) => (
              <li key={tip}>
                <Lightbulb size={16} />
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <section className="guideCta">
          <h2>Plan {guide.name} with the AI guide</h2>
          <p>Get a personalised route with timings, backup stops, hospitals, fuel, and map links.</p>
          <Link className="primaryButton" href="/#ai">
            Ask CityMitra <ArrowRight size={17} />
          </Link>
        </section>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </PageShell>
  );
}
