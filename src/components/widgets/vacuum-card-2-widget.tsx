"use client";

import { useRef, useState } from "react";
import {
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  BatteryWarning,
  Leaf,
  MoreVertical,
  Power,
  AudioLines,
  Zap,
} from "lucide-react";
import type { VacuumCard2Props } from "./widget-types";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  batteryFromAttributes,
  currentFanSpeedFromAttributes,
  fanModeFromSpeed,
  fanSpeedListFromAttributes,
  isVacuumOn,
  parsePercent,
  progressFromAttributes,
  resolveFanSpeedForMode,
  vacuumHeadlineKind,
  type VacuumFanMode,
} from "@/lib/vacuum-card";

const MODE_UI: { mode: VacuumFanMode; labelKey: string; Icon: typeof Leaf }[] = [
  { mode: "eco", labelKey: "vacuumCard.eco", Icon: Leaf },
  { mode: "standard", labelKey: "vacuumCard.standard", Icon: AudioLines },
  { mode: "turbo", labelKey: "vacuumCard.turbo", Icon: Zap },
];

function BatteryIcon({ level, className }: { level: number; className?: string }) {
  if (level >= 80) return <BatteryFull className={className} aria-hidden />;
  if (level >= 45) return <BatteryMedium className={className} aria-hidden />;
  if (level >= 20) return <BatteryLow className={className} aria-hidden />;
  return <BatteryWarning className={className} aria-hidden />;
}

function VacuumRobotArt({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 320 156" className="h-full w-full" aria-hidden>
      <ellipse cx="160" cy="178" rx="168" ry="168" className="fill-[#eef1f4] dark:fill-zinc-700" />
      <ellipse cx="118" cy="86" rx="86" ry="52" className="fill-white/70 dark:fill-white/10" />
      <ellipse
        cx="160"
        cy="178"
        rx="164"
        ry="164"
        fill="none"
        className="stroke-black/[0.06] dark:stroke-white/10"
        strokeWidth="2"
      />
      <circle
        cx="160"
        cy="42"
        r="5"
        className={active ? "fill-emerald-400" : "fill-gray-300 dark:fill-white/25"}
      >
        {active ? (
          <animate attributeName="opacity" values="1;0.45;1" dur="1.6s" repeatCount="indefinite" />
        ) : null}
      </circle>
      <circle cx="160" cy="108" r="46" className="fill-gray-200/90 dark:fill-white/10" />
      <circle cx="160" cy="108" r="36" className="fill-white dark:fill-white/20" />
      <circle cx="160" cy="108" r="36" fill="none" className="stroke-black/5 dark:stroke-white/15" strokeWidth="1.5" />
    </svg>
  );
}

export function VacuumCard2Widget({
  title,
  entity_id,
  progress_entity_id,
  background_image,
  size = "md",
  className,
  onMoreClick,
}: VacuumCard2Props & { className?: string; onMoreClick?: () => void }) {
  const { t } = useTranslation();
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const progressEntity = useEntityStateStore((s) =>
    progress_entity_id ? s.getState(progress_entity_id) : null
  );
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);
  const revertEntityState = useEntityStateStore((s) => s.revertEntityState);
  const requestRefresh = useEntityStateStore((s) => s.requestRefresh);
  const pendingRef = useRef(false);
  const [busyMode, setBusyMode] = useState<VacuumFanMode | null>(null);

  const state = (entity?.state as string | undefined) ?? "";
  const attrs = entity?.attributes ?? {};
  const battery = batteryFromAttributes(attrs);
  const progress = parsePercent(progressEntity?.state) ?? progressFromAttributes(attrs);
  const fanList = fanSpeedListFromAttributes(attrs);
  const fanSpeed = currentFanSpeedFromAttributes(attrs);
  const activeMode = fanModeFromSpeed(fanSpeed, fanList);
  const isOn = isVacuumOn(state);
  const headlineKind = vacuumHeadlineKind(state, progress);
  const headline =
    headlineKind === "cleaningProgress"
      ? t("vacuumCard.cleaningProgress").replace("{n}", String(progress ?? 0))
      : headlineKind === "unknown"
        ? title || t("cardType.vacuum_card_2")
        : t(`vacuumCard.${headlineKind}`);

  async function callVacuum(service: string, serviceData?: Record<string, unknown>) {
    const res = await fetch("/api/ha/call-service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity_id,
        domain: "vacuum",
        service,
        service_data: serviceData,
      }),
    });
    if (!res.ok) throw new Error(`call-service failed: ${res.status}`);
  }

  function handlePower() {
    if (!entity_id || pendingRef.current) return;
    pendingRef.current = true;
    const previous = entity;
    const nextState = isOn ? "returning" : "cleaning";
    updateEntityState(entity_id, { state: nextState });
    callVacuum(isOn ? "return_to_base" : "start")
      .then(() => requestRefresh())
      .catch(() => revertEntityState(entity_id, previous))
      .finally(() => {
        pendingRef.current = false;
      });
  }

  function handleMode(mode: VacuumFanMode) {
    if (!entity_id || pendingRef.current) return;
    const fan_speed = resolveFanSpeedForMode(mode, fanList);
    pendingRef.current = true;
    setBusyMode(mode);
    const previous = entity;
    updateEntityState(entity_id, {
      attributes: { ...attrs, fan_speed },
    });
    callVacuum("set_fan_speed", { fan_speed })
      .then(() => requestRefresh())
      .catch(() => revertEntityState(entity_id, previous))
      .finally(() => {
        pendingRef.current = false;
        setBusyMode(null);
      });
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-[2.25rem] bg-white text-gray-900 shadow-[0_18px_50px_rgba(15,23,42,0.12)] dark:bg-zinc-900 dark:text-white dark:shadow-[0_18px_50px_rgba(0,0,0,0.45)]",
        size === "sm" && "text-sm",
        size === "lg" && "text-lg",
        className
      )}
    >
      <div className="px-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {battery != null ? (
              <div className="mb-1 flex items-center gap-1.5 text-[13px] font-medium text-gray-500 dark:text-white/60">
                <span className="tabular-nums">{battery}%</span>
                <BatteryIcon level={battery} className="h-4 w-4 text-teal-500" />
              </div>
            ) : (
              <p className="mb-1 truncate text-[13px] font-medium text-gray-400 dark:text-white/40">
                {title || t("cardType.vacuum_card_2")}
              </p>
            )}
            <h2 className="truncate text-[1.35rem] font-semibold leading-tight tracking-tight text-gray-950 dark:text-white">
              {headline}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-1 pt-0.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePower();
              }}
              disabled={!entity_id}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-1 py-0.5 text-sm font-semibold transition-colors disabled:opacity-40",
                isOn ? "text-teal-500" : "text-gray-400 dark:text-white/40"
              )}
              aria-label={isOn ? t("vacuumCard.powerOff") : t("vacuumCard.powerOn")}
              aria-pressed={isOn}
            >
              <Power className="h-5 w-5" aria-hidden />
              {isOn ? t("vacuumCard.on") : t("vacuumCard.off")}
            </button>
            {onMoreClick ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoreClick();
                }}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label={t("common.options")}
              >
                <MoreVertical className="h-5 w-5" aria-hidden />
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex rounded-[1.35rem] bg-gray-100 p-1 dark:bg-white/10">
          {MODE_UI.map(({ mode, labelKey, Icon }) => {
            const selected = activeMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMode(mode);
                }}
                disabled={!entity_id || busyMode != null}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[1.1rem] px-2 py-2.5 text-[11px] font-medium transition-colors disabled:opacity-60",
                  selected
                    ? "bg-gray-200 text-gray-800 shadow-sm dark:bg-white/20 dark:text-white"
                    : "text-gray-400 hover:text-gray-600 dark:text-white/40 dark:hover:text-white/70"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="truncate">{t(labelKey)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative mt-2 h-[9.75rem] overflow-hidden">
        {background_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={background_image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        ) : (
          <VacuumRobotArt active={isOn} />
        )}
      </div>
    </div>
  );
}
