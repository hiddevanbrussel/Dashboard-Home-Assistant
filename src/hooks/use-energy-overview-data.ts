"use client";

import { useEffect, useMemo, useState } from "react";
import { assembleStoryFacts, zonedDecimalHour, type StoryStatBundle } from "@/lib/energy-story/aggregate";
import type { StoryFacts, StoryLine } from "@/lib/energy-story/types";
import {
  batteryPowerNow,
  gridPowerNow,
  housePowerNow,
  solarPowerNow,
  type ManualLiveEntities,
} from "@/lib/energy-live";
import {
  batteryIsLinked,
  consumptionIsLinked,
  gridExportIsLinked,
  gridImportIsLinked,
  overviewIsLinked,
  solarIsLinked,
} from "@/lib/energy-now";
import type { EnergyModel } from "@/lib/energy-prefs";
import type { EnergyStatsResponse } from "@/lib/energy-stats";
import { FALLBACK_TIME_ZONE } from "@/lib/local-date";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useEnergyOverviewStore } from "@/stores/energy-overview-store";
import { useEnergyStore } from "@/stores/energy-store";

/** History refreshes every five minutes, and when the tab becomes visible again. Not on the 5s live poll. */
export const OVERVIEW_REFRESH_MS = 5 * 60 * 1000;

const SENSOR_ID = /^sensor\.[a-z0-9_]+$/;

type LoadState = {
  model: EnergyModel | null;
  deviceIds: string[];
  names: Record<string, string>;
  devicesKnown: boolean;
  stats: StoryStatBundle;
  timeZone: string;
};

function asModel(value: unknown): EnergyModel | null {
  if (!value || typeof value !== "object") return null;
  const model = value as EnergyModel;
  if (model.source !== "prefs" && model.source !== "manual") return null;
  if (!Array.isArray(model.energySources)) return null;
  return model;
}

function asStats(value: unknown): EnergyStatsResponse | null {
  if (!value || typeof value !== "object") return null;
  const stats = value as EnergyStatsResponse;
  if (!stats.series || !Array.isArray(stats.buckets)) return null;
  return stats;
}

function batteryStatSoc(model: EnergyModel | null): string {
  if (!model) return "";
  for (const source of model.energySources) {
    if (source.type === "battery" && source.statSoc) return source.statSoc;
  }
  return "";
}

function sample(
  states: Record<string, { state: string; attributes?: Record<string, unknown> } | undefined>,
  id: string
): { value: number; unit?: string | null } | undefined {
  if (!id) return undefined;
  const entity = states[id];
  if (!entity) return undefined;
  const value = Number(entity.state);
  if (!Number.isFinite(value)) return undefined;
  const unit = entity.attributes?.unit_of_measurement;
  return { value, unit: typeof unit === "string" ? unit : null };
}

async function readJson(url: string): Promise<unknown> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("overview");
  return response.json() as Promise<unknown>;
}

function statsPath(view: "day" | "week", offset: number, partial: boolean, devices: string, manual: string): string {
  const params = new URLSearchParams({ view, offset: String(offset) });
  if (partial) params.set("partial", "1");
  if (devices) params.set("devices", devices);
  if (manual) params.set("manual", manual);
  return `/api/ha/energy/statistics?${params.toString()}`;
}

export function useEnergyOverviewData(): { facts: StoryFacts | null; status: "loading" | "ready" | "error" } {
  const tab = useEnergyOverviewStore((state) => state.tab);
  const entities = useEnergyStore((state) => state.entities);
  const tariffMode = useEnergyStore((state) => state.tariffMode);
  const gridPowerInverted = useEnergyStore((state) => state.gridPowerInverted);
  const states = useEntityStateStore((state) => state.states);
  const [loaded, setLoaded] = useState<LoadState | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const manualIds = [entities.solarYieldTodayEntityId, entities.gridExportEntityId, entities.consumptionEntityId].filter(
    (id) => SENSOR_ID.test(id)
  );
  const manualKey = manualIds.join(",");

  useEffect(() => {
    let cancelled = false;
    let timer = 0;

    async function load() {
      if (typeof document !== "undefined" && document.hidden) return;
      if (useEnergyOverviewStore.getState().tab !== "overview") return;
      try {
        const prefs = await readJson("/api/ha/energy/prefs");
        const model = asModel(prefs);
        const dashboard = (await readJson("/api/energy-dashboard")) as { topDeviceIds?: unknown };
        const deviceIds = Array.isArray(dashboard.topDeviceIds)
          ? dashboard.topDeviceIds.filter((id): id is string => typeof id === "string")
          : [];
        const names: Record<string, string> = {};
        for (const device of model?.deviceConsumption ?? []) {
          if (device.statConsumption && device.name) names[device.statConsumption] = device.name;
        }
        const devices = deviceIds.filter((id) => SENSOR_ID.test(id)).join(",");
        const manual = model?.source === "manual" ? manualKey : "";
        const [today, yesterday, week, lastWeek] = await Promise.all([
          readJson(statsPath("day", 0, false, devices, manual)),
          readJson(statsPath("day", 1, true, "", manual)),
          readJson(statsPath("week", 0, false, "", manual)),
          readJson(statsPath("week", 1, true, "", manual)),
        ]);
        if (cancelled) return;
        const todayStats = asStats(today);
        setLoaded({
          model,
          deviceIds,
          names,
          devicesKnown: true,
          timeZone: todayStats?.tz || FALLBACK_TIME_ZONE,
          stats: {
            today: todayStats,
            yesterday: asStats(yesterday),
            week: asStats(week),
            lastWeek: asStats(lastWeek),
          },
        });
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus((current) => (current === "ready" ? "ready" : "error"));
      }
    }

    function arm() {
      window.clearInterval(timer);
      if (typeof document !== "undefined" && document.hidden) return;
      if (useEnergyOverviewStore.getState().tab !== "overview") return;
      void load();
      timer = window.setInterval(() => void load(), OVERVIEW_REFRESH_MS);
    }

    arm();
    document.addEventListener("visibilitychange", arm);
    const unsubscribe = useEnergyOverviewStore.subscribe((state, previous) => {
      if (state.tab !== previous.tab) arm();
    });
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", arm);
      unsubscribe();
    };
  }, [manualKey, tab]);

  const model = loaded?.model ?? null;
  const manual: ManualLiveEntities = {
    gridPowerEntityId: entities.gridPowerEntityId,
    gridImportPowerEntityId: entities.gridImportPowerEntityId,
    gridExportPowerEntityId: entities.gridExportPowerEntityId,
    gridPowerInverted,
    consumptionEntityId: entities.consumptionEntityId,
    solarPowerEntityId: entities.solarPowerEntityId,
    batteryPowerEntityId: entities.batteryPowerEntityId,
  };
  const samples: Record<string, { value: number; unit?: string | null }> = {};
  const socId = batteryStatSoc(model) || entities.batterySocEntityId;
  const sampleIds = [
    manual.gridPowerEntityId,
    manual.gridImportPowerEntityId,
    manual.gridExportPowerEntityId,
    manual.consumptionEntityId,
    manual.solarPowerEntityId,
    manual.batteryPowerEntityId,
    socId,
  ];
  for (const source of model?.energySources ?? []) {
    if (source.type === "solar" && source.statRate) sampleIds.push(source.statRate);
    if (source.type === "grid" || source.type === "battery") {
      if (source.statRate) sampleIds.push(source.statRate);
      const config = source.powerConfig;
      if (config?.statRate) sampleIds.push(config.statRate);
      if (config?.statRateInverted) sampleIds.push(config.statRateInverted);
      if (config?.statRateFrom) sampleIds.push(config.statRateFrom);
      if (config?.statRateTo) sampleIds.push(config.statRateTo);
    }
  }
  for (const id of sampleIds) {
    const reading = sample(states, id);
    if (reading) samples[id] = reading;
  }
  const solarKw = solarPowerNow({ model, manual, samples }) ?? 0;
  const gridKw = gridPowerNow({ model, manual, samples }) ?? 0;
  const batteryKw = batteryPowerNow({ model, manual, samples }) ?? 0;
  const house = housePowerNow({ model, manual, samples });
  const solarLinked = solarIsLinked(model, manual.solarPowerEntityId, entities.solarYieldTodayEntityId);
  const batteryLinked = batteryIsLinked(model, entities.batterySocEntityId, manual.batteryPowerEntityId);
  const gridLinked =
    gridImportIsLinked(model, manual.gridPowerEntityId, manual.gridImportPowerEntityId) ||
    gridExportIsLinked(model, manual.gridPowerEntityId, manual.gridExportPowerEntityId);
  const consumptionLinked = consumptionIsLinked(entities.consumptionEntityId);
  const linked = overviewIsLinked({
    solar: solarLinked,
    battery: batteryLinked,
    grid: gridLinked,
    consumption: consumptionLinked,
  });
  const zone = loaded?.timeZone || FALLBACK_TIME_ZONE;
  const facts = useMemo(() => {
    if (loaded == null) return null;
    const now = new Date();
    const hour = zonedDecimalHour(now, zone);
    const sunBelow = states["sun.sun"]?.state === "below_horizon";
    const names: Record<string, StoryLine> = {};
    for (const id of loaded.deviceIds) {
      const fromPrefs = loaded.names[id];
      const friendly = states[id]?.attributes?.friendly_name;
      const label = fromPrefs || (typeof friendly === "string" ? friendly : "");
      if (label) names[id] = { nl: label, en: label };
    }
    const socRaw = Number(states[socId]?.state);
    return assembleStoryFacts({
      now,
      timeZone: zone,
      sunsetHour: sunBelow && hour >= 12 ? 12 : 24,
      night: sunBelow,
      links: {
        solar: solarLinked,
        battery: batteryLinked,
        grid: gridLinked,
        consumption: consumptionLinked,
        linked,
      },
      tariffFixed: tariffMode !== "dynamic",
      hasDeviceConsumption: (model?.deviceConsumption.length ?? 0) > 0,
      devicesKnown: loaded.devicesKnown,
      deviceIds: loaded.deviceIds,
      deviceNames: names,
      stats: loaded.stats,
      soc: Number.isFinite(socRaw) ? socRaw : null,
      chargeKw: batteryKw < 0 ? -batteryKw : 0,
      dischargeKw: batteryKw > 0 ? batteryKw : 0,
      solarKw,
      homeKw: house ?? 0,
      gridImportKw: gridKw > 0 ? gridKw : 0,
      gridExportKw: gridKw < 0 ? -gridKw : 0,
    });
  }, [
    batteryKw,
    batteryLinked,
    consumptionLinked,
    gridKw,
    gridLinked,
    house,
    linked,
    loaded,
    model,
    socId,
    solarKw,
    solarLinked,
    states,
    tariffMode,
    zone,
  ]);

  return { facts, status };
}
