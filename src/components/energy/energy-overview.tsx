"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Settings2 } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useTranslation } from "@/hooks/use-translation";
import {
  ENERGY_OVERVIEW_HOUSE_IMAGE,
  clampPercent,
  displayUnitForEnergy,
  formatEnergyValue,
  formatHourTick,
  hasEnergyReading,
  hasLinkedEnergyEntities,
  heatmapTones,
  mergeDatedSeries,
  mergeHourlySeries,
  parseHaNumber,
  seriesStats,
  shouldShowBatteryCard,
  shouldShowHeatmap,
  toKilowatts,
  toKwh,
  type EnergyChartRange,
  type HeatmapTone,
} from "@/lib/energy-dashboard";
import { cn } from "@/lib/utils";
import { hydrateEnergyStore, useEnergyStore } from "@/stores/energy-store";
import { useEntityStateStore } from "@/stores/entity-state-store";

function Stat({
  label,
  value,
  unit,
  hint,
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-400 dark:text-white/45">{label}</p>
      <p className="mt-1 flex items-baseline gap-1 text-[1.85rem] font-semibold tracking-tight text-gray-900 dark:text-white">
        {value}
        {unit ? <span className="text-sm font-medium text-gray-400 dark:text-white/40">{unit}</span> : null}
      </p>
      {hint ? <p className="mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">{hint}</p> : null}
    </div>
  );
}

function HouseScene({
  image,
  toolbar,
}: {
  image?: string | null;
  toolbar: ReactNode;
}) {
  const custom = Boolean(image?.trim());
  const src = image?.trim() || ENERGY_OVERVIEW_HOUSE_IMAGE;
  return (
    <div className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={cn(
          "relative z-0 mx-auto h-auto w-full",
          custom ? "min-h-[24rem] object-cover object-top" : "max-h-[34rem] object-contain object-center"
        )}
      />
      {custom ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent dark:from-black" />
      ) : null}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">{toolbar}</div>
    </div>
  );
}

function PowerGauge({
  valueLabel,
  percent,
  minLabel,
  maxLabel,
  avgLabel,
  t,
}: {
  valueLabel: string;
  percent: number;
  minLabel: string;
  maxLabel: string;
  avgLabel: string;
  t: (key: string) => string;
}) {
  const ticks = 52;
  const filled = Math.round((percent / 100) * ticks);
  return (
    <div>
      <p className="text-sm font-medium text-gray-800 dark:text-white">{t("energy.overview.power")}</p>
      <div className="relative mx-auto mt-2 h-40 w-40">
        {Array.from({ length: ticks }, (_, i) => {
          const angle = -90 + (i / ticks) * 360;
          return (
            <span
              key={i}
              className={cn(
                "absolute left-1/2 top-1/2 h-2.5 w-[2px] -translate-x-1/2 rounded-full",
                i < filled ? "bg-orange-400" : "bg-orange-200/70 dark:bg-orange-400/20"
              )}
              style={{ transform: `rotate(${angle}deg) translateY(-4.55rem)` }}
            />
          );
        })}
        <div className="absolute inset-[1.85rem] flex flex-col items-center justify-center">
          <span className="text-[11px] text-gray-400">{t("energy.overview.power")}</span>
          <span className="text-[1.85rem] font-semibold leading-none text-gray-900 dark:text-white">{valueLabel}</span>
          <span className="mt-1 text-[11px] text-gray-400">kW</span>
        </div>
      </div>
      <div className="mt-1 grid grid-cols-3 text-center text-[11px] text-gray-400">
        <div>
          <p>{t("energy.overview.min")}</p>
          <p className="font-medium text-gray-700 dark:text-white/80">{minLabel}</p>
        </div>
        <div>
          <p>{t("energy.overview.max")}</p>
          <p className="font-medium text-gray-700 dark:text-white/80">{maxLabel}</p>
        </div>
        <div>
          <p>{t("energy.overview.avg")}</p>
          <p className="font-medium text-gray-700 dark:text-white/80">{avgLabel}</p>
        </div>
      </div>
    </div>
  );
}

function BatteryRow({
  label,
  valueLabel,
  percent,
  tone,
}: {
  label: string;
  valueLabel: string;
  percent: number;
  tone: string;
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[12px] text-gray-400">
        <span>{label}</span>
        <span className="font-medium text-gray-700 dark:text-white/75">{valueLabel}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
        <div className={cn("h-2 rounded-full", tone)} style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-1 flex gap-px">
        {Array.from({ length: 22 }, (_, i) => (
          <span key={i} className="h-1.5 flex-1 rounded-[1px] bg-gray-200/90 dark:bg-white/10" />
        ))}
      </div>
    </div>
  );
}

function useEntityReading(entityId: string) {
  const entity = useEntityStateStore((s) => (entityId ? s.getState(entityId) : undefined));
  const value = parseHaNumber(entity?.state);
  const unit = (entity?.attributes?.unit_of_measurement as string | undefined) ?? "";
  return { value, unit, entity };
}

export function EnergyOverview({
  title,
  subtitle,
  houseImage,
}: {
  title?: string | null;
  subtitle?: string | null;
  houseImage?: string | null;
}) {
  const { t } = useTranslation();
  const [range, setRange] = useState<EnergyChartRange>("hourly");
  useEffect(() => {
    hydrateEnergyStore();
  }, []);

  const entities = useEnergyStore((s) => s.entities);
  const panelTempEntityIds = useEnergyStore((s) => s.panelTempEntityIds);
  const linked = hasLinkedEnergyEntities(entities, panelTempEntityIds);

  const yieldReading = useEntityReading(entities.solarYieldTodayEntityId);
  const powerReading = useEntityReading(entities.solarPowerEntityId);
  const exportReading = useEntityReading(entities.gridExportEntityId);
  const consumptionReading = useEntityReading(entities.consumptionEntityId);
  const batterySoc = useEntityReading(entities.batterySocEntityId);
  const batteryPower = useEntityReading(entities.batteryPowerEntityId);
  const batteryTemp = useEntityReading(entities.batteryTempEntityId);
  const panelStates = useEntityStateStore((s) => s.states);

  const yieldKwh = yieldReading.value != null ? toKwh(yieldReading.value, yieldReading.unit) : undefined;
  const powerKw = powerReading.value != null ? toKilowatts(powerReading.value, powerReading.unit) : undefined;
  const exportValue =
    exportReading.value != null
      ? displayUnitForEnergy(exportReading.unit) === "kW"
        ? toKilowatts(exportReading.value, exportReading.unit)
        : toKwh(exportReading.value, exportReading.unit)
      : undefined;
  const exportUnit = displayUnitForEnergy(exportReading.unit);
  const consumptionKw =
    consumptionReading.value != null ? toKilowatts(consumptionReading.value, consumptionReading.unit) : undefined;
  const batteryKw =
    batteryPower.value != null ? toKilowatts(batteryPower.value, batteryPower.unit) : undefined;
  const showBattery = shouldShowBatteryCard({
    soc: batterySoc.value,
    power: batteryKw,
    temp: batteryTemp.value,
  });

  const historyIds = [entities.solarYieldTodayEntityId, entities.consumptionEntityId, entities.gridExportEntityId]
    .filter(Boolean)
    .join(",");
  const seriesKeys = {
    generation: entities.solarYieldTodayEntityId || undefined,
    consumption: entities.consumptionEntityId || undefined,
    export: entities.gridExportEntityId || undefined,
  };

  const { data: historyPayload } = useQuery({
    queryKey: ["energy-history", historyIds, range],
    enabled: Boolean(historyIds),
    queryFn: async () => {
      if (range === "hourly") {
        const res = await fetch(`/api/ha/history?entity_ids=${encodeURIComponent(historyIds)}&granularity=hourly`);
        if (!res.ok) throw new Error("Failed to fetch hourly history");
        return { kind: "hourly" as const, data: (await res.json()) as Record<string, { hour: string; value: number }[]> };
      }
      const days = range === "daily" ? 7 : 31;
      const res = await fetch(`/api/ha/history?entity_ids=${encodeURIComponent(historyIds)}&days=${days}`);
      if (!res.ok) throw new Error("Failed to fetch daily history");
      return { kind: "daily" as const, data: (await res.json()) as Record<string, { date: string; consumption: number }[]> };
    },
    staleTime: 60_000,
  });

  const chartData = useMemo(() => {
    if (!historyPayload) return mergeHourlySeries({}, seriesKeys);
    if (historyPayload.kind === "hourly") return mergeHourlySeries(historyPayload.data, seriesKeys);
    return mergeDatedSeries(historyPayload.data, seriesKeys);
  }, [historyPayload, entities.solarYieldTodayEntityId, entities.consumptionEntityId, entities.gridExportEntityId]);
  const hasChartData = chartData.some((row) => row.generation > 0 || row.consumption > 0 || row.export > 0);
  const powerStats = seriesStats(chartData.map((row) => row.generation));

  const panelReadings = panelTempEntityIds
    .map((id) => parseHaNumber(panelStates[id]?.state))
    .filter(hasEnergyReading);
  const showHeatmap = shouldShowHeatmap(panelReadings);
  const heatmap: HeatmapTone[] = showHeatmap ? heatmapTones(panelReadings) : [];
  const heatmapRows = Math.max(1, Math.ceil(heatmap.length / 12));

  const powerMax = Math.max(8, (powerKw ?? 0) * 1.25, 0.1);
  const powerPct = clampPercent(((powerKw ?? consumptionKw ?? 0) / powerMax) * 100);
  const resolvedSubtitle = subtitle?.trim() || (linked ? t("energy.overview.liveSubtitle") : t("energy.overview.subtitle"));

  const rangeOptions: EnergyChartRange[] = ["hourly", "daily", "monthly"];

  const toolbar = (
    <div className="pointer-events-auto flex items-center gap-2">
      <div className="flex rounded-full bg-white/90 p-0.5 text-[11px] font-medium shadow-sm ring-1 ring-black/5 dark:bg-zinc-900/90 dark:ring-white/10">
        {rangeOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setRange(option)}
            className={cn(
              "rounded-full px-3 py-1",
              range === option
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                : "text-gray-500 hover:text-gray-800 dark:text-white/60"
            )}
          >
            {t(`energy.overview.range${option[0].toUpperCase()}${option.slice(1)}`)}
          </button>
        ))}
      </div>
      <a
        href="/settings?section=energy"
        className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/90 px-2.5 text-[11px] font-medium text-gray-600 shadow-sm ring-1 ring-black/5 hover:text-gray-900 dark:bg-zinc-900/90 dark:text-white/70 dark:ring-white/10"
      >
        <Settings2 className="h-3.5 w-3.5" />
        {t("settings.energy.entities")}
      </a>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-[88rem] pb-8">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,1.1fr)]">
        <div className="card-plot-in">
          {title?.trim() ? (
            <h1 className="max-w-xl text-[2.15rem] font-semibold leading-[1.15] tracking-tight text-gray-900 dark:text-white">
              {title}
            </h1>
          ) : (
            <h1 className="max-w-xl text-[2.15rem] font-semibold leading-[1.15] tracking-tight text-gray-900 dark:text-white">
              <span className="block">{t("energy.overview.titleLine1")}</span>
              <span className="block">{t("energy.overview.titleLine2")}</span>
            </h1>
          )}
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400 dark:text-white/40">
            {resolvedSubtitle}
          </p>

          <div className="mt-8 grid grid-cols-3 gap-6 border-b border-gray-100 pb-6 dark:border-white/10">
            <Stat label={t("energy.overview.totalGenerated")} value={formatEnergyValue(yieldKwh)} unit="kWh" />
            <Stat
              label={t("energy.overview.currentOutput")}
              value={formatEnergyValue(powerKw)}
              unit="kW"
              hint={powerKw != null && powerKw > 0.2 ? t("energy.overview.peakActive") : undefined}
            />
            <Stat label={t("energy.overview.gridExport")} value={formatEnergyValue(exportValue)} unit={exportUnit} />
          </div>
        </div>
        <div className="card-plot-in">
          <HouseScene image={houseImage} toolbar={toolbar} />
        </div>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,1.1fr)]">
        <section className="card-plot-in">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">{t("energy.overview.chart")}</h2>
            <div className="flex items-center gap-3 text-[11px] text-gray-400">
              <span className="inline-flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-orange-400" /> {t("energy.overview.generation")}</span>
              <span className="inline-flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-amber-300" /> {t("energy.overview.consumption")}</span>
              <span className="inline-flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {t("energy.overview.export")}</span>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  interval={range === "hourly" ? 3 : 0}
                  tickFormatter={(value) => (range === "hourly" ? formatHourTick(String(value)) : String(value))}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} width={36} />
                <Line type="monotone" dataKey="generation" stroke="#fb923c" strokeWidth={2.2} dot={false} />
                <Line type="monotone" dataKey="consumption" stroke="#f4d03f" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="export" stroke="#34d399" strokeWidth={2} strokeDasharray={hasChartData ? "0" : "4 4"} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className={cn("card-plot-in grid gap-6", showBattery ? "grid-cols-2" : "grid-cols-1")}>
          <PowerGauge
            valueLabel={formatEnergyValue(powerKw ?? consumptionKw)}
            percent={powerPct}
            minLabel={powerStats ? formatEnergyValue(powerStats.min) : "—"}
            maxLabel={powerStats ? formatEnergyValue(powerStats.max) : "—"}
            avgLabel={powerStats ? formatEnergyValue(powerStats.avg) : "—"}
            t={t}
          />
          {showBattery ? (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-800 dark:text-white">{t("energy.overview.battery")}</h2>
                {hasEnergyReading(batterySoc.value) ? (
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">
                    {formatEnergyValue(batterySoc.value, 0)}%
                  </span>
                ) : null}
              </div>
              <div className="space-y-4">
                {hasEnergyReading(batterySoc.value) ? (
                  <BatteryRow
                    label={t("energy.overview.energy")}
                    valueLabel={`${formatEnergyValue(batterySoc.value, 0)}%`}
                    percent={clampPercent(batterySoc.value)}
                    tone="bg-emerald-300"
                  />
                ) : hasEnergyReading(batteryKw) ? (
                  <BatteryRow
                    label={t("energy.overview.energy")}
                    valueLabel={`${formatEnergyValue(Math.abs(batteryKw))} kW`}
                    percent={clampPercent(Math.abs(batteryKw) * 20)}
                    tone="bg-emerald-300"
                  />
                ) : null}
                {hasEnergyReading(batteryKw) ? (
                  <BatteryRow
                    label={t("energy.overview.consuming")}
                    valueLabel={`${formatEnergyValue(Math.abs(batteryKw))} kW`}
                    percent={clampPercent(Math.abs(batteryKw) * 20)}
                    tone="bg-orange-200"
                  />
                ) : null}
                {hasEnergyReading(batteryTemp.value) ? (
                  <BatteryRow
                    label={t("energy.overview.temperature")}
                    valueLabel={`${formatEnergyValue(batteryTemp.value, 0)}° C`}
                    percent={clampPercent(batteryTemp.value, 80) * (100 / 80)}
                    tone="bg-amber-200"
                  />
                ) : null}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      {showHeatmap ? (
        <section className="card-plot-in mt-8 border-t border-gray-100 pt-6 dark:border-white/10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">{t("energy.overview.heatmap")}</h2>
            <span className="text-[11px] text-gray-400">
              {t("energy.overview.heatmapCount").replace("{n}", String(heatmap.length))}
            </span>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col justify-around py-0.5 text-[10px] font-medium text-gray-400">
              {Array.from({ length: heatmapRows }, (_, row) => (
                <span key={row}>{String.fromCharCode(65 + row)}</span>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <div className="grid grid-cols-12 gap-1.5">
                {heatmap.map((tone, i) => (
                  <span
                    key={i}
                    className={cn(
                      "aspect-square rounded-md",
                      tone === "hot" ? "bg-orange-500" : tone === "warm" ? "bg-amber-300" : "bg-amber-100 dark:bg-amber-200/35"
                    )}
                  />
                ))}
              </div>
              <div className="mt-1 grid grid-cols-12 text-center text-[10px] text-gray-400">
                {Array.from({ length: Math.min(12, heatmap.length) }, (_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
