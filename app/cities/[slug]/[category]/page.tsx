import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  ExternalLink,
  MapPin,
  Route,
  SearchCheck,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import CategoryNearbyActions from "@/app/components/CategoryNearbyActions";
import CityAskWidget from "@/app/components/CityAskWidget";
import PageShell from "@/app/components/PageShell";
import ShareRow from "@/app/components/ShareRow";
import { categories } from "@/data/city-directory";
import { cityGuides } from "@/data/city-guides";
import { categoryUrl, cityCategoryStaticParams, getCityCategoryGuide } from "@/lib/city-category-guides";
import { mapSearchUrl } from "@/lib/maps";
import styles from "./page.module.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ctmitra.com";

export function generateStaticParams() {
  return cityCategoryStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; category: string }> }): Promise<Metadata> {
  const { slug, category } = await params;
  const data = getCityCategoryGuide(slug, category);
  if (!data) return { title: "City category guide not found" };

  const title = `${data.category.label} in ${data.city.name} — Local Guide & Nearby Options`;
  const description = `${data.profile.promise} Compare ${data.category.label.toLowerCase()} areas in ${data.city.name}, check what matters, open nearby Maps results, and ask the CityMitra concierge.`;
  const canonical = `/cities/${data.city.slug}/${data.category.slug}`;

  return {
    title,
    description,
    keywords: [
      `${data.category.label} in ${data.city.name}`,
      `best ${data.category.label.toLowerCase()} ${data.city.name}`,
      `${data.category.label.toLowerCase()} near me in ${data.city.name}`,
      ...data.city.keyAreas.slice(0, 3).map((area) => `${data.category.label.toLowerCase()} near ${area.name}`)
    ],
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${data.category.label} in ${data.city.name} | CityMitra`,
      description,
      url: `${siteUrl}${canonical}`,
      type: "website",
      images: [{ url: `${siteUrl}/api/city-image?city=${encodeURIComponent(data.city.name)}&category=${encodeURIComponent(data.category.slug)}&topic=${encodeURIComponent(data.category.label)}`, width: 1200, height: 630 }]
    }
  };
}

export default async function CityCategoryPage({ params }: { params: Promise<{ slug: string; category: string }> }) {
  const { slug, category } = await params;
  const data = getCityCategoryGuide(slug, category);
  if (!data) notFound();

  const CategoryIcon = data.category.icon;
  const canonical = `${siteUrl}/cities/${data.city.slug}/${data.category.slug}`;
  const faq = [
    {
      question: `How should I compare ${data.category.label.toLowerCase()} in ${data.city.name}?`,
      answer: `Compare ${data.profile.compare.join(", ").toLowerCase()}. Use the same requirement for every option so the comparison stays useful.`
    },
    {
      question: `What should I verify before leaving?`,
      answer: `Verify ${data.profile.verify.join(", ").toLowerCase()}, then check current hours, route conditions and the final payable amount on the provider or Maps listing.`
    },
    {
      question: `Can CityMitra show options near my current location?`,
      answer: "Yes. Enable nearby mode on this page to open a location-centred Maps comparison. CityMitra does not publish your coordinates on the page."
    }
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `${data.category.label} in ${data.city.name}`,
        description: data.intro,
        url: canonical,
        dateModified: "2026-08-01",
        isAccessibleForFree: true,
        about: [
          { "@type": "City", name: data.city.name },
          { "@type": "Thing", name: data.category.label }
        ],
        mainEntity: {
          "@type": "ItemList",
          itemListElement: data.discoveries.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            description: item.summary
          }))
        }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "City Guides", item: `${siteUrl}/cities` },
          { "@type": "ListItem", position: 2, name: data.city.name, item: `${siteUrl}/cities/${data.city.slug}` },
          { "@type": "ListItem", position: 3, name: data.category.label, item: canonical }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer }
        }))
      }
    ]
  };

  return (
    <PageShell>
      <article className={styles.page} style={{ "--category-tint": data.category.tint } as CSSProperties}>
        <header
          className={styles.hero}
          style={{
            backgroundImage: `url("/api/city-image?city=${encodeURIComponent(data.city.name)}&category=${encodeURIComponent(data.category.slug)}&topic=${encodeURIComponent(data.category.label)}")`
          }}
        >
          <div className={styles.heroInner}>
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              <Link href="/cities">City guides</Link><ChevronRight size={14} />
              <Link href={`/cities/${data.city.slug}`}>{data.city.name}</Link><ChevronRight size={14} />
              <span>{data.category.label}</span>
            </nav>
            <span className={styles.eyebrow}><CategoryIcon size={17} /> CityMitra local intelligence</span>
            <h1>{data.category.label} in {data.city.name}</h1>
            <p className={styles.heroPromise}>{data.profile.promise}</p>
            <p className={styles.heroCopy}>{data.intro}</p>
            <div className={styles.heroActions}>
              <a href="#discoveries"><SearchCheck size={18} /> Explore area picks</a>
              <Link href={`/chat?q=${encodeURIComponent(`Help me compare ${data.category.label.toLowerCase()} in ${data.city.name} with nearby backups.`)}`}>
                <Sparkles size={18} /> Ask CityMitra
              </Link>
            </div>
            <div className={styles.heroSignals}>
              <span><MapPin size={15} /> {data.city.keyAreas.length} useful city zones</span>
              <span><ShieldCheck size={15} /> No invented ratings</span>
              <span><Route size={15} /> Nearby route mode</span>
            </div>
          </div>
        </header>

        <ShareRow title={`${data.category.label} in ${data.city.name} — CityMitra local guide`} />

        <section className={styles.citySwitch} aria-label="Browse this category by city">
          <div>
            <span className={styles.kicker}>Same need, different city</span>
            <h2>Switch city without restarting your search.</h2>
          </div>
          <div className={styles.cityRail}>
            {cityGuides.map((city) => (
              <Link className={city.slug === data.city.slug ? styles.activeChip : ""} href={`/cities/${city.slug}/${data.category.slug}`} key={city.slug}>
                {city.name}
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.factBand} aria-label={`${data.city.name} planning context`}>
          <div><CalendarClock size={19} /><span>Best window</span><p>{data.profile.bestWindow}</p></div>
          <div><Route size={19} /><span>Move smarter</span><p>{data.city.gettingAround}</p></div>
          <div><CircleAlert size={19} /><span>City reality</span><p>{data.city.budgetNote}</p></div>
        </section>

        <section className={styles.discoverySection} id="discoveries">
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.kicker}>Area-first discovery</span>
              <h2>Start with the right part of {data.city.name}.</h2>
            </div>
            <p>These cards identify useful search zones. “Source-backed” means a manually maintained record; “area discovery” is a Maps-ready prompt, not a claimed business listing.</p>
          </div>
          <div className={styles.discoveryRail} aria-label={`${data.category.label} discovery options in ${data.city.name}`}>
            {data.discoveries.map((item, index) => (
              <article className={styles.discoveryCard} key={`${item.name}-${item.area}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.discoveryImage}
                  src={item.image || `/api/city-image?city=${encodeURIComponent(data.city.name)}&topic=${encodeURIComponent(`${data.category.label} ${item.area}`)}&variant=${index}`}
                  alt={`${data.category.label} around ${item.area}, ${data.city.name}`}
                  loading={index < 3 ? "eager" : "lazy"}
                />
                <div className={styles.discoveryBody}>
                  <span className={styles.recordBadge}>
                    {item.recordType === "source-backed" ? <ShieldCheck size={14} /> : <Sparkles size={14} />}
                    {item.recordType === "source-backed" ? "Source-backed" : "Area discovery"}
                  </span>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.summary}</p>
                  </div>
                  <div className={styles.discoveryMeta}>
                    <span><MapPin size={14} /> {item.area}</span>
                    <span>{item.bestFor}</span>
                  </div>
                  <div className={styles.discoveryActions}>
                    <a href={mapSearchUrl(item.query, null)} target="_blank" rel="noreferrer">
                      Open map <ExternalLink size={14} />
                    </a>
                    {item.sourceUrl && (
                      <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                        Check source <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.decisionBand}>
          <div className={styles.sectionHead}>
            <div><span className={styles.kicker}>Decision shortcut</span><h2>Three things that matter most.</h2></div>
            <p>{data.uniqueSummary}</p>
          </div>
          <div className={styles.decisionGrid}>
            {data.profile.compare.map((item, index) => (
              <div key={item}>
                <span>0{index + 1}</span>
                <CheckCircle2 size={21} />
                <h3>{item}</h3>
                <p>Use the same requirement when comparing every option. That keeps ranking useful and prevents attractive but irrelevant results.</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.zoneSection}>
          <div className={styles.sectionHead}>
            <div><span className={styles.kicker}>{data.city.name} zone guide</span><h2>Neighbourhood context before the map opens.</h2></div>
            <p>{data.city.localBrief.description}</p>
          </div>
          <div className={styles.zoneList}>
            {data.city.keyAreas.map((area, index) => (
              <a href={mapSearchUrl(`${data.category.label} near ${area.name} ${data.city.name}`, null)} target="_blank" rel="noreferrer" key={area.name}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{area.name}</h3><p>{area.knownFor}</p></div>
                <ArrowRight size={18} />
              </a>
            ))}
          </div>
        </section>

        <section className={styles.nearbyBand}>
          <div className={styles.nearbyCopy}>
            <span className={styles.kicker}>Live nearby layer</span>
            <h2>Put your current location into the comparison.</h2>
            <p>Open multiple options around you, keep the city-level view as backup, or hand the decision to the concierge.</p>
          </div>
          <CategoryNearbyActions
            city={data.city.name}
            categoryKey={data.category.key}
            categoryLabel={data.category.label}
            nearbyPrompt={data.profile.nearbyPrompt}
            classNames={{ actions: styles.nearbyActions, primary: styles.primaryButton, secondary: styles.secondaryButton, status: styles.locationStatus }}
          />
        </section>

        <section className={styles.conciergeBand}>
          <div className={styles.conciergeIntro}>
            <span className={styles.kicker}>CityMitra concierge</span>
            <h2>Turn discovery into a plan.</h2>
            <p>Ask for a shortlist, route order, budget filter, family-friendly option or a backup near your next stop.</p>
          </div>
          <CityAskWidget
            city={data.city.name}
            suggestions={[
              `Compare ${data.category.label.toLowerCase()} near ${data.city.keyAreas[0].name}`,
              `Give me a budget and premium ${data.category.label.toLowerCase()} option in ${data.city.name}`,
              `Build a time-saving route with a nearby backup`
            ]}
          />
        </section>

        <section className={styles.verifySection}>
          <div className={styles.sectionHead}>
            <div><span className={styles.kicker}>Before you leave</span><h2>Verify the details that can change.</h2></div>
            <p>CityMitra provides local decision support. Current hours, price, inventory, clinical availability and service terms must be confirmed with the provider.</p>
          </div>
          <div className={styles.verifyGrid}>
            {data.profile.verify.map((item) => <span key={item}><BadgeCheck size={18} /> {item}</span>)}
          </div>
          <Link className={styles.methodLink} href="/methodology">How CityMitra researches and labels local information <ArrowRight size={15} /></Link>
          <div className={styles.reviewLine}>
            <span>CityMitra Editorial Desk · Reviewed 1 August 2026</span>
            <Link href="/contact">Suggest a correction</Link>
          </div>
        </section>

        <section className={styles.moreSection}>
          <div className={styles.sectionHead}>
            <div><span className={styles.kicker}>Keep exploring</span><h2>More useful categories in {data.city.name}.</h2></div>
            <Link href={`/cities/${data.city.slug}`}>Open full city guide <ArrowRight size={15} /></Link>
          </div>
          <div className={styles.categoryGrid}>
            {data.relatedCategories.map((item) => {
              const Icon = item.icon;
              return (
                <Link href={categoryUrl(data.city.slug, item.key)} key={item.key}>
                  <Icon size={19} /> <span>{item.label}</span> <ChevronRight size={16} />
                </Link>
              );
            })}
          </div>
          <details className={styles.allCategories}>
            <summary>Browse all {categories.length} categories</summary>
            <div>
              {categories.map((item) => <Link href={categoryUrl(data.city.slug, item.key)} key={item.key}>{item.label}</Link>)}
            </div>
          </details>
        </section>

        <section className={styles.faqSection}>
          <span className={styles.kicker}>Quick answers</span>
          <h2>{data.category.label} in {data.city.name}: common questions.</h2>
          {faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </article>
    </PageShell>
  );
}
