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
  Camera,
  Clock3,
  Compass,
  ClipboardCheck,
  ExternalLink,
  Landmark,
  Lightbulb,
  MapPinned,
  Route,
  Sparkles,
  Utensils,
  Users,
  Wallet
} from "lucide-react";
import { cityGuides, getCityGuide } from "@/data/city-guides";
import { cityThemeLabels, getCityEditorial } from "@/data/city-editorials";
import { experienceImageUrl, experienceSearchQuery, getCityExperiences } from "@/data/city-experiences";
import { getCityFoodGuide } from "@/data/city-food-guides";
import { categories, directory } from "@/data/city-directory";
import CityAskWidget from "@/app/components/CityAskWidget";
import CityCategoryTabs from "@/app/components/CityCategoryTabs";
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
  const foodGuide = getCityFoodGuide(guide.name);

  return {
    title: `${guide.name} City Guide — Food, Local Spots, Routes & Tips`,
    description: `${guide.tagline} Explore ${guide.name} food signatures, local spots, famous places, neighbourhoods, transport, practical routes, and checks before leaving.`,
    keywords: [
      `${guide.name} city guide`,
      `things to do in ${guide.name}`,
      `food in ${guide.name}`,
      `restaurants in ${guide.name}`,
      ...(foodGuide?.picks.map((pick) => `${pick.dish} ${guide.name}`) || [])
    ],
    alternates: { canonical: `/cities/${guide.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${guide.name} City Guide | CityMitra`,
      description: guide.tagline,
      url: `${siteUrl}/cities/${guide.slug}`,
      type: "article",
      images: [{ url: `${siteUrl}/api/city-image?city=${encodeURIComponent(guide.name)}&topic=city`, width: 1200, height: 630 }]
    }
  };
}

export default async function CityGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getCityGuide(slug);

  if (!guide) notFound();

  const editorial = getCityEditorial(guide.slug);
  const foodGuide = getCityFoodGuide(guide.name);
  const cityExperiences = getCityExperiences(guide.name);
  const verifiedPicks = directory.filter((item) => item.city === guide.name).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${guide.name} City Guide`,
        description: guide.tagline,
        author: { "@type": "Organization", name: "CityMitra Editorial Desk" },
        publisher: { "@type": "Organization", name: "CityMitra", url: siteUrl },
        mainEntityOfPage: `${siteUrl}/cities/${guide.slug}`,
        dateModified: "2026-08-01",
        isAccessibleForFree: true,
        about: { "@type": "City", name: guide.name, containedInPlace: { "@type": "State", name: guide.state } }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "City Guides", item: `${siteUrl}/cities` },
          { "@type": "ListItem", position: 2, name: guide.name, item: `${siteUrl}/cities/${guide.slug}` }
        ]
      },
      {
        "@type": "ItemList",
        name: `${guide.name} local shortlist`,
        itemListElement: cityExperiences.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          description: `${item.vibe} ${item.whyGo}`,
          url: mapSearchUrl(experienceSearchQuery(item), null)
        }))
      }
    ]
  };

  return (
    <PageShell>
      <article className={`guidePage ${styles.page}`}>
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
              <span>CityMitra Editorial Desk · Reviewed 1 August 2026 · Original planning notes</span>
              <div>
                <Link href="/methodology">How we research</Link>
                <Link href="/contact">Suggest a correction</Link>
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
          <CityCategoryTabs city={guide.name} citySlug={guide.slug} />
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

        <section className={styles.localBoard} aria-labelledby="local-board-title">
          <div className={styles.boardHeader}>
            <div>
              <span className="sectionKicker">Eat · See · Do</span>
              <h2 id="local-board-title">A sharper {guide.name} shortlist.</h2>
            </div>
            <p>
              Original CityMitra context, not copied reviews or invented ratings. Open the live listing to verify
              current hours, phone, menu, access, photos, and recent traveller feedback.
            </p>
          </div>

          <div className={styles.experienceGrid}>
            {cityExperiences.map((item, index) => {
              const Icon = item.kind === "restaurant" ? Utensils : item.kind === "famous" ? Landmark : item.kind === "local" ? Camera : Compass;
              const label = item.kind === "restaurant" ? "Food anchor" : item.kind === "famous" ? "First-timer icon" : item.kind === "local" ? "Local mood" : "Do this";
              return (
                <article className={styles.experienceCard} key={`${item.kind}-${item.name}`}>
                  <a
                    className={styles.experienceImage}
                    href={mapSearchUrl(experienceSearchQuery(item), null)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open live map for ${item.name}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={experienceImageUrl(item)} alt={`${item.name} in ${guide.name}`} loading={index < 2 ? "eager" : "lazy"} />
                    <span><Icon size={14} /> {label}</span>
                  </a>
                  <div className={styles.experienceBody}>
                    <span className={styles.experienceArea}><MapPinned size={14} /> {item.area}</span>
                    <h3>{item.name}</h3>
                    <p>{item.vibe}</p>
                    <strong>{item.whyGo}</strong>
                    <div className={styles.experienceTiming}><Clock3 size={14} /> {item.bestTime}</div>
                    <a href={mapSearchUrl(experienceSearchQuery(item), null)} target="_blank" rel="noreferrer">
                      Verify live and route <ExternalLink size={13} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {foodGuide && (
            <div className={styles.foodRadar}>
              <div>
                <span><Utensils size={16} /> Food radar</span>
                <h3>Three {guide.name} flavours worth searching locally.</h3>
                <p>{foodGuide.note}</p>
              </div>
              <div className={styles.foodPicks}>
                {foodGuide.picks.map((pick, index) => (
                  <a
                    href={mapSearchUrl(`${pick.dish} near ${pick.area} ${guide.name}`, null)}
                    target="_blank"
                    rel="noreferrer"
                    key={`${pick.dish}-${pick.area}`}
                  >
                    <b>0{index + 1}</b>
                    <span><strong>{pick.dish}</strong><small>{pick.area}</small></span>
                    <ArrowRight size={15} />
                  </a>
                ))}
              </div>
            </div>
          )}
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </PageShell>
  );
}
