"use client";

import { Instagram, Linkedin, Mail, Navigation, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { CategoryKey } from "@/data/city-directory";
import { trackActivity } from "@/lib/tracking";

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
            <a href="https://x.com" target="_blank" rel="noreferrer">X</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={17} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin size={17} />
            </a>
          </div>
        </div>

        <div className="footerLinks">
          <h3>Explore</h3>
          <a href="#directory">Directory</a>
          <a href="#ai">AI Guide</a>
          <a href="#monetize">Monetize</a>
          <a href="#coverage">Roadmap</a>
        </div>

        <div className="footerPrivacy" id="privacy">
          <h3>Privacy Policy</h3>
          <p>
            CityMitra records lightweight activity such as page views, city/category choices, map opens, and chat
            intent to improve recommendations and admin analytics. Admin analytics are protected behind login.
          </p>
        </div>

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
      <div className="footerBottom">
        <span>© {new Date().getFullYear()} CityMitra. All rights reserved.</span>
        <a href="#privacy">Privacy Policy</a>
      </div>
    </footer>
  );
}
