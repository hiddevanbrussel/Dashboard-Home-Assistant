"use client";

import { useQuery } from "@tanstack/react-query";
import { MoreVertical, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

function formatKwh(val: number): string {
  if (val >= 1000) return `${(val / 1000).toFixed(1)}MWh`;
  return `${Math.round(val * 10) / 10}Kwh`;
}

export function DeviceConsumptionCardWidget({
  title = "Verbruik per apparaat",
  device_entity_ids = [],
  device_names,
  className,
  onMoreClick,
}: {
  title?: string;
  device_entity_ids?: string[];
  device_names?: Record<string, string>;
  className?: string;
  onMoreClick?: () => void;
}) {
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
    if (device_names?.[eid]?.trim()) return device_names[eid].trim();
    const e = entitiesData?.find((x: { entity_id: string }) => x.entity_id === eid);
    return (e?.attributes?.friendly_name as string) ?? eid;
  };

  const { data: historyData, isLoading } = useQuery({
    queryKey: ["ha-history", device_entity_ids.join(",")],
    enabled: device_entity_ids.length > 0,
    queryFn: async () => {
      const res = await fetch(`/api/ha/history?entity_ids=${encodeURIComponent(device_entity_ids.join(","))}&days=7`);
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json() as Promise<Record<string, { date: string; consumption: number }[]>>;
    },
    staleTime: 60_000,
  });

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
        "flex w-full flex-col overflow-hidden rounded-2xl bg-white/10 dark:bg-black/50 backdrop-blur-2xl text-gray-900 dark:text-white shadow-xl border border-white/20 dark:border-white/10",
        className
      )}
    >
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

      <div className="p-4">
        {device_entity_ids.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
            Configureer apparaten in de bewerkmodus.
          </p>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-8 text-gray-400">Laden…</div>
        ) : deviceConsumption.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
            Geen data beschikbaar
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-auto">
            {deviceConsumption.map(({ entity_id: eid, name, consumption }) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
