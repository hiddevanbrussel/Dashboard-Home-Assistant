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
  formatTeamtrackerKickoffDate,
  formatTeamtrackerKickoffDateLong,
  formatTeamtrackerKickoffTime,
  isTeamtrackerShowForm,
  isTeamtrackerShowProgress,
  isTeamtrackerShowTeamNames,
  readTeamtrackerMatch,
  teamtrackerStatusLabel,
  type TeamtrackerMatch,
} from "@/lib/teamtracker-card";
import type { TeamtrackerCardProps } from "./widget-types";

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
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EEF1F6] text-sm font-semibold text-[#9AA3B2] dark:bg-white/8 dark:text-white/40 sm:h-16 sm:w-16"
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
      className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
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
            <p className="truncate text-sm font-semibold tracking-tight text-[#1B2437] dark:text-white/90">
              {name}
            </p>
          ) : null}
          {showForm && form ? (
            <p
              className={cn(
                "truncate text-[11px] font-medium tracking-wide text-[#8A97A8] dark:text-white/40",
                showName ? "mt-0.5" : null
              )}
            >
              {form}
            </p>
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
      <div className="flex flex-col items-center gap-1.5">
        <span className="h-5 w-px bg-[#D5DCE8] dark:bg-white/15" aria-hidden />
        <span className="text-sm font-medium lowercase tracking-wide text-[#8A97A8] dark:text-white/45">
          vs
        </span>
        <span className="h-5 w-px bg-[#D5DCE8] dark:bg-white/15" aria-hidden />
      </div>
    );
  }
  const scores = venueScores(match);
  const left = match.showScores ? scores.left : "—";
  const right = match.showScores ? scores.right : "—";
  return (
    <span className="text-[1.75rem] font-bold tabular-nums leading-none tracking-tight text-[#1B2437] dark:text-white sm:text-[2rem]">
      {left}
      <span className="mx-1.5 font-semibold text-[#1B2437]/70 dark:text-white/70">-</span>
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
      className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[#E8ECF2] dark:bg-white/10"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-[#F07167] transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/** Mockup-style date without year: "Zondag 25 oktober". */
function formatQuietKickoffDate(kickoffAt: Date | null | undefined, language: string): string | null {
  if (!kickoffAt) return null;
  const locale = language === "nl" ? "nl-NL" : "en-GB";
  const formatted = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(kickoffAt);
  const cleaned = formatted.replace(/,/g, "").replace(/\s+/g, " ").trim();
  if (!cleaned) return null;
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
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
  const kickoffDate = isUpcoming
    ? formatQuietKickoffDate(match?.kickoffAt, language)
    : formatTeamtrackerKickoffDateLong(match?.kickoffAt, language) ??
      formatTeamtrackerKickoffDate(match?.kickoffAt, language);
  const kickoffTime = formatTeamtrackerKickoffTime(match?.kickoffAt, language);
  // PRE mockup is logos-only; names/form stay available for live/finished matches.
  const showNames = !isUpcoming && isTeamtrackerShowTeamNames(show_team_names);
  const showForm = !isUpcoming && isTeamtrackerShowForm(show_form);
  const showProgress = isTeamtrackerShowProgress(show_progress);
  const footerTime = isUpcoming
    ? kickoffTime
    : status === "IN"
      ? match?.clock
      : kickoffTime;

  return (
    <div className={cn("relative flex h-full min-h-0 w-full flex-col", className)}>
      <div className="glass-surface relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.35rem] text-[#1B2437] shadow-[0_12px_36px_rgba(15,23,42,0.08)] dark:text-white dark:shadow-[0_12px_36px_rgba(0,0,0,0.35)]">
        {onMoreClick ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoreClick();
            }}
            className="absolute right-2 top-2 z-20 rounded-lg p-1.5 text-[#1B2437]/30 transition-colors hover:bg-black/5 hover:text-[#1B2437]/65 dark:text-white/30 dark:hover:bg-white/10 dark:hover:text-white/65"
            aria-label={t("common.options")}
          >
            <MoreVertical className="h-4 w-4" aria-hidden />
          </button>
        ) : null}

        {!hasContent || !match || !sides ? (
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center text-[#8A97A8] dark:text-white/45">
            <p className="text-sm font-medium text-[#1B2437]/70 dark:text-white/70">
              {title || t("cardType.teamtracker_card")}
            </p>
            <p className="text-xs">{t("teamtrackerCard.empty")}</p>
          </div>
        ) : (
          <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-5 sm:px-5">
            {!isUpcoming ? (
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A97A8] dark:text-white/45">
                {statusLabel}
              </p>
            ) : null}

            <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2">
              <TeamColumn
                logo={sides.left.logo}
                name={sides.left.name}
                form={sides.left.form}
                showName={showNames}
                showForm={showForm}
              />

              <div className="flex flex-col items-center justify-center px-1">
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

            <div className="mt-5 flex flex-col items-center gap-1.5 text-center">
              {kickoffDate ? (
                <p className="text-[15px] font-medium text-[#5B6B82] dark:text-white/55">{kickoffDate}</p>
              ) : null}
              {footerTime ? (
                <p className="text-[2rem] font-bold tabular-nums leading-none tracking-tight text-[#1B2437] dark:text-white sm:text-[2.25rem]">
                  {footerTime}
                </p>
              ) : null}
            </div>

            <ProgressBar progress={showProgress && !isUpcoming ? progress : null} />
          </div>
        )}
      </div>
    </div>
  );
}
