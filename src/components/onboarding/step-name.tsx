"use client";

import { useState } from "react";
import { SoftOnboardingLayout } from "./soft-onboarding-layout";
import { useOnboardingStore, ONBOARDING_TOTAL_STEPS } from "@/stores/onboarding-store";
import { useTranslation } from "@/hooks/use-translation";

export function StepName() {
  const { t } = useTranslation();
  const { dashboardName, dashboardId, setDashboard, setDashboardName, nextStep, prevStep } =
    useOnboardingStore();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    if (dashboardId) {
      nextStep();
      return;
    }
    const name = dashboardName.trim() || t("onboarding.name.default");
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, theme: "auto" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? t("onboarding.name.createError"));
        return;
      }
      if (data?.id) {
        setDashboard(data.id, name);
        nextStep();
      } else {
        setError(t("onboarding.name.createError"));
      }
    } catch {
      setError(t("onboarding.name.createError"));
    } finally {
      setCreating(false);
    }
  }

  return (
    <SoftOnboardingLayout
      step={2}
      totalSteps={ONBOARDING_TOTAL_STEPS}
      question={t("onboarding.name.question")}
      hint={t("onboarding.name.hint")}
      footer={
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleContinue}
            disabled={creating}
            className="rounded-full bg-accent-yellow px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm transition hover:opacity-90 disabled:opacity-50 dark:bg-accent-green"
          >
            {creating ? t("onboarding.name.creating") : t("onboarding.continue")}
          </button>
          <button
            type="button"
            onClick={prevStep}
            className="rounded-full px-6 py-3 text-sm font-medium text-gray-600 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/10"
          >
            {t("onboarding.back")}
          </button>
        </div>
      }
    >
      <label htmlFor="dashboard-name" className="sr-only">
        {t("onboarding.name.label")}
      </label>
      <input
        id="dashboard-name"
        type="text"
        value={dashboardName}
        onChange={(e) => setDashboardName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") void handleContinue();
        }}
        placeholder={t("onboarding.name.placeholder")}
        autoFocus
        className="w-full rounded-2xl border border-gray-200 bg-white/80 px-5 py-4 text-center text-lg text-gray-900 outline-none ring-accent-yellow/40 placeholder:text-gray-400 focus:ring-2 dark:border-white/15 dark:bg-white/10 dark:text-white dark:ring-accent-green/30"
      />
      {error ? <p className="text-center text-sm text-red-600 dark:text-red-400">{error}</p> : null}
    </SoftOnboardingLayout>
  );
}
