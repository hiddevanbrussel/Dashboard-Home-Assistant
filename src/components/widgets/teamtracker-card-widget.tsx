"use client";

import { type ReactNode } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  TEAMTRACKER_CARD_LOGO_OVERHANG,
  footballMatchHasContent,
  formatTeamtrackerKickoffDayLabel,
  formatTeamtrackerKickoffTime,
  formatTeamtrackerPeriodLabel,
  readTeamtrackerMatch,
  teamtrackerStatusLabel,
  type TeamtrackerMatch,
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
          "image-theme-fixed flex shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] ring-1 ring-black/[0.06]",
          className ?? "h-16 w-16"
        )}
        aria-hidden
      />
    );
  }
  return (
    <div
      className={cn(
        "image-theme-fixed flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_4px_14px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.06]",
        className ?? "h-16 w-16"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Dynamic HA Team Tracker logo URL */}
      <img
        src={src}
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
  status,
}: {
  label: string;
  status: string;
}) {
  if (status === "IN") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDECEC] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#E5484D]">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E5484D]" aria-hidden />
        {label}
      </span>
    );
  }
  if (status === "PRE") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#E8F8EE] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#1F7A45]">
        {label}
      </span>
    );
  }
  if (status === "POST") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#EEF0F3] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6B7280]">
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-[#EEF0F3] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6B7280]">
      {label}
    </span>
  );
}

function venueSides(match: TeamtrackerMatch): {
  left: {
    logo: string | null;
    name: string;
    role: "home" | "away";
  };
  right: {
    logo: string | null;
    name: string;
    role: "home" | "away";
  };
} {
  const team = {
    logo: match.teamLogo,
    name: match.teamShortName ?? match.teamAbbr ?? match.teamName ?? "—",
  };
  const opponent = {
    logo: match.opponentLogo,
    name: match.opponentShortName ?? match.opponentAbbr ?? match.opponentName ?? "—",
  };

  if (match.homeAway === "away") {
    return {
      left: { ...opponent, role: "home" },
      right: { ...team, role: "away" },
    };
  }
  // Default / home: tracked team on the left as home
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

function ScoreLine({ left, right }: { left: string; right: string }) {
  return (
    <span className="text-[2rem] font-bold tabular-nums leading-none tracking-tight text-[#1A1C2E] sm:text-[2.35rem]">
      {left}
      <span className="mx-1.5 font-semibold text-[#1A1C2E]">-</span>
      {right}
    </span>
  );
}

function CenterStack({
  match,
  statusLabel,
  t,
  language,
}: {
  match: TeamtrackerMatch;
  statusLabel: string;
  t: (key: string) => string;
  language: string;
}) {
  const status = match.status;
  const periodLabel = formatTeamtrackerPeriodLabel(match.period, t);
  const clock = match.clock;
  const kickoffTime = formatTeamtrackerKickoffTime(match.kickoffAt, language);
  const kickoffDay = formatTeamtrackerKickoffDayLabel(match.kickoffAt, t, language);
  const scores = venueScores(match);

  let headline: ReactNode;
  let subtitle: string | null = null;

  if (status === "PRE") {
    headline = (
      <span className="text-[2rem] font-bold tabular-nums leading-none tracking-tight text-[#1A1C2E] sm:text-[2.35rem]">
        {kickoffTime ?? match.kickoffIn ?? "—"}
      </span>
    );
    subtitle = kickoffDay;
  } else if (status === "POST") {
    headline = match.showScores ? (
      <ScoreLine left={scores.left} right={scores.right} />
    ) : (
      <ScoreLine left="—" right="—" />
    );
    subtitle = t("teamtrackerCard.finalScore");
  } else {
    headline = match.showScores ? (
      <ScoreLine left={scores.left} right={scores.right} />
    ) : (
      <ScoreLine left="—" right="—" />
    );
    const parts = [periodLabel, clock].filter(Boolean);
    subtitle = parts.length ? parts.join(" • ") : null;
  }

  return (
    <div className="flex min-w-[6.5rem] flex-col items-center justify-center gap-1.5 px-1 text-center">
      <StatusBadge label={statusLabel} status={status} />
      {headline}
      {subtitle ? (
        <span className="text-[11px] font-medium text-[#8E8E93]">{subtitle}</span>
      ) : (
        <span className="h-4" aria-hidden />
      )}
    </div>
  );
}

export function TeamtrackerCardWidget({
  title,
  entity_id,
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

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full flex-col overflow-visible",
        className
      )}
      style={{ paddingTop: TEAMTRACKER_CARD_LOGO_OVERHANG }}
    >
      <div className="relative flex min-h-0 flex-1 flex-col overflow-visible rounded-[1.5rem] bg-white text-[#1A1C2E] shadow-[0_8px_28px_rgba(15,23,42,0.10)] ring-1 ring-black/[0.04]">
        {onMoreClick ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoreClick();
            }}
            className="absolute right-2 top-2 z-20 rounded-lg p-1.5 text-[#1A1C2E]/35 transition-colors hover:bg-black/5 hover:text-[#1A1C2E]/70"
            aria-label={t("common.options")}
          >
            <MoreVertical className="h-4 w-4" aria-hidden />
          </button>
        ) : null}

        {!hasContent || !match || !sides ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center text-[#8E8E93]">
            <p className="text-sm font-medium text-[#1A1C2E]/70">
              {title || t("cardType.teamtracker_card")}
            </p>
            <p className="text-xs">{t("teamtrackerCard.empty")}</p>
          </div>
        ) : (
          <div className="grid flex-1 grid-cols-[1fr_auto_1fr] items-center gap-1 px-4 pb-5 pt-10 sm:px-5">
            <div className="relative flex min-w-0 flex-col items-center gap-1.5">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[calc(50%+0.35rem)]">
                <TeamLogo src={sides.left.logo} alt={sides.left.name} className="h-[4.25rem] w-[4.25rem]" />
              </div>
              <p className="mt-8 max-w-full truncate text-base font-bold tracking-tight text-[#1A1C2E] sm:text-lg">
                {sides.left.name}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8E8E93]">
                {sides.left.role === "home" ? t("teamtrackerCard.home") : t("teamtrackerCard.away")}
              </p>
            </div>

            <CenterStack match={match} statusLabel={statusLabel} t={t} language={language} />

            <div className="relative flex min-w-0 flex-col items-center gap-1.5">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[calc(50%+0.35rem)]">
                <TeamLogo src={sides.right.logo} alt={sides.right.name} className="h-[4.25rem] w-[4.25rem]" />
              </div>
              <p className="mt-8 max-w-full truncate text-base font-bold tracking-tight text-[#1A1C2E] sm:text-lg">
                {sides.right.name}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8E8E93]">
                {sides.right.role === "home" ? t("teamtrackerCard.home") : t("teamtrackerCard.away")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
