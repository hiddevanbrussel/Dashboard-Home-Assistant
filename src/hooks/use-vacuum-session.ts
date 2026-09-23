"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { useValetudoStore, hydrateValetudoStore } from "@/stores/valetudo-store";
import { valetudoRequest } from "@/lib/valetudo-client";
import { segmentLayers, type ValetudoRawMap } from "@/lib/valetudo-map";
import {
  consumableKey,
  consumablePath,
  fanSpeedFromAttributes,
  parseConsumableProperties,
  parseConsumables,
  parseFanPresets,
  parseSegmentIterationMax,
  clampSegmentIterations,
  sortConsumables,
  parseCurrentStatistics,
  robotDisplayName,
  type ConsumableMeta,
  type ConsumableState,
  type FanPreset,
  type VacuumCurrentStats,
} from "@/lib/valetudo-robot";

const FAN_PRESETS_PATH = "/api/v2/robot/capabilities/FanSpeedControlCapability/presets";
const FAN_PRESET_PATH = "/api/v2/robot/capabilities/FanSpeedControlCapability/preset";
const CONSUMABLES_PATH = "/api/v2/robot/capabilities/ConsumableMonitoringCapability";
const CONSUMABLE_PROPERTIES_PATH = "/api/v2/robot/capabilities/ConsumableMonitoringCapability/properties";
const SEGMENT_PROPERTIES_PATH = "/api/v2/robot/capabilities/MapSegmentationCapability/properties";
const STATISTICS_PATH = "/api/v2/robot/capabilities/CurrentStatisticsCapability";
const ROBOT_PATH = "/api/v2/robot";

export type RobotAttribute = {
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

export type VacuumSessionOptions = {
  active?: boolean;
  includeMaintenance?: boolean;
};

export function useVacuumSession({
  active = true,
  includeMaintenance = true,
}: VacuumSessionOptions = {}) {
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
  const [stats, setStats] = useState<VacuumCurrentStats>({ areaCm2: null, timeSec: null });
  const [robotName, setRobotName] = useState<string | null>(null);

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
    if (includeMaintenance) {
      try {
        const data = await valetudoRequest<unknown>({ ...conn, path: CONSUMABLES_PATH });
        setConsumables(parseConsumables(data));
      } catch {
        setConsumables([]);
      }
    }
    try {
      const data = await valetudoRequest<unknown>({ ...conn, path: STATISTICS_PATH });
      setStats(parseCurrentStatistics(data));
    } catch {
      setStats({ areaCm2: null, timeSec: null });
    }
    refreshInFlight.current = false;
  }, [conn, t, includeMaintenance]);

  const loadCapabilities = useCallback(async () => {
    if (!conn.baseUrl) return;
    try {
      const presets = await valetudoRequest<unknown>({ ...conn, path: FAN_PRESETS_PATH });
      setFanPresets(parseFanPresets(presets));
    } catch {
      setFanPresets([]);
    }
    if (includeMaintenance) {
      try {
        const props = await valetudoRequest<unknown>({ ...conn, path: CONSUMABLE_PROPERTIES_PATH });
        setConsumableMeta(parseConsumableProperties(props));
      } catch {
        setConsumableMeta([]);
      }
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
    try {
      const robot = await valetudoRequest<unknown>({ ...conn, path: ROBOT_PATH });
      setRobotName(robotDisplayName(robot));
    } catch {
      setRobotName(null);
    }
  }, [conn, includeMaintenance]);

  useEffect(() => {
    if (!active) return;
    if (!enabled || !baseUrl) {
      setLoaded(true);
      return;
    }
    void refresh();
    void loadCapabilities();
    const id = setInterval(() => void refresh(), 4000);
    return () => clearInterval(id);
  }, [active, enabled, baseUrl, refresh, loadCapabilities]);

  function toggleSegment(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => id !== item) : [...current, id]));
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
  const configured = Boolean(enabled && baseUrl);

  return {
    configured,
    enabled,
    baseUrl,
    map,
    selectedIds,
    error,
    busy,
    loaded,
    fanPresets,
    fanBusy,
    fanSpeed,
    sortedConsumables,
    consumableMeta,
    resettingKey,
    iterations,
    iterationMax,
    setIterations,
    status,
    battery,
    statusKey,
    rooms,
    stats,
    robotName,
    toggleSegment,
    sendBasic,
    setFanPreset,
    resetConsumable,
    cleanSelected,
  };
}
