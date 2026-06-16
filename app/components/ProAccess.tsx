"use client";

import { BadgeCheck, Check, LogOut, Mail, ShieldCheck } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { trackActivity } from "@/lib/tracking";
import ProCheckout from "@/app/components/ProCheckout";

type AccountUser = { email: string; isPro: boolean; subscriptionId?: string | null; subscriptionStatus?: string | null };
type Mode = "signup" | "login" | "forgot";

const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true";

function GoogleIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z" />
      <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 010-4.22V7.05H2.18a11 11 0 000 9.9l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export default function ProAccess({ priceInr }: { priceInr: number }) {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { user: AccountUser | null }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));

    const params = new URLSearchParams(window.location.search);
    const auth = params.get("auth");
    if (auth === "google_failed") setError("Google sign-in failed. Please try again.");
    if (auth === "google_unavailable") setError("Google sign-in is not enabled yet.");
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    try {
      if (mode === "forgot") {
        const response = await fetch("/api/auth/forgot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        const data = (await response.json().catch(() => ({}))) as { error?: string; message?: string; devResetUrl?: string };
        if (!response.ok) {
          setError(data.error || "Could not send the reset link.");
          return;
        }
        setNotice(data.devResetUrl ? `Reset link (dev): ${data.devResetUrl}` : data.message || "If an account exists, a reset link has been sent.");
        return;
      }

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

  async function cancelSubscription() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/pro/cancel", { method: "POST" });
      const data = (await response.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!response.ok) {
        setError(data.error || "Could not cancel right now.");
        return;
      }
      setNotice(data.message || "Subscription cancelled.");
      setUser((current) => (current ? { ...current, subscriptionStatus: "cancelled" } : current));
    } finally {
      setBusy(false);
    }
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
          <>
            <div className="proSuccess" role="status">
              <Check size={20} />
              <strong>You are a CityMitra Pro member. Enjoy the full concierge.</strong>
            </div>
            {user.subscriptionStatus !== "cancelled" && (
              <button type="button" className="ghostButton" onClick={cancelSubscription} disabled={busy}>
                Cancel auto-renewal
              </button>
            )}
            {notice && <p className="proNotice">{notice}</p>}
            {error && <p className="proError">{error}</p>}
          </>
        ) : (
          <ProCheckout priceInr={priceInr} onPurchased={() => setUser({ ...user, isPro: true })} />
        )}
      </div>
    );
  }

  return (
    <div className="proAccess">
      {googleEnabled && (
        <>
          <a className="googleButton" href="/api/auth/google/start">
            <GoogleIcon />
            Continue with Google
          </a>
          <div className="authDivider"><span>or</span></div>
        </>
      )}

      {mode !== "forgot" && (
        <div className="authTabs" role="tablist">
          <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>
            Create account
          </button>
          <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            Log in
          </button>
        </div>
      )}

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
        {mode !== "forgot" && (
          <>
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
          </>
        )}
        {error && <p className="authError">{error}</p>}
        {notice && <p className="proNotice">{notice}</p>}
        <button className="primaryButton" type="submit" disabled={busy}>
          {busy ? "Please wait…" : mode === "signup" ? "Create account & continue" : mode === "login" ? "Log in" : "Send reset link"}
        </button>
        <div className="authLinks">
          {mode === "login" && (
            <button type="button" onClick={() => { setMode("forgot"); setError(""); setNotice(""); }}>
              Forgot password?
            </button>
          )}
          {mode === "forgot" && (
            <button type="button" onClick={() => { setMode("login"); setError(""); setNotice(""); }}>
              Back to log in
            </button>
          )}
        </div>
        <span className="proSecure">
          <ShieldCheck size={14} />
          Sign up to subscribe to Pro. We never store your card details.
        </span>
      </form>
    </div>
  );
}
