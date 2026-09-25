"use client";

import { useEffect, useState } from "react";
import { SoftOnboardingLayout } from "./soft-onboarding-layout";
import { useOnboardingStore, ONBOARDING_TOTAL_STEPS } from "@/stores/onboarding-store";
import { useTranslation } from "@/hooks/use-translation";
import { withBasePath } from "@/lib/base-path";

type ConnectionStatus = {
  baseUrl: string | null;
  source: "supervisor" | "manual" | null;
  addon?: boolean;
  ok?: boolean;
  error?: string;
};

type DiscoveredInstance = {
  baseUrl: string;
  name: string;
  source: string;
};

const OAUTH_RESUME_KEY = "ha_oauth_resume_step";

export function StepConnect() {
  const { t } = useTranslation();
  const { connection, setConnection, setTestResult, testResult, nextStep, prevStep } =
    useOnboardingStore();
  const [testing, setTesting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [addonStatus, setAddonStatus] = useState<ConnectionStatus | null>(null);
  const [addonBusy, setAddonBusy] = useState(true);
  const [showManual, setShowManual] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [instances, setInstances] = useState<DiscoveredInstance[]>([]);
  const [discoverError, setDiscoverError] = useState<string | null>(null);
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [oauthBusy, setOauthBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Resume after IndieAuth redirect
        const params = new URLSearchParams(window.location.search);
        const oauth = params.get("ha_oauth");
        if (oauth === "ok") {
          const haBase = params.get("ha_base") || connection.baseUrl;
          const statusRes = await fetch("/api/ha/connection");
          const status = (await statusRes.json()) as ConnectionStatus;
          if (cancelled) return;
          setAddonStatus(status);
          setConnection({
            baseUrl: status.baseUrl ?? haBase,
            token: "",
            connectionId: undefined,
          });
          setTestResult({ ok: true });
          setAddonBusy(false);
          setShowManual(false);
          // Clean query string without full reload
          const clean = window.location.pathname;
          window.history.replaceState({}, "", clean);
          return;
        }
        if (oauth === "error") {
          const msg = params.get("ha_oauth_error") || t("onboarding.connect.oauthFail");
          setSaveError(msg);
          setShowManual(true);
          window.history.replaceState({}, "", window.location.pathname);
        }

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
          // Soft discover HA on the LAN
          setDiscovering(true);
          try {
            const dRes = await fetch("/api/ha/discover");
            const dData = (await dRes.json()) as {
              instances?: DiscoveredInstance[];
              error?: string;
            };
            if (!cancelled) {
              setInstances(dData.instances ?? []);
              if (dData.error) setDiscoverError(dData.error);
              if ((dData.instances?.length ?? 0) === 1) {
                setConnection({ baseUrl: dData.instances![0].baseUrl });
              }
            }
          } catch {
            if (!cancelled) setDiscoverError(t("onboarding.connect.discoverFail"));
          } finally {
            if (!cancelled) setDiscovering(false);
          }
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
      // OAuth / supervisor already persisted the connection — just continue when no token in form
      if (
        (addonStatus?.addon && addonStatus.source === "supervisor") ||
        (!connection.token.trim() && connection.baseUrl)
      ) {
        const statusRes = await fetch("/api/ha/connection");
        const status = (await statusRes.json()) as ConnectionStatus;
        if (status.baseUrl) {
          nextStep();
          return;
        }
      }

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

  function startOauthLogin(baseUrl: string) {
    const url = baseUrl.trim();
    if (!url) return;
    setOauthBusy(true);
    setSaveError(null);
    try {
      sessionStorage.setItem(OAUTH_RESUME_KEY, "3");
    } catch {
      /* ignore */
    }
    const returnTo = encodeURIComponent("/onboarding");
    const start = withBasePath(
      `/api/ha/oauth/start?baseUrl=${encodeURIComponent(url)}&returnTo=${returnTo}`
    );
    window.location.href = start;
  }

  async function rediscover() {
    setDiscovering(true);
    setDiscoverError(null);
    try {
      const q = connection.baseUrl.trim()
        ? `?url=${encodeURIComponent(connection.baseUrl.trim())}`
        : "";
      const dRes = await fetch(`/api/ha/discover${q}`);
      const dData = (await dRes.json()) as { instances?: DiscoveredInstance[]; error?: string };
      setInstances(dData.instances ?? []);
      if (dData.error) setDiscoverError(dData.error);
    } catch {
      setDiscoverError(t("onboarding.connect.discoverFail"));
    } finally {
      setDiscovering(false);
    }
  }

  const supervisorLinked =
    !!addonStatus?.addon &&
    addonStatus.source === "supervisor" &&
    testResult?.ok === true;

  const oauthLinked = !addonStatus?.addon && testResult?.ok === true && !connection.token.trim();

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

  if ((supervisorLinked || oauthLinked) && !showManual) {
    return (
      <SoftOnboardingLayout
        step={3}
        totalSteps={ONBOARDING_TOTAL_STEPS}
        question={
          supervisorLinked
            ? t("onboarding.connect.linkedQuestion")
            : t("onboarding.connect.oauthLinkedQuestion")
        }
        hint={
          supervisorLinked
            ? t("onboarding.connect.linkedHint")
            : t("onboarding.connect.oauthLinkedHint")
        }
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
          {supervisorLinked
            ? t("onboarding.connect.linkedOk")
            : t("onboarding.connect.oauthLinkedOk")}
        </div>
        {connection.baseUrl ? (
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">{connection.baseUrl}</p>
        ) : null}
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
          : t("onboarding.connect.discoverHint")
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
          ) : showTokenForm ? (
            <button
              type="button"
              onClick={() => void handleTest()}
              disabled={testing || !connection.baseUrl.trim() || !connection.token.trim()}
              className="rounded-full bg-accent-yellow px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm transition hover:opacity-90 disabled:opacity-50 dark:bg-accent-green"
            >
              {testing ? t("onboarding.connect.testing") : t("onboarding.connect.test")}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => startOauthLogin(connection.baseUrl)}
              disabled={oauthBusy || !connection.baseUrl.trim()}
              className="rounded-full bg-accent-yellow px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm transition hover:opacity-90 disabled:opacity-50 dark:bg-accent-green"
            >
              {oauthBusy ? t("onboarding.connect.oauthStarting") : t("onboarding.connect.oauthLogin")}
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
      <div className="space-y-4">
        {!addonStatus?.addon ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {t("onboarding.connect.discovered")}
              </p>
              <button
                type="button"
                onClick={() => void rediscover()}
                disabled={discovering}
                className="text-xs font-medium text-gray-600 underline-offset-2 hover:underline disabled:opacity-50 dark:text-gray-300"
              >
                {discovering ? t("onboarding.connect.discovering") : t("onboarding.connect.rediscover")}
              </button>
            </div>
            {discovering && instances.length === 0 ? (
              <div className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white/50 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
                <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-accent-yellow border-t-transparent dark:border-accent-green" />
                {t("onboarding.connect.discovering")}
              </div>
            ) : null}
            {instances.length > 0 ? (
              <ul className="space-y-2">
                {instances.map((inst) => {
                  const selected = connection.baseUrl === inst.baseUrl;
                  return (
                    <li key={inst.baseUrl}>
                      <button
                        type="button"
                        onClick={() => {
                          setSaveError(null);
                          setTestResult(null);
                          setConnection({ baseUrl: inst.baseUrl });
                        }}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition ${
                          selected
                            ? "border-accent-yellow/60 bg-accent-yellow/10 dark:border-accent-green/50 dark:bg-accent-green/10"
                            : "border-gray-200/80 bg-white/60 hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">
                            {inst.name}
                          </span>
                          <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                            {inst.baseUrl}
                          </span>
                        </span>
                        {selected ? (
                          <span className="shrink-0 text-xs font-semibold text-gray-700 dark:text-gray-200">
                            {t("onboarding.connect.selected")}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : !discovering ? (
              <p className="rounded-xl border border-dashed border-gray-200 px-4 py-3 text-sm text-gray-500 dark:border-white/15 dark:text-gray-400">
                {discoverError ?? t("onboarding.connect.discoverEmpty")}
              </p>
            ) : null}
          </div>
        ) : null}

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
              setTestResult(null);
              setConnection({ baseUrl: e.target.value });
            }}
            placeholder="http://homeassistant.local:8123"
            className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-accent-yellow/40 dark:border-white/15 dark:bg-white/10 dark:text-white dark:focus:ring-accent-green/30"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowTokenForm((v) => !v)}
          className="text-xs font-medium text-gray-600 underline-offset-2 hover:underline dark:text-gray-300"
        >
          {showTokenForm
            ? t("onboarding.connect.hideTokenForm")
            : t("onboarding.connect.showTokenForm")}
        </button>

        {showTokenForm ? (
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
        ) : null}

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
