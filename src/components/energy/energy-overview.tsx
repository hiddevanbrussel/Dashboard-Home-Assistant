"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sun } from "lucide-react";
import { EnergyEntityBindModal, type EnergyBindEntity } from "@/components/energy/energy-entity-bind-modal";
import { useTranslation } from "@/hooks/use-translation";
import {
  bestSolarWindow,
  clampPercent,
  displayUnitForEnergy,
  formatEnergyValue,
  formatHourRange,
  hasEnergyReading,
  hasLinkedEnergyEntities,
  heatmapTones,
  parseHaNumber,
  shouldShowBatteryCard,
  shouldShowHeatmap,
  toKilowatts,
  toKwh,
  type EnergyEntityKey,
  type HeatmapTone,
  type HourlyPoint,
} from "@/lib/energy-dashboard";
import { cn } from "@/lib/utils";
import { hydrateEnergyStore, useEnergyStore } from "@/stores/energy-store";
import { useEntityStateStore } from "@/stores/entity-state-store";

function Stat({
  label,
  value,
  unit,
  hint,
  editMode,
  linked,
  onBind,
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  editMode?: boolean;
  linked?: boolean;
  onBind?: () => void;
}) {
  const body = (
    <>
      <p className="text-xs font-medium text-gray-400 dark:text-white/45">{label}</p>
      <p className="mt-1 flex items-baseline gap-1 text-[1.85rem] font-semibold tracking-tight text-gray-900 dark:text-white">
        {value}
        {unit ? <span className="text-sm font-medium text-gray-400 dark:text-white/40">{unit}</span> : null}
      </p>
      {hint ? (
        <p
          className={cn(
            "mt-1 text-[11px] font-medium",
            editMode && !linked ? "text-brand" : "text-emerald-600 dark:text-emerald-400"
          )}
        >
          {hint}
        </p>
      ) : null}
    </>
  );
  if (editMode && onBind) {
    return (
      <button
        type="button"
        onClick={onBind}
        className={cn(
          "-m-2 min-w-0 rounded-2xl p-2 text-left transition-colors hover:bg-black/[0.03] dark:hover:bg-white/5",
          !linked && "ring-1 ring-dashed ring-brand/35"
        )}
      >
        {body}
      </button>
    );
  }
  return <div className="min-w-0">{body}</div>;
}

function BatteryRow({
  label,
  valueLabel,
  percent,
  tone,
  editMode,
  linked,
  onBind,
}: {
  label: string;
  valueLabel: string;
  percent: number;
  tone: string;
  editMode?: boolean;
  linked?: boolean;
  onBind?: () => void;
}) {
  const body = (
    <>
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
    </>
  );
  if (editMode && onBind) {
    return (
      <button
        type="button"
        onClick={onBind}
        className={cn(
          "w-full rounded-xl p-1 text-left transition-colors hover:bg-black/[0.03] dark:hover:bg-white/5",
          !linked && "ring-1 ring-dashed ring-brand/35"
        )}
      >
        {body}
      </button>
    );
  }
  return <div>{body}</div>;
}

async function fetchHourlySeries(ids: string[], mode?: "mean"): Promise<Record<string, HourlyPoint[]>> {
  if (ids.length === 0) return {};
  const params = new URLSearchParams({ entity_ids: ids.join(","), granularity: "hourly" });
  if (mode === "mean") params.set("mode", "mean");
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
  editMode = false,
  haEntities = [],
}: {
  title?: string | null;
  subtitle?: string | null;
  /** @deprecated Page-wide light/dark art replaced the inset house image. */
  houseImage?: string | null;
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

  const yieldReading = useEntityReading(entities.solarYieldTodayEntityId);
  const exportReading = useEntityReading(entities.gridExportEntityId);
  const consumptionReading = useEntityReading(entities.consumptionEntityId);
  const batterySoc = useEntityReading(entities.batterySocEntityId);
  const batteryPower = useEntityReading(entities.batteryPowerEntityId);
  const batteryTemp = useEntityReading(entities.batteryTempEntityId);
  const panelStates = useEntityStateStore((s) => s.states);

  const yieldKwh = yieldReading.value != null ? toKwh(yieldReading.value, yieldReading.unit) : undefined;
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
  const showBattery =
    editMode ||
    shouldShowBatteryCard({
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
  const resolvedSubtitle = subtitle?.trim()
    || (editMode ? t("energy.overview.bindHint") : linked ? t("energy.overview.liveSubtitle") : t("energy.overview.subtitle"));

  const generationId = entities.solarPowerEntityId || entities.solarYieldTodayEntityId;
  const generationIsPower = Boolean(entities.solarPowerEntityId);
  const { data: dayGeneration } = useQuery({
    queryKey: ["energy-overview-smart-window", generationId, generationIsPower],
    enabled: Boolean(generationId),
    queryFn: async () => {
      const series = await fetchHourlySeries([generationId], generationIsPower ? "mean" : undefined);
      return series[generationId] ?? [];
    },
  });
  const solarWindow = useMemo(() => bestSolarWindow(dayGeneration ?? []), [dayGeneration]);
  const showSmartMoment = Boolean(generationId);

  return (
    <div className="relative z-[1] mx-auto w-full max-w-[88rem] pb-8">
      <div className="card-plot-in max-w-3xl">
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

        <div className="mt-8 grid grid-cols-3 gap-6 border-b border-black/5 pb-6 dark:border-white/10">
          <Stat
            label={t("energy.overview.totalGenerated")}
            value={formatEnergyValue(yieldKwh)}
            unit="kWh"
            hint={editMode && !entities.solarYieldTodayEntityId ? t("energy.overview.tapToLink") : undefined}
            editMode={editMode}
            linked={Boolean(entities.solarYieldTodayEntityId)}
            onBind={() => setBindKey("solarYieldTodayEntityId")}
          />
          <Stat
            label={t("energy.overview.gridUse")}
            value={formatEnergyValue(homeKw)}
            unit="kW"
            hint={editMode && !entities.consumptionEntityId ? t("energy.overview.tapToLink") : undefined}
            editMode={editMode}
            linked={Boolean(entities.consumptionEntityId)}
            onBind={() => setBindKey("consumptionEntityId")}
          />
          <Stat
            label={t("energy.overview.gridExport")}
            value={formatEnergyValue(exportValue)}
            unit={exportUnit}
            hint={editMode && !entities.gridExportEntityId ? t("energy.overview.tapToLink") : undefined}
            editMode={editMode}
            linked={Boolean(entities.gridExportEntityId)}
            onBind={() => setBindKey("gridExportEntityId")}
          />
        </div>
      </div>

      {showSmartMoment ? (
        <section className="card-plot-in mt-6 max-w-md">
          <div className="rounded-[1.75rem] bg-white/70 px-6 py-5 shadow-sm ring-1 ring-black/[0.06] backdrop-blur-md dark:bg-black/35 dark:ring-white/10">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-gray-400 dark:text-white/45">
              <Sun className="h-3.5 w-3.5 text-brand" aria-hidden />
              {t("energy.overview.smartMoment")}
            </p>
            {solarWindow ? (
              <>
                <p className="mt-3 text-[2rem] font-semibold tracking-tight text-gray-900 dark:text-white">
                  {formatHourRange(solarWindow.startHour, solarWindow.endHour)}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-white/55">
                  {t("energy.overview.smartMomentHint")}
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-gray-400 dark:text-white/40">
                {t("energy.overview.smartMomentEmpty")}
              </p>
            )}
          </div>
        </section>
      ) : null}

      {showBattery ? (
        <section className="card-plot-in mt-6 max-w-md rounded-[1.75rem] bg-white/70 px-5 py-4 shadow-sm ring-1 ring-black/[0.06] backdrop-blur-md dark:bg-black/35 dark:ring-white/10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">{t("energy.overview.battery")}</h2>
            {hasEnergyReading(batterySoc.value) ? (
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                {formatEnergyValue(batterySoc.value, 0)}%
              </span>
            ) : null}
          </div>
          <div className="space-y-4">
            {hasEnergyReading(batterySoc.value) || editMode ? (
              <BatteryRow
                label={t("energy.overview.energy")}
                valueLabel={
                  hasEnergyReading(batterySoc.value)
                    ? `${formatEnergyValue(batterySoc.value, 0)}%`
                    : t("energy.overview.tapToLink")
                }
                percent={clampPercent(batterySoc.value)}
                tone="bg-emerald-300"
                editMode={editMode}
                linked={Boolean(entities.batterySocEntityId)}
                onBind={() => setBindKey("batterySocEntityId")}
              />
            ) : hasEnergyReading(batteryKw) ? (
              <BatteryRow
                label={t("energy.overview.energy")}
                valueLabel={`${formatEnergyValue(Math.abs(batteryKw))} kW`}
                percent={clampPercent(Math.abs(batteryKw) * 20)}
                tone="bg-emerald-300"
              />
            ) : null}
            {hasEnergyReading(batteryKw) || editMode ? (
              <BatteryRow
                label={t("energy.overview.consuming")}
                valueLabel={
                  hasEnergyReading(batteryKw)
                    ? `${formatEnergyValue(Math.abs(batteryKw))} kW`
                    : t("energy.overview.tapToLink")
                }
                percent={clampPercent(hasEnergyReading(batteryKw) ? Math.abs(batteryKw) * 20 : 0)}
                tone="bg-orange-200"
                editMode={editMode}
                linked={Boolean(entities.batteryPowerEntityId)}
                onBind={() => setBindKey("batteryPowerEntityId")}
              />
            ) : null}
            {hasEnergyReading(batteryTemp.value) || editMode ? (
              <BatteryRow
                label={t("energy.overview.temperature")}
                valueLabel={
                  hasEnergyReading(batteryTemp.value)
                    ? `${formatEnergyValue(batteryTemp.value, 0)}° C`
                    : t("energy.overview.tapToLink")
                }
                percent={clampPercent(batteryTemp.value, 80) * (100 / 80)}
                tone="bg-amber-200"
                editMode={editMode}
                linked={Boolean(entities.batteryTempEntityId)}
                onBind={() => setBindKey("batteryTempEntityId")}
              />
            ) : null}
          </div>
        </section>
      ) : null}

      {showHeatmap ? (
        <section className="card-plot-in mt-8 max-w-3xl rounded-[1.75rem] border border-black/5 bg-white/70 px-5 py-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/35">
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

      {bindKey ? (
        <EnergyEntityBindModal fieldKey={bindKey} haEntities={haEntities} onClose={() => setBindKey(null)} />
      ) : null}
    </div>
  );
}
