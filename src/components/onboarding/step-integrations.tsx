"use client";

import { useState } from "react";
import { SoftOnboardingLayout } from "./soft-onboarding-layout";
import { useOnboardingStore, ONBOARDING_TOTAL_STEPS } from "@/stores/onboarding-store";
import { useMusicAssistantStore } from "@/stores/music-assistant-store";
import { useImmichStore } from "@/stores/immich-store";
import { setScreensaverPexelsEnabled, getScreensaverPexelsEnabled } from "@/stores/screensaver-store";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

type ExtraId = "music" | "immich" | "pexels";

export function StepIntegrations() {
  const { t } = useTranslation();
  const nextStep = useOnboardingStore((s) => s.nextStep);
  const prevStep = useOnboardingStore((s) => s.prevStep);

  const maEnabled = useMusicAssistantStore((s) => s.enabled);
  const maBaseUrl = useMusicAssistantStore((s) => s.baseUrl);
  const setMaEnabled = useMusicAssistantStore((s) => s.setEnabled);
  const setMaBaseUrl = useMusicAssistantStore((s) => s.setBaseUrl);

  const immichEnabled = useImmichStore((s) => s.enabled);
  const setImmichEnabled = useImmichStore((s) => s.setEnabled);

  const [pexelsOn, setPexelsOn] = useState(() => getScreensaverPexelsEnabled());
  const [expanded, setExpanded] = useState<ExtraId | null>(maEnabled ? "music" : null);

  function toggleExtra(id: ExtraId) {
    if (id === "music") {
      const next = !maEnabled;
      setMaEnabled(next);
      setExpanded(next ? "music" : null);
      return;
    }
    if (id === "immich") {
      const next = !immichEnabled;
      setImmichEnabled(next);
      setExpanded(next ? "immich" : null);
      return;
    }
    const next = !pexelsOn;
    setPexelsOn(next);
    setScreensaverPexelsEnabled(next);
    setExpanded(next ? "pexels" : null);
  }

  const extras: { id: ExtraId; title: string; blurb: string; on: boolean }[] = [
    {
      id: "music",
      title: t("onboarding.extras.musicTitle"),
      blurb: t("onboarding.extras.musicBlurb"),
      on: maEnabled,
    },
    {
      id: "immich",
      title: t("onboarding.extras.immichTitle"),
      blurb: t("onboarding.extras.immichBlurb"),
      on: immichEnabled,
    },
    {
      id: "pexels",
      title: t("onboarding.extras.pexelsTitle"),
      blurb: t("onboarding.extras.pexelsBlurb"),
      on: pexelsOn,
    },
  ];

  return (
    <SoftOnboardingLayout
      step={4}
      totalSteps={ONBOARDING_TOTAL_STEPS}
      question={t("onboarding.extras.question")}
      hint={t("onboarding.extras.hint")}
      footer={
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row-reverse">
          <button
            type="button"
            onClick={nextStep}
            className="rounded-full bg-accent-yellow px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm transition hover:opacity-90 dark:bg-accent-green"
          >
            {t("onboarding.continue")}
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
      <div className="space-y-3">
        {extras.map((extra) => (
          <div
            key={extra.id}
            className={cn(
              "rounded-2xl border px-4 py-3 transition",
              extra.on
                ? "border-gray-900/20 bg-white/80 dark:border-accent-green/40 dark:bg-white/10"
                : "border-gray-200/80 bg-white/50 dark:border-white/10 dark:bg-white/5"
            )}
          >
            <button
              type="button"
              onClick={() => toggleExtra(extra.id)}
              className="flex w-full items-start gap-3 text-left"
              aria-pressed={extra.on}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs",
                  extra.on
                    ? "border-gray-900 bg-gray-900 text-white dark:border-accent-green dark:bg-accent-green dark:text-gray-900"
                    : "border-gray-300 dark:border-white/30"
                )}
                aria-hidden
              >
                {extra.on ? "✓" : ""}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                  {extra.title}
                </span>
                <span className="mt-0.5 block text-sm text-gray-600 dark:text-gray-400">
                  {extra.blurb}
                </span>
              </span>
            </button>

            {extra.id === "music" && expanded === "music" && maEnabled ? (
              <div className="mt-3 border-t border-gray-200/70 pt-3 dark:border-white/10">
                <label htmlFor="ma-url" className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                  {t("onboarding.extras.musicUrl")}
                </label>
                <input
                  id="ma-url"
                  type="url"
                  value={maBaseUrl}
                  onChange={(e) => setMaBaseUrl(e.target.value)}
                  placeholder="http://homeassistant.local:8095"
                  className="w-full rounded-xl border border-gray-200 bg-white/90 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-accent-yellow/40 dark:border-white/15 dark:bg-black/20 dark:text-white dark:focus:ring-accent-green/30"
                />
              </div>
            ) : null}

            {extra.id === "immich" && expanded === "immich" && immichEnabled ? (
              <p className="mt-3 border-t border-gray-200/70 pt-3 text-xs text-gray-500 dark:border-white/10 dark:text-gray-400">
                {t("onboarding.extras.immichLater")}
              </p>
            ) : null}

            {extra.id === "pexels" && expanded === "pexels" && pexelsOn ? (
              <p className="mt-3 border-t border-gray-200/70 pt-3 text-xs text-gray-500 dark:border-white/10 dark:text-gray-400">
                {t("onboarding.extras.pexelsLater")}
              </p>
            ) : null}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-gray-500 dark:text-gray-400">{t("onboarding.extras.skipHint")}</p>
    </SoftOnboardingLayout>
  );
}
