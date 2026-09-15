"use client";

import { useEffect, useState } from "react";
import {
  SettingsAlert,
  SettingsField,
  SettingsGroup,
  SettingsInput,
  SettingsPrimaryButton,
  SettingsSelect,
  SettingsToggle,
  SettingsCheckRow,
} from "@/components/settings/settings-panel";
import { SettingsChipSelect } from "@/components/settings/settings-choice-cards";
import { useTranslation } from "@/hooks/use-translation";
import { useImmichStore } from "@/stores/immich-store";
import { buildImmichBaseUrl, parseImmichEndpoint } from "@/lib/immich-url";
import { immichRequest } from "@/lib/immich-client";

type ImmichAlbum = { id: string; albumName?: string; assetCount?: number };

export function ImmichSettings() {
  const { t } = useTranslation();
  const store = useImmichStore();
  const parsed = parseImmichEndpoint(store.baseUrl);
  const [host, setHost] = useState(parsed.host);
  const [port, setPort] = useState(parsed.port);
  const [https, setHttps] = useState(parsed.protocol === "https");
  const [apiKey, setApiKey] = useState(store.apiKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"ok" | string | null>(null);
  const [albums, setAlbums] = useState<ImmichAlbum[]>([]);

  useEffect(() => {
    const next = parseImmichEndpoint(store.baseUrl);
    setHost(next.host);
    setPort(next.port);
    setHttps(next.protocol === "https");
  }, [store.baseUrl]);

  useEffect(() => {
    setApiKey(store.apiKey);
  }, [store.apiKey]);

  function applyConnectionFields() {
    const url = buildImmichBaseUrl(host, port, https ? "https" : "http");
    if (url) store.setBaseUrl(url);
    store.setApiKey(apiKey.trim());
    return url;
  }

  async function loadAlbums(url: string, key: string) {
    try {
      const data = await immichRequest<ImmichAlbum[]>({
        baseUrl: url,
        apiKey: key,
        path: "/api/albums",
      });
      setAlbums(Array.isArray(data) ? data : []);
    } catch {
      setAlbums([]);
    }
  }

  useEffect(() => {
    if (!store.enabled || !store.baseUrl || !store.apiKey) return;
    void loadAlbums(store.baseUrl, store.apiKey);
    // Intentionally load once when the panel opens with an existing connection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function testAndConnect() {
    setTestResult(null);
    const url = applyConnectionFields();
    if (!url) {
      setTestResult(t("settings.immich.hostRequired"));
      return;
    }
    if (!apiKey.trim()) {
      setTestResult(t("settings.immich.apiKeyRequired"));
      return;
    }
    setTesting(true);
    try {
      await immichRequest<{ res?: string }>({
        baseUrl: url,
        apiKey: apiKey.trim(),
        path: "/api/server/ping",
      });
      store.setEnabled(true);
      setTestResult("ok");
      await loadAlbums(url, apiKey.trim());
    } catch (e) {
      setTestResult(e instanceof Error ? e.message : t("settings.immich.testError"));
    } finally {
      setTesting(false);
    }
  }

  return (
    <>
      <SettingsToggle
        checked={store.enabled}
        onChange={store.setEnabled}
        label={t("settings.immich.enabled")}
        description={t("settings.immich.enabledHint")}
      />
      <SettingsGroup title={t("settings.immich.connection")}>
        <SettingsField label={t("settings.immich.host")} htmlFor="immich-host">
          <SettingsInput
            id="immich-host"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            onBlur={applyConnectionFields}
            placeholder={t("settings.immich.hostPlaceholder")}
            autoComplete="off"
          />
        </SettingsField>
        <SettingsField label={t("settings.immich.port")} htmlFor="immich-port">
          <SettingsInput
            id="immich-port"
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
            const url = buildImmichBaseUrl(host, port, next ? "https" : "http");
            if (url) store.setBaseUrl(url);
          }}
          label={t("settings.immich.https")}
        />
        <SettingsField
          label={t("settings.immich.apiKey")}
          hint={t("settings.immich.apiKeyHint")}
          htmlFor="immich-key"
        >
          <SettingsInput
            id="immich-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onBlur={applyConnectionFields}
            placeholder={t("settings.immich.apiKeyPlaceholder")}
            autoComplete="off"
          />
        </SettingsField>
        <SettingsPrimaryButton onClick={testAndConnect} disabled={testing}>
          {testing ? t("settings.immich.testing") : t("settings.immich.test")}
        </SettingsPrimaryButton>
        {testResult === "ok" ? <SettingsAlert tone="ok">{t("settings.immich.testSuccess")}</SettingsAlert> : null}
        {testResult && testResult !== "ok" ? <SettingsAlert tone="error">{testResult}</SettingsAlert> : null}
      </SettingsGroup>
      <SettingsGroup title={t("settings.immich.library")}>
        <SettingsField label={t("settings.immich.album")} hint={t("settings.immich.albumHint")}>
          <SettingsSelect
            value={store.albumId}
            onChange={(e) => store.setAlbumId(e.target.value)}
          >
            <option value="">{t("settings.immich.albumAll")}</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.albumName || album.id}
                {typeof album.assetCount === "number" ? ` (${album.assetCount})` : ""}
              </option>
            ))}
          </SettingsSelect>
        </SettingsField>
        <SettingsChipSelect
          label={t("settings.immich.mediaType")}
          items={[
            { id: "photo", label: t("settings.immich.mediaTypePhoto") },
            { id: "video", label: t("settings.immich.mediaTypeVideo") },
          ]}
          value={store.mediaType}
          onChange={store.setMediaType}
        />
      </SettingsGroup>
    </>
  );
}
