"use client";

import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { StepIntro } from "@/components/onboarding/step-intro";
import { StepConnect } from "@/components/onboarding/step-connect";
import { StepDiscovery } from "@/components/onboarding/step-discovery";
import { StepRooms } from "@/components/onboarding/step-rooms";
import { StepCreateDashboard } from "@/components/onboarding/step-create-dashboard";
import { StepDone } from "@/components/onboarding/step-done";
import { setOnboardingCompleted } from "@/lib/onboarding-completed";

const STEPS = [
  StepIntro,
  StepConnect,
  StepDiscovery,
  StepRooms,
  StepCreateDashboard,
  StepDone,
];

export default function OnboardingPage() {
  const router = useRouter();
  const { step, nextStep, prevStep } = useOnboardingStore();
  const CurrentStep = STEPS[step - 1];

  function handleSkip() {
    setOnboardingCompleted();
    router.push("/dashboards");
  }

  return (
    <>
      <CurrentStep />
      <div className="fixed bottom-6 right-6 flex gap-2 z-40">
        {step > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 px-4 py-2 text-sm font-medium shadow-lg"
          >
            Previous
          </button>
        )}
        {step < 6 && (
          <button
            type="button"
            onClick={nextStep}
            className="rounded-full bg-accent-yellow dark:bg-accent-green px-4 py-2 text-sm font-medium text-gray-900 shadow-lg"
          >
            Next
          </button>
        )}
        <button
          type="button"
          onClick={handleSkip}
          className="rounded-full bg-gray-200 dark:bg-white/10 px-4 py-2 text-sm font-medium"
        >
          Skip
        </button>
      </div>
    </>
  );
}
