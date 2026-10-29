/**
 * Read energy statistics for one dashboard period and shape a compact response.
 * Home Assistant is asked for kWh and m³. The open hour is filled from 5-minute changes.
 * Battery state of charge uses the 5-minute mean so a later screen can show "leeg sinds".
 * Server-side only. Statistic ids in the query string are allowlisted before they are sent.
 */

import {
  ENERGY_CACHE_CLOSED_TTL_MS,
  ENERGY_CACHE_RUNNING_TTL_MS,
  energyCacheKey,
  energyCacheTtlMs,
  energyStatisticsCache,
  hashStatisticIds,
} from "./energy-cache";
import type { EnergyModel, EnergySource } from "./energy-prefs";
import { energyModelFromCommand } from "./energy-prefs";
import {
  advanceBucket,
  bucketStarts,
  isoWithOffset,
  partialUntil,
  periodRange,
  zonedHourStart,
  zonedMidnight,
  type EnergyBucket,
  type EnergyView,
  type PeriodRange,
} from "./energy-time";
import { getHaTimeZone, type HaTimeZoneConfig } from "./ha/ha-config";
import { haWsCommands, type HaWsCommandInput, type HaWsCommandResult } from "./ha/ws-commands";

export const ENERGY_UNITS = { energy: "kWh", volume: "m³" } as const;
export const QUERY_STATISTIC_ID_RE = /^sensor\.[a-z0-9_]+$/;
export const QUERY_STATISTIC_LIMIT = 12;

export type StatisticPoint = {
  start: number;
  change: number | null;
  mean: number | null;
};

export type EnergyRoles = {
  gridImport: string[];
  gridExport: string[];
  solar: string[];
  batteryIn: string[];
  batteryOut: string[];
  batterySoc: string[];
  gas: string[];
  water: string[];
};

export type EnergyDeviceSeries = {
  id: string;
  total: number;
  perHour: Array<number | null>;
};

export type EnergyStatsResponse = {
  view: EnergyView;
  tz: string;
  buckets: string[];
  series: {
    gridImport: Array<number | null>;
    gridExport: Array<number | null>;
    solar: Array<number | null>;
    batteryIn: Array<number | null>;
    batteryOut: Array<number | null>;
    gas: Array<number | null>;
    water: Array<number | null>;
    batterySoc: Array<number | null>;
  };
  devices?: {
    hours: string[];
    items: EnergyDeviceSeries[];
  };
  partialFrom?: string;
  emptySince: string | null;
  units: { energy: "kWh"; volume: "m³" };
};

type UnitKind = "energy" | "volume";

type StatTable = Record<string, StatisticPoint[]>;

type StatPlan = {
  purpose: "period" | "hour" | "day" | "five" | "devices" | "soc";
  period: EnergyBucket;
  start: Date;
  end: Date;
  ids: string[];
  types: Array<"change" | "mean">;
};

function unique(ids: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

function pushId(target: string[], id: string | null): void {
  if (id) target.push(id);
}

export function rolesFromModel(model: EnergyModel, manualIds: readonly string[]): EnergyRoles {
  const roles: EnergyRoles = {
    gridImport: [],
    gridExport: [],
    solar: [],
    batteryIn: [],
    batteryOut: [],
    batterySoc: [],
    gas: [],
    water: [],
  };
  if (model.source === "manual") {
    roles.gridImport.push(...manualIds);
    return roles;
  }
  for (const source of model.energySources) {
    collectSource(roles, source);
  }
  return roles;
}

function collectSource(roles: EnergyRoles, source: EnergySource): void {
  switch (source.type) {
    case "grid":
      pushId(roles.gridImport, source.statEnergyFrom);
      pushId(roles.gridExport, source.statEnergyTo);
      break;
    case "solar":
      pushId(roles.solar, source.statEnergyFrom);
      break;
    case "battery":
      pushId(roles.batteryOut, source.statEnergyFrom);
      pushId(roles.batteryIn, source.statEnergyTo);
      pushId(roles.batterySoc, source.statSoc);
      break;
    case "gas":
      pushId(roles.gas, source.statEnergyFrom);
      break;
    case "water":
      pushId(roles.water, source.statEnergyFrom);
      break;
    default: {
      const neverSource: never = source;
      void neverSource;
    }
  }
}

export function selectQueryStatisticIds(
  raw: string | null | undefined,
  known: ReadonlySet<string>,
  limit = QUERY_STATISTIC_LIMIT
): string[] {
  if (!raw) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const part of raw.split(",")) {
    const id = part.trim();
    if (!QUERY_STATISTIC_ID_RE.test(id) || !known.has(id) || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
    if (out.length >= limit) break;
  }
  return out;
}

export function energyStatisticIdSet(raw: unknown): Set<string> {
  if (!Array.isArray(raw)) return new Set();
  const ids = new Set<string>();
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    if (record.unit_class !== "energy") continue;
    if (typeof record.statistic_id !== "string" || !QUERY_STATISTIC_ID_RE.test(record.statistic_id)) continue;
    ids.add(record.statistic_id);
  }
  return ids;
}

export function scaleEnergyToKwh(value: number, unit: string | null | undefined): number {
  const key = (unit ?? "").trim().toLowerCase().replace(/\s+/g, "");
  if (key === "wh") return value / 1000;
  if (key === "mwh") return value * 1000;
  if (key === "gwh") return value * 1_000_000;
  return value;
}

export function scaleVolumeToM3(value: number, unit: string | null | undefined): number {
  const key = (unit ?? "").trim().toLowerCase().replace(/\s+/g, "");
  if (key === "l" || key === "liter" || key === "litre" || key === "liters" || key === "litres") return value / 1000;
  return value;
}

export function redactSecrets(message: string, secrets: readonly string[]): string {
  let out = message;
  for (const secret of secrets) {
    if (!secret) continue;
    out = out.split(secret).join("[redacted]");
  }
  return out;
}

function finiteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function statisticStartMs(start: unknown): number | null {
  if (typeof start === "number" && Number.isFinite(start)) return start > 1e11 ? start : start * 1000;
  if (typeof start === "string") {
    const parsed = Date.parse(start);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function parseStatisticsMap(raw: unknown): StatTable {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const table: StatTable = {};
  for (const [id, rows] of Object.entries(raw)) {
    if (!Array.isArray(rows)) continue;
    const points: StatisticPoint[] = [];
    for (const row of rows) {
      if (!row || typeof row !== "object") continue;
      const record = row as Record<string, unknown>;
      const start = statisticStartMs(record.start);
      if (start == null) continue;
      points.push({ start, change: finiteNumber(record.change), mean: finiteNumber(record.mean) });
    }
    points.sort((left, right) => left.start - right.start);
    table[id] = points;
  }
  return table;
}

function round6(value: number): number {
  return Math.round(value * 1e6) / 1e6;
}

function indexPoints(points: StatisticPoint[] | undefined): Map<number, StatisticPoint> {
  const map = new Map<number, StatisticPoint>();
  for (const point of points ?? []) map.set(point.start, point);
  return map;
}

function scaled(
  value: number,
  id: string,
  kind: UnitKind,
  unitById: Record<string, string> | undefined
): number {
  const unit = unitById?.[id];
  if (!unit) return value;
  return kind === "volume" ? scaleVolumeToM3(value, unit) : scaleEnergyToKwh(value, unit);
}

function changeAt(
  table: StatTable,
  id: string,
  startMs: number,
  kind: UnitKind,
  unitById: Record<string, string> | undefined,
  cache: Map<string, Map<number, StatisticPoint>>
): number | null {
  let index = cache.get(id);
  if (!index) {
    index = indexPoints(table[id]);
    cache.set(id, index);
  }
  const point = index.get(startMs);
  if (!point || point.change == null) return null;
  return scaled(point.change, id, kind, unitById);
}

function sumIdsAt(
  ids: readonly string[],
  table: StatTable,
  startMs: number,
  kind: UnitKind,
  unitById: Record<string, string> | undefined
): number | null {
  const cache = new Map<string, Map<number, StatisticPoint>>();
  let any = false;
  let sum = 0;
  for (const id of ids) {
    const value = changeAt(table, id, startMs, kind, unitById, cache);
    if (value == null) continue;
    any = true;
    sum += value;
  }
  return any ? round6(sum) : null;
}

function sumChangeBetween(
  ids: readonly string[],
  table: StatTable,
  startMs: number,
  endMs: number,
  kind: UnitKind,
  unitById: Record<string, string> | undefined
): number | null {
  let any = false;
  let sum = 0;
  for (const id of ids) {
    for (const point of table[id] ?? []) {
      if (point.start < startMs || point.start >= endMs || point.change == null) continue;
      any = true;
      sum += scaled(point.change, id, kind, unitById);
    }
  }
  return any ? round6(sum) : null;
}

function meanBetween(ids: readonly string[], table: StatTable, startMs: number, endMs: number): number | null {
  let weighted = 0;
  let count = 0;
  for (const id of ids) {
    for (const point of table[id] ?? []) {
      if (point.start < startMs || point.start >= endMs || point.mean == null) continue;
      weighted += point.mean;
      count += 1;
    }
  }
  return count > 0 ? round6(weighted / count) : null;
}

function containsNow(start: Date, end: Date, now: Date): boolean {
  return start.getTime() <= now.getTime() && now.getTime() < end.getTime();
}

function hourValue(
  ids: readonly string[],
  hourStart: Date,
  now: Date,
  hourTable: StatTable,
  fiveTable: StatTable,
  kind: UnitKind,
  unitById: Record<string, string> | undefined
): number | null {
  const hourEnd = hourStart.getTime() + 60 * 60 * 1000;
  if (containsNow(hourStart, new Date(hourEnd), now)) {
    const partial = sumChangeBetween(ids, fiveTable, hourStart.getTime(), now.getTime(), kind, unitById);
    if (partial != null) return partial;
  }
  return sumIdsAt(ids, hourTable, hourStart.getTime(), kind, unitById);
}

function sumOpenDay(
  ids: readonly string[],
  dayStart: Date,
  dayEnd: Date,
  now: Date,
  tz: string,
  hourTable: StatTable,
  fiveTable: StatTable,
  kind: UnitKind,
  unitById: Record<string, string> | undefined
): number | null {
  const hours = bucketStarts({ start: dayStart, end: new Date(Math.min(dayEnd.getTime(), now.getTime() + 1)) }, "hour", tz);
  let any = false;
  let sum = 0;
  for (const hour of hours) {
    if (hour.getTime() > now.getTime()) break;
    const value = hourValue(ids, hour, now, hourTable, fiveTable, kind, unitById);
    if (value == null) continue;
    any = true;
    sum += value;
  }
  return any ? round6(sum) : null;
}

function emptySinceFrom(ids: readonly string[], table: StatTable, tz: string): string | null {
  const starts = new Set<number>();
  for (const id of ids) {
    for (const point of table[id] ?? []) starts.add(point.start);
  }
  const ordered = [...starts].sort((left, right) => left - right);
  let since: number | null = null;
  for (const start of ordered) {
    let total = 0;
    let count = 0;
    for (const id of ids) {
      const point = (table[id] ?? []).find((row) => row.start === start);
      if (point?.mean == null) continue;
      total += point.mean;
      count += 1;
    }
    if (count === 0) continue;
    const mean = total / count;
    if (mean <= 0) {
      if (since == null) since = start;
    } else {
      since = null;
    }
  }
  return since == null ? null : isoWithOffset(new Date(since), tz);
}

function seriesIds(roles: EnergyRoles): string[] {
  return unique([
    ...roles.gridImport,
    ...roles.gridExport,
    ...roles.solar,
    ...roles.batteryIn,
    ...roles.batteryOut,
    ...roles.gas,
    ...roles.water,
  ]);
}

function addPlan(plans: StatPlan[], plan: StatPlan): void {
  if (plan.ids.length === 0 || plan.start.getTime() >= plan.end.getTime()) return;
  const existing = plans.find(
    (item) =>
      item.purpose === plan.purpose &&
      item.period === plan.period &&
      item.start.getTime() === plan.start.getTime() &&
      item.end.getTime() === plan.end.getTime() &&
      item.types.join() === plan.types.join()
  );
  if (existing) {
    existing.ids = unique([...existing.ids, ...plan.ids]);
    return;
  }
  plans.push({ ...plan, ids: unique(plan.ids) });
}

export function planStatisticRequests(input: {
  range: PeriodRange;
  now: Date;
  tz: string;
  roles: EnergyRoles;
  deviceIds: readonly string[];
}): StatPlan[] {
  const plans: StatPlan[] = [];
  const energyIds = seriesIds(input.roles);
  const devices = unique(input.deviceIds);
  const open = input.range.start.getTime() <= input.now.getTime() && input.now.getTime() <= input.range.end.getTime();
  const today = zonedMidnight(input.now, input.tz);
  const hourStart = zonedHourStart(input.now, input.tz);

  if (input.range.bucket === "hour") {
    addPlan(plans, {
      purpose: "hour",
      period: "hour",
      start: input.range.start,
      end: input.range.end,
      ids: unique([...energyIds, ...devices]),
      types: ["change"],
    });
  } else {
    addPlan(plans, {
      purpose: "period",
      period: input.range.bucket,
      start: input.range.start,
      end: input.range.end,
      ids: energyIds,
      types: ["change"],
    });
    if (devices.length > 0) {
      addPlan(plans, {
        purpose: "devices",
        period: "hour",
        start: input.range.start,
        end: input.range.end,
        ids: devices,
        types: ["change"],
      });
    }
  }

  if (open && input.range.bucket !== "hour") {
    addPlan(plans, {
      purpose: "hour",
      period: "hour",
      start: today,
      end: input.now,
      ids: energyIds,
      types: ["change"],
    });
  }

  if (open && input.range.bucket === "month") {
    const monthStart = bucketStarts(
      { start: input.range.start, end: new Date(input.now.getTime() + 1) },
      "month",
      input.tz
    ).at(-1);
    if (monthStart) {
      addPlan(plans, {
        purpose: "day",
        period: "day",
        start: monthStart,
        end: input.now,
        ids: energyIds,
        types: ["change"],
      });
    }
  }

  if (open) {
    addPlan(plans, {
      purpose: "five",
      period: "5minute",
      start: hourStart,
      end: input.now,
      ids: unique([...energyIds, ...devices]),
      types: ["change"],
    });
  }

  if (input.roles.batterySoc.length > 0) {
    const end = new Date(Math.min(input.range.end.getTime(), input.now.getTime()));
    let start = input.range.start;
    const maxSpan = 8 * 24 * 60 * 60 * 1000;
    if (end.getTime() - start.getTime() > maxSpan) start = new Date(end.getTime() - 2 * 24 * 60 * 60 * 1000);
    if (start.getTime() < input.range.start.getTime()) start = input.range.start;
    addPlan(plans, {
      purpose: "soc",
      period: "5minute",
      start,
      end,
      ids: input.roles.batterySoc,
      types: ["mean"],
    });
  }

  return plans;
}

export function buildEnergyStats(input: {
  view: EnergyView;
  tz: string;
  range: PeriodRange;
  now: Date;
  offset: number;
  partial: boolean;
  roles: EnergyRoles;
  deviceIds: readonly string[];
  includeDevices: boolean;
  unitById?: Record<string, string>;
  periodStats: StatTable;
  hourStats: StatTable;
  dayStats: StatTable;
  fiveStats: StatTable;
  deviceStats: StatTable;
  socStats: StatTable;
}): EnergyStatsResponse {
  const buckets = bucketStarts(input.range, input.range.bucket, input.tz);
  const valuesFor = (ids: readonly string[], kind: UnitKind): Array<number | null> =>
    buckets.map((bucketStart, index) => {
      const bucketEnd = buckets[index + 1] ?? advanceEnd(bucketStart, input.range.bucket, input.tz);
      if (input.range.bucket === "hour") {
        return hourValue(ids, bucketStart, input.now, input.hourStats, input.fiveStats, kind, input.unitById);
      }
      if (containsNow(bucketStart, bucketEnd, input.now)) {
        if (input.range.bucket === "day") {
          return sumOpenDay(ids, bucketStart, bucketEnd, input.now, input.tz, input.hourStats, input.fiveStats, kind, input.unitById);
        }
        return sumOpenMonth(ids, bucketStart, bucketEnd, input.now, input.tz, input.dayStats, input.hourStats, input.fiveStats, kind, input.unitById);
      }
      return sumIdsAt(ids, input.periodStats, bucketStart.getTime(), kind, input.unitById);
    });

  const gridImport = valuesFor(input.roles.gridImport, "energy");
  const gridExport = valuesFor(input.roles.gridExport, "energy");
  const solar = valuesFor(input.roles.solar, "energy");
  const batteryIn = valuesFor(input.roles.batteryIn, "energy");
  const batteryOut = valuesFor(input.roles.batteryOut, "energy");
  const gas = valuesFor(input.roles.gas, "volume");
  const water = valuesFor(input.roles.water, "volume");
  const batterySoc = buckets.map((bucketStart, index) => {
    const bucketEnd = buckets[index + 1] ?? advanceEnd(bucketStart, input.range.bucket, input.tz);
    return meanBetween(input.roles.batterySoc, input.socStats, bucketStart.getTime(), bucketEnd.getTime());
  });

  const response: EnergyStatsResponse = {
    view: input.view,
    tz: input.tz,
    buckets: buckets.map((bucket) => isoWithOffset(bucket, input.tz)),
    series: { gridImport, gridExport, solar, batteryIn, batteryOut, gas, water, batterySoc },
    emptySince: input.roles.batterySoc.length > 0 ? emptySinceFrom(input.roles.batterySoc, input.socStats, input.tz) : null,
    units: ENERGY_UNITS,
  };

  if (input.partial && input.offset === 0) {
    const until = partialUntil(input.view, input.now, input.tz);
    if (until) response.partialFrom = isoWithOffset(until, input.tz);
  }

  if (input.includeDevices) {
    const hours = bucketStarts(input.range, "hour", input.tz);
    const table = input.range.bucket === "hour" ? input.hourStats : input.deviceStats;
    response.devices = {
      hours: hours.map((hour) => isoWithOffset(hour, input.tz)),
      items: input.deviceIds.map((id) => {
        const perHour = hours.map((hour) => hourValue([id], hour, input.now, table, input.fiveStats, "energy", input.unitById));
        const total = round6(perHour.reduce<number>((sum, value) => sum + (value ?? 0), 0));
        return { id, total, perHour };
      }),
    };
  }

  return response;
}

function advanceEnd(start: Date, bucket: PeriodRange["bucket"], tz: string): Date {
  return advanceBucket(start, bucket, tz);
}

function sumOpenMonth(
  ids: readonly string[],
  monthStart: Date,
  monthEnd: Date,
  now: Date,
  tz: string,
  dayStats: StatTable,
  hourStats: StatTable,
  fiveStats: StatTable,
  kind: UnitKind,
  unitById: Record<string, string> | undefined
): number | null {
  const days = bucketStarts({ start: monthStart, end: new Date(Math.min(monthEnd.getTime(), now.getTime() + 1)) }, "day", tz);
  let any = false;
  let sum = 0;
  for (const day of days) {
    const dayEnd = advanceEnd(day, "day", tz);
    if (day.getTime() > now.getTime()) break;
    const value = containsNow(day, dayEnd, now)
      ? sumOpenDay(ids, day, dayEnd, now, tz, hourStats, fiveStats, kind, unitById)
      : sumIdsAt(ids, dayStats, day.getTime(), kind, unitById);
    if (value == null) continue;
    any = true;
    sum += value;
  }
  return any ? round6(sum) : null;
}

function cacheKeyFor(connectionId: string, plan: StatPlan, tz: string): string {
  const extra = `${plan.types.join(",")}|${ENERGY_UNITS.energy}|${ENERGY_UNITS.volume}`;
  return energyCacheKey(connectionId, hashStatisticIds(plan.ids, extra), plan.period, isoWithOffset(plan.start, tz));
}

function commandFor(plan: StatPlan, tz: string): HaWsCommandInput {
  return {
    type: "recorder/statistics_during_period",
    start_time: isoWithOffset(plan.start, tz),
    end_time: isoWithOffset(plan.end, tz),
    statistic_ids: plan.ids,
    period: plan.period,
    types: plan.types,
    units: ENERGY_UNITS,
  };
}

function tableOrEmpty(tables: Map<StatPlan["purpose"], StatTable>, purpose: StatPlan["purpose"]): StatTable {
  return tables.get(purpose) ?? {};
}

const PREFS_FRESH_MS = ENERGY_CACHE_RUNNING_TTL_MS;

type CachedPrefs = {
  model: EnergyModel;
  catalog: string[] | null;
  freshUntil: number;
  staleUntil: number;
};

const prefsCache = new Map<string, CachedPrefs>();

export function clearEnergyPrefsCache(): void {
  prefsCache.clear();
}

function prefsCacheKey(connectionId: string, baseUrl: string): string {
  return `${connectionId}\n${baseUrl}`;
}

function readPrefs(key: string, nowMs: number): CachedPrefs | null {
  const hit = prefsCache.get(key);
  if (!hit || hit.staleUntil <= nowMs) {
    if (hit) prefsCache.delete(key);
    return null;
  }
  return hit;
}

function rememberPrefs(key: string, model: EnergyModel, catalog: string[] | null, nowMs: number): void {
  const prev = prefsCache.get(key);
  prefsCache.set(key, {
    model,
    catalog: catalog ?? prev?.catalog ?? null,
    freshUntil: nowMs + PREFS_FRESH_MS,
    staleUntil: nowMs + ENERGY_CACHE_CLOSED_TTL_MS,
  });
}

type PlannedStats = {
  body: EnergyStatsResponse;
  missing: StatPlan[];
  range: PeriodRange;
  roles: EnergyRoles;
  deviceIds: string[];
};

function assembleStats(
  input: {
    connectionId: string;
    view: EnergyView;
    offset: number;
    partial: boolean;
    manual: string | null;
    devices: string | null;
  },
  model: EnergyModel,
  catalog: readonly string[] | null,
  tz: string,
  now: Date
): PlannedStats {
  const known = new Set(catalog ?? []);
  const manualIds = model.source === "manual" ? selectQueryStatisticIds(input.manual, known) : [];
  const deviceIds = input.devices != null ? selectQueryStatisticIds(input.devices, known) : [];
  const roles = rolesFromModel(model, manualIds);
  const range = periodRange(input.view, input.offset, tz, now);
  const plans = planStatisticRequests({ range, now, tz, roles, deviceIds });
  const tables = new Map<StatPlan["purpose"], StatTable>();
  const missing: StatPlan[] = [];
  for (const plan of plans) {
    const cached = energyStatisticsCache.get(cacheKeyFor(input.connectionId, plan, tz));
    if (cached && typeof cached === "object") tables.set(plan.purpose, cached as StatTable);
    else missing.push(plan);
  }
  const hourStats = tableOrEmpty(tables, "hour");
  const body = buildEnergyStats({
    view: input.view,
    tz,
    range,
    now,
    offset: input.offset,
    partial: input.partial,
    roles,
    deviceIds,
    includeDevices: input.devices != null,
    periodStats: tableOrEmpty(tables, "period"),
    hourStats,
    dayStats: tableOrEmpty(tables, "day"),
    fiveStats: tableOrEmpty(tables, "five"),
    deviceStats: input.view === "day" ? hourStats : tableOrEmpty(tables, "devices"),
    socStats: tableOrEmpty(tables, "soc"),
  });
  return { body, missing, range, roles, deviceIds };
}

function storePlans(connectionId: string, plans: readonly StatPlan[], results: readonly HaWsCommandResult[], tz: string, nowMs: number): void {
  plans.forEach((plan, index) => {
    const result = results[index];
    if (!result || !result.success) {
      const code = result && !result.success ? result.error.code : "error";
      throw new Error(`Statistics unavailable (${code})`);
    }
    energyStatisticsCache.set(
      cacheKeyFor(connectionId, plan, tz),
      parseStatisticsMap(result.result),
      energyCacheTtlMs(plan.start.getTime(), plan.end.getTime(), nowMs)
    );
  });
}

export async function loadEnergyStatistics(input: {
  config: HaTimeZoneConfig;
  connectionId: string;
  view: EnergyView;
  offset: number;
  partial: boolean;
  manual: string | null;
  devices: string | null;
  now?: Date;
}): Promise<EnergyStatsResponse> {
  const now = input.now ?? new Date();
  const nowMs = Date.now();
  const tz = await getHaTimeZone(input.config, nowMs);
  const key = prefsCacheKey(input.connectionId, input.config.baseUrl);
  const cached = readPrefs(key, nowMs);
  const needCatalog = input.manual != null || input.devices != null;

  if (cached && (!needCatalog || cached.catalog)) {
    const ready = assembleStats(input, cached.model, cached.catalog, tz, now);
    if (ready.missing.length === 0) return ready.body;
  }

  const modelIsFresh = Boolean(cached && cached.freshUntil > nowMs);
  let model = cached?.model ?? null;
  let catalog = cached?.catalog ?? null;

  try {
    const first: HaWsCommandInput[] = [];
    if (!modelIsFresh) first.push({ type: "energy/get_prefs" });
    if (needCatalog && !catalog) first.push({ type: "recorder/list_statistic_ids" });

    const takeFirst = (results: readonly HaWsCommandResult[]) => {
      let index = 0;
      if (!modelIsFresh) {
        const prefs = results[index];
        index += 1;
        if (!prefs) throw new Error("Energy prefs unavailable (error)");
        model = energyModelFromCommand(prefs);
      }
      if (needCatalog && !catalog) catalog = [...energyStatisticIdSet(catalogResult(results[index]))];
      if (!model) throw new Error("Energy prefs unavailable (error)");
      rememberPrefs(key, model, catalog, nowMs);
    };

    if (first.length === 0) {
      if (!model) throw new Error("Energy prefs unavailable (error)");
      const planned = assembleStats(input, model, catalog, tz, now);
      if (planned.missing.length > 0) {
        const results = await haWsCommands(
          input.config,
          planned.missing.map((plan) => commandFor(plan, tz))
        );
        storePlans(input.connectionId, planned.missing, results, tz, nowMs);
      }
    } else {
      let missing: StatPlan[] = [];
      const results = await haWsCommands(input.config, first, {
        followUp: (firstResults) => {
          takeFirst(firstResults);
          if (!model) return [];
          missing = assembleStats(input, model, catalog, tz, now).missing;
          return missing.map((plan) => commandFor(plan, tz));
        },
      });
      if (missing.length > 0) storePlans(input.connectionId, missing, results.slice(first.length), tz, nowMs);
    }

    if (!model) throw new Error("Energy prefs unavailable (error)");
    return assembleStats(input, model, catalog, tz, now).body;
  } catch (error) {
    if (cached && (!needCatalog || cached.catalog)) {
      const ready = assembleStats(input, cached.model, cached.catalog, tz, now);
      if (ready.missing.length === 0) return ready.body;
    }
    throw error;
  }
}

function catalogResult(result: HaWsCommandResult | undefined): unknown {
  if (!result || !result.success) return [];
  return result.result;
}

