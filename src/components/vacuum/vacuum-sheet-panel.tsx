"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Home, Pause, Play, Square } from "lucide-react";
import { ValetudoMapCanvas, segmentNameFromLayers } from "@/components/vacuum/valetudo-map-canvas";
import { useTranslation } from "@/hooks/use-translation";
import { useVacuumSession } from "@/hooks/use-vacuum-session";
import {
  clampSegmentIterations,
  fanPresetLabelKey,
  formatVacuumAreaM2,
  formatVacuumTimeMin,
  vacuumBasicActionDisabled,
} from "@/lib/valetudo-robot";
import { cn } from "@/lib/utils";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-0 text-center">
      <p className="text-[1.45rem] font-semibold leading-none tracking-tight text-gray-800 dark:text-white">
        {value}
      </p>
      <p className="mt-1.5 break-words px-0.5 text-[11px] font-medium leading-tight text-gray-400 dark:text-white/45">{label}</p>
    </div>
  );
}

export function VacuumSheetPanel({ onClose }: { onClose?: () => void }) {
  const { t } = useTranslation();
  const [cleanMode, setCleanMode] = useState<"full" | "rooms">("rooms");
  const session = useVacuumSession({ active: true, includeMaintenance: false });
  const {
    configured,
    map,
    selectedIds,
    error,
    busy,
    loaded,
    iterations,
    iterationMax,
    setIterations,
    status,
    battery,
    statusKey,
    toggleSegment,
    sendBasic,
    cleanSelected,
    stats,
    robotName,
    fanPresets,
    fanSpeed,
    fanBusy,
    setFanPreset,
  } = session;

  const title = robotName || t("vacuum.title");
  const area = formatVacuumAreaM2(stats.areaCm2);
  const minutes = formatVacuumTimeMin(stats.timeSec);
  const selectedNames = selectedIds.map((id) => segmentNameFromLayers(map?.layers ?? [], id));
  const canCleanRooms = selectedIds.length > 0;
  const showFan = fanPresets.length > 0;
  const primary =
    status === "cleaning"
      ? {
          label: t("vacuum.pause"),
          icon: Pause,
          disabled: vacuumBasicActionDisabled("pause", status, busy),
          onClick: () => void sendBasic("pause"),
        }
      : status === "paused"
        ? {
            label: t("vacuum.resume"),
            icon: Play,
            disabled: busy,
            onClick: () => void sendBasic("start"),
          }
        : cleanMode === "full"
          ? {
              label: t("vacuum.start"),
              icon: Play,
              disabled: busy,
              onClick: () => void sendBasic("start"),
            }
          : {
              label: t("vacuum.clean"),
              icon: Play,
              disabled: busy || !canCleanRooms,
              onClick: () => void cleanSelected(),
            };

  function cycleIterations() {
    const options = Math.max(1, iterationMax);
    setIterations(clampSegmentIterations((iterations % options) + 1, options));
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-1 pt-1">
        <div className="relative flex items-center justify-center pb-4 pt-1">
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
              aria-label={t("vacuum.close")}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : null}
          <div className="min-w-0 px-12 text-center">
            <h2 className="truncate text-[17px] font-semibold tracking-tight text-gray-800 dark:text-white">
              {title}
            </h2>
            <p className="mt-0.5 text-xs font-medium text-gray-400 dark:text-white/45">
              {loaded && configured ? t(statusKey) : "\u00a0"}
            </p>
          </div>
        </div>

        {!configured ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="max-w-[16rem] text-sm text-gray-500 dark:text-white/60">{t("vacuum.notConfigured")}</p>
            <Link
              href="/settings"
              onClick={onClose}
              className="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
            >
              {t("vacuum.openSettings")}
            </Link>
          </div>
        ) : error && !map ? (
          <div className="flex items-center justify-center py-10 text-center text-sm text-red-600 dark:text-red-300">
            {error}
          </div>
        ) : !map ? (
          <div className="flex items-center justify-center py-10 text-sm text-gray-400">{t("vacuum.loading")}</div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 pb-5">
              <Stat
                value={area ? t("vacuum.stat.areaValue").replace("{n}", area) : "—"}
                label={t("vacuum.stat.area")}
              />
              <Stat
                value={
                  typeof battery === "number"
                    ? t("vacuum.stat.batteryValue").replace("{n}", String(battery))
                    : "—"
                }
                label={t("vacuum.stat.battery")}
              />
              <Stat
                value={minutes ? t("vacuum.stat.timeValue").replace("{n}", minutes) : "—"}
                label={t("vacuum.stat.time")}
              />
            </div>

            <div className="relative mx-auto h-[220px] w-full max-w-[340px]">
              <ValetudoMapCanvas
                map={map}
                selectedIds={cleanMode === "rooms" ? selectedIds : []}
                onToggleSegment={(id) => {
                  if (cleanMode !== "rooms") setCleanMode("rooms");
                  toggleSegment(id);
                }}
                appearance="card"
                showLabels={false}
              />
            </div>

            <p className="mt-2 min-h-5 text-center text-xs font-medium text-gray-400 dark:text-white/45">
              {cleanMode === "rooms"
                ? selectedNames.length === 0
                  ? t("vacuum.pickRooms")
                  : selectedNames.join(" · ")
                : t("vacuum.mode.fullHint")}
            </p>

            {showFan ? (
              <div
                role="group"
                aria-label={t("vacuum.fan")}
                className="mt-3 grid gap-1.5"
                style={{ gridTemplateColumns: `repeat(${Math.min(fanPresets.length, 5)}, minmax(0, 1fr))` }}
              >
                {fanPresets.map((preset) => {
                  const selected = fanSpeed === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      disabled={fanBusy}
                      onClick={() => void setFanPreset(preset)}
                      className={cn(
                        "min-w-0 truncate rounded-full px-2 py-2 text-[11px] font-semibold transition disabled:opacity-50",
                        selected
                          ? "bg-[#8AA8F7] text-white shadow-sm"
                          : "bg-white text-gray-700 shadow-sm ring-1 ring-black/5 hover:bg-white/90 dark:bg-white/10 dark:text-white dark:ring-white/10"
                      )}
                    >
                      {t(fanPresetLabelKey(preset))}
                    </button>
                  );
                })}
              </div>
            ) : null}

            <div className="mt-3 flex items-center justify-between gap-3 pb-4">
              <button
                type="button"
                onClick={cycleIterations}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-800 shadow-sm dark:border-white/15 dark:bg-white/10 dark:text-white"
                aria-label={`${t("vacuum.cycles")}: x${iterations}`}
              >
                x{iterations}
              </button>

              <div className="flex items-center gap-2">
                <div
                  role="tablist"
                  aria-label={t("vacuum.mode")}
                  className="flex items-center rounded-full bg-white px-1.5 py-1 shadow-sm ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10"
                >
                  {(["full", "rooms"] as const).map((mode) => {
                    const selected = cleanMode === mode;
                    return (
                      <button
                        key={mode}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setCleanMode(mode)}
                        className={cn(
                          "relative rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                          selected
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-400 hover:text-gray-600 dark:text-white/45 dark:hover:text-white"
                        )}
                      >
                        {t(`vacuum.mode.${mode}`)}
                        {selected ? (
                          <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[#7BA7F5]" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => void sendBasic("stop")}
                  disabled={vacuumBasicActionDisabled("stop", status, busy)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm disabled:opacity-35 dark:border-white/15 dark:bg-white/10 dark:text-white"
                  aria-label={t("vacuum.stop")}
                >
                  <Square className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {configured && map ? (
        <div className="shrink-0 bg-[#E4ECFB] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 dark:bg-brand/20">
          {error ? <p className="mb-2 text-center text-xs text-red-600 dark:text-red-300">{error}</p> : null}
          <div className="grid grid-cols-[1.45fr_1fr] gap-2.5">
            <button
              type="button"
              onClick={primary.onClick}
              disabled={primary.disabled}
              className="inline-flex h-[3.4rem] items-center justify-center gap-2 rounded-2xl bg-[#8AA8F7] text-sm font-semibold text-white shadow-sm disabled:opacity-40"
            >
              <primary.icon className="h-4 w-4" />
              {primary.label}
            </button>
            <button
              type="button"
              onClick={() => void sendBasic("home")}
              disabled={vacuumBasicActionDisabled("home", status, busy)}
              className="inline-flex h-[3.4rem] items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-gray-800 shadow-sm disabled:opacity-40 dark:bg-white/10 dark:text-white"
            >
              <Home className="h-4 w-4" />
              {t("vacuum.dockShort")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
