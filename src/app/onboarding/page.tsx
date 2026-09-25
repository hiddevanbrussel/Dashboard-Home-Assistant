"use client";

import { useEffect } from "react";
import { useOnboardingStore, type OnboardingStep } from "@/stores/onboarding-store";
import { StepWelcome } from "@/components/onboarding/step-welcome";
import { StepName } from "@/components/onboarding/step-name";
import { StepConnect } from "@/components/onboarding/step-connect";
import { StepIntegrations } from "@/components/onboarding/step-integrations";
import { StepReady } from "@/components/onboarding/step-ready";

const STEPS = [StepWelcome, StepName, StepConnect, StepIntegrations, StepReady];
const OAUTH_RESUME_KEY = "ha_oauth_resume_step";

export default function OnboardingPage() {
  const step = useOnboardingStore((s) => s.step);
  const setStep = useOnboardingStore((s) => s.setStep);
  const CurrentStep = STEPS[Math.min(STEPS.length, Math.max(1, step)) - 1];

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(OAUTH_RESUME_KEY);
      if (!raw) return;
      sessionStorage.removeItem(OAUTH_RESUME_KEY);
      const n = Number(raw);
      if (n >= 1 && n <= STEPS.length) setStep(n as OnboardingStep);
    } catch {
      /* ignore */
    }
  }, [setStep]);

  return <CurrentStep />;
}
