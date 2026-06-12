import { Building2, Sparkles } from "lucide-react";

export function MonetizeSection() {
  return (
    <section className="monetizeBand" id="monetize">
      <div className="sectionHeader">
        <div>
          <span className="sectionKicker">Revenue Engine</span>
          <h2>Monetize local intent without making the app noisy</h2>
        </div>
        <p>Keep the user experience minimal, then charge businesses for useful placement, trust, and analytics.</p>
      </div>
      <div className="monetizeGrid">
        {[
          ["Featured listings", "Shopkeepers pay for verified placement, photos, offers, and peak-hour visibility."],
          ["Lead routing", "Hotels, repair shops, clinics, and stores receive qualified clicks from high-intent searches."],
          ["Vendor dashboard", "Paid partners track views, map opens, category demand, and chat-driven leads."],
          ["City sponsorships", "Local brands sponsor categories like food trails, shopping routes, and travel plans."]
        ].map(([title, text], index) => (
          <article key={title}>
            <span>{index + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CoverageSection() {
  return (
    <section className="coverage" id="coverage">
      <div className="sectionHeader">
        <div>
          <span className="sectionKicker">Launch Roadmap</span>
          <h2>From directory to city operating layer</h2>
        </div>
      </div>
      <div className="roadmap">
        {[
          ["Verified listings", "Shopkeeper volume, specialties, hours, photos, phone, price band, and trust score."],
          ["Live navigation", "Map links, nearby parking, metro access, wait time, and route safety notes."],
          ["Vendor dashboard", "Owners can claim listings, update stock, offers, peak hours, and service availability."],
          ["Agent network", "Specialized agents for shopping, healthcare, food, education, repairs, and tourism."]
        ].map(([title, text]) => (
          <article key={title}>
            <Building2 size={20} />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section className="aboutBand" id="about">
      <div className="aboutGrid">
        <div>
          <span className="sectionKicker">About CityMitra</span>
          <h2>Built to make Indian city decisions faster, cleaner, and less chaotic</h2>
          <p>
            CityMitra is an AI-assisted city companion for shopping streets, wholesale markets, hospitals, hotels,
            food trails, vehicle support, schools, malls, play arenas, and sightseeing. The goal is simple: help
            people choose where to go, what to expect, and what backup options sit nearby before they leave.
          </p>
        </div>
        <div className="aboutCards">
          {[
            ["Human intent", "Search by city, category, or plain chat. CityMitra syncs the interface around the user."],
            ["Map-first actions", "Every suggestion points toward maps, routes, photos, and useful nearby fallbacks."],
            ["Business ready", "The platform is shaped for verified listings, paid placement, and privacy-aware analytics."]
          ].map(([title, text]) => (
            <article key={title}>
              <Sparkles size={18} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
