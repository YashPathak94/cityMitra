"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { trackActivity } from "@/lib/tracking";
import { Typewriter } from "./Typewriter";
import LogoMark from "@/app/components/Logo";

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

const asideQuotes = [
  "Discover any Indian city like a local.",
  "Book hotels, trains and flights in one tap.",
  "Your AI city guide, ready before you arrive.",
  "From wholesale markets to weekend getaways."
];

type Mode = "signin" | "signup";

export default function AuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const auth = params.get("auth");
    if (auth === "google_failed") setError("Google sign-in failed. Please try again.");
    if (auth === "google_unavailable") setError("Google sign-in is not enabled yet.");

    // already signed in? send them home.
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { user: { email: string } | null }) => {
        if (data.user) router.replace("/pro");
      })
      .catch(() => undefined);
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const endpoint = mode === "signup" ? "signup" : "login";
      const response = await fetch(`/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string; email?: string };
      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      trackActivity({ type: mode === "signup" ? "auth_signup" : "auth_login", label: (data.email || email).split("@")[1] });
      router.push("/");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="authScreen">
      <div className="authFormSide">
        <Link className="authBrand" href="/" aria-label="CityMitra home">
          <span className="brandMark authBrandMark brandMarkRich">
            <LogoMark size={30} />
          </span>
          CityMitra
        </Link>

        <div className="authCard">
          <div className="authCardHead">
            <h1>{mode === "signin" ? "Sign in to your account" : "Create your account"}</h1>
            <p>{mode === "signin" ? "Enter your email below to sign in" : "Enter your details below to get started"}</p>
          </div>

          <form className="authPanelForm" onSubmit={submit} autoComplete="on">
            <label htmlFor="authPanelEmail">Email</label>
            <input
              id="authPanelEmail"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <label htmlFor="authPanelPassword">Password</label>
            <div className="authPasswordWrap">
              <input
                id="authPanelPassword"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="authPasswordToggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && <p className="authPanelError">{error}</p>}

            <button className="authPanelSubmit" type="submit" disabled={busy}>
              {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <p className="authToggleLine">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}>
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>

          {googleEnabled && (
            <>
              <div className="authPanelDivider"><span>Or continue with</span></div>
              <a className="authGoogleBtn" href="/api/auth/google/start">
                <GoogleIcon />
                Continue with Google
              </a>
            </>
          )}
        </div>
      </div>

      <aside className="authAside" aria-hidden="true">
        <div className="authAsideGlow" />
        <blockquote className="authAsideQuote">
          <p>
            “<Typewriter text={asideQuotes} loop speed={55} deleteSpeed={28} delay={1800} />”
          </p>
          <cite>— CityMitra</cite>
        </blockquote>
      </aside>
    </div>
  );
}
