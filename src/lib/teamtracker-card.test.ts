import { describe, expect, it } from "vitest";
import {
  TEAMTRACKER_CARD_DEFAULT_HEIGHT,
  TEAMTRACKER_CARD_DEFAULT_WIDTH,
  TEAMTRACKER_CARD_MIN_HEIGHT,
  TEAMTRACKER_CARD_MIN_WIDTH,
  clampTeamtrackerCardHeight,
  clampTeamtrackerCardWidth,
  estimateTeamtrackerProgress,
  formatTeamtrackerFormLine,
  formatTeamtrackerKickoffDate,
  formatTeamtrackerKickoffDateTime,
  formatTeamtrackerKickoffDayLabel,
  formatTeamtrackerKickoffTime,
  formatTeamtrackerPeriodLabel,
  isTeamtrackerEntityId,
  isTeamtrackerShowForm,
  isTeamtrackerShowProgress,
  isTeamtrackerShowTeamNames,
  readTeamtrackerForm,
  readTeamtrackerHomeAway,
  readTeamtrackerMatch,
  readTeamtrackerPeriod,
  readTeamtrackerRecord,
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

  it("defaults display toggles to on unless explicitly false", () => {
    expect(isTeamtrackerShowTeamNames(undefined)).toBe(true);
    expect(isTeamtrackerShowTeamNames(true)).toBe(true);
    expect(isTeamtrackerShowTeamNames(false)).toBe(false);
    expect(isTeamtrackerShowForm(undefined)).toBe(true);
    expect(isTeamtrackerShowForm(false)).toBe(false);
    expect(isTeamtrackerShowProgress(undefined)).toBe(true);
    expect(isTeamtrackerShowProgress(false)).toBe(false);
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
        team_record: "4-2-1",
        opponent_record: "5-1-1",
        team_form: "LDWW",
        opponent_form: "WDWW",
      },
    });
    expect(match?.teamShortName).toBe("PSV");
    expect(match?.opponentShortName).toBe("Ajax");
    expect(match?.homeAway).toBe("home");
    expect(match?.period).toBe("2ND");
    expect(match?.kickoffAt?.toISOString()).toBe("2026-09-23T18:00:00.000Z");
    expect(match?.teamRecord).toBe("4-2-1");
    expect(match?.opponentRecord).toBe("5-1-1");
    expect(match?.teamForm).toBe("LDWW");
    expect(match?.opponentForm).toBe("WDWW");
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

  it("formats PRE kickoff as date then time on one line", () => {
    const kickoff = new Date(2026, 9, 4, 20, 45, 0);
    expect(formatTeamtrackerKickoffDate(kickoff, "nl")).toMatch(/4 oktober 2026/i);
    expect(formatTeamtrackerKickoffDate(kickoff, "en")).toMatch(/4 October 2026/i);
    expect(formatTeamtrackerKickoffDateTime(kickoff, "nl")).toMatch(/^4 oktober 2026 20:45$/i);
    expect(formatTeamtrackerKickoffDateTime(kickoff, "en")).toMatch(/^4 October 2026 20:45$/i);
    expect(formatTeamtrackerKickoffDateTime(null, "nl")).toBe(null);
  });

  it("formats form lines and falls back to season record", () => {
    expect(formatTeamtrackerFormLine("LDWW", null)).toBe("L | D | W | W");
    expect(formatTeamtrackerFormLine("W,D,W,W", null)).toBe("W | D | W | W");
    expect(formatTeamtrackerFormLine(null, "4-2-1")).toBe("4-2-1");
    expect(formatTeamtrackerFormLine(null, null)).toBe(null);
    expect(readTeamtrackerRecord({ team_record: "3-1-2" }, "team")).toBe("3-1-2");
    expect(readTeamtrackerForm({ team_form: "WWDL" }, "team")).toBe("WWDL");
  });

  it("estimates match progress from clock and status", () => {
    expect(estimateTeamtrackerProgress({ status: "PRE" })).toBe(0);
    expect(estimateTeamtrackerProgress({ status: "POST" })).toBe(1);
    expect(estimateTeamtrackerProgress({ status: "IN", clock: "HT" })).toBe(0.5);
    expect(estimateTeamtrackerProgress({ status: "IN", clock: "67'" })).toBeCloseTo(67 / 90);
    expect(estimateTeamtrackerProgress({ status: "IN", clock: "45'+2" })).toBeCloseTo(47 / 90);
    expect(estimateTeamtrackerProgress({ status: "IN", period: "2ND" })).toBe(0.75);
  });
});
