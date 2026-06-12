"use client";

import { ArrowUp, Instagram, Linkedin, Mail, Navigation, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { CategoryKey } from "@/data/city-directory";
import { trackActivity } from "@/lib/tracking";

const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "Directory", href: "#directory" },
      { label: "AI Guide", href: "#ai" },
      { label: "Nearby Picks", href: "#ai" },
      { label: "City Photos", href: "#top" }
    ]
  },
  {
    title: "Business",
    links: [
      { label: "Monetize", href: "#monetize" },
      { label: "Roadmap", href: "#coverage" },
      { label: "Featured Listings", href: "#monetize" },
      { label: "Sponsorships", href: "#monetize" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Contact", href: "mailto:hello@citymitra.in" }
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

  function subscribeNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = newsletterEmail.trim();

    if (!email || !email.includes("@")) {
      setNewsletterStatus("Drop a valid email so the city intel lands in the right inbox.");
      return;
    }

    setNewsletterEmail("");
    setNewsletterStatus("You are on the CityMitra list. Clean city intel, no spam parade.");
    trackActivity({ type: "newsletter_subscribe", city, category, label: email.split("@")[1] });
  }

  return (
    <footer className="siteFooter">
      <div className="footerTopGlow" aria-hidden="true" />
      <div className="footerGrid">
        <div className="footerBrand">
          <a className="brand" href="#top" aria-label="CityMitra home">
            <span className="brandMark">
              <Navigation size={18} />
            </span>
            CityMitra
          </a>
          <p>AI city navigation for Indian commerce, travel, services, and everyday decisions.</p>
          <div className="socialLinks" aria-label="Social links">
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X (Twitter)">X</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={17} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin size={17} />
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
                value={newsletterEmail}
              />
              <button type="submit" aria-label="Subscribe">
                <Send size={16} />
              </button>
            </div>
          </form>
          {newsletterStatus && <strong>{newsletterStatus}</strong>}
        </div>
      </div>

      <div className="footerPrivacy" id="privacy">
        <p>
          CityMitra records lightweight activity such as page views, city/category choices, map opens, and chat
          intent to improve recommendations and admin analytics. Admin analytics are protected behind login.
        </p>
      </div>

      <div className="footerBottom">
        <span>© {new Date().getFullYear()} CityMitra. All rights reserved.</span>
        <a className="backToTop" href="#top" aria-label="Back to top">
          Back to top <ArrowUp size={15} />
        </a>
      </div>

      <div className="footerWatermark" aria-hidden="true">
        CITYMITRA
      </div>
    </footer>
  );
}
