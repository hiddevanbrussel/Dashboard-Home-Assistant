"use client";

import { useQuery } from "@tanstack/react-query";
import { MoreVertical, PanelTop, UtilityPole } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import type { SolarCardProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";

function formatValue(value: number | undefined, unit: string): string {
  if (value == null || Number.isNaN(value)) return "—";
  const rounded = Math.round(value * 10) / 10;
  return unit ? `${rounded} ${unit}` : String(rounded);
}

function useEntityValue(entityId: string) {
  const entity = useEntityStateStore((s) => s.getState(entityId));
  const raw = entity?.state;
  const value = raw != null && raw !== "unavailable" && raw !== "unknown" ? Number(raw) : undefined;
  const unit = (entity?.attributes?.unit_of_measurement as string) ?? "W";
  const friendlyName = (entity?.attributes?.friendly_name as string) ?? entityId;
  return { value, unit, friendlyName };
}

export function SolarCardWidget({
  title = "Zonnepanelen",
  entity_id,
  consumption_entity_id,
  size = "md",
  className,
  onMoreClick,
}: SolarCardProps & { className?: string; onMoreClick?: () => void }) {
  const yieldData = useEntityValue(entity_id ?? "");
  const consumptionData = useEntityValue(consumption_entity_id ?? "");

  const { data: hourlyData, isLoading: hourlyLoading } = useQuery({
    queryKey: ["ha-history-hourly", entity_id ?? ""],
    enabled: !!entity_id,
    queryFn: async () => {
      const res = await fetch(
        `/api/ha/history?entity_ids=${encodeURIComponent(entity_id ?? "")}&granularity=hourly`
      );
      if (!res.ok) throw new Error("Failed to fetch hourly history");
      const json = (await res.json()) as Record<string, { hour: string; value: number }[]>;
      return json[entity_id ?? ""] ?? [];
    },
    staleTime: 60_000,
  });

  const rawHourly = hourlyData ?? [];
  const chartData = rawHourly.length > 0
    ? rawHourly
    : Array.from({ length: 24 }, (_, i) => ({
        hour: `${String(i).padStart(2, "0")}:00`,
        value: 0,
      }));

  const todayYield = rawHourly.reduce((sum, d) => sum + d.value, 0);
  const displayYield = todayYield > 0 ? todayYield : yieldData.value;

  const cardBase =
    "rounded-2xl bg-white/10 dark:bg-black/50 backdrop-blur-2xl text-gray-900 dark:text-white shadow-xl border border-white/20 dark:border-white/10 overflow-hidden";

  const hasYieldEntity = !!entity_id;

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      {/* Kaart 1: Opbrengst vandaag (compact) */}
      <div className={cn("relative p-4", cardBase)}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
          <div className="flex items-center gap-1 shrink-0">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20">
              <PanelTop className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            {onMoreClick && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onMoreClick(); }}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
                aria-label="Opties"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        <div className="min-w-0">
          {!hasYieldEntity ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Configureer een opbrengst-entity in de bewerkmodus.</p>
          ) : (
            <>
              <p className="text-lg font-bold tabular-nums text-amber-700 dark:text-amber-400">
                {formatValue(displayYield != null ? displayYield : undefined, yieldData.unit)}
              </p>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/80">Opbrengst vandaag</p>
            </>
          )}
        </div>
      </div>

      {/* Kaart 2: Verbruik vandaag (optioneel) */}
      {consumption_entity_id && (
        <div className={cn("relative p-4", cardBase)}>
          <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500/20">
            <UtilityPole className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="min-w-0 pr-5">
            <p className="text-lg font-bold tabular-nums text-gray-700 dark:text-gray-300">
              {formatValue(consumptionData.value, consumptionData.unit)}
            </p>
            <p className="text-xs text-gray-600/80 dark:text-gray-400/80">Verbruik vandaag</p>
          </div>
        </div>
      )}

      {/* Kaart 3: Lijngrafiek opbrengst per uur */}
      {hasYieldEntity && (
        <div className={cn("p-4", cardBase)}>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Opbrengst per uur</p>
          {hourlyLoading ? (
            <div className="h-24 flex items-center justify-center text-gray-400">Laden…</div>
          ) : (
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 9 }}
                    tickFormatter={(v) => v.slice(0, 2)}
                  />
                  <YAxis hide />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="rgb(245 158 11)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
