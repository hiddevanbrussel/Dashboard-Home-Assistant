/**
 * Turn statistics responses into story facts.
 * Hours are read from the offset timestamps the statistics route already built.
 * This module does not call getHours, setHours or toISOString.
 */

import { partialUntil } from "@/lib/energy-time";
import type { EnergyStatsResponse } from "@/lib/energy-stats";
import { lowerMedian } from "./format";
import type { StoryDeviceFact, StoryFacts, StoryLine } from "./types";

export type StoryStatBundle = {
  today: EnergyStatsResponse | null;
  yesterday: EnergyStatsResponse | null;
  week: EnergyStatsResponse | null;
  lastWeek: EnergyStatsResponse | null;
};

export type StoryLinkFlags = {
  solar: boolean;
  battery: boolean;
  grid: boolean;
  consumption: boolean;
  linked: boolean;
};

const HOUR_IN_ISO = /T(\d{2}):(\d{2})/;
const DAY_IN_ISO = /^(\d{4}-\d{2}-\d{2})/;

export function zonedDecimalHour(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  return (hour === 24 ? 0 : hour) + minute / 60;
}

export function weekdayIndexMonday(date: Date, timeZone: string): number {
  const name = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(date);
  const map: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
  return map[name] ?? 0;
}

function hourFromIso(iso: string): number | null {
  const match = HOUR_IN_ISO.exec(iso);
  if (!match) return null;
  const hour = Number(match[1]);
  return hour === 24 ? 0 : hour;
}

function dayFromIso(iso: string): string | null {
  return DAY_IN_ISO.exec(iso)?.[1] ?? null;
}

function sumKnown(values: readonly (number | null)[]): number | null {
  let any = false;
  let sum = 0;
  for (const value of values) {
    if (value == null || !Number.isFinite(value)) continue;
    any = true;
    sum += value;
  }
  return any ? sum : null;
}

/** Yesterday's series is a full day. Keep only the same clock time as now. */
export function sumSameClock(buckets: readonly string[], values: readonly (number | null)[], hour: number): number | null {
  const full = Math.floor(hour);
  const fraction = hour - full;
  let any = false;
  let sum = 0;
  for (let index = 0; index < buckets.length; index += 1) {
    const bucketHour = hourFromIso(buckets[index] ?? "");
    const value = values[index];
    if (bucketHour == null || value == null || !Number.isFinite(value)) continue;
    if (bucketHour < full) {
      any = true;
      sum += value;
    } else if (bucketHour === full && fraction > 0) {
      any = true;
      sum += value * fraction;
    }
  }
  return any ? sum : null;
}

function addSeries(parts: Array<Array<number | null> | undefined>): Array<number | null> {
  const length = Math.max(0, ...parts.map((part) => part?.length ?? 0));
  const out: Array<number | null> = [];
  for (let index = 0; index < length; index += 1) {
    let any = false;
    let sum = 0;
    for (const part of parts) {
      const value = part?.[index];
      if (value == null || !Number.isFinite(value)) continue;
      any = true;
      sum += value;
    }
    out.push(any ? sum : null);
  }
  return out;
}

function houseHours(stats: EnergyStatsResponse, nowHour: number): Array<{ hour: number; loadKwh: number }> {
  const { solar, gridImport, batteryOut, gridExport, batteryIn } = stats.series;
  const house = addSeries([solar, gridImport, batteryOut]);
  const leaving = addSeries([gridExport, batteryIn]);
  const rows: Array<{ hour: number; loadKwh: number }> = [];
  for (let index = 0; index < stats.buckets.length; index += 1) {
    const hour = hourFromIso(stats.buckets[index] ?? "");
    if (hour == null || hour + 1 > nowHour) continue;
    const produced = house[index];
    const used = leaving[index];
    if (produced == null && used == null) continue;
    rows.push({ hour, loadKwh: Math.max(0, (produced ?? 0) - (used ?? 0)) });
  }
  return rows;
}

function dayKey(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";
  return `${year}-${month}-${day}`;
}

/** Last week is a full week. Days after the same moment seven days ago are left out. */
export function sumWeekUntil(stats: EnergyStatsResponse, cutoff: Date): number | null {
  const cutoffKey = dayKey(cutoff, stats.tz);
  const cutoffHour = zonedDecimalHour(cutoff, stats.tz);
  let any = false;
  let sum = 0;
  for (let index = 0; index < stats.buckets.length; index += 1) {
    const key = dayFromIso(stats.buckets[index] ?? "");
    const value = stats.series.gridImport[index];
    if (!key || value == null || !Number.isFinite(value)) continue;
    if (key < cutoffKey) {
      any = true;
      sum += value;
    } else if (key === cutoffKey) {
      any = true;
      sum += value * Math.min(1, Math.max(0, cutoffHour / 24));
    }
  }
  return any ? sum : null;
}

function weekDays(stats: EnergyStatsResponse | null): StoryFacts["weekDays"] {
  if (!stats) return [];
  return stats.buckets.map((bucket, index) => {
    const key = dayFromIso(bucket);
    const date = key ? new Date(`${key}T12:00:00Z`) : new Date();
    return {
      weekday: weekdayIndexMonday(date, "UTC"),
      kwh: stats.series.gridImport[index] ?? 0,
      current: index === stats.buckets.length - 1,
    };
  });
}

export function emptySinceHour(iso: string | null, timeZone: string): number | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return zonedDecimalHour(date, timeZone);
}

export function deviceFacts(input: {
  ids: readonly string[];
  names: Readonly<Record<string, StoryLine>>;
  today: EnergyStatsResponse | null;
  peakHour: number | null;
}): StoryDeviceFact[] {
  const items = new Map((input.today?.devices?.items ?? []).map((item) => [item.id, item]));
  return input.ids.map((id) => {
    const item = items.get(id);
    const name = input.names[id] ?? { nl: id, en: id };
    if (!item) return { name, kwh: null, peakKwh: null };
    const known = item.perHour.some((value) => value != null);
    const peakIndex =
      input.peakHour == null
        ? -1
        : (input.today?.devices?.hours.findIndex((stamp) => hourFromIso(stamp) === input.peakHour) ?? -1);
    const peakKwh = peakIndex < 0 ? null : (item.perHour[peakIndex] ?? null);
    return { name, kwh: known ? item.total : null, peakKwh };
  });
}

export function chargesFromSolarOnly(input: { hasSolar: boolean; chargeKw: number; gridImportKw: number }): boolean {
  if (!input.hasSolar) return false;
  if (input.gridImportKw >= 0.01 && input.chargeKw >= 0.01) return false;
  return true;
}

export function assembleStoryFacts(input: {
  now: Date;
  timeZone: string;
  sunsetHour: number;
  night: boolean;
  links: StoryLinkFlags;
  tariffFixed: boolean;
  manualSource: boolean;
  hasDeviceConsumption: boolean;
  devicesKnown: boolean;
  deviceIds: readonly string[];
  deviceNames: Readonly<Record<string, StoryLine>>;
  stats: StoryStatBundle;
  soc: number | null;
  chargeKw: number;
  dischargeKw: number;
  solarKw: number;
  homeKw: number;
  gridImportKw: number;
  gridExportKw: number;
}): StoryFacts {
  const hour = zonedDecimalHour(input.now, input.timeZone);
  const today = input.stats.today;
  const yesterday = input.stats.yesterday;
  const importKwh = today ? sumKnown(today.series.gridImport) : null;
  const solarKwh = today ? sumKnown(today.series.solar) : null;
  const exportKwh = today ? sumKnown(today.series.gridExport) : null;
  const chargeKwh = today ? sumKnown(today.series.batteryIn) : null;
  const dischargeKwh = today ? sumKnown(today.series.batteryOut) : null;
  const hours = today ? houseHours(today, hour) : [];
  const loadSeries = today
    ? addSeries([today.series.solar, today.series.gridImport, today.series.batteryOut]).map((value, index) => {
        const leaving = (today.series.gridExport[index] ?? 0) + (today.series.batteryIn[index] ?? 0);
        return value == null && today.series.gridExport[index] == null && today.series.batteryIn[index] == null
          ? null
          : Math.max(0, (value ?? 0) - leaving);
      })
    : [];
  const loadKwh = sumKnown(loadSeries) ?? importKwh;
  const yesterdayImport = yesterday ? sumSameClock(yesterday.buckets, yesterday.series.gridImport, hour) : null;
  const yesterdaySolar = yesterday ? sumKnown(yesterday.series.solar) : null;
  const yesterdayLoad = yesterday
    ? sumKnown(
        addSeries([yesterday.series.solar, yesterday.series.gridImport, yesterday.series.batteryOut]).map((value, index) => {
          const leaving = (yesterday.series.gridExport[index] ?? 0) + (yesterday.series.batteryIn[index] ?? 0);
          return value == null ? null : Math.max(0, value - leaving);
        })
      )
    : null;
  const yesterdayFullImport = yesterday ? sumKnown(yesterday.series.gridImport) : null;
  const selfPct =
    yesterdayLoad != null && yesterdayLoad > 0 && yesterdayFullImport != null
      ? (1 - yesterdayFullImport / yesterdayLoad) * 100
      : null;
  const peakHour = hours.reduce<{ hour: number; loadKwh: number } | null>((best, row) => {
    if (!best || row.loadKwh > best.loadKwh) return row;
    return best;
  }, null)?.hour ?? null;
  const weekKwh = input.stats.week ? sumKnown(input.stats.week.series.gridImport) : null;
  const cutoff = partialUntil("week", input.now, input.timeZone);
  const lastWeekKwh = input.stats.lastWeek && cutoff ? sumWeekUntil(input.stats.lastWeek, cutoff) : null;
  const ltsDays = input.stats.lastWeek == null ? null : lastWeekKwh == null && weekKwh == null ? 0 : 8;
  const hasGrid = input.links.grid || importKwh != null;
  return {
    hour,
    sunsetHour: input.sunsetHour,
    night: input.night,
    hasSolar: input.links.solar,
    hasBattery: input.links.battery,
    hasGrid,
    linked: input.links.linked,
    manualWithoutImport: input.manualSource && importKwh == null,
    solarKwh,
    loadKwh,
    importKwh,
    exportKwh,
    chargeKwh,
    dischargeKwh,
    yesterday:
      yesterdaySolar == null || yesterdayLoad == null || selfPct == null
        ? null
        : { solarKwh: yesterdaySolar, loadKwh: yesterdayLoad, selfPct },
    yesterdayImportKwh: yesterdayImport,
    hours,
    devices: deviceFacts({ ids: input.deviceIds, names: input.deviceNames, today, peakHour }),
    hasDeviceConsumption: input.hasDeviceConsumption,
    devicesKnown: input.devicesKnown,
    soc: input.soc,
    chargeKw: input.chargeKw,
    dischargeKw: input.dischargeKw,
    emptySinceHour:
      input.soc != null && input.soc <= 12 ? emptySinceHour(today?.emptySince ?? null, input.timeZone) : null,
    chargesFromSolarOnly: chargesFromSolarOnly({
      hasSolar: input.links.solar,
      chargeKw: input.chargeKw,
      gridImportKw: input.gridImportKw,
    }),
    weekKwh,
    lastWeekKwh,
    weekDays: weekDays(input.stats.week),
    ltsDays,
    tariffFixed: input.tariffFixed,
    live: {
      solarKw: input.solarKw,
      homeKw: input.homeKw,
      gridImportKw: input.gridImportKw,
      gridExportKw: input.gridExportKw,
      chargeKw: input.chargeKw,
      dischargeKw: input.dischargeKw,
    },
  };
}

export function storyMedian(hours: readonly { loadKwh: number }[]): number | null {
  return lowerMedian(hours.map((row) => row.loadKwh));
}
