import type { Metadata } from "next";
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
    </PageShell>
  );
}
