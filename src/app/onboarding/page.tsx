"use client";

import { useOnboardingStore } from "@/stores/onboarding-store";
import { StepWelcome } from "@/components/onboarding/step-welcome";
import { StepName } from "@/components/onboarding/step-name";
import { StepConnect } from "@/components/onboarding/step-connect";
import { StepIntegrations } from "@/components/onboarding/step-integrations";
import { StepReady } from "@/components/onboarding/step-ready";

const STEPS = [StepWelcome, StepName, StepConnect, StepIntegrations, StepReady];

export default function OnboardingPage() {
  const step = useOnboardingStore((s) => s.step);
  const CurrentStep = STEPS[Math.min(STEPS.length, Math.max(1, step)) - 1];

  return <CurrentStep />;
}
