"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  SettingsAlert,
  SettingsCheckRow,
  SettingsField,
  SettingsGroup,
  SettingsInput,
  SettingsPrimaryButton,
  SettingsToggle,
} from "@/components/settings/settings-panel";
import { useTranslation } from "@/hooks/use-translation";
import { useValetudoStore } from "@/stores/valetudo-store";
import { buildValetudoBaseUrl, parseValetudoEndpoint } from "@/lib/valetudo-url";
import { valetudoRequest } from "@/lib/valetudo-client";

export function ValetudoSettings() {
  const { t } = useTranslation();
  const store = useValetudoStore();
  const parsed = parseValetudoEndpoint(store.baseUrl);
  const [host, setHost] = useState(parsed.host);
  const [port, setPort] = useState(parsed.port);
  const [https, setHttps] = useState(parsed.protocol === "https");
  const [username, setUsername] = useState(store.username);
  const [password, setPassword] = useState(store.password);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"ok" | string | null>(null);

  useEffect(() => {
    const next = parseValetudoEndpoint(store.baseUrl);
    setHost(next.host);
    setPort(next.port);
    setHttps(next.protocol === "https");
  }, [store.baseUrl]);

  useEffect(() => {
    setUsername(store.username);
    setPassword(store.password);
  }, [store.username, store.password]);

  function applyConnectionFields() {
    const url = buildValetudoBaseUrl(host, port, https ? "https" : "http");
    if (url) store.setBaseUrl(url);
    store.setUsername(username.trim());
    store.setPassword(password);
    return url;
  }

  async function testAndConnect() {
    setTestResult(null);
    const url = applyConnectionFields();
    if (!url) {
      setTestResult(t("settings.valetudo.hostRequired"));
      return;
    }
    setTesting(true);
    try {
      const data = await valetudoRequest<{ manufacturer?: string; modelName?: string }>({
        baseUrl: url,
        username: username.trim(),
        password,
        path: "/api/v2/robot",
      });
      store.setEnabled(true);
      const label = [data.manufacturer, data.modelName].filter(Boolean).join(" ");
      setTestResult(label ? `ok:${label}` : "ok");
    } catch (e) {
      setTestResult(e instanceof Error ? e.message : t("settings.valetudo.testError"));
    } finally {
      setTesting(false);
    }
  }

  const successLabel =
    typeof testResult === "string" && testResult.startsWith("ok")
      ? testResult.length > 3
        ? `${t("settings.valetudo.testSuccess")} ${testResult.slice(3)}`
        : t("settings.valetudo.testSuccess")
      : null;

  return (
    <>
      <SettingsToggle
        checked={store.enabled}
        onChange={store.setEnabled}
        label={t("settings.valetudo.enabled")}
        description={t("settings.valetudo.enabledHint")}
      />
      <SettingsGroup title={t("settings.valetudo.connection")}>
        <SettingsField label={t("settings.valetudo.host")} htmlFor="valetudo-host">
          <SettingsInput
            id="valetudo-host"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            onBlur={applyConnectionFields}
            placeholder={t("settings.valetudo.hostPlaceholder")}
            autoComplete="off"
          />
        </SettingsField>
        <SettingsField label={t("settings.valetudo.port")} htmlFor="valetudo-port">
          <SettingsInput
            id="valetudo-port"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            onBlur={applyConnectionFields}
            inputMode="numeric"
            autoComplete="off"
          />
        </SettingsField>
        <SettingsCheckRow
          checked={https}
          onChange={(next) => {
            setHttps(next);
            const url = buildValetudoBaseUrl(host, port, next ? "https" : "http");
            if (url) store.setBaseUrl(url);
          }}
          label={t("settings.valetudo.https")}
        />
        <SettingsField
          label={t("settings.valetudo.username")}
          hint={t("settings.valetudo.authHint")}
          htmlFor="valetudo-user"
        >
          <SettingsInput
            id="valetudo-user"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={applyConnectionFields}
            autoComplete="off"
          />
        </SettingsField>
        <SettingsField label={t("settings.valetudo.password")} htmlFor="valetudo-pass">
          <SettingsInput
            id="valetudo-pass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={applyConnectionFields}
            autoComplete="off"
          />
        </SettingsField>
        <SettingsPrimaryButton onClick={testAndConnect} disabled={testing}>
          {testing ? t("settings.valetudo.testing") : t("settings.valetudo.test")}
        </SettingsPrimaryButton>
        {successLabel ? <SettingsAlert tone="ok">{successLabel}</SettingsAlert> : null}
        {testResult && !successLabel ? <SettingsAlert tone="error">{testResult}</SettingsAlert> : null}
        {store.enabled ? (
          <Link
            href="/vacuum"
            className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            {t("settings.valetudo.openPage")}
          </Link>
        ) : null}
      </SettingsGroup>
    </>
  );
}
