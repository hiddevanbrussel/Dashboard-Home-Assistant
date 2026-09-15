"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Home, Pause, Play, Square } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { VacuumSidePanel } from "@/components/vacuum/vacuum-side-panel";
import { useTranslation } from "@/hooks/use-translation";
import { useValetudoStore, hydrateValetudoStore } from "@/stores/valetudo-store";
import { valetudoRequest } from "@/lib/valetudo-client";
import { segmentLayers, type ValetudoRawMap } from "@/lib/valetudo-map";
import { ValetudoMapCanvas, segmentNameFromLayers } from "@/components/vacuum/valetudo-map-canvas";
import {
  consumableKey,
  consumablePath,
  fanSpeedFromAttributes,
  parseConsumableProperties,
  parseConsumables,
  parseFanPresets,
  parseSegmentIterationMax,
  clampSegmentIterations,
  segmentIterationOptions,
  sortConsumables,
  type ConsumableMeta,
  type ConsumableState,
  type FanPreset,
} from "@/lib/valetudo-robot";
import { cn } from "@/lib/utils";

const FAN_PRESETS_PATH = "/api/v2/robot/capabilities/FanSpeedControlCapability/presets";
const FAN_PRESET_PATH = "/api/v2/robot/capabilities/FanSpeedControlCapability/preset";
const CONSUMABLES_PATH = "/api/v2/robot/capabilities/ConsumableMonitoringCapability";
const CONSUMABLE_PROPERTIES_PATH = "/api/v2/robot/capabilities/ConsumableMonitoringCapability/properties";
const SEGMENT_PROPERTIES_PATH = "/api/v2/robot/capabilities/MapSegmentationCapability/properties";

type RobotAttribute = {
  __class?: string;
  type?: string;
  value?: string | number;
  level?: number;
  flag?: string;
};

type RobotState = {
  attributes?: RobotAttribute[];
  map?: ValetudoRawMap;
};

function attr<T extends RobotAttribute>(list: RobotAttribute[] | undefined, cls: string): T | undefined {
  return list?.find((item) => item.__class === cls) as T | undefined;
}

export default function VacuumPage() {
  const { t } = useTranslation();
  const enabled = useValetudoStore((s) => s.enabled);
  const baseUrl = useValetudoStore((s) => s.baseUrl);
  const username = useValetudoStore((s) => s.username);
  const password = useValetudoStore((s) => s.password);
  const [map, setMap] = useState<ValetudoRawMap | null>(null);
  const [attributes, setAttributes] = useState<RobotAttribute[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [fanPresets, setFanPresets] = useState<FanPreset[]>([]);
  const [consumables, setConsumables] = useState<ConsumableState[]>([]);
  const [consumableMeta, setConsumableMeta] = useState<ConsumableMeta[]>([]);
  const [fanBusy, setFanBusy] = useState(false);
  const [resettingKey, setResettingKey] = useState<string | null>(null);
  const [iterations, setIterations] = useState(1);
  const [iterationMax, setIterationMax] = useState(3);

  useEffect(() => {
    hydrateValetudoStore();
  }, []);

  const conn = useMemo(
    () => ({ baseUrl, username, password }),
    [baseUrl, username, password]
  );
  const refreshInFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (!conn.baseUrl || refreshInFlight.current) return;
    refreshInFlight.current = true;
    try {
      const state = await valetudoRequest<RobotState>({
        ...conn,
        path: "/api/v2/robot/state",
      });
      if (state.map) setMap(state.map);
      if (Array.isArray(state.attributes)) setAttributes(state.attributes);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("vacuum.loadError"));
    } finally {
      setLoaded(true);
    }
    try {
      const data = await valetudoRequest<unknown>({ ...conn, path: CONSUMABLES_PATH });
      setConsumables(parseConsumables(data));
    } catch {
      setConsumables([]);
    } finally {
      refreshInFlight.current = false;
    }
  }, [conn, t]);

  const loadCapabilities = useCallback(async () => {
    if (!conn.baseUrl) return;
    try {
      const presets = await valetudoRequest<unknown>({ ...conn, path: FAN_PRESETS_PATH });
      setFanPresets(parseFanPresets(presets));
    } catch {
      setFanPresets([]);
    }
    try {
      const props = await valetudoRequest<unknown>({ ...conn, path: CONSUMABLE_PROPERTIES_PATH });
      setConsumableMeta(parseConsumableProperties(props));
    } catch {
      setConsumableMeta([]);
    }
    try {
      const props = await valetudoRequest<unknown>({ ...conn, path: SEGMENT_PROPERTIES_PATH });
      const max = parseSegmentIterationMax(props);
      setIterationMax(max);
      setIterations((current) => clampSegmentIterations(current, max));
    } catch {
      setIterationMax(3);
      setIterations((current) => clampSegmentIterations(current, 3));
    }
  }, [conn]);

  useEffect(() => {
    if (!enabled || !baseUrl) {
      setLoaded(true);
      return;
    }
    void refresh();
    void loadCapabilities();
    const id = setInterval(() => void refresh(), 4000);
    return () => clearInterval(id);
  }, [enabled, baseUrl, refresh, loadCapabilities]);

  function toggleSegment(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function sendBasic(action: "start" | "pause" | "stop" | "home") {
    setBusy(true);
    try {
      await valetudoRequest({
        ...conn,
        method: "PUT",
        path: "/api/v2/robot/capabilities/BasicControlCapability",
        payload: { action },
      });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("vacuum.commandError"));
    } finally {
      setBusy(false);
    }
  }

  async function setFanPreset(preset: FanPreset) {
    setFanBusy(true);
    try {
      await valetudoRequest({
        ...conn,
        method: "PUT",
        path: FAN_PRESET_PATH,
        payload: { name: preset },
      });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("vacuum.commandError"));
    } finally {
      setFanBusy(false);
    }
  }

  async function resetConsumable(item: ConsumableState) {
    const key = consumableKey(item);
    setResettingKey(key);
    try {
      await valetudoRequest({
        ...conn,
        method: "PUT",
        path: consumablePath(item),
        payload: { action: "reset" },
      });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("vacuum.commandError"));
    } finally {
      setResettingKey(null);
    }
  }

  async function cleanSelected() {
    if (selectedIds.length === 0) return;
    setBusy(true);
    try {
      await valetudoRequest({
        ...conn,
        method: "PUT",
        path: "/api/v2/robot/capabilities/MapSegmentationCapability",
        payload: {
          action: "start_segment_action",
          segment_ids: selectedIds,
          iterations: clampSegmentIterations(iterations, iterationMax),
          customOrder: true,
        },
      });
      setSelectedIds([]);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("vacuum.commandError"));
    } finally {
      setBusy(false);
    }
  }

  const status = attr(attributes, "StatusStateAttribute")?.value;
  const battery = attr(attributes, "BatteryStateAttribute")?.level;
  const fanSpeed = fanSpeedFromAttributes(attributes);
  const sortedConsumables = useMemo(
    () => sortConsumables(consumables, consumableMeta),
    [consumables, consumableMeta]
  );
  const statusKey =
    typeof status === "string" && status ? `vacuum.status.${status}` : "vacuum.status.unknown";
  const rooms = map ? segmentLayers(map) : [];
  const selectedNames = selectedIds.map((id) => segmentNameFromLayers(map?.layers ?? [], id));

  return (
    <AppShell activeTab="/vacuum" contentNoScroll>
      <div className="flex h-full min-h-0 flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {t("vacuum.title")}
            </h1>
            {enabled && loaded ? (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t(statusKey)}
                {typeof battery === "number" ? ` · ${battery}%` : ""}
              </p>
            ) : null}
          </div>
          {enabled && map ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void sendBasic("pause")}
                disabled={busy || status !== "cleaning"}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-gray-800 disabled:opacity-40 dark:bg-white/10 dark:text-white"
                aria-label={t("vacuum.pause")}
              >
                <Pause className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => void sendBasic("stop")}
                disabled={busy || status === "docked" || status === "idle"}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-gray-800 disabled:opacity-40 dark:bg-white/10 dark:text-white"
                aria-label={t("vacuum.stop")}
              >
                <Square className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => void sendBasic("home")}
                disabled={busy || status === "docked" || status === "returning"}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-gray-800 disabled:opacity-40 dark:bg-white/10 dark:text-white"
                aria-label={t("vacuum.dock")}
              >
                <Home className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>

        {!enabled || !baseUrl ? (
          <div className="flex flex-1 items-center justify-center rounded-card border border-white/60 bg-white/40 p-8 text-center dark:border-white/10 dark:bg-white/5">
            <div className="max-w-sm space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">{t("vacuum.notConfigured")}</p>
              <Link
                href="/settings"
                className="inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
              >
                {t("vacuum.openSettings")}
              </Link>
            </div>
          </div>
        ) : error && !map ? (
          <div className="flex flex-1 items-center justify-center rounded-card border border-red-200 bg-red-50 p-8 text-center text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-100">
            {error}
          </div>
        ) : map ? (
          <>
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden lg:flex-row">
              <div className="relative min-h-[32vh] flex-1 overflow-hidden lg:min-h-0">
                <ValetudoMapCanvas
                  map={map}
                  selectedIds={selectedIds}
                  onToggleSegment={toggleSegment}
                />
              </div>
              <VacuumSidePanel
                fanPresets={fanPresets}
                fanSpeed={fanSpeed}
                fanBusy={fanBusy}
                onFanPreset={(preset) => void setFanPreset(preset)}
                consumables={sortedConsumables}
                consumableMeta={consumableMeta}
                resettingKey={resettingKey}
                onResetConsumable={(item) => void resetConsumable(item)}
              />
            </div>
            {error ? <p className="text-sm text-red-600 dark:text-red-300">{error}</p> : null}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-white/60 bg-white/50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedNames.length === 0
                    ? t("vacuum.pickRooms")
                    : selectedNames.join(", ")}
                </p>
                {iterationMax > 1 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {t("vacuum.iterations")}
                    </span>
                    <div role="radiogroup" aria-label={t("vacuum.iterations")} className="flex flex-wrap gap-1.5">
                      {segmentIterationOptions(iterationMax).map((count) => {
                        const selected = iterations === count;
                        return (
                          <button
                            key={count}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => setIterations(count)}
                            className={cn(
                              "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                              selected
                                ? "bg-brand text-white shadow-sm"
                                : "bg-white/70 text-gray-800 hover:bg-white dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                            )}
                          >
                            {t("vacuum.iterationsCount").replace("{n}", String(count))}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => void cleanSelected()}
                disabled={busy || selectedIds.length === 0}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-40"
                )}
              >
                <Play className="h-4 w-4" />
                {t("vacuum.clean")}
              </button>
            </div>
            {rooms.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("vacuum.noRooms")}</p>
            ) : null}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            {t("vacuum.loading")}
          </div>
        )}
      </div>
    </AppShell>
  );
}
