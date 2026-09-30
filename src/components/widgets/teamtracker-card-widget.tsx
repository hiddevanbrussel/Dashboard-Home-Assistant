"use client";

import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  estimateTeamtrackerProgress,
  footballMatchHasContent,
  formatTeamtrackerFormLine,
  formatTeamtrackerKickoffDateTime,
  isTeamtrackerShowForm,
  isTeamtrackerShowProgress,
  isTeamtrackerShowTeamNames,
  readTeamtrackerMatch,
  teamtrackerStatusLabel,
  type TeamtrackerMatch,
} from "@/lib/teamtracker-card";
import type { TeamtrackerCardProps } from "./widget-types";

function StatusBadge({
  label,
  status,
}: {
  label: string;
  status: string;
}) {
  if (status === "IN") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDECEC] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#E53935] dark:bg-red-500/15 dark:text-red-300">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E53935] dark:bg-red-400" aria-hidden />
        {label}
      </span>
    );
  }
  if (status === "PRE") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#E8F1FB] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#2F6FED] dark:bg-blue-500/15 dark:text-blue-300">
        {label}
      </span>
    );
  }
  if (status === "POST") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#F1F2F4] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6B7280] dark:bg-white/8 dark:text-white/50">
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-[#F1F2F4] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6B7280] dark:bg-white/8 dark:text-white/50">
      {label}
    </span>
  );
}

function venueSides(match: TeamtrackerMatch): {
  left: {
    logo: string | null;
    name: string;
    form: string | null;
    role: "home" | "away";
  };
  right: {
    logo: string | null;
    name: string;
    form: string | null;
    role: "home" | "away";
  };
} {
  const team = {
    logo: match.teamLogo,
    name: match.teamShortName ?? match.teamAbbr ?? match.teamName ?? "—",
    form: formatTeamtrackerFormLine(match.teamForm, match.teamRecord),
  };
  const opponent = {
    logo: match.opponentLogo,
    name: match.opponentShortName ?? match.opponentAbbr ?? match.opponentName ?? "—",
    form: formatTeamtrackerFormLine(match.opponentForm, match.opponentRecord),
  };

  if (match.homeAway === "away") {
    return {
      left: { ...opponent, role: "home" },
      right: { ...team, role: "away" },
    };
  }
  return {
    left: { ...team, role: "home" },
    right: { ...opponent, role: "away" },
  };
}

function venueScores(match: TeamtrackerMatch): { left: string; right: string } {
  if (match.homeAway === "away") {
    return { left: match.opponentScore, right: match.teamScore };
  }
  return { left: match.teamScore, right: match.opponentScore };
}

function TeamLogo({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) {
    return (
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-sm font-semibold text-[#9CA3AF] dark:bg-white/8 dark:text-white/35 sm:h-14 sm:w-14"
        aria-hidden
      >
        {alt.slice(0, 1).toUpperCase()}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Dynamic HA Team Tracker logo URL
    <img
      src={withBasePath(src)}
      alt={alt}
      className="h-12 w-12 shrink-0 rounded-full object-contain sm:h-14 sm:w-14"
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}

function TeamColumn({
  logo,
  name,
  form,
  showName,
  showForm,
}: {
  logo: string | null;
  name: string;
  form: string | null;
  showName: boolean;
  showForm: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      <TeamLogo src={logo} alt={name} />
      {showName || showForm ? (
        <div className="min-w-0 max-w-full text-center">
          {showName ? (
            <p className="truncate text-sm font-semibold tracking-tight text-[#2A2D37] dark:text-white/90 sm:text-[15px]">
              {name}
            </p>
          ) : null}
          {showForm ? (
            form ? (
              <p
                className={cn(
                  "truncate text-[11px] font-medium tracking-wide text-[#A0A4AB] dark:text-white/40",
                  showName ? "mt-0.5" : null
                )}
              >
                {form}
              </p>
            ) : showName ? (
              <p className="mt-0.5 h-[15px]" aria-hidden />
            ) : null
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ScoreHeadline({
  match,
  t,
}: {
  match: TeamtrackerMatch;
  t: (key: string) => string;
}) {
  if (match.status === "PRE") {
    return (
      <span className="text-[1.85rem] font-bold leading-none tracking-tight text-[#2A2D37] dark:text-white/90 sm:text-[2.15rem]">
        VS
      </span>
    );
  }
  const scores = venueScores(match);
  const left = match.showScores ? scores.left : "—";
  const right = match.showScores ? scores.right : "—";
  return (
    <span className="text-[1.85rem] font-bold tabular-nums leading-none tracking-tight text-[#2A2D37] dark:text-white/90 sm:text-[2.15rem]">
      {left}
      <span className="mx-1.5 font-semibold text-[#2A2D37]/80 dark:text-white/80">-</span>
      {right}
      <span className="sr-only">
        {match.status === "POST" ? t("teamtrackerCard.finalScore") : ""}
      </span>
    </span>
  );
}

function ProgressBar({ progress }: { progress: number | null }) {
  if (progress == null) return null;
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  return (
    <div
      className="h-1 w-full overflow-hidden rounded-full bg-[#ECEEF1] dark:bg-white/10"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-[#F07167] transition-[width] duration-500 ease-out dark:bg-[#E57373]"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function TeamtrackerCardWidget({
  title,
  entity_id,
  show_team_names,
  show_form,
  show_progress,
  className,
  onMoreClick,
}: TeamtrackerCardProps & { className?: string; onMoreClick?: () => void }) {
  const { t, language } = useTranslation();
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const match = readTeamtrackerMatch(entity);
  const hasContent = footballMatchHasContent(match);
  const status = match?.status ?? "";
  const statusLabel = teamtrackerStatusLabel(status, t);
  const sides = match ? venueSides(match) : null;
  const progress = match ? estimateTeamtrackerProgress(match) : null;
  const isUpcoming = status === "PRE";
  const kickoffDateTime = isUpcoming
    ? formatTeamtrackerKickoffDateTime(match?.kickoffAt, language)
    : null;
  const showNames = isTeamtrackerShowTeamNames(show_team_names);
  const showForm = isTeamtrackerShowForm(show_form);
  const showProgress = isTeamtrackerShowProgress(show_progress);

  return (
    <div className={cn("relative flex h-full min-h-0 w-full flex-col", className)}>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#E6E8EC] bg-white text-[#2A2D37] dark:border-white/10 dark:bg-zinc-950 dark:text-white">
        {onMoreClick ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoreClick();
            }}
            className="absolute right-2 top-2 z-20 rounded-lg p-1.5 text-[#2A2D37]/30 transition-colors hover:bg-black/5 hover:text-[#2A2D37]/65 dark:text-white/30 dark:hover:bg-white/10 dark:hover:text-white/65"
            aria-label={t("common.options")}
          >
            <MoreVertical className="h-4 w-4" aria-hidden />
          </button>
        ) : null}

        {!hasContent || !match || !sides ? (
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center text-[#8E8E93] dark:text-white/45">
            <p className="text-sm font-medium text-[#2A2D37]/70 dark:text-white/70">
              {title || t("cardType.teamtracker_card")}
            </p>
            <p className="text-xs">{t("teamtrackerCard.empty")}</p>
          </div>
        ) : (
          <div
            className={cn(
              "relative z-10 flex min-h-0 flex-1 flex-col px-4 sm:px-5",
              isUpcoming
                ? "justify-center gap-4 py-4"
                : "justify-between gap-3 pb-3.5 pt-4 sm:pt-5"
            )}
          >
            <div
              className={cn(
                "grid grid-cols-[1fr_auto_1fr] gap-2",
                isUpcoming ? "items-center" : "items-start"
              )}
            >
              <TeamColumn
                logo={sides.left.logo}
                name={sides.left.name}
                form={sides.left.form}
                showName={showNames}
                showForm={showForm}
              />

              <div
                className={cn(
                  "flex flex-col items-center",
                  isUpcoming ? "justify-center" : "justify-start pt-2 sm:pt-3"
                )}
              >
                <ScoreHeadline match={match} t={t} />
              </div>

              <TeamColumn
                logo={sides.right.logo}
                name={sides.right.name}
                form={sides.right.form}
                showName={showNames}
                showForm={showForm}
              />
            </div>

            <div className="flex flex-col items-center gap-2">
              <StatusBadge label={statusLabel} status={status} />
              {kickoffDateTime ? (
                <p className="text-center text-[13px] font-medium text-[#8B909A] dark:text-white/45">
                  {kickoffDateTime}
                </p>
              ) : null}
              {/* Empty PRE bar adds bottom weight without info — only show during/after play */}
              <ProgressBar
                progress={showProgress && !isUpcoming ? progress : null}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
