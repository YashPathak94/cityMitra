"use client";

import {
  BadgeCheck,
  Bot,
  Building2,
  Compass,
  HandCoins,
  LayoutDashboard,
  MapPinned,
  Megaphone,
  Sparkles,
  Store
} from "lucide-react";
import Reveal from "@/app/components/motion/Reveal";

const monetizeCards = [
  {
    icon: Store,
    title: "Featured listings",
    text: "Shopkeepers pay for verified placement, photos, offers, and peak-hour visibility."
  },
  {
    icon: Megaphone,
    title: "Lead routing",
    text: "Hotels, repair shops, clinics, and stores receive qualified clicks from high-intent searches."
  },
  {
    icon: LayoutDashboard,
    title: "Vendor dashboard",
    text: "Paid partners track views, map opens, category demand, and chat-driven leads."
  },
  {
    icon: HandCoins,
    title: "City sponsorships",
    text: "Local brands sponsor categories like food trails, shopping routes, and travel plans."
  }
];

export function MonetizeSection() {
  return (
    <section className="monetizeBand" id="monetize">
      <Reveal>
        <div className="sectionHeader">
          <div>
            <span className="sectionKicker">Revenue Engine</span>
            <h2>Monetize local intent without making the app noisy</h2>
          </div>
          <p>Keep the user experience minimal, then charge businesses for useful placement, trust, and analytics.</p>
        </div>
      </Reveal>
      <div className="monetizeGrid bentoGrid">
        {monetizeCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Reveal key={card.title} delay={index * 0.07}>
              <article className="bentoCard">
                <span className="bentoIcon">
                  <Icon size={19} />
                </span>
                <span className="bentoIndex">{String(index + 1).padStart(2, "0")}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

const roadmapCards = [
  {
    icon: BadgeCheck,
    title: "Verified listings",
    text: "Shopkeeper volume, specialties, hours, photos, phone, price band, and trust score."
  },
  {
    icon: MapPinned,
    title: "Live navigation",
    text: "Map links, nearby parking, metro access, wait time, and route safety notes."
  },
  {
    icon: Building2,
    title: "Vendor dashboard",
    text: "Owners can claim listings, update stock, offers, peak hours, and service availability."
  },
  {
    icon: Bot,
    title: "Agent network",
    text: "Specialized agents for shopping, healthcare, food, education, repairs, and tourism."
  }
];

export function CoverageSection() {
  return (
    <section className="coverage" id="coverage">
      <Reveal>
        <div className="sectionHeader">
          <div>
            <span className="sectionKicker">Launch Roadmap</span>
            <h2>From directory to city operating layer</h2>
          </div>
        </div>
      </Reveal>
      <div className="roadmap bentoGrid">
        {roadmapCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Reveal key={card.title} delay={index * 0.07}>
              <article className="bentoCard">
                <span className="bentoIcon">
                  <Icon size={19} />
                </span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

const aboutCards = [
  {
    icon: Compass,
    title: "Human intent",
    text: "Search by city, category, or plain chat. CityMitra syncs the interface around the user."
  },
  {
    icon: MapPinned,
    title: "Map-first actions",
    text: "Every suggestion points toward maps, routes, photos, and useful nearby fallbacks."
  },
  {
    icon: Sparkles,
    title: "Business ready",
    text: "The platform is shaped for verified listings, paid placement, and privacy-aware analytics."
  }
];

export function AboutSection() {
  return (
    <section className="aboutBand" id="about">
      <div className="aboutGrid">
        <Reveal>
          <div>
            <span className="sectionKicker">About CityMitra</span>
            <h2>Built to make Indian city decisions faster, cleaner, and less chaotic</h2>
            <p>
              CityMitra is an AI-assisted city companion for shopping streets, wholesale markets, hospitals, hotels,
              food trails, vehicle support, schools, malls, play arenas, and sightseeing. The goal is simple: help
              people choose where to go, what to expect, and what backup options sit nearby before they leave.
            </p>
          </div>
        </Reveal>
        <div className="aboutCards">
          {aboutCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={index * 0.08}>
                <article className="bentoCard">
                  <span className="bentoIcon">
                    <Icon size={18} />
                  </span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
