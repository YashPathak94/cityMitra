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

export type StorageDiagnostics = {
  configured: boolean;
  urlHostHint: string | null;
  insertOk: boolean;
  selectOk: boolean;
  activityRows: number | null;
  newsletterRows: number | null;
  error: string | null;
  hint: string | null;
};

// Admin-only: performs a real write + read round-trip against Supabase and
// returns the raw error so misconfiguration (wrong key, missing table, RLS)
// becomes visible instead of silently producing zeros.
export async function runStorageDiagnostics(): Promise<StorageDiagnostics> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const urlHostHint = url ? (() => { try { return new URL(url).host; } catch { return "invalid-url"; } })() : null;

  const base: StorageDiagnostics = {
    configured: Boolean(url && key),
    urlHostHint,
    insertOk: false,
    selectOk: false,
    activityRows: null,
    newsletterRows: null,
    error: null,
    hint: null
  };

  const client = supabase();
  if (!client) {
    return {
      ...base,
      error: !url ? "SUPABASE_URL is not set." : "SUPABASE_SERVICE_ROLE_KEY is not set.",
      hint: "Set both env vars in Vercel (Production scope) and redeploy."
    };
  }

  // 1. try an insert
  const probe = await client.from("activity").insert({
    type: "diagnostic_probe",
    label: "admin storage test",
    session_id: "diagnostics"
  });
  if (probe.error) {
    return {
      ...base,
      error: `INSERT failed: ${probe.error.message}`,
      hint: probe.error.message.toLowerCase().includes("row-level security")
        ? "RLS blocked the write. You are almost certainly using the ANON key. Copy the service_role key (Settings -> API -> Project API keys -> service_role) into SUPABASE_SERVICE_ROLE_KEY."
        : probe.error.message.toLowerCase().includes("does not exist") || probe.error.message.toLowerCase().includes("schema cache")
        ? "The 'activity' table is missing or has wrong columns. Run the SQL from DEPLOYMENT.md in the Supabase SQL editor."
        : "Check the SUPABASE_URL and service_role key are from the same project."
    };
  }
  base.insertOk = true;

  // 2. try counts
  const activityCount = await client.from("activity").select("*", { count: "exact", head: true });
  const newsletterCount = await client.from("newsletter").select("*", { count: "exact", head: true });

  if (activityCount.error) {
    return { ...base, error: `SELECT failed: ${activityCount.error.message}`, hint: "Read blocked — same key/RLS issue as above." };
  }

  base.selectOk = true;
  base.activityRows = activityCount.count ?? 0;
  base.newsletterRows = newsletterCount.error ? null : newsletterCount.count ?? 0;
  base.hint = "Storage round-trip succeeded. If the dashboard still shows 0, browse the public site to generate events, then refresh.";
  return base;
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
