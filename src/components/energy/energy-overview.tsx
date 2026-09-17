"use client";

import { useEffect, type ReactNode } from "react";
import { Settings2 } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import {
  ENERGY_OVERVIEW_HOUSE_IMAGE,
  clampPercent,
  displayUnitForEnergy,
  formatEnergyValue,
  hasEnergyReading,
  hasLinkedEnergyEntities,
  heatmapTones,
  parseHaNumber,
  shouldShowBatteryCard,
  shouldShowHeatmap,
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
  useEffect(() => {
    hydrateEnergyStore();
  }, []);

  const entities = useEnergyStore((s) => s.entities);
  const panelTempEntityIds = useEnergyStore((s) => s.panelTempEntityIds);
  const linked = hasLinkedEnergyEntities(entities, panelTempEntityIds);

  const yieldReading = useEntityReading(entities.solarYieldTodayEntityId);
  const powerReading = useEntityReading(entities.solarPowerEntityId);
  const exportReading = useEntityReading(entities.gridExportEntityId);
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
          <HouseScene image={houseImage} toolbar={toolbar} />
        </div>
      </div>

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
