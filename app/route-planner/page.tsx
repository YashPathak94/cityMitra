import type { Metadata } from "next";
import PageShell from "@/app/components/PageShell";
import RoutePlanner from "@/app/components/RoutePlanner";

export const metadata: Metadata = {
  title: "Route Planner",
  description:
    "Plan a road trip anywhere in India: AI-suggested route options, hop points, best time to travel, fuel stops, local itinerary tips and emergency numbers, plus a live Google Maps link.",
  alternates: { canonical: "/route-planner" }
};

export default function RoutePlannerPage() {
  return (
    <PageShell>
      <RoutePlanner />
    </PageShell>
  );
}
