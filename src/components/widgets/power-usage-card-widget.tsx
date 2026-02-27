"use client";

import { useQuery } from "@tanstack/react-query";
import { MoreVertical, Zap, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";

function formatKwh(val: number): string {
  if (val >= 1000) return `${(val / 1000).toFixed(1)}MWh`;
  return `${Math.round(val * 10) / 10}Kwh`;
}

/** Converteer entity state naar kWh (ondersteunt kWh, Wh, W). */
function stateToKwh(state: string | undefined, unit: string | undefined): number | null {
  const val = state != null && state !== "unavailable" && state !== "unknown" ? parseFloat(state) : NaN;
  if (Number.isNaN(val)) return null;
  const u = (unit ?? "").toLowerCase();
  if (u === "wh") return val / 1000;
  if (u === "kwh" || u === "kw") return val;
  if (u === "mwh") return val * 1000;
  if (u === "w") return val / 1000; // momentaan vermogen, ruwe schatting als kWh
  return val; // default: assume kWh
}

export function PowerUsageCardWidget({
  title = "Stroomverbruik",
  entity_id,
  cost_per_kwh,
  className,
  onMoreClick,
}: {
  title?: string;
  entity_id?: string;
  cost_per_kwh?: number;
  className?: string;
  onMoreClick?: () => void;
}) {
  const allEntityIds = [entity_id].filter(Boolean);
  const entityState = useEntityStateStore((s) => (entity_id ? s.getState(entity_id) : undefined));
  const currentStateKwh = entity_id ? stateToKwh(entityState?.state, entityState?.attributes?.unit_of_measurement as string) : null;

  const { data: historyData, isLoading } = useQuery({
    queryKey: ["ha-history", allEntityIds.join(",")],
    enabled: allEntityIds.length > 0,
    queryFn: async () => {
      const res = await fetch(`/api/ha/history?entity_ids=${encodeURIComponent(allEntityIds.join(","))}&days=7`);
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json() as Promise<Record<string, { date: string; consumption: number }[]>>;
    },
    staleTime: 60_000,
  });

  const rawMainData = historyData?.[entity_id ?? ""] ?? [];
  const daysToShow = 7;
  const filledDates: string[] = [];
  for (let i = daysToShow - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    filledDates.push(d.toISOString().slice(0, 10));
  }
  const dataByDate = new Map(rawMainData.map((d) => [d.date, d.consumption]));
  const today = filledDates[filledDates.length - 1];
  const mainData = filledDates.map((date) => ({
    date,
    consumption: dataByDate.get(date) ?? 0,
  }));
  const selectedDay = mainData[mainData.length - 1];
  let selectedDayConsumption = selectedDay?.consumption ?? 0;
  if (selectedDayConsumption === 0 && currentStateKwh != null && currentStateKwh >= 0) {
    selectedDayConsumption = currentStateKwh;
    if (today && mainData.length > 0) {
      mainData[mainData.length - 1] = { ...mainData[mainData.length - 1]!, consumption: currentStateKwh };
    }
  }
  const maxVal = Math.max(1, ...mainData.map((d) => d.consumption));
  const totalUsage = mainData.reduce((sum, d) => sum + d.consumption, 0);
  const expense = cost_per_kwh != null ? selectedDayConsumption * cost_per_kwh : null;

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl bg-white/10 dark:bg-black/50 backdrop-blur-2xl text-gray-900 dark:text-white shadow-xl border border-white/20 dark:border-white/10",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10">
        <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
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

      <div className="p-4 space-y-4">
        {allEntityIds.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
            Configureer een totaal-verbruik entity in de bewerkmodus.
          </p>
        ) : (
        <>
        {/* Bar chart - last 7 days */}
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Dagelijks verbruik</p>
          {isLoading ? (
            <div className="h-24 flex items-center justify-center text-gray-400">Laden…</div>
          ) : (
            <div className="flex items-end justify-between gap-1 h-20">
              {mainData.map((d, i) => {
                const date = new Date(d.date);
                const dayName = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"][date.getDay()];
                const isLast = i === mainData.length - 1;
                const frac = maxVal > 0 ? d.consumption / maxVal : 0;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                    <div
                      className={cn(
                        "w-full rounded-t transition-all min-h-[4px]",
                        isLast
                          ? "bg-amber-500 dark:bg-amber-500"
                          : "bg-gray-200 dark:bg-gray-600"
                      )}
                      style={{ height: `${Math.max(4, frac * 64)}px` }}
                    />
                    {isLast && (
                      <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        {formatKwh(d.consumption)}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{dayName}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 p-3 border border-amber-200/50 dark:border-amber-500/20">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
              <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold tabular-nums text-amber-700 dark:text-amber-400">
                {formatKwh(selectedDayConsumption)}
              </p>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/80">Verbruik vandaag</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 p-3 border border-emerald-200/50 dark:border-emerald-500/20">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                {expense != null ? `€${expense.toFixed(2)}` : "—"}
              </p>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">Kosten vandaag</p>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
