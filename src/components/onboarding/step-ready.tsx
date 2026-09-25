"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SoftOnboardingLayout } from "./soft-onboarding-layout";
import { useOnboardingStore, ONBOARDING_TOTAL_STEPS } from "@/stores/onboarding-store";
import { setOnboardingCompleted } from "@/lib/onboarding-completed";
import { useTranslation } from "@/hooks/use-translation";

export function StepReady() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dashboardId, dashboardName, prevStep } = useOnboardingStore();
  const [opening, setOpening] = useState(false);

  async function handleOpen() {
    setOpening(true);
    setOnboardingCompleted();
    if (dashboardId) {
      router.push(`/dashboards/${dashboardId}`);
      return;
    }
    try {
      const res = await fetch("/api/dashboard");
      const d = await res.json();
      if (d?.id) {
        router.push(`/dashboards/${d.id}`);
        return;
      }
    } catch {
      // fall through
    }
    router.push("/dashboards");
  }

  return (
    <SoftOnboardingLayout
      step={5}
      totalSteps={ONBOARDING_TOTAL_STEPS}
      question={t("onboarding.ready.question")}
      hint={t("onboarding.ready.hint").replace(
        "{name}",
        dashboardName || t("onboarding.name.default")
      )}
      footer={
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row-reverse">
          <button
            type="button"
            onClick={() => void handleOpen()}
            disabled={opening}
            className="rounded-full bg-accent-yellow px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm transition hover:opacity-90 disabled:opacity-50 dark:bg-accent-green"
          >
            {opening ? t("onboarding.ready.opening") : t("onboarding.ready.cta")}
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
      <div className="rounded-2xl border border-gray-200/80 bg-white/60 px-5 py-4 text-center text-sm text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
        {t("onboarding.ready.summary")}
      </div>
    </SoftOnboardingLayout>
  );
}
