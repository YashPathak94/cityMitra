"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    setLoading(false);

    if (!response.ok) {
      setError("Wrong password. Admin gate said nope.");
      return;
    }

    const nextPath = new URLSearchParams(window.location.search).get("next") || "/admin";
    router.replace(nextPath);
    router.refresh();
  }

  return (
    <main className="adminLoginPage">
      <Link className="secondaryButton" href="/">
        <ArrowLeft size={17} />
        Back to CityMitra
      </Link>
      <form className="adminLoginCard" onSubmit={login}>
        <span className="adminLock">
          <LockKeyhole size={22} />
        </span>
        <span className="sectionKicker">Admin Only</span>
        <h1>Sign in to CityMitra admin</h1>
        <p>Only admins can view activity, monetization signals, and edit admin settings.</p>
        <label htmlFor="adminPassword">Password</label>
        <input
          autoComplete="current-password"
          id="adminPassword"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter admin password"
          type="password"
          value={password}
        />
        {error && <strong className="loginError">{error}</strong>}
        <button className="primaryButton" disabled={loading} type="submit">
          <ShieldCheck size={18} />
          {loading ? "Checking" : "Unlock Admin"}
        </button>
      </form>
    </main>
  );
}
