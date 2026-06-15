"use client";

import {
  ArrowRight,
  BedDouble,
  Bot,
  Car,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  Copy,
  FileText,
  Plane,
  Search,
  Sparkles,
  Stethoscope,
  Table,
  TrainFront,
  Trash2,
  UtensilsCrossed
} from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { CategoryKey } from "@/data/city-directory";
import { detectKnownCity, NearbyCard, UserLocation } from "@/lib/city-intel";
import { buildBookingOptions, buildConcierge, BookingCategory, bookingCategoryLabels, categoryToBooking, detectBookingIntents } from "@/lib/booking";
import { downloadCsvPlan, openPdfPlan, PlanExportContext } from "@/lib/export-plan";
import { trackActivity } from "@/lib/tracking";
import MarkdownText from "@/app/components/MarkdownText";
import { ConciergeGroup } from "@/app/components/ConciergeCard";
import ConciergePip from "@/app/components/ConciergePip";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const starterMessage =
  "Tell me the city, vibe, budget, and time you have. I will map the spots, backup services, and time-saving route. Yes, an actual plan, not a 47-tab research spiral.";

const actionChips: Array<{ category: BookingCategory; label: string; icon: typeof Plane }> = [
  { category: "hotels", label: "Book hotels", icon: BedDouble },
  { category: "flights", label: "Book flights", icon: Plane },
  { category: "trains", label: "Book trains", icon: TrainFront },
  { category: "food", label: "Reserve a table", icon: UtensilsCrossed },
  { category: "cabs", label: "Book a cab", icon: Car },
  { category: "doctor", label: "Doctor visit", icon: Stethoscope }
];

const planPrompts = ["Make a 1-day plan", "Weekend trip", "Hidden gems", "Budget plan"];

const chatPlaceholder =
  "Plan a Leh trip with places, altitude, hospitals, petrol, repairs, hotels and shopping.";

type ChatSectionProps = {
  city: string;
  category: CategoryKey;
  categoryLabel: string;
  question: string;
  setQuestion: (value: string) => void;
  userLocation: UserLocation | null;
  cityVisual: { image: string; label: string; position: string };
  nearbyCards: NearbyCard[];
  generatedCategoryResults: NearbyCard[];
  onCityDetected: (city: string) => void;
  nearbyPanel: React.ReactNode;
};

export default function ChatSection({
  city,
  category,
  categoryLabel,
  question,
  setQuestion,
  userLocation,
  cityVisual,
  nearbyCards,
  generatedCategoryResults,
  onCityDetected,
  nearbyPanel
}: ChatSectionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: starterMessage }]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [recommended, setRecommended] = useState<BookingCategory[]>([]);
  const [pipGroups, setPipGroups] = useState<ConciergeGroup[] | null>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const autoPromptRef = useRef("");
  const prevCategoryRef = useRef(category);
  const initialisedRef = useRef(false);

  // Order chips so the selected category's match comes first, then anything the
  // user just asked about (recommended), then the rest.
  const orderedChips = useMemo(() => {
    const primary = categoryToBooking[category];
    const priority = new Set<BookingCategory>([...(primary ? [primary] : []), ...recommended]);
    return [...actionChips].sort((a, b) => {
      const aScore = priority.has(a.category) ? 0 : 1;
      const bScore = priority.has(b.category) ? 0 : 1;
      return aScore - bScore;
    });
  }, [category, recommended]);

  // On city/category change: combine them into one smart prompt (unless the user
  // typed their own), and auto-open the most relevant concierge when a mapped
  // category is selected. The first render is skipped so the box starts empty and
  // shows the example watermark.
  useEffect(() => {
    const categoryChanged = prevCategoryRef.current !== category;
    prevCategoryRef.current = category;

    if (!initialisedRef.current) {
      initialisedRef.current = true;
      return;
    }

    const smartPrompt = `Plan ${categoryLabel.toLowerCase()} in ${city}: top picks, timings, and a quick route`;
    if (question === "" || question === autoPromptRef.current) {
      autoPromptRef.current = smartPrompt;
      setQuestion(smartPrompt);
    }

    if (categoryChanged) {
      const booking = categoryToBooking[category];
      if (booking) openConciergeFor(booking);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, category]);

  const hasConversation = messages.some((message) => message.role === "user");
  const followUps = hasConversation
    ? [
        `Turn this into a 1-day ${city} route`,
        `Best time and budget for ${categoryLabel.toLowerCase()} in ${city}`,
        `Add food and backup stops near ${city}`,
        "Make a printable route table"
      ]
    : [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  function latestAssistantPlan() {
    return [...messages].reverse().find((message) => message.role === "assistant" && message.content.trim())?.content || starterMessage;
  }

  function clearChat() {
    setMessages([{ role: "assistant", content: starterMessage }]);
    setQuestion("");
    trackActivity({ type: "chat_clear", city, category });
  }

  // Instant, no-AI-call action: open the concierge as a dismissible
  // picture-in-picture panel (not a chat message).
  function openConciergeFor(bookingCategory: BookingCategory) {
    const options = buildBookingOptions(bookingCategory, { city, destination: city });
    if (options.length === 0) return;

    setPipGroups([{ category: bookingCategory, label: bookingCategoryLabels[bookingCategory], options }]);
    trackActivity({ type: "concierge_quick_action", city, category, label: bookingCategory });
  }

  function scrollChat(position: "top" | "bottom") {
    const chatWindow = chatWindowRef.current;
    if (!chatWindow) return;

    chatWindow.scrollTo({
      top: position === "top" ? 0 : chatWindow.scrollHeight,
      behavior: "smooth"
    });
  }

  async function copyAnswer(content: string, index: number) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 1600);
    } catch {
      setCopiedIndex(null);
    }
  }

  function exportContext(): PlanExportContext {
    return {
      city,
      category,
      categoryLabel,
      cityVisual,
      userLocation,
      nearbyCards,
      generatedCategoryResults,
      plan: latestAssistantPlan()
    };
  }

  function handlePdfExport() {
    trackActivity({ type: "export_pdf", city, category });
    openPdfPlan(exportContext());
  }

  function handleCsvExport() {
    trackActivity({ type: "export_csv", city, category });
    downloadCsvPlan(exportContext());
  }

  async function askGuide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitQuestion(question);
  }

  async function submitQuestion(value: string) {
    const trimmedQuestion = value.trim();
    if (!trimmedQuestion || loading) return;
    // Only switch city when the message names a real known city, so commands
    // like "plan a trip" never swap the selected city or background image.
    const detectedCity = detectKnownCity(trimmedQuestion);
    const activeCity = detectedCity || city;

    if (detectedCity && detectedCity !== city) {
      onCityDetected(detectedCity);
    }

    const conciergeGroups = buildConcierge(trimmedQuestion, {
      city: activeCity,
      destination: activeCity
    });
    const detectedIntents = detectBookingIntents(trimmedQuestion);
    if (detectedIntents.length > 0) {
      setRecommended(detectedIntents);
    }
    // Surface booking options in the picture-in-picture panel, not the chat thread.
    if (conciergeGroups.length > 0) {
      setPipGroups(conciergeGroups);
    }

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmedQuestion },
      { role: "assistant", content: "" }
    ];

    setLoading(true);
    setQuestion("");
    setMessages(nextMessages);
    trackActivity({ type: "chat_submit", city: activeCity, category, label: trimmedQuestion.slice(0, 80) });

    // Abort if the server stalls, so the chat never gets stuck spinning.
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          question: trimmedQuestion,
          city: activeCity,
          category,
          messages: nextMessages.slice(0, -1)
        })
      });

      if (!response.ok || !response.body) {
        const fallbackText = (await response.text().catch(() => "")) || "CityMitra is busy right now. Please try again in a moment.";
        setMessages((current) =>
          current.map((message, index) =>
            index === current.length - 1 ? { ...message, content: fallbackText } : message
          )
        );
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedAnswer = "";

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        const partialAnswer = streamedAnswer + decoder.decode(chunk, { stream: true });
        streamedAnswer = partialAnswer;
        setMessages((current) =>
          current.map((message, index) =>
            index === current.length - 1 ? { ...message, content: partialAnswer } : message
          )
        );
      }

      const finalAnswer = streamedAnswer + decoder.decode();
      setMessages((current) =>
        current.map((message, index) =>
          index === current.length - 1
            ? { ...message, content: finalAnswer || "CityMitra could not answer that yet." }
            : message
        )
      );
    } catch (error) {
      const aborted = error instanceof DOMException && error.name === "AbortError";
      setMessages((current) =>
        current.map((message, index) =>
          index === current.length - 1
            ? {
                ...message,
                content: aborted
                  ? "That took too long, so I stopped waiting. Please try again."
                  : "CityMitra is offline right now. Try again once the server is running."
              }
            : message
        )
      );
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
    }
  }

  function handleQuestionKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <section className="aiBand" id="ai">
      <div className="aiPanel">
        <div className="aiIntro">
          <span className="sectionKicker">AI Agent</span>
          <h2>Ask CityMitra before you leave</h2>
          <p>
            A clean city chat for trip plans, market runs, hospitals, fuel stops, hotels, repairs, food, and quick
            backup options when your plan changes.
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
        </div>

        <form className="askBox" onSubmit={askGuide}>
          <div className="chatHeader">
            <div>
              <span className="liveDot" />
              <label htmlFor="question">Ask about {categoryLabel.toLowerCase()} in {city}</label>
            </div>
            <div className="chatHeaderActions">
              <strong>{loading ? "Planning live" : "Ready"}</strong>
              <button className="iconButton" type="button" onClick={clearChat} title="Clear chat" aria-label="Clear chat">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="actionChips" aria-label={`Quick actions for ${city}`}>
            {orderedChips.map((chip) => {
              const Icon = chip.icon;
              const isPrimary = categoryToBooking[category] === chip.category || recommended.includes(chip.category);
              return (
                <button
                  key={chip.category}
                  type="button"
                  className={isPrimary ? "actionChip recommended" : "actionChip"}
                  onClick={() => openConciergeFor(chip.category)}
                >
                  <Icon size={15} />
                  {chip.label}
                </button>
              );
            })}
          </div>
          <div className="quickPrompts">
            {planPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  const fullPrompt = `${prompt} for ${city}`;
                  setQuestion(fullPrompt);
                  trackActivity({ type: "quick_prompt", city, category, label: fullPrompt });
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="chatMapGrid">
            <div className="chatColumn">
              <div className="exportBar">
                <button type="button" onClick={handlePdfExport}>
                  <FileText size={15} />
                  PDF
                </button>
                <button type="button" onClick={handleCsvExport}>
                  <Table size={15} />
                  Excel
                </button>
                <button type="button" onClick={() => scrollChat("top")} title="Scroll chat up" aria-label="Scroll chat up">
                  <ChevronUp size={15} />
                </button>
                <button type="button" onClick={() => scrollChat("bottom")} title="Scroll chat down" aria-label="Scroll chat down">
                  <ChevronDown size={15} />
                </button>
              </div>
              <div className="chatWindow" ref={chatWindowRef} aria-live="polite">
                {messages.map((message, index) => (
                  <div className={message.role === "user" ? "chatBubble userBubble" : "chatBubble assistantBubble"} key={index}>
                    <span>{message.role === "user" ? "You" : "CityMitra"}</span>
                    {message.role === "assistant" && message.content ? (
                      <>
                        <MarkdownText content={message.content} />
                        {index > 0 && !(loading && index === messages.length - 1) && (
                          <button
                            className="copyAnswer"
                            type="button"
                            onClick={() => copyAnswer(message.content, index)}
                            aria-label="Copy answer"
                          >
                            {copiedIndex === index ? <Check size={13} /> : <Copy size={13} />}
                            {copiedIndex === index ? "Copied" : "Copy"}
                          </button>
                        )}
                      </>
                    ) : (
                      <p>{message.content || "Thinking..."}</p>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="typingRow" aria-label="CityMitra is typing">
                    <i />
                    <i />
                    <i />
                  </div>
                )}
                {!loading && followUps.length > 0 && (
                  <div className="followUps" aria-label="Suggested follow-up questions">
                    <span>
                      <Sparkles size={13} />
                      Keep planning
                    </span>
                    {followUps.map((followUp) => (
                      <button key={followUp} type="button" onClick={() => submitQuestion(followUp)}>
                        {followUp}
                      </button>
                    ))}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="composerRow">
                <textarea
                  id="question"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={handleQuestionKeyDown}
                  placeholder={chatPlaceholder}
                />
                <button className="primaryButton" disabled={loading} type="submit">
                  {loading ? "Mapping..." : "Send"} <ArrowRight size={18} />
                </button>
              </div>

              <span className="inputHint">Enter sends. Shift+Enter adds a new line.</span>
            </div>

            {nearbyPanel}
          </div>
        </form>
      </div>

      <ConciergePip
        groups={pipGroups}
        city={city}
        onClose={() => setPipGroups(null)}
        onOpen={(provider, bookingCategory) =>
          trackActivity({ type: "concierge_open", city, category, label: `${bookingCategory}:${provider}` })
        }
      />
    </section>
  );
}
