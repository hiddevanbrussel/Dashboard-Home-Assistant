"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Home, Pause, Play, Square } from "lucide-react";
import { ValetudoMapCanvas, segmentNameFromLayers } from "@/components/vacuum/valetudo-map-canvas";
import { useTranslation } from "@/hooks/use-translation";
import { useVacuumSession } from "@/hooks/use-vacuum-session";
import {
  clampSegmentIterations,
  formatVacuumAreaM2,
  formatVacuumTimeMin,
  vacuumBasicActionDisabled,
} from "@/lib/valetudo-robot";
import { cn } from "@/lib/utils";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-0 text-center">
      <p className="text-[1.35rem] font-semibold leading-none tracking-tight text-gray-900 dark:text-white">
        {value}
      </p>
      <p className="mt-1.5 text-[11px] font-medium text-gray-400 dark:text-white/45">{label}</p>
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
  } = session;

  const title = robotName || t("vacuum.title");
  const area = formatVacuumAreaM2(stats.areaCm2);
  const minutes = formatVacuumTimeMin(stats.timeSec);
  const selectedNames = selectedIds.map((id) => segmentNameFromLayers(map?.layers ?? [], id));
  const canCleanRooms = selectedIds.length > 0;
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
    <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-1">
      <div className="relative flex items-center justify-center pb-3 pt-1">
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
          <h2 className="truncate text-[17px] font-semibold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-0.5 text-xs font-medium text-gray-400 dark:text-white/45">
            {loaded && configured ? t(statusKey) : "\u00a0"}
          </p>
        </div>
      </div>

      {!configured ? (
        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
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
        <div className="flex flex-1 items-center justify-center py-10 text-center text-sm text-red-600 dark:text-red-300">
          {error}
        </div>
      ) : !map ? (
        <div className="flex flex-1 items-center justify-center py-10 text-sm text-gray-400">
          {t("vacuum.loading")}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 pb-4">
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

          <div className="relative mx-auto h-[240px] w-full max-w-[280px] rounded-[1.35rem] bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)] dark:bg-white/5">
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

          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={cycleIterations}
              className="flex flex-col items-center gap-1"
              aria-label={t("vacuum.cycles")}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-800 shadow-sm dark:border-white/15 dark:bg-white/10 dark:text-white">
                x{iterations}
              </span>
              <span className="text-[11px] font-medium text-gray-400 dark:text-white/45">
                {t("vacuum.cycles")}
              </span>
            </button>

            <div
              role="tablist"
              aria-label={t("vacuum.mode")}
              className="flex rounded-full bg-white p-1 shadow-sm ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10"
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
                      "rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                      selected
                        ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                        : "text-gray-400 hover:text-gray-700 dark:text-white/45 dark:hover:text-white"
                    )}
                  >
                    {t(`vacuum.mode.${mode}`)}
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

          {error ? <p className="mt-2 text-center text-xs text-red-600 dark:text-red-300">{error}</p> : null}

          <div className="mt-4 grid grid-cols-[1.35fr_1fr] gap-2.5">
            <button
              type="button"
              onClick={primary.onClick}
              disabled={primary.disabled}
              className="inline-flex h-[3.35rem] items-center justify-center gap-2 rounded-2xl bg-[#7BA7F5] text-sm font-semibold text-white shadow-sm disabled:opacity-40"
            >
              <primary.icon className="h-4 w-4" />
              {primary.label}
            </button>
            <button
              type="button"
              onClick={() => void sendBasic("home")}
              disabled={vacuumBasicActionDisabled("home", status, busy)}
              className="inline-flex h-[3.35rem] items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-black/5 disabled:opacity-40 dark:bg-white/10 dark:text-white dark:ring-white/10"
            >
              <Home className="h-4 w-4" />
              {t("vacuum.dockShort")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
