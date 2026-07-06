import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdminCookie } from "@/lib/admin-auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  coerceSocialContent,
  SocialPost,
  socialPrompt,
  templateContent,
  topicForDate
} from "@/lib/social-agent";
import { listSocialPosts, saveSocialPost } from "@/lib/storage";

export const runtime = "nodejs";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Three callers, three auth paths:
// 1. Vercel Cron (daily): Authorization: Bearer ${CRON_SECRET} — generates.
// 2. Admin (dashboard at /admin/social): admin cookie — generate + read.
// 3. Automation pickup (Zapier/Make "Webhooks GET"): ?key=${SOCIAL_FEED_KEY}
//    — read-only, so the posting pipeline never needs the admin password.
function callerAllowed(request: NextRequest): "cron" | "admin" | "feed" | null {
  const cronSecret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (cronSecret && auth === `Bearer ${cronSecret}`) return "cron";

  if (isAdminCookie(request.cookies.get(ADMIN_COOKIE)?.value)) return "admin";

  const feedKey = process.env.SOCIAL_FEED_KEY;
  const key = request.nextUrl.searchParams.get("key");
  if (feedKey && key === feedKey) return "feed";

  // Without a CRON_SECRET configured, cron requests arrive with no auth
  // header. Generation is idempotent (one post per day, upserted) and the
  // output is public-facing marketing copy, so allowing it unauthenticated
  // is a deliberately accepted risk to keep zero-config deploys working —
  // reads still require admin or the feed key.
  if (!cronSecret && !request.nextUrl.searchParams.get("recent")) return "cron";

  return null;
}

async function generateToday(): Promise<SocialPost> {
  const now = new Date();
  const id = now.toISOString().slice(0, 10);

  const existing = await listSocialPosts(5).catch(() => [] as SocialPost[]);
  const already = existing.find((post) => post.id === id);
  if (already) return already;

  const topic = topicForDate(now);
  let post: SocialPost = {
    id,
    topic: topic.name,
    source: "template",
    content: templateContent(topic),
    createdAt: now.toISOString()
  };

  if (openai) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25_000);
      const completion = await openai.chat.completions.create(
        {
          model: process.env.OPENAI_MODEL || "gpt-5-mini",
          messages: [{ role: "user", content: socialPrompt(topic) }],
          response_format: { type: "json_object" }
        },
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      const raw = completion.choices?.[0]?.message?.content;
      if (raw) {
        const coerced = coerceSocialContent(JSON.parse(raw) as Record<string, unknown>, topic);
        if (coerced) post = { ...post, source: "ai", content: coerced };
      }
    } catch (error) {
      console.error("social-content generation failed, using template", error);
    }
  }

  await saveSocialPost(post);
  return post;
}

export async function GET(request: NextRequest) {
  const limit = rateLimit(`social-agent:${clientIp(request)}`, 20, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  }

  const caller = callerAllowed(request);
  if (!caller) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (request.nextUrl.searchParams.get("recent")) {
      const posts = await listSocialPosts(30);
      return NextResponse.json({ posts });
    }

    const post = await generateToday();
    return NextResponse.json({ post });
  } catch (error) {
    console.error("social-content agent failed", error);
    return NextResponse.json({ error: "Agent run failed — check storage/OpenAI configuration." }, { status: 503 });
  }
}
