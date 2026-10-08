"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Home, Leaf, Sun, TowerControl, Zap } from "lucide-react";
import { EnergyEntityBindModal, type EnergyBindEntity } from "@/components/energy/energy-entity-bind-modal";
import { GlassCard } from "@/components/layout/glass-card";
import { useTranslation } from "@/hooks/use-translation";
import {
  displayUnitForEnergy,
  formatEnergyValue,
  hasLinkedEnergyEntities,
  parseHaNumber,
  toKilowatts,
  type EnergyEntityKey,
  type HourlyPoint,
} from "@/lib/energy-dashboard";
import {
  ENERGY_FLOW_DEMO,
  balanceBarWidths,
  energyFlowVisibility,
  formatSignedPercent,
  hubActiveKw,
  normalizeSparkBars,
  readingToKwh,
  readingToKw,
  selfConsumption,
} from "@/lib/energy-flow";
import { cn } from "@/lib/utils";
import { hydrateEnergyStore, useEnergyStore } from "@/stores/energy-store";
import { useEntityStateStore } from "@/stores/entity-state-store";

function useEntityReading(entityId: string) {
  const entity = useEntityStateStore((s) => (entityId ? s.states[entityId] : undefined));
  useEntityStateStore((s) => s.updatedAt);
  const value = parseHaNumber(entity?.state);
  const unit = (entity?.attributes?.unit_of_measurement as string | undefined) ?? "";
  return { value, unit };
}

async function fetchHourlySeries(ids: string[], mode?: "mean"): Promise<Record<string, HourlyPoint[]>> {
  if (ids.length === 0) return {};
  const params = new URLSearchParams({ entity_ids: ids.join(","), granularity: "hourly" });
  if (mode === "mean") params.set("mode", "mean");
  const res = await fetch(`/api/ha/history?${params.toString()}`);
  if (!res.ok) return {};
  return res.json();
}

function SparkBars({ values, colorClass }: { values: number[]; colorClass: string }) {
  const bars = normalizeSparkBars(values);
  return (
    <div className="flex h-10 items-end gap-0.5" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className={cn("w-1.5 min-h-[2px] flex-1 rounded-sm opacity-90", colorClass)}
          style={{ height: `${Math.max(8, h * 100)}%` }}
        />
      ))}
    </div>
  );
}

function Donut({ pct, color = "#22c55e" }: { pct: number; color?: string }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = c * (1 - clamped / 100);
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" className="shrink-0" aria-hidden>
      <circle cx="26" cy="26" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-black/5 dark:text-white/10" />
      <circle
        cx="26"
        cy="26"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 26 26)"
        className="transition-[stroke-dashoffset] duration-500"
      />
      <text x="26" y="28" textAnchor="middle" className="fill-gray-900 text-[10px] font-semibold dark:fill-white">
        {clamped}%
      </text>
    </svg>
  );
}

function KpiCard({
  title,
  value,
  unit,
  subtitle,
  trend,
  trendPositiveIsGood = true,
  spark,
  sparkColor,
  donutPct,
  editMode,
  linked,
  onBind,
  icon,
  iconTone,
}: {
  title: string;
  value: string;
  unit?: string;
  subtitle: string;
  trend?: number;
  trendPositiveIsGood?: boolean;
  spark?: number[];
  sparkColor?: string;
  donutPct?: number;
  editMode?: boolean;
  linked?: boolean;
  onBind?: () => void;
  icon: React.ReactNode;
  iconTone: string;
}) {
  const { t } = useTranslation();
  const trendGood =
    trend == null ? null : trendPositiveIsGood ? trend >= 0 : trend <= 0;
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("flex h-8 w-8 items-center justify-center rounded-xl", iconTone)}>{icon}</span>
            <p className="text-sm font-medium text-gray-600 dark:text-white/70">{title}</p>
          </div>
          <p className="mt-3 flex items-baseline gap-1.5 text-[1.85rem] font-semibold tracking-tight text-gray-900 dark:text-white">
            <span className="tabular-nums">{value}</span>
            {unit ? <span className="text-sm font-medium text-gray-400 dark:text-white/40">{unit}</span> : null}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-white/45">{subtitle}</p>
          {trend != null ? (
            <p
              className={cn(
                "mt-2 text-xs font-medium",
                trendGood ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              )}
            >
              {formatSignedPercent(trend)} {t("energy.flow.vsYesterday")}
            </p>
          ) : editMode && !linked ? (
            <p className="mt-2 text-xs font-medium text-brand">{t("energy.overview.tapToLink")}</p>
          ) : null}
        </div>
        <div className="shrink-0 pt-1">
          {donutPct != null ? <Donut pct={donutPct} /> : spark ? <SparkBars values={spark} colorClass={sparkColor ?? "bg-emerald-400"} /> : null}
        </div>
      </div>
    </>
  );

  if (editMode && onBind) {
    return (
      <button
        type="button"
        onClick={onBind}
        className={cn(
          "glass-card w-full rounded-2xl border border-white/60 p-4 text-left transition-shadow hover:shadow-lg dark:border-white/10",
          !linked && "ring-1 ring-dashed ring-brand/40"
        )}
      >
        {body}
      </button>
    );
  }

  return (
    <GlassCard className="rounded-2xl p-4">
      {body}
    </GlassCard>
  );
}

function FlowScene({
  solarActive,
  importActive,
  exportActive,
  hubValue,
  hubUnit,
  importLabel,
  importValue,
  exportLabel,
  exportValue,
  editMode,
  onBindImport,
  onBindExport,
  importLinked,
  exportLinked,
}: {
  solarActive: boolean;
  importActive: boolean;
  exportActive: boolean;
  hubValue: string;
  hubUnit: string;
  importLabel: string;
  importValue: string;
  exportLabel: string;
  exportValue: string;
  editMode?: boolean;
  onBindImport?: () => void;
  onBindExport?: () => void;
  importLinked?: boolean;
  exportLinked?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-xl" data-energy-flow-scene>
      {/* Transparent center — house comes from page background; SVG flows sit on top */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 400 320"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        {/* Solar roof → hub (green) */}
        <path
          d="M200 48 C200 90 200 120 200 158"
          fill="none"
          stroke="#22c55e"
          strokeWidth="3"
          strokeLinecap="round"
          opacity={solarActive ? 0.35 : 0.12}
        />
        {solarActive ? (
          <path
            d="M200 48 C200 90 200 120 200 158"
            fill="none"
            stroke="#4ade80"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="energy-flow-dash energy-flow-dash-down"
            style={{ filter: "drop-shadow(0 0 4px rgba(74,222,128,0.85))" }}
          />
        ) : null}

        {/* Afname (left) → hub (blue) */}
        <path
          d="M110 175 C145 175 165 168 188 160"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          opacity={importActive ? 0.35 : 0.12}
        />
        {importActive ? (
          <path
            d="M110 175 C145 175 165 168 188 160"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="energy-flow-dash energy-flow-dash-to-hub"
            style={{ filter: "drop-shadow(0 0 4px rgba(96,165,250,0.85))" }}
          />
        ) : null}

        {/* Hub → Teruglevering (yellow) */}
        <path
          d="M212 160 C235 168 255 175 290 175"
          fill="none"
          stroke="#eab308"
          strokeWidth="3"
          strokeLinecap="round"
          opacity={exportActive ? 0.35 : 0.12}
        />
        {exportActive ? (
          <path
            d="M212 160 C235 168 255 175 290 175"
            fill="none"
            stroke="#facc15"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="energy-flow-dash energy-flow-dash-from-hub"
            style={{ filter: "drop-shadow(0 0 4px rgba(250,204,21,0.85))" }}
          />
        ) : null}
      </svg>

      {/* Hub */}
      <div className="absolute left-1/2 top-[48%] z-10 flex w-[7.5rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-zinc-950 px-3 py-4 text-center shadow-xl ring-2 ring-white/20 dark:ring-white/10">
        <Zap
          className={cn(
            "mb-1 h-5 w-5",
            solarActive || importActive || exportActive
              ? "text-emerald-400 energy-flow-hub-pulse"
              : "text-emerald-400/50"
          )}
          aria-hidden
        />
        <p className="text-lg font-semibold tabular-nums leading-none text-white">
          {hubValue}
          <span className="ml-1 text-[10px] font-medium text-white/50">{hubUnit}</span>
        </p>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-white/45">
          {t("energy.flow.nowActive")}
        </p>
      </div>

      {/* Afname pill */}
      <div className="absolute left-[2%] top-[52%] z-10 max-w-[10.5rem]">
        {editMode && onBindImport ? (
          <button
            type="button"
            onClick={onBindImport}
            className={cn(
              "flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 shadow-md ring-1 backdrop-blur-md dark:bg-black/45",
              importLinked ? "ring-black/5 dark:ring-white/15" : "ring-dashed ring-brand/50"
            )}
          >
            <Home className="h-4 w-4 shrink-0 text-sky-500" aria-hidden />
            <div className="min-w-0 text-left">
              <p className="text-[10px] font-medium text-gray-500 dark:text-white/50">{importLabel}</p>
              <p className="text-sm font-semibold tabular-nums text-gray-900 dark:text-white">{importValue}</p>
            </div>
          </button>
        ) : (
          <div className="pointer-events-none flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 shadow-md ring-1 ring-black/5 backdrop-blur-md dark:bg-black/45 dark:ring-white/15">
            <Home className="h-4 w-4 shrink-0 text-sky-500" aria-hidden />
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-gray-500 dark:text-white/50">{importLabel}</p>
              <p className="text-sm font-semibold tabular-nums text-gray-900 dark:text-white">{importValue}</p>
            </div>
          </div>
        )}
      </div>

      {/* Teruglevering pill */}
      <div className="absolute right-[2%] top-[52%] z-10 max-w-[11rem]">
        {editMode && onBindExport ? (
          <button
            type="button"
            onClick={onBindExport}
            className={cn(
              "flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 shadow-md ring-1 backdrop-blur-md dark:bg-black/45",
              exportLinked ? "ring-black/5 dark:ring-white/15" : "ring-dashed ring-brand/50"
            )}
          >
            <TowerControl className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
            <div className="min-w-0 text-left">
              <p className="text-[10px] font-medium text-gray-500 dark:text-white/50">{exportLabel}</p>
              <p className="text-sm font-semibold tabular-nums text-gray-900 dark:text-white">{exportValue}</p>
            </div>
          </button>
        ) : (
          <div className="pointer-events-none flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 shadow-md ring-1 ring-black/5 backdrop-blur-md dark:bg-black/45 dark:ring-white/15">
            <TowerControl className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-gray-500 dark:text-white/50">{exportLabel}</p>
              <p className="text-sm font-semibold tabular-nums text-gray-900 dark:text-white">{exportValue}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniBarChart({
  title,
  totalLabel,
  values,
  colorClass,
  barClass,
}: {
  title: string;
  totalLabel: string;
  values: number[];
  colorClass: string;
  barClass: string;
}) {
  const bars = normalizeSparkBars(values, 16);
  return (
    <GlassCard className="rounded-2xl p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
          <p className={cn("mt-0.5 text-xs font-medium", colorClass)}>{totalLabel}</p>
        </div>
        <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[10px] font-medium text-gray-500 dark:bg-white/10 dark:text-white/50">
          {/* range label filled by parent via title context */}
        </span>
      </div>
      <div className="flex h-24 items-end gap-1">
        {bars.map((h, i) => (
          <span
            key={i}
            className={cn("min-h-[3px] flex-1 rounded-t-sm", barClass)}
            style={{ height: `${Math.max(6, h * 100)}%` }}
            aria-hidden
          />
        ))}
      </div>
    </GlassCard>
  );
}

function BalanceCard({
  solar,
  consumption,
  exported,
  imported,
  rangeLabel,
}: {
  solar: number;
  consumption: number;
  exported: number;
  imported: number;
  rangeLabel: string;
}) {
  const { t } = useTranslation();
  const widths = balanceBarWidths({
    solar,
    consumption,
    export: exported,
    import: imported,
  });
  const rows = [
    { label: t("energy.flow.balanceGenerated"), value: solar, width: widths.solar, bar: "bg-emerald-400" },
    { label: t("energy.flow.balanceConsumed"), value: consumption, width: widths.consumption, bar: "bg-sky-400" },
    { label: t("energy.flow.balanceExported"), value: exported, width: widths.export, bar: "bg-amber-400" },
    { label: t("energy.flow.balanceImported"), value: imported, width: widths.import, bar: "bg-gray-400 dark:bg-gray-500" },
  ];

  return (
    <GlassCard className="rounded-2xl p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{t("energy.flow.balanceTitle")}</p>
        <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[10px] font-medium text-gray-500 dark:bg-white/10 dark:text-white/50">
          {rangeLabel}
        </span>
      </div>
      <ul className="space-y-3">
        {rows.map((row) => (
          <li key={row.label}>
            <div className="mb-1 flex items-center justify-between gap-2 text-xs">
              <span className="font-medium text-gray-600 dark:text-white/65">{row.label}</span>
              <span className="tabular-nums font-semibold text-gray-900 dark:text-white">
                {formatEnergyValue(row.value, 2)} kWh
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/[0.05] dark:bg-white/10">
              <div
                className={cn("h-full rounded-full transition-[width] duration-500", row.bar)}
                style={{ width: `${Math.max(4, row.width * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

export function EnergyFlowOverview({
  editMode = false,
  haEntities = [],
}: {
  editMode?: boolean;
  haEntities?: EnergyBindEntity[];
}) {
  const { t } = useTranslation();
  const [bindKey, setBindKey] = useState<EnergyEntityKey | null>(null);
  useEffect(() => {
    hydrateEnergyStore();
  }, []);

  const entities = useEnergyStore((s) => s.entities);
  const panelTempEntityIds = useEnergyStore((s) => s.panelTempEntityIds);
  const linked = hasLinkedEnergyEntities(entities, panelTempEntityIds);
  const requestRefresh = useEntityStateStore((s) => s.requestRefresh);

  useEffect(() => {
    requestRefresh();
  }, [requestRefresh, entities]);

  const yieldReading = useEntityReading(entities.solarYieldTodayEntityId);
  const powerReading = useEntityReading(entities.solarPowerEntityId);
  const exportReading = useEntityReading(entities.gridExportEntityId);
  const importReading = useEntityReading(entities.consumptionEntityId);
  const homeReading = useEntityReading(entities.homeConsumptionEntityId);

  const solarKw = readingToKw(powerReading.value, powerReading.unit);
  const importKw = readingToKw(importReading.value, importReading.unit);
  const homeKw = readingToKw(homeReading.value, homeReading.unit);

  const exportIsPower = displayUnitForEnergy(exportReading.unit) === "kW";
  const exportKw = exportIsPower ? readingToKw(exportReading.value, exportReading.unit) : undefined;
  const exportTodayFromSensor = !exportIsPower
    ? readingToKwh(exportReading.value, exportReading.unit)
    : undefined;
  const solarTodayFromSensor = readingToKwh(yieldReading.value, yieldReading.unit);

  const useDemo = !linked;

  const powers = useMemo(
    () => ({
      solarKw: useDemo ? ENERGY_FLOW_DEMO.solarKw : solarKw,
      importKw: useDemo ? ENERGY_FLOW_DEMO.importKw : importKw,
      exportKw: useDemo ? ENERGY_FLOW_DEMO.exportKw : exportKw,
      homeKw: useDemo ? ENERGY_FLOW_DEMO.homeKw : homeKw,
    }),
    [useDemo, solarKw, importKw, exportKw, homeKw]
  );

  const visibility = energyFlowVisibility(powers);
  const hubKw = hubActiveKw(powers);

  const historyIds = useMemo(() => {
    const ids: string[] = [];
    if (entities.solarPowerEntityId) ids.push(entities.solarPowerEntityId);
    if (entities.homeConsumptionEntityId) ids.push(entities.homeConsumptionEntityId);
    if (entities.gridExportEntityId && exportIsPower) ids.push(entities.gridExportEntityId);
    if (entities.consumptionEntityId) ids.push(entities.consumptionEntityId);
    return ids;
  }, [entities, exportIsPower]);

  const { data: hourly } = useQuery({
    queryKey: ["energy-flow-hourly", historyIds.join(",")],
    enabled: historyIds.length > 0 && !useDemo,
    queryFn: () => fetchHourlySeries(historyIds, "mean"),
    staleTime: 60_000,
  });

  const solarSpark = useDemo
    ? [...ENERGY_FLOW_DEMO.solarSpark]
    : (hourly?.[entities.solarPowerEntityId]?.map((p) => p.value) ?? [...ENERGY_FLOW_DEMO.solarSpark]);
  const consumptionSpark = useDemo
    ? [...ENERGY_FLOW_DEMO.consumptionSpark]
    : (hourly?.[entities.homeConsumptionEntityId || entities.consumptionEntityId]?.map((p) => p.value) ??
      [...ENERGY_FLOW_DEMO.consumptionSpark]);
  const exportSpark = useDemo
    ? [...ENERGY_FLOW_DEMO.exportSpark]
    : exportIsPower && entities.gridExportEntityId
      ? (hourly?.[entities.gridExportEntityId]?.map((p) => p.value) ?? [...ENERGY_FLOW_DEMO.exportSpark])
      : [...ENERGY_FLOW_DEMO.exportSpark];

  // Today totals: prefer energy sensors; else approximate from mean hourly power (kWh ≈ mean kW * hours-so-far)
  const hoursSoFar = Math.max(1, new Date().getHours() + new Date().getMinutes() / 60);
  const approxFromSpark = (values: number[], unitHint?: string) => {
    if (!values.length) return undefined;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const kw = toKilowatts(mean, unitHint ?? "kW");
    return kw * hoursSoFar;
  };

  const solarToday =
    solarTodayFromSensor ??
    (useDemo ? ENERGY_FLOW_DEMO.solarTodayKwh : approxFromSpark(solarSpark, powerReading.unit));
  const exportToday =
    exportTodayFromSensor ??
    (useDemo ? ENERGY_FLOW_DEMO.exportTodayKwh : approxFromSpark(exportSpark, exportReading.unit));
  const consumptionToday = useDemo
    ? ENERGY_FLOW_DEMO.consumptionTodayKwh
    : approxFromSpark(consumptionSpark, homeReading.unit || importReading.unit) ??
      ENERGY_FLOW_DEMO.consumptionTodayKwh;
  const importToday = useDemo
    ? ENERGY_FLOW_DEMO.importTodayKwh
    : approxFromSpark(
        hourly?.[entities.consumptionEntityId]?.map((p) => p.value) ?? [],
        importReading.unit
      ) ?? Math.max(0, (consumptionToday ?? 0) - Math.max(0, (solarToday ?? 0) - (exportToday ?? 0)));

  const self = useDemo
    ? { selfConsumedKwh: ENERGY_FLOW_DEMO.selfConsumedKwh, pct: ENERGY_FLOW_DEMO.selfConsumptionPct }
    : selfConsumption({
        solarTodayKwh: solarToday,
        exportTodayKwh: exportToday,
        consumptionTodayKwh: consumptionToday,
      });

  const trends = useDemo
    ? ENERGY_FLOW_DEMO.vsYesterday
    : { solar: undefined as number | undefined, consumption: undefined, export: undefined };

  const hubDisplay = useDemo
    ? { value: formatEnergyValue(ENERGY_FLOW_DEMO.importTodayKwh, 2), unit: "kWh" }
    : hubKw != null
      ? { value: formatEnergyValue(hubKw, 2), unit: "kW" }
      : importToday != null
        ? { value: formatEnergyValue(importToday, 2), unit: "kWh" }
        : { value: "—", unit: "" };

  const importPillValue = useDemo
    ? `${formatEnergyValue(ENERGY_FLOW_DEMO.importTodayKwh, 2)} kWh`
    : importKw != null
      ? `${formatEnergyValue(importKw, 2)} kW`
      : importToday != null
        ? `${formatEnergyValue(importToday, 2)} kWh`
        : editMode
          ? t("energy.overview.tapToLink")
          : "—";

  const exportPillValue = useDemo
    ? `${formatEnergyValue(ENERGY_FLOW_DEMO.exportTodayKwh, 2)} kWh`
    : exportKw != null
      ? `${formatEnergyValue(exportKw, 2)} kW`
      : exportToday != null
        ? `${formatEnergyValue(exportToday, 2)} kWh`
        : editMode
          ? t("energy.overview.tapToLink")
          : "—";

  const rangeLabel = t("energy.flow.today");

  return (
    <div className="relative z-[1] mx-auto w-full max-w-[90rem] px-3 pb-10 sm:px-5" data-energy-flow-overview>
      <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,1.35fr)_minmax(0,1fr)] lg:gap-5">
        <div className="order-2 flex flex-col gap-4 lg:order-1">
          <div className="card-plot-in card-plot-played">
            <KpiCard
              title={t("energy.flow.solarTitle")}
              value={formatEnergyValue(solarToday, 1)}
              unit="kWh"
              subtitle={t("energy.flow.solarSubtitle")}
              trend={trends.solar}
              spark={solarSpark}
              sparkColor="bg-emerald-400"
              editMode={editMode}
              linked={Boolean(entities.solarYieldTodayEntityId || entities.solarPowerEntityId)}
              onBind={() => setBindKey("solarYieldTodayEntityId")}
              icon={<Sun className="h-4 w-4 text-amber-500" aria-hidden />}
              iconTone="bg-amber-400/15"
            />
          </div>
          <div className="card-plot-in card-plot-played" style={{ animationDelay: "60ms" }}>
            <KpiCard
              title={t("energy.flow.consumptionTitle")}
              value={formatEnergyValue(consumptionToday, 2)}
              unit="kWh"
              subtitle={t("energy.flow.consumptionSubtitle")}
              trend={trends.consumption}
              trendPositiveIsGood={false}
              spark={consumptionSpark}
              sparkColor="bg-sky-400"
              editMode={editMode}
              linked={Boolean(entities.homeConsumptionEntityId || entities.consumptionEntityId)}
              onBind={() => setBindKey("homeConsumptionEntityId")}
              icon={<Home className="h-4 w-4 text-sky-500" aria-hidden />}
              iconTone="bg-sky-400/15"
            />
          </div>
        </div>

        <div className="order-1 card-plot-in card-plot-played lg:order-2">
          <FlowScene
            solarActive={visibility.solar}
            importActive={visibility.import}
            exportActive={visibility.export}
            hubValue={hubDisplay.value}
            hubUnit={hubDisplay.unit}
            importLabel={t("energy.flow.import")}
            importValue={importPillValue}
            exportLabel={t("energy.flow.export")}
            exportValue={exportPillValue}
            editMode={editMode}
            importLinked={Boolean(entities.consumptionEntityId)}
            exportLinked={Boolean(entities.gridExportEntityId)}
            onBindImport={() => setBindKey("consumptionEntityId")}
            onBindExport={() => setBindKey("gridExportEntityId")}
          />
          {!linked && !editMode ? (
            <p className="mt-2 text-center text-[11px] text-gray-500 dark:text-white/40">
              {t("energy.flow.demoHint")}
            </p>
          ) : null}
        </div>

        <div className="order-3 flex flex-col gap-4">
          <div className="card-plot-in card-plot-played" style={{ animationDelay: "80ms" }}>
            <KpiCard
              title={t("energy.flow.exportTitle")}
              value={formatEnergyValue(exportToday, 2)}
              unit="kWh"
              subtitle={t("energy.flow.exportSubtitle")}
              trend={trends.export}
              trendPositiveIsGood
              spark={exportSpark}
              sparkColor="bg-amber-400"
              editMode={editMode}
              linked={Boolean(entities.gridExportEntityId)}
              onBind={() => setBindKey("gridExportEntityId")}
              icon={<TowerControl className="h-4 w-4 text-amber-500" aria-hidden />}
              iconTone="bg-amber-400/15"
            />
          </div>
          <div className="card-plot-in card-plot-played" style={{ animationDelay: "120ms" }}>
            <KpiCard
              title={t("energy.flow.selfTitle")}
              value={formatEnergyValue(self.pct ?? ENERGY_FLOW_DEMO.selfConsumptionPct, 0)}
              unit="%"
              subtitle={t("energy.flow.selfSubtitle")
                .replace("{used}", formatEnergyValue(self.selfConsumedKwh ?? ENERGY_FLOW_DEMO.selfConsumedKwh, 1))
                .replace("{total}", formatEnergyValue(solarToday ?? ENERGY_FLOW_DEMO.solarTodayKwh, 1))}
              donutPct={self.pct ?? ENERGY_FLOW_DEMO.selfConsumptionPct}
              editMode={editMode}
              linked={Boolean(entities.solarYieldTodayEntityId)}
              onBind={() => setBindKey("solarYieldTodayEntityId")}
              icon={<Leaf className="h-4 w-4 text-emerald-500" aria-hidden />}
              iconTone="bg-emerald-400/15"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card-plot-in card-plot-played">
          <MiniBarChart
            title={t("energy.flow.chartGeneration")}
            totalLabel={`${formatEnergyValue(solarToday, 1)} kWh`}
            values={solarSpark}
            colorClass="text-emerald-600 dark:text-emerald-400"
            barClass="bg-emerald-400/90"
          />
        </div>
        <div className="card-plot-in card-plot-played" style={{ animationDelay: "40ms" }}>
          <MiniBarChart
            title={t("energy.flow.chartConsumption")}
            totalLabel={`${formatEnergyValue(consumptionToday, 2)} kWh`}
            values={consumptionSpark}
            colorClass="text-sky-600 dark:text-sky-400"
            barClass="bg-sky-400/90"
          />
        </div>
        <div className="card-plot-in card-plot-played" style={{ animationDelay: "80ms" }}>
          <MiniBarChart
            title={t("energy.flow.chartExport")}
            totalLabel={`${formatEnergyValue(exportToday, 2)} kWh`}
            values={exportSpark}
            colorClass="text-amber-600 dark:text-amber-400"
            barClass="bg-amber-400/90"
          />
        </div>
        <div className="card-plot-in card-plot-played" style={{ animationDelay: "120ms" }}>
          <BalanceCard
            solar={solarToday ?? 0}
            consumption={consumptionToday ?? 0}
            exported={exportToday ?? 0}
            imported={importToday ?? 0}
            rangeLabel={rangeLabel}
          />
        </div>
      </div>

      {bindKey ? (
        <EnergyEntityBindModal fieldKey={bindKey} haEntities={haEntities} onClose={() => setBindKey(null)} />
      ) : null}
    </div>
  );
}
