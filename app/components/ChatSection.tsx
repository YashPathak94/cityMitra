"use client";

import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  Copy,
  FileText,
  Search,
  Sparkles,
  Table,
  Trash2
} from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { CategoryKey } from "@/data/city-directory";
import { detectCityFromMessage, NearbyCard, UserLocation } from "@/lib/city-intel";
import { downloadCsvPlan, openPdfPlan, PlanExportContext } from "@/lib/export-plan";
import { trackActivity } from "@/lib/tracking";
import MarkdownText from "@/app/components/MarkdownText";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const starterMessage =
  "Tell me the city, vibe, budget, and time you have. I will map the spots, backup services, and time-saving route. Yes, an actual plan, not a 47-tab research spiral.";

const quickPrompts = [
  "Plan Leh for 3 days with route table",
  "Prayagraj hotels and food",
  "Ayodhya trip planner",
  "Tell me about Indore food",
  "Darjeeling route planner",
  "Shillong cafes and viewpoints",
  "Best dinner under 45 minutes",
  "Shopping plus hospital backup",
  "Petrol and repair before a road trip"
];

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
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

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
    const detectedCity = detectCityFromMessage(trimmedQuestion);
    const activeCity = detectedCity || city;

    if (detectedCity && detectedCity !== city) {
      onCityDetected(detectedCity);
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

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmedQuestion,
          city: activeCity,
          category,
          messages: nextMessages.slice(0, -1)
        })
      });

      if (!response.body) {
        const fallbackText = await response.text();
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
    } catch {
      setMessages((current) =>
        current.map((message, index) =>
          index === current.length - 1
            ? { ...message, content: "CityMitra is offline right now. Try again once the server is running." }
            : message
        )
      );
    } finally {
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
              OpenAI-ready
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
          <div className="quickPrompts">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  setQuestion(prompt);
                  trackActivity({ type: "quick_prompt", city, category, label: prompt });
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
                  placeholder="Ask anything city-related. Press Enter to send, Shift+Enter for a new line."
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
    </section>
  );
}
