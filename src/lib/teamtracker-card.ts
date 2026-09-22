import {
  footballMatchHasContent,
  footballMatchStatus,
  readFootballMatch,
  type FootballMatch,
  type FootballMatchStatus,
} from "@/lib/screensaver-football";

export const TEAMTRACKER_CARD_DEFAULT_WIDTH = 380;
export const TEAMTRACKER_CARD_DEFAULT_HEIGHT = 220;
export const TEAMTRACKER_CARD_MIN_WIDTH = 280;
export const TEAMTRACKER_CARD_MAX_WIDTH = 520;
export const TEAMTRACKER_CARD_MIN_HEIGHT = 180;
export const TEAMTRACKER_CARD_MAX_HEIGHT = 300;

export function clampTeamtrackerCardWidth(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return TEAMTRACKER_CARD_DEFAULT_WIDTH;
  return Math.min(TEAMTRACKER_CARD_MAX_WIDTH, Math.max(TEAMTRACKER_CARD_MIN_WIDTH, Math.round(v)));
}

export function clampTeamtrackerCardHeight(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return TEAMTRACKER_CARD_DEFAULT_HEIGHT;
  return Math.min(TEAMTRACKER_CARD_MAX_HEIGHT, Math.max(TEAMTRACKER_CARD_MIN_HEIGHT, Math.round(v)));
}

export function resizeTeamtrackerCardFromBottomRight(input: {
  startWidth: number;
  startHeight: number;
  startLeft: number;
  startBottom: number;
  dx: number;
  dy: number;
  viewportWidth: number;
  viewportHeight: number;
}): { width: number; height: number; left: number; bottom: number } {
  const top = input.viewportHeight - input.startBottom - input.startHeight;
  const maxWidth = Math.max(
    TEAMTRACKER_CARD_MIN_WIDTH,
    Math.min(TEAMTRACKER_CARD_MAX_WIDTH, Math.floor(input.viewportWidth - input.startLeft))
  );
  const maxHeight = Math.max(
    TEAMTRACKER_CARD_MIN_HEIGHT,
    Math.min(TEAMTRACKER_CARD_MAX_HEIGHT, Math.floor(input.viewportHeight - Math.max(0, top)))
  );
  const width = Math.min(maxWidth, clampTeamtrackerCardWidth(input.startWidth + input.dx));
  const height = Math.min(maxHeight, clampTeamtrackerCardHeight(input.startHeight + input.dy));
  const bottom = Math.max(0, input.viewportHeight - Math.max(0, top) - height);
  return { width, height, left: input.startLeft, bottom };
}

export type TeamtrackerMatch = FootballMatch & {
  league: string | null;
  teamAbbr: string | null;
  opponentAbbr: string | null;
  period: string | null;
  /** Optional center caption above the score (match day / round / week). */
  matchDay: string | null;
};

function asOptionalString(value: unknown): string | null {
  if (value == null) return null;
  const text = String(value).trim();
  return text === "" ? null : text;
}

function abbreviateName(name: string | null, max = 6): string | null {
  if (!name) return null;
  const cleaned = name.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned.toUpperCase();
  const words = cleaned.split(" ").filter(Boolean);
  if (words.length >= 2) {
    const initials = words.map((w) => w[0]).join("").slice(0, max);
    if (initials.length >= 2) return initials.toUpperCase();
  }
  return cleaned.slice(0, max).toUpperCase();
}

/** Read match-day / round / week label when Team Tracker exposes one. */
export function readTeamtrackerMatchDay(attrs: Record<string, unknown>): string | null {
  const data = attrs.data as Record<string, unknown> | undefined;
  const candidates = [
    attrs.matchday,
    attrs.match_day,
    attrs.round,
    attrs.week,
    attrs.gameweek,
    data?.matchday,
    data?.match_day,
    data?.round,
    data?.week,
    data?.gameweek,
  ];
  for (const value of candidates) {
    if (value == null || value === "") continue;
    const text = String(value).trim();
    if (!text) continue;
    if (/^\d+$/.test(text)) return text;
    return text;
  }
  return null;
}

/** Format a raw match-day value for display (numeric → localized "Match day N"). */
export function formatTeamtrackerMatchDay(
  raw: string | null | undefined,
  t: (key: string) => string
): string | null {
  if (!raw) return null;
  if (/^\d+$/.test(raw)) return t("teamtrackerCard.matchDay").replace("{n}", raw);
  return raw;
}

/** Read period / half label from Team Tracker attributes when present. */
export function readTeamtrackerPeriod(attrs: Record<string, unknown>): string | null {
  const data = attrs.data as Record<string, unknown> | undefined;
  const candidates = [
    attrs.quarter,
    attrs.period,
    attrs.half,
    attrs.clock_period,
    data?.quarter,
    data?.period,
    data?.half,
  ];
  for (const value of candidates) {
    const text = asOptionalString(value);
    if (!text) continue;
    const upper = text.toUpperCase();
    if (/^\d+$/.test(upper)) {
      if (upper === "1") return "1ST";
      if (upper === "2") return "2ND";
      if (upper === "3") return "3RD";
      if (upper === "4") return "4TH";
      return `${upper}`;
    }
    if (/^(1ST|2ND|3RD|4TH|HT|FT|OT)$/i.test(upper)) return upper;
    if (/first/i.test(text)) return "1ST";
    if (/second/i.test(text)) return "2ND";
    return upper.slice(0, 4);
  }
  return null;
}

export function readTeamtrackerMatch(entity: {
  state?: string;
  attributes?: Record<string, unknown>;
} | null | undefined): TeamtrackerMatch | null {
  const base = readFootballMatch(entity);
  if (!base) return null;
  const attrs = (entity?.attributes ?? {}) as Record<string, unknown>;
  const data = attrs.data as Record<string, unknown> | undefined;
  const teamAbbr =
    asOptionalString(attrs.team_abbr) ??
    asOptionalString(data?.team_abbr) ??
    abbreviateName(base.teamName);
  const opponentAbbr =
    asOptionalString(attrs.opponent_abbr) ??
    asOptionalString(data?.opponent_abbr) ??
    abbreviateName(base.opponentName);
  const league =
    asOptionalString(attrs.league) ??
    asOptionalString(attrs.league_path) ??
    asOptionalString(data?.league) ??
    null;
  return {
    ...base,
    league,
    teamAbbr,
    opponentAbbr,
    period: readTeamtrackerPeriod(attrs),
    matchDay: readTeamtrackerMatchDay(attrs),
  };
}

export function teamtrackerStatusLabel(
  status: FootballMatchStatus,
  t: (key: string) => string
): string {
  if (status === "IN") return t("teamtrackerCard.status.live");
  if (status === "PRE") return t("teamtrackerCard.status.upcoming");
  if (status === "POST") return t("teamtrackerCard.status.final");
  return t("teamtrackerCard.status.unknown");
}

export function isTeamtrackerEntityId(entityId: string): boolean {
  return entityId.startsWith("sensor.team");
}

export { footballMatchHasContent, footballMatchStatus };
