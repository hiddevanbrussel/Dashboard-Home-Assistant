"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { useThemeStore } from "@/stores/theme-store";

const gradientLight =
  "linear-gradient(135deg, rgba(246,210,92,0.4) 0%, rgba(180,139,255,0.3) 50%, rgba(100,120,140,0.5) 100%)";
const gradientDark =
  "linear-gradient(135deg, rgba(43,63,75,0.9) 0%, rgba(31,47,58,0.95) 50%, rgba(107,228,107,0.15) 100%)";

export function StepCreateDashboard() {
  const { dashboardName, dashboardId, setDashboard, setDashboardName, nextStep } =
    useOnboardingStore();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resolved = useThemeStore((s) => s.resolved);
  const bg = resolved === "dark" ? gradientDark : gradientLight;

  async function handleCreate() {
    const name = dashboardName.trim() || "My dashboard";
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, theme: "auto" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Failed to create");
        return;
      }
      if (data?.id) {
        setDashboard(data.id, name);
        nextStep();
      } else {
        setError("No dashboard id received");
      }
    } catch {
      setError("Request failed");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-page-light dark:bg-dark-page">
      <div
        className="absolute inset-0 opacity-90 dark:opacity-95"
        style={{ background: bg }}
        aria-hidden
      />
      <main className="relative z-10 max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
          Name your dashboard
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed">
          Give your dashboard a name. In the next step you will save and finish.
        </p>
        <div className="mt-8 max-w-sm mx-auto text-left">
          <label htmlFor="dashboard-name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
            Dashboard name
          </label>
          <input
            id="dashboard-name"
            type="text"
            value={dashboardName}
            onChange={(e) => setDashboardName(e.target.value)}
            placeholder="My dashboard"
            className="w-full rounded-xl border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 px-4 py-3 text-base text-gray-900 dark:text-white placeholder:text-gray-500"
            disabled={!!dashboardId}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleCreate}
          disabled={creating || !!dashboardId}
          className="mt-10 inline-block rounded-full bg-accent-yellow dark:bg-accent-green px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none"
        >
          {creating ? "Creating…" : dashboardId ? "Created" : "Create dashboard"}
        </button>
      </main>
    </div>
  );
}
