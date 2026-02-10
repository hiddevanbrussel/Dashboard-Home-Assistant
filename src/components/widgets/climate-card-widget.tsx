"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { ClimateProps } from "./widget-types";
import { cn, capitalizeFirst } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";

function formatTemp(value: number | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${Math.round(value)}°`;
}

const TEMP_STEP = 0.5;
const TEMP_MIN = 5;
const TEMP_MAX = 35;

export function ClimateCardWidget({
  title = "Climate",
  entity_id,
  size = "md",
  className,
}: ClimateProps & { className?: string }) {
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const setStates = useEntityStateStore((s) => s.setStates);
  const [loading, setLoading] = useState(false);

  const currentTemperature = Number(entity?.attributes?.current_temperature) || undefined;
  const targetTemperature = Number(entity?.attributes?.temperature) ?? Number(entity?.attributes?.target_temp_high) ?? undefined;
  const minTemp = Number(entity?.attributes?.min_temp) || TEMP_MIN;
  const maxTemp = Number(entity?.attributes?.max_temp) || TEMP_MAX;
  const tempStep = Number(entity?.attributes?.target_temp_step) || TEMP_STEP;
  const hvacModes = (entity?.attributes?.hvac_modes as string[] | undefined) ?? [];
  const state = (entity?.state as string | undefined) ?? "";
  const hvacModeFromAttr = entity?.attributes?.hvac_mode as string | undefined;
  const stateToMode: Record<string, string> = {
    heating: "heat",
    cooling: "cool",
    heat: "heat",
    cool: "cool",
    off: "off",
    auto: "auto",
    idle: "auto",
    dry: "dry",
    fan_only: "fan_only",
  };
  const resolvedMode = hvacModeFromAttr ?? stateToMode[state] ?? state;
  const activeHvacMode =
    resolvedMode && hvacModes.includes(resolvedMode) ? resolvedMode : null;

  async function setTemperature(temperature: number) {
    const value = Math.round(temperature / tempStep) * tempStep;
    const clamped = Math.min(maxTemp, Math.max(minTemp, value));
    setLoading(true);
    try {
      const res = await fetch("/api/ha/call-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_id,
          domain: "climate",
          service: "set_temperature",
          service_data: { temperature: clamped },
        }),
      });
      if (res.ok) {
        const data = await fetch("/api/ha/state").then((r) => r.json());
        if (Array.isArray(data)) setStates(data);
      }
    } finally {
      setLoading(false);
    }
  }

  async function setHvacMode(hvac_mode: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/ha/call-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_id,
          domain: "climate",
          service: "set_hvac_mode",
          service_data: { hvac_mode },
        }),
      });
      if (res.ok) {
        const data = await fetch("/api/ha/state").then((r) => r.json());
        if (Array.isArray(data)) setStates(data);
      }
    } finally {
      setLoading(false);
    }
  }

  const targetForButtons = targetTemperature ?? currentTemperature ?? 20;
  const canDecrease = targetForButtons > minTemp;
  const canIncrease = targetForButtons < maxTemp;

  const stateLabel: Record<string, string> = {
    idle: "Idle",
    heating: "Verwarmen",
    cooling: "Koelen",
    off: "Uit",
    heat: "Verwarmen",
    cool: "Koelen",
    auto: "Auto",
    dry: "Droog",
    fan_only: "Alleen ventilator",
    unknown: "—",
  };

  const friendlyName = (entity?.attributes?.friendly_name as string) ?? entity_id;

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl bg-white/10 dark:bg-black/50 text-white shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate text-white/90">{title}</p>
          <p className="text-xs text-white/60 truncate">{friendlyName}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 pt-0">
        <span className="text-5xl font-bold tabular-nums text-white">
          {formatTemp(currentTemperature)}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {hvacModes.length > 0 && (
            <select
              value={activeHvacMode ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                if (v) setHvacMode(v);
              }}
              disabled={loading}
              className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs font-medium text-white focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/30 disabled:opacity-50 [&>option]:bg-gray-800 [&>option]:text-white"
              aria-label="HVAC-modus"
            >
              {hvacModes.map((mode) => (
                <option key={mode} value={mode}>
                  {stateLabel[mode] ?? capitalizeFirst(mode)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 pt-2">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setTemperature(targetForButtons - tempStep)}
            disabled={loading || !canDecrease}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Temperatuur verlagen"
          >
            <Minus className="h-5 w-5" />
          </button>
          <span className="min-w-[4rem] text-center text-lg font-semibold tabular-nums text-white/90">
            {targetTemperature != null
              ? formatTemp(targetTemperature)
              : "—"}
          </span>
          <button
            type="button"
            onClick={() => setTemperature(targetForButtons + tempStep)}
            disabled={loading || !canIncrease}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Temperatuur verhogen"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
