"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import {
  SettingsCheckRow,
  SettingsField,
  SettingsGroup,
  SettingsInput,
  SettingsPrimaryButton,
  SettingsSecondaryButton,
  SettingsToggle,
} from "@/components/settings/settings-panel";
import { MusicAssistantSettings } from "@/components/settings/music-assistant-settings";
import { VoiceSatelliteSettings } from "@/components/settings/voice-satellite-settings";
import { ValetudoSettings } from "@/components/settings/valetudo-settings";
import { PexelsSettings } from "@/components/settings/pexels-settings";
import { ImmichSettings } from "@/components/settings/immich-settings";
import { SettingsImagePick } from "@/components/settings/settings-choice-cards";
import {
  ScreensaverEnableToggle,
  ScreensaverSettings,
  useScreensaverEnabledToggle,
} from "@/components/settings/screensaver-settings";
import { AppearanceSettings } from "@/components/settings/appearance-settings";
import { useThemeStore } from "@/stores/theme-store";
import { useUiSoundStore } from "@/stores/ui-sound-store";
import { useGlassDensityStore } from "@/stores/glass-density-store";
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
import { energyDashboardChoiceFromResponse } from "@/lib/energy-dashboard";
import { EnergyEntitySettings } from "@/components/settings/energy-entity-settings";
import {
  EnergyTopDevicesEntry,
  EnergyTopDevicesSettings,
  type TopDeviceEntitiesStatus,
} from "@/components/settings/energy-top-devices-settings";
import { useNewsStore } from "@/stores/news-store";
import { RobotVacuum, Bell, BookOpen, CalendarDays, ChevronRight, DoorOpen, Hand, Images, Image as ImageIcon, Info, Languages, LayoutGrid, ListTodo, Mic, Monitor, Music2, Newspaper, Palette, Plug, X, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { withBasePath } from "@/lib/base-path";
import { useTranslation } from "@/hooks/use-translation";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { DoorbellSettings } from "@/components/settings/doorbell-settings";
import { HaConnectionSettings, type HaEntity } from "@/components/settings/ha-connection-settings";
import { hydrateNotificationRulesStore, useNotificationRulesStore } from "@/stores/notification-rules-store";
import { hydrateDoorbellStore, useDoorbellStore } from "@/stores/doorbell-store";
import {
  SettingsDetailHeader,
  SettingsGroup as SettingsSurface,
  SettingsGroupLabel,
  SettingsNavList,
  SettingsRow,
  SettingsScreenTitle,
} from "@/components/settings/settings-chrome";
import { useSettingsNavigation } from "@/components/settings/use-settings-navigation";
import { isSettingsSectionId, type SettingsAppId, type SettingsPageId, type SettingsSectionId } from "@/lib/settings-navigation";

const SECTION_KEYS: Record<SettingsSectionId, string> = {
  uiterlijk: "settings.appearance",
  taal: "settings.appearance.languageTime",
  schermbeveiliging: "settings.screensaver",
  paginas: "settings.pages",
  bediening: "settings.appearance.interaction",
  meldingen: "settings.notifications",
  homeassistant: "settings.connection",
  apps: "settings.apps",
  over: "settings.sections.over",
};

const SECTION_DESCRIPTIONS: Record<SettingsSectionId, string> = {
  uiterlijk: "settings.theme.description",
  taal: "settings.sections.taal.description",
  schermbeveiliging: "settings.screensaver.description",
  paginas: "settings.pages.description",
  bediening: "settings.sections.bediening.description",
  meldingen: "settings.notifications.description",
  homeassistant: "settings.connection.panelDescription",
  apps: "settings.apps.description",
  over: "settings.sections.over.description",
};

const PAGE_KEYS: Record<SettingsPageId, { labelKey: string; descriptionKey: string; icon: LucideIcon }> = {
  calendar: { labelKey: "settings.calendar", descriptionKey: "settings.calendar.description", icon: CalendarDays },
  energy: { labelKey: "settings.energy", descriptionKey: "settings.energy.description", icon: Zap },
  tasks: { labelKey: "settings.tasks", descriptionKey: "settings.tasks.description", icon: ListTodo },
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
  const { loc, isPortrait, go, back } = useSettingsNavigation();
  const section = loc.sectie;
  const selectedPage = loc.page;
  const selectedApp = loc.app;
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
  const [entitiesSyncedAt, setEntitiesSyncedAt] = useState<number | null>(null);
  const [dashboardId, setDashboardId] = useState<string | null>(null);
  const [pageBackground, setPageBackground] = useState<string | null>(null);
  const [pageBackgroundLight, setPageBackgroundLight] = useState<string | null>(null);
  const [pageBackgroundDark, setPageBackgroundDark] = useState<string | null>(null);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingBgLight, setUploadingBgLight] = useState(false);
  const [uploadingBgDark, setUploadingBgDark] = useState(false);
  const [energyDashboardId, setEnergyDashboardId] = useState<string | null>(null);
  const [topDeviceIds, setTopDeviceIds] = useState<string[]>([]);
  const [energyChoiceStatus, setEnergyChoiceStatus] = useState<"loading" | "ready" | "error">("loading");
  const [energyChoiceAttempt, setEnergyChoiceAttempt] = useState(0);
  const [topDevicesOpen, setTopDevicesOpen] = useState(false);
  const [energyBackgroundLight, setEnergyBackgroundLight] = useState<string | null>(null);
  const [energyBackgroundDark, setEnergyBackgroundDark] = useState<string | null>(null);
  const [uploadingEnergyBgLight, setUploadingEnergyBgLight] = useState(false);
  const [uploadingEnergyBgDark, setUploadingEnergyBgDark] = useState(false);
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
  const notificationRuleCount = useNotificationRulesStore((s) => s.rules.length);
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
      go({ sectie: "homeassistant", page: null, app: null }, "replace");
    } else if (params.get("ha_oauth") === "error") {
      setTestResult({
        ok: false,
        error: params.get("ha_oauth_error") || t("settings.connection.oauthFail"),
      });
      go({ sectie: "homeassistant", page: null, app: null }, "replace");
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
  }, [t, go]);

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
    let cancelled = false;
    setEnergyChoiceStatus((current) => (current === "ready" ? "ready" : "loading"));
    fetch("/api/energy-dashboard", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json().catch(() => null);
        const choice = energyDashboardChoiceFromResponse(response.status, body);
        if (!choice.ok) throw new Error("energy-dashboard");
        return choice;
      })
      .then((choice) => {
        if (cancelled) return;
        if (choice.id) setEnergyDashboardId(choice.id);
        setEnergyBackgroundLight(choice.backgroundLight);
        setEnergyBackgroundDark(choice.backgroundDark);
        setTopDeviceIds(choice.topDeviceIds);
        setEnergyChoiceStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setEnergyChoiceStatus((current) => (current === "ready" ? "ready" : "error"));
      });
    return () => {
      cancelled = true;
    };
  }, [energyChoiceAttempt]);

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
          setEntitiesSyncedAt(null);
        } else if (Array.isArray(data)) {
          setEntities(data);
          setEntitiesSyncedAt(Date.now());
        }
      })
      .catch(() => {
        setEntitiesError("Could not load entities.");
        setEntities([]);
        setEntitiesSyncedAt(null);
      })
      .finally(() => setEntitiesLoading(false));
  }

  useEffect(() => {
    const energyPage = section === "paginas" && selectedPage === "energy";
    if (section === "homeassistant" || energyPage || saveMessage === "success") loadEntities();
  }, [saveMessage, section, selectedPage]);

  useEffect(() => {
    if (selectedPage !== "energy" || !energyStore.enabled) setTopDevicesOpen(false);
  }, [selectedPage, energyStore.enabled]);

  // Soft-discover HA when opening Connection (self-hosted only).
  useEffect(() => {
    if (section !== "homeassistant") return;
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
        body: JSON.stringify({
          background: json.url,
          backgroundLight: null,
          backgroundDark: null,
        }),
      });
      setPageBackground(json.url);
      setPageBackgroundLight(null);
      setPageBackgroundDark(null);
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
        body: JSON.stringify({ background: null, backgroundLight: null, backgroundDark: null }),
      });
      setPageBackground(null);
      setPageBackgroundLight(null);
      setPageBackgroundDark(null);
      window.dispatchEvent(new Event("page-background-changed"));
    } finally {
      setUploadingBg(false);
    }
  }

  async function handleSetSameBackground(same: boolean) {
    if (!dashboardId) return;
    if (same) {
      const shared = pageBackgroundLight || pageBackgroundDark || pageBackground;
      await fetch(`/api/dashboards/${dashboardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          background: shared,
          backgroundLight: null,
          backgroundDark: null,
        }),
      });
      setPageBackground(shared);
      setPageBackgroundLight(null);
      setPageBackgroundDark(null);
    } else {
      const light = pageBackgroundLight || pageBackground;
      await fetch(`/api/dashboards/${dashboardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          background: null,
          backgroundLight: light,
          backgroundDark: pageBackgroundDark,
        }),
      });
      setPageBackground(null);
      setPageBackgroundLight(light);
    }
    window.dispatchEvent(new Event("page-background-changed"));
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

  async function openTopDevices() {
    setTopDevicesOpen(true);
    try {
      const res = await fetch("/api/energy-dashboard", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      const choice = energyDashboardChoiceFromResponse(res.status, data);
      if (!choice.ok) throw new Error("energy-dashboard");
      if (choice.id) setEnergyDashboardId(choice.id);
      setEnergyBackgroundLight(choice.backgroundLight);
      setEnergyBackgroundDark(choice.backgroundDark);
      setTopDeviceIds(choice.topDeviceIds);
      setEnergyChoiceStatus("ready");
    } catch {
      setEnergyChoiceStatus((current) => (current === "ready" ? "ready" : "error"));
    }
  }

  function openSection(id: SettingsSectionId) {
    go({ sectie: id, page: null, app: null }, isPortrait ? "push" : "replace");
  }

  function openPage(page: SettingsPageId) {
    go({ sectie: "paginas", page, app: null }, "push");
  }

  function openApp(app: SettingsAppId) {
    go({ sectie: "apps", page: null, app: app }, "push");
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

  const shown: SettingsSectionId = section ?? "uiterlijk";
  const showTopDevices = topDevicesOpen && selectedPage === "energy" && energyStore.enabled;
  const topDeviceEntitiesStatus: TopDeviceEntitiesStatus =
    entitiesLoading || (entitiesSyncedAt == null && !entitiesError)
      ? "loading"
      : entitiesError && entities.length === 0
        ? "error"
        : "ready";
  const currentApp = selectedApp ? APP_KEYS[selectedApp] : null;
  const currentPage = selectedPage ? PAGE_KEYS[selectedPage] : null;
  const panelTitle = showTopDevices
    ? t("settings.energy.topDevices.title")
    : currentApp
      ? t(currentApp.labelKey)
      : currentPage
        ? t(currentPage.labelKey)
        : t(SECTION_KEYS[shown]);
  const panelDescription = showTopDevices
    ? t("settings.energy.topDevices.intro")
    : t(
        currentApp ? currentApp.descriptionKey : currentPage ? currentPage.descriptionKey : SECTION_DESCRIPTIONS[shown]
      );
  const subpageBackLabel = showTopDevices
    ? t("settings.energy")
    : selectedApp
      ? t("settings.apps.back")
      : selectedPage
        ? t("settings.pages.back")
        : undefined;
  const themeLabel = t(mode === "auto" ? "settings.theme.system" : mode === "dark" ? "settings.theme.dark" : "settings.theme.light");
  const accentLabel = t(`settings.theme.color.${accent}`);
  const enabledPageCount = (Object.keys(PAGE_KEYS) as SettingsPageId[]).filter((id) => pageEnabled[id]).length;
  const enabledAppCount = (Object.keys(APP_KEYS) as SettingsAppId[]).filter((id) => appEnabled[id]).length;
  const screensaverHint = screensaverDelaySeconds > 0
    ? t("settings.portrait.after").replace("{label}", t(
        screensaverDelaySeconds === 30 ? "settings.screensaver.30s"
        : screensaverDelaySeconds === 60 ? "settings.screensaver.1m"
        : screensaverDelaySeconds === 120 ? "settings.screensaver.2m"
        : screensaverDelaySeconds === 300 ? "settings.screensaver.5m"
        : screensaverDelaySeconds === 600 ? "settings.screensaver.10m"
        : screensaverDelaySeconds === 900 ? "settings.screensaver.15m"
        : "settings.screensaver.30m"
      ))
    : t("settings.screensaver.off");

  const navGroups: { label: string; items: { id: SettingsSectionId; label: string; hint: string; icon: LucideIcon; connected?: boolean }[] }[] = [
    { label: t("settings.groups.display"), items: [
      { id: "uiterlijk", label: t(SECTION_KEYS.uiterlijk), icon: Palette, hint: `${themeLabel} · ${accentLabel}` },
      { id: "taal", label: t(SECTION_KEYS.taal), icon: Languages, hint: `${language === "nl" ? t("settings.language.nl") : t("settings.language.en")} · ${screensaverClock24h ? t("settings.screensaver.24h") : t("settings.screensaver.12hShort")}` },
      { id: "schermbeveiliging", label: t(SECTION_KEYS.schermbeveiliging), icon: Monitor, hint: screensaverHint },
    ]},
    { label: t("settings.groups.dashboard"), items: [
      { id: "paginas", label: t(SECTION_KEYS.paginas), icon: BookOpen, hint: t("settings.portrait.countOf").replace("{on}", String(enabledPageCount)).replace("{total}", "3") },
      { id: "bediening", label: t(SECTION_KEYS.bediening), icon: Hand, hint: editModeAllowed ? t("settings.portrait.editOn") : t("settings.portrait.editOff") },
      { id: "meldingen", label: t(SECTION_KEYS.meldingen), icon: Bell, hint: notificationRuleCount === 1
        ? t("settings.portrait.rule")
        : t("settings.portrait.rules").replace("{n}", String(notificationRuleCount)) },
    ]},
    { label: t("settings.groups.system"), items: [
      { id: "homeassistant", label: t(SECTION_KEYS.homeassistant), icon: Plug, hint: connectionSource ? t("settings.connection.statusConnected") : t("settings.connection.statusDisconnected"), connected: connectionSource != null },
      { id: "apps", label: t(SECTION_KEYS.apps), icon: LayoutGrid, hint: t("settings.portrait.countOf").replace("{on}", String(enabledAppCount)).replace("{total}", "7") },
      { id: "over", label: t(SECTION_KEYS.over), icon: Info, hint: t("settings.portrait.version").replace("{version}", appVersion ?? "…") },
    ]},
  ];

  function renderNav(portrait: boolean) {
    return (
      <>
        <SettingsScreenTitle>{t("settings.title")}</SettingsScreenTitle>
        {navGroups.map((group, index) => (
          <div key={group.label} className={index === 0 ? undefined : "mt-3.5"}>
            <SettingsGroupLabel>{group.label}</SettingsGroupLabel>
            <SettingsNavList
              label={group.label}
              portrait={portrait}
              onSelect={(id) => {
                if (isSettingsSectionId(id)) openSection(id);
              }}
              items={group.items.map((item) => ({
                ...item,
                active: !portrait && item.id === shown,
              }))}
            />
          </div>
        ))}
      </>
    );
  }

  const detail = (
    <>
      <SettingsDetailHeader
        title={panelTitle}
        description={panelDescription}
        portrait={isPortrait}
        onBack={showTopDevices ? () => setTopDevicesOpen(false) : section ? back : undefined}
        backLabel={isPortrait ? (subpageBackLabel ?? t("settings.title")) : subpageBackLabel}
      />
      {(shown === "uiterlijk" || shown === "taal" || shown === "bediening") && (
            <AppearanceSettings
              part={shown}
              mode={mode}
              setMode={setMode}
              accent={accent}
              setAccent={setAccent}
              glassDensity={glassDensity}
              setGlassDensity={setGlassDensity}
              language={language}
              setLanguage={setLanguage}
              clock24h={screensaverClock24h}
              setClock24h={(value) => {
                setScreensaverClock24hState(value);
                setScreensaverClock24h(value);
              }}
              editModeAllowed={editModeAllowed}
              setEditModeAllowed={(v) => {
                setEditModeAllowedState(v);
                setEditModeAllowed(v);
              }}
              editModePasscode={editModePasscode}
              setEditModePasscode={(v) => {
                setEditModePasscodeState(v);
                setEditModePasscode(v);
              }}
              uiSoundEnabled={uiSoundEnabled}
              setUiSoundEnabled={setUiSoundEnabled}
              dashboardId={dashboardId}
              pageBackground={pageBackground}
              pageBackgroundLight={pageBackgroundLight}
              pageBackgroundDark={pageBackgroundDark}
              uploadingBg={uploadingBg}
              uploadingBgLight={uploadingBgLight}
              uploadingBgDark={uploadingBgDark}
              onUploadFallback={handlePageBackgroundUpload}
              onRemoveFallback={handlePageBackgroundRemove}
              onUploadLight={handlePageBackgroundLightUpload}
              onRemoveLight={handlePageBackgroundLightRemove}
              onUploadDark={handlePageBackgroundDarkUpload}
              onRemoveDark={handlePageBackgroundDarkRemove}
              onSetSameBackground={(same) => void handleSetSameBackground(same)}
            />
          )}

          {shown === "schermbeveiliging" && (
            <div className="mb-4">
              <SettingsSurface>
                <div className="px-5 py-3">
                  <ScreensaverEnableToggle
                    enabled={screensaverEnabled}
                    onChange={setScreensaverEnabled}
                  />
                </div>
              </SettingsSurface>
            </div>
          )}
          {shown === "schermbeveiliging" && (
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
              onOpenPexels={() => openApp("pexels")}
              onOpenImmich={() => openApp("immich")}
            />
          )}

          {shown === "paginas" && !selectedPage && (
            <SettingsSurface>
              {(Object.keys(PAGE_KEYS) as SettingsPageId[]).map((id) => {
                const page = PAGE_KEYS[id];
                const enabled = pageEnabled[id];
                const summary = pageSummary[id];
                return (
                  <div
                    key={id}
                    className="flex min-h-[68px] items-center gap-2 border-t border-[rgba(17,24,39,0.08)] px-5 py-3 first:border-t-0 dark:border-white/10"
                  >
                    <button
                      type="button"
                      onClick={() => openPage(id)}
                      className="flex min-h-11 min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block break-words text-base font-medium text-[#111827] dark:text-[#f3f4f6]">
                          {t(page.labelKey)}
                        </span>
                        <span className="mt-0.5 block break-words text-sm leading-snug text-[#4b5563] dark:text-[#c4c4cc]" title={summary}>
                          {summary}
                        </span>
                      </span>
                      <ChevronRight className="h-5 w-5 shrink-0 text-[#6b7280] dark:text-[#a1a1aa]" aria-hidden />
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
            </SettingsSurface>
          )}

          {shown === "homeassistant" && (
            <HaConnectionSettings
              baseUrl={baseUrl}
              setBaseUrl={setBaseUrl}
              token={token}
              setToken={setToken}
              connectionSource={connectionSource}
              isAddon={isAddon}
              testing={testing}
              saving={saving}
              testResult={testResult}
              saveMessage={saveMessage}
              discoveredInstances={discoveredInstances}
              discovering={discovering}
              onDiscover={() => void handleDiscover()}
              onOauthLogin={handleOauthLogin}
              onUseSupervisor={() => void handleUseSupervisor()}
              onTest={() => void handleTest()}
              onSave={() => void handleSave()}
              entities={entities}
              entitiesLoading={entitiesLoading}
              entitiesError={entitiesError}
              entitiesSyncedAt={entitiesSyncedAt}
              onRefreshEntities={loadEntities}
            />
          )}

          {shown === "paginas" && selectedPage === "tasks" && (
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
                    className="settings-primary inline-flex h-11 items-center gap-2 self-start rounded-xl bg-brand px-6 text-[15px] font-semibold text-white hover:opacity-90"
                  >
                    <ListTodo className="h-4 w-4" />
                    {t("settings.tasks.manage")}
                  </Link>
                </SettingsGroup>
              ) : null}
            </>
          )}

          {shown === "paginas" && selectedPage === "calendar" && (
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

          {shown === "paginas" && selectedPage === "energy" && showTopDevices && (
            <EnergyTopDevicesSettings
              dashboardId={energyDashboardId}
              entityIds={topDeviceIds}
              entities={entities}
              entitiesStatus={topDeviceEntitiesStatus}
              onEntityIds={setTopDeviceIds}
              onRefreshEntities={loadEntities}
              choiceStatus={energyChoiceStatus}
              onRetryChoice={() => setEnergyChoiceAttempt((attempt) => attempt + 1)}
            />
          )}

          {shown === "paginas" && selectedPage === "energy" && !showTopDevices && (
            <>
              <SettingsToggle
                checked={energyStore.enabled}
                onChange={energyStore.setEnabled}
                label={t("settings.energy.enabled")}
              />
              {energyStore.enabled ? (
                <>
                  <EnergyTopDevicesEntry
                    entityIds={topDeviceIds}
                    entities={entities}
                    choiceStatus={energyChoiceStatus}
                    onRetry={() => setEnergyChoiceAttempt((attempt) => attempt + 1)}
                    onOpen={() => void openTopDevices()}
                  />
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
                    className="settings-primary inline-flex h-11 items-center gap-2 self-start rounded-xl bg-brand px-6 text-[15px] font-semibold text-white hover:opacity-90"
                  >
                    <Zap className="h-4 w-4" />
                    {t("nav.energy")}
                  </Link>
                </>
              ) : null}
            </>
          )}

          {shown === "apps" && !selectedApp && (
            <SettingsSurface>
              {(Object.keys(APP_KEYS) as SettingsAppId[]).map((id) => {
                const app = APP_KEYS[id];
                const enabled = appEnabled[id];
                const status = enabled ? t("settings.apps.enabled") : t("settings.apps.disabled");
                const description = t(app.descriptionKey);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => openApp(id)}
                    className="flex min-h-[68px] w-full items-center gap-4 border-t border-[rgba(17,24,39,0.08)] px-5 py-3 text-left first:border-t-0 dark:border-white/10"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block break-words text-base font-medium text-[#111827] dark:text-[#f3f4f6]">
                        {t(app.labelKey)}
                      </span>
                      <span className="mt-0.5 block break-words text-sm leading-snug text-[#4b5563] dark:text-[#c4c4cc]" title={description}>
                        {description}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-medium text-[#4b5563] dark:text-[#c4c4cc]">{status}</span>
                    <ChevronRight className="h-5 w-5 shrink-0 text-[#6b7280] dark:text-[#a1a1aa]" aria-hidden />
                  </button>
                );
              })}
            </SettingsSurface>
          )}

          {selectedApp === "music-assistant" && <MusicAssistantSettings />}

          {selectedApp === "valetudo" && <ValetudoSettings />}

          {selectedApp === "pexels" && <PexelsSettings />}

          {selectedApp === "immich" && <ImmichSettings />}

          {selectedApp === "voice-satellite" && <VoiceSatelliteSettings />}

          {selectedApp === "doorbell" && <DoorbellSettings />}

          {shown === "meldingen" && <NotificationSettings />}
          {shown === "over" && (
            <SettingsSurface>
              <SettingsRow
                title={t("settings.sections.over.version")}
                hint={appVersion ?? "…"}
              />
            </SettingsSurface>
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
                        <span className="min-w-0 flex-1 truncate rounded-xl bg-[rgba(17,24,39,0.04)] px-3 py-2 font-mono text-xs text-[#111827] dark:bg-white/5 dark:text-[#f3f4f6]" title={url}>
                          {url}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = newsFeedDraft.filter((_, j) => j !== i);
                            setNewsFeedDraft(next);
                            newsStore.setRssUrls(next);
                          }}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
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
    </>
  );

  return (
    <AppShell activeTab="/settings" contentNoScroll className="settings-page-bg">
      <div
        className="settings-root flex h-full min-h-0 flex-1 flex-col"
        data-portrait-detail={section ? "true" : "false"}
      >
        <div className="settings-list mx-auto min-h-0 w-full max-w-[712px] flex-1 overflow-auto">
          {renderNav(true)}
        </div>
        <div className="settings-body mx-auto h-full min-h-0 w-full max-w-[1160px] flex-1">
          <aside className="settings-nav min-h-0 overflow-auto">{renderNav(false)}</aside>
          <div className="settings-detail min-h-0 overflow-auto">{detail}</div>
        </div>
      </div>
    </AppShell>
  );
}


