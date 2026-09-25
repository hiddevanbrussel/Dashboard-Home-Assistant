"use client";

import { useEffect, useState } from "react";
import { SoftOnboardingLayout } from "./soft-onboarding-layout";
import { useOnboardingStore, ONBOARDING_TOTAL_STEPS } from "@/stores/onboarding-store";
import { useTranslation } from "@/hooks/use-translation";

type ConnectionStatus = {
  baseUrl: string | null;
  source: "supervisor" | "manual" | null;
  addon?: boolean;
  ok?: boolean;
  error?: string;
};

export function StepConnect() {
  const { t } = useTranslation();
  const { connection, setConnection, setTestResult, testResult, nextStep, prevStep } =
    useOnboardingStore();
  const [testing, setTesting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [addonStatus, setAddonStatus] = useState<ConnectionStatus | null>(null);
  const [addonBusy, setAddonBusy] = useState(true);
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/ha/connection");
        const data = (await res.json()) as ConnectionStatus;
        if (cancelled) return;
        setAddonStatus(data);
        if (data.addon && (data.source === "supervisor" || !data.baseUrl)) {
          const probe = await fetch("/api/ha/connection?test=1");
          const probed = (await probe.json()) as ConnectionStatus;
          if (cancelled) return;
          setAddonStatus(probed);
          if (probed.source === "supervisor" && probed.ok !== false) {
            const save = await fetch("/api/ha/connection", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ useSupervisor: true }),
            });
            const saved = await save.json().catch(() => ({}));
            if (cancelled) return;
            if (save.ok && saved.connectionId) {
              setConnection({
                baseUrl: probed.baseUrl ?? "http://supervisor/core",
                token: "",
                connectionId: saved.connectionId,
              });
              setTestResult({ ok: true });
            } else if (probed.ok) {
              setTestResult({ ok: true });
              setConnection({
                baseUrl: probed.baseUrl ?? "http://supervisor/core",
                token: "",
              });
            } else {
              setTestResult({
                ok: false,
                error: probed.error ?? saved.error ?? t("onboarding.connect.supervisorFail"),
              });
              setShowManual(true);
            }
          } else if (probed.error) {
            setTestResult({ ok: false, error: probed.error });
            setShowManual(true);
          }
        } else if (!data.addon) {
          setShowManual(true);
        }
      } catch {
        if (!cancelled) {
          setAddonStatus({ baseUrl: null, source: null, addon: false });
          setShowManual(true);
        }
      } finally {
        if (!cancelled) setAddonBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setConnection, setTestResult, t]);

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    setSaveError(null);
    try {
      const res = await fetch("/api/ha/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseUrl: connection.baseUrl,
          token: connection.token,
        }),
      });
      const data = await res.json();
      if (data.ok) setTestResult({ ok: true });
      else setTestResult({ ok: false, error: data.error ?? t("onboarding.connect.fail") });
    } catch (err) {
      setTestResult({
        ok: false,
        error: err instanceof Error ? err.message : t("onboarding.connect.fail"),
      });
    } finally {
      setTesting(false);
    }
  }

  async function handleSaveAndContinue() {
    if (!testResult?.ok) return;
    setSaveError(null);
    setTesting(true);
    try {
      const res = await fetch("/api/ha/connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          addonStatus?.addon && addonStatus.source === "supervisor"
            ? { useSupervisor: true }
            : {
                baseUrl: connection.baseUrl,
                token: connection.token,
              }
        ),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.connectionId) {
        setConnection({ connectionId: data.connectionId });
        nextStep();
      } else if (res.ok) {
        nextStep();
      } else {
        setSaveError(data.error ?? t("onboarding.connect.saveFail"));
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t("onboarding.connect.saveFail"));
    } finally {
      setTesting(false);
    }
  }

  const supervisorLinked =
    !!addonStatus?.addon &&
    addonStatus.source === "supervisor" &&
    testResult?.ok === true;

  if (addonBusy) {
    return (
      <SoftOnboardingLayout
        step={3}
        totalSteps={ONBOARDING_TOTAL_STEPS}
        question={t("onboarding.connect.question")}
        hint={t("onboarding.connect.checking")}
      >
        <div className="flex justify-center py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-yellow border-t-transparent dark:border-accent-green" />
        </div>
      </SoftOnboardingLayout>
    );
  }

  if (supervisorLinked && !showManual) {
    return (
      <SoftOnboardingLayout
        step={3}
        totalSteps={ONBOARDING_TOTAL_STEPS}
        question={t("onboarding.connect.linkedQuestion")}
        hint={t("onboarding.connect.linkedHint")}
        footer={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => void handleSaveAndContinue()}
              disabled={testing}
              className="rounded-full bg-accent-yellow px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm transition hover:opacity-90 disabled:opacity-50 dark:bg-accent-green"
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
        <div className="rounded-2xl border border-green-200/80 bg-green-50/80 px-4 py-3 text-center text-sm text-green-800 dark:border-green-500/30 dark:bg-green-950/30 dark:text-green-200">
          {t("onboarding.connect.linkedOk")}
        </div>
        {saveError ? (
          <p className="text-center text-sm text-red-600 dark:text-red-400">{saveError}</p>
        ) : null}
      </SoftOnboardingLayout>
    );
  }

  return (
    <SoftOnboardingLayout
      step={3}
      totalSteps={ONBOARDING_TOTAL_STEPS}
      question={t("onboarding.connect.question")}
      hint={
        addonStatus?.addon
          ? t("onboarding.connect.manualAddonHint")
          : t("onboarding.connect.manualHint")
      }
      footer={
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row-reverse">
          {testResult?.ok ? (
            <button
              type="button"
              onClick={() => void handleSaveAndContinue()}
              disabled={testing}
              className="rounded-full bg-accent-yellow px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm transition hover:opacity-90 disabled:opacity-50 dark:bg-accent-green"
            >
              {t("onboarding.continue")}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void handleTest()}
              disabled={testing || !connection.baseUrl.trim() || !connection.token.trim()}
              className="rounded-full bg-accent-yellow px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm transition hover:opacity-90 disabled:opacity-50 dark:bg-accent-green"
            >
              {testing ? t("onboarding.connect.testing") : t("onboarding.connect.test")}
            </button>
          )}
          <button
            type="button"
            onClick={nextStep}
            className="rounded-full px-6 py-3 text-sm font-medium text-gray-600 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/10"
          >
            {t("onboarding.connect.later")}
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
        <div>
          <label htmlFor="baseUrl" className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            {t("onboarding.connect.url")}
          </label>
          <input
            id="baseUrl"
            type="url"
            value={connection.baseUrl}
            onChange={(e) => {
              setSaveError(null);
              setConnection({ baseUrl: e.target.value });
            }}
            placeholder="http://homeassistant.local:8123"
            className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-accent-yellow/40 dark:border-white/15 dark:bg-white/10 dark:text-white dark:focus:ring-accent-green/30"
          />
        </div>
        <div>
          <label htmlFor="token" className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            {t("onboarding.connect.token")}
          </label>
          <input
            id="token"
            type="password"
            value={connection.token}
            onChange={(e) => {
              setSaveError(null);
              setConnection({ token: e.target.value });
            }}
            placeholder={t("onboarding.connect.tokenPlaceholder")}
            className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-accent-yellow/40 dark:border-white/15 dark:bg-white/10 dark:text-white dark:focus:ring-accent-green/30"
          />
        </div>
        {saveError ? (
          <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
        ) : null}
        {testResult && !saveError ? (
          <div
            className={`rounded-xl px-3 py-2 text-sm ${
              testResult.ok
                ? "bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-200"
                : "bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-200"
            }`}
          >
            {testResult.ok ? t("onboarding.connect.ok") : testResult.error}
          </div>
        ) : null}
      </div>
    </SoftOnboardingLayout>
  );
}
