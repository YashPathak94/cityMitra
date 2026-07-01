import type { Metadata } from "next";
import PageShell from "@/app/components/PageShell";
import OffersGrid from "@/app/offers/OffersGrid";

export const metadata: Metadata = {
  title: "Offers & Deals",
  description:
    "Live discounts on hotels, flights, cabs and food from CityMitra's travel partners — updated as offers change.",
  alternates: { canonical: "/offers" }
};

export default function OffersPage() {
  return (
    <PageShell>
      <section className="dealsPageHero">
        <span className="sectionKicker">Offers & deals</span>
        <h1>All current travel offers, in one place</h1>
        <p>
          Browse live discounts from our booking partners across hotels, flights, cabs and food. Offers marked
          &ldquo;Coming soon&rdquo; are reserved slots we&rsquo;ll activate as soon as the partner link is live.
        </p>
      </section>

      <OffersGrid />
    </PageShell>
  );
}
