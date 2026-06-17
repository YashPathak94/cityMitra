"use client";

import Link from "next/link";
import { ArrowRight, Bot, Compass, MessageSquarePlus, Search, Sparkles } from "lucide-react";
import { CategoryKey } from "@/data/city-directory";
import { trackActivity } from "@/lib/tracking";

type AiTeaserProps = {
  city: string;
  category: CategoryKey;
  categoryLabel: string;
  nearbyPanel: React.ReactNode;
};

export default function AiTeaser({ city, category, categoryLabel, nearbyPanel }: AiTeaserProps) {
  const prompts = [
    `Plan a 2-day trip to ${city}`,
    `Best ${categoryLabel.toLowerCase()} in ${city}`,
    `${city} food and hidden gems`,
    "Hotels, cabs and bookings"
  ];

  function chatHref(prompt?: string) {
    return prompt ? `/chat?q=${encodeURIComponent(prompt)}` : "/chat";
  }

  return (
    <section className="aiBand" id="ai">
      <div className="aiPanel">
        <div className="aiIntro">
          <span className="sectionKicker">AI Assistant</span>
          <h2>Ask CityMitra before you leave</h2>
          <p>
            A focused city assistant for trip plans, market runs, hospitals, fuel stops, hotels, repairs, food, and
            quick backups when plans change — with one-tap bookings and saved conversations.
          </p>
          <div className="agentStack">
            <span>
              <Search size={16} />
              Intent finder
            </span>
            <span>
              <Compass size={16} />
              Route planner
            </span>
            <span>
              <Bot size={16} />
              Booking concierge
            </span>
          </div>
          <Link className="primaryButton" href={chatHref()} onClick={() => trackActivity({ type: "open_chat", city, category, label: "intro" })}>
            <MessageSquarePlus size={18} />
            Open the AI Assistant
          </Link>
        </div>

        <div className="aiTeaserGrid">
          <div className="aiTeaserCard">
            <div className="aiTeaserPreview">
              <div className="aiTeaserBubble assistant">
                <span><Sparkles size={13} /> CityMitra</span>
                <p>Tell me a city and what you need — I’ll map the spots, routes, and backups, then offer one-tap bookings.</p>
              </div>
              <div className="aiTeaserBubble user">
                <p>Plan a weekend in {city}</p>
              </div>
            </div>

            <div className="aiTeaserPrompts">
              {prompts.map((prompt) => (
                <Link
                  key={prompt}
                  href={chatHref(prompt)}
                  onClick={() => trackActivity({ type: "open_chat", city, category, label: prompt })}
                >
                  {prompt}
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>

            <Link className="aiTeaserCta" href={chatHref()} onClick={() => trackActivity({ type: "open_chat", city, category, label: "cta" })}>
              Start chatting — it’s saved for you <ArrowRight size={16} />
            </Link>
          </div>

          {nearbyPanel}
        </div>
      </div>
    </section>
  );
}
