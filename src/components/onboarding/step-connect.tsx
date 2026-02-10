"use client";

import { useState } from "react";
import { OnboardingFullscreenLayout } from "./onboarding-fullscreen-layout";
import { useOnboardingStore } from "@/stores/onboarding-store";

export function StepConnect() {
  const { connection, setConnection, setTestResult, testResult, nextStep } =
    useOnboardingStore();
  const [testing, setTesting] = useState(false);

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
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
    setTesting(true);
    try {
      const res = await fetch("/api/ha/connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseUrl: connection.baseUrl,
          token: connection.token,
        }),
      });
      const data = await res.json();
      if (data.connectionId) {
        setConnection({ connectionId: data.connectionId });
        nextStep();
      }
    } finally {
      setTesting(false);
    }
  }

  return (
    <OnboardingFullscreenLayout
      step={2}
      title="Connect to Home Assistant"
      subtitle="Enter your instance URL and Long-Lived Access Token. The connection is saved in this step. Test it, then continue."
    >
      <div className="space-y-4 max-w-md">
        <div>
          <label htmlFor="baseUrl" className="block text-sm font-medium mb-1">
            Base URL
          </label>
          <input
            id="baseUrl"
            type="url"
            value={connection.baseUrl}
            onChange={(e) => setConnection({ baseUrl: e.target.value })}
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
            onChange={(e) => setConnection({ token: e.target.value })}
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
        {testResult !== null && (
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
                  Tip: create a token in HA under Profile → Long-Lived Access Tokens; use HTTPS or a reverse proxy if needed.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </OnboardingFullscreenLayout>
  );
}
