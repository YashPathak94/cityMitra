import type { Metadata } from "next";
import AuthPanel from "@/app/components/AuthPanel";

export const metadata: Metadata = {
  title: "Sign in · CityMitra",
  description: "Sign in or create your CityMitra account to unlock your AI city guide and concierge.",
  alternates: { canonical: "/signin" }
};

export default function SignInPage() {
  return <AuthPanel />;
}
