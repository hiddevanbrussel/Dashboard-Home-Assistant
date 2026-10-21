"use client";

import { FormEvent, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";

export default function LoginPage() {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError(res.status === 429 ? t("login.rateLimited") : t("login.error"));
        return;
      }
      const next = new URLSearchParams(window.location.search).get("next") || "/";
      const target = next.startsWith("/") && !next.startsWith("//") ? next : "/";
      window.location.assign(target);
    } catch {
      setError(t("login.error"));
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl bg-white/10 p-8">
        <h1 className="text-2xl font-semibold text-white">{t("login.title")}</h1>
        <p className="mt-2 text-sm text-white/70">{t("login.hint")}</p>
        <label className="sr-only" htmlFor="dashboard-username">
          Username
        </label>
        <input
          id="dashboard-username"
          name="username"
          type="text"
          autoComplete="username"
          value="dashboard"
          readOnly
          className="sr-only"
        />
        <label className="mt-6 block text-sm text-white/80" htmlFor="dashboard-password">
          {t("login.password")}
        </label>
        <input
          id="dashboard-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 h-14 w-full rounded-2xl border border-white/15 bg-black/30 px-4 text-lg text-white"
          required
        />
        {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-6 h-14 w-full rounded-2xl bg-white text-lg font-semibold text-black disabled:opacity-60"
        >
          {pending ? t("login.pending") : t("login.submit")}
        </button>
      </form>
    </main>
  );
}
