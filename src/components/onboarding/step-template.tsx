"use client";

import { GlassCard } from "@/components/layout/glass-card";
import { OnboardingLayout } from "./onboarding-layout";
import { useOnboardingStore } from "@/stores/onboarding-store";
import type { TemplateId } from "@/stores/onboarding-store";

const TEMPLATES: { id: TemplateId; name: string; desc: string }[] = [
  { id: "overview", name: "Overview", desc: "Hero left, stacked cards right" },
  { id: "rooms", name: "Rooms", desc: "Per-room sections" },
  { id: "energy", name: "Energy", desc: "Energy cards and charts prominent" },
];

export function StepTemplate() {
  const { template, setTemplate } = useOnboardingStore();

  return (
    <OnboardingLayout
      step={5}
      heroTitle="Choose template"
      heroSubtitle="Pick a dashboard layout. You can change it later."
      rightCards={
        <GlassCard>
          <h3 className="text-card-title font-medium mb-2">Preview</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Template: {TEMPLATES.find((t) => t.id === template)?.name ?? template}
          </p>
          <div className="mt-3 h-24 rounded-lg bg-gray-200/50 dark:bg-white/10 flex items-center justify-center">
            <span className="text-xs text-gray-500">Layout preview</span>
          </div>
        </GlassCard>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTemplate(t.id)}
            className={`rounded-card border-2 p-4 text-left transition-all ${
              template === t.id
                ? "border-accent-yellow dark:border-accent-green bg-accent-yellow/20 dark:bg-accent-green/20"
                : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
            }`}
          >
            <span className="font-medium block">{t.name}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{t.desc}</span>
          </button>
        ))}
      </div>
    </OnboardingLayout>
  );
}
