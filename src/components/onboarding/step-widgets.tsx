"use client";

import { GlassCard } from "@/components/layout/glass-card";
import { OnboardingLayout } from "./onboarding-layout";
import { useOnboardingStore } from "@/stores/onboarding-store";

const WIDGET_TYPES = [
  "energy_usage",
  "light_control",
  "wifi",
  "solar_charge",
  "climate",
  "lighting_brightness",
  "media_card",
] as const;

export function StepWidgets() {
  const { widgets, entities, addWidget, updateWidget, removeWidget } = useOnboardingStore();

  return (
    <OnboardingLayout
      step={7}
      heroTitle="Widgets"
      heroSubtitle="Add and configure dashboard widgets. Set title, entity, and options per widget."
      rightCards={
        <GlassCard>
          <h3 className="text-card-title font-medium mb-2">Widget types</h3>
          <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
            {WIDGET_TYPES.map((t) => (
              <li key={t}>{t.replace(/_/g, " ")}</li>
            ))}
          </ul>
        </GlassCard>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {WIDGET_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                addWidget({
                  type,
                  title: type.replace(/_/g, " "),
                  entity_id: entities[0]?.entity_id ?? "",
                })
              }
              className="rounded-full bg-gray-200 dark:bg-white/10 px-3 py-1.5 text-sm font-medium hover:bg-accent-yellow dark:hover:bg-accent-green hover:text-gray-900"
            >
              + {type.replace(/_/g, " ")}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {widgets.map((w) => (
            <GlassCard key={w.id} className="flex flex-wrap items-center gap-4">
              <input
                type="text"
                value={w.title}
                onChange={(e) => updateWidget(w.id, { title: e.target.value })}
                className="rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-2 py-1 text-sm w-40"
                placeholder="Title"
              />
              <select
                value={w.entity_id}
                onChange={(e) => updateWidget(w.id, { entity_id: e.target.value })}
                className="rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-2 py-1 text-sm min-w-[200px]"
              >
                <option value="">Select entity</option>
                {entities.slice(0, 50).map((e) => (
                  <option key={e.entity_id} value={e.entity_id}>
                    {(e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id}
                  </option>
                ))}
              </select>
              <span className="text-xs text-gray-500">{w.type}</span>
              <button
                type="button"
                onClick={() => removeWidget(w.id)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </GlassCard>
          ))}
        </div>
      </div>
    </OnboardingLayout>
  );
}
