"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BarChart3, Clock3, Download, IndianRupee, LogOut, MousePointerClick, RefreshCw, Save, Search, Target, Users } from "lucide-react";
import Link from "next/link";

type ChartItem = {
  label: string;
  count: number;
};

type ActivitySummary = {
  storage?: "supabase" | "ephemeral-file";
  totals: {
    events: number;
    pageViews?: number;
    uniqueVisitors?: number;
    sessions: number;
    timeSpentSeconds: number;
    monetizableEvents: number;
    estimatedLeadValue: number;
    leadValue?: number;
    featuredListingPrice?: number;
  };
  charts: {
    cities: ChartItem[];
    categories: ChartItem[];
    events: ChartItem[];
  };
  recent: Array<{
    type: string;
    city?: string;
    category?: string;
    label?: string;
    value?: number;
    timestamp: string;
  }>;
};

const emptySummary: ActivitySummary = {
  totals: {
    events: 0,
    sessions: 0,
    timeSpentSeconds: 0,
    monetizableEvents: 0,
    estimatedLeadValue: 0
  },
  charts: {
    cities: [],
    categories: [],
    events: []
  },
  recent: []
};

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

type Diagnostics = {
  configured: boolean;
  urlHostHint: string | null;
  activityTable: { ok: boolean; rows: number | null; error: string | null };
  newsletterTable: { ok: boolean; rows: number | null; error: string | null };
  error: string | null;
  hint: string | null;
};

type LeadsData = {
  total: number;
  byCity: ChartItem[];
  byCategory: ChartItem[];
  byDay: ChartItem[];
  recent: Array<{
    type: string;
    typeLabel: string;
    city?: string;
    category?: string;
    label?: string;
    timestamp: string;
  }>;
};

export default function AdminPage() {
  const [summary, setSummary] = useState<ActivitySummary>(emptySummary);
  const [settings, setSettings] = useState({ leadValue: 12, featuredListingPrice: 999 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [diagnostics, setDiagnostics] = useState<Diagnostics | null>(null);
  const [testing, setTesting] = useState(false);
  const [leads, setLeads] = useState<LeadsData | null>(null);

  async function runStorageTest() {
    setTesting(true);
    setDiagnostics(null);
    try {
      const response = await fetch("/api/admin/diagnostics", { cache: "no-store" });
      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      setDiagnostics((await response.json()) as Diagnostics);
    } catch {
      setDiagnostics({
        configured: false,
        urlHostHint: null,
        activityTable: { ok: false, rows: null, error: null },
        newsletterTable: { ok: false, rows: null, error: null },
        error: "Could not reach the diagnostics endpoint.",
        hint: null
      });
    } finally {
      setTesting(false);
      await loadActivity();
    }
  }

  async function loadActivity() {
    setLoading(true);
    const [activityResponse, settingsResponse, leadsResponse] = await Promise.all([
      fetch("/api/activity", { cache: "no-store" }),
      fetch("/api/admin/settings", { cache: "no-store" }),
      fetch("/api/admin/leads", { cache: "no-store" })
    ]);

    if (activityResponse.status === 401 || settingsResponse.status === 401) {
      window.location.href = "/admin/login";
      return;
    }

    const settingsData = (await settingsResponse.json()) as typeof settings;
    setSettings(settingsData);
    const data = (await activityResponse.json()) as ActivitySummary;
    setSummary(data);
    if (leadsResponse.ok) {
      setLeads((await leadsResponse.json()) as LeadsData);
    }
    setLoading(false);
  }

  async function saveSettings() {
    setSaving(true);
    const response = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });

    if (response.status === 401) {
      window.location.href = "/admin/login";
      return;
    }

    const nextSettings = (await response.json()) as typeof settings;
    setSettings(nextSettings);
    setSaving(false);
    await loadActivity();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  useEffect(() => {
    loadActivity().catch(() => setLoading(false));
  }, []);

  const maxLeadCount = useMemo(
    () =>
      Math.max(
        1,
        ...(leads?.byCity.map((item) => item.count) ?? []),
        ...(leads?.byCategory.map((item) => item.count) ?? []),
        ...(leads?.byDay.map((item) => item.count) ?? [])
      ),
    [leads]
  );

  const maxEventCount = useMemo(
    () => Math.max(1, ...summary.charts.events.map((item) => item.count), ...summary.charts.cities.map((item) => item.count)),
    [summary]
  );

  return (
    <main className="adminPage">
      <nav className="adminTopbar">
        <Link className="secondaryButton" href="/">
          <ArrowLeft size={17} />
          CityMitra
        </Link>
        <button className="primaryButton" onClick={loadActivity} type="button">
          <RefreshCw size={17} />
          {loading ? "Loading" : "Refresh"}
        </button>
        <button className="secondaryButton" onClick={runStorageTest} type="button" disabled={testing}>
          {testing ? "Testing…" : "Run storage test"}
        </button>
        <button className="secondaryButton" onClick={logout} type="button">
          <LogOut size={17} />
          Logout
        </button>
      </nav>

      <section className="adminHero">
        <span className="sectionKicker">Admin Console</span>
        <h1>Activity, retention, and monetization signals</h1>
        <p>Track what users search, which cities move, where map clicks happen, and how much local intent can become paid leads.</p>
      </section>

      {!loading && summary.storage === "ephemeral-file" && (
        <section className="adminStorageWarning" role="alert">
          <strong>⚠ Events are not being saved durably.</strong>
          <p>
            This deployment is using temporary file storage. On Vercel the filesystem is read-only and reset on every
            request, so activity and newsletter data is lost. Connect Supabase by setting <code>SUPABASE_URL</code> and{" "}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> in your Vercel environment variables, then redeploy. See{" "}
            <code>DEPLOYMENT.md</code> for the one-time table setup.
          </p>
        </section>
      )}
      {!loading && summary.storage === "supabase" && (
        <section className="adminStorageOk" role="status">
          <strong>✓ Durable storage connected (Supabase).</strong> Events and subscribers persist across deploys.
        </section>
      )}

      {diagnostics && (
        <section
          className={diagnostics.error ? "adminStorageWarning" : "adminStorageOk"}
          role={diagnostics.error ? "alert" : "status"}
        >
          <strong>{diagnostics.error ? "⚠ Storage test failed" : "✓ Storage test passed"}</strong>
          <p>
            Project host: <code>{diagnostics.urlHostHint || "not set"}</code><br />
            activity table: {diagnostics.activityTable.ok ? `OK (${diagnostics.activityTable.rows} rows)` : "FAILED"} ·
            newsletter table: {diagnostics.newsletterTable.ok ? `OK (${diagnostics.newsletterTable.rows} rows)` : "FAILED"}
          </p>
          {diagnostics.error && <p><b>Error:</b> {diagnostics.error}</p>}
          {diagnostics.hint && <p><b>Fix:</b> {diagnostics.hint}</p>}
        </section>
      )}

      <section className="adminStatGrid">
        {[
          { icon: BarChart3, label: "Total events", value: summary.totals.events },
          { icon: Users, label: "Unique visitors", value: summary.totals.uniqueVisitors ?? summary.totals.sessions },
          { icon: MousePointerClick, label: "Page views", value: summary.totals.pageViews ?? 0 },
          { icon: Clock3, label: "Time spent", value: formatDuration(summary.totals.timeSpentSeconds) },
          { icon: IndianRupee, label: "Est. lead value", value: `₹${summary.totals.estimatedLeadValue}` }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label}>
              <Icon size={20} />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          );
        })}
      </section>

      <section className="adminGrid">
        <article className="adminCard settingsCard">
          <h2>Edit monetization settings</h2>
          <div className="settingsForm">
            <label>
              Lead value
              <input
                min="0"
                onChange={(event) => setSettings((current) => ({ ...current, leadValue: Number(event.target.value) }))}
                type="number"
                value={settings.leadValue}
              />
            </label>
            <label>
              Featured listing price
              <input
                min="0"
                onChange={(event) => setSettings((current) => ({ ...current, featuredListingPrice: Number(event.target.value) }))}
                type="number"
                value={settings.featuredListingPrice}
              />
            </label>
            <button className="primaryButton" onClick={saveSettings} type="button">
              <Save size={17} />
              {saving ? "Saving" : "Save settings"}
            </button>
          </div>
        </article>

        <article className="adminCard">
          <h2>Top cities</h2>
          <div className="barList">
            {(summary.charts.cities.length ? summary.charts.cities : [{ label: "No data yet", count: 0 }]).map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <b>{item.count}</b>
                <i aria-hidden="true" style={{ width: `${Math.max(8, (item.count / maxEventCount) * 100)}%` }} />
              </div>
            ))}
          </div>
        </article>

        <article className="adminCard">
          <h2>Category demand</h2>
          <div className="barList">
            {(summary.charts.categories.length ? summary.charts.categories : [{ label: "No data yet", count: 0 }]).map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <b>{item.count}</b>
                <i aria-hidden="true" style={{ width: `${Math.max(8, (item.count / maxEventCount) * 100)}%` }} />
              </div>
            ))}
          </div>
        </article>

        <article className="adminCard">
          <h2>Event mix</h2>
          <div className="barList">
            {(summary.charts.events.length ? summary.charts.events : [{ label: "No data yet", count: 0 }]).map((item) => (
              <div key={item.label}>
                <span>{item.label.replace(/_/g, " ")}</span>
                <b>{item.count}</b>
                <i aria-hidden="true" style={{ width: `${Math.max(8, (item.count / maxEventCount) * 100)}%` }} />
              </div>
            ))}
          </div>
        </article>

        <article className="adminCard recentCard">
          <h2>Recent activity</h2>
          <div className="recentList">
            {summary.recent.length > 0 ? (
              summary.recent.map((item, index) => (
                <div key={`${item.timestamp}-${index}`}>
                  <Search size={16} />
                  <span>
                    <strong>{item.type.replace(/_/g, " ")}</strong>
                    <small>{[item.city, item.category, item.label].filter(Boolean).join(" · ") || "CityMitra activity"}</small>
                  </span>
                  <time>{new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
                </div>
              ))
            ) : (
              <p>No activity recorded yet. Open the main page, search a city, ask chat, or click a map.</p>
            )}
          </div>
        </article>
      </section>

      <section className="leadsHeader">
        <div>
          <span className="sectionKicker">Leads</span>
          <h2>High-intent actions you can sell to vendors</h2>
          <p>
            Every map open, AI question, search, and export is a buying signal. {leads?.total ?? 0} captured so far —
            grouped by city and category below. Download the CSV to show a shop “your area got this many leads this week.”
          </p>
        </div>
        <a className="primaryButton" href="/api/admin/leads?format=csv" download>
          <Download size={17} />
          Download leads CSV
        </a>
      </section>

      <section className="adminGrid">
        <article className="adminCard">
          <h2>Leads by city</h2>
          <div className="barList">
            {(leads?.byCity.length ? leads.byCity : [{ label: "No leads yet", count: 0 }]).map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <b>{item.count}</b>
                <i aria-hidden="true" style={{ width: `${Math.max(8, (item.count / maxLeadCount) * 100)}%` }} />
              </div>
            ))}
          </div>
        </article>

        <article className="adminCard">
          <h2>Leads by category</h2>
          <div className="barList">
            {(leads?.byCategory.length ? leads.byCategory : [{ label: "No leads yet", count: 0 }]).map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <b>{item.count}</b>
                <i aria-hidden="true" style={{ width: `${Math.max(8, (item.count / maxLeadCount) * 100)}%` }} />
              </div>
            ))}
          </div>
        </article>

        <article className="adminCard">
          <h2>Leads per day</h2>
          <div className="barList">
            {(leads?.byDay.length ? leads.byDay : [{ label: "No leads yet", count: 0 }]).map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <b>{item.count}</b>
                <i aria-hidden="true" style={{ width: `${Math.max(8, (item.count / maxLeadCount) * 100)}%` }} />
              </div>
            ))}
          </div>
        </article>

        <article className="adminCard recentCard">
          <h2>Recent leads</h2>
          <div className="recentList">
            {leads && leads.recent.length > 0 ? (
              leads.recent.map((item, index) => (
                <div key={`${item.timestamp}-${index}`}>
                  <Target size={16} />
                  <span>
                    <strong>{item.typeLabel}</strong>
                    <small>{[item.city, item.category, item.label].filter(Boolean).join(" · ") || "CityMitra lead"}</small>
                  </span>
                  <time>{new Date(item.timestamp).toLocaleString([], { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</time>
                </div>
              ))
            ) : (
              <p>No leads yet. Map opens, AI questions, searches, and exports will appear here.</p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
