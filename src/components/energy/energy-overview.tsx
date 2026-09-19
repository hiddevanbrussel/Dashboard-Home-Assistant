"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Battery, Home, PlugZap, Settings2, Sun, type LucideIcon } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import {
  ENERGY_OVERVIEW_HOUSE_IMAGE,
  areaPath,
  bestSolarWindow,
  clampPercent,
  displayUnitForEnergy,
  formatEnergyValue,
  formatHourRange,
  hasEnergyReading,
  hasLinkedEnergyEntities,
  heatmapTones,
  mergeDatedSeries,
  mergeHourlySeries,
  parseHaNumber,
  polylinePoints,
  seriesMax,
  shouldShowBatteryCard,
  shouldShowHeatmap,
  toKilowatts,
  toKwh,
  visibleHouseCallouts,
  type EnergyHourlyRow,
  type HeatmapTone,
  type HouseCalloutId,
  type HourlyPoint,
} from "@/lib/energy-dashboard";
import { cn } from "@/lib/utils";
import { hydrateEnergyStore, useEnergyStore } from "@/stores/energy-store";
import { useEntityStateStore } from "@/stores/entity-state-store";

type ChartRange = "day" | "week" | "month";

const HOUSE_CALLOUT_META: Record<
  HouseCalloutId,
  { icon: LucideIcon; labelKey: string; box: string; line: { x1: string; y1: string; x2: string; y2: string } }
> = {
  solar: {
    icon: Sun,
    labelKey: "energy.overview.houseSolar",
    box: "left-0 top-[6%]",
    line: { x1: "18%", y1: "14%", x2: "48%", y2: "20%" },
  },
  home: {
    icon: Home,
    labelKey: "energy.overview.houseHome",
    box: "right-0 top-[20%]",
    line: { x1: "82%", y1: "28%", x2: "72%", y2: "38%" },
  },
  battery: {
    icon: Battery,
    labelKey: "energy.overview.houseBattery",
    box: "left-0 bottom-[28%]",
    line: { x1: "20%", y1: "70%", x2: "34%", y2: "76%" },
  },
  grid: {
    icon: PlugZap,
    labelKey: "energy.overview.houseGrid",
    box: "right-0 bottom-[6%]",
    line: { x1: "82%", y1: "84%", x2: "74%", y2: "78%" },
  },
};

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

function HouseCallout({
  id,
  label,
  value,
}: {
  id: HouseCalloutId;
  label: string;
  value: string;
}) {
  const meta = HOUSE_CALLOUT_META[id];
  const Icon = meta.icon;
  return (
    <div className={cn("pointer-events-none absolute z-10 max-w-[10rem]", meta.box)}>
      <div className="inline-flex items-center gap-2 rounded-full bg-white/55 px-2.5 py-1.5 shadow-sm ring-1 ring-black/5 backdrop-blur-md dark:bg-black/40 dark:ring-white/10">
        <Icon className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
        <div className="min-w-0">
          <p className="text-[10px] font-medium leading-none text-gray-500 dark:text-white/50">{label}</p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function HouseScene({
  image,
  toolbar,
  callouts,
}: {
  image?: string | null;
  toolbar: ReactNode;
  callouts: Array<{ id: HouseCalloutId; label: string; value: string }>;
}) {
  const custom = Boolean(image?.trim());
  const src = image?.trim() || ENERGY_OVERVIEW_HOUSE_IMAGE;
  return (
    <div className="relative px-2 sm:px-16">
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
      {callouts.length > 0 ? (
        <svg className="pointer-events-none absolute inset-0 z-[1] h-full w-full" aria-hidden>
          {callouts.map((callout) => {
            const line = HOUSE_CALLOUT_META[callout.id].line;
            return (
              <line
                key={callout.id}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                className="stroke-brand/45 dark:stroke-white/35"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      ) : null}
      {callouts.map((callout) => (
        <HouseCallout key={callout.id} {...callout} />
      ))}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">{toolbar}</div>
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

function FlowChart({
  rows,
  range,
  generationLabel,
  consumptionLabel,
}: {
  rows: EnergyHourlyRow[];
  range: ChartRange;
  generationLabel: string;
  consumptionLabel: string;
}) {
  const width = 640;
  const height = 210;
  const padTop = 12;
  const padBottom = 24;
  const plotH = height - padTop - padBottom;
  const generation = rows.map((row) => row.generation);
  const consumption = rows.map((row) => row.consumption);
  const max = seriesMax([...generation, ...consumption]);
  const genLine = polylinePoints(generation, width, plotH, max);
  const useLine = polylinePoints(consumption, width, plotH, max);
  const genArea = areaPath(generation, width, plotH, max);
  const nowX = range === "day" ? (new Date().getHours() / 23) * width : null;
  const ticks =
    range === "day"
      ? [
          { x: 0, label: "00:00" },
          { x: width * 0.25, label: "06:00" },
          { x: width * 0.5, label: "12:00" },
          { x: width * 0.75, label: "18:00" },
          { x: width, label: "24:00" },
        ]
      : rows.filter((_, i) => i === 0 || i === rows.length - 1 || i === Math.floor(rows.length / 2)).map((row, i, list) => ({
          x: list.length <= 1 ? 0 : (rows.indexOf(row) / Math.max(1, rows.length - 1)) * width,
          label: row.hour,
        }));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full overflow-visible" role="img">
      <g transform={`translate(0 ${padTop})`}>
        {genArea ? <path d={genArea} className="fill-brand/20 dark:fill-brand/25" /> : null}
        {genLine ? (
          <polyline points={genLine} fill="none" className="stroke-brand" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        ) : null}
        {useLine ? (
          <polyline points={useLine} fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        ) : null}
        {nowX != null ? (
          <line x1={nowX} x2={nowX} y1={0} y2={plotH} className="stroke-gray-400/70 dark:stroke-white/30" strokeDasharray="3 5" />
        ) : null}
      </g>
      {ticks.map((tick) => (
        <text
          key={`${tick.x}-${tick.label}`}
          x={tick.x}
          y={height - 4}
          textAnchor={tick.x === 0 ? "start" : tick.x === width ? "end" : "middle"}
          className="fill-gray-400 text-[10px] dark:fill-white/40"
        >
          {tick.label}
        </text>
      ))}
      <text x={0} y={10} className="fill-gray-400 text-[10px] dark:fill-white/40">
        {generationLabel}
      </text>
      <text x={width} y={10} textAnchor="end" className="fill-emerald-500 text-[10px] dark:fill-emerald-400">
        {consumptionLabel}
      </text>
    </svg>
  );
}

async function fetchHistorySeries(
  ids: string[],
  range: ChartRange,
  mode?: "mean"
): Promise<Record<string, HourlyPoint[] | { date: string; consumption: number }[]>> {
  if (ids.length === 0) return {};
  const params = new URLSearchParams({ entity_ids: ids.join(",") });
  if (range === "day") {
    params.set("granularity", "hourly");
    if (mode === "mean") params.set("mode", "mean");
  } else {
    params.set("days", range === "week" ? "7" : "31");
  }
  const res = await fetch(`/api/ha/history?${params.toString()}`);
  if (!res.ok) return {};
  return res.json();
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
  useEffect(() => {
    hydrateEnergyStore();
  }, []);

  const entities = useEnergyStore((s) => s.entities);
  const panelTempEntityIds = useEnergyStore((s) => s.panelTempEntityIds);
  const linked = hasLinkedEnergyEntities(entities, panelTempEntityIds);

  const [chartRange, setChartRange] = useState<ChartRange>("day");
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
  const batteryKw =
    batteryPower.value != null ? toKilowatts(batteryPower.value, batteryPower.unit) : undefined;
  const homeKw =
    consumptionReading.value != null
      ? toKilowatts(consumptionReading.value, consumptionReading.unit)
      : undefined;
  const showBattery = shouldShowBatteryCard({
    soc: batterySoc.value,
    power: batteryKw,
    temp: batteryTemp.value,
  });

  const panelReadings = panelTempEntityIds
    .map((id) => parseHaNumber(panelStates[id]?.state))
    .filter(hasEnergyReading);
  const showHeatmap = shouldShowHeatmap(panelReadings);
  const heatmap: HeatmapTone[] = showHeatmap ? heatmapTones(panelReadings) : [];
  const heatmapRows = Math.max(1, Math.ceil(heatmap.length / 12));
  const resolvedSubtitle = subtitle?.trim() || (linked ? t("energy.overview.liveSubtitle") : t("energy.overview.subtitle"));
  const calloutIds = visibleHouseCallouts({
    solarKw: powerKw,
    homeKw,
    gridValue: exportValue,
    batterySoc: batterySoc.value,
    batteryKw,
  });
  const houseCallouts = calloutIds.map((id) => {
    if (id === "solar") {
      return { id, label: t("energy.overview.houseSolar"), value: `${formatEnergyValue(powerKw)} kW` };
    }
    if (id === "home") {
      return { id, label: t("energy.overview.houseHome"), value: `${formatEnergyValue(homeKw)} kW` };
    }
    if (id === "grid") {
      return { id, label: t("energy.overview.houseGrid"), value: `${formatEnergyValue(exportValue)} ${exportUnit}` };
    }
    const soc = hasEnergyReading(batterySoc.value) ? `${formatEnergyValue(batterySoc.value, 0)}%` : "";
    const flow = hasEnergyReading(batteryKw)
      ? `${batteryKw >= 0 ? "+" : "−"}${formatEnergyValue(Math.abs(batteryKw))} kW`
      : "";
    return {
      id,
      label: t("energy.overview.houseBattery"),
      value: [soc, flow].filter(Boolean).join(" · "),
    };
  });

  const generationId = entities.solarPowerEntityId || entities.solarYieldTodayEntityId;
  const generationIsPower = Boolean(entities.solarPowerEntityId);
  const consumptionId = entities.consumptionEntityId;
  const exportId = entities.gridExportEntityId;
  const historyIds = [generationId, consumptionId, exportId].filter(Boolean);
  const { data: historyData } = useQuery({
    queryKey: ["energy-overview-history", chartRange, historyIds.join(","), generationIsPower],
    enabled: historyIds.length > 0,
    queryFn: async () => {
      if (chartRange === "day") {
        const powerIds = [
          generationIsPower ? generationId : "",
          consumptionId,
        ].filter(Boolean);
        const energyIds = [
          !generationIsPower ? generationId : "",
          exportId,
        ].filter((id, index, list) => Boolean(id) && !powerIds.includes(id) && list.indexOf(id) === index);
        const [powerSeries, energySeries] = await Promise.all([
          fetchHistorySeries(powerIds, "day", "mean"),
          fetchHistorySeries(energyIds, "day"),
        ]);
        return mergeHourlySeries(
          { ...energySeries, ...powerSeries } as Record<string, HourlyPoint[]>,
          { generation: generationId, consumption: consumptionId, export: exportId }
        );
      }
      const datedGenerationId = entities.solarYieldTodayEntityId || generationId;
      const datedIds = [datedGenerationId, consumptionId, exportId].filter(Boolean);
      const dated = await fetchHistorySeries(datedIds, chartRange);
      return mergeDatedSeries(dated as Record<string, { date: string; consumption: number }[]>, {
        generation: datedGenerationId,
        consumption: consumptionId,
        export: exportId,
      });
    },
  });
  const chartRows = historyData ?? [];
  const hasChartValues = chartRows.some((row) => row.generation > 0 || row.consumption > 0);
  const { data: dayGeneration } = useQuery({
    queryKey: ["energy-overview-smart-window", generationId, generationIsPower],
    enabled: Boolean(generationId),
    queryFn: async () => {
      const series = await fetchHistorySeries(
        [generationId],
        "day",
        generationIsPower ? "mean" : undefined
      );
      return (series[generationId] as HourlyPoint[] | undefined) ?? [];
    },
  });
  const solarWindow = useMemo(() => bestSolarWindow(dayGeneration ?? []), [dayGeneration]);
  const showFlow = historyIds.length > 0;

  const toolbar = (
    <div className="pointer-events-auto flex items-center gap-2">
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
          <HouseScene image={houseImage} toolbar={toolbar} callouts={houseCallouts} />
        </div>
      </div>

      {showFlow ? (
        <section className="card-plot-in mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(16rem,0.7fr)]">
          <div>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">{t("energy.overview.chartTitle")}</h2>
              <div className="flex items-center gap-1 rounded-full bg-black/[0.04] p-0.5 dark:bg-white/10">
                {(["day", "week", "month"] as const).map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setChartRange(range)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-medium",
                      chartRange === range
                        ? "bg-brand text-white"
                        : "text-gray-500 hover:text-gray-800 dark:text-white/55 dark:hover:text-white"
                    )}
                  >
                    {t(
                      range === "day"
                        ? "energy.overview.rangeDay"
                        : range === "week"
                          ? "energy.overview.rangeWeek"
                          : "energy.overview.rangeMonth"
                    )}
                  </button>
                ))}
              </div>
            </div>
            {hasChartValues ? (
              <FlowChart
                rows={chartRows}
                range={chartRange}
                generationLabel={t("energy.overview.generation")}
                consumptionLabel={t("energy.overview.consumption")}
              />
            ) : (
              <p className="py-10 text-sm text-gray-400 dark:text-white/40">
                {linked ? t("energy.overview.chartLiveHint") : t("energy.overview.chartHint")}
              </p>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-400 dark:text-white/40">
              {t("energy.overview.smartMoment")}
            </p>
            {solarWindow ? (
              <>
                <p className="mt-2 text-[2rem] font-semibold tracking-tight text-gray-900 dark:text-white">
                  {formatHourRange(solarWindow.startHour, solarWindow.endHour)}
                </p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-500 dark:text-white/55">
                  {t("energy.overview.smartMomentHint")}
                </p>
              </>
            ) : (
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400 dark:text-white/40">
                {t("energy.overview.smartMomentEmpty")}
              </p>
            )}
          </div>
        </section>
      ) : null}

      {showBattery ? (
        <section className="card-plot-in mt-6 max-w-md">
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
