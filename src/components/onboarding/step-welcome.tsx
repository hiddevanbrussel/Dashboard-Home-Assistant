"use client";

import { SoftOnboardingLayout } from "./soft-onboarding-layout";
import { useOnboardingStore, ONBOARDING_TOTAL_STEPS } from "@/stores/onboarding-store";
import { useTranslation } from "@/hooks/use-translation";

export function StepWelcome() {
  const { t } = useTranslation();
  const nextStep = useOnboardingStore((s) => s.nextStep);

  return (
    <SoftOnboardingLayout
      step={1}
      totalSteps={ONBOARDING_TOTAL_STEPS}
      question={t("onboarding.welcome.question")}
      hint={t("onboarding.welcome.hint")}
      footer={
        <button
          type="button"
          onClick={nextStep}
          className="rounded-full bg-accent-yellow px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm transition hover:opacity-90 dark:bg-accent-green"
        >
          {t("onboarding.welcome.cta")}
        </button>
      }
    >
      <ul className="mx-auto max-w-sm space-y-2 text-sm text-gray-600 dark:text-gray-300">
        <li className="flex gap-2">
          <span className="text-accent-yellow dark:text-accent-green" aria-hidden>
            ·
          </span>
          {t("onboarding.welcome.bullet1")}
        </li>
        <li className="flex gap-2">
          <span className="text-accent-yellow dark:text-accent-green" aria-hidden>
            ·
          </span>
          {t("onboarding.welcome.bullet2")}
        </li>
        <li className="flex gap-2">
          <span className="text-accent-yellow dark:text-accent-green" aria-hidden>
            ·
          </span>
          {t("onboarding.welcome.bullet3")}
        </li>
      </ul>
    </SoftOnboardingLayout>
  );
}
