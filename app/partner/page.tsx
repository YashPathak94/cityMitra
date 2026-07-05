import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  HandCoins,
  LayoutDashboard,
  Megaphone,
  Store,
  Target
} from "lucide-react";
import PageShell from "@/app/components/PageShell";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ctmitra.com";
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "helpdesk@ctmitra.com";

export const metadata: Metadata = {
  title: "Partner & Advertise",
  description:
    "Reach high-intent local shoppers and travellers on CityMitra. Featured listings, lead routing, and city-category sponsorships for shops, hotels, clinics, and brands.",
  alternates: { canonical: "/partner" }
};

const revenueModels = [
  {
    icon: Store,
    title: "Featured listings",
    text: "Get verified placement, photos, offers, and a trust badge so your shop appears first when people search your category."
  },
  {
    icon: Megaphone,
    title: "Lead routing",
    text: "Hotels, repair shops, clinics, and stores receive qualified clicks and map opens from people actively heading their way."
  },
  {
    icon: LayoutDashboard,
    title: "Vendor dashboard",
    text: "Track views, map opens, category demand, and chat-driven interest so you know exactly what your spend returns."
  },
  {
    icon: HandCoins,
    title: "City sponsorships",
    text: "Sponsor a whole category in a city — food trails, shopping routes, travel plans — and own that audience."
  }
];

export default function PartnerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Partner & Advertise with CityMitra",
    url: `${siteUrl}/partner`,
    description: metadata.description
  };

  return (
    <PageShell>
      <article className="policyPage partnerPage">
        <header className="partnerHero">
          <span className="sectionKicker">For Businesses</span>
          <h1>Put your business in front of high-intent locals</h1>
          <p>
            CityMitra users are not idle browsers — they are deciding where to go right now: which market, which
            hotel, which clinic, which repair shop. Reach them at the exact moment of intent, in your city and your
            category.
          </p>
          <a className="primaryButton" href={`mailto:${contactEmail}?subject=CityMitra%20partnership`}>
            Talk to us <ArrowRight size={17} />
          </a>
        </header>

        <section>
          <h2>Ways to work with CityMitra</h2>
          <div className="partnerGrid">
            {revenueModels.map((model) => {
              const Icon = model.icon;
              return (
                <div className="partnerCard" key={model.title}>
                  <span className="bentoIcon">
                    <Icon size={19} />
                  </span>
                  <h3>{model.title}</h3>
                  <p>{model.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="featured-listings" className="partnerBlock">
          <span className="partnerBadge">
            <BadgeCheck size={15} />
            Featured Listings
          </span>
          <h2>Be the verified, top-of-list choice</h2>
          <p>
            A featured listing puts your business above the generated results for your category and city, with a
            “Verified” badge, your photos, offers, and a direct map/call action. It’s a flat monthly fee — predictable,
            no bidding wars, no per-click surprises.
          </p>
          <ul className="partnerPoints">
            <li><Target size={15} /> Priority placement in your category + city</li>
            <li><BadgeCheck size={15} /> Verified trust badge and richer profile</li>
            <li><BarChart3 size={15} /> Monthly report of views, map opens, and leads</li>
          </ul>
        </section>

        <section id="sponsorships" className="partnerBlock">
          <span className="partnerBadge">
            <HandCoins size={15} />
            Sponsorships
          </span>
          <h2>Sponsor a city or a category</h2>
          <p>
            Bigger brands can sponsor an entire category in a city — “Hotels in Jaipur, powered by your brand”, a
            sponsored food trail, or a seasonal shopping route. Your brand sits alongside genuinely useful content, so
            it earns goodwill instead of being skipped like a banner ad.
          </p>
          <ul className="partnerPoints">
            <li><Megaphone size={15} /> Category- or city-level brand presence</li>
            <li><Target size={15} /> Aligned with real travel and shopping intent</li>
            <li><BarChart3 size={15} /> Campaign reporting on reach and engagement</li>
          </ul>
        </section>

        <section className="partnerCta">
          <h2>Ready to reach your city?</h2>
          <p>Tell us your city, category, and goal — we’ll suggest the right placement and pricing.</p>
          <div className="partnerCtaActions">
            <a className="primaryButton" href={`mailto:${contactEmail}?subject=CityMitra%20partnership`}>
              Email us <ArrowRight size={16} />
            </a>
            <Link className="secondaryButton" href="/contact">
              Contact page
            </Link>
          </div>
        </section>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </PageShell>
  );
}
