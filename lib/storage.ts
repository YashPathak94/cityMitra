import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type ActivityRecord = {
  type: string;
  city?: string;
  category?: string;
  label?: string;
  value?: number;
  path?: string;
  sessionId?: string;
  timestamp: string;
};

export type Subscriber = {
  email: string;
  subscribedAt: string;
};

const storageDir = path.join(process.cwd(), ".citymitra");
const activityFile = path.join(storageDir, "activity.json");
const subscribersFile = path.join(storageDir, "newsletter.json");

let cachedClient: SupabaseClient | null | undefined;

// Uses Supabase when configured (required on Vercel — the serverless filesystem
// is read-only); otherwise falls back to local JSON files for development.
function supabase(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  cachedClient = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return cachedClient;
}

export function hasDurableStorage() {
  return Boolean(supabase());
}

async function readJsonFile<T>(file: string): Promise<T[]> {
  try {
    return JSON.parse(await readFile(file, "utf-8")) as T[];
  } catch {
    return [];
  }
}

export async function appendActivity(record: ActivityRecord) {
  const client = supabase();

  if (client) {
    const { error } = await client.from("activity").insert({
      type: record.type,
      city: record.city ?? null,
      category: record.category ?? null,
      label: record.label ?? null,
      value: record.value ?? null,
      path: record.path ?? null,
      session_id: record.sessionId ?? null
    });
    if (error) throw new Error(error.message);
    return;
  }

  await mkdir(storageDir, { recursive: true });
  const records = await readJsonFile<ActivityRecord>(activityFile);
  await writeFile(activityFile, JSON.stringify([...records.slice(-980), record], null, 2));
}

export async function readRecentActivity(limit = 2000): Promise<ActivityRecord[]> {
  const client = supabase();

  if (client) {
    const { data, error } = await client
      .from("activity")
      .select("type, city, category, label, value, path, session_id, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);

    return (data || [])
      .map((row) => ({
        type: row.type as string,
        city: row.city ?? undefined,
        category: row.category ?? undefined,
        label: row.label ?? undefined,
        value: row.value ?? undefined,
        path: row.path ?? undefined,
        sessionId: row.session_id ?? undefined,
        timestamp: row.created_at as string
      }))
      .reverse();
  }

  return readJsonFile<ActivityRecord>(activityFile);
}

export async function addSubscriber(email: string) {
  const client = supabase();

  if (client) {
    const { error } = await client.from("newsletter").upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
    if (error) throw new Error(error.message);
    return;
  }

  await mkdir(storageDir, { recursive: true });
  const subscribers = await readJsonFile<Subscriber>(subscribersFile);

  if (!subscribers.some((subscriber) => subscriber.email === email)) {
    const next = [...subscribers, { email, subscribedAt: new Date().toISOString() }].slice(-20000);
    await writeFile(subscribersFile, JSON.stringify(next, null, 2));
  }
}

export async function readSubscribers(): Promise<Subscriber[]> {
  const client = supabase();

  if (client) {
    const { data, error } = await client
      .from("newsletter")
      .select("email, subscribed_at")
      .order("subscribed_at", { ascending: false })
      .limit(2000);
    if (error) throw new Error(error.message);

    return (data || []).map((row) => ({
      email: row.email as string,
      subscribedAt: row.subscribed_at as string
    }));
  }

  return (await readJsonFile<Subscriber>(subscribersFile)).reverse();
}
