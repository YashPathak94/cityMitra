import type { Metadata } from "next";
import { BadgeCheck, Check } from "lucide-react";
import PageShell from "@/app/components/PageShell";
import ProAccess from "@/app/components/ProAccess";
import { proFeatures, proPriceInr } from "@/lib/pro";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ctmitra.com";

export const metadata: Metadata = {
  title: "CityMitra Pro",
  description:
    "CityMitra Pro: curated verified trip plans, a booking concierge, negotiation guidance, priority human agent support, and detailed live maps. Secure UPI/card payment.",
  alternates: { canonical: "/pro" }
};

export default function ProPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "CityMitra Pro",
    description: metadata.description,
    brand: { "@type": "Brand", name: "CityMitra" },
    offers: {
      "@type": "Offer",
      price: proPriceInr,
      priceCurrency: "INR",
      url: `${siteUrl}/pro`,
      availability: "https://schema.org/InStock"
    }
  };

  return (
    <PageShell>
      <article className="policyPage proPage">
        <header className="proHero">
          <span className="partnerBadge">
            <BadgeCheck size={15} />
            CityMitra Pro
          </span>
          <h1>Your intelligent travel concierge, upgraded</h1>
          <p>
            Pro turns CityMitra from a guide into a personal planner: verified trip plans, one-tap booking comparisons,
            negotiation guidance, real human support, and detailed live maps from where you are to every stop.
          </p>
          <div className="proPrice">
            <strong>₹{proPriceInr}</strong>
            <span>per month · cancel anytime</span>
          </div>
          <ProAccess priceInr={proPriceInr} />
        </header>

        <section>
          <h2>What you get with Pro</h2>
          <ul className="proFeatureList">
            {proFeatures.map((feature) => (
              <li key={feature}>
                <Check size={17} />
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <section className="proBlock">
          <h2>How payment works</h2>
          <p>
            Payments are processed securely by Razorpay — India’s leading payment gateway. CityMitra never sees or
            stores your card or UPI details. Every payment is cryptographically verified on our server before Pro is
            activated. You can cancel anytime; see the <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.
          </p>
        </section>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </PageShell>
  );
}
