"use client";

import { BadgeCheck, Check, LogOut, Mail, ShieldCheck } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { trackActivity } from "@/lib/tracking";
import ProCheckout from "@/app/components/ProCheckout";

type AccountUser = { email: string; isPro: boolean };

export default function ProAccess({ priceInr }: { priceInr: number }) {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { user: AccountUser | null }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string; email?: string; isPro?: boolean };

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setUser({ email: data.email || email, isPro: Boolean(data.isPro) });
      setPassword("");
      trackActivity({ type: mode === "signup" ? "auth_signup" : "auth_login", label: (data.email || email).split("@")[1] });
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    setUser(null);
  }

  if (checking) {
    return <div className="proAccess proAccessLoading">Checking your account…</div>;
  }

  if (user) {
    return (
      <div className="proAccess">
        <div className="proAccountRow">
          <span className="proAccountWho">
            <Mail size={15} />
            {user.email}
            {user.isPro && (
              <span className="proBadgeTag">
                <BadgeCheck size={13} />
                Pro
              </span>
            )}
          </span>
          <button type="button" className="ghostButton" onClick={logout}>
            <LogOut size={14} />
            Log out
          </button>
        </div>

        {user.isPro ? (
          <div className="proSuccess" role="status">
            <Check size={20} />
            <strong>You are a CityMitra Pro member. Enjoy the full concierge.</strong>
          </div>
        ) : (
          <ProCheckout priceInr={priceInr} onPurchased={() => setUser({ ...user, isPro: true })} />
        )}
      </div>
    );
  }

  return (
    <div className="proAccess">
      <div className="authTabs" role="tablist">
        <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>
          Create account
        </button>
        <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
          Log in
        </button>
      </div>

      <form className="authForm" onSubmit={submit}>
        <label htmlFor="authEmail">Email</label>
        <input
          id="authEmail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
        <label htmlFor="authPassword">Password</label>
        <input
          id="authPassword"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
        />
        {error && <p className="authError">{error}</p>}
        <button className="primaryButton" type="submit" disabled={busy}>
          {busy ? "Please wait…" : mode === "signup" ? "Create account & continue" : "Log in"}
        </button>
        <span className="proSecure">
          <ShieldCheck size={14} />
          Sign up to subscribe to Pro. We never store your card details.
        </span>
      </form>
    </div>
  );
}
