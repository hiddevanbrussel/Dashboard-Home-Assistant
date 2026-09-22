export const SCREENSAVER_FOOTBALL_LIVE_BACKGROUND = "/screensaver-football-live.jpg";

export type FootballMatchStatus = "PRE" | "IN" | "POST" | "";

export type FootballMatch = {
  status: FootballMatchStatus;
  clock: string | null;
  kickoffIn: string | null;
  teamLogo: string | null;
  teamName: string | null;
  opponentLogo: string | null;
  opponentName: string | null;
  teamScore: string;
  opponentScore: string;
  showScores: boolean;
};

const SCORE_KEYS_TEAM = ["team_score", "team_goals", "home_score"] as const;
const SCORE_KEYS_OPPONENT = ["opponent_score", "opponent_goals", "away_score"] as const;

export function normalizeFootballStatus(value: unknown): FootballMatchStatus {
  const status = String(value ?? "").trim().toUpperCase();
  if (status === "PRE" || status === "IN" || status === "POST") return status;
  return "";
}

export function footballMatchStatus(entity: {
  state?: string;
  attributes?: Record<string, unknown>;
} | null | undefined): FootballMatchStatus {
  const fromAttr = normalizeFootballStatus(entity?.attributes?.status);
  if (fromAttr) return fromAttr;
  return normalizeFootballStatus(entity?.state);
}

export function isLiveFootballMatch(entity: {
  state?: string;
  attributes?: Record<string, unknown>;
} | null | undefined): boolean {
  return footballMatchStatus(entity) === "IN";
}

function readScoreAttr(attrs: Record<string, unknown>, keys: readonly string[]): string {
  const data = attrs.data as Record<string, unknown> | undefined;
  for (const key of keys) {
    const value = attrs[key] ?? data?.[key];
    if (value !== undefined && value !== null) {
      const text = String(value).trim();
      if (text !== "") return text;
    }
  }
  return "—";
}

/** Parse entity.state like "1-0" or "2 - 1". */
export function parseStateAsScore(state: string | undefined): [string, string] | null {
  if (state == null || typeof state !== "string") return null;
  const parts = state.trim().split(/\s*[-–]\s*/);
  if (parts.length !== 2) return null;
  const team = parts[0].trim();
  const opponent = parts[1].trim();
  if (team === "" || opponent === "" || !/^\d+$/.test(team) || !/^\d+$/.test(opponent)) return null;
  return [team, opponent];
}

function asOptionalString(value: unknown): string | null {
  if (value == null) return null;
  const text = String(value).trim();
  return text === "" ? null : text;
}

export function readFootballMatch(entity: {
  state?: string;
  attributes?: Record<string, unknown>;
} | null | undefined): FootballMatch | null {
  if (!entity) return null;
  const attrs = (entity.attributes ?? {}) as Record<string, unknown>;
  const status = footballMatchStatus(entity);
  let teamScore = readScoreAttr(attrs, SCORE_KEYS_TEAM);
  let opponentScore = readScoreAttr(attrs, SCORE_KEYS_OPPONENT);
  if (teamScore === "—" && opponentScore === "—") {
    const fromState = parseStateAsScore(entity.state);
    if (fromState) {
      teamScore = fromState[0];
      opponentScore = fromState[1];
    }
  }
  const hasScoreValues = teamScore !== "—" || opponentScore !== "—";
  return {
    status,
    clock: asOptionalString(attrs.clock),
    kickoffIn: asOptionalString(attrs.kickoff_in),
    teamLogo: asOptionalString(attrs.team_logo),
    teamName: asOptionalString(attrs.team_long_name),
    opponentLogo: asOptionalString(attrs.opponent_logo),
    opponentName: asOptionalString(attrs.opponent_long_name),
    teamScore,
    opponentScore,
    showScores: status === "IN" || status === "POST" || hasScoreValues,
  };
}

export function footballMatchHasContent(match: FootballMatch | null | undefined): boolean {
  if (!match) return false;
  return Boolean(match.teamName || match.opponentName || match.kickoffIn || match.clock || match.status);
}
