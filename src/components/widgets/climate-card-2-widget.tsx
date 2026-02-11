"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  Droplets,
  Flame,
  Minus,
  Plus,
  Snowflake,
  Wind,
  MoreVertical,
  Power,
  Thermometer,
} from "lucide-react";
import type { ClimateProps } from "./widget-types";
import { cn, capitalizeFirst } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";

const SELECTOR_STEP = 0.5;

function formatTemp(value: number | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  const rounded = Math.round(value * 2) / 2;
  return rounded % 1 === 0.5 ? `${rounded}°` : `${Math.round(rounded)}°`;
}

const TEMP_MIN = 5;
const TEMP_MAX = 35;

const MODE_CONFIG: { mode: string; label: string; icon: React.ElementType }[] = [
  { mode: "auto", label: "Auto", icon: Thermometer },
  { mode: "heat", label: "Verwarmen", icon: Flame },
  { mode: "off", label: "Uit", icon: Power },
  { mode: "fan_only", label: "Wind", icon: Wind },
  { mode: "cool", label: "Koelen", icon: Snowflake },
];

const STATE_LABELS: Record<string, string> = {
  idle: "Idle",
  heating: "Verwarmen…",
  cooling: "Koelen…",
  off: "Uit",
  heat: "Verwarmen",
  cool: "Koelen",
  auto: "Auto",
  dry: "Droog",
  fan_only: "Ventilator",
  unknown: "—",
};

export function ClimateCard2Widget({
  title = "Air Conditioner",
  entity_id,
  humidity_entity_id,
  size = "md",
  className,
  onMoreClick,
}: ClimateProps & { className?: string; onMoreClick?: () => void }) {
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const humidityEntity = useEntityStateStore((s) =>
    humidity_entity_id ? s.getState(humidity_entity_id) : null
  );
  const setStates = useEntityStateStore((s) => s.setStates);
  const [loading, setLoading] = useState(false);
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const modeButtonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    if (!modeMenuOpen || !modeButtonRef.current) {
      setMenuPosition(null);
      return;
    }
    const rect = modeButtonRef.current.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }, [modeMenuOpen]);

  const currentTemperature = Number(entity?.attributes?.current_temperature) || undefined;
  const targetTemperature = Number(entity?.attributes?.temperature) ?? Number(entity?.attributes?.target_temp_high) ?? undefined;
  const minTemp = Number(entity?.attributes?.min_temp) || TEMP_MIN;
  const maxTemp = Number(entity?.attributes?.max_temp) || TEMP_MAX;
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
    resolvedMode && hvacModes.includes(resolvedMode) ? resolvedMode : hvacModes[0] ?? null;
  const isOff = state === "off" || !state;

  const displayTemp = targetTemperature ?? currentTemperature ?? 20;

  const setTemperature = useCallback(
    async (temperature: number) => {
      const rounded = Math.round(temperature * 2) / 2;
      const clamped = Math.min(maxTemp, Math.max(minTemp, rounded));
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
    },
    [entity_id, maxTemp, minTemp, setStates]
  );

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

  async function setPower(on: boolean) {
    setLoading(true);
    try {
      const service = on ? "turn_on" : "turn_off";
      const res = await fetch("/api/ha/call-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity_id, domain: "climate", service }),
      });
      if (res.ok) {
        const data = await fetch("/api/ha/state").then((r) => r.json());
        if (Array.isArray(data)) setStates(data);
      }
    } finally {
      setLoading(false);
    }
  }

  const availableModes = MODE_CONFIG.filter((c) => hvacModes.includes(c.mode));
  if (availableModes.length < hvacModes.length) {
    const configuredModes = new Set(availableModes.map((c) => c.mode));
    availableModes.push(
      ...hvacModes
        .filter((mode) => !configuredModes.has(mode))
        .map((mode) => ({
          mode,
          label: STATE_LABELS[mode] ?? capitalizeFirst(mode),
          icon: Thermometer as React.ElementType,
        }))
    );
  }

  const friendlyName = (entity?.attributes?.friendly_name as string) ?? entity_id;
  const humidityFromAttr =
    entity?.attributes?.humidity != null ? Number(entity.attributes.humidity) : undefined;
  const humidityFromSensor =
    humidityEntity?.state != null && humidityEntity.state !== "unavailable"
      ? Number(humidityEntity.state)
      : undefined;
  const humidity = humidityFromSensor ?? humidityFromAttr;
  const showHumidity = humidity != null && !Number.isNaN(humidity);

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl bg-white/15 dark:bg-black/50 text-gray-900 dark:text-white shadow-xl backdrop-blur-2xl border border-white/30 dark:border-white/10",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
    >
      {/* Header: icon + title + entity | luchtvochtigheid | more */}
      <div className="flex items-start justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 dark:bg-white/10">
            <Thermometer className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate text-gray-900 dark:text-white/90">{title}</p>
            <p className="text-xs text-gray-500 dark:text-white/60 truncate">{friendlyName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {showHumidity && (
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-white/90" title="Luchtvochtigheid">
              <Droplets className="h-4 w-4" aria-hidden />
              <span className="text-sm tabular-nums">{Math.round(humidity)}%</span>
            </div>
          )}
          {onMoreClick && (
            <button
              type="button"
              onClick={onMoreClick}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-white/20 dark:text-gray-400 dark:hover:bg-white/10"
              aria-label="More options"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Temperatuur met - en + */}
      <div className="px-4 py-3 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setTemperature(displayTemp - SELECTOR_STEP)}
          disabled={loading || isOff || displayTemp <= minTemp}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200/60 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-300/60 dark:hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Temperatuur verlagen"
        >
          <Minus className="h-6 w-6" />
        </button>
        <p className="text-5xl font-bold tabular-nums text-gray-900 dark:text-white min-w-[4.5rem] text-center">
          {formatTemp(displayTemp)}
        </p>
        <button
          type="button"
          onClick={() => setTemperature(displayTemp + SELECTOR_STEP)}
          disabled={loading || isOff || displayTemp >= maxTemp}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200/60 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-300/60 dark:hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Temperatuur verhogen"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* Eén modusknop: toont huidige modus, bij klik alleen andere modi om naartoe te wisselen */}
      {availableModes.length > 0 && (() => {
        const currentMode = isOff ? "off" : activeHvacMode;
        const current = availableModes.find((m) => m.mode === currentMode) ?? availableModes[0];
        const otherModes = availableModes.filter((m) => m.mode !== currentMode);
        const offOption = MODE_CONFIG.find((m) => m.mode === "off");
        const dropdownOptions =
          currentMode === "off"
            ? otherModes
            : [...otherModes, ...(offOption && !otherModes.some((m) => m.mode === "off") ? [offOption] : [])];
        const canChangeMode = dropdownOptions.length > 0;
        return (
          <div className="px-4 pb-4 pt-1 relative">
            <button
              ref={modeButtonRef}
              type="button"
              onClick={() => setModeMenuOpen((v) => !v)}
              disabled={loading || !canChangeMode}
              aria-expanded={modeMenuOpen}
              aria-haspopup="listbox"
              className={cn(
                "w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-sm font-medium transition-colors disabled:opacity-50",
                "bg-gray-200/60 dark:bg-white/10 text-gray-800 dark:text-white hover:bg-gray-300/60 dark:hover:bg-white/20"
              )}
            >
              {(() => {
                const Icon = current.icon;
                return (
                  <>
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="truncate">{current.label}</span>
                    <ChevronDown
                      className={cn("h-4 w-4 shrink-0 transition-transform", modeMenuOpen && "rotate-180")}
                      aria-hidden
                    />
                  </>
                );
              })()}
            </button>
            {modeMenuOpen && canChangeMode && menuPosition &&
              typeof document !== "undefined" &&
              createPortal(
                <>
                  <div
                    className="fixed inset-0 z-[100]"
                    aria-hidden
                    onClick={() => setModeMenuOpen(false)}
                  />
                  <ul
                    role="listbox"
                    className="fixed z-[101] rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/50 dark:backdrop-blur-xl shadow-lg py-1 max-h-48 overflow-auto"
                    style={{
                      top: menuPosition.top,
                      left: menuPosition.left,
                      width: menuPosition.width,
                    }}
                  >
                    {dropdownOptions.map(({ mode, label, icon: Icon }) => (
                      <li key={mode} role="option">
                        <button
                          type="button"
                          onClick={() => {
                            if (mode === "off") setPower(false);
                            else setHvacMode(mode);
                            setModeMenuOpen(false);
                          }}
                          disabled={loading}
                          className="w-full flex items-center gap-2 rounded-lg py-2 px-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                        >
                          <Icon className="h-4 w-4 shrink-0" aria-hidden />
                          {label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>,
                document.body
              )}
          </div>
        );
      })()}
    </div>
  );
}
