"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowUp,
  Crown,
  LogIn,
  LogOut,
  Menu,
  MessageSquarePlus,
  Navigation,
  PanelLeftClose,
  Sparkles,
  Trash2,
  X
} from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { buildConcierge } from "@/lib/booking";
import { categories } from "@/data/city-directory";
import { buildGeneratedResults, detectCategoryFromText, detectKnownCity } from "@/lib/city-intel";
import {
  Conversation,
  deriveTitle,
  getActiveId,
  loadConversations,
  mergeConversations,
  newConversationId,
  saveConversations,
  setActiveId,
  StoredMessage
} from "@/lib/conversations";
import { trackActivity } from "@/lib/tracking";
import MarkdownText from "@/app/components/MarkdownText";
import ConciergePip from "@/app/components/ConciergePip";
import { ConciergeGroup } from "@/app/components/ConciergeCard";

const starter: StoredMessage = {
  role: "assistant",
  content:
    "Hi! I'm your CityMitra assistant. Tell me a city, your vibe, budget, and time — I'll map the spots, routes, and backup options. Try **\"Plan a 2-day Jaipur trip\"** or **\"best street food in Indore\"**."
};

const suggestions = [
  "Plan a 2-day Jaipur trip",
  "Best street food in Indore",
  "Leh road-trip checklist",
  "Wholesale markets in Delhi"
];

type LocalPicks = { label: string; city: string; items: Array<{ name: string; area: string; query: string }> };

function freshConversation(): Conversation {
  return { id: newConversationId(), title: "New chat", messages: [starter], updatedAt: new Date().toISOString() };
}

// Builds curated local picks (e.g. wholesale markets, saree shops) for the
// detected category + city, shown in the concierge alongside booking links.
function buildLocalPicks(text: string, cityName: string): LocalPicks | null {
  const categoryKey = detectCategoryFromText(text);
  if (!categoryKey) return null;
  const label = categories.find((item) => item.key === categoryKey)?.label || "Top picks";
  const items = buildGeneratedResults(cityName, categoryKey, 12).map((result) => ({
    name: result.name,
    area: result.area,
    query: result.query
  }));
  return items.length ? { label, city: cityName, items } : null;
}

export default function ChatWorkspace() {
  const router = useRouter();
  const params = useSearchParams();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActive] = useState<string>("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<{ email: string; isPro: boolean } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pip, setPip] = useState<{ groups: ConciergeGroup[]; local: LocalPicks | null } | null>(null);
  const [city, setCity] = useState("Delhi");

  const endRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef(false);
  const signedIn = Boolean(account);

  const active = conversations.find((convo) => convo.id === activeId) || null;
  const messages = active?.messages ?? [starter];

  // Initial load: local first, then merge server history when signed in.
  useEffect(() => {
    const local = loadConversations();
    let initial = local.length ? local : [freshConversation()];
    let startId = getActiveId() && initial.some((c) => c.id === getActiveId()) ? (getActiveId() as string) : initial[0].id;

    setConversations(initial);
    setActive(startId);

    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then(async (data: { user: { email: string; isPro: boolean } | null }) => {
        if (!data.user) return;
        setAccount({ email: data.user.email, isPro: Boolean(data.user.isPro) });
        const remoteResponse = await fetch("/api/chat/conversations", { cache: "no-store" });
        const remote = (await remoteResponse.json().catch(() => ({ conversations: [] }))) as { conversations: Conversation[] };
        if (remote.conversations?.length) {
          initial = mergeConversations(initial, remote.conversations);
          setConversations(initial);
          saveConversations(initial);
        }
      })
      .catch(() => undefined);

    // Prefill from ?q= (home teaser deep-link) into a fresh chat.
    const prefill = params.get("q");
    if (prefill && !seededRef.current) {
      seededRef.current = true;
      const convo = freshConversation();
      initial = [convo, ...initial];
      startId = convo.id;
      setConversations(initial);
      setActive(startId);
      setInput(prefill);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  function persist(next: Conversation[], changed?: Conversation) {
    setConversations(next);
    saveConversations(next);
    if (signedIn && changed) {
      fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changed)
      }).catch(() => undefined);
    }
  }

  function startNewChat() {
    const convo = freshConversation();
    const next = [convo, ...conversations];
    setActive(convo.id);
    setActiveId(convo.id);
    persist(next);
    setSidebarOpen(false);
    setInput("");
  }

  function openConversation(id: string) {
    setActive(id);
    setActiveId(id);
    setSidebarOpen(false);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    setAccount(null);
  }

  async function removeConversation(id: string) {
    const next = conversations.filter((convo) => convo.id !== id);
    const safeNext = next.length ? next : [freshConversation()];
    persist(safeNext);
    if (id === activeId) {
      setActive(safeNext[0].id);
      setActiveId(safeNext[0].id);
    }
    if (signedIn) {
      fetch(`/api/chat/conversations?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => undefined);
    }
  }

  function updateActive(updater: (messages: StoredMessage[]) => StoredMessage[]) {
    setConversations((current) =>
      current.map((convo) =>
        convo.id === activeId
          ? { ...convo, messages: updater(convo.messages), updatedAt: new Date().toISOString() }
          : convo
      )
    );
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    let convoId = activeId;
    if (!active) {
      const convo = freshConversation();
      convoId = convo.id;
      setConversations((current) => [convo, ...current]);
      setActive(convo.id);
      setActiveId(convo.id);
    }

    const detected = detectKnownCity(trimmed);
    if (detected) setCity(detected);
    const activeCity = detected || city;

    const groups = buildConcierge(trimmed, { city: activeCity, destination: activeCity });
    const local = buildLocalPicks(trimmed, activeCity);
    if (groups.length || local) setPip({ groups, local });

    const history = conversations.find((c) => c.id === convoId)?.messages ?? [starter];
    const withUser: StoredMessage[] = [...history, { role: "user", content: trimmed }, { role: "assistant", content: "" }];

    setConversations((current) =>
      current.map((convo) =>
        convo.id === convoId
          ? { ...convo, title: convo.title === "New chat" ? deriveTitle(withUser) : convo.title, messages: withUser, updatedAt: new Date().toISOString() }
          : convo
      )
    );
    setInput("");
    setLoading(true);
    trackActivity({ type: "chat_submit", city: detected || city, label: trimmed.slice(0, 80) });

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ question: trimmed, city: detected || city, messages: history })
      });

      if (!response.ok || !response.body) {
        const fallback = (await response.text().catch(() => "")) || "CityMitra is busy right now. Please try again.";
        finalizeAssistant(convoId, fallback);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        const current = answer;
        setConversations((list) =>
          list.map((convo) =>
            convo.id === convoId
              ? { ...convo, messages: convo.messages.map((m, i) => (i === convo.messages.length - 1 ? { ...m, content: current } : m)) }
              : convo
          )
        );
      }
      finalizeAssistant(convoId, answer + decoder.decode() || "CityMitra could not answer that yet.");
    } catch (error) {
      const aborted = error instanceof DOMException && error.name === "AbortError";
      finalizeAssistant(convoId, aborted ? "That took too long, so I stopped waiting. Please try again." : "CityMitra is offline right now. Try again shortly.");
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
    }
  }

  function finalizeAssistant(convoId: string, content: string) {
    setConversations((current) => {
      const next = current.map((convo) =>
        convo.id === convoId
          ? {
              ...convo,
              messages: convo.messages.map((m, i) => (i === convo.messages.length - 1 ? { ...m, content } : m)),
              updatedAt: new Date().toISOString()
            }
          : convo
      );
      saveConversations(next);
      const changed = next.find((c) => c.id === convoId);
      if (signedIn && changed) {
        fetch("/api/chat/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(changed)
        }).catch(() => undefined);
      }
      return next;
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send(input);
    }
  }

  const showEmpty = messages.length <= 1;

  return (
    <div className="chatApp">
      <aside className={sidebarOpen ? "chatSidebar open" : "chatSidebar"}>
        <div className="chatSidebarTop">
          <Link className="chatBrand" href="/">
            <span className="brandMark"><Navigation size={16} /></span>
            CityMitra
          </Link>
          <button className="chatSidebarClose" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <PanelLeftClose size={18} />
          </button>
        </div>

        <button className="newChatBtn" type="button" onClick={startNewChat}>
          <MessageSquarePlus size={17} />
          New chat
        </button>

        <div className="chatHistory" aria-label="Recent chats">
          <span className="chatHistoryLabel">Recent</span>
          {conversations.map((convo) => (
            <div key={convo.id} className={convo.id === activeId ? "chatHistoryItem active" : "chatHistoryItem"}>
              <button type="button" onClick={() => openConversation(convo.id)} title={convo.title}>
                {convo.title}
              </button>
              <button className="chatHistoryDelete" type="button" onClick={() => removeConversation(convo.id)} aria-label="Delete chat">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="chatAccount">
          {account ? (
            <>
              <div className="chatAccountHead">
                <span className="chatAccountAvatar">{account.email.charAt(0).toUpperCase()}</span>
                <div className="chatAccountInfo">
                  <strong title={account.email}>{account.email}</strong>
                  <span className={account.isPro ? "planTag pro" : "planTag basic"}>
                    {account.isPro ? "Pro plan" : "Basic plan"}
                  </span>
                </div>
              </div>
              {!account.isPro && (
                <Link className="chatUpgrade" href="/pro">
                  <Crown size={14} />
                  Upgrade to Pro
                </Link>
              )}
              <div className="chatAccountActions">
                <span>Chats synced to your account</span>
                <button type="button" onClick={logout}>
                  <LogOut size={13} />
                  Log out
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="chatAccountNote">You’re on the <b>Basic</b> plan. Chats are saved on this device.</p>
              <Link className="chatSignIn" href="/pro">
                <LogIn size={15} />
                Sign in / Sign up
              </Link>
              <Link className="chatUpgrade ghost" href="/pro">
                <Crown size={14} />
                See Pro plan
              </Link>
            </>
          )}
        </div>
      </aside>

      {sidebarOpen && <div className="chatScrim" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}

      <section className="chatMain">
        <header className="chatTopbar">
          <button className="chatMenuBtn" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open chats">
            <Menu size={20} />
          </button>
          <strong>{active?.title || "CityMitra Assistant"}</strong>
          <Link className="chatExit" href="/" aria-label="Back to site">
            <X size={18} />
          </Link>
        </header>

        <div className="chatThread">
          {showEmpty ? (
            <div className="chatWelcome">
              <span className="chatWelcomeMark"><Sparkles size={22} /></span>
              <h1>What can I help you plan?</h1>
              <p>Ask about any Indian city — places, routes, hotels, food, repairs, and more.</p>
              <div className="chatSuggestions">
                {suggestions.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => send(suggestion)}>
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={message.role === "user" ? "chatRow user" : "chatRow assistant"}>
                <div className="chatAvatar">{message.role === "user" ? "You" : <Sparkles size={15} />}</div>
                <div className="chatBody">
                  {message.role === "assistant" && message.content ? (
                    <MarkdownText content={message.content} />
                  ) : (
                    <p>{message.content || (loading ? "Thinking…" : "")}</p>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="chatRow assistant">
              <div className="chatAvatar"><Sparkles size={15} /></div>
              <div className="typingRow"><i /><i /><i /></div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="chatComposer">
          <div className="chatComposerInner">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask anything about a city… (Enter to send, Shift+Enter for a new line)"
              rows={1}
            />
            <button type="button" className="chatSend" onClick={() => send(input)} disabled={loading || !input.trim()} aria-label="Send">
              <ArrowUp size={18} />
            </button>
          </div>
          <span className="chatDisclaimer">CityMitra can be wrong — verify timings, prices, and routes before you go.</span>
        </div>
      </section>

      <ConciergePip
        groups={pip?.groups ?? null}
        localPicks={pip?.local ?? null}
        city={city}
        onClose={() => setPip(null)}
        onOpen={(provider, bookingCategory) => trackActivity({ type: "concierge_open", city, label: `${bookingCategory}:${provider}` })}
      />
    </div>
  );
}
