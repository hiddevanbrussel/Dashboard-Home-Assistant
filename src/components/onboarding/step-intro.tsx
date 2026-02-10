"use client";

import { OnboardingFullscreenLayout } from "./onboarding-fullscreen-layout";

export function StepIntro() {
  return (
    <OnboardingFullscreenLayout
      step={1}
      title="Welcome"
      subtitle="Set up your dashboard in a few steps. You will connect Home Assistant, choose entities, set up rooms, name your dashboard, and save."
    >
      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
        <li>Connect – Base URL and Long-Lived Access Token</li>
        <li>Fetch entities – Load and select which entities to use (click tags)</li>
        <li>Fetch rooms – Import areas or create rooms</li>
        <li>Name – Give your dashboard a name</li>
        <li>Save – Create dashboard and finish</li>
      </ol>
    </OnboardingFullscreenLayout>
  );
}
