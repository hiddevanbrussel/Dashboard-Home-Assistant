"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { useTranslation } from "@/hooks/use-translation";
import { withBasePath } from "@/lib/base-path";
import { postLoginTarget } from "@/lib/session-redirect";

export default function LoginPage() {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const res = await fetch(withBasePath("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError(res.status === 429 ? t("login.rateLimited") : t("login.error"));
        return;
      }
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.assign(postLoginTarget(next, window.location.pathname));
    } catch {
      setError(t("login.error"));
    } finally {
      setPending(false);
    }
  }

  return (
    <ThemeProvider>
      <main className="flex min-h-screen items-center justify-center bg-page-light px-4 py-8 text-gray-900 dark:bg-dark-page dark:text-gray-100">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-glass dark:border-gray-700 dark:bg-dark-cardSolid"
        >
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{t("login.title")}</h1>
          <p id="login-hint" className="mt-2 text-sm text-gray-700 dark:text-gray-200">
            {t("login.hint")}
          </p>
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
          <label className="mt-6 block text-sm text-gray-800 dark:text-gray-100" htmlFor="dashboard-password">
            {t("login.password")}
          </label>
          <div className="relative mt-2">
            <input
              id="dashboard-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-describedby="login-hint"
              aria-invalid={error ? true : undefined}
              className="h-14 w-full rounded-2xl border-2 border-gray-600 bg-white px-4 pr-14 text-lg text-gray-900 dark:border-gray-300 dark:bg-dark-page dark:text-gray-100"
              required
            />
            <button
              type="button"
              className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-gray-800 dark:text-gray-100"
              aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
          {error ? (
            <p role="alert" className="mt-3 text-sm text-red-800 dark:text-red-200">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="mt-6 h-14 w-full rounded-2xl bg-gray-900 text-lg font-semibold text-gray-50 disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900"
          >
            {pending ? t("login.pending") : t("login.submit")}
          </button>
        </form>
      </main>
    </ThemeProvider>
  );
}
