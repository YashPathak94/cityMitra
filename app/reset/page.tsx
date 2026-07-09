"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, FormEvent, useState } from "react";
import LogoMark from "@/app/components/Logo";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const email = params.get("email") || "";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password })
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(data.error || "Could not reset the password.");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/pro"), 1500);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!token || !email) {
    return <p className="authError">This reset link is incomplete. Please request a new one from the <Link href="/pro">Pro page</Link>.</p>;
  }

  if (done) {
    return <div className="proSuccess" role="status"><strong>Password updated. Taking you to CityMitra Pro…</strong></div>;
  }

  return (
    <form className="authForm" onSubmit={submit}>
      <label htmlFor="newPassword">New password</label>
      <input
        id="newPassword"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="At least 8 characters"
      />
      {error && <p className="authError">{error}</p>}
      <button className="primaryButton" type="submit" disabled={busy}>
        {busy ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}

export default function ResetPage() {
  return (
    <main className="pageShellMain">
      <article className="policyPage" style={{ maxWidth: 460 }}>
        <Link className="brand" href="/" aria-label="CityMitra home">
          <span className="brandMark brandMarkRich">
            <LogoMark />
          </span>
          CityMitra
        </Link>
        <h1>Reset your password</h1>
        <Suspense fallback={<p>Loading…</p>}>
          <ResetForm />
        </Suspense>
      </article>
    </main>
  );
}
