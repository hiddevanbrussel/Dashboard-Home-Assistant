"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
    Cloud,
    CloudFog,
    CloudLightning,
    CloudRain,
    CloudSnow,
    Moon,
    Sun,
    Thermometer,
    Wind,
    X,
  } from "lucide-react";
import { cn } from "@/lib/utils";
import { TopTabs } from "./top-tabs";
import { Sidebar } from "./sidebar";
import { FloatingToolbar } from "./floating-toolbar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { usePageBackground } from "@/components/page-background";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { HeaderNotifications } from "./header-notifications";

async function fetchAndMergeEntityState(setStates: (entities: { entity_id: string; state: string; attributes: Record<string, unknown> }[]) => void) {
  try {
    const res = await fetch("/api/ha/state");
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data)) setStates(data);
  } catch {
    // ignore
  }
}

type AppShellProps = {
  children: React.ReactNode;
  activeTab?: string;
  showSidebar?: boolean;
  showFloatingToolbar?: boolean;
  /** Rendered top-right at the same height as the welcome message */
  welcomeBarAction?: React.ReactNode;
  /** Rendered in the header next to the theme switcher (e.g. add/edit icon). */
  headerEndAction?: React.ReactNode;
  /** Welcome heading (above main content). */
  welcomeTitle?: string;
  /** Welcome subtitle. */
  welcomeSubtitle?: string;
  /** When true, show inputs to edit welcome title/subtitle (edit mode). */
  welcomeEditable?: boolean;
  /** Called when user changes welcome title or subtitle. */
  onWelcomeChange?: (value: { title: string; subtitle: string }) => void;
  /** Entity ID for temperature shown in header. If not set, uses chosen value from localStorage or default. Set to null to hide. */
  temperatureEntityId?: string | null;
  className?: string;
};

const HEADER_TEMPERATURE_STORAGE_KEY = "dashboard.headerTemperatureEntityId";
const DEFAULT_TEMPERATURE_ENTITY = "sensor.weather_temperature";

type HaEntity = { entity_id: string; state: string; attributes: Record<string, unknown> };

function WeatherIcon({ state }: { state: string }) {
  const s = state?.toLowerCase() ?? "";
  const iconClass = "h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400";
  if (s === "sunny" || s === "clear") return <Sun className={iconClass} aria-hidden />;
  if (s === "clear-night") return <Moon className={iconClass} aria-hidden />;
  if (s === "fog" || s === "mist") return <CloudFog className={iconClass} aria-hidden />;
  if (s === "rainy" || s === "pouring" || s === "hail") return <CloudRain className={iconClass} aria-hidden />;
  if (s === "snowy" || s === "snowy-rainy") return <CloudSnow className={iconClass} aria-hidden />;
  if (s === "lightning" || s === "lightning-rainy") return <CloudLightning className={iconClass} aria-hidden />;
  if (s === "windy" || s === "windy-variant") return <Wind className={iconClass} aria-hidden />;
  if (s === "cloudy" || s === "partlycloudy" || s === "exceptional") return <Cloud className={iconClass} aria-hidden />;
  return <Cloud className={iconClass} aria-hidden />;
}

function TemperatureEntityModal({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (entityId: string) => void;
}) {
  const [entities, setEntities] = useState<HaEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ha/entities")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data: HaEntity[]) => {
        const weather = data.filter((e) => e.entity_id.startsWith("weather."));
        setEntities(weather);
        setError(null);
      })
      .catch(() => setError("Could not load weather entities."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 z-[101] bg-black/20 dark:bg-black/30 backdrop-blur-md"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="relative z-[102] w-full max-w-sm rounded-2xl border-0 bg-white p-5 shadow-xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Choose weather for temperature
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : entities.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No weather entities found. Check your Home Assistant connection.
          </p>
        ) : (
          <ul className="max-h-64 overflow-auto space-y-1">
            {entities.map((e) => {
              const name =
                (e.attributes?.friendly_name as string) ?? e.entity_id;
              return (
                <li key={e.entity_id}>
                  <button
                    type="button"
                    onClick={(ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      onSelect(e.entity_id);
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    {name}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function useTime24() {
  const [time, setTime] = useState("");
  useEffect(() => {
    function update() {
      const now = new Date();
      setTime(now.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function AppShell({
  children,
  activeTab = "/dashboards",
  showSidebar = true,
  showFloatingToolbar = false,
  welcomeBarAction,
  headerEndAction,
  welcomeTitle: welcomeTitleProp,
  welcomeSubtitle: welcomeSubtitleProp,
  welcomeEditable = false,
  onWelcomeChange,
  temperatureEntityId,
  className,
}: AppShellProps) {
  const defaultWelcomeTitle = "Hey, Fam van Brussel!";
  const defaultWelcomeSubtitle = "Control your home in one place!";
  const welcomeTitle = welcomeTitleProp ?? defaultWelcomeTitle;
  const welcomeSubtitle = welcomeSubtitleProp ?? defaultWelcomeSubtitle;
  const pageBackground = usePageBackground();
  const time24 = useTime24();
  const [temperatureModalOpen, setTemperatureModalOpen] = useState(false);
  const [chosenTemperatureEntityId, setChosenTemperatureEntityId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setChosenTemperatureEntityId(localStorage.getItem(HEADER_TEMPERATURE_STORAGE_KEY));
  }, []);

  const effectiveTempEntity =
    temperatureEntityId === null
      ? undefined
      : (temperatureEntityId ?? chosenTemperatureEntityId ?? DEFAULT_TEMPERATURE_ENTITY);

  const setStates = useEntityStateStore((s) => s.setStates);
  const temperatureState = useEntityStateStore((s) =>
    effectiveTempEntity ? s.getState(effectiveTempEntity) : undefined
  );
  const temperatureRaw =
    (temperatureState?.attributes?.temperature as number | undefined) ??
    (temperatureState?.state != null ? Number(temperatureState.state) : undefined);
  const temperatureDisplay =
    temperatureRaw != null && !Number.isNaN(temperatureRaw)
      ? `${Math.round(temperatureRaw)}°`
      : null;

  const saveChosenTemperatureEntity = useCallback((entityId: string) => {
    setChosenTemperatureEntityId(entityId);
    if (typeof window !== "undefined") {
      localStorage.setItem(HEADER_TEMPERATURE_STORAGE_KEY, entityId);
    }
    setTemperatureModalOpen(false);
    fetchAndMergeEntityState(setStates);
  }, [setStates]);

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col",
        pageBackground
          ? "bg-white/85 dark:bg-black/50"
          : "bg-page-light dark:bg-dark-page",
        className
      )}
    >
      <header className="flex shrink-0 items-center border-b border-gray-200/50 px-4 py-3 dark:border-white/10">
        <div className="flex-1 min-w-0 flex items-center gap-4">
          <span className="text-sm font-medium tabular-nums text-gray-700 dark:text-gray-300" aria-live="polite">
            {time24}
          </span>
          {effectiveTempEntity != null && (
            <button
              type="button"
              onClick={() => setTemperatureModalOpen(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg px-2 py-1 -mx-2 transition-colors"
              aria-label="Choose temperature entity"
            >
              {effectiveTempEntity?.startsWith("weather.") && temperatureState?.state ? (
                <WeatherIcon state={temperatureState.state} />
              ) : (
                <Thermometer className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" aria-hidden />
              )}
              {temperatureDisplay ?? "—"}
            </button>
          )}
        </div>
        <div className="flex justify-center px-4">
          <TopTabs activeHref={activeTab} />
        </div>
        <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
          {headerEndAction}
          <HeaderNotifications />
          <ThemeSwitcher />
        </div>
      </header>

      {temperatureModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <TemperatureEntityModal
            onClose={() => setTemperatureModalOpen(false)}
            onSelect={saveChosenTemperatureEntity}
          />,
          document.body
        )}

      <div className="shrink-0 flex items-center justify-between gap-4 pl-10 pr-4 py-4">
        <div className="min-w-0 flex-1">
          {welcomeEditable && onWelcomeChange ? (
            <div className="space-y-2 max-w-md">
              <input
                type="text"
                value={welcomeTitle}
                onChange={(e) =>
                  onWelcomeChange({
                    title: e.target.value,
                    subtitle: welcomeSubtitle,
                  })
                }
                className="block w-full text-2xl md:text-3xl font-bold bg-transparent border border-transparent hover:border-gray-300 dark:hover:border-white/20 rounded-lg px-2 py-1 -mx-2 text-gray-900 dark:text-white tracking-tight focus:outline-none focus:border-accent-purple dark:focus:border-accent-purple"
                placeholder="Welkomsttitel"
              />
              <input
                type="text"
                value={welcomeSubtitle}
                onChange={(e) =>
                  onWelcomeChange({
                    title: welcomeTitle,
                    subtitle: e.target.value,
                  })
                }
                className="block w-full text-base md:text-lg font-normal bg-transparent border border-transparent hover:border-gray-300 dark:hover:border-white/20 rounded-lg px-2 py-1 -mx-2 text-gray-600 dark:text-gray-300 focus:outline-none focus:border-accent-purple dark:focus:border-accent-purple"
                placeholder="Ondertitel"
              />
            </div>
          ) : (
            <>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {welcomeTitle}
              </p>
              <p className="text-base md:text-lg font-normal text-gray-600 dark:text-gray-300 mt-1.5">
                {welcomeSubtitle}
              </p>
            </>
          )}
        </div>
        {welcomeBarAction != null ? (
          <div className="flex items-center gap-2 shrink-0">
            {welcomeBarAction}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {showSidebar && (
          <div className="fixed left-0 top-[8rem] bottom-0 z-10 w-[88px] pl-8 flex flex-col items-center justify-center">
            <Sidebar activeHref={activeTab} />
          </div>
        )}
        <main
          className={cn(
            "flex-1 overflow-auto p-4 min-w-0",
            showSidebar && "ml-[88px]"
          )}
        >
          {children}
        </main>
      </div>

      {showFloatingToolbar && <FloatingToolbar />}
    </div>
  );
}
