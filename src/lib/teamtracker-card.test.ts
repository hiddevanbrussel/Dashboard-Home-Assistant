import { describe, expect, it } from "vitest";
import {
  TEAMTRACKER_CARD_DEFAULT_HEIGHT,
  TEAMTRACKER_CARD_DEFAULT_WIDTH,
  TEAMTRACKER_CARD_MIN_HEIGHT,
  TEAMTRACKER_CARD_MIN_WIDTH,
  clampTeamtrackerCardHeight,
  clampTeamtrackerCardWidth,
  isTeamtrackerEntityId,
  readTeamtrackerMatch,
  readTeamtrackerPeriod,
  resizeTeamtrackerCardFromBottomRight,
} from "./teamtracker-card";

describe("teamtracker-card helpers", () => {
  it("clamps card size", () => {
    expect(clampTeamtrackerCardWidth(undefined)).toBe(TEAMTRACKER_CARD_DEFAULT_WIDTH);
    expect(clampTeamtrackerCardWidth(100)).toBe(TEAMTRACKER_CARD_MIN_WIDTH);
    expect(clampTeamtrackerCardWidth(900)).toBe(520);
    expect(clampTeamtrackerCardHeight(undefined)).toBe(TEAMTRACKER_CARD_DEFAULT_HEIGHT);
    expect(clampTeamtrackerCardHeight(50)).toBe(TEAMTRACKER_CARD_MIN_HEIGHT);
    expect(clampTeamtrackerCardHeight(900)).toBe(280);
  });

  it("resizes from the bottom-right while keeping the top-left fixed", () => {
    const grown = resizeTeamtrackerCardFromBottomRight({
      startWidth: 380,
      startHeight: 200,
      startLeft: 40,
      startBottom: 40,
      dx: 40,
      dy: 20,
      viewportWidth: 1200,
      viewportHeight: 800,
    });
    expect(grown).toEqual({ width: 420, height: 220, left: 40, bottom: 20 });
  });

  it("detects teamtracker entity ids", () => {
    expect(isTeamtrackerEntityId("sensor.team_chelsea")).toBe(true);
    expect(isTeamtrackerEntityId("sensor.temperature")).toBe(false);
  });

  it("reads period labels from Team Tracker attributes", () => {
    expect(readTeamtrackerPeriod({ quarter: "1" })).toBe("1ST");
    expect(readTeamtrackerPeriod({ half: "2" })).toBe("2ND");
    expect(readTeamtrackerPeriod({ period: "HT" })).toBe("HT");
  });

  it("reads match details including abbreviations and league", () => {
    const match = readTeamtrackerMatch({
      state: "IN",
      attributes: {
        status: "IN",
        team_abbr: "CHE",
        opponent_abbr: "MCI",
        team_long_name: "Chelsea",
        opponent_long_name: "Manchester City",
        team_score: 2,
        opponent_score: 0,
        clock: "35:35",
        quarter: "1",
        league: "Premier League",
        team_logo: "https://example.com/che.png",
        opponent_logo: "https://example.com/mci.png",
      },
    });
    expect(match?.status).toBe("IN");
    expect(match?.teamAbbr).toBe("CHE");
    expect(match?.opponentAbbr).toBe("MCI");
    expect(match?.teamScore).toBe("2");
    expect(match?.opponentScore).toBe("0");
    expect(match?.clock).toBe("35:35");
    expect(match?.period).toBe("1ST");
    expect(match?.league).toBe("Premier League");
    expect(match?.showScores).toBe(true);
  });
});
