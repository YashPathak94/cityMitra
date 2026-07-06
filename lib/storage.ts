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
  provider?: string;
  subscriptionId?: string | null;
  subscriptionStatus?: string | null;
  currentPeriodEnd?: string | null;
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

function mapUserRow(data: Record<string, unknown>): User {
  return {
    email: data.email as string,
    passwordHash: (data.password_hash as string) || "",
    isPro: Boolean(data.is_pro),
    createdAt: data.created_at as string,
    provider: (data.provider as string) ?? undefined,
    subscriptionId: (data.subscription_id as string) ?? null,
    subscriptionStatus: (data.subscription_status as string) ?? null,
    currentPeriodEnd: (data.current_period_end as string) ?? null
  };
}

const userColumns = "email, password_hash, is_pro, created_at, provider, subscription_id, subscription_status, current_period_end";

export async function getUserByEmail(email: string): Promise<User | null> {
  const client = supabase();

  if (client) {
    const { data, error } = await client.from("users").select(userColumns).eq("email", email).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapUserRow(data) : null;
  }

  const users = await readJsonFile<User>(usersFile);
  return users.find((user) => user.email === email) || null;
}

export async function getUserBySubscriptionId(subscriptionId: string): Promise<User | null> {
  const client = supabase();

  if (client) {
    const { data, error } = await client.from("users").select(userColumns).eq("subscription_id", subscriptionId).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapUserRow(data) : null;
  }

  const users = await readJsonFile<User>(usersFile);
  return users.find((user) => user.subscriptionId === subscriptionId) || null;
}

export async function createUser(email: string, passwordHash: string, provider = "password"): Promise<User> {
  const client = supabase();
  const record: User = { email, passwordHash, isPro: false, createdAt: new Date().toISOString(), provider };

  if (client) {
    const { error } = await client.from("users").insert({
      email,
      password_hash: passwordHash,
      is_pro: false,
      provider
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

export async function findOrCreateOAuthUser(email: string, provider: string): Promise<User> {
  const existing = await getUserByEmail(email);
  if (existing) return existing;
  return createUser(email, "", provider);
}

export async function updateUserPassword(email: string, passwordHash: string) {
  const client = supabase();

  if (client) {
    const { error } = await client.from("users").update({ password_hash: passwordHash }).eq("email", email);
    if (error) throw new Error(error.message);
    return;
  }

  const users = await readJsonFile<User>(usersFile);
  const next = users.map((user) => (user.email === email ? { ...user, passwordHash } : user));
  await mkdir(storageDir, { recursive: true });
  await writeFile(usersFile, JSON.stringify(next, null, 2));
}

export async function setUserPro(email: string, isPro: boolean) {
  await updateUserFields(email, { is_pro: isPro }, (user) => ({ ...user, isPro }));
}

// Records subscription state (used by checkout verify and the webhook).
export async function setUserSubscription(
  email: string,
  fields: { isPro?: boolean; subscriptionId?: string | null; subscriptionStatus?: string | null; currentPeriodEnd?: string | null }
) {
  await updateUserFields(
    email,
    {
      ...(fields.isPro !== undefined ? { is_pro: fields.isPro } : {}),
      ...(fields.subscriptionId !== undefined ? { subscription_id: fields.subscriptionId } : {}),
      ...(fields.subscriptionStatus !== undefined ? { subscription_status: fields.subscriptionStatus } : {}),
      ...(fields.currentPeriodEnd !== undefined ? { current_period_end: fields.currentPeriodEnd } : {})
    },
    (user) => ({
      ...user,
      ...(fields.isPro !== undefined ? { isPro: fields.isPro } : {}),
      ...(fields.subscriptionId !== undefined ? { subscriptionId: fields.subscriptionId } : {}),
      ...(fields.subscriptionStatus !== undefined ? { subscriptionStatus: fields.subscriptionStatus } : {}),
      ...(fields.currentPeriodEnd !== undefined ? { currentPeriodEnd: fields.currentPeriodEnd } : {})
    })
  );
}

async function updateUserFields(
  email: string,
  supabaseFields: Record<string, unknown>,
  fileUpdate: (user: User) => User
) {
  const client = supabase();

  if (client) {
    const { error } = await client.from("users").update(supabaseFields).eq("email", email);
    if (error) throw new Error(error.message);
    return;
  }

  const users = await readJsonFile<User>(usersFile);
  const next = users.map((user) => (user.email === email ? fileUpdate(user) : user));
  await mkdir(storageDir, { recursive: true });
  await writeFile(usersFile, JSON.stringify(next, null, 2));
}

export type StoredConversation = {
  id: string;
  title: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  updatedAt: string;
};

const conversationsFile = path.join(storageDir, "conversations.json");

type FileConversation = StoredConversation & { email: string };

export async function listConversations(email: string): Promise<StoredConversation[]> {
  const client = supabase();

  if (client) {
    const { data, error } = await client
      .from("conversations")
      .select("id, title, messages, updated_at")
      .eq("email", email)
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return (data || []).map((row) => ({
      id: row.id as string,
      title: row.title as string,
      messages: (row.messages as StoredConversation["messages"]) || [],
      updatedAt: row.updated_at as string
    }));
  }

  const all = await readJsonFile<FileConversation>(conversationsFile);
  return all
    .filter((convo) => convo.email === email)
    .map(({ email: _omit, ...rest }) => rest)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function upsertConversation(email: string, convo: StoredConversation) {
  const client = supabase();

  if (client) {
    const { error } = await client.from("conversations").upsert(
      {
        id: convo.id,
        email,
        title: convo.title,
        messages: convo.messages,
        updated_at: convo.updatedAt
      },
      { onConflict: "id" }
    );
    if (error) throw new Error(error.message);
    return;
  }

  await mkdir(storageDir, { recursive: true });
  const all = await readJsonFile<FileConversation>(conversationsFile);
  const next = all.filter((item) => !(item.email === email && item.id === convo.id));
  next.push({ email, ...convo });
  await writeFile(conversationsFile, JSON.stringify(next.slice(-2000), null, 2));
}

export async function deleteConversation(email: string, id: string) {
  const client = supabase();

  if (client) {
    const { error } = await client.from("conversations").delete().eq("email", email).eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }

  const all = await readJsonFile<FileConversation>(conversationsFile);
  const next = all.filter((item) => !(item.email === email && item.id === id));
  await mkdir(storageDir, { recursive: true });
  await writeFile(conversationsFile, JSON.stringify(next, null, 2));
}
