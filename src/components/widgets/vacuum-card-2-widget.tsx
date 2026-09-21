"use client";

import { useRef, useState } from "react";
import {
  AudioLines,
  Battery,
  Clock3,
  Home,
  Leaf,
  MoreVertical,
  Power,
  Settings2,
  Sparkles,
  Zap,
} from "lucide-react";
import type { VacuumCard2Props } from "./widget-types";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useThemeStore } from "@/stores/theme-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  batteryFromAttributes,
  clampVacuumCard2Height,
  clampVacuumCard2Width,
  cleanedAreaM2FromAttributes,
  currentFanSpeedFromAttributes,
  fanModeFromSpeed,
  fanSpeedListFromAttributes,
  isVacuumOn,
  parsePercent,
  progressFromAttributes,
  resolveFanSpeedForMode,
  resolveVacuumCleanedAreaM2,
  resolveVacuumLastCleanAt,
  vacuumCard2ArtSrc,
  vacuumHeadlineKind,
  vacuumRelativeTimeKind,
  vacuumSessionStatusKey,
  VACUUM_CARD_2_FOOTER_MIN_HEIGHT,
  type VacuumFanMode,
} from "@/lib/vacuum-card";
import { useVacuumSession } from "@/hooks/use-vacuum-session";

const MODE_UI: { mode: VacuumFanMode; labelKey: string; Icon: typeof Leaf }[] = [
  { mode: "eco", labelKey: "vacuumCard.eco", Icon: Leaf },
  { mode: "standard", labelKey: "vacuumCard.standard", Icon: AudioLines },
  { mode: "turbo", labelKey: "vacuumCard.turbo", Icon: Zap },
];

function TargetingFrame() {
  return (
    <div className="pointer-events-none absolute inset-[6%] z-20" aria-hidden>
      <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-sky-400" />
      <span className="absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-sky-400" />
      <span className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-sky-400" />
      <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-sky-400" />
    </div>
  );
}

function VacuumRobotArt({ src }: { src: string }) {
  return (
    <div className="relative mx-auto flex max-h-full w-[84%] items-center justify-center">
      <div className="relative max-h-full w-full">
        <TargetingFrame />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="relative z-10 mx-auto max-h-full w-full object-contain" />
      </div>
    </div>
  );
}

export function VacuumCard2Widget({
  title,
  entity_id,
  progress_entity_id,
  background_image,
  size = "md",
  width,
  height,
  className,
  onMoreClick,
  interactive = false,
  onCardClick,
}: VacuumCard2Props & {
  className?: string;
  onMoreClick?: () => void;
  interactive?: boolean;
  onCardClick?: () => void;
}) {
  const { t } = useTranslation();
  const isDark = useThemeStore((s) => s.resolved) === "dark";
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const relatedEntities = useEntityStateStore((s) => Object.values(s.states));
  const progressEntity = useEntityStateStore((s) =>
    progress_entity_id ? s.getState(progress_entity_id) : null
  );
  const valetudo = useVacuumSession({ active: Boolean(entity_id), includeMaintenance: false });
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
        ? t("cardType.vacuum_card_2")
        : t(`vacuumCard.${headlineKind}`);
  const vacuumName =
    title?.trim() ||
    (typeof attrs.friendly_name === "string" && attrs.friendly_name.trim()
      ? attrs.friendly_name
      : t("cardType.vacuum_card_2"));
  const artSrc = vacuumCard2ArtSrc({ backgroundImage: background_image, isDark });
  const cardWidth = clampVacuumCard2Width(width);
  const cardHeight = clampVacuumCard2Height(height);
  const showFooter = cardHeight >= VACUUM_CARD_2_FOOTER_MIN_HEIGHT;
  const lastCleanAt = resolveVacuumLastCleanAt({
    attrs,
    entities: relatedEntities,
    vacuumEntityId: entity_id,
  });
  const lastSession = lastCleanAt
    ? vacuumRelativeTimeKind(lastCleanAt, Date.now())
    : null;
  const lastSessionLabel = lastSession
    ? lastSession.key === "justNow"
      ? t("vacuumCard.justNow")
      : lastSession.key === "hoursAgo" && lastSession.n === 1
        ? t("vacuumCard.hourAgo")
        : lastSession.key === "daysAgo" && lastSession.n === 1
          ? t("vacuumCard.dayAgo")
          : t(`vacuumCard.${lastSession.key}`).replace("{n}", String(lastSession.n))
    : "—";
  const area = resolveVacuumCleanedAreaM2({
    attrs,
    entities: relatedEntities,
    vacuumEntityId: entity_id,
    valetudoAreaCm2: valetudo.stats.areaCm2,
  });
  const areaLabel = area != null ? `${area} m²` : "—";
  const sessionStatusKey = vacuumSessionStatusKey(state);
  const sessionStatusLabel =
    sessionStatusKey === "ready" ? t("vacuumCard.ready") : t(`vacuumCard.${sessionStatusKey}`);

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
        "flex w-full flex-col overflow-hidden rounded-2xl bg-white text-gray-900 shadow-[0_18px_50px_rgba(15,23,42,0.12)] dark:bg-zinc-900 dark:text-white dark:shadow-[0_18px_50px_rgba(0,0,0,0.45)]",
        size === "sm" && "text-sm",
        size === "lg" && "text-lg",
        interactive && "cursor-pointer",
        className
      )}
      style={{ width: cardWidth, height: cardHeight, minHeight: cardHeight }}
      onClick={
        onCardClick
          ? (e) => {
              if ((e.target as HTMLElement).closest?.("button")) return;
              onCardClick();
            }
          : undefined
      }
    >
      <div className="shrink-0 px-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-[1.35rem] font-semibold leading-tight tracking-tight text-gray-950 dark:text-white">
              {vacuumName}
            </h2>
            <p className="mt-0.5 truncate text-sm font-medium text-gray-500 dark:text-white/60">{headline}</p>
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
                "inline-flex items-center gap-1.5 rounded-full px-1.5 py-0.5 text-sm font-semibold transition-colors disabled:opacity-40",
                isOn ? "text-teal-500" : "text-gray-400 dark:text-white/45"
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

        <div className="mt-4 grid grid-cols-3 gap-2">
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
                  "flex min-w-0 flex-col items-center gap-1 rounded-xl px-1.5 py-3 text-[11px] font-medium transition-colors disabled:opacity-60",
                  selected
                    ? "bg-white text-gray-900 shadow-sm ring-2 ring-sky-400 dark:bg-zinc-800 dark:text-white dark:ring-sky-400"
                    : "bg-gray-100 text-gray-400 hover:text-gray-600 dark:bg-white/5 dark:text-white/40 dark:hover:text-white/70"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="truncate">{t(labelKey)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pt-3">
        <VacuumRobotArt src={artSrc} />
        <div className="mt-2 flex flex-col items-center gap-0.5 text-sm font-medium text-gray-700 dark:text-white/85">
          <span className="inline-flex items-center gap-1.5">
            <Home className="h-3.5 w-3.5 text-gray-400 dark:text-white/45" aria-hidden />
            {headline}
          </span>
          {battery != null ? (
            <span
              className="inline-flex items-center gap-1.5 text-gray-500 dark:text-white/60"
              aria-label={t("vacuumCard.battery").replace("{n}", String(battery))}
            >
              <Battery className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
              {t("vacuumCard.batteryShort").replace("{n}", String(battery))}
            </span>
          ) : null}
        </div>
      </div>

      {showFooter ? (
        <div className="grid shrink-0 grid-cols-3 gap-1 border-t border-gray-100 px-3 py-3 dark:border-white/10">
          <FooterStat icon={Clock3} label={t("vacuumCard.lastSession")} value={lastSessionLabel} />
          <FooterStat icon={Sparkles} label={t("vacuumCard.area")} value={areaLabel} />
          <FooterStat icon={Settings2} label={t("vacuumCard.status")} value={sessionStatusLabel} />
        </div>
      ) : null}
    </div>
  );
}

function FooterStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 text-center">
      <div className="flex items-center justify-center gap-1 text-[10px] font-medium text-gray-400 dark:text-white/40">
        <Icon className="h-3 w-3" aria-hidden />
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-0.5 truncate text-xs font-semibold text-gray-800 dark:text-white/85">{value}</p>
    </div>
  );
}
