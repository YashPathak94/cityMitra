"use client";

import { Check, Copy, RefreshCw, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { SocialPost } from "@/lib/social-agent";

// Admin viewer for the daily social-content agent. The agent itself runs on
// a Vercel cron (see vercel.json); this page is where a human reviews the
// generated batch and copies each platform's text out — posting stays a
// human/Zapier step by design, so nothing goes live unreviewed.
export default function AdminSocialPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [status, setStatus] = useState("Loading…");
  const [busy, setBusy] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/agents/social-content?recent=1", { cache: "no-store" });
      if (response.status === 401) {
        setStatus("Admin login required — sign in at /admin/login first.");
        return;
      }
      const data = (await response.json()) as { posts?: SocialPost[] };
      setPosts(data.posts || []);
      setStatus(data.posts?.length ? "" : "No posts generated yet — run the agent once below.");
    } catch {
      setStatus("Could not load posts.");
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(id);
  }, [load]);

  async function generateNow() {
    setBusy(true);
    setStatus("Running the agent…");
    try {
      const response = await fetch("/api/agents/social-content", { cache: "no-store" });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setStatus(data.error || "Agent run failed.");
        return;
      }
      setStatus("");
      await load();
    } catch {
      setStatus("Agent run failed.");
    } finally {
      setBusy(false);
    }
  }

  async function copyText(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(""), 1600);
    } catch {
      // clipboard unavailable — nothing else to do
    }
  }

  function CopyBlock({ id, label, text }: { id: string; label: string; text: string }) {
    const key = `${id}-${label}`;
    return (
      <div className="socialCopyBlock">
        <div className="socialCopyHead">
          <strong>{label}</strong>
          <button type="button" onClick={() => copyText(key, text)}>
            {copiedKey === key ? <Check size={13} /> : <Copy size={13} />} {copiedKey === key ? "Copied" : "Copy"}
          </button>
        </div>
        <p>{text}</p>
      </div>
    );
  }

  return (
    <main className="adminPage">
      <nav className="adminTopbar">
        <Link className="secondaryButton" href="/admin">
          ← Admin console
        </Link>
        <button className="primaryButton" type="button" onClick={generateNow} disabled={busy}>
          <RefreshCw size={15} /> {busy ? "Generating…" : "Generate today's batch now"}
        </button>
      </nav>

      <section className="adminHero">
        <span className="sectionKicker">Content Growth Agent</span>
        <h1>Daily social content</h1>
        <p>
          Generated automatically every morning by the agent (Vercel cron → OpenAI → stored here). Review, copy, and
          post — or wire the feed into Buffer/Zapier for hands-off scheduling.
        </p>
      </section>

      {status && <p className="socialAgentStatus">{status}</p>}

      <section className="socialPostList">
        {posts.map((post) => (
          <article className="planStackCard socialPostCard" key={post.id}>
            <div className="socialPostHead">
              <h2>
                {post.id} · {post.topic}
              </h2>
              <span className={post.source === "ai" ? "travelPlanSource ai" : "travelPlanSource warn"}>
                <Sparkles size={12} /> {post.source === "ai" ? "AI-generated · review before posting" : "Template · OpenAI unavailable that day"}
              </span>
            </div>
            <CopyBlock id={post.id} label="LinkedIn" text={post.content.linkedin} />
            <CopyBlock id={post.id} label="X" text={post.content.x} />
            <CopyBlock id={post.id} label="Instagram" text={post.content.instagram} />
            <CopyBlock id={post.id} label="Hashtags" text={post.content.hashtags.map((tag) => `#${tag}`).join(" ")} />
            <CopyBlock id={post.id} label="Image idea" text={post.content.imageIdea} />
            <CopyBlock id={post.id} label="CTA" text={post.content.cta} />
          </article>
        ))}
      </section>
    </main>
  );
}
