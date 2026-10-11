"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import {
  SettingsAlert,
  SettingsCheckRow,
  SettingsField,
  SettingsGroup,
  SettingsInput,
  SettingsPanel,
  SettingsPillTabs,
  SettingsPrimaryButton,
  SettingsSecondaryButton,
  SettingsSelect,
  SettingsToggle,
} from "@/components/settings/settings-panel";
import { MusicAssistantSettings } from "@/components/settings/music-assistant-settings";
import { VoiceSatelliteSettings } from "@/components/settings/voice-satellite-settings";
import { ValetudoSettings } from "@/components/settings/valetudo-settings";
import { PexelsSettings } from "@/components/settings/pexels-settings";
import { ImmichSettings } from "@/components/settings/immich-settings";
import {
  LanguagePreview,
  SettingsAccentDots,
  SettingsChipSelect,
  SettingsChoiceCards,
  SettingsImagePick,
  ThemePreview,
} from "@/components/settings/settings-choice-cards";
import {
  ScreensaverEnableToggle,
  ScreensaverSettings,
  useScreensaverEnabledToggle,
} from "@/components/settings/screensaver-settings";
import { useThemeStore, type ThemeMode } from "@/stores/theme-store";
import { useUiSoundStore } from "@/stores/ui-sound-store";
import { useGlassDensityStore } from "@/stores/glass-density-store";
import { GLASS_DENSITIES, type GlassDensity } from "@/lib/glass-density";
import type { ThemeAccentId } from "@/lib/theme-accents";
import { playUiClick } from "@/lib/ui-click";
import { useLanguageStore } from "@/stores/language-store";
import { getScreensaverDelaySeconds, setScreensaverDelaySeconds, getScreensaverBackgroundImage, setScreensaverBackgroundImage, getScreensaverClock24h, setScreensaverClock24h, getScreensaverWeatherEntityId, setScreensaverWeatherEntityId, getScreensaverPexelsEnabled, getScreensaverPexelsApiKey, getScreensaverFootballEntityId, setScreensaverFootballEntityId, getScreensaverMusicEntityId, setScreensaverMusicEntityId, getScreensaverClockPosition, setScreensaverClockPosition, getScreensaverClockSize, setScreensaverClockSize, getScreensaverClockWeight, setScreensaverClockWeight, getScreensaverMediaSource, setScreensaverMediaSource, type ScreensaverMediaSource } from "@/stores/screensaver-store";
import { isImmichSourceReady, isPexelsSourceReady } from "@/lib/screensaver-media-source";
import { DEFAULT_SCREENSAVER_CLOCK_POSITION, type ScreensaverClockPosition } from "@/lib/screensaver-clock-position";
import { DEFAULT_SCREENSAVER_CLOCK_SIZE, type ScreensaverClockSize } from "@/lib/screensaver-clock-size";
import { DEFAULT_SCREENSAVER_CLOCK_WEIGHT, type ScreensaverClockWeight } from "@/lib/screensaver-clock-weight";
import { getEditModeAllowed, setEditModeAllowed, getEditModePasscode, setEditModePasscode, getEveningHour, setEveningHour } from "@/stores/dashboard-settings-store";
import { hydrateMusicAssistantStore, useMusicAssistantStore } from "@/stores/music-assistant-store";
import { useCalendarStore, hydrateCalendarStore } from "@/stores/calendar-store";
import { useChoresStore, hydrateChoresStore } from "@/stores/chores-store";
import { hydrateValetudoStore, useValetudoStore } from "@/stores/valetudo-store";
import { hydrateVoiceSatelliteStore, useVoiceSatelliteStore } from "@/stores/voice-satellite-store";
import { hydrateImmichStore, useImmichStore } from "@/stores/immich-store";
import { hydrateEnergyStore, useEnergyStore } from "@/stores/energy-store";
import { EnergyEntitySettings } from "@/components/settings/energy-entity-settings";
import { useNewsStore } from "@/stores/news-store";
import { RobotVacuum, Bell, BookOpen, CalendarDays, ChevronRight, DoorOpen, Home, Images, Image as ImageIcon, LayoutGrid, List, ListTodo, Mic, Monitor, Music2, Newspaper, Palette, X, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";
import { useTranslation } from "@/hooks/use-translation";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { DoorbellSettings } from "@/components/settings/doorbell-settings";
import { hydrateNotificationRulesStore } from "@/stores/notification-rules-store";
import { hydrateDoorbellStore, useDoorbellStore } from "@/stores/doorbell-store";

type SettingsSection = "appearance" | "screensaver" | "pages" | "notifications" | "connection" | "apps" | "entities";
type SettingsPageId = "calendar" | "energy" | "tasks";
type SettingsAppId = "news" | "music-assistant" | "valetudo" | "pexels" | "immich" | "voice-satellite" | "doorbell";

const SECTION_KEYS: Record<SettingsSection, string> = {
  appearance: "settings.appearance",
  screensaver: "settings.screensaver",
  pages: "settings.pages",
  notifications: "settings.notifications",
  connection: "settings.connection",
  apps: "settings.apps",
  entities: "settings.entities",
};

const PAGE_KEYS: Record<SettingsPageId, { labelKey: string; descriptionKey: string; icon: LucideIcon }> = {
  calendar: { labelKey: "settings.calendar", descriptionKey: "settings.calendar.description", icon: CalendarDays },
  energy: { labelKey: "settings.energy", descriptionKey: "settings.energy.description", icon: Zap },
  tasks: { labelKey: "settings.tasks", descriptionKey: "settings.tasks.description", icon: ListTodo },
};

const LEGACY_SECTION_REDIRECT: Record<string, { section: SettingsSection; page?: SettingsPageId }> = {
  language: { section: "appearance" },
  dashboard: { section: "appearance" },
  calendar: { section: "pages", page: "calendar" },
  energy: { section: "pages", page: "energy" },
  tasks: { section: "pages", page: "tasks" },
};

const APP_KEYS: Record<SettingsAppId, { labelKey: string; descriptionKey: string; icon: LucideIcon }> = {
  news: { labelKey: "news.settings.title", descriptionKey: "news.settings.description", icon: Newspaper },
  "music-assistant": { labelKey: "settings.musicAssistant", descriptionKey: "settings.musicAssistant.description", icon: Music2 },
  valetudo: { labelKey: "settings.valetudo", descriptionKey: "settings.valetudo.description", icon: RobotVacuum },
  pexels: { labelKey: "settings.pexels", descriptionKey: "settings.pexels.description", icon: ImageIcon },
  immich: { labelKey: "settings.immich", descriptionKey: "settings.immich.description", icon: Images },
  "voice-satellite": { labelKey: "settings.voiceSatellite", descriptionKey: "settings.voiceSatellite.description", icon: Mic },
  doorbell: { labelKey: "settings.doorbell", descriptionKey: "settings.doorbell.description", icon: DoorOpen },
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

function CalendarTitleCodesEditor() {
  const { t } = useTranslation();
  const titleCodes = useCalendarStore((s) => s.titleCodes);
  const setTitleCodes = useCalendarStore((s) => s.setTitleCodes);
  const [rows, setRows] = useState<{ code: string; label: string }[]>(() =>
    Object.entries(titleCodes).map(([code, label]) => ({ code, label }))
  );

  function persist(next: { code: string; label: string }[]) {
    setRows(next);
    const map: Record<string, string> = {};
    for (const row of next) {
      const code = row.code.trim().toUpperCase();
      const label = row.label.trim();
      if (code && label) map[code] = label;
    }
    setTitleCodes(map);
  }

  return (
    <div className="space-y-2">
      {rows.map((row, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <SettingsInput
            value={row.code}
            onChange={(e) => {
              const next = rows.map((r, i) => (i === idx ? { ...r, code: e.target.value } : r));
              setRows(next);
            }}
            onBlur={(e) => persist(rows.map((r, i) => (i === idx ? { ...r, code: e.target.value } : r)))}
            placeholder={t("settings.calendar.titleCode")}
            className="w-24 shrink-0 uppercase"
            aria-label={t("settings.calendar.titleCode")}
          />
          <SettingsInput
            value={row.label}
            onChange={(e) => {
              const next = rows.map((r, i) => (i === idx ? { ...r, label: e.target.value } : r));
              setRows(next);
            }}
            onBlur={(e) => persist(rows.map((r, i) => (i === idx ? { ...r, label: e.target.value } : r)))}
            placeholder={t("settings.calendar.titleLabel")}
            aria-label={t("settings.calendar.titleLabel")}
          />
          <button
            type="button"
            onClick={() => persist(rows.filter((_, i) => i !== idx))}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-black/5 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200"
            aria-label={t("editPanel.remove")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <SettingsSecondaryButton
        onClick={() => setRows([...rows, { code: "", label: "" }])}
        className="px-3 py-1.5 text-xs"
      >
        {t("settings.calendar.titleAdd")}
      </SettingsSecondaryButton>
    </div>
  );
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const [baseUrl, setBaseUrl] = useState("http://homeassistant.local:8123");
  const [token, setToken] = useState("");
  const [connectionSource, setConnectionSource] = useState<"supervisor" | "manual" | null>(null);
  const [isAddon, setIsAddon] = useState(false);
  const [discoveredInstances, setDiscoveredInstances] = useState<{ baseUrl: string; name: string }[]>([]);
  const [discovering, setDiscovering] = useState(false);
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
  const [energyDashboardId, setEnergyDashboardId] = useState<string | null>(null);
  const [energyBackgroundLight, setEnergyBackgroundLight] = useState<string | null>(null);
  const [energyBackgroundDark, setEnergyBackgroundDark] = useState<string | null>(null);
  const [uploadingEnergyBgLight, setUploadingEnergyBgLight] = useState(false);
  const [uploadingEnergyBgDark, setUploadingEnergyBgDark] = useState(false);
  const [section, setSection] = useState<SettingsSection>("appearance");
  const [selectedPage, setSelectedPage] = useState<SettingsPageId | null>(null);
  const [selectedApp, setSelectedApp] = useState<SettingsAppId | null>(null);
  const [editModeAllowed, setEditModeAllowedState] = useState(true);
  const [editModePasscode, setEditModePasscodeState] = useState("");
  const [eveningHour, setEveningHourState] = useState(13);
  const [screensaverDelaySeconds, setScreensaverDelaySecondsState] = useState(0);
  const [screensaverBackground, setScreensaverBackgroundState] = useState("");
  const [screensaverClock24h, setScreensaverClock24hState] = useState(true);
  const [screensaverClockPosition, setScreensaverClockPositionState] = useState<ScreensaverClockPosition>(DEFAULT_SCREENSAVER_CLOCK_POSITION);
  const [screensaverClockSize, setScreensaverClockSizeState] = useState<ScreensaverClockSize>(DEFAULT_SCREENSAVER_CLOCK_SIZE);
  const [screensaverClockWeight, setScreensaverClockWeightState] = useState<ScreensaverClockWeight>(DEFAULT_SCREENSAVER_CLOCK_WEIGHT);
  const [screensaverWeatherEntityId, setScreensaverWeatherEntityIdState] = useState<string | null>(null);
  const [screensaverFootballEntityId, setScreensaverFootballEntityIdState] = useState<string | null>(null);
  const [screensaverMusicEntityId, setScreensaverMusicEntityIdState] = useState<string | null>(null);
  const [screensaverMediaSource, setScreensaverMediaSourceState] = useState<ScreensaverMediaSource>("custom");
  const [uploadingScreensaverBg, setUploadingScreensaverBg] = useState(false);
  const [appVersion, setAppVersion] = useState<string | null>(null);
  const calendarStore = useCalendarStore();
  const energyStore = useEnergyStore();
  const choresStore = useChoresStore();
  const newsStore = useNewsStore();
  const musicAssistant = useMusicAssistantStore();
  const valetudo = useValetudoStore();
  const voiceSatellite = useVoiceSatelliteStore();
  const immich = useImmichStore();
  const doorbellEnabled = useDoorbellStore((s) => s.settings.enabled);
  const [pexelsEnabled, setPexelsEnabled] = useState(false);
  const [pexelsEnvConfigured, setPexelsEnvConfigured] = useState(false);
  const [immichEnvKeyConfigured, setImmichEnvKeyConfigured] = useState(false);
  const [immichEnvUrlConfigured, setImmichEnvUrlConfigured] = useState(false);
  const [newsFeedDraft, setNewsFeedDraft] = useState<string[]>([]);
  const [newsFeedInput, setNewsFeedInput] = useState("");
  const [calendarEntities, setCalendarEntities] = useState<HaEntity[]>([]);
  const [calendarEntitiesLoading, setCalendarEntitiesLoading] = useState(false);

  useEffect(() => {
    hydrateMusicAssistantStore();
    hydrateCalendarStore();
    hydrateEnergyStore();
    hydrateChoresStore();
    hydrateValetudoStore();
    hydrateVoiceSatelliteStore();
    hydrateImmichStore();
    hydrateNotificationRulesStore();
    hydrateDoorbellStore();
    const next = new URLSearchParams(window.location.search).get("section");
    if (next && next in SECTION_KEYS) {
      setSection(next as SettingsSection);
    } else if (next && next in LEGACY_SECTION_REDIRECT) {
      const legacy = LEGACY_SECTION_REDIRECT[next];
      setSection(legacy.section);
      if (legacy.page) setSelectedPage(legacy.page);
      const url = new URL(window.location.href);
      url.searchParams.set("section", legacy.section);
      if (legacy.page) url.searchParams.set("page", legacy.page);
      else url.searchParams.delete("page");
      window.history.replaceState({}, "", `${url.pathname}${url.search}`);
    }
    const pageParam = new URLSearchParams(window.location.search).get("page");
    if (pageParam && pageParam in PAGE_KEYS) setSelectedPage(pageParam as SettingsPageId);
    let cancelled = false;
    fetch("/api/pexels/status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.envConfigured === "boolean") {
          setPexelsEnvConfigured(data.envConfigured);
        }
      })
      .catch(() => {
        /* ignore */
      });
    fetch("/api/immich/status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (typeof data.envKeyConfigured === "boolean") setImmichEnvKeyConfigured(data.envKeyConfigured);
        if (typeof data.envUrlConfigured === "boolean") setImmichEnvUrlConfigured(data.envUrlConfigured);
      })
      .catch(() => {
        /* ignore */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (selectedApp === "news") setNewsFeedDraft(newsStore.rssUrls);
  }, [selectedApp]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setEditModeAllowedState(getEditModeAllowed());
    setEditModePasscodeState(getEditModePasscode());
    setEveningHourState(getEveningHour());
  }, []);

  useEffect(() => {
    setScreensaverDelaySecondsState(getScreensaverDelaySeconds());
    setScreensaverBackgroundState(getScreensaverBackgroundImage());
    setScreensaverClock24hState(getScreensaverClock24h());
    setScreensaverClockPositionState(getScreensaverClockPosition());
    setScreensaverClockSizeState(getScreensaverClockSize());
    setScreensaverClockWeightState(getScreensaverClockWeight());
    setScreensaverWeatherEntityIdState(getScreensaverWeatherEntityId());
    setScreensaverFootballEntityIdState(getScreensaverFootballEntityId());
    setScreensaverMusicEntityIdState(getScreensaverMusicEntityId());
    setScreensaverMediaSourceState(getScreensaverMediaSource());
    setPexelsEnabled(getScreensaverPexelsEnabled());
    const onScreensaverChange = () => {
      setScreensaverMediaSourceState(getScreensaverMediaSource());
      setPexelsEnabled(getScreensaverPexelsEnabled());
    };
    window.addEventListener("screensaver-setting-changed", onScreensaverChange);
    return () => window.removeEventListener("screensaver-setting-changed", onScreensaverChange);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("ha_oauth") === "ok") {
      const haBase = params.get("ha_base");
      if (haBase) setBaseUrl(haBase);
      setConnectionSource("manual");
      setTestResult({ ok: true });
      setSaveMessage("success");
      setSection("connection");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (params.get("ha_oauth") === "error") {
      setTestResult({
        ok: false,
        error: params.get("ha_oauth_error") || t("settings.connection.oauthFail"),
      });
      setSection("connection");
      window.history.replaceState({}, "", window.location.pathname);
    }

    fetch("/api/ha/connection")
      .then((r) => r.json())
      .then((d) => {
        if (d?.baseUrl) setBaseUrl(d.baseUrl);
        if (d?.source === "supervisor" || d?.source === "manual") setConnectionSource(d.source);
        if (typeof d?.addon === "boolean") setIsAddon(d.addon);
        if (d?.source === "supervisor" && d?.ok === false && d?.error) {
          setTestResult({ ok: false, error: d.error });
        }
      })
      .catch(() => {});
  }, [t]);

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

  useEffect(() => {
    fetch("/api/energy-dashboard")
      .then((r) => r.json())
      .then((d) => {
        if (d?.id) setEnergyDashboardId(d.id);
        setEnergyBackgroundLight(d?.backgroundLight ?? null);
        setEnergyBackgroundDark(d?.backgroundDark ?? null);
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

  // Soft-discover HA when opening Connection (self-hosted only).
  useEffect(() => {
    if (section !== "connection") return;
    if (isAddon || connectionSource === "supervisor") return;
    let cancelled = false;
    (async () => {
      setDiscovering(true);
      try {
        const res = await fetch("/api/ha/discover");
        const data = (await res.json()) as {
          instances?: { baseUrl: string; name: string }[];
          skipped?: boolean;
        };
        if (cancelled || data.skipped) return;
        setDiscoveredInstances(data.instances ?? []);
        if ((data.instances?.length ?? 0) === 1 && !baseUrl.trim()) {
          setBaseUrl(data.instances![0].baseUrl);
        }
      } catch {
        /* ignore — user can still search manually */
      } finally {
        if (!cancelled) setDiscovering(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // Only re-run when opening connection / addon status changes — not on every baseUrl edit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, isAddon, connectionSource]);

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
      if (connectionSource === "supervisor" || (isAddon && !token.trim())) {
        const res = await fetch("/api/ha/connection?test=1");
        const data = await res.json();
        if (data.ok !== false && (data.source === "supervisor" || data.baseUrl)) {
          setTestResult({ ok: true });
          setConnectionSource(data.source ?? "supervisor");
        } else {
          setTestResult({ ok: false, error: data.error ?? t("settings.connection.test") });
        }
        return;
      }
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
    if (connectionSource === "supervisor" && isAddon && !token.trim()) {
      setSaving(true);
      setSaveMessage(null);
      try {
        const res = await fetch("/api/ha/connection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ useSupervisor: true }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setSaveMessage("success");
          setConnectionSource("supervisor");
          setToken("");
        } else {
          setTestResult({ ok: false, error: data.error ?? t("settings.connection.save") });
          setSaveMessage("error");
        }
      } catch {
        setTestResult({ ok: false, error: t("settings.connection.save") });
        setSaveMessage("error");
      } finally {
        setSaving(false);
      }
      return;
    }
    if (!token.trim()) {
      setTestResult({ ok: false, error: t("settings.connection.pleaseEnterToken") });
      return;
    }
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/ha/connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl, token }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSaveMessage("success");
        setConnectionSource(data.source === "supervisor" ? "supervisor" : "manual");
        setToken("");
      } else {
        setTestResult({ ok: false, error: data.error ?? t("settings.connection.save") });
        setSaveMessage("error");
      }
    } catch {
      setTestResult({ ok: false, error: t("settings.connection.save") });
      setSaveMessage("error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDiscover() {
    setDiscovering(true);
    setTestResult(null);
    try {
      const q = baseUrl.trim() ? `?url=${encodeURIComponent(baseUrl.trim())}` : "";
      const res = await fetch(`/api/ha/discover${q}`);
      const data = (await res.json()) as {
        instances?: { baseUrl: string; name: string }[];
        skipped?: boolean;
        error?: string;
      };
      if (data.skipped) {
        setDiscoveredInstances([]);
        return;
      }
      setDiscoveredInstances(data.instances ?? []);
      if (data.error) {
        setTestResult({ ok: false, error: data.error });
      } else if ((data.instances?.length ?? 0) === 0) {
        setTestResult({ ok: false, error: t("settings.connection.discoverEmpty") });
      }
    } catch (err) {
      setTestResult({
        ok: false,
        error: err instanceof Error ? err.message : t("settings.connection.discoverFail"),
      });
    } finally {
      setDiscovering(false);
    }
  }

  function handleOauthLogin() {
    if (!baseUrl.trim()) {
      setTestResult({ ok: false, error: t("settings.connection.needUrl") });
      return;
    }
    const returnTo = encodeURIComponent("/settings");
    window.location.href = withBasePath(
      `/api/ha/oauth/start?baseUrl=${encodeURIComponent(baseUrl.trim())}&returnTo=${returnTo}`
    );
  }

  async function handleUseSupervisor() {
    setSaving(true);
    setSaveMessage(null);
    setTestResult(null);
    try {
      const res = await fetch("/api/ha/connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useSupervisor: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSaveMessage("success");
        setConnectionSource("supervisor");
        setBaseUrl(data.baseUrl ?? "http://supervisor/core");
        setToken("");
        setTestResult({ ok: true });
      } else {
        setTestResult({ ok: false, error: data.error ?? t("settings.connection.save") });
        setSaveMessage("error");
      }
    } catch {
      setTestResult({ ok: false, error: t("settings.connection.save") });
      setSaveMessage("error");
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

  async function handleEnergyBackgroundLightUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !energyDashboardId) return;
    e.target.value = "";
    setUploadingEnergyBgLight(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      const put = await fetch(`/api/energy-dashboard/${energyDashboardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backgroundLight: json.url }),
      });
      const saved = await put.json();
      if (!put.ok) throw new Error(saved.error || "Save failed");
      setEnergyBackgroundLight(saved.backgroundLight ?? json.url);
    } catch {
      // error could be shown in UI
    } finally {
      setUploadingEnergyBgLight(false);
    }
  }

  async function handleEnergyBackgroundLightReset() {
    if (!energyDashboardId) return;
    try {
      const put = await fetch(`/api/energy-dashboard/${energyDashboardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backgroundLight: null }),
      });
      if (!put.ok) throw new Error("Save failed");
      setEnergyBackgroundLight(null);
    } finally {
      setUploadingEnergyBgLight(false);
    }
  }

  async function handleEnergyBackgroundDarkUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !energyDashboardId) return;
    e.target.value = "";
    setUploadingEnergyBgDark(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      const put = await fetch(`/api/energy-dashboard/${energyDashboardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backgroundDark: json.url }),
      });
      const saved = await put.json();
      if (!put.ok) throw new Error(saved.error || "Save failed");
      setEnergyBackgroundDark(saved.backgroundDark ?? json.url);
    } catch {
      // error could be shown in UI
    } finally {
      setUploadingEnergyBgDark(false);
    }
  }

  async function handleEnergyBackgroundDarkReset() {
    if (!energyDashboardId) return;
    try {
      const put = await fetch(`/api/energy-dashboard/${energyDashboardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backgroundDark: null }),
      });
      if (!put.ok) throw new Error("Save failed");
      setEnergyBackgroundDark(null);
    } finally {
      setUploadingEnergyBgDark(false);
    }
  }

  const { mode, setMode, accent, setAccent } = useThemeStore();
  const uiSoundEnabled = useUiSoundStore((s) => s.enabled);
  const setUiSoundEnabled = useUiSoundStore((s) => s.setEnabled);
  const glassDensity = useGlassDensityStore((s) => s.density);
  const setGlassDensity = useGlassDensityStore((s) => s.setDensity);
  const { language, setLanguage } = useLanguageStore();

  const SECTION_GROUPS: { groupKey: string; sections: { id: SettingsSection; labelKey: string; icon: LucideIcon }[] }[] = [
    { groupKey: "settings.groups.display", sections: [
      { id: "appearance", labelKey: SECTION_KEYS.appearance, icon: Palette },
      { id: "screensaver", labelKey: SECTION_KEYS.screensaver, icon: Monitor },
    ]},
    { groupKey: "settings.groups.dashboard", sections: [
      { id: "pages", labelKey: SECTION_KEYS.pages, icon: BookOpen },
      { id: "notifications", labelKey: SECTION_KEYS.notifications, icon: Bell },
    ]},
    { groupKey: "settings.groups.system", sections: [
      { id: "connection", labelKey: SECTION_KEYS.connection, icon: Home },
      { id: "apps", labelKey: SECTION_KEYS.apps, icon: LayoutGrid },
    ]},
  ];

  const SECTION_META: Record<SettingsSection, { descriptionKey: string; icon: LucideIcon }> = {
    appearance: { descriptionKey: "settings.theme.description", icon: Palette },
    screensaver: { descriptionKey: "settings.screensaver.description", icon: Monitor },
    pages: { descriptionKey: "settings.pages.description", icon: BookOpen },
    notifications: { descriptionKey: "settings.notifications.description", icon: Bell },
    connection: {
      descriptionKey:
        connectionSource === "supervisor"
          ? "settings.connection.descriptionSupervisor"
          : "settings.connection.description",
      icon: Home,
    },
    apps: { descriptionKey: "settings.apps.description", icon: LayoutGrid },
    entities: { descriptionKey: "settings.entities.description", icon: List },
  };
  const currentApp = selectedApp ? APP_KEYS[selectedApp] : null;
  const currentPage = selectedPage ? PAGE_KEYS[selectedPage] : null;
  const panelMeta = currentApp ?? currentPage ?? SECTION_META[section];
  const panelTitle = currentApp
    ? t(currentApp.labelKey)
    : currentPage
      ? t(currentPage.labelKey)
      : t(SECTION_KEYS[section]);
  const panelDescription = t(
    currentApp ? currentApp.descriptionKey : currentPage ? currentPage.descriptionKey : panelMeta.descriptionKey
  );

  function navigateSection(id: SettingsSection, page: SettingsPageId | null = null) {
    setSection(id);
    setSelectedApp(null);
    setSelectedPage(id === "pages" ? page : null);
    const url = new URL(window.location.href);
    url.searchParams.set("section", id);
    if (id === "pages" && page) url.searchParams.set("page", page);
    else url.searchParams.delete("page");
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
  }

  const pageEnabled: Record<SettingsPageId, boolean> = {
    calendar: calendarStore.enabled,
    energy: energyStore.enabled,
    tasks: choresStore.enabled,
  };

  const pageSummary: Record<SettingsPageId, string> = {
    calendar: calendarStore.enabled
      ? `${calendarStore.calendarEntityIds.length} ${t("settings.pages.summary.calendars")}`
      : t("settings.apps.disabled"),
    energy: energyStore.enabled ? t("settings.pages.summary.energy") : t("settings.apps.disabled"),
    tasks: choresStore.enabled
      ? `${t("settings.pages.summary.tasks")} · ${eveningHour}:00`
      : t("settings.apps.disabled"),
  };
  const appEnabled: Record<SettingsAppId, boolean> = {
    news: newsStore.enabled,
    "music-assistant": musicAssistant.enabled,
    valetudo: valetudo.enabled,
    pexels: pexelsEnabled,
    immich: immich.enabled,
    "voice-satellite": voiceSatellite.enabled,
    doorbell: doorbellEnabled,
  };
  const pexelsReady = isPexelsSourceReady(
    pexelsEnabled,
    getScreensaverPexelsApiKey(),
    pexelsEnvConfigured
  );
  const immichReady = isImmichSourceReady(
    immich.enabled,
    immich.baseUrl,
    immich.apiKey,
    immichEnvKeyConfigured,
    immichEnvUrlConfigured
  );
  const { enabled: screensaverEnabled, setEnabled: setScreensaverEnabled } = useScreensaverEnabledToggle(
    screensaverDelaySeconds,
    (seconds) => {
      setScreensaverDelaySecondsState(seconds);
      setScreensaverDelaySeconds(seconds);
    }
  );

  return (
    <AppShell activeTab="/settings" contentNoScroll>
      <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-1 flex-col gap-6 lg:flex-row lg:gap-8">
        <aside className="shrink-0 lg:flex lg:h-full lg:w-64 lg:flex-col">
          <h1 className="mb-4 shrink-0 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {t("settings.title")}
          </h1>
          <nav
            className="rounded-3xl border border-white/60 bg-white/40 p-2 dark:border-white/10 dark:bg-white/5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
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
                          onClick={() => navigateSection(id)}
                          className={cn(
                            "flex w-full items-center gap-2.5 whitespace-nowrap rounded-2xl px-3 py-2 text-left text-sm font-medium transition-colors",
                            section === id || (id === "connection" && section === "entities")
                              ? "bg-brand text-white shadow-sm"
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
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <SettingsPanel
            key={selectedApp ?? selectedPage ?? section}
            icon={panelMeta.icon}
            title={panelTitle}
            description={panelDescription}
            onBack={
              selectedApp
                ? () => setSelectedApp(null)
                : selectedPage
                  ? () => navigateSection("pages")
                  : section === "entities"
                    ? () => navigateSection("connection")
                    : undefined
            }
            backLabel={
              selectedApp
                ? t("settings.apps.back")
                : selectedPage
                  ? t("settings.pages.back")
                  : t("settings.connection.back")
            }
            badge={
              section === "screensaver" && !selectedApp ? (
                <ScreensaverEnableToggle
                  enabled={screensaverEnabled}
                  onChange={setScreensaverEnabled}
                />
              ) : undefined
            }
          >
          {section === "appearance" && (
            <>
            <SettingsChoiceCards
              label={t("settings.theme.interface")}
              value={mode}
              onChange={(id) => setMode(id)}
              options={[
                {
                  id: "light" satisfies ThemeMode,
                  label: t("settings.theme.light"),
                  preview: <ThemePreview variant="light" />,
                },
                {
                  id: "dark" satisfies ThemeMode,
                  label: t("settings.theme.dark"),
                  preview: <ThemePreview variant="dark" />,
                },
                {
                  id: "auto" satisfies ThemeMode,
                  label: t("settings.theme.system"),
                  description: t("settings.theme.systemHint"),
                  preview: <ThemePreview variant="auto" />,
                },
              ]}
            />
            <SettingsAccentDots
              label={t("settings.theme.color")}
              hint={t("settings.theme.colorHint")}
              value={accent}
              onChange={(id) => setAccent(id)}
              names={{
                purple: t("settings.theme.color.purple"),
                indigo: t("settings.theme.color.indigo"),
                blue: t("settings.theme.color.blue"),
                teal: t("settings.theme.color.teal"),
                green: t("settings.theme.color.green"),
                orange: t("settings.theme.color.orange"),
                rose: t("settings.theme.color.rose"),
                fuchsia: t("settings.theme.color.fuchsia"),
              } satisfies Record<ThemeAccentId, string>}
            />
            <SettingsChipSelect
              label={t("settings.glassDensity")}
              hint={t("settings.glassDensity.hint")}
              value={glassDensity}
              onChange={(id) => setGlassDensity(id as GlassDensity)}
              items={GLASS_DENSITIES.map((id) => ({
                id,
                label: t(`settings.glassDensity.${id}`),
              }))}
            />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {t("settings.pageBackground")}
              </p>
              {dashboardId ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <SettingsImagePick
                    label={t("settings.theme.light")}
                    url={pageBackgroundLight}
                    uploading={uploadingBgLight}
                    onUpload={handlePageBackgroundLightUpload}
                    onRemove={handlePageBackgroundLightRemove}
                    addLabel={t("settings.pageBackground.add")}
                    uploadingLabel={t("settings.screensaver.uploading")}
                    removeLabel={t("settings.pageBackground.remove")}
                  />
                  <SettingsImagePick
                    label={t("settings.theme.dark")}
                    url={pageBackgroundDark}
                    uploading={uploadingBgDark}
                    onUpload={handlePageBackgroundDarkUpload}
                    onRemove={handlePageBackgroundDarkRemove}
                    addLabel={t("settings.pageBackground.add")}
                    uploadingLabel={t("settings.screensaver.uploading")}
                    removeLabel={t("settings.pageBackground.remove")}
                  />
                  <SettingsImagePick
                    label={t("settings.pageBackground.fallback")}
                    description={t("settings.pageBackground.fallbackDesc")}
                    url={pageBackground}
                    uploading={uploadingBg}
                    onUpload={handlePageBackgroundUpload}
                    onRemove={handlePageBackgroundRemove}
                    addLabel={t("settings.pageBackground.add")}
                    uploadingLabel={t("settings.screensaver.uploading")}
                    removeLabel={t("settings.pageBackground.remove")}
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("settings.pageBackground.needDashboard")}</p>
              )}
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {t("settings.pageBackground.description")}
              </p>
            </div>
            <SettingsChoiceCards
              label={t("settings.language.setting")}
              columns={2}
              value={language}
              onChange={(id) => setLanguage(id)}
              options={[
                {
                  id: "en",
                  label: t("settings.language.en"),
                  preview: <LanguagePreview code="EN" />,
                },
                {
                  id: "nl",
                  label: t("settings.language.nl"),
                  preview: <LanguagePreview code="NL" />,
                },
              ]}
            />
            <SettingsGroup title={t("settings.appearance.interaction")}>
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
              <SettingsToggle
                checked={uiSoundEnabled}
                onChange={(v) => {
                  setUiSoundEnabled(v);
                  if (v) playUiClick();
                }}
                label={t("settings.uiSounds")}
                description={t("settings.uiSounds.hint")}
              />
            </SettingsGroup>
            </>
          )}

          {section === "screensaver" && (
            <ScreensaverSettings
              delaySeconds={screensaverDelaySeconds}
              onDelayChange={(seconds) => {
                setScreensaverDelaySecondsState(seconds);
                setScreensaverDelaySeconds(seconds);
              }}
              background={screensaverBackground}
              onBackgroundChange={(url) => {
                setScreensaverBackgroundState(url);
                setScreensaverBackgroundImage(url);
              }}
              uploadingBackground={uploadingScreensaverBg}
              onUploadBackground={async (e) => {
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
              clock24h={screensaverClock24h}
              onClock24hChange={(value) => {
                setScreensaverClock24hState(value);
                setScreensaverClock24h(value);
              }}
              clockPosition={screensaverClockPosition}
              onClockPositionChange={(position) => {
                setScreensaverClockPositionState(position);
                setScreensaverClockPosition(position);
              }}
              clockSize={screensaverClockSize}
              onClockSizeChange={(size) => {
                setScreensaverClockSizeState(size);
                setScreensaverClockSize(size);
              }}
              clockWeight={screensaverClockWeight}
              onClockWeightChange={(weight) => {
                setScreensaverClockWeightState(weight);
                setScreensaverClockWeight(weight);
              }}
              weatherEntityId={screensaverWeatherEntityId}
              onWeatherEntityChange={(value) => {
                setScreensaverWeatherEntityIdState(value);
                setScreensaverWeatherEntityId(value);
              }}
              footballEntityId={screensaverFootballEntityId}
              onFootballEntityChange={(value) => {
                setScreensaverFootballEntityIdState(value);
                setScreensaverFootballEntityId(value);
              }}
              musicEntityId={screensaverMusicEntityId}
              onMusicEntityChange={(value) => {
                setScreensaverMusicEntityIdState(value);
                setScreensaverMusicEntityId(value);
              }}
              mediaSource={screensaverMediaSource}
              onMediaSourceChange={(source) => {
                setScreensaverMediaSourceState(source);
                setScreensaverMediaSource(source);
              }}
              pexelsReady={pexelsReady}
              immichReady={immichReady}
              entities={entities}
              onOpenPexels={() => {
                navigateSection("apps");
                setSelectedApp("pexels");
              }}
              onOpenImmich={() => {
                navigateSection("apps");
                setSelectedApp("immich");
              }}
            />
          )}

          {section === "pages" && !selectedPage && (
            <div className="overflow-hidden rounded-2xl bg-black/[0.03] ring-1 ring-black/[0.06] dark:bg-white/5 dark:ring-white/10">
              {(Object.keys(PAGE_KEYS) as SettingsPageId[]).map((id, index) => {
                const page = PAGE_KEYS[id];
                const Icon = page.icon;
                const enabled = pageEnabled[id];
                return (
                  <div
                    key={id}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5",
                      index > 0 && "border-t border-black/[0.06] dark:border-white/10"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        enabled
                          ? "bg-brand/10 text-brand dark:bg-brand/30 dark:text-white"
                          : "bg-black/[0.04] text-gray-500 dark:bg-white/10 dark:text-gray-400"
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <button
                      type="button"
                      onClick={() => navigateSection("pages", id)}
                      className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-xl py-1 text-left transition-colors hover:bg-black/[0.03] dark:hover:bg-white/5"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                          {t(page.labelKey)}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">
                          {pageSummary[id]}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
                    </button>
                    <SettingsToggle
                      compact
                      checked={enabled}
                      onChange={(v) => {
                        if (id === "calendar") calendarStore.setEnabled(v);
                        else if (id === "energy") energyStore.setEnabled(v);
                        else choresStore.setEnabled(v);
                      }}
                      label={t(page.labelKey)}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {section === "connection" && (
            <div className="space-y-4">
              {connectionSource === "supervisor" ? (
                <SettingsAlert tone="ok">{t("settings.connection.supervisorLinked")}</SettingsAlert>
              ) : null}
              {isAddon && connectionSource !== "supervisor" ? (
                <div className="flex flex-wrap gap-2">
                  <SettingsPrimaryButton onClick={handleUseSupervisor} disabled={saving}>
                    {t("settings.connection.useSupervisor")}
                  </SettingsPrimaryButton>
                </div>
              ) : null}
              {connectionSource !== "supervisor" ? (
                <>
                  {!isAddon ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {t("settings.connection.discovered")}
                        </p>
                        <button
                          type="button"
                          onClick={() => void handleDiscover()}
                          disabled={discovering}
                          className="text-xs font-medium text-gray-600 underline-offset-2 hover:underline disabled:opacity-50 dark:text-gray-300"
                        >
                          {discovering
                            ? t("settings.connection.discovering")
                            : t("settings.connection.rediscover")}
                        </button>
                      </div>
                      {discovering && discoveredInstances.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-gray-200 px-3 py-2 text-sm text-gray-500 dark:border-white/15 dark:text-gray-400">
                          {t("settings.connection.discovering")}
                        </p>
                      ) : null}
                      {discoveredInstances.length > 0 ? (
                        <ul className="space-y-1">
                          {discoveredInstances.map((inst) => (
                            <li key={inst.baseUrl}>
                              <button
                                type="button"
                                onClick={() => setBaseUrl(inst.baseUrl)}
                                className={cn(
                                  "w-full rounded-lg border px-3 py-2 text-left text-sm transition",
                                  baseUrl === inst.baseUrl
                                    ? "border-accent-yellow/60 bg-accent-yellow/10 dark:border-accent-green/40 dark:bg-accent-green/10"
                                    : "border-gray-200 hover:bg-black/[0.03] dark:border-white/10 dark:hover:bg-white/5"
                                )}
                              >
                                <span className="font-medium text-gray-900 dark:text-white">{inst.name}</span>
                                <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                                  {inst.baseUrl}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : !discovering ? (
                        <p className="rounded-lg border border-dashed border-gray-200 px-3 py-2 text-sm text-gray-500 dark:border-white/15 dark:text-gray-400">
                          {t("settings.connection.discoverEmpty")}
                        </p>
                      ) : null}
                      <SettingsPrimaryButton onClick={handleOauthLogin} disabled={!baseUrl.trim()}>
                        {t("settings.connection.oauthLogin")}
                      </SettingsPrimaryButton>
                    </div>
                  ) : null}
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
                </>
              ) : null}
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
                {connectionSource !== "supervisor" ? (
                  <SettingsSecondaryButton onClick={handleSave} disabled={saving || !token.trim()}>
                    {saving ? t("settings.connection.saving") : t("settings.connection.save")}
                  </SettingsSecondaryButton>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => navigateSection("entities")}
                className="flex w-full items-center justify-between gap-3 rounded-2xl bg-black/[0.04] px-4 py-3 text-left transition-colors hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/10"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">
                    {t("settings.entities")}
                  </span>
                  <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                    {t("settings.entities.description")}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
              </button>
            </div>
          )}

          {section === "pages" && selectedPage === "tasks" && (
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
                  <Link
                    href="/family"
                    className="inline-flex items-center gap-2 self-start rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
                  >
                    <ListTodo className="h-4 w-4" />
                    {t("settings.tasks.manage")}
                  </Link>
                </SettingsGroup>
              ) : null}
            </>
          )}

          {section === "pages" && selectedPage === "calendar" && (
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
              <SettingsGroup title={t("settings.calendar.titles")} description={t("settings.calendar.titlesHint")}>
                <CalendarTitleCodesEditor />
              </SettingsGroup>
            </>
          )}

          {section === "pages" && selectedPage === "energy" && (
            <>
              <SettingsToggle
                checked={energyStore.enabled}
                onChange={energyStore.setEnabled}
                label={t("settings.energy.enabled")}
              />
              {energyStore.enabled ? (
                <>
                  <EnergyEntitySettings entities={entities} />
                  <SettingsGroup title={t("settings.energy.backgrounds")} description={t("settings.energy.backgroundsHint")}>
                    {energyDashboardId ? (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <SettingsImagePick
                          label={t("settings.energy.backgroundLight")}
                          url={energyBackgroundLight}
                          uploading={uploadingEnergyBgLight}
                          onUpload={handleEnergyBackgroundLightUpload}
                          onRemove={handleEnergyBackgroundLightReset}
                          addLabel={t("settings.energy.backgroundAdd")}
                          uploadingLabel={t("settings.screensaver.uploading")}
                          removeLabel={t("settings.energy.backgroundReset")}
                        />
                        <SettingsImagePick
                          label={t("settings.energy.backgroundDark")}
                          url={energyBackgroundDark}
                          uploading={uploadingEnergyBgDark}
                          onUpload={handleEnergyBackgroundDarkUpload}
                          onRemove={handleEnergyBackgroundDarkReset}
                          addLabel={t("settings.energy.backgroundAdd")}
                          uploadingLabel={t("settings.screensaver.uploading")}
                          removeLabel={t("settings.energy.backgroundReset")}
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t("editPanel.loading")}</p>
                    )}
                  </SettingsGroup>
                  <SettingsGroup title={t("settings.energy.contract")}>
                    <SettingsField label={t("settings.energy.costPerKwh")} hint={t("settings.energy.costPerKwhHint")}>
                      <SettingsInput
                        type="number"
                        step="0.01"
                        value={energyStore.costPerKwh ?? ""}
                        onChange={(e) => {
                          const n = parseFloat(e.target.value);
                          energyStore.setCostPerKwh(Number.isFinite(n) ? n : undefined);
                        }}
                      />
                    </SettingsField>
                    <SettingsField label={t("settings.energy.netbeheerkostenPerDag")} hint={t("settings.energy.netbeheerkostenPerDagHint")}>
                      <SettingsInput
                        type="number"
                        step="0.01"
                        value={energyStore.netbeheerkostenPerDag ?? ""}
                        onChange={(e) => {
                          const n = parseFloat(e.target.value);
                          energyStore.setNetbeheerkostenPerDag(Number.isFinite(n) ? n : undefined);
                        }}
                      />
                    </SettingsField>
                    <SettingsField label={t("settings.energy.vasteLeveringskostenPerMaand")} hint={t("settings.energy.vasteLeveringskostenPerMaandHint")}>
                      <SettingsInput
                        type="number"
                        step="0.01"
                        value={energyStore.vasteLeveringskostenPerMaand ?? ""}
                        onChange={(e) => {
                          const n = parseFloat(e.target.value);
                          energyStore.setVasteLeveringskostenPerMaand(Number.isFinite(n) ? n : undefined);
                        }}
                      />
                    </SettingsField>
                  </SettingsGroup>
                  <Link
                    href="/energy"
                    className="inline-flex items-center gap-2 self-start rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
                  >
                    <Zap className="h-4 w-4" />
                    {t("nav.energy")}
                  </Link>
                </>
              ) : null}
            </>
          )}

          {section === "apps" && !selectedApp && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(Object.keys(APP_KEYS) as SettingsAppId[]).map((id) => {
                const app = APP_KEYS[id];
                const Icon = app.icon;
                const enabled = appEnabled[id];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedApp(id)}
                    className="flex flex-col items-start gap-3 rounded-2xl bg-black/[0.04] p-4 text-left ring-1 ring-black/[0.06] transition-colors hover:bg-black/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/10"
                  >
                    <div className="flex w-full items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand dark:bg-brand/30 dark:text-white">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                          enabled
                            ? "bg-brand/15 text-brand dark:bg-brand/30 dark:text-white"
                            : "bg-black/[0.06] text-gray-500 dark:bg-white/10 dark:text-gray-400"
                        )}
                      >
                        {enabled ? t("settings.apps.enabled") : t("settings.apps.disabled")}
                      </span>
                    </div>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                        {t(app.labelKey)}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                        {t(app.descriptionKey)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {selectedApp === "music-assistant" && <MusicAssistantSettings />}

          {selectedApp === "valetudo" && <ValetudoSettings />}

          {selectedApp === "pexels" && <PexelsSettings />}

          {selectedApp === "immich" && <ImmichSettings />}

          {selectedApp === "voice-satellite" && <VoiceSatelliteSettings />}

          {selectedApp === "doorbell" && <DoorbellSettings />}

          {section === "notifications" && <NotificationSettings />}

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
                      className="shrink-0 text-sm font-medium text-brand hover:underline"
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

          {selectedApp === "news" && (
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


