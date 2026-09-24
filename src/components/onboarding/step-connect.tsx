"use client";

import { useEffect, useState } from "react";
import { OnboardingFullscreenLayout } from "./onboarding-fullscreen-layout";
import { useOnboardingStore } from "@/stores/onboarding-store";

type ConnectionStatus = {
  baseUrl: string | null;
  source: "supervisor" | "manual" | null;
  addon?: boolean;
  ok?: boolean;
  error?: string;
};

export function StepConnect() {
  const { connection, setConnection, setTestResult, testResult, nextStep } =
    useOnboardingStore();
  const [testing, setTesting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [addonStatus, setAddonStatus] = useState<ConnectionStatus | null>(null);
  const [addonBusy, setAddonBusy] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/ha/connection");
        const data = (await res.json()) as ConnectionStatus;
        if (cancelled) return;
        setAddonStatus(data);
        if (data.addon && (data.source === "supervisor" || !data.baseUrl)) {
          // Probe Supervisor and persist when available
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
                error: probed.error ?? saved.error ?? "Supervisor connection failed",
              });
            }
          } else if (probed.error) {
            setTestResult({ ok: false, error: probed.error });
          }
        }
      } catch {
        if (!cancelled) setAddonStatus({ baseUrl: null, source: null, addon: false });
      } finally {
        if (!cancelled) setAddonBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setConnection, setTestResult]);

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
      if (data.ok) {
        setTestResult({ ok: true });
      } else {
        setTestResult({ ok: false, error: data.error ?? "Connection failed" });
      }
    } catch (err) {
      setTestResult({
        ok: false,
        error: err instanceof Error ? err.message : "Request failed",
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
      } else {
        setSaveError(data.error ?? `Save failed (${res.status})`);
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Request failed");
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
      <OnboardingFullscreenLayout
        step={2}
        title="Connect to Home Assistant"
        subtitle="Checking Supervisor connection…"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">Please wait…</p>
      </OnboardingFullscreenLayout>
    );
  }

  if (supervisorLinked) {
    return (
      <OnboardingFullscreenLayout
        step={2}
        title="Connected via Home Assistant"
        subtitle="This app is linked automatically through the Supervisor. No URL or long-lived token needed."
      >
        <div className="space-y-4 max-w-md">
          <div className="rounded-lg p-3 text-sm bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200">
            Supervisor connection OK.
          </div>
          <button
            type="button"
            onClick={handleSaveAndContinue}
            disabled={testing}
            className="rounded-full bg-accent-yellow dark:bg-accent-green px-4 py-2 text-sm font-medium text-gray-900 disabled:opacity-50"
          >
            Continue
          </button>
          {saveError && (
            <div className="rounded-lg p-3 text-sm bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200">
              {saveError}
            </div>
          )}
        </div>
      </OnboardingFullscreenLayout>
    );
  }

  return (
    <OnboardingFullscreenLayout
      step={2}
      title="Connect to Home Assistant"
      subtitle={
        addonStatus?.addon
          ? "Automatic Supervisor link failed. Enter a URL and long-lived token, or check that Home Assistant API access is enabled for this app."
          : "Enter your instance URL and Long-Lived Access Token. The connection is saved in this step. Test it, then continue."
      }
    >
      <div className="space-y-4 max-w-md">
        {addonStatus?.addon && addonStatus.error && (
          <div className="rounded-lg p-3 text-sm bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100">
            {addonStatus.error}
          </div>
        )}
        <div>
          <label htmlFor="baseUrl" className="block text-sm font-medium mb-1">
            Base URL
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
            className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="token" className="block text-sm font-medium mb-1">
            Long-Lived Access Token
          </label>
          <input
            id="token"
            type="password"
            value={connection.token}
            onChange={(e) => {
              setSaveError(null);
              setConnection({ token: e.target.value });
            }}
            placeholder="Paste your token"
            className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleTest}
            disabled={testing}
            className="rounded-full bg-accent-yellow dark:bg-accent-green px-4 py-2 text-sm font-medium text-gray-900 disabled:opacity-50"
          >
            Test connection
          </button>
          {testResult?.ok && (
            <button
              type="button"
              onClick={handleSaveAndContinue}
              disabled={testing}
              className="rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 px-4 py-2 text-sm font-medium"
            >
              Save and continue
            </button>
          )}
        </div>
        {saveError && (
          <div className="rounded-lg p-3 text-sm bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200">
            <p className="font-medium">Could not save connection</p>
            <p className="mt-1">{saveError}</p>
            <p className="mt-2 text-xs opacity-90">
              If this is a server config error (e.g. APP_SECRET), set it in the project .env and restart the
              dev server.
            </p>
          </div>
        )}
        {testResult !== null && !saveError && (
          <div
            className={`rounded-lg p-3 text-sm ${
              testResult.ok
                ? "bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200"
                : "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200"
            }`}
          >
            {testing && "Testing…"}
            {!testing && testResult.ok && "Connection successful. Save and continue above."}
            {!testing && !testResult.ok && (
              <>
                <p className="font-medium">Connection failed</p>
                <p className="mt-1">{testResult.error}</p>
                <p className="mt-2 text-xs opacity-90">
                  Tip: create a token in HA under Profile → Long-Lived Access Tokens; use HTTPS or a reverse
                  proxy if needed.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </OnboardingFullscreenLayout>
  );
}
