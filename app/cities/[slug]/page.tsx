import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Bus,
  CalendarDays,
  ClipboardCheck,
  ExternalLink,
  Landmark,
  Lightbulb,
  MapPinned,
  Route,
  Sparkles,
  Users,
  Wallet
} from "lucide-react";
import { cityGuides, getCityGuide } from "@/data/city-guides";
import { cityThemeLabels, getCityEditorial } from "@/data/city-editorials";
import { categories, directory } from "@/data/city-directory";
import CityAskWidget from "@/app/components/CityAskWidget";
import PageShell from "@/app/components/PageShell";
import ShareRow from "@/app/components/ShareRow";
import { mapSearchUrl } from "@/lib/maps";
import { categoryUrl } from "@/lib/city-category-guides";
import styles from "./editorial.module.css";

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

  const editorial = getCityEditorial(guide.slug);
  const verifiedPicks = directory.filter((item) => item.city === guide.name).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${guide.name} City Guide`,
    description: guide.tagline,
    author: { "@type": "Organization", name: "CityMitra" },
    publisher: { "@type": "Organization", name: "CityMitra", url: siteUrl },
    mainEntityOfPage: `${siteUrl}/cities/${guide.slug}`,
    dateModified: "2026-07-25",
    isAccessibleForFree: true,
    about: { "@type": "City", name: guide.name, containedInPlace: { "@type": "State", name: guide.state } }
  };

  return (
    <PageShell>
      <article className="guidePage">
        <header
          className="guideHero"
          style={{
            backgroundImage: `linear-gradient(110deg, rgba(15, 23, 42, 0.84), rgba(15, 23, 42, 0.48)), url("/api/city-image?city=${encodeURIComponent(guide.name)}&category=city&topic=city")`
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

        {editorial && (
          <section className={styles.pulse} aria-labelledby="city-pulse-title">
            <div className={styles.pulseHeader}>
              <div>
                <span className="sectionKicker">City pulse · Human-written</span>
                <h2 id="city-pulse-title">{editorial.heading}</h2>
              </div>
              <div className={styles.pulseThemes}>
                {editorial.themes.map((theme) => <span key={theme}>{cityThemeLabels[theme]}</span>)}
              </div>
            </div>

            <div className={styles.pulseGrid}>
              <article>
                <span><Sparkles size={17} /> The vibe</span>
                <p>{editorial.vibe}</p>
              </article>
              <article>
                <span><BookOpen size={17} /> Culture in motion</span>
                <p>{editorial.culture}</p>
              </article>
              <article>
                <span><Users size={17} /> People energy</span>
                <p>{editorial.people}</p>
              </article>
              <article>
                <span><Award size={17} /> What the city contributes</span>
                <p>{editorial.contribution}</p>
              </article>
            </div>

            <div className={styles.microMoments}>
              <div>
                <span className={styles.sectionLabel}>Three small moments worth noticing</span>
                <p>The kind of city memory that rarely appears in a “top 10” list.</p>
              </div>
              <div>
                {editorial.microMoments.map((moment) => (
                  <a href={mapSearchUrl(`${moment} ${guide.name}`, null)} target="_blank" rel="noreferrer" key={moment}>
                    {moment}<ArrowRight size={14} />
                  </a>
                ))}
              </div>
            </div>

            <div className={styles.respect}>
              <strong>Travel with context</strong>
              <p>{editorial.respect}</p>
            </div>

            <div className={styles.editorialMeta}>
              <span>Editorial review: 25 July 2026 · Original CityMitra planning notes</span>
              <div>
                <Link href="/methodology">How we research</Link>
                {editorial.sources?.map((source) => (
                  <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>
                    {source.label}<ExternalLink size={12} />
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className={styles.categoryDirectory} aria-label={`Explore categories in ${guide.name}`}>
          <div>
            <span className="sectionKicker">50 local categories</span>
            <h2>Go from city overview to the exact thing you need.</h2>
            <p>Every category opens a dedicated {guide.name} guide with neighbourhood context, Maps-ready discovery, nearby mode, and the CityMitra concierge.</p>
          </div>
          <div className={styles.categoryLinks}>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link href={categoryUrl(guide.slug, category.key)} key={category.key}>
                  <Icon size={17} />
                  <span>{category.label}</span>
                  <ArrowRight size={14} />
                </Link>
              );
            })}
          </div>
        </section>

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

        <section className={styles.localEditorial}>
          <div>
            <span className={styles.sectionLabel}>Local brief</span>
            <h2>{guide.localBrief.title}</h2>
            <p>{guide.localBrief.description}</p>
          </div>
          <div>
            <span className={styles.sectionLabel}>
              <Route size={15} />
              Practical half-day route
            </span>
            <ol>
              {guide.halfDayPlan.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div>
            <span className={styles.sectionLabel}>
              <ClipboardCheck size={15} />
              Checks before you leave
            </span>
            <ul>
              {guide.localChecks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
          </div>
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

        <CityAskWidget city={guide.name} />

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
