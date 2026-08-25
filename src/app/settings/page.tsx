"use client";

import { useEffect, useState, useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  SettingsAlert,
  SettingsCheckRow,
  SettingsField,
  SettingsGroup,
  SettingsInput,
  SettingsPanel,
  SettingsPillTabs,
  SettingsPreview,
  SettingsPrimaryButton,
  SettingsSecondaryButton,
  SettingsSelect,
  SettingsToggle,
  SettingsUploadButton,
} from "@/components/settings/settings-panel";
import { MusicAssistantSettings } from "@/components/settings/music-assistant-settings";
import { useThemeStore } from "@/stores/theme-store";
import { useLanguageStore } from "@/stores/language-store";
import { getScreensaverDelaySeconds, setScreensaverDelaySeconds, getScreensaverBackgroundImage, setScreensaverBackgroundImage, getScreensaverClock24h, setScreensaverClock24h, getScreensaverWeatherEntityId, setScreensaverWeatherEntityId, getScreensaverPexelsEnabled, setScreensaverPexelsEnabled, getScreensaverPexelsQuery, setScreensaverPexelsQuery, getScreensaverPexelsApiKey, setScreensaverPexelsApiKey, getScreensaverPexelsType, setScreensaverPexelsType, getScreensaverFootballEntityId, setScreensaverFootballEntityId } from "@/stores/screensaver-store";
import { getEditModeAllowed, setEditModeAllowed, getEditModePasscode, setEditModePasscode, getEveningHour, setEveningHour } from "@/stores/dashboard-settings-store";
import { hydrateMusicAssistantStore } from "@/stores/music-assistant-store";
import { useCalendarStore, hydrateCalendarStore } from "@/stores/calendar-store";
import { useChoresStore, hydrateChoresStore } from "@/stores/chores-store";
import { useNewsStore } from "@/stores/news-store";
import { CalendarDays, Globe, Image, Link2, List, ListTodo, Monitor, Music2, Newspaper, Palette, LayoutDashboard, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

type SettingsSection = "appearance" | "screensaver" | "page-background" | "language" | "dashboard" | "connection" | "calendar" | "tasks" | "music-assistant" | "news" | "entities";

const SECTION_KEYS: Record<SettingsSection, string> = {
  appearance: "settings.appearance",
  screensaver: "settings.screensaver",
  "page-background": "settings.pageBackground",
  language: "settings.language",
  dashboard: "settings.dashboard",
  connection: "settings.connection",
  calendar: "settings.calendar",
  tasks: "settings.tasks",
  "music-assistant": "settings.musicAssistant",
  news: "news.settings.title",
  entities: "settings.entities",
};

type HaEntity = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
};

const ENTITY_DOMAINS = ["automation", "binary_sensor", "climate", "light", "media_player", "weather"] as const;

const DOMAIN_KEYS: Record<(typeof ENTITY_DOMAINS)[number], string> = {
  automation: "settings.entities.automation",
  binary_sensor: "settings.entities.binarySensor",
  climate: "settings.entities.climate",
  light: "settings.entities.light",
  media_player: "settings.entities.mediaPlayer",
  weather: "settings.entities.weather",
};

function getDomain(entityId: string): string {
  return entityId.split(".")[0] ?? "";
}

export default function SettingsPage() {
  const { t } = useTranslation();
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
  const [editModeAllowed, setEditModeAllowedState] = useState(true);
  const [editModePasscode, setEditModePasscodeState] = useState("");
  const [eveningHour, setEveningHourState] = useState(13);
  const [screensaverDelaySeconds, setScreensaverDelaySecondsState] = useState(0);
  const [screensaverBackground, setScreensaverBackgroundState] = useState("");
  const [screensaverClock24h, setScreensaverClock24hState] = useState(true);
  const [screensaverWeatherEntityId, setScreensaverWeatherEntityIdState] = useState<string | null>(null);
  const [screensaverFootballEntityId, setScreensaverFootballEntityIdState] = useState<string | null>(null);
  const [screensaverPexelsEnabled, setScreensaverPexelsEnabledState] = useState(false);
  const [screensaverPexelsQuery, setScreensaverPexelsQueryState] = useState("nature landscape");
  const [screensaverPexelsApiKey, setScreensaverPexelsApiKeyState] = useState("");
  const [screensaverPexelsType, setScreensaverPexelsTypeState] = useState<"photo" | "video">("photo");
  const [uploadingScreensaverBg, setUploadingScreensaverBg] = useState(false);
  const [appVersion, setAppVersion] = useState<string | null>(null);
  const calendarStore = useCalendarStore();
  const choresStore = useChoresStore();
  const newsStore = useNewsStore();
  const [newsFeedDraft, setNewsFeedDraft] = useState<string[]>([]);
  const [newsFeedInput, setNewsFeedInput] = useState("");
  const [calendarEntities, setCalendarEntities] = useState<HaEntity[]>([]);
  const [calendarEntitiesLoading, setCalendarEntitiesLoading] = useState(false);

  useEffect(() => {
    hydrateMusicAssistantStore();
    hydrateCalendarStore();
    hydrateChoresStore();
  }, []);

  useEffect(() => {
    if (section === "news") setNewsFeedDraft(newsStore.rssUrls);
  }, [section]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setEditModeAllowedState(getEditModeAllowed());
    setEditModePasscodeState(getEditModePasscode());
    setEveningHourState(getEveningHour());
  }, []);

  useEffect(() => {
    setScreensaverDelaySecondsState(getScreensaverDelaySeconds());
    setScreensaverBackgroundState(getScreensaverBackgroundImage());
    setScreensaverClock24hState(getScreensaverClock24h());
    setScreensaverWeatherEntityIdState(getScreensaverWeatherEntityId());
    setScreensaverFootballEntityIdState(getScreensaverFootballEntityId());
    setScreensaverPexelsEnabledState(getScreensaverPexelsEnabled());
    setScreensaverPexelsQueryState(getScreensaverPexelsQuery());
    setScreensaverPexelsApiKeyState(getScreensaverPexelsApiKey());
    setScreensaverPexelsTypeState(getScreensaverPexelsType());
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

  useEffect(() => {
    fetch("/api/version")
      .then((r) => r.json())
      .then((d) => setAppVersion(d.version ?? "onbekend"))
      .catch(() => setAppVersion("onbekend"));
  }, []);

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
      else setTestResult({ ok: false, error: data.error ?? t("settings.connection.test") });
    } catch (err) {
      setTestResult({ ok: false, error: err instanceof Error ? err.message : t("settings.connection.test") });
    } finally {
      setTesting(false);
    }
  }

  async function handleSave() {
    if (!token.trim()) {
      setTestResult({ ok: false, error: t("settings.connection.pleaseEnterToken") });
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
        setTestResult({ ok: false, error: data.error ?? t("settings.connection.save") });
      }
    } catch {
      setSaveMessage("error");
      setTestResult({ ok: false, error: t("settings.connection.save") });
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
  const { language, setLanguage } = useLanguageStore();

  const SECTION_GROUPS: { groupKey: string; sections: { id: SettingsSection; labelKey: string; icon: LucideIcon }[] }[] = [
    { groupKey: "settings.groups.display", sections: [
      { id: "appearance", labelKey: SECTION_KEYS.appearance, icon: Palette },
      { id: "page-background", labelKey: SECTION_KEYS["page-background"], icon: Image },
      { id: "language", labelKey: SECTION_KEYS.language, icon: Globe },
      { id: "screensaver", labelKey: SECTION_KEYS.screensaver, icon: Monitor },
    ]},
    { groupKey: "settings.groups.dashboard", sections: [
      { id: "dashboard", labelKey: SECTION_KEYS.dashboard, icon: LayoutDashboard },
      { id: "connection", labelKey: SECTION_KEYS.connection, icon: Link2 },
      { id: "entities", labelKey: SECTION_KEYS.entities, icon: List },
    ]},
    { groupKey: "settings.groups.pages", sections: [
      { id: "calendar",  labelKey: SECTION_KEYS.calendar,  icon: CalendarDays },
      { id: "tasks",     labelKey: SECTION_KEYS.tasks,     icon: ListTodo     },
    ]},
    { groupKey: "settings.groups.integrations", sections: [
      { id: "news", labelKey: SECTION_KEYS.news, icon: Newspaper },
      { id: "music-assistant", labelKey: SECTION_KEYS["music-assistant"], icon: Music2 },
    ]},
  ];

  const SECTION_META: Record<SettingsSection, { descriptionKey: string; icon: LucideIcon }> = {
    appearance: { descriptionKey: "settings.theme.description", icon: Palette },
    screensaver: { descriptionKey: "settings.screensaver.description", icon: Monitor },
    "page-background": { descriptionKey: "settings.pageBackground.description", icon: Image },
    language: { descriptionKey: "settings.language.intro", icon: Globe },
    dashboard: { descriptionKey: "settings.dashboard.intro", icon: LayoutDashboard },
    connection: { descriptionKey: "settings.connection.description", icon: Link2 },
    calendar: { descriptionKey: "settings.calendar.description", icon: CalendarDays },
    tasks: { descriptionKey: "settings.tasks.description", icon: ListTodo },
    news: { descriptionKey: "news.settings.description", icon: Newspaper },
    "music-assistant": { descriptionKey: "settings.musicAssistant.description", icon: Music2 },
    entities: { descriptionKey: "settings.entities.description", icon: List },
  };
  const currentMeta = SECTION_META[section];

  return (
    <AppShell activeTab="/settings">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row lg:gap-8">
        <aside className="shrink-0 lg:w-64">
          <div className="lg:sticky lg:top-4">
            <h1 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {t("settings.title")}
            </h1>
            <nav
              className="rounded-3xl border border-white/60 bg-white/40 p-2 dark:border-white/10 dark:bg-white/5"
              aria-label={t("settings.title")}
            >
              <div className="flex gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
                {SECTION_GROUPS.map(({ groupKey, sections }, groupIndex) => (
                  <div
                    key={groupKey}
                    className={cn(groupIndex > 0 && "lg:mt-1 lg:border-t lg:border-white/50 lg:pt-2 dark:lg:border-white/10")}
                  >
                    <p className="mb-1 hidden px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 lg:block">
                      {t(groupKey)}
                    </p>
                    <ul className="flex gap-0.5 lg:flex-col">
                      {sections.map(({ id, labelKey, icon: Icon }) => (
                        <li key={id}>
                          <button
                            type="button"
                            onClick={() => setSection(id)}
                            className={cn(
                              "flex w-full items-center gap-2.5 whitespace-nowrap rounded-2xl px-3 py-2 text-left text-sm font-medium transition-colors",
                              section === id
                                ? "bg-accent-purple text-gray-900 shadow-sm"
                                : "text-gray-700 hover:bg-white/70 dark:text-gray-300 dark:hover:bg-white/10"
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0" aria-hidden />
                            {t(labelKey)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <SettingsPanel
            key={section}
            icon={currentMeta.icon}
            title={t(SECTION_KEYS[section])}
            description={t(currentMeta.descriptionKey)}
          >
          {section === "appearance" && (
            <SettingsToggle
              checked={mode === "auto"}
              onChange={(value) => setMode(value ? "auto" : resolved)}
              label={t("settings.theme.auto")}
            />
          )}

          {section === "language" && (
            <SettingsField label={t("settings.language.setting")}>
              <SettingsPillTabs
                items={[
                  { id: "en", label: t("settings.language.en") },
                  { id: "nl", label: t("settings.language.nl") },
                ]}
                value={language}
                onChange={(id) => setLanguage(id)}
              />
            </SettingsField>
          )}

          {section === "screensaver" && (
            <>
              <SettingsField label={t("settings.screensaver.delay")}>
                <SettingsSelect
                  value={screensaverDelaySeconds}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    setScreensaverDelaySecondsState(v);
                    setScreensaverDelaySeconds(v);
                  }}
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
                </SettingsSelect>
              </SettingsField>

              <SettingsField label={t("settings.screensaver.clockFormat")}>
                <SettingsPillTabs
                  items={[
                    { id: "24", label: t("settings.screensaver.24h") },
                    { id: "12", label: t("settings.screensaver.12h") },
                  ]}
                  value={screensaverClock24h ? "24" : "12"}
                  onChange={(id) => {
                    const v = id === "24";
                    setScreensaverClock24hState(v);
                    setScreensaverClock24h(v);
                  }}
                />
              </SettingsField>

              <SettingsField label={t("settings.screensaver.weather")} hint={t("settings.screensaver.weatherHint")}>
                <SettingsSelect
                  value={screensaverWeatherEntityId ?? ""}
                  onChange={(e) => {
                    const v = e.target.value || null;
                    setScreensaverWeatherEntityIdState(v);
                    setScreensaverWeatherEntityId(v);
                  }}
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
                </SettingsSelect>
              </SettingsField>

              <SettingsField label={t("settings.screensaver.football")} hint={t("settings.screensaver.footballHint")}>
                <SettingsSelect
                  value={screensaverFootballEntityId ?? ""}
                  onChange={(e) => {
                    const v = e.target.value || null;
                    setScreensaverFootballEntityIdState(v);
                    setScreensaverFootballEntityId(v);
                  }}
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
                </SettingsSelect>
              </SettingsField>

              <SettingsGroup
                title={t("settings.screensaver.pexels")}
                description={
                  <>
                    {t("settings.screensaver.pexelsHint")}{" "}
                    <a href="https://www.pexels.com/api" target="_blank" rel="noopener noreferrer" className="text-accent-purple hover:underline">
                      pexels.com/api
                    </a>
                    .
                  </>
                }
              >
                <SettingsToggle
                  checked={screensaverPexelsEnabled}
                  onChange={(v) => {
                    setScreensaverPexelsEnabledState(v);
                    setScreensaverPexelsEnabled(v);
                  }}
                  label={t("settings.screensaver.pexelsUse")}
                />
                {screensaverPexelsEnabled && (
                  <div className="space-y-3">
                    <SettingsInput
                      type="password"
                      value={screensaverPexelsApiKey}
                      onChange={(e) => {
                        const v = e.target.value;
                        setScreensaverPexelsApiKeyState(v);
                        setScreensaverPexelsApiKey(v);
                      }}
                      placeholder={t("settings.screensaver.pexelsKey")}
                      autoComplete="off"
                    />
                    <SettingsInput
                      type="text"
                      value={screensaverPexelsQuery}
                      onChange={(e) => {
                        const v = e.target.value;
                        setScreensaverPexelsQueryState(v);
                        setScreensaverPexelsQuery(v);
                      }}
                      placeholder={t("settings.screensaver.pexelsQuery")}
                    />
                    <SettingsPillTabs
                      items={[
                        { id: "photo", label: t("settings.screensaver.pexelsTypePhoto") },
                        { id: "video", label: t("settings.screensaver.pexelsTypeVideo") },
                      ]}
                      value={screensaverPexelsType}
                      onChange={(type) => {
                        setScreensaverPexelsTypeState(type);
                        setScreensaverPexelsType(type);
                      }}
                    />
                  </div>
                )}
              </SettingsGroup>

              <SettingsGroup title={t("settings.screensaver.bgImage")}>
                {screensaverBackground ? <SettingsPreview url={screensaverBackground} /> : null}
                <div className="flex flex-wrap items-center gap-2">
                  <SettingsUploadButton
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={uploadingScreensaverBg}
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
                  >
                    {uploadingScreensaverBg ? t("settings.screensaver.uploading") : t("settings.screensaver.uploadImage")}
                  </SettingsUploadButton>
                  <SettingsInput
                    type="url"
                    value={screensaverBackground}
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      setScreensaverBackgroundState(v);
                      setScreensaverBackgroundImage(v);
                    }}
                    placeholder={t("settings.screensaver.bgUrlPlaceholder")}
                    className="min-w-[200px] flex-1"
                  />
                  {screensaverBackground ? (
                    <SettingsSecondaryButton
                      onClick={() => {
                        setScreensaverBackgroundState("");
                        setScreensaverBackgroundImage("");
                      }}
                    >
                      {t("settings.screensaver.remove")}
                    </SettingsSecondaryButton>
                  ) : null}
                </div>
              </SettingsGroup>
            </>
          )}

          {section === "page-background" && (
            dashboardId ? (
              <div className="space-y-4">
                <SettingsGroup title={t("settings.pageBackground.light")}>
                  {pageBackgroundLight ? <SettingsPreview url={pageBackgroundLight} /> : null}
                  <div className="flex flex-wrap gap-2">
                    <SettingsUploadButton
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      disabled={uploadingBgLight}
                      onChange={handlePageBackgroundLightUpload}
                    >
                      {uploadingBgLight ? t("settings.screensaver.uploading") : t("settings.pageBackground.upload")}
                    </SettingsUploadButton>
                    {pageBackgroundLight ? (
                      <SettingsSecondaryButton onClick={handlePageBackgroundLightRemove}>
                        {t("settings.pageBackground.remove")}
                      </SettingsSecondaryButton>
                    ) : null}
                  </div>
                </SettingsGroup>
                <SettingsGroup title={t("settings.pageBackground.dark")}>
                  {pageBackgroundDark ? <SettingsPreview url={pageBackgroundDark} /> : null}
                  <div className="flex flex-wrap gap-2">
                    <SettingsUploadButton
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      disabled={uploadingBgDark}
                      onChange={handlePageBackgroundDarkUpload}
                    >
                      {uploadingBgDark ? t("settings.screensaver.uploading") : t("settings.pageBackground.upload")}
                    </SettingsUploadButton>
                    {pageBackgroundDark ? (
                      <SettingsSecondaryButton onClick={handlePageBackgroundDarkRemove}>
                        {t("settings.pageBackground.remove")}
                      </SettingsSecondaryButton>
                    ) : null}
                  </div>
                </SettingsGroup>
                <SettingsGroup title={t("settings.pageBackground.fallback")} description={t("settings.pageBackground.fallbackDesc")}>
                  {pageBackground ? <SettingsPreview url={pageBackground} /> : null}
                  <div className="flex flex-wrap gap-2">
                    <SettingsUploadButton
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      disabled={uploadingBg}
                      onChange={handlePageBackgroundUpload}
                    >
                      {uploadingBg ? t("settings.screensaver.uploading") : t("settings.pageBackground.upload")}
                    </SettingsUploadButton>
                    {pageBackground ? (
                      <SettingsSecondaryButton onClick={handlePageBackgroundRemove}>
                        {t("settings.pageBackground.remove")}
                      </SettingsSecondaryButton>
                    ) : null}
                  </div>
                </SettingsGroup>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("settings.pageBackground.needDashboard")}</p>
            )
          )}

          {section === "dashboard" && (
            <>
              <SettingsToggle
                checked={editModeAllowed}
                onChange={(v) => {
                  setEditModeAllowedState(v);
                  setEditModeAllowed(v);
                }}
                label={t("settings.dashboard.editModeAllowed")}
                description={t("settings.dashboard.editModeAllowedHint")}
              />
              <SettingsField
                label={t("settings.dashboard.editModePasscode")}
                hint={t("settings.dashboard.editModePasscodeHint")}
                htmlFor="edit-mode-passcode"
              >
                <SettingsInput
                  id="edit-mode-passcode"
                  type="password"
                  value={editModePasscode}
                  onChange={(e) => {
                    const v = e.target.value;
                    setEditModePasscodeState(v);
                    setEditModePasscode(v);
                  }}
                  placeholder={t("settings.dashboard.editModePasscodePlaceholder")}
                  autoComplete="off"
                  className="max-w-xs"
                />
              </SettingsField>
            </>
          )}

          {section === "connection" && (
            <div className="space-y-4">
              <SettingsField label={t("settings.connection.baseUrl")} htmlFor="ha-baseUrl">
                <SettingsInput
                  id="ha-baseUrl"
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="http://homeassistant.local:8123"
                />
              </SettingsField>
              <SettingsField label={t("settings.connection.token")} htmlFor="ha-token">
                <SettingsInput
                  id="ha-token"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder={t("settings.connection.tokenPlaceholder")}
                  autoComplete="off"
                />
              </SettingsField>
              {testResult ? (
                <SettingsAlert tone={testResult.ok ? "ok" : "error"}>
                  {testResult.ok ? t("settings.connection.success") : testResult.error}
                </SettingsAlert>
              ) : null}
              {saveMessage === "success" ? (
                <p className="text-sm text-emerald-700 dark:text-emerald-300">{t("settings.connection.saved")}</p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <SettingsPrimaryButton onClick={handleTest} disabled={testing}>
                  {testing ? t("settings.connection.testing") : t("settings.connection.test")}
                </SettingsPrimaryButton>
                <SettingsSecondaryButton onClick={handleSave} disabled={saving || !token.trim()}>
                  {saving ? t("settings.connection.saving") : t("settings.connection.save")}
                </SettingsSecondaryButton>
              </div>
            </div>
          )}

          {section === "tasks" && (
            <>
              <SettingsToggle
                checked={choresStore.enabled}
                onChange={choresStore.setEnabled}
                label={t("settings.tasks.enabled")}
              />
              {choresStore.enabled ? (
                <SettingsGroup>
                  <SettingsField label={t("settings.tasks.eveningHour")}>
                    <div className="flex items-center gap-2">
                      <SettingsInput
                        type="number"
                        min={0}
                        max={23}
                        value={eveningHour}
                        onChange={(e) => {
                          const v = Math.max(0, Math.min(23, parseInt(e.target.value) || 0));
                          setEveningHourState(v);
                          setEveningHour(v);
                        }}
                        className="w-24"
                      />
                      <span className="text-sm text-gray-500 dark:text-gray-400">{t("settings.tasks.eveningHourSuffix")}</span>
                    </div>
                  </SettingsField>
                  <a
                    href="/family"
                    className="inline-flex items-center gap-2 self-start rounded-full bg-accent-purple px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:opacity-90"
                  >
                    <ListTodo className="h-4 w-4" />
                    {t("settings.tasks.manage")}
                  </a>
                </SettingsGroup>
              ) : null}
            </>
          )}

          {section === "calendar" && (
            <>
              <SettingsToggle
                checked={calendarStore.enabled}
                onChange={calendarStore.setEnabled}
                label={t("settings.calendar.enabled")}
              />
              <SettingsGroup title={t("settings.calendar.entities")}>
                <div className="flex items-center justify-end gap-2">
                  <SettingsSecondaryButton
                    onClick={async () => {
                      setCalendarEntitiesLoading(true);
                      try {
                        const res = await fetch("/api/ha/entities");
                        const data = await res.json();
                        if (Array.isArray(data)) {
                          setCalendarEntities(
                            (data as HaEntity[]).filter((e) => e.entity_id.startsWith("calendar."))
                          );
                        }
                      } catch { /* ignore */ } finally {
                        setCalendarEntitiesLoading(false);
                      }
                    }}
                    disabled={calendarEntitiesLoading}
                    className="px-3 py-1.5 text-xs"
                  >
                    {calendarEntitiesLoading ? (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-accent-purple/40 border-t-accent-purple" />
                    ) : null}
                    {t("settings.calendar.loadEntities")}
                  </SettingsSecondaryButton>
                </div>
                {calendarEntities.length === 0 && !calendarEntitiesLoading ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t("settings.calendar.noEntities")}</p>
                ) : (
                  <div className="space-y-1.5">
                    {calendarEntities.map((entity) => {
                      const checked = calendarStore.calendarEntityIds.includes(entity.entity_id);
                      const friendlyName = (entity.attributes as Record<string, unknown>)?.friendly_name as string | undefined;
                      return (
                        <SettingsCheckRow
                          key={entity.entity_id}
                          checked={checked}
                          onChange={(value) => {
                            const ids = calendarStore.calendarEntityIds;
                            calendarStore.setCalendarEntityIds(
                              value
                                ? [...ids, entity.entity_id]
                                : ids.filter((id) => id !== entity.entity_id)
                            );
                          }}
                          label={friendlyName ?? entity.entity_id}
                          description={friendlyName ? entity.entity_id : undefined}
                        />
                      );
                    })}
                  </div>
                )}
              </SettingsGroup>
            </>
          )}

          {section === "music-assistant" && <MusicAssistantSettings />}

          {section === "entities" && (
            <>
              {entitiesLoading ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("settings.entities.loading")}</p>
              ) : entitiesError ? (
                <SettingsAlert tone="error">{entitiesError}</SettingsAlert>
              ) : byDomain.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("settings.entities.empty")}</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <SettingsPillTabs
                      items={byDomain.map(([domain, list]) => ({
                        id: domain,
                        label: `${t(DOMAIN_KEYS[domain])} (${list.length})`,
                      }))}
                      value={(activeDomain ?? byDomain[0][0]) as (typeof ENTITY_DOMAINS)[number]}
                      onChange={(id) => setSelectedDomain(id)}
                    />
                    <button
                      type="button"
                      onClick={loadEntities}
                      className="shrink-0 text-sm font-medium text-accent-purple hover:underline"
                    >
                      {t("settings.entities.refresh")}
                    </button>
                  </div>
                  <div role="tabpanel" className="max-h-[50vh] space-y-1 overflow-auto rounded-2xl bg-black/[0.03] p-2 dark:bg-white/5">
                    {activeList.map((e) => {
                      const name = (e.attributes?.friendly_name as string) ?? e.entity_id;
                      return (
                        <div
                          key={e.entity_id}
                          className="flex items-center justify-between gap-2 rounded-2xl px-3 py-2 text-sm hover:bg-white/50 dark:hover:bg-white/10"
                        >
                          <span className="truncate font-medium text-gray-800 dark:text-gray-100" title={e.entity_id}>
                            {name}
                          </span>
                          <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">{e.state}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {section === "news" && (
            <>
              <SettingsToggle
                checked={newsStore.enabled}
                onChange={newsStore.setEnabled}
                label={t("news.settings.enabled")}
              />
              <SettingsGroup title={t("news.settings.feeds")}>
                {newsFeedDraft.length > 0 ? (
                  <ul className="space-y-1.5">
                    {newsFeedDraft.map((url, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="min-w-0 flex-1 truncate rounded-2xl bg-white/70 px-3 py-2 font-mono text-xs text-gray-700 dark:bg-white/5 dark:text-gray-300">
                          {url}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = newsFeedDraft.filter((_, j) => j !== i);
                            setNewsFeedDraft(next);
                            newsStore.setRssUrls(next);
                          }}
                          className="shrink-0 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
                          aria-label={t("news.settings.removeFeed")}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {newsFeedDraft.length < 10 ? (
                  <div className="flex gap-2">
                    <SettingsInput
                      type="url"
                      value={newsFeedInput}
                      onChange={(e) => setNewsFeedInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newsFeedInput.trim()) {
                          const next = [...newsFeedDraft, newsFeedInput.trim()];
                          setNewsFeedDraft(next);
                          newsStore.setRssUrls(next);
                          setNewsFeedInput("");
                        }
                      }}
                      placeholder={t("news.settings.feedPlaceholder")}
                    />
                    <SettingsPrimaryButton
                      onClick={() => {
                        if (!newsFeedInput.trim()) return;
                        const next = [...newsFeedDraft, newsFeedInput.trim()];
                        setNewsFeedDraft(next);
                        newsStore.setRssUrls(next);
                        setNewsFeedInput("");
                      }}
                      className="shrink-0"
                    >
                      {t("news.settings.addFeed")}
                    </SettingsPrimaryButton>
                  </div>
                ) : null}
              </SettingsGroup>
            </>
          )}
          </SettingsPanel>
        </div>
      </div>
      {appVersion && (
        <p className="fixed bottom-4 right-4 text-xs font-mono text-gray-400 dark:text-gray-500 pointer-events-none select-none">
          v{appVersion}
        </p>
      )}
    </AppShell>
  );
}


