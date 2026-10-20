"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useEnergyStore, hydrateEnergyStore } from "@/stores/energy-store";
import {
  displayUnitForEnergy,
  formatEnergyValue,
  parseHaNumber,
  toKilowatts,
  toKwh,
  normalizeUnit,
} from "@/lib/energy-dashboard";

type StatDef = {
  key: "yield" | "consumption" | "toGrid";
  entityId: string;
  labelKey: string;
};

function formatStat(
  state: string | null | undefined,
  unitRaw: unknown
): { value: string; unit: string } {
  const n = parseHaNumber(state);
  if (n == null) return { value: "—", unit: "" };
  const unit = typeof unitRaw === "string" ? unitRaw : undefined;
  const u = normalizeUnit(unit);
  if (u === "w" || u === "kw") {
    return { value: formatEnergyValue(toKilowatts(n, unit)), unit: "kW" };
  }
  return { value: formatEnergyValue(toKwh(n, unit)), unit: displayUnitForEnergy(unit) };
}

/**
 * Compact opbrengst / verbruik / to-grid readings for the top header (right).
 */
export function HeaderEnergyStats({ contentLight }: { contentLight?: boolean } = {}) {
  const { t } = useTranslation();
  const enabled = useEnergyStore((s) => s.enabled);
  const entities = useEnergyStore((s) => s.entities);
  const states = useEntityStateStore((s) => s.states);

  useEffect(() => {
    hydrateEnergyStore();
  }, []);

  if (!enabled) return null;

  const allStats: StatDef[] = [
    {
      key: "yield",
      entityId: entities.solarYieldTodayEntityId,
      labelKey: "header.energy.yield",
    },
    {
      key: "consumption",
      entityId: entities.consumptionEntityId,
      labelKey: "header.energy.consumption",
    },
    {
      key: "toGrid",
      entityId: entities.gridExportEntityId,
      labelKey: "header.energy.toGrid",
    },
  ];
  const stats = allStats.filter((s) => Boolean(s.entityId.trim()));

  if (stats.length === 0) return null;

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2.5 sm:gap-3",
        contentLight ? "text-white/90" : "text-gray-700 dark:text-gray-300"
      )}
      aria-label={t("header.energy.aria")}
    >
      {stats.map((stat) => {
        const ent = states[stat.entityId];
        const { value, unit } = formatStat(ent?.state, ent?.attributes?.unit_of_measurement);
        return (
          <div
            key={stat.key}
            className="flex min-w-0 flex-col items-end leading-tight"
            title={`${t(stat.labelKey)} · ${stat.entityId}`}
          >
            <span
              className={cn(
                "text-[10px] font-medium uppercase tracking-wide",
                contentLight ? "text-white/65" : "text-gray-500 dark:text-gray-400"
              )}
            >
              {t(stat.labelKey)}
            </span>
            <span className="tabular-nums text-sm font-semibold">
              {value}
              {unit ? (
                <span
                  className={cn(
                    "ml-0.5 text-[11px] font-medium",
                    contentLight ? "text-white/70" : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {unit}
                </span>
              ) : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}
