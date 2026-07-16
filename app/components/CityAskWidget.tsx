"use client";

import { ArrowUp, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { trackActivity } from "@/lib/tracking";

type CityAskWidgetProps = {
  city?: string;
  /** Overrides the default suggestion pills. */
  suggestions?: string[];
};

// "Discover your perfect {city}" — an ask-anything strip that deep-links into
// City Chat with the question prefilled (?q= is picked up by ChatWorkspace).
export default function CityAskWidget({ city = "your city", suggestions }: CityAskWidgetProps) {
  const router = useRouter();
  const [question, setQuestion] = useState("");

  const pills =
    suggestions && suggestions.length
      ? suggestions
      : [
          `Boutique hotels with city views in ${city}`,
          `Food tour with local cuisine in ${city}`,
          `Day trips under 2 hours from ${city}`
        ];

  function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    trackActivity({ type: "open_chat", city, category: "markets", label: "ask_widget" });
    router.push(`/chat?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <section className="cityAsk" aria-label={`Ask CityMitra about ${city}`}>
      <h3>
        <Sparkles size={17} /> Discover your perfect {city}
      </h3>
      <p>Looking for places to stay, eat, or explore?</p>
      <form
        className="cityAskInput"
        onSubmit={(event) => {
          event.preventDefault();
          ask(question);
        }}
      >
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask anything"
          aria-label={`Ask anything about ${city}`}
        />
        <button type="submit" aria-label="Ask CityMitra" disabled={!question.trim()}>
          <ArrowUp size={17} />
        </button>
      </form>
      <div className="cityAskPills">
        {pills.map((pill) => (
          <button key={pill} type="button" onClick={() => ask(pill)}>
            {pill}
          </button>
        ))}
      </div>
    </section>
  );
}
