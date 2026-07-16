import type { Metadata } from "next";
import CityAskWidget from "@/app/components/CityAskWidget";
import OfferRibbon from "@/app/components/OfferRibbon";
import PageShell from "@/app/components/PageShell";
import TravelPlanIntro from "@/app/components/TravelPlanIntro";
import TravelPlanner from "@/app/components/TravelPlanner";

export const metadata: Metadata = {
  title: "Travel Plan · Fund your trip with smart investing | CityMitra",
  description:
    "CityMitra's industry-first AI travel-funding engine: a smart calculator that plans SIPs, trending mutual funds & stocks, and card offers so your trip is paid for by returns and rewards — not your pocket.",
  alternates: { canonical: "/travel-plan" }
};

export default function TravelPlanPage() {
  return (
    <PageShell>
      <OfferRibbon city="Delhi" />
      <TravelPlanIntro />
      <TravelPlanner />
      <CityAskWidget city="Goa" suggestions={["Plan a weekend trip under \u20b98k", "Best months to visit Goa on a budget", "Hidden beaches locals actually go to"]} />
    </PageShell>
  );
}
