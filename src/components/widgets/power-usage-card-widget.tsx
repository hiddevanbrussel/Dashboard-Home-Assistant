"use client";

import { useQuery } from "@tanstack/react-query";
import { MoreVertical, Zap, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

function formatKwh(val: number): string {
  if (val >= 1000) return `${(val / 1000).toFixed(1)}MWh`;
  return `${Math.round(val * 10) / 10}Kwh`;
}

export function PowerUsageCardWidget({
  title = "Stroomverbruik",
  entity_id,
  device_entity_ids = [],
  cost_per_kwh,
  className,
  onMoreClick,
}: {
  title?: string;
  entity_id?: string;
  device_entity_ids?: string[];
  cost_per_kwh?: number;
  className?: string;
  onMoreClick?: () => void;
}) {
  const allEntityIds = [entity_id, ...(device_entity_ids ?? [])].filter(Boolean);

  const { data: entitiesData } = useQuery({
    queryKey: ["ha-state"],
    queryFn: async () => {
      const res = await fetch("/api/ha/state");
      if (!res.ok) return [];
      const arr = await res.json();
      return Array.isArray(arr) ? arr : [];
    },
    staleTime: 30_000,
  });

  const getEntityName = (eid: string) => {
    const e = entitiesData?.find((x: { entity_id: string }) => x.entity_id === eid);
    return (e?.attributes?.friendly_name as string) ?? eid;
  };
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
  const today = new Date().toISOString().slice(0, 10);
  const filledDates: string[] = [];
  for (let i = daysToShow - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    filledDates.push(d.toISOString().slice(0, 10));
  }
  const dataByDate = new Map(rawMainData.map((d) => [d.date, d.consumption]));
  const mainData = filledDates.map((date) => ({
    date,
    consumption: dataByDate.get(date) ?? 0,
  }));
  const maxVal = Math.max(1, ...mainData.map((d) => d.consumption));
  const totalUsage = mainData.reduce((sum, d) => sum + d.consumption, 0);
  const selectedDay = mainData[mainData.length - 1];
  const selectedDayConsumption = selectedDay?.consumption ?? 0;
  const expense = cost_per_kwh != null ? selectedDayConsumption * cost_per_kwh : null;

  const deviceConsumption: { entity_id: string; name: string; consumption: number }[] = [];
  for (const eid of device_entity_ids) {
    const devData = historyData?.[eid] ?? [];
    const last = devData[devData.length - 1];
    if (last) {
      deviceConsumption.push({
        entity_id: eid,
        name: getEntityName(eid),
        consumption: last.consumption,
      });
    }
  }
  deviceConsumption.sort((a, b) => b.consumption - a.consumption);

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xl border border-gray-200 dark:border-white/10",
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
                {expense != null ? `€${expense.toFixed(3)}` : "—"}
              </p>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">Kosten vandaag</p>
            </div>
          </div>
        </div>

        {/* Device usage */}
        {(device_entity_ids?.length ?? 0) > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Verbruik per apparaat</p>
            <div className="space-y-2 max-h-32 overflow-auto">
              {deviceConsumption.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400">Geen data beschikbaar</p>
              ) : (
                deviceConsumption.map(({ entity_id: eid, name, consumption }) => (
                  <div
                    key={eid}
                    className="flex items-center justify-between gap-2 rounded-lg bg-gray-100 dark:bg-white/5 px-3 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-8 w-8 shrink-0 rounded-lg bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      <span className="text-sm font-medium truncate text-gray-900 dark:text-white">{name}</span>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-amber-600 dark:text-amber-400 shrink-0">
                      {formatKwh(consumption)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
