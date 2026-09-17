export type EnergyEntityKey =
  | "solarYieldTodayEntityId"
  | "solarPowerEntityId"
  | "gridExportEntityId"
  | "consumptionEntityId"
  | "batterySocEntityId"
  | "batteryPowerEntityId"
  | "batteryTempEntityId";

export type EnergyEntities = Record<EnergyEntityKey, string>;

export const ENERGY_ENTITY_KEYS: EnergyEntityKey[] = [
  "solarYieldTodayEntityId",
  "solarPowerEntityId",
  "gridExportEntityId",
  "consumptionEntityId",
  "batterySocEntityId",
  "batteryPowerEntityId",
  "batteryTempEntityId",
];

export const EMPTY_ENERGY_ENTITIES: EnergyEntities = {
  solarYieldTodayEntityId: "",
  solarPowerEntityId: "",
  gridExportEntityId: "",
  consumptionEntityId: "",
  batterySocEntityId: "",
  batteryPowerEntityId: "",
  batteryTempEntityId: "",
};

export type EnergySensorKind = "energy" | "power" | "battery" | "temperature";

export type EnergyEntityField = {
  key: EnergyEntityKey;
  kind: EnergySensorKind;
  group: "solar" | "grid" | "battery";
  labelKey: string;
  hintKey: string;
};

export const ENERGY_ENTITY_FIELDS: EnergyEntityField[] = [
  {
    key: "solarYieldTodayEntityId",
    kind: "energy",
    group: "solar",
    labelKey: "settings.energy.solarYieldToday",
    hintKey: "settings.energy.solarYieldTodayHint",
  },
  {
    key: "solarPowerEntityId",
    kind: "power",
    group: "solar",
    labelKey: "settings.energy.solarPower",
    hintKey: "settings.energy.solarPowerHint",
  },
  {
    key: "gridExportEntityId",
    kind: "energy",
    group: "grid",
    labelKey: "settings.energy.gridExport",
    hintKey: "settings.energy.gridExportHint",
  },
  {
    key: "consumptionEntityId",
    kind: "power",
    group: "grid",
    labelKey: "settings.energy.consumption",
    hintKey: "settings.energy.consumptionHint",
  },
  {
    key: "batterySocEntityId",
    kind: "battery",
    group: "battery",
    labelKey: "settings.energy.batterySoc",
    hintKey: "settings.energy.batterySocHint",
  },
  {
    key: "batteryPowerEntityId",
    kind: "power",
    group: "battery",
    labelKey: "settings.energy.batteryPower",
    hintKey: "settings.energy.batteryPowerHint",
  },
  {
    key: "batteryTempEntityId",
    kind: "temperature",
    group: "battery",
    labelKey: "settings.energy.batteryTemp",
    hintKey: "settings.energy.batteryTempHint",
  },
];

type NamedEntity = {
  entity_id: string;
  attributes?: Record<string, unknown>;
};

export function parseEnergyEntities(raw: unknown): EnergyEntities {
  const source =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  const next = { ...EMPTY_ENERGY_ENTITIES };
  for (const key of ENERGY_ENTITY_KEYS) {
    const value = source[key];
    next[key] = typeof value === "string" ? value.trim() : "";
  }
  return next;
}

export function parseEntityIdList(raw: unknown): string[] {
  if (typeof raw === "string") {
    try {
      return parseEntityIdList(JSON.parse(raw));
    } catch {
      return raw.trim() ? [raw.trim()] : [];
    }
  }
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const id = item.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

export function hasLinkedEnergyEntities(entities: EnergyEntities, panelTempEntityIds: string[] = []): boolean {
  return ENERGY_ENTITY_KEYS.some((key) => Boolean(entities[key])) || panelTempEntityIds.length > 0;
}

export function linkedEnergyEntityIds(entities: EnergyEntities, panelTempEntityIds: string[] = []): string[] {
  const ids = ENERGY_ENTITY_KEYS.map((key) => entities[key]).filter(Boolean);
  return parseEntityIdList([...ids, ...panelTempEntityIds]);
}

export function parseHaNumber(state?: string | null): number | undefined {
  if (state == null || state === "" || state === "unavailable" || state === "unknown") return undefined;
  const n = Number(state);
  return Number.isFinite(n) ? n : undefined;
}

export function normalizeUnit(unit?: string | null): string {
  return (unit ?? "").trim().toLowerCase().replace("°", "");
}

export function toKilowatts(value: number, unit?: string | null): number {
  return normalizeUnit(unit) === "w" ? value / 1000 : value;
}

export function toKwh(value: number, unit?: string | null): number {
  return normalizeUnit(unit) === "wh" ? value / 1000 : value;
}

export function displayUnitForPower(_unit?: string | null): "kW" {
  return "kW";
}

export function displayUnitForEnergy(unit?: string | null): "kWh" | "kW" {
  const u = normalizeUnit(unit);
  if (u === "w" || u === "kw") return "kW";
  return "kWh";
}

export function formatEnergyValue(value: number | undefined, digits = 1): string {
  if (value == null || Number.isNaN(value)) return "—";
  const factor = 10 ** digits;
  const rounded = Math.round(value * factor) / factor;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(digits);
}

export function energyImpact(kwh: number | undefined): {
  carbonKg: number | undefined;
  trees: number | undefined;
  homes: number | undefined;
} {
  if (kwh == null || kwh <= 0) {
    return { carbonKg: undefined, trees: undefined, homes: undefined };
  }
  const carbonKg = kwh * 0.37;
  return {
    carbonKg,
    trees: carbonKg / 21,
    homes: kwh / 9,
  };
}

export type EnergyAlert = { key: "energy.overview.alertBatteryLow" | "energy.overview.alertBatteryHot"; level: "warn" | "hot" };

export function energyAlerts(input: { batteryPct?: number; batteryTempC?: number }): EnergyAlert[] {
  const alerts: EnergyAlert[] = [];
  if (input.batteryPct != null && input.batteryPct <= 15) {
    alerts.push({ key: "energy.overview.alertBatteryLow", level: "warn" });
  }
  if (input.batteryTempC != null && input.batteryTempC >= 50) {
    alerts.push({ key: "energy.overview.alertBatteryHot", level: "hot" });
  }
  return alerts;
}

export function clampPercent(value: number | undefined, max = 100): number {
  if (value == null || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(max, value));
}

export type HeatmapTone = "hot" | "warm" | "idle";

export function heatmapTones(values: Array<number | undefined>): HeatmapTone[] {
  const nums = values.filter((v): v is number => v != null && Number.isFinite(v));
  if (nums.length === 0) return values.map(() => "idle");
  const max = Math.max(40, ...nums);
  const min = Math.min(20, ...nums);
  const span = Math.max(1, max - min);
  return values.map((v) => {
    if (v == null || Number.isNaN(v)) return "idle";
    const t = (v - min) / span;
    if (t > 0.75) return "hot";
    if (t > 0.4) return "warm";
    return "idle";
  });
}

export type HourlyPoint = { hour: string; value: number };
export type EnergyHourlyRow = { hour: string; generation: number; consumption: number; export: number };

export function mergeHourlySeries(
  series: Record<string, HourlyPoint[]>,
  keys: { generation?: string; consumption?: string; export?: string }
): EnergyHourlyRow[] {
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
  const pick = (id: string | undefined) => {
    const map = new Map<string, number>();
    if (!id) return map;
    for (const point of series[id] ?? []) {
      map.set(point.hour, point.value);
    }
    return map;
  };
  const generation = pick(keys.generation);
  const consumption = pick(keys.consumption);
  const exported = pick(keys.export);
  return hours.map((hour) => ({
    hour,
    generation: generation.get(hour) ?? 0,
    consumption: consumption.get(hour) ?? 0,
    export: exported.get(hour) ?? 0,
  }));
}

function entityDomain(entityId: string): string {
  return entityId.split(".")[0] ?? "";
}

export function isEnergyCandidate(entity: NamedEntity): boolean {
  const domain = entityDomain(entity.entity_id);
  return domain === "sensor" || domain === "number";
}

function entityUnit(entity: NamedEntity): string {
  return normalizeUnit(entity.attributes?.unit_of_measurement as string | undefined);
}

function entityDeviceClass(entity: NamedEntity): string {
  return String(entity.attributes?.device_class ?? "").toLowerCase();
}

function entityHaystack(entity: NamedEntity): string {
  const name = String(entity.attributes?.friendly_name ?? "").toLowerCase();
  return `${entity.entity_id.toLowerCase()} ${name}`;
}

export function matchesEnergySensorKind(entity: NamedEntity, kind: EnergySensorKind): boolean {
  if (!isEnergyCandidate(entity)) return false;
  const unit = entityUnit(entity);
  const deviceClass = entityDeviceClass(entity);
  const hay = entityHaystack(entity);

  switch (kind) {
    case "energy":
      return deviceClass === "energy" || unit === "kwh" || unit === "wh" || /energy|yield|opbrengst|export|teruglever/.test(hay);
    case "power":
      return deviceClass === "power" || unit === "w" || unit === "kw" || /power|vermogen|watt|output/.test(hay);
    case "battery":
      return (
        deviceClass === "battery" ||
        ((unit === "%" || deviceClass === "") && /battery|batterij|soc|charge/.test(hay))
      );
    case "temperature":
      return deviceClass === "temperature" || unit === "c" || unit === "f" || /temp|paneel|panel/.test(hay);
  }
}

export function entityLabel(entity: NamedEntity): string {
  const name = entity.attributes?.friendly_name;
  return typeof name === "string" && name.trim() ? name : entity.entity_id;
}

export function filterEnergySensors(
  entities: NamedEntity[],
  kind: EnergySensorKind,
  selectedId = ""
): NamedEntity[] {
  const matched = entities
    .filter((entity) => matchesEnergySensorKind(entity, kind))
    .sort((a, b) => entityLabel(a).localeCompare(entityLabel(b), undefined, { sensitivity: "base" }));

  if (selectedId && !matched.some((entity) => entity.entity_id === selectedId)) {
    const extra = entities.find((entity) => entity.entity_id === selectedId);
    if (extra) matched.unshift(extra);
  }

  if (matched.length > 0) return matched;

  const fallback = entities
    .filter(isEnergyCandidate)
    .sort((a, b) => entityLabel(a).localeCompare(entityLabel(b), undefined, { sensitivity: "base" }));
  if (selectedId && !fallback.some((entity) => entity.entity_id === selectedId)) {
    const extra = entities.find((entity) => entity.entity_id === selectedId);
    if (extra) fallback.unshift(extra);
  }
  return fallback;
}
