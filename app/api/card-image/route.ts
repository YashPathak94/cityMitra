import { createHash } from "crypto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { NextRequest, NextResponse, after } from "next/server";
import { CategoryKey } from "@/data/city-directory";
import { imageForCategory, imageForTheme, ImageTheme } from "@/lib/category-images";

export const runtime = "nodejs";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

let cachedClient: SupabaseClient | null | undefined;
function supabase(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  cachedClient = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return cachedClient;
}

type CacheEntry = { mime: string; data: Buffer };

// Hot in-instance cache so repeat references are instant.
const LRU = new Map<string, CacheEntry>();
const LRU_MAX = 80;
const inFlight = new Set<string>();

function lruGet(key: string): CacheEntry | undefined {
  const entry = LRU.get(key);
  if (entry) {
    LRU.delete(key);
    LRU.set(key, entry);
  }
  return entry;
}

function lruSet(key: string, entry: CacheEntry) {
  LRU.set(key, entry);
  if (LRU.size > LRU_MAX) {
    const oldest = LRU.keys().next().value;
    if (oldest) LRU.delete(oldest);
  }
}

function keyFor(city: string, topic: string) {
  return createHash("sha256").update(`${city.toLowerCase()}::${topic.toLowerCase()}`).digest("hex").slice(0, 40);
}

function bytes(entry: CacheEntry) {
  return new NextResponse(new Uint8Array(entry.data), {
    status: 200,
    headers: {
      "Content-Type": entry.mime,
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}

function redirectTo(url: string, maxAge: number) {
  return new NextResponse(null, {
    status: 302,
    headers: { Location: url, "Cache-Control": `public, max-age=${maxAge}` }
  });
}

async function readSupabase(key: string): Promise<CacheEntry | null> {
  const client = supabase();
  if (!client) return null;
  try {
    const { data, error } = await client.from("image_cache").select("mime,data").eq("cache_key", key).maybeSingle();
    if (error || !data?.data) return null;
    return { mime: (data.mime as string) || "image/png", data: Buffer.from(data.data as string, "base64") };
  } catch {
    return null;
  }
}

async function writeSupabase(key: string, mime: string, b64: string) {
  const client = supabase();
  if (!client) return;
  try {
    await client.from("image_cache").upsert({ cache_key: key, mime, data: b64 });
  } catch {
    /* cache write is best-effort */
  }
}

async function generate(topic: string, city: string): Promise<{ mime: string; b64: string } | null> {
  if (!openai) return null;
  const prompt =
    `Premium, realistic editorial photograph representing "${topic}"${city ? ` in ${city}, India` : ""}. ` +
    `Natural lighting, sharp focus, vibrant, true-to-life. No text, no watermark, no logos, no charts.`;
  const result = await openai.images.generate({
    model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
    prompt,
    size: "1536x1024",
    quality: "low",
    n: 1
  });
  const b64 = result.data?.[0]?.b64_json;
  return b64 ? { mime: "image/png", b64 } : null;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const topic = (params.get("topic") || "").slice(0, 120).trim();
  const city = (params.get("city") || "").slice(0, 60).trim();
  const theme = params.get("theme") as ImageTheme | null;
  const category = params.get("category") as CategoryKey | null;
  const variant = Number(params.get("v") || "0") || 0;

  const fallback = theme ? imageForTheme(theme, variant) : imageForCategory(category || undefined, variant);

  if (!topic) return redirectTo(fallback, 86400);

  const key = keyFor(city, topic);

  const mem = lruGet(key);
  if (mem) return bytes(mem);

  const stored = await readSupabase(key);
  if (stored) {
    lruSet(key, stored);
    return bytes(stored);
  }

  // Cache miss: warm the cache in the background and serve the matched
  // theme image right now so the card never waits on generation.
  if (openai && !inFlight.has(key)) {
    inFlight.add(key);
    after(async () => {
      try {
        const generated = await generate(topic, city);
        if (generated) {
          lruSet(key, { mime: generated.mime, data: Buffer.from(generated.b64, "base64") });
          await writeSupabase(key, generated.mime, generated.b64);
        }
      } catch (error) {
        console.error("card-image generation failed", error);
      } finally {
        inFlight.delete(key);
      }
    });
  }

  // short cache so the AI image is picked up on a later view
  return redirectTo(fallback, 600);
}
