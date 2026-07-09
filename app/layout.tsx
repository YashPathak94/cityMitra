import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { knownSocialProfiles } from "@/lib/social";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ctmitra.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    // "(ctmitra.com)" in the home title deliberately bridges the brand name
    // (CityMitra) to the domain spelling (ctmitra, no "y") so the literal
    // query "ctmitra" matches on-page text. Safe to drop once the brand
    // query ranks on its own.
    default: "CityMitra (ctmitra.com) | AI City Guide for Indian Cities",
    template: "%s | CityMitra"
  },
  description:
    "CityMitra (ctmitra.com) is an AI-powered city guide for India. Find trusted markets, hospitals, hotels, food, repairs, petrol pumps, and sightseeing with smart routes, maps, and a chat planner.",
  keywords: [
    "CityMitra",
    "ctmitra",
    "ctmitra.com",
    "Indian city guide",
    "AI travel planner India",
    "AI city guide India",
    "wholesale markets India",
    "city recommendations",
    "things to do near me India",
    "local business directory India",
    "travel budget planner India",
    "trip planner",
    "EV charging station finder India",
    "nearby doctors clinics India"
  ],
  alternates: { canonical: "/" },
  // Set GOOGLE_SITE_VERIFICATION after adding the domain in Google Search
  // Console (Settings > Ownership verification > HTML tag > copy just the
  // content="..." value). Omitted entirely until then, no placeholder tag.
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
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
  "@graph": [
    {
      "@type": "WebSite",
      name: "CityMitra",
      url: siteUrl,
      description:
        "AI-powered city discovery for India: markets, hospitals, hotels, food, repairs, petrol pumps, and sightseeing with smart routes and chat planning.",
      inLanguage: "en-IN",
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "CityMitra",
      // Domain spells "ctmitra" (no "y") while the product is called
      // "CityMitra" everywhere in copy — alternateName ties the two together
      // for search engines so a literal "ctmitra" query can resolve here.
      alternateName: ["ctmitra", "ctmitra.com"],
      url: siteUrl,
      logo: `${siteUrl}/brand/citymitra-icon-512.png`,
      slogan: "Your Need. Your Mitra.",
      email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "helpdesk@ctmitra.com",
      description: "AI city guide and travel planner for Indian cities.",
      sameAs: knownSocialProfiles
    }
  ]
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
        {/* Google AdSense (auto ads): one snippet site-wide; placements are
            managed from the AdSense dashboard, no per-page ad units in code. */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8272412641821719"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
