"use client";

import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  footballMatchHasContent,
  formatTeamtrackerMatchDay,
  readTeamtrackerMatch,
  teamtrackerStatusLabel,
} from "@/lib/teamtracker-card";
import type { TeamtrackerCardProps } from "./widget-types";

function TeamLogo({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "image-theme-fixed flex shrink-0 items-center justify-center rounded-full bg-black/5 ring-1 ring-black/5",
          className ?? "h-14 w-14"
        )}
        aria-hidden
      />
    );
  }
  const url = src.startsWith("http") || src.startsWith("/") ? src : src;
  return (
    <div
      className={cn(
        "image-theme-fixed flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/70 shadow-sm ring-1 ring-black/5",
        className ?? "h-14 w-14"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Dynamic HA Team Tracker logo URL */}
      <img
        src={url}
        alt={alt}
        className="h-full w-full object-contain p-1.5"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}

function StatusBadge({
  label,
  isLive,
  status,
}: {
  label: string;
  isLive: boolean;
  status: string;
}) {
  if (isLive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-[#F05A5A] px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow-sm">
        {label}
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        status === "PRE"
          ? "bg-black/80 text-white"
          : status === "POST"
            ? "bg-black/15 text-black/70"
            : "bg-black/10 text-black/60"
      )}
    >
      {label}
    </span>
  );
}

export function TeamtrackerCardWidget({
  title,
  entity_id,
  className,
  onMoreClick,
}: TeamtrackerCardProps & { className?: string; onMoreClick?: () => void }) {
  const { t } = useTranslation();
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const match = readTeamtrackerMatch(entity);
  const hasContent = footballMatchHasContent(match);

  const status = match?.status ?? "";
  const isLive = status === "IN";
  const statusLabel = teamtrackerStatusLabel(status, t);
  const period = match?.period;
  const matchDay = formatTeamtrackerMatchDay(match?.matchDay, t);
  const clock =
    match?.clock ??
    (status === "PRE" ? match?.kickoffIn : null) ??
    (status === "POST" ? t("teamtrackerCard.status.final") : null);

  const periodClock = [period, clock].filter(Boolean).join(" · ");

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[1.75rem] text-[#141414] shadow-xl",
        "bg-[linear-gradient(145deg,#FFF8F2_0%,#FFE8DC_42%,#FFD6E8_78%,#E8D4FF_100%)]",
        className
      )}
    >
      {onMoreClick ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMoreClick();
          }}
          className="absolute right-2 top-2 z-10 rounded-lg p-1.5 text-black/35 transition-colors hover:bg-black/5 hover:text-black/70"
          aria-label={t("common.options")}
        >
          <MoreVertical className="h-4 w-4" aria-hidden />
        </button>
      ) : null}

      {!hasContent || !match ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center text-black/40">
          <p className="text-sm font-medium text-black/65">{title || t("cardType.teamtracker_card")}</p>
          <p className="text-xs">{t("teamtrackerCard.empty")}</p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-between gap-3 px-5 pb-5 pt-4">
          <div className={cn("flex items-start gap-3", onMoreClick ? "pr-7" : "")}>
            <p className="min-w-0 flex-1 truncate text-sm font-bold tracking-tight text-[#141414]">
              {match.league || title || t("cardType.teamtracker_card")}
            </p>
            <StatusBadge label={statusLabel} isLive={isLive} status={status} />
          </div>

          <div className="grid flex-1 grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="flex min-w-0 flex-col items-center gap-2">
              <TeamLogo src={match.teamLogo} alt={match.teamName ?? ""} className="h-14 w-14 sm:h-16 sm:w-16" />
              <p className="max-w-full truncate text-xs font-bold uppercase tracking-wide text-[#141414]">
                {match.teamAbbr ?? match.teamName ?? "—"}
              </p>
            </div>

            <div className="flex min-w-[5.5rem] flex-col items-center justify-center gap-1 px-1 text-center">
              {matchDay ? (
                <span className="text-[11px] font-medium text-black/50">{matchDay}</span>
              ) : (
                <span className="h-4" aria-hidden />
              )}
              <p className="text-3xl font-bold tabular-nums leading-none tracking-tight sm:text-4xl">
                {match.showScores ? (
                  <>
                    <span>{match.teamScore}</span>
                    <span className="mx-1.5 text-black/35">:</span>
                    <span>{match.opponentScore}</span>
                  </>
                ) : (
                  <span className="text-black/35">— : —</span>
                )}
              </p>
              {periodClock ? (
                <span className="text-[11px] font-semibold uppercase tracking-wider text-black/55">
                  {periodClock}
                </span>
              ) : (
                <span className="h-4" aria-hidden />
              )}
            </div>

            <div className="flex min-w-0 flex-col items-center gap-2">
              <TeamLogo
                src={match.opponentLogo}
                alt={match.opponentName ?? ""}
                className="h-14 w-14 sm:h-16 sm:w-16"
              />
              <p className="max-w-full truncate text-xs font-bold uppercase tracking-wide text-[#141414]">
                {match.opponentAbbr ?? match.opponentName ?? "—"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
