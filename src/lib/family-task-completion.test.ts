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
    expect(shouldCelebrateCompletingToday(0, false)).toBe(true);
    expect(shouldCelebrateCompletingToday(1, false)).toBe(false);
    expect(shouldCelebrateCompletingToday(0, true)).toBe(false);
  });

  it("offers undo only after a real save", () => {
    expect(savedCompletionId(true, "c1")).toBe("c1");
    expect(savedCompletionId(false, "c1")).toBeNull();
    expect(savedCompletionId(true, "optimistic")).toBeNull();
    expect(savedCompletionId(true, "")).toBeNull();
  });
});
