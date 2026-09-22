"use client";

import { MoreVertical, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  footballMatchHasContent,
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
          "image-theme-fixed flex shrink-0 items-center justify-center rounded-full bg-white/10",
          className ?? "h-14 w-14"
        )}
        aria-hidden
      />
    );
  }
  const url = src.startsWith("http") || src.startsWith("/")
    ? src
    : src;
  return (
    <div
      className={cn(
        "image-theme-fixed flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10",
        className ?? "h-14 w-14"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Dynamic HA Team Tracker logo URL */}
      <img
        src={url}
        alt={alt}
        className="h-full w-full object-contain p-1"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
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
  const clock =
    match?.clock ??
    (status === "PRE" ? match?.kickoffIn : null) ??
    (status === "POST" ? t("teamtrackerCard.status.final") : null);

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[1.75rem] bg-[#111111] text-white shadow-xl",
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
          className="absolute right-2 top-2 z-10 rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white/90"
          aria-label={t("common.options")}
        >
          <MoreVertical className="h-4 w-4" aria-hidden />
        </button>
      ) : null}

      {!hasContent || !match ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center text-white/50">
          <p className="text-sm font-medium text-white/70">{title || t("cardType.teamtracker_card")}</p>
          <p className="text-xs">{t("teamtrackerCard.empty")}</p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-between gap-3 px-5 pb-5 pt-4">
          <div className="flex items-center justify-center gap-1.5">
            {isLive ? (
              <>
                <Video className="h-3.5 w-3.5 text-red-500" aria-hidden />
                <span className="text-xs font-semibold tracking-wide text-red-500">{statusLabel}</span>
              </>
            ) : (
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                  status === "PRE" ? "bg-white/10 text-white/80" : "bg-white/10 text-white/70"
                )}
              >
                {statusLabel}
              </span>
            )}
          </div>

          {match.league ? (
            <p className="-mt-1 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
              {match.league}
            </p>
          ) : null}

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="flex min-w-0 flex-col items-center gap-2">
              <p className="max-w-full truncate text-xs font-bold uppercase tracking-wide text-white/90">
                {match.teamAbbr ?? match.teamName ?? "—"}
              </p>
              <div className="flex items-center gap-2.5">
                <TeamLogo src={match.teamLogo} alt={match.teamName ?? ""} className="h-12 w-12 sm:h-14 sm:w-14" />
                <span className="min-w-[1.5rem] text-center text-4xl font-bold tabular-nums leading-none sm:text-5xl">
                  {match.showScores ? match.teamScore : "—"}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center self-end rounded-2xl bg-white/[0.08] px-3 py-2.5">
              {period ? (
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80">{period}</span>
              ) : null}
              <span className="text-sm font-semibold tabular-nums text-white/90">
                {clock ?? "—"}
              </span>
            </div>

            <div className="flex min-w-0 flex-col items-center gap-2">
              <p className="max-w-full truncate text-xs font-bold uppercase tracking-wide text-white/90">
                {match.opponentAbbr ?? match.opponentName ?? "—"}
              </p>
              <div className="flex items-center gap-2.5">
                <span className="min-w-[1.5rem] text-center text-4xl font-bold tabular-nums leading-none sm:text-5xl">
                  {match.showScores ? match.opponentScore : "—"}
                </span>
                <TeamLogo
                  src={match.opponentLogo}
                  alt={match.opponentName ?? ""}
                  className="h-12 w-12 sm:h-14 sm:w-14"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
