"use client";

import { CalendarDays, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useThemeStore } from "@/stores/theme-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  estimateTeamtrackerProgress,
  footballMatchHasContent,
  formatTeamtrackerFormLine,
  formatTeamtrackerKickoffDateLong,
  formatTeamtrackerKickoffTime,
  formatTeamtrackerLeagueLabel,
  isTeamtrackerShowForm,
  isTeamtrackerShowProgress,
  isTeamtrackerShowTeamNames,
  readTeamtrackerMatch,
  teamtrackerStadiumImageSrc,
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
        className="flex h-[4.25rem] w-[4.25rem] shrink-0 items-center justify-center rounded-full bg-white/10 text-lg font-semibold text-white/55 ring-1 ring-white/20 sm:h-[4.75rem] sm:w-[4.75rem]"
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
      className="h-[4.25rem] w-[4.25rem] shrink-0 object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)] sm:h-[4.75rem] sm:w-[4.75rem]"
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
    <div className="flex min-w-0 flex-col items-center gap-2.5">
      <TeamLogo src={logo} alt={name} />
      {showName || showForm ? (
        <div className="min-w-0 max-w-full text-center">
          {showName ? (
            <p className="truncate text-[0.95rem] font-semibold tracking-tight text-white sm:text-[1.05rem]">
              {name}
            </p>
          ) : null}
          {showForm && form ? (
            <p
              className={cn(
                "truncate text-[11px] font-medium tracking-wide text-white/45",
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
      <span className="text-[1.65rem] font-semibold leading-none tracking-[0.04em] text-white sm:text-[1.85rem]">
        VS
      </span>
    );
  }
  const scores = venueScores(match);
  const left = match.showScores ? scores.left : "—";
  const right = match.showScores ? scores.right : "—";
  return (
    <span className="text-[1.85rem] font-bold tabular-nums leading-none tracking-tight text-white sm:text-[2.15rem]">
      {left}
      <span className="mx-1.5 font-semibold text-white/80">-</span>
      {right}
      <span className="sr-only">
        {match.status === "POST" ? t("teamtrackerCard.finalScore") : ""}
      </span>
    </span>
  );
}

function LeagueOrStatusPill({
  leagueLabel,
  status,
  statusLabel,
}: {
  leagueLabel: string | null;
  status: string;
  statusLabel: string;
}) {
  if (status === "IN") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-300/45 bg-red-500/20 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-red-100">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-300" aria-hidden />
        {statusLabel}
      </span>
    );
  }
  if (status === "POST") {
    return (
      <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/75">
        {statusLabel}
      </span>
    );
  }
  if (leagueLabel) {
    return (
      <span className="inline-flex max-w-full items-center rounded-full border border-[#7EB6FF]/45 bg-[#1B3A6B]/72 px-3.5 py-1 text-[11px] font-semibold tracking-[0.02em] text-[#D7E9FF]">
        <span className="truncate">{leagueLabel}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/75">
      {statusLabel}
    </span>
  );
}

function ProgressBar({ progress }: { progress: number | null }) {
  if (progress == null) return null;
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  return (
    <div
      className="h-1 w-full overflow-hidden rounded-full bg-white/15"
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
  const isDark = useThemeStore((s) => s.resolved) === "dark";
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const match = readTeamtrackerMatch(entity);
  const hasContent = footballMatchHasContent(match);
  const status = match?.status ?? "";
  const statusLabel = teamtrackerStatusLabel(status, t);
  const sides = match ? venueSides(match) : null;
  const progress = match ? estimateTeamtrackerProgress(match) : null;
  const isUpcoming = status === "PRE";
  const kickoffDate = formatTeamtrackerKickoffDateLong(match?.kickoffAt, language);
  const kickoffTime = formatTeamtrackerKickoffTime(match?.kickoffAt, language);
  const leagueLabel = formatTeamtrackerLeagueLabel(match?.league);
  const showNames = isTeamtrackerShowTeamNames(show_team_names);
  const showForm = isTeamtrackerShowForm(show_form);
  const showProgress = isTeamtrackerShowProgress(show_progress);
  const stadiumSrc = withBasePath(teamtrackerStadiumImageSrc(isDark));
  const footerRight = isUpcoming
    ? kickoffTime
    : status === "IN"
      ? match?.clock
      : kickoffTime;

  return (
    <div className={cn("relative flex h-full min-h-0 w-full flex-col", className)}>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.35rem] bg-[#0B1528] text-white shadow-[0_18px_50px_rgba(8,15,30,0.35)] ring-1 ring-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element -- local static lifestyle art */}
        <img
          key={stadiumSrc}
          src={stadiumSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          draggable={false}
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-b",
            isDark
              ? "from-[#07111F]/78 via-[#0A1630]/55 to-[#07111F]/88"
              : "from-[#0A1628]/62 via-[#12243A]/48 to-[#0A1628]/78"
          )}
          aria-hidden
        />

        {onMoreClick ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoreClick();
            }}
            className="absolute right-2 top-2 z-20 rounded-lg p-1.5 text-white/45 transition-colors hover:bg-white/10 hover:text-white/80"
            aria-label={t("common.options")}
          >
            <MoreVertical className="h-4 w-4" aria-hidden />
          </button>
        ) : null}

        {!hasContent || !match || !sides ? (
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center text-white/55">
            <p className="text-sm font-medium text-white/80">
              {title || t("cardType.teamtracker_card")}
            </p>
            <p className="text-xs">{t("teamtrackerCard.empty")}</p>
          </div>
        ) : (
          <div className="relative z-10 flex min-h-0 flex-1 flex-col px-4 pb-3.5 pt-5 sm:px-5 sm:pb-4 sm:pt-6">
            <div className="grid min-h-0 flex-1 grid-cols-[1fr_auto_1fr] items-center gap-2">
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

            <div className="mt-3 flex flex-col items-center gap-3">
              <LeagueOrStatusPill
                leagueLabel={leagueLabel}
                status={status}
                statusLabel={statusLabel}
              />

              {kickoffDate || footerRight ? (
                <div className="flex w-full items-center gap-2 text-[12px] font-medium text-white/80 sm:text-[13px]">
                  <div className="flex min-w-0 flex-1 items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0 text-white/70" aria-hidden />
                    {kickoffDate ? (
                      <p className="truncate" title={kickoffDate}>
                        {kickoffDate}
                      </p>
                    ) : (
                      <p className="truncate text-white/45">{statusLabel}</p>
                    )}
                  </div>
                  {footerRight ? (
                    <p className="shrink-0 tabular-nums tracking-tight text-white">{footerRight}</p>
                  ) : null}
                </div>
              ) : null}

              <ProgressBar progress={showProgress && !isUpcoming ? progress : null} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
