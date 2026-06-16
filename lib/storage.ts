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

export type User = {
  email: string;
  passwordHash: string;
  isPro: boolean;
  createdAt: string;
};

const storageDir = path.join(process.cwd(), ".citymitra");
const activityFile = path.join(storageDir, "activity.json");
const subscribersFile = path.join(storageDir, "newsletter.json");
const usersFile = path.join(storageDir, "users.json");

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
  activityTable: { ok: boolean; rows: number | null; error: string | null };
  newsletterTable: { ok: boolean; rows: number | null; error: string | null };
  error: string | null;
  hint: string | null;
};

function diagnoseError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("row-level security")) {
    return "RLS blocked this. The key is NOT the service_role key — copy it from Supabase → Settings → API → Project API keys → service_role (secret).";
  }
  if (lower.includes("does not exist") || lower.includes("schema cache") || lower.includes("could not find")) {
    return "Table or column missing. Run the SQL from DEPLOYMENT.md in the Supabase SQL editor (creates the activity + newsletter tables).";
  }
  if (lower.includes("invalid api key") || lower.includes("jwt") || lower.includes("unauthorized")) {
    return "The key is invalid or from a different project. Re-copy the service_role key from the SAME project as SUPABASE_URL.";
  }
  return "Verify SUPABASE_URL and the service_role key are from the same project, then redeploy.";
}

// Admin-only: performs a real write + read round-trip against BOTH tables and
// returns the raw error per table so misconfiguration (wrong key, missing
// table/column, RLS, project mismatch) becomes visible instead of silent zeros.
export async function runStorageDiagnostics(): Promise<StorageDiagnostics> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const urlHostHint = url ? (() => { try { return new URL(url).host; } catch { return "invalid-url"; } })() : null;

  const base: StorageDiagnostics = {
    configured: Boolean(url && key),
    urlHostHint,
    activityTable: { ok: false, rows: null, error: null },
    newsletterTable: { ok: false, rows: null, error: null },
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

  // --- activity table: insert probe + count ---
  const activityInsert = await client.from("activity").insert({
    type: "diagnostic_probe",
    label: "admin storage test",
    session_id: "diagnostics"
  });
  if (activityInsert.error) {
    base.activityTable.error = activityInsert.error.message;
  } else {
    const activityCount = await client.from("activity").select("*", { count: "exact", head: true });
    if (activityCount.error) {
      base.activityTable.error = activityCount.error.message;
    } else {
      base.activityTable.ok = true;
      base.activityTable.rows = activityCount.count ?? 0;
    }
  }

  // --- newsletter table: insert probe + count ---
  const probeEmail = `diagnostic+${Date.now()}@citymitra.test`;
  const newsletterInsert = await client.from("newsletter").insert({ email: probeEmail });
  if (newsletterInsert.error && !/duplicate key|already exists|23505/i.test(newsletterInsert.error.message)) {
    base.newsletterTable.error = newsletterInsert.error.message;
  } else {
    const newsletterCount = await client.from("newsletter").select("*", { count: "exact", head: true });
    if (newsletterCount.error) {
      base.newsletterTable.error = newsletterCount.error.message;
    } else {
      base.newsletterTable.ok = true;
      base.newsletterTable.rows = newsletterCount.count ?? 0;
    }
    // clean up the probe email so it doesn't pollute the real list
    await client.from("newsletter").delete().eq("email", probeEmail);
  }

  const firstError = base.activityTable.error || base.newsletterTable.error;
  if (firstError) {
    base.error = base.activityTable.error
      ? `activity table: ${base.activityTable.error}`
      : `newsletter table: ${base.newsletterTable.error}`;
    base.hint = diagnoseError(firstError);
  } else {
    base.hint = "Both tables work. If the dashboard still shows 0, open the PUBLIC site (/), click a city or map, then return to /admin and Refresh — the admin page itself does not generate events.";
  }

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
    // Plain insert (no onConflict) so it works whether or not email is a unique
    // key; duplicate-key errors just mean "already subscribed" and are ignored.
    const { error } = await client.from("newsletter").insert({ email });
    if (error && !/duplicate key|already exists|23505/i.test(error.message)) {
      throw new Error(error.message);
    }
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

export async function getUserByEmail(email: string): Promise<User | null> {
  const client = supabase();

  if (client) {
    const { data, error } = await client
      .from("users")
      .select("email, password_hash, is_pro, created_at")
      .eq("email", email)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return {
      email: data.email as string,
      passwordHash: data.password_hash as string,
      isPro: Boolean(data.is_pro),
      createdAt: data.created_at as string
    };
  }

  const users = await readJsonFile<User>(usersFile);
  return users.find((user) => user.email === email) || null;
}

export async function createUser(email: string, passwordHash: string): Promise<User> {
  const client = supabase();
  const record: User = { email, passwordHash, isPro: false, createdAt: new Date().toISOString() };

  if (client) {
    const { error } = await client.from("users").insert({
      email,
      password_hash: passwordHash,
      is_pro: false
    });
    if (error) throw new Error(error.message);
    return record;
  }

  await mkdir(storageDir, { recursive: true });
  const users = await readJsonFile<User>(usersFile);
  users.push(record);
  await writeFile(usersFile, JSON.stringify(users, null, 2));
  return record;
}

export async function setUserPro(email: string, isPro: boolean) {
  const client = supabase();

  if (client) {
    const { error } = await client.from("users").update({ is_pro: isPro }).eq("email", email);
    if (error) throw new Error(error.message);
    return;
  }

  const users = await readJsonFile<User>(usersFile);
  const next = users.map((user) => (user.email === email ? { ...user, isPro } : user));
  await mkdir(storageDir, { recursive: true });
  await writeFile(usersFile, JSON.stringify(next, null, 2));
}
