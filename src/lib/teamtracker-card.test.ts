import { describe, expect, it } from "vitest";
import {
  TEAMTRACKER_CARD_DEFAULT_HEIGHT,
  TEAMTRACKER_CARD_DEFAULT_WIDTH,
  TEAMTRACKER_CARD_MIN_HEIGHT,
  TEAMTRACKER_CARD_MIN_WIDTH,
  clampTeamtrackerCardHeight,
  clampTeamtrackerCardWidth,
  formatTeamtrackerKickoffDayLabel,
  formatTeamtrackerKickoffTime,
  formatTeamtrackerPeriodLabel,
  isTeamtrackerEntityId,
  readTeamtrackerHomeAway,
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
    expect(clampTeamtrackerCardHeight(900)).toBe(320);
  });

  it("resizes from the bottom-right while keeping the top-left fixed", () => {
    const grown = resizeTeamtrackerCardFromBottomRight({
      startWidth: 380,
      startHeight: 210,
      startLeft: 40,
      startBottom: 40,
      dx: 40,
      dy: 20,
      viewportWidth: 1200,
      viewportHeight: 800,
    });
    expect(grown).toEqual({ width: 420, height: 230, left: 40, bottom: 20 });
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

  it("formats localized period labels", () => {
    const t = (key: string) =>
      ({
        "teamtrackerCard.period.firstHalf": "1e helft",
        "teamtrackerCard.period.secondHalf": "2e helft",
        "teamtrackerCard.period.halfTime": "Rust",
      })[key] ?? key;
    expect(formatTeamtrackerPeriodLabel("1ST", t)).toBe("1e helft");
    expect(formatTeamtrackerPeriodLabel("2ND", t)).toBe("2e helft");
    expect(formatTeamtrackerPeriodLabel("HT", t)).toBe("Rust");
  });

  it("reads home/away and kickoff date", () => {
    expect(readTeamtrackerHomeAway({ team_homeaway: "home" })).toBe("home");
    expect(readTeamtrackerHomeAway({ team_homeaway: "away" })).toBe("away");
    const match = readTeamtrackerMatch({
      state: "IN",
      attributes: {
        status: "IN",
        team_abbr: "PSV",
        opponent_abbr: "AJA",
        team_name: "PSV",
        opponent_name: "Ajax",
        team_long_name: "PSV Eindhoven",
        opponent_long_name: "Ajax Amsterdam",
        team_score: 2,
        opponent_score: 1,
        clock: "67'",
        half: "2",
        league: "Eredivisie",
        team_homeaway: "home",
        date: "2026-09-23T18:00:00+00:00",
        team_logo: "https://example.com/psv.png",
        opponent_logo: "https://example.com/ajax.png",
      },
    });
    expect(match?.teamShortName).toBe("PSV");
    expect(match?.opponentShortName).toBe("Ajax");
    expect(match?.homeAway).toBe("home");
    expect(match?.period).toBe("2ND");
    expect(match?.kickoffAt?.toISOString()).toBe("2026-09-23T18:00:00.000Z");
  });

  it("formats kickoff time and day labels", () => {
    const kickoff = new Date(2026, 8, 23, 20, 0, 0);
    const t = (key: string) =>
      ({
        "teamtrackerCard.kickoff.today": "Vandaag",
        "teamtrackerCard.kickoff.tomorrow": "Morgen",
      })[key] ?? key;
    expect(formatTeamtrackerKickoffTime(kickoff, "nl")).toMatch(/20:00/);
    expect(formatTeamtrackerKickoffDayLabel(kickoff, t, "nl", new Date(2026, 8, 23, 12, 0, 0))).toBe(
      "Vandaag"
    );
    expect(formatTeamtrackerKickoffDayLabel(kickoff, t, "nl", new Date(2026, 8, 22, 12, 0, 0))).toBe(
      "Morgen"
    );
  });
});
