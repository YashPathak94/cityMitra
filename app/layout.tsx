import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://citymitra.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CityMitra | AI City Guide for Indian Cities",
    template: "%s | CityMitra"
  },
  description:
    "CityMitra is an AI-powered city guide for India. Find trusted markets, hospitals, hotels, food, repairs, petrol pumps, and sightseeing with smart routes, maps, and a chat planner.",
  keywords: [
    "Indian city guide",
    "AI travel planner India",
    "wholesale markets India",
    "city recommendations",
    "trip planner",
    "CityMitra"
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "CityMitra",
    title: "CityMitra | AI City Guide for Indian Cities",
    description:
      "Smart, map-ready recommendations for markets, hospitals, hotels, food, repairs, and sightseeing across Indian cities, with an AI chat planner.",
    locale: "en_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: "CityMitra | AI City Guide for Indian Cities",
    description:
      "Smart, map-ready recommendations for markets, hospitals, hotels, food, repairs, and sightseeing across Indian cities."
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ea580c"
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CityMitra",
  url: siteUrl,
  description:
    "AI-powered city discovery for India: markets, hospitals, hotels, food, repairs, petrol pumps, and sightseeing with smart routes and chat planning.",
  inLanguage: "en-IN",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>
        <a className="skipLink" href="#main">
          Skip to main content
        </a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SpeedInsights />
      </body>
    </html>
  );
}
