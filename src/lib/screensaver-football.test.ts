import { describe, expect, it } from "vitest";
import {
  footballMatchHasContent,
  footballMatchStatus,
  isLiveFootballMatch,
  normalizeFootballStatus,
  parseStateAsScore,
  readFootballMatch,
  SCREENSAVER_FOOTBALL_LIVE_BACKGROUND,
} from "./screensaver-football";

describe("normalizeFootballStatus", () => {
  it("accepts PRE, IN and POST in any case", () => {
    expect(normalizeFootballStatus("in")).toBe("IN");
    expect(normalizeFootballStatus(" Pre ")).toBe("PRE");
    expect(normalizeFootballStatus("POST")).toBe("POST");
  });

  it("ignores other values", () => {
    expect(normalizeFootballStatus("BYE")).toBe("");
    expect(normalizeFootballStatus("1-0")).toBe("");
    expect(normalizeFootballStatus(undefined)).toBe("");
  });
});

describe("footballMatchStatus", () => {
  it("prefers attributes.status over entity.state", () => {
    expect(
      footballMatchStatus({
        state: "PRE",
        attributes: { status: "IN" },
      })
    ).toBe("IN");
  });

  it("falls back to entity.state for Team Tracker sensors", () => {
    expect(footballMatchStatus({ state: "IN", attributes: {} })).toBe("IN");
    expect(footballMatchStatus({ state: "POST", attributes: {} })).toBe("POST");
  });
});

describe("isLiveFootballMatch", () => {
  it("is live only during IN", () => {
    expect(isLiveFootballMatch({ state: "IN", attributes: {} })).toBe(true);
    expect(isLiveFootballMatch({ state: "PRE", attributes: {} })).toBe(false);
    expect(isLiveFootballMatch({ state: "POST", attributes: {} })).toBe(false);
    expect(isLiveFootballMatch(null)).toBe(false);
  });
});

describe("parseStateAsScore", () => {
  it("parses hyphenated scores", () => {
    expect(parseStateAsScore("2-1")).toEqual(["2", "1"]);
    expect(parseStateAsScore("0 – 0")).toEqual(["0", "0"]);
  });

  it("rejects non-scores", () => {
    expect(parseStateAsScore("IN")).toBeNull();
    expect(parseStateAsScore("PSV")).toBeNull();
  });
});

describe("readFootballMatch", () => {
  it("reads Team Tracker attributes and shows scores while live", () => {
    const match = readFootballMatch({
      state: "IN",
      attributes: {
        team_long_name: "PSV",
        opponent_long_name: "Ajax",
        team_score: 2,
        opponent_score: 1,
        clock: "67'",
        team_logo: "/psv.png",
        opponent_logo: "/ajax.png",
      },
    });
    expect(match).toMatchObject({
      status: "IN",
      teamName: "PSV",
      opponentName: "Ajax",
      teamScore: "2",
      opponentScore: "1",
      clock: "67'",
      showScores: true,
    });
    expect(footballMatchHasContent(match)).toBe(true);
  });

  it("hides empty matches", () => {
    expect(footballMatchHasContent(readFootballMatch({ state: "unknown", attributes: {} }))).toBe(
      false
    );
  });
});

describe("live background", () => {
  it("points at the bundled match-day photo", () => {
    expect(SCREENSAVER_FOOTBALL_LIVE_BACKGROUND).toBe("/screensaver-football-live.jpg");
  });
});
