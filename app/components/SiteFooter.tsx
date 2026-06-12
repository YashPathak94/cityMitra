"use client";

import { ArrowUp, Instagram, Linkedin, Mail, Navigation, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { CategoryKey } from "@/data/city-directory";
import { trackActivity } from "@/lib/tracking";

// Set these in .env.local / Vercel to point at your real profiles.
const socialProfiles = {
  x: process.env.NEXT_PUBLIC_SOCIAL_X || "https://x.com",
  instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "https://instagram.com",
  linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "https://linkedin.com",
  whatsapp: process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP || "https://whatsapp.com"
};

function WhatsAppIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.241-.579-.486-.5-.668-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.793.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "City Guides", href: "/cities" },
      { label: "Directory", href: "/#directory" },
      { label: "AI Guide", href: "/#ai" },
      { label: "Nearby Picks", href: "/#ai" }
    ]
  },
  {
    title: "Business",
    links: [
      { label: "Monetize", href: "/#monetize" },
      { label: "Roadmap", href: "/#coverage" },
      { label: "Featured Listings", href: "/#monetize" },
      { label: "Sponsorships", href: "/#monetize" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" }
    ]
  }
];

type SiteFooterProps = {
  city: string;
  category: CategoryKey;
};

export default function SiteFooter({ city, category }: SiteFooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function subscribeNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = newsletterEmail.trim();

    if (!email || !email.includes("@")) {
      setNewsletterStatus("Drop a valid email so the city intel lands in the right inbox.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setNewsletterStatus(payload.error || "Could not subscribe right now. Try again in a minute.");
        return;
      }

      setNewsletterEmail("");
      setNewsletterStatus("You are on the CityMitra list. Clean city intel, no spam parade.");
      trackActivity({ type: "newsletter_subscribe", city, category, label: email.split("@")[1] });
    } catch {
      setNewsletterStatus("Could not reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="siteFooter">
      <div className="footerTopGlow" aria-hidden="true" />
      <div className="footerGrid">
        <div className="footerBrand">
          <Link className="brand" href="/" aria-label="CityMitra home">
            <span className="brandMark">
              <Navigation size={18} />
            </span>
            CityMitra
          </Link>
          <p>AI city navigation for Indian commerce, travel, services, and everyday decisions.</p>
          <div className="socialLinks" aria-label="Social links">
            <a href={socialProfiles.x} target="_blank" rel="noreferrer" aria-label="X (Twitter)">X</a>
            <a href={socialProfiles.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={17} />
            </a>
            <a href={socialProfiles.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin size={17} />
            </a>
            <a href={socialProfiles.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <WhatsAppIcon size={17} />
            </a>
          </div>
        </div>

        {footerColumns.map((column) => (
          <div className="footerLinks" key={column.title}>
            <h3>{column.title}</h3>
            {column.links.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        ))}

        <div className="newsletterCard">
          <h3>Subscribe to the city brief</h3>
          <p>Get launch updates, city intelligence, and vendor roadmap notes.</p>
          <form onSubmit={subscribeNewsletter}>
            <label htmlFor="newsletterEmail">
              <Mail size={16} />
              Email
            </label>
            <div>
              <input
                id="newsletterEmail"
                onChange={(event) => setNewsletterEmail(event.target.value)}
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                value={newsletterEmail}
              />
              <button type="submit" aria-label="Subscribe" disabled={submitting}>
                <Send size={16} />
              </button>
            </div>
          </form>
          {newsletterStatus && <strong>{newsletterStatus}</strong>}
        </div>
      </div>

      <div className="footerPrivacy">
        <p>
          CityMitra records lightweight activity such as page views, city/category choices, map opens, and chat
          intent to improve recommendations and admin analytics. Read the full <a href="/privacy">Privacy Policy</a>.
        </p>
      </div>

      <div className="footerBottom">
        <span>© {new Date().getFullYear()} CityMitra. All rights reserved.</span>
        <a className="backToTop" href="#" aria-label="Back to top">
          Back to top <ArrowUp size={15} />
        </a>
      </div>

      <div className="footerWatermark" aria-hidden="true">
        CITYMITRA
      </div>
    </footer>
  );
}
