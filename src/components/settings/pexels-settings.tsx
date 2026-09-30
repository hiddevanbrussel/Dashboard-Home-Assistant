"use client";

import {
  SettingsAlert,
  SettingsField,
  SettingsGroup,
  SettingsInput,
  SettingsPrimaryButton,
  SettingsToggle,
} from "@/components/settings/settings-panel";
import { SettingsChipSelect } from "@/components/settings/settings-choice-cards";
import { useTranslation } from "@/hooks/use-translation";
import {
  getScreensaverPexelsApiKey,
  getScreensaverPexelsEnabled,
  getScreensaverPexelsQuery,
  getScreensaverPexelsType,
  setScreensaverPexelsApiKey,
  setScreensaverPexelsEnabled,
  setScreensaverPexelsQuery,
  setScreensaverPexelsType,
} from "@/stores/screensaver-store";
import { useEffect, useState } from "react";

export function PexelsSettings() {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [query, setQuery] = useState("nature landscape");
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [envConfigured, setEnvConfigured] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"ok" | string | null>(null);

  useEffect(() => {
    setEnabled(getScreensaverPexelsEnabled());
    setApiKey(getScreensaverPexelsApiKey());
    setQuery(getScreensaverPexelsQuery());
    setMediaType(getScreensaverPexelsType());

    let cancelled = false;
    fetch("/api/pexels/status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.envConfigured === "boolean") {
          setEnvConfigured(data.envConfigured);
        }
      })
      .catch(() => {
        /* ignore */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function testConnection() {
    setTestResult(null);
    const key = apiKey.trim();
    if (!key && !envConfigured) {
      setTestResult(t("settings.pexels.keyRequired"));
      return;
    }
    setTesting(true);
    try {
      const headers: HeadersInit = {};
      if (key) headers["X-Pexels-Api-Key"] = key;
      const path = mediaType === "video" ? "/api/pexels/video" : "/api/pexels/photo";
      const res = await fetch(
        `${path}?query=${encodeURIComponent(query.trim() || "nature landscape")}&_t=${Date.now()}`,
        { cache: "no-store", headers }
      );
      const data = (await res.json().catch(() => null)) as
        | { imageUrl?: string; videoUrl?: string; error?: string; code?: string }
        | null;
      if (!res.ok || (!data?.imageUrl && !data?.videoUrl)) {
        setTestResult(data?.error || t("settings.pexels.testError"));
        return;
      }
      setScreensaverPexelsEnabled(true);
      setEnabled(true);
      setTestResult("ok");
    } catch {
      setTestResult(t("settings.pexels.testError"));
    } finally {
      setTesting(false);
    }
  }

  return (
    <>
      <SettingsToggle
        checked={enabled}
        onChange={(v) => {
          setEnabled(v);
          setScreensaverPexelsEnabled(v);
        }}
        label={t("settings.pexels.enabled")}
        description={t("settings.pexels.enabledHint")}
      />
      <SettingsGroup
        title={t("settings.pexels.connection")}
        description={
          <>
            {t("settings.pexels.keyHint")}{" "}
            <a href="https://www.pexels.com/api" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
              pexels.com/api
            </a>
            .
          </>
        }
      >
        {envConfigured ? (
          <SettingsAlert tone="ok">{t("settings.pexels.envConfigured")}</SettingsAlert>
        ) : null}
        <SettingsField
          label={t("settings.screensaver.pexelsKey")}
          hint={envConfigured ? t("settings.pexels.keyOptionalHint") : undefined}
          htmlFor="pexels-key"
        >
          <SettingsInput
            id="pexels-key"
            type="password"
            value={apiKey}
            onChange={(e) => {
              const v = e.target.value;
              setApiKey(v);
              setScreensaverPexelsApiKey(v);
            }}
            placeholder={t("settings.screensaver.pexelsKey")}
            autoComplete="off"
          />
        </SettingsField>
        <SettingsField label={t("settings.screensaver.pexelsQuery")} htmlFor="pexels-query">
          <SettingsInput
            id="pexels-query"
            type="text"
            value={query}
            onChange={(e) => {
              const v = e.target.value;
              setQuery(v);
              setScreensaverPexelsQuery(v);
            }}
            placeholder={t("settings.screensaver.pexelsQuery")}
          />
        </SettingsField>
        <SettingsChipSelect
          label={t("settings.screensaver.pexelsType")}
          items={[
            { id: "photo", label: t("settings.screensaver.pexelsTypePhoto") },
            { id: "video", label: t("settings.screensaver.pexelsTypeVideo") },
          ]}
          value={mediaType}
          onChange={(type) => {
            setMediaType(type);
            setScreensaverPexelsType(type);
          }}
        />
        <SettingsPrimaryButton onClick={testConnection} disabled={testing}>
          {testing ? t("settings.pexels.testing") : t("settings.pexels.test")}
        </SettingsPrimaryButton>
        {testResult === "ok" ? <SettingsAlert tone="ok">{t("settings.pexels.testSuccess")}</SettingsAlert> : null}
        {testResult && testResult !== "ok" ? <SettingsAlert tone="error">{testResult}</SettingsAlert> : null}
      </SettingsGroup>
    </>
  );
}
