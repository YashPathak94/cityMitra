import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeIndianRupee,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Footprints,
  Gem,
  Gift,
  Globe2,
  House,
  MapPinned,
  PackageCheck,
  ParkingCircleOff,
  Route,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  ToyBrick,
  TrainFront,
  TriangleAlert,
  UsersRound,
  WalletCards
} from "lucide-react";
import PageShell from "@/app/components/PageShell";
import Reveal from "@/app/components/Reveal";
import ShareRow from "@/app/components/ShareRow";
import { mapEmbedUrl, mapSearchUrl } from "@/lib/maps";
import styles from "./page.module.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ctmitra.com";
const marketQuery = "Sadar Bazar Shopping Green Market Pahari Dhiraj New Delhi 110006";
const marketMapUrl = mapSearchUrl(marketQuery, null);

export const metadata: Metadata = {
  title: "Sadar Bazaar Delhi Wholesale Shopping Guide",
  description:
    "An original CityMitra buyer's guide to Sadar Bazaar Delhi: product lanes, best time, metro route, crowd strategy, wholesale checks, map, and nearby alternatives.",
  alternates: { canonical: "/cities/delhi/wholesale" },
  openGraph: {
    title: "Sadar Bazaar Delhi, without the chaos tax | CityMitra",
    description: "What to buy, when to arrive, how to compare quotes, and why the metro beats parking every time.",
    url: `${siteUrl}/cities/delhi/wholesale`,
    type: "article",
    images: [
      {
        url: `${siteUrl}/images/delhi-wholesale/sadar-bazaar-hero.png`,
        width: 1536,
        height: 864,
        alt: "A busy wholesale market lane inspired by Sadar Bazaar in Delhi"
      }
    ]
  }
};

const productClusters = [
  {
    icon: House,
    number: "01",
    title: "Home + kitchen",
    copy: "Storage, steelware, cleaning tools, plastic utility goods and everyday household stock.",
    ask: "Carton rate, colour mix and replacement policy"
  },
  {
    icon: ToyBrick,
    number: "02",
    title: "Toys + party",
    copy: "Return gifts, small toys, balloons, party props and seasonal kids' merchandise.",
    ask: "Age marking, battery inclusion and minimum lot"
  },
  {
    icon: Gem,
    number: "03",
    title: "Jewellery + beauty",
    copy: "Imitation jewellery, hair accessories, bangles, cosmetics packaging and counter-display stock.",
    ask: "Sample piece, finish consistency and mixed designs"
  },
  {
    icon: PackageCheck,
    number: "04",
    title: "Gifts + packaging",
    copy: "Gift boxes, wrapping, pouches, ribbons, stationery and packaging for small businesses.",
    ask: "Plain versus printed rate and custom quantity"
  },
  {
    icon: ShoppingBag,
    number: "05",
    title: "Textiles + cut pieces",
    copy: "Dress materials, utility fabrics, towels, bedding and value-focused cut-piece bundles.",
    ask: "Fabric width, defects, wash care and bale quantity"
  },
  {
    icon: Gift,
    number: "06",
    title: "Festive + seasonal",
    copy: "Decor, lights, wedding supplies, festival stock and trend-led impulse products.",
    ask: "Restock window, dead-stock exchange and dispatch time"
  }
];

const buyerRoute = [
  {
    time: "09:45",
    title: "Arrive at the edge",
    copy: "Use Tis Hazari or Pul Bangash on the Red Line, then take a short auto to Green Market. Save your exit landmark before entering."
  },
  {
    time: "10:15",
    title: "Do a no-buy scan",
    copy: "Walk the relevant lane once. Photograph product codes and note three quotes before committing to cartons."
  },
  {
    time: "11:00",
    title: "Lock quality, then price",
    copy: "Open one sample from the lot. Confirm size, colour mix, packing count, GST bill and replacement terms."
  },
  {
    time: "12:00",
    title: "Consolidate dispatch",
    copy: "Ask whether multiple purchases can reach one porter, tempo or courier point. Carrying everything lane by lane is the rookie tax."
  },
  {
    time: "13:00",
    title: "Exit before peak crush",
    copy: "Recheck invoices and parcel count, then move to your saved pickup landmark before the afternoon crowd thickens."
  }
];

const nearbyOptions = [
  { name: "Sadar Bazar Mart", rating: "4.0", reviews: "1.3K+", label: "Wholesaler" },
  { name: "Sadar Bazar", rating: "4.0", reviews: "990+", label: "General market" },
  { name: "Wholesale Market Sadar Bazar", rating: "4.2", reviews: "140+", label: "Wholesale cluster" },
  { name: "Sadar Market", rating: "4.0", reviews: "520+", label: "Market" }
];

const faqs = [
  {
    question: "Can retail shoppers buy at Sadar Bazaar?",
    answer:
      "Often, yes, but the strongest pricing usually starts at a shop's minimum quantity. Ask for the single-piece, small-lot and carton rates separately so the comparison is honest."
  },
  {
    question: "What is the best time to visit?",
    answer:
      "Aim for the first working hours, roughly 10:00 AM to noon. The listing supplied to CityMitra showed trading into the evening, but hours vary by lane and Sundays are commonly limited or closed. Verify the live listing before leaving."
  },
  {
    question: "Which metro station should I use?",
    answer:
      "Tis Hazari and Pul Bangash on the Red Line are practical approaches. The final stretch is easier by auto or e-rickshaw than by walking with stock. Choose the station based on your first lane and traffic conditions."
  },
  {
    question: "Should I bring a car?",
    answer:
      "Avoid it unless you already have a confirmed loading point. Parking and lane congestion are recurring pain points. Metro in, then arrange a porter, courier or commercial pickup for bulk parcels."
  },
  {
    question: "How do I avoid a bad wholesale purchase?",
    answer:
      "Check a physical sample, count units, confirm whether tax is included, ask about damaged-piece replacement, photograph the shopfront and invoice, and never assume two similar cartons contain identical stock."
  }
];

export default function DelhiWholesalePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Sadar Bazaar Delhi Wholesale Shopping Guide",
        description: "CityMitra's original buyer-first guide to Delhi's Sadar Bazaar wholesale market.",
        image: `${siteUrl}/images/delhi-wholesale/sadar-bazaar-hero.png`,
        author: { "@type": "Organization", name: "CityMitra" },
        publisher: { "@type": "Organization", name: "CityMitra", url: siteUrl },
        dateModified: "2026-07-20",
        mainEntityOfPage: `${siteUrl}/cities/delhi/wholesale`
      },
      {
        "@type": "Place",
        name: "Sadar Bazar Shopping",
        alternateName: "सदर बाजार शॉपिंग",
        url: "https://sadarbazarmarket.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Green Market, Pahari Dhiraj, Sadar Bazaar",
          addressLocality: "New Delhi",
          addressRegion: "Delhi",
          postalCode: "110006",
          addressCountry: "IN"
        },
        aggregateRating: { "@type": "AggregateRating", ratingValue: "3.9", reviewCount: "359" }
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer }
        }))
      }
    ]
  };

  return (
    <PageShell>
      <article className={styles.page}>
        <header className={styles.hero}>
          <Image
            className={styles.heroImage}
            src="/images/delhi-wholesale/sadar-bazaar-hero.png"
            alt="A busy Delhi wholesale lane with household goods, toys, textiles and handcarts"
            fill
            priority
            sizes="100vw"
          />
          <div className={styles.heroShade} />
          <div className={styles.heroContent}>
            <nav className={styles.crumbs} aria-label="Breadcrumb">
              <Link href="/cities">City guides</Link>
              <ChevronRight size={14} />
              <Link href="/cities/delhi">Delhi</Link>
              <ChevronRight size={14} />
              <span>Wholesale</span>
            </nav>

            <div className={styles.heroBadge}>
              <Sparkles size={15} /> CityMitra wholesale playbook
            </div>
            <h1>
              Sadar Bazaar, <em>without the chaos tax.</em>
            </h1>
            <p className={styles.hindi}>सदर बाजार शॉपिंग</p>
            <p className={styles.heroCopy}>
              One market, hundreds of buying decisions. Know the right lane, compare the right quote and leave before
              the crowd turns a two-hour run into an all-day side quest.
            </p>

            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href={marketMapUrl} target="_blank" rel="noreferrer">
                <MapPinned size={18} /> Open live map <ExternalLink size={14} />
              </a>
              <a className={styles.secondaryAction} href="https://sadarbazarmarket.com" target="_blank" rel="noreferrer">
                <Globe2 size={18} /> Market website
              </a>
            </div>

            <div className={styles.heroSignals} aria-label="Market highlights">
              <span><Clock3 size={15} /> Best before noon</span>
              <span><Boxes size={15} /> Bulk-first pricing</span>
              <span><TrainFront size={15} /> Metro beats parking</span>
            </div>
          </div>
        </header>

        <div className={styles.body}>
          <ShareRow title="Sadar Bazaar Delhi wholesale guide — what to buy, when to go, and how to shop smarter" />

          <Reveal className={styles.factRail}>
            <div>
              <span className={styles.rating}><Star size={18} fill="currentColor" /> 3.9</span>
              <p>359 public reviews</p>
            </div>
            <div>
              <span><Store size={18} /> Wholesale market</span>
              <p>Green Market · Pahari Dhiraj</p>
            </div>
            <div>
              <span><Clock3 size={18} /> Listed close: 7:30 PM</span>
              <p>Hours vary by lane · verify live</p>
            </div>
            <div>
              <span><MapPinned size={18} /> 110006</span>
              <p>Plus code: M646+RV</p>
            </div>
          </Reveal>

          <Reveal className={styles.introGrid}>
            <div className={styles.introCopy}>
              <span className={styles.kicker}>The honest read</span>
              <h2>Delhi&apos;s everything market rewards prep, not wandering.</h2>
              <p>
                Sadar Bazaar is less a single market and more a dense trading system. Household goods, toys,
                jewellery, stationery, textiles and festival stock split across lanes, buildings and specialist shops.
                The price can be excellent; the navigation is not designed for first-timers.
              </p>
              <p>
                Community feedback is consistent: variety is the superpower, congestion is the tax. Treat the first
                thirty minutes as research, save every promising shopfront on your phone and consolidate parcels only
                after you have compared the full landed cost.
              </p>
              <div className={styles.editorNote}>
                <ShieldCheck size={20} />
                <div>
                  <b>CityMitra editorial note</b>
                  <span>Original guidance based on the supplied listing signals and practical wholesale-buying checks.</span>
                </div>
              </div>
            </div>
            <figure className={styles.productFigure}>
              <Image
                src="/images/delhi-wholesale/wholesale-product-mix.png"
                alt="An illustrative wholesale assortment of household goods, toys, stationery, jewellery and fabrics"
                fill
                sizes="(max-width: 860px) 100vw, 38vw"
              />
              <figcaption>Illustrative CityMitra image · product mix varies by lane and season</figcaption>
            </figure>
          </Reveal>

          <Reveal className={styles.section}>
            <div className={styles.sectionHead}>
              <div>
                <span className={styles.kicker}>Pick your lane</span>
                <h2>Shop by mission, not by whatever appears first.</h2>
              </div>
              <p>Every cluster has one question that protects your margin. Ask it before the shopkeeper starts packing.</p>
            </div>
            <div className={styles.clusterGrid}>
              {productClusters.map((cluster) => {
                const Icon = cluster.icon;
                return (
                  <article className={styles.clusterCard} key={cluster.title}>
                    <div className={styles.clusterTop}>
                      <span><Icon size={20} /></span>
                      <small>{cluster.number}</small>
                    </div>
                    <h3>{cluster.title}</h3>
                    <p>{cluster.copy}</p>
                    <div><BadgeIndianRupee size={15} /> Ask: {cluster.ask}</div>
                  </article>
                );
              })}
            </div>
          </Reveal>

          <Reveal className={styles.routeSection}>
            <div className={styles.routeIntro}>
              <span className={styles.kicker}>The low-chaos route</span>
              <h2>Five moves. One disciplined market run.</h2>
              <p>Built for buyers who want evidence, not seventeen shopping bags and buyer&apos;s remorse.</p>
              <a href={marketMapUrl} target="_blank" rel="noreferrer">
                Route to the market <ArrowRight size={16} />
              </a>
            </div>
            <ol className={styles.timeline}>
              {buyerRoute.map((step) => (
                <li key={step.time}>
                  <time>{step.time}</time>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className={styles.intelGrid}>
            <section className={styles.crowdCard}>
              <div className={styles.cardTitle}>
                <UsersRound size={20} />
                <div>
                  <span>Monday pulse</span>
                  <h2>Busy is the default setting.</h2>
                </div>
              </div>
              <p>
                The supplied listing showed live activity as busy as it gets. This is a planning signal, not a live
                feed: arrive early and keep your route tight.
              </p>
              <div className={styles.busyChart} aria-label="Illustrative Monday crowd pattern">
                {[18, 28, 68, 94, 78, 24].map((height, index) => (
                  <div key={["6a", "9a", "12p", "3p", "6p", "9p"][index]}>
                    <span style={{ height: `${height}%` }} />
                    <small>{["6a", "9a", "12p", "3p", "6p", "9p"][index]}</small>
                  </div>
                ))}
              </div>
              <div className={styles.signalPills}>
                <span>Overcrowded</span><span>Toys</span><span>Jewellery</span><span>Home goods</span>
              </div>
            </section>

            <section className={styles.checklistCard}>
              <div className={styles.cardTitle}>
                <WalletCards size={20} />
                <div>
                  <span>Before money moves</span>
                  <h2>Your six-point wholesale check.</h2>
                </div>
              </div>
              <ul>
                {["MOQ and mixed-design quantity", "GST bill and tax-inclusive total", "Opened sample versus packed stock", "Damaged-piece replacement terms", "Porter, courier or tempo handoff", "Shop photo, invoice and parcel count"].map((item) => (
                  <li key={item}><CheckCircle2 size={17} /> {item}</li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal className={styles.accessSection}>
            <div className={styles.accessCopy}>
              <span className={styles.kicker}>Getting there</span>
              <h2>Metro in. Commercial pickup out.</h2>
              <p>
                Tis Hazari and Pul Bangash are useful Red Line approaches. For the final stretch, an auto or e-rickshaw
                is usually kinder than walking with inventory. Confirm a pickup landmark outside the narrow lanes.
              </p>
              <div className={styles.accessWarnings}>
                <div><ParkingCircleOff size={22} /><span><b>Skip casual parking</b>Traffic and loading access are recurring complaints.</span></div>
                <div><Footprints size={22} /><span><b>Wear walking shoes</b>Uneven lanes, tight turns and repeated quote checks add distance.</span></div>
                <div><Route size={22} /><span><b>Save the exit</b>Pin your metro, auto stand or parcel pickup before entering.</span></div>
              </div>
            </div>
            <div className={styles.mapFrame}>
              <iframe
                title="Map of Sadar Bazaar Shopping in Delhi"
                src={mapEmbedUrl(marketQuery)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a href={marketMapUrl} target="_blank" rel="noreferrer">
                Open live directions <ExternalLink size={15} />
              </a>
            </div>
          </Reveal>

          <Reveal className={styles.communitySection}>
            <div className={styles.sectionHead}>
              <div>
                <span className={styles.kicker}>Community signal</span>
                <h2>What 359 reviews are really saying.</h2>
              </div>
              <p>CityMitra summary of recurring themes, not copied review text.</p>
            </div>
            <div className={styles.sentimentGrid}>
              <article>
                <span className={styles.sentimentGood}>The upside</span>
                <h3>Variety that can replace multiple market trips.</h3>
                <p>Shoppers repeatedly value the sheer product range and the chance to unlock wholesale-adjacent prices.</p>
              </article>
              <article>
                <span className={styles.sentimentWarn}>The friction</span>
                <h3>Congestion makes unplanned browsing expensive.</h3>
                <p>Crowds, traffic and limited parking appear often enough to shape the entire CityMitra route strategy.</p>
              </article>
              <article>
                <span className={styles.sentimentNeutral}>The vibe</span>
                <h3>Old Delhi commerce with proper desi energy.</h3>
                <p>The market feels chaotic at first glance, then reveals specialist shops, old-city texture and serious buying depth.</p>
              </article>
            </div>
          </Reveal>

          <Reveal className={styles.marketInside}>
            <div>
              <span className={styles.kicker}>Inside the cluster</span>
              <h2>Two listing signals to start with.</h2>
              <p>These businesses were shown inside the supplied market listing. Ratings can change; verify before visiting.</p>
            </div>
            <div className={styles.insideCards}>
              <a href={mapSearchUrl("Vishal Agency bedding shop Sadar Bazaar Delhi", null)} target="_blank" rel="noreferrer">
                <span><Store size={18} /> Bedding shop</span>
                <h3>Vishal Agency</h3>
                <p><Star size={15} fill="currentColor" /> 4.8 · 23 reviews supplied</p>
                <small>Open live listing <ExternalLink size={13} /></small>
              </a>
              <a href={mapSearchUrl("National Hardware Store Sadar Bazaar Delhi", null)} target="_blank" rel="noreferrer">
                <span><Store size={18} /> Hardware shop</span>
                <h3>National Hardware Store</h3>
                <p><Star size={15} fill="currentColor" /> 4.6 · 5 reviews supplied</p>
                <small>Open live listing <ExternalLink size={13} /></small>
              </a>
            </div>
          </Reveal>

          <Reveal className={styles.nearbySection}>
            <div className={styles.sectionHead}>
              <div>
                <span className={styles.kicker}>Backup searches</span>
                <h2>Nearby names worth comparing on Maps.</h2>
              </div>
              <p>Use these as search anchors, then compare distance, photos, latest reviews and opening status.</p>
            </div>
            <div className={styles.nearbyList}>
              {nearbyOptions.map((option) => (
                <a href={mapSearchUrl(`${option.name} Delhi`, null)} target="_blank" rel="noreferrer" key={option.name}>
                  <div><span>{option.label}</span><h3>{option.name}</h3></div>
                  <p><Star size={14} fill="currentColor" /> {option.rating} · {option.reviews}</p>
                  <ExternalLink size={16} />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal className={styles.faqSection}>
            <div>
              <span className={styles.kicker}>Quick answers</span>
              <h2>Read this before the auto drops you off.</h2>
              <p>Small checks that prevent big-market regret.</p>
            </div>
            <div className={styles.faqList}>
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}<ChevronRight size={18} /></summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </Reveal>

          <section className={styles.finalCta}>
            <div>
              <span><TriangleAlert size={18} /> Live details change</span>
              <h2>Check hours, crowd and directions before you move.</h2>
              <p>Ratings, shop status and lane access can change. CityMitra gives you the plan; the live map gets the final vote.</p>
            </div>
            <a href={marketMapUrl} target="_blank" rel="noreferrer">Open Sadar Bazaar on Maps <ArrowRight size={17} /></a>
          </section>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </article>
    </PageShell>
  );
}
