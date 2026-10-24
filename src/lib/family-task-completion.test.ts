import { describe, expect, it } from "vitest";
import {
  isChoreSlotVisible,
  remainingVisibleTodayChores,
  savedCompletionId,
  shouldCelebrateCompletingToday,
  type TodayChoreRef,
} from "./family-task-completion";

const chores: TodayChoreRef[] = [
  { choreId: "bed", frequency: "daily", completionId: null, penalty: false },
  { choreId: "tafel", frequency: "daily", completionId: null, penalty: false },
  { choreId: "avond:1", frequency: "daily", completionId: null, penalty: false },
  { choreId: "week", frequency: "weekly", completionId: null, penalty: false },
  { choreId: "afspraak", frequency: "daily", completionId: null, penalty: true },
];

describe("visible today chores", () => {
  it("hides evening slots before the evening hour and always shows the morning slot", () => {
    expect(isChoreSlotVisible("avond:1", 12, 13)).toBe(false);
    expect(isChoreSlotVisible("ochtend:0", 8, 13)).toBe(true);
    expect(isChoreSlotVisible("bed", 8, 13)).toBe(true);
    expect(isChoreSlotVisible("avond:1", 13, 13)).toBe(true);
  });

  it("counts only visible tasks for today, not weekly and not a hidden evening slot", () => {
    const left = remainingVisibleTodayChores(chores, "tafel", 10, 13);
    expect(left).toBe(2);
  });

  it("celebrates only when nothing visible remains and the task is not a penalty", () => {
    const daily = { choreId: "bed", frequency: "daily", penalty: false };
    expect(shouldCelebrateCompletingToday(daily, 0, 10, 13)).toBe(true);
    expect(shouldCelebrateCompletingToday(daily, 1, 10, 13)).toBe(false);
    expect(shouldCelebrateCompletingToday({ ...daily, penalty: true }, 0, 10, 13)).toBe(false);
    expect(shouldCelebrateCompletingToday({ ...daily, frequency: "weekdays" }, 0, 10, 13)).toBe(true);
  });

  it("does not celebrate a weekly task, even when every daily task is already done", () => {
    const done = chores.map((c) => ({ ...c, completionId: c.frequency === "weekly" ? null : "x" }));
    const left = remainingVisibleTodayChores(done, "week", 20, 13);
    expect(left).toBe(0);
    expect(shouldCelebrateCompletingToday({ choreId: "week", frequency: "weekly", penalty: false }, left, 20, 13)).toBe(false);
  });

  it("does not celebrate an evening slot that is not on screen yet", () => {
    expect(shouldCelebrateCompletingToday({ choreId: "avond:1", frequency: "daily", penalty: false }, 0, 10, 13)).toBe(false);
    expect(shouldCelebrateCompletingToday({ choreId: "avond:1", frequency: "daily", penalty: false }, 0, 13, 13)).toBe(true);
  });

  it("offers undo only after a real save", () => {
    expect(savedCompletionId(true, "c1")).toBe("c1");
    expect(savedCompletionId(false, "c1")).toBeNull();
    expect(savedCompletionId(true, "optimistic")).toBeNull();
    expect(savedCompletionId(true, "")).toBeNull();
  });
});
