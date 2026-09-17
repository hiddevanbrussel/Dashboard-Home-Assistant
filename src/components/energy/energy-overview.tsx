"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, BatteryMedium, Leaf, Settings2, SunMedium } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useTranslation } from "@/hooks/use-translation";
import {
  clampPercent,
  displayUnitForEnergy,
  energyAlerts,
  energyImpact,
  formatEnergyValue,
  hasLinkedEnergyEntities,
  heatmapTones,
  mergeHourlySeries,
  parseHaNumber,
  toKilowatts,
  toKwh,
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
      <p className="mt-1 flex items-baseline gap-1 text-[1.65rem] font-semibold tracking-tight text-gray-900 dark:text-white">
        {value}
        {unit ? <span className="text-sm font-medium text-gray-400 dark:text-white/40">{unit}</span> : null}
      </p>
      {hint ? <p className="mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">{hint}</p> : null}
    </div>
  );
}

function HousePlaceholder() {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-sky-100 to-amber-50 dark:from-zinc-800 dark:to-zinc-900">
      <div className="absolute inset-x-8 top-6 h-24 rounded-t-[1.25rem] bg-zinc-800 dark:bg-zinc-950" />
      <div className="absolute inset-x-10 top-8 grid grid-cols-6 gap-1.5">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="aspect-square rounded-sm bg-zinc-700 ring-1 ring-sky-300/40" />
        ))}
      </div>
      <div className="mt-36 flex h-40 items-end justify-center bg-gradient-to-t from-white/80 to-transparent pb-4 dark:from-zinc-900/80">
        <SunMedium className="h-8 w-8 text-amber-400" />
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

function BatteryRow({ label, valueLabel, percent, tone }: { label: string; valueLabel: string; percent: number; tone: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px] text-gray-400">
        <span>{label}</span>
        <span>{valueLabel}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 dark:bg-white/10">
        <div className={cn("h-2 rounded-full", tone)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
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

  const impact = energyImpact(yieldKwh);
  const alerts = energyAlerts({ batteryPct: batterySoc.value, batteryTempC: batteryTemp.value });

  const historyIds = [entities.solarYieldTodayEntityId, entities.consumptionEntityId, entities.gridExportEntityId]
    .filter(Boolean)
    .join(",");

  const { data: hourlySeries } = useQuery({
    queryKey: ["energy-hourly", historyIds],
    enabled: Boolean(historyIds),
    queryFn: async () => {
      const res = await fetch(`/api/ha/history?entity_ids=${encodeURIComponent(historyIds)}&granularity=hourly`);
      if (!res.ok) throw new Error("Failed to fetch hourly history");
      return (await res.json()) as Record<string, { hour: string; value: number }[]>;
    },
    staleTime: 60_000,
  });

  const chartData = useMemo(
    () =>
      mergeHourlySeries(hourlySeries ?? {}, {
        generation: entities.solarYieldTodayEntityId || undefined,
        consumption: entities.consumptionEntityId || undefined,
        export: entities.gridExportEntityId || undefined,
      }),
    [hourlySeries, entities.solarYieldTodayEntityId, entities.consumptionEntityId, entities.gridExportEntityId]
  );
  const hasChartData = chartData.some((row) => row.generation > 0 || row.consumption > 0 || row.export > 0);

  const panelValues = panelTempEntityIds.map((id) => parseHaNumber(panelStates[id]?.state));
  const heatmap = panelTempEntityIds.length > 0
    ? heatmapTones(panelValues.length >= 24 ? panelValues : [...panelValues, ...Array.from({ length: 24 - panelValues.length }, () => undefined)])
    : Array.from({ length: 24 }, (_, i): HeatmapTone => (i === 16 ? "hot" : i % 7 === 3 ? "warm" : "idle"));

  const powerMax = Math.max(8, (powerKw ?? 0) * 1.25, 0.1);
  const powerPct = clampPercent(((powerKw ?? 0) / powerMax) * 100);
  const resolvedSubtitle =
    subtitle?.trim() ||
    (linked ? t("energy.overview.liveSubtitle") : t("energy.overview.subtitle"));

  return (
    <div className="mx-auto w-full max-w-6xl pb-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {title?.trim() || t("energy.overview.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-400 dark:text-white/45">{resolvedSubtitle}</p>
        </div>
        <a
          href="/settings?section=energy"
          className="inline-flex items-center gap-2 rounded-full bg-black/[0.04] px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-black/[0.07] dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/15"
        >
          <Settings2 className="h-3.5 w-3.5" />
          {t("settings.energy.entities")}
        </a>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4 rounded-[1.5rem] bg-white/80 p-5 shadow-sm dark:bg-white/5">
            <Stat
              label={t("energy.overview.totalGenerated")}
              value={formatEnergyValue(yieldKwh)}
              unit="kWh"
            />
            <Stat
              label={t("energy.overview.currentOutput")}
              value={formatEnergyValue(powerKw)}
              unit="kW"
              hint={powerKw != null && powerKw > 0.2 ? t("energy.overview.peakActive") : undefined}
            />
            <Stat
              label={t("energy.overview.gridExport")}
              value={formatEnergyValue(exportValue)}
              unit={exportUnit}
            />
          </div>

          <section className="rounded-[1.5rem] bg-white/80 p-5 shadow-sm dark:bg-white/5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">{t("energy.overview.chart")}</h2>
              <div className="flex items-center gap-3 text-[11px] text-gray-400">
                <span className="inline-flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-orange-400" /> {t("energy.overview.generation")}</span>
                <span className="inline-flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-amber-300" /> {t("energy.overview.consumption")}</span>
                <span className="inline-flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {t("energy.overview.export")}</span>
              </div>
            </div>
            {hasChartData ? (
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={3} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={32} />
                    <Line type="monotone" dataKey="generation" stroke="#fb923c" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="consumption" stroke="#fcd34d" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="export" stroke="#34d399" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-40 items-end gap-1 rounded-2xl bg-gradient-to-t from-orange-50/80 to-transparent px-2 pb-2 dark:from-orange-400/5">
                {chartData.map((row) => (
                  <span
                    key={row.hour}
                    className="flex-1 rounded-t-md bg-orange-300/40 dark:bg-orange-400/20"
                    style={{ height: "18%" }}
                  />
                ))}
              </div>
            )}
            <p className="mt-3 text-xs text-gray-400 dark:text-white/40">
              {linked ? t("energy.overview.chartLiveHint") : t("energy.overview.chartHint")}
            </p>
          </section>
        </div>

        <div className="space-y-5">
          {houseImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={houseImage} alt="" className="h-52 w-full rounded-[1.5rem] object-cover shadow-sm" />
          ) : (
            <HousePlaceholder />
          )}
          <div className="grid grid-cols-2 gap-4">
            <section className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm dark:bg-white/5">
              <p className="text-xs font-medium text-gray-400">{t("energy.overview.power")}</p>
              <div className="mt-3 flex h-28 items-center justify-center">
                <div
                  className="relative flex h-24 w-24 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#fb923c ${powerPct}%, rgba(251, 146, 60, 0.18) ${powerPct}%)`,
                  }}
                >
                  <span className="flex h-[4.6rem] w-[4.6rem] flex-col items-center justify-center rounded-full bg-white dark:bg-zinc-900">
                    <span className="text-xl font-semibold text-gray-900 dark:text-white">
                      {formatEnergyValue(powerKw ?? consumptionKw)}
                    </span>
                    <span className="text-[10px] font-medium text-gray-400">kW</span>
                  </span>
                </div>
              </div>
            </section>
            <section className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm dark:bg-white/5">
              <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-gray-400">
                <BatteryMedium className="h-3.5 w-3.5" />
                {t("energy.overview.battery")}
              </p>
              <div className="space-y-3">
                <BatteryRow
                  label={t("energy.overview.energy")}
                  valueLabel={batterySoc.value != null ? `${formatEnergyValue(batterySoc.value, 0)}%` : "—"}
                  percent={clampPercent(batterySoc.value)}
                  tone="bg-emerald-400"
                />
                <BatteryRow
                  label={t("energy.overview.consuming")}
                  valueLabel={batteryKw != null ? `${formatEnergyValue(Math.abs(batteryKw))} kW` : "—"}
                  percent={clampPercent(Math.abs(batteryKw ?? 0) * 20)}
                  tone="bg-orange-300"
                />
                <BatteryRow
                  label={t("energy.overview.temperature")}
                  valueLabel={batteryTemp.value != null ? `${formatEnergyValue(batteryTemp.value, 0)}°C` : "—"}
                  percent={clampPercent(batteryTemp.value, 80) * (100 / 80)}
                  tone="bg-amber-300"
                />
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <section className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm dark:bg-white/5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-white">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              {t("energy.overview.alerts")}
            </h2>
            <span className="text-xs text-gray-400">
              {alerts.length > 0 ? t("energy.overview.alertCount").replace("{n}", String(alerts.length)) : t("energy.overview.noAlerts")}
            </span>
          </div>
          {alerts.length > 0 ? (
            <ul className="space-y-1.5 text-sm text-gray-600 dark:text-white/70">
              {alerts.map((alert) => (
                <li key={alert.key}>{t(alert.key)}</li>
              ))}
            </ul>
          ) : (
            <div className="flex h-16 items-end gap-2">
              <span className="w-8 rounded-t-md bg-orange-400/80" style={{ height: "35%" }} />
              <span className="w-8 rounded-t-md bg-amber-200" style={{ height: "55%" }} />
              <span className="w-8 rounded-t-md bg-gray-200 dark:bg-white/15" style={{ height: "80%" }} />
            </div>
          )}
        </section>
        <section className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm dark:bg-white/5">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-white">
            <Leaf className="h-4 w-4 text-emerald-500" />
            {t("energy.overview.impact")}
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-500 dark:text-white/55">
              <dt>{t("energy.overview.carbon")}</dt>
              <dd className="font-medium text-gray-800 dark:text-white">
                {impact.carbonKg != null ? `${formatEnergyValue(impact.carbonKg)} kg` : "—"}
              </dd>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-white/55">
              <dt>{t("energy.overview.trees")}</dt>
              <dd className="font-medium text-gray-800 dark:text-white">
                {impact.trees != null ? formatEnergyValue(impact.trees) : "—"}
              </dd>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-white/55">
              <dt>{t("energy.overview.homes")}</dt>
              <dd className="font-medium text-gray-800 dark:text-white">
                {impact.homes != null ? formatEnergyValue(impact.homes) : "—"}
              </dd>
            </div>
          </dl>
        </section>
        <section className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm dark:bg-white/5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">{t("energy.overview.heatmap")}</h2>
            <span className="text-[11px] text-gray-400">
              {panelTempEntityIds.length > 0
                ? t("energy.overview.heatmapCount").replace("{n}", String(panelTempEntityIds.length))
                : t("energy.overview.heatmapHint")}
            </span>
          </div>
          <div className="grid grid-cols-12 gap-1">
            {heatmap.slice(0, 24).map((tone, i) => (
              <span
                key={i}
                className={cn(
                  "aspect-square rounded-md",
                  tone === "hot" ? "bg-orange-500" : tone === "warm" ? "bg-amber-300" : "bg-amber-100 dark:bg-amber-200/30"
                )}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
