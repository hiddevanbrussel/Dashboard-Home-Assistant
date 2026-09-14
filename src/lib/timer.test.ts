import { describe, expect, it } from "vitest";
import { formatTimerMs, timerRemainingMs, timerShouldRing } from "./timer";

describe("timer helpers", () => {
  it("formats minutes and seconds", () => {
    expect(formatTimerMs(0)).toBe("0:00");
    expect(formatTimerMs(1000)).toBe("0:01");
    expect(formatTimerMs(94_000)).toBe("1:34");
    expect(formatTimerMs(3_600_000)).toBe("1:00:00");
  });

  it("computes remaining time from endsAt while running", () => {
    expect(timerRemainingMs("running", 1_000, 0, 400)).toBe(600);
    expect(timerRemainingMs("paused", 1_000, 12_000, 400)).toBe(12_000);
    expect(timerRemainingMs("idle", null, 0, 400)).toBe(0);
    expect(timerRemainingMs("ringing", null, 0, 400)).toBe(0);
  });

  it("rings when the deadline has passed", () => {
    expect(timerShouldRing("running", 500, 500)).toBe(true);
    expect(timerShouldRing("running", 800, 500)).toBe(false);
    expect(timerShouldRing("paused", 100, 500)).toBe(false);
  });
});
