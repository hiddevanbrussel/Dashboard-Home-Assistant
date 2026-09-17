"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Home, Pause, Play, Square } from "lucide-react";
import { VacuumSidePanel } from "@/components/vacuum/vacuum-side-panel";
import { VacuumSheetPanel } from "@/components/vacuum/vacuum-sheet-panel";
import { ValetudoMapCanvas, segmentNameFromLayers } from "@/components/vacuum/valetudo-map-canvas";
import { useTranslation } from "@/hooks/use-translation";
import { useVacuumSession } from "@/hooks/use-vacuum-session";
import {
  clampSegmentIterations,
  segmentIterationOptions,
  vacuumBasicActionDisabled,
} from "@/lib/valetudo-robot";
import { cn } from "@/lib/utils";

function ControlButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-black/10 text-gray-800 disabled:opacity-40 dark:bg-white/10 dark:text-white"
      aria-label={label}
    >
      {children}
    </button>
  );
}

export function VacuumControlView({
  variant = "page",
  onClose,
}: {
  variant?: "page" | "sheet";
  onClose?: () => void;
}) {
  if (variant === "sheet") return <VacuumSheetPanel onClose={onClose} />;
  return <VacuumPageControls />;
}

function VacuumPageControls() {
  const { t } = useTranslation();
  const session = useVacuumSession({ active: true, includeMaintenance: true });
  const {
    configured,
    map,
    selectedIds,
    error,
    busy,
    loaded,
    fanPresets,
    fanBusy,
    fanSpeed,
    sortedConsumables,
    consumableMeta,
    resettingKey,
    iterations,
    iterationMax,
    setIterations,
    status,
    battery,
    statusKey,
    rooms,
    toggleSegment,
    sendBasic,
    setFanPreset,
    resetConsumable,
    cleanSelected,
  } = session;
  const selectedNames = selectedIds.map((id) => segmentNameFromLayers(map?.layers ?? [], id));

  const statusLine =
    loaded && configured ? (
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {t(statusKey)}
        {typeof battery === "number" ? ` · ${battery}%` : ""}
      </p>
    ) : null;

  const basicButtons =
    configured && map ? (
      <div className="flex flex-wrap items-center gap-2">
        <ControlButton
          label={t("vacuum.pause")}
          disabled={vacuumBasicActionDisabled("pause", status, busy)}
          onClick={() => void sendBasic("pause")}
        >
          <Pause className="h-4 w-4" />
        </ControlButton>
        <ControlButton
          label={t("vacuum.stop")}
          disabled={vacuumBasicActionDisabled("stop", status, busy)}
          onClick={() => void sendBasic("stop")}
        >
          <Square className="h-4 w-4" />
        </ControlButton>
        <ControlButton
          label={t("vacuum.dock")}
          disabled={vacuumBasicActionDisabled("home", status, busy)}
          onClick={() => void sendBasic("home")}
        >
          <Home className="h-4 w-4" />
        </ControlButton>
      </div>
    ) : null;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {t("vacuum.title")}
          </h1>
          {statusLine}
        </div>
        {basicButtons}
      </div>
      {!configured ? (
        <div className="flex flex-1 items-center justify-center rounded-card border border-white/60 bg-white/40 p-8 text-center dark:border-white/10 dark:bg-white/5">
          <div className="max-w-sm space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">{t("vacuum.notConfigured")}</p>
            <Link href="/settings" className="inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
              {t("vacuum.openSettings")}
            </Link>
          </div>
        </div>
      ) : error && !map ? (
        <div className="flex flex-1 items-center justify-center rounded-card border border-red-200 bg-red-50 p-8 text-center text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-100">
          {error}
        </div>
      ) : map ? (
        <>
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden lg:flex-row">
            <div className="relative min-h-[32vh] flex-1 overflow-hidden">
              <ValetudoMapCanvas map={map} selectedIds={selectedIds} onToggleSegment={toggleSegment} />
            </div>
            <VacuumSidePanel
              fanPresets={fanPresets}
              fanSpeed={fanSpeed}
              fanBusy={fanBusy}
              onFanPreset={(preset) => void setFanPreset(preset)}
              consumables={sortedConsumables}
              consumableMeta={consumableMeta}
              resettingKey={resettingKey}
              onResetConsumable={(item) => void resetConsumable(item)}
            />
          </div>
          {error ? <p className="text-sm text-red-600 dark:text-red-300">{error}</p> : null}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-white/60 bg-white/50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {selectedNames.length === 0 ? t("vacuum.pickRooms") : selectedNames.join(", ")}
              </p>
              {iterationMax > 1 ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{t("vacuum.iterations")}</span>
                  <div role="radiogroup" aria-label={t("vacuum.iterations")} className="flex flex-wrap gap-1.5">
                    {segmentIterationOptions(iterationMax).map((count) => {
                      const selected = iterations === count;
                      return (
                        <button
                          key={count}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setIterations(clampSegmentIterations(count, iterationMax))}
                          className={cn(
                            "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                            selected
                              ? "bg-brand text-white shadow-sm"
                              : "bg-white/70 text-gray-800 hover:bg-white dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                          )}
                        >
                          {t("vacuum.iterationsCount").replace("{n}", String(count))}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => void cleanSelected()}
              disabled={busy || selectedIds.length === 0}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-40"
            >
              <Play className="h-4 w-4" />
              {t("vacuum.clean")}
            </button>
          </div>
          {rooms.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("vacuum.noRooms")}</p>
          ) : null}
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          {t("vacuum.loading")}
        </div>
      )}
    </div>
  );
}
