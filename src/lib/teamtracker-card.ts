import {
  footballMatchHasContent,
  footballMatchStatus,
  readFootballMatch,
  type FootballMatch,
  type FootballMatchStatus,
} from "@/lib/screensaver-football";

export const TEAMTRACKER_CARD_DEFAULT_WIDTH = 380;
export const TEAMTRACKER_CARD_DEFAULT_HEIGHT = 200;
export const TEAMTRACKER_CARD_MIN_WIDTH = 260;
export const TEAMTRACKER_CARD_MAX_WIDTH = 520;
export const TEAMTRACKER_CARD_MIN_HEIGHT = 160;
export const TEAMTRACKER_CARD_MAX_HEIGHT = 320;

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

export type TeamtrackerHomeAway = "home" | "away" | null;

export type TeamtrackerMatch = FootballMatch & {
  league: string | null;
  teamAbbr: string | null;
  opponentAbbr: string | null;
  teamShortName: string | null;
  opponentShortName: string | null;
  period: string | null;
  /** Optional center caption above the score (match day / round / week). */
  matchDay: string | null;
  /** Whether the tracked team is home or away. */
  homeAway: TeamtrackerHomeAway;
  /** Kickoff datetime from Team Tracker `date` attribute. */
  kickoffAt: Date | null;
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

function displayShortName(
  short: string | null,
  abbr: string | null,
  longName: string | null
): string | null {
  return short ?? abbr ?? (longName ? longName.split(/\s+/)[0] : null);
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

export function readTeamtrackerHomeAway(attrs: Record<string, unknown>): TeamtrackerHomeAway {
  const data = attrs.data as Record<string, unknown> | undefined;
  const raw =
    asOptionalString(attrs.team_homeaway) ??
    asOptionalString(attrs.homeaway) ??
    asOptionalString(attrs.home_away) ??
    asOptionalString(data?.team_homeaway) ??
    asOptionalString(data?.homeaway);
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower === "home" || lower === "h") return "home";
  if (lower === "away" || lower === "a") return "away";
  return null;
}

export function readTeamtrackerKickoffAt(attrs: Record<string, unknown>): Date | null {
  const data = attrs.data as Record<string, unknown> | undefined;
  const raw = asOptionalString(attrs.date) ?? asOptionalString(data?.date);
  if (!raw) return null;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
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

/** Localized half / period label for the center subtitle. */
export function formatTeamtrackerPeriodLabel(
  period: string | null | undefined,
  t: (key: string) => string
): string | null {
  if (!period) return null;
  const upper = period.toUpperCase();
  if (upper === "1ST" || upper === "1") return t("teamtrackerCard.period.firstHalf");
  if (upper === "2ND" || upper === "2") return t("teamtrackerCard.period.secondHalf");
  if (upper === "3RD" || upper === "3") return t("teamtrackerCard.period.third");
  if (upper === "4TH" || upper === "4") return t("teamtrackerCard.period.fourth");
  if (upper === "HT") return t("teamtrackerCard.period.halfTime");
  if (upper === "FT") return t("teamtrackerCard.period.fullTime");
  if (upper === "OT") return t("teamtrackerCard.period.overtime");
  return period;
}

export function formatTeamtrackerKickoffTime(
  kickoffAt: Date | null | undefined,
  language: string
): string | null {
  if (!kickoffAt) return null;
  const locale = language === "nl" ? "nl-NL" : "en-GB";
  return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hour12: false }).format(
    kickoffAt
  );
}

export function formatTeamtrackerKickoffDayLabel(
  kickoffAt: Date | null | undefined,
  t: (key: string) => string,
  language: string,
  now = new Date()
): string | null {
  if (!kickoffAt) return null;
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOf(kickoffAt) - startOf(now)) / 86_400_000);
  if (diffDays === 0) return t("teamtrackerCard.kickoff.today");
  if (diffDays === 1) return t("teamtrackerCard.kickoff.tomorrow");
  if (diffDays === -1) return t("teamtrackerCard.kickoff.yesterday");
  const locale = language === "nl" ? "nl-NL" : "en-GB";
  return new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short" }).format(
    kickoffAt
  );
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
  const teamShortName = displayShortName(
    asOptionalString(attrs.team_name) ?? asOptionalString(data?.team_name),
    teamAbbr,
    base.teamName
  );
  const opponentShortName = displayShortName(
    asOptionalString(attrs.opponent_name) ?? asOptionalString(data?.opponent_name),
    opponentAbbr,
    base.opponentName
  );
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
    teamShortName,
    opponentShortName,
    period: readTeamtrackerPeriod(attrs),
    matchDay: readTeamtrackerMatchDay(attrs),
    homeAway: readTeamtrackerHomeAway(attrs),
    kickoffAt: readTeamtrackerKickoffAt(attrs),
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
