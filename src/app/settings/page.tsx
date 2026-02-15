"use client";

import { useEffect, useState, useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/layout/glass-card";
import { useThemeStore } from "@/stores/theme-store";
import { useLanguageStore } from "@/stores/language-store";
import { getScreensaverDelaySeconds, setScreensaverDelaySeconds, getScreensaverBackgroundImage, setScreensaverBackgroundImage, getScreensaverClock24h, setScreensaverClock24h, getScreensaverWeatherEntityId, setScreensaverWeatherEntityId, getScreensaverPexelsEnabled, setScreensaverPexelsEnabled, getScreensaverPexelsQuery, setScreensaverPexelsQuery, getScreensaverPexelsApiKey, setScreensaverPexelsApiKey, getScreensaverFootballEntityId, setScreensaverFootballEntityId } from "@/stores/screensaver-store";
import { Image, Link2, List, Monitor, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

type SettingsSection = "appearance" | "screensaver" | "page-background" | "connection" | "entities";

const SECTION_KEYS: Record<SettingsSection, string> = {
  appearance: "settings.appearance",
  screensaver: "settings.screensaver",
  "page-background": "settings.pageBackground",
  connection: "settings.connection",
  entities: "settings.entities",
};

type HaEntity = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
};

const ENTITY_DOMAINS = ["automation", "climate", "light", "media_player", "weather"] as const;

const DOMAIN_KEYS: Record<(typeof ENTITY_DOMAINS)[number], string> = {
  automation: "settings.entities.automation",
  climate: "settings.entities.climate",
  light: "settings.entities.light",
  media_player: "settings.entities.mediaPlayer",
  weather: "settings.entities.weather",
};

function getDomain(entityId: string): string {
  return entityId.split(".")[0] ?? "";
}

export default function SettingsPage() {
  const [baseUrl, setBaseUrl] = useState("http://homeassistant.local:8123");
  const [token, setToken] = useState("");
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: true } | { ok: false; error: string } | null>(null);
  const [saveMessage, setSaveMessage] = useState<"success" | "error" | null>(null);
  const [entities, setEntities] = useState<HaEntity[]>([]);
  const [entitiesLoading, setEntitiesLoading] = useState(false);
  const [entitiesError, setEntitiesError] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [dashboardId, setDashboardId] = useState<string | null>(null);
  const [pageBackground, setPageBackground] = useState<string | null>(null);
  const [pageBackgroundLight, setPageBackgroundLight] = useState<string | null>(null);
  const [pageBackgroundDark, setPageBackgroundDark] = useState<string | null>(null);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingBgLight, setUploadingBgLight] = useState(false);
  const [uploadingBgDark, setUploadingBgDark] = useState(false);
  const [section, setSection] = useState<SettingsSection>("appearance");
  const [screensaverDelaySeconds, setScreensaverDelaySecondsState] = useState(0);
  const [screensaverBackground, setScreensaverBackgroundState] = useState("");
  const [screensaverClock24h, setScreensaverClock24hState] = useState(true);
  const [screensaverWeatherEntityId, setScreensaverWeatherEntityIdState] = useState<string | null>(null);
  const [screensaverFootballEntityId, setScreensaverFootballEntityIdState] = useState<string | null>(null);
  const [screensaverPexelsEnabled, setScreensaverPexelsEnabledState] = useState(false);
  const [screensaverPexelsQuery, setScreensaverPexelsQueryState] = useState("nature landscape");
  const [screensaverPexelsApiKey, setScreensaverPexelsApiKeyState] = useState("");
  const [uploadingScreensaverBg, setUploadingScreensaverBg] = useState(false);

  useEffect(() => {
    setScreensaverDelaySecondsState(getScreensaverDelaySeconds());
    setScreensaverBackgroundState(getScreensaverBackgroundImage());
    setScreensaverClock24hState(getScreensaverClock24h());
    setScreensaverWeatherEntityIdState(getScreensaverWeatherEntityId());
    setScreensaverFootballEntityIdState(getScreensaverFootballEntityId());
    setScreensaverPexelsEnabledState(getScreensaverPexelsEnabled());
    setScreensaverPexelsQueryState(getScreensaverPexelsQuery());
    setScreensaverPexelsApiKeyState(getScreensaverPexelsApiKey());
  }, []);

  useEffect(() => {
    fetch("/api/ha/connection")
      .then((r) => r.json())
      .then((d) => {
        if (d?.baseUrl) setBaseUrl(d.baseUrl);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        if (d?.id) setDashboardId(d.id);
        if (d?.background != null) setPageBackground(d.background);
        if (d?.backgroundLight != null) setPageBackgroundLight(d.backgroundLight);
        if (d?.backgroundDark != null) setPageBackgroundDark(d.backgroundDark);
      })
      .catch(() => {});
  }, []);

  function loadEntities() {
    setEntitiesError(null);
    setEntitiesLoading(true);
    fetch("/api/ha/entities")
      .then((r) => {
        if (!r.ok) return r.json().then((body) => ({ error: body?.error ?? "Failed to load" }));
        return r.json();
      })
      .then((data) => {
        if ("error" in data) {
          setEntitiesError(data.error);
          setEntities([]);
        } else if (Array.isArray(data)) {
          setEntities(data);
        }
      })
      .catch(() => {
        setEntitiesError("Could not load entities.");
        setEntities([]);
      })
      .finally(() => setEntitiesLoading(false));
  }

  useEffect(() => {
    loadEntities();
  }, [saveMessage]);

  const byDomain = useMemo(() => {
    const map = new Map<string, HaEntity[]>();
    for (const e of entities) {
      const domain = getDomain(e.entity_id);
      if (!ENTITY_DOMAINS.includes(domain as (typeof ENTITY_DOMAINS)[number])) continue;
      if (!map.has(domain)) map.set(domain, []);
      map.get(domain)!.push(e);
    }
    return ENTITY_DOMAINS.map((d) => [d, map.get(d) ?? []] as const).filter(
      ([, list]) => list.length > 0
    );
  }, [entities]);

  const activeDomain = selectedDomain && byDomain.some(([d]) => d === selectedDomain)
    ? selectedDomain
    : byDomain[0]?.[0] ?? null;
  const activeList = byDomain.find(([d]) => d === activeDomain)?.[1] ?? [];

  async function handleTest() {
    setTestResult(null);
    setTesting(true);
    try {
      const res = await fetch("/api/ha/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl, token }),
      });
      const data = await res.json();
      if (data.ok) setTestResult({ ok: true });
      else setTestResult({ ok: false, error: data.error ?? "Connection failed" });
    } catch (err) {
      setTestResult({ ok: false, error: err instanceof Error ? err.message : "Request failed" });
    } finally {
      setTesting(false);
    }
  }

  async function handleSave() {
    if (!token.trim()) {
      setTestResult({ ok: false, error: "Please enter a token." });
      return;
    }
    setSaveMessage(null);
    setSaving(true);
    try {
      const res = await fetch("/api/ha/connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl, token }),
      });
      const data = await res.json();
      if (data.connectionId) {
        setSaveMessage("success");
        setTestResult({ ok: true });
      } else {
        setSaveMessage("error");
        setTestResult({ ok: false, error: data.error ?? "Save failed" });
      }
    } catch {
      setSaveMessage("error");
      setTestResult({ ok: false, error: "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  async function handlePageBackgroundUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !dashboardId) return;
    e.target.value = "";
    setUploadingBg(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      await fetch(`/api/dashboards/${dashboardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ background: json.url }),
      });
      setPageBackground(json.url);
      window.dispatchEvent(new Event("page-background-changed"));
    } catch {
      // error could be shown in UI
    } finally {
      setUploadingBg(false);
    }
  }

  async function handlePageBackgroundRemove() {
    if (!dashboardId) return;
    try {
      await fetch(`/api/dashboards/${dashboardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ background: null }),
      });
      setPageBackground(null);
      window.dispatchEvent(new Event("page-background-changed"));
    } finally {
      setUploadingBg(false);
    }
  }

  async function handlePageBackgroundLightUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !dashboardId) return;
    e.target.value = "";
    setUploadingBgLight(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      await fetch(`/api/dashboards/${dashboardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backgroundLight: json.url }),
      });
      setPageBackgroundLight(json.url);
      window.dispatchEvent(new Event("page-background-changed"));
    } catch {
      // error could be shown in UI
    } finally {
      setUploadingBgLight(false);
    }
  }

  async function handlePageBackgroundLightRemove() {
    if (!dashboardId) return;
    try {
      await fetch(`/api/dashboards/${dashboardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backgroundLight: null }),
      });
      setPageBackgroundLight(null);
      window.dispatchEvent(new Event("page-background-changed"));
    } finally {
      setUploadingBgLight(false);
    }
  }

  async function handlePageBackgroundDarkUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !dashboardId) return;
    e.target.value = "";
    setUploadingBgDark(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      await fetch(`/api/dashboards/${dashboardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backgroundDark: json.url }),
      });
      setPageBackgroundDark(json.url);
      window.dispatchEvent(new Event("page-background-changed"));
    } catch {
      // error could be shown in UI
    } finally {
      setUploadingBgDark(false);
    }
  }

  async function handlePageBackgroundDarkRemove() {
    if (!dashboardId) return;
    try {
      await fetch(`/api/dashboards/${dashboardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backgroundDark: null }),
      });
      setPageBackgroundDark(null);
      window.dispatchEvent(new Event("page-background-changed"));
    } finally {
      setUploadingBgDark(false);
    }
  }

  const { mode, setMode, resolved } = useThemeStore();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  const SECTIONS: { id: SettingsSection; labelKey: string; icon: React.ElementType }[] = [
    { id: "appearance", labelKey: SECTION_KEYS.appearance, icon: Palette },
    { id: "screensaver", labelKey: SECTION_KEYS.screensaver, icon: Monitor },
    { id: "page-background", labelKey: SECTION_KEYS["page-background"], icon: Image },
    { id: "connection", labelKey: SECTION_KEYS.connection, icon: Link2 },
    { id: "entities", labelKey: SECTION_KEYS.entities, icon: List },
  ];

  return (
    <AppShell activeTab="/settings">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 max-w-4xl">
        <nav
          className="shrink-0 sm:w-52"
          aria-label="Settings sections"
        >
          <h2 className="text-xl font-semibold mb-3 sm:mb-4">{t("settings.title")}</h2>
          <ul className="flex sm:flex-col gap-1 overflow-x-auto pb-2 sm:pb-0 sm:overflow-visible">
            {SECTIONS.map(({ id, labelKey, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setSection(id)}
                  className={cn(
                    "w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors whitespace-nowrap",
                    section === id
                      ? "bg-[#4D2FB2] text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {t(labelKey)}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1 min-w-0">
          {section === "appearance" && (
            <GlassCard>
              <h3 className="text-card-title font-medium mb-3">{t("settings.appearance")}</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{t("settings.language.setting")}</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "en" | "nl")}
                  className="rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200"
                >
                  <option value="en">{t("settings.language.en")}</option>
                  <option value="nl">{t("settings.language.nl")}</option>
                </select>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {t("settings.theme.description")}
              </p>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mode === "auto"}
                  onChange={(e) => setMode(e.target.checked ? "auto" : resolved)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-white/20 text-accent-yellow dark:text-accent-green focus:ring-accent-yellow dark:focus:ring-accent-green"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t("settings.theme.auto")}
                </span>
              </label>
            </GlassCard>
          )}

          {section === "screensaver" && (
            <GlassCard>
              <h3 className="text-card-title font-medium mb-3">{t("settings.screensaver")}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t("settings.screensaver.description")}
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{t("settings.screensaver.delay")}</label>
                <select
                  value={screensaverDelaySeconds}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    setScreensaverDelaySecondsState(v);
                    setScreensaverDelaySeconds(v);
                  }}
                  className="rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200"
                >
                  <option value={0}>{t("settings.screensaver.off")}</option>
                  <option value={10}>{t("settings.screensaver.10s")}</option>
                  <option value={30}>{t("settings.screensaver.30s")}</option>
                  <option value={60}>{t("settings.screensaver.1m")}</option>
                  <option value={120}>{t("settings.screensaver.2m")}</option>
                  <option value={300}>{t("settings.screensaver.5m")}</option>
                  <option value={600}>{t("settings.screensaver.10m")}</option>
                  <option value={900}>{t("settings.screensaver.15m")}</option>
                  <option value={1800}>{t("settings.screensaver.30m")}</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{t("settings.screensaver.clockFormat")}</label>
                <select
                  value={screensaverClock24h ? "24" : "12"}
                  onChange={(e) => {
                    const v = e.target.value === "24";
                    setScreensaverClock24hState(v);
                    setScreensaverClock24h(v);
                  }}
                  className="rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200"
                >
                  <option value="24">{t("settings.screensaver.24h")}</option>
                  <option value="12">{t("settings.screensaver.12h")}</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{t("settings.screensaver.weather")}</label>
                <select
                  value={screensaverWeatherEntityId ?? ""}
                  onChange={(e) => {
                    const v = e.target.value || null;
                    setScreensaverWeatherEntityIdState(v);
                    setScreensaverWeatherEntityId(v);
                  }}
                  className="rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200 w-full"
                >
                  <option value="">{t("settings.screensaver.weatherDefault")}</option>
                  {entities
                    .filter((e) => e.entity_id.startsWith("weather.") || (e.entity_id.startsWith("sensor.") && /temp|weather|graden/i.test(e.entity_id)))
                    .map((e) => {
                      const name = (e.attributes?.friendly_name as string) ?? e.entity_id;
                      return (
                        <option key={e.entity_id} value={e.entity_id}>
                          {name}
                        </option>
                      );
                    })}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t("settings.screensaver.weatherHint")}
                </p>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{t("settings.screensaver.football")}</label>
                <select
                  value={screensaverFootballEntityId ?? ""}
                  onChange={(e) => {
                    const v = e.target.value || null;
                    setScreensaverFootballEntityIdState(v);
                    setScreensaverFootballEntityId(v);
                  }}
                  className="rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200 w-full"
                >
                  <option value="">{t("settings.screensaver.footballOff")}</option>
                  {entities
                    .filter((e) => e.entity_id.startsWith("sensor.team"))
                    .map((e) => {
                      const name = (e.attributes?.friendly_name as string) ?? e.entity_id;
                      return (
                        <option key={e.entity_id} value={e.entity_id}>
                          {name}
                        </option>
                      );
                    })}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t("settings.screensaver.footballHint")}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{t("settings.screensaver.pexels")}</label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {t("settings.screensaver.pexelsHint")}{" "}
                  <a href="https://www.pexels.com/api" target="_blank" rel="noopener noreferrer" className="text-[#4D2FB2] hover:underline">pexels.com/api</a>.
                </p>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    id="pexels-enabled"
                    checked={screensaverPexelsEnabled}
                    onChange={(e) => {
                      const v = e.target.checked;
                      setScreensaverPexelsEnabledState(v);
                      setScreensaverPexelsEnabled(v);
                    }}
                    className="h-4 w-4 rounded border-gray-300 dark:border-white/20 text-accent-yellow dark:text-accent-green focus:ring-accent-yellow dark:focus:ring-accent-green"
                  />
                  <label htmlFor="pexels-enabled" className="text-sm font-medium text-gray-700 dark:text-gray-200">{t("settings.screensaver.pexelsUse")}</label>
                </div>
                {screensaverPexelsEnabled && (
                  <div className="space-y-2 mt-3">
                    <input
                      type="password"
                      value={screensaverPexelsApiKey}
                      onChange={(e) => {
                        const v = e.target.value;
                        setScreensaverPexelsApiKeyState(v);
                        setScreensaverPexelsApiKey(v);
                      }}
                      placeholder={t("settings.screensaver.pexelsKey")}
                      className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500"
                      autoComplete="off"
                    />
                    <input
                      type="text"
                      value={screensaverPexelsQuery}
                      onChange={(e) => {
                        const v = e.target.value;
                        setScreensaverPexelsQueryState(v);
                        setScreensaverPexelsQuery(v);
                      }}
                      placeholder={t("settings.screensaver.pexelsQuery")}
                      className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{t("settings.screensaver.bgImage")}</label>
                {screensaverBackground && (
                  <div
                    className="mb-3 h-24 rounded-lg bg-cover bg-center border border-gray-200 dark:border-white/10"
                    style={{ backgroundImage: `url(${screensaverBackground})` }}
                  />
                )}
                <div className="flex flex-wrap gap-2 items-center">
                  <label className="rounded-full bg-accent-yellow dark:bg-accent-green px-4 py-2 text-sm font-medium text-gray-900 cursor-pointer hover:opacity-90">
                    {uploadingScreensaverBg ? t("settings.screensaver.uploading") : t("settings.screensaver.uploadImage")}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="sr-only"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingScreensaverBg(true);
                        try {
                          const formData = new FormData();
                          formData.append("file", file);
                          const res = await fetch("/api/upload", { method: "POST", body: formData });
                          const json = await res.json();
                          if (json?.url) {
                            setScreensaverBackgroundState(json.url);
                            setScreensaverBackgroundImage(json.url);
                          }
                        } finally {
                          setUploadingScreensaverBg(false);
                        }
                      }}
                      disabled={uploadingScreensaverBg}
                    />
                  </label>
                  <input
                    type="url"
                    value={screensaverBackground}
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      setScreensaverBackgroundState(v);
                      setScreensaverBackgroundImage(v);
                    }}
                    placeholder={t("settings.screensaver.bgUrlPlaceholder")}
                    className="flex-1 min-w-[200px] rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500"
                  />
                  {screensaverBackground && (
                    <button
                      type="button"
                      onClick={() => {
                        setScreensaverBackgroundState("");
                        setScreensaverBackgroundImage("");
                      }}
                      className="rounded-full border border-gray-300 dark:border-white/20 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {t("settings.screensaver.remove")}
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          )}

          {section === "page-background" && (
            dashboardId ? (
              <div className="space-y-6">
                <GlassCard>
                  <h3 className="text-card-title font-medium mb-3">{t("settings.pageBackground")}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {t("settings.pageBackground.description")}
                  </p>
                </GlassCard>
                <GlassCard>
                  <h3 className="text-card-title font-medium mb-3">{t("settings.pageBackground.light")}</h3>
                  {pageBackgroundLight && (
                    <div
                      className="mb-3 h-32 rounded-lg bg-cover bg-center border border-gray-200 dark:border-white/10"
                      style={{ backgroundImage: `url(${pageBackgroundLight})` }}
                    />
                  )}
                  <div className="flex gap-2">
                    <label className="rounded-full bg-accent-yellow dark:bg-accent-green px-4 py-2 text-sm font-medium text-gray-900 cursor-pointer hover:opacity-90">
                      {uploadingBgLight ? t("settings.screensaver.uploading") : t("settings.pageBackground.upload")}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="sr-only"
                        onChange={handlePageBackgroundLightUpload}
                        disabled={uploadingBgLight}
                      />
                    </label>
                    {pageBackgroundLight && (
                      <button
                        type="button"
                        onClick={handlePageBackgroundLightRemove}
                        className="rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 px-4 py-2 text-sm font-medium"
                      >
                        {t("settings.pageBackground.remove")}
                      </button>
                    )}
                  </div>
                </GlassCard>
                <GlassCard>
                  <h3 className="text-card-title font-medium mb-3">{t("settings.pageBackground.dark")}</h3>
                  {pageBackgroundDark && (
                    <div
                      className="mb-3 h-32 rounded-lg bg-cover bg-center border border-gray-200 dark:border-white/10"
                      style={{ backgroundImage: `url(${pageBackgroundDark})` }}
                    />
                  )}
                  <div className="flex gap-2">
                    <label className="rounded-full bg-accent-yellow dark:bg-accent-green px-4 py-2 text-sm font-medium text-gray-900 cursor-pointer hover:opacity-90">
                      {uploadingBgDark ? t("settings.screensaver.uploading") : t("settings.pageBackground.upload")}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="sr-only"
                        onChange={handlePageBackgroundDarkUpload}
                        disabled={uploadingBgDark}
                      />
                    </label>
                    {pageBackgroundDark && (
                      <button
                        type="button"
                        onClick={handlePageBackgroundDarkRemove}
                        className="rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 px-4 py-2 text-sm font-medium"
                      >
                        {t("settings.pageBackground.remove")}
                      </button>
                    )}
                  </div>
                </GlassCard>
                <GlassCard>
                  <h3 className="text-card-title font-medium mb-3">{t("settings.pageBackground.fallback")}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {t("settings.pageBackground.fallbackDesc")}
                  </p>
                  {pageBackground && (
                    <div
                      className="mb-3 h-32 rounded-lg bg-cover bg-center border border-gray-200 dark:border-white/10"
                      style={{ backgroundImage: `url(${pageBackground})` }}
                    />
                  )}
                  <div className="flex gap-2">
                    <label className="rounded-full bg-accent-yellow dark:bg-accent-green px-4 py-2 text-sm font-medium text-gray-900 cursor-pointer hover:opacity-90">
                      {uploadingBg ? t("settings.screensaver.uploading") : t("settings.pageBackground.upload")}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="sr-only"
                        onChange={handlePageBackgroundUpload}
                        disabled={uploadingBg}
                      />
                    </label>
                    {pageBackground && (
                      <button
                        type="button"
                        onClick={handlePageBackgroundRemove}
                        className="rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 px-4 py-2 text-sm font-medium"
                      >
                        {t("settings.pageBackground.remove")}
                      </button>
                    )}
                  </div>
                </GlassCard>
              </div>
            ) : (
              <GlassCard>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("settings.pageBackground.needDashboard")}
                </p>
              </GlassCard>
            )
          )}

          {section === "connection" && (
            <GlassCard>
              <h3 className="text-card-title font-medium mb-3">{t("settings.connection")}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t("settings.connection.description")}
              </p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="ha-baseUrl" className="block text-sm font-medium mb-1">
                    {t("settings.connection.baseUrl")}
                  </label>
                  <input
                    id="ha-baseUrl"
                    type="url"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="http://homeassistant.local:8123"
                    className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="ha-token" className="block text-sm font-medium mb-1">
                    Long-Lived Access Token
                  </label>
                  <input
                    id="ha-token"
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Token (hidden when a connection is already saved)"
                    className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm"
                  />
                </div>
                {testResult && (
                  <div
                    className={`rounded-lg p-3 text-sm ${
                      testResult.ok
                        ? "bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200"
                        : "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200"
                    }`}
                  >
                    {testResult.ok ? "Connection successful." : testResult.error}
                  </div>
                )}
                {saveMessage === "success" && (
                  <p className="text-sm text-green-600 dark:text-green-400">Connection saved.</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleTest}
                    disabled={testing}
                    className="rounded-full bg-accent-yellow dark:bg-accent-green px-4 py-2 text-sm font-medium text-gray-900 disabled:opacity-50"
                  >
                    {testing ? "Testing…" : "Test connection"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || !token.trim()}
                    className="rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 px-4 py-2 text-sm font-medium disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            </GlassCard>
          )}

          {section === "entities" && (
            <GlassCard>
              <h3 className="text-card-title font-medium mb-2">Entities by Type</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Entities from your Home Assistant instance. Select a type in the tabs.
                Save a connection first to load this list.
              </p>
              {entitiesLoading ? (
                <p className="text-sm text-gray-500">Loading entities…</p>
              ) : entitiesError ? (
                <p className="text-sm text-amber-600 dark:text-amber-400">{entitiesError}</p>
              ) : byDomain.length === 0 ? (
                <p className="text-sm text-gray-500">No entities or no connection saved yet.</p>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className="flex flex-wrap gap-1 rounded-full bg-gray-100 dark:bg-white/10 p-1"
                      role="tablist"
                    >
                      {byDomain.map(([domain, list]) => (
                        <button
                          key={domain}
                          type="button"
                          role="tab"
                          aria-selected={domain === activeDomain}
                          onClick={() => setSelectedDomain(domain)}
                          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                            domain === activeDomain
                              ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          {t(DOMAIN_KEYS[domain as keyof typeof DOMAIN_KEYS])}
                          <span className="ml-1 opacity-75">({list.length})</span>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={loadEntities}
                      className="text-sm text-accent-purple dark:text-accent-green hover:underline shrink-0"
                    >
                      Vernieuwen
                    </button>
                  </div>
                  <div
                    role="tabpanel"
                    className="rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 p-3 max-h-[50vh] overflow-auto"
                  >
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 sticky top-0 bg-gray-50/95 dark:bg-white/5 py-1">
                      {activeDomain ? t(DOMAIN_KEYS[activeDomain as keyof typeof DOMAIN_KEYS]) : ""}
                    </h4>
                    <ul className="space-y-1">
                      {activeList.map((e) => {
                        const name =
                          (e.attributes?.friendly_name as string) ?? e.entity_id;
                        return (
                          <li
                            key={e.entity_id}
                            className="flex items-center justify-between gap-2 text-sm py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-white/10"
                          >
                            <span className="truncate font-medium" title={e.entity_id}>
                              {name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                              {e.state}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              )}
            </GlassCard>
          )}
        </div>
      </div>
    </AppShell>
  );
}


