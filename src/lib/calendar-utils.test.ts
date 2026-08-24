import { describe, expect, it } from "vitest";
import { addDays, isSameDay, monthGridDays, startOfWeek, stepTime, toDateKey } from "./calendar-utils";

describe("calendar-utils", () => {
  it("starts the week on Monday", () => {
    const wednesday = new Date(2025, 8, 10); // 10 Sep 2025 is Wednesday
    const start = startOfWeek(wednesday);
    expect(start.getDay()).toBe(1);
    expect(toDateKey(start)).toBe("2025-09-08");
  });

  it("builds a 6-week month grid starting Monday", () => {
    const september = monthGridDays(new Date(2025, 8, 1)); // 1 Sep 2025 is Monday
    expect(september).toHaveLength(42);
    expect(september[0].getDay()).toBe(1);
    expect(toDateKey(september[0])).toBe("2025-09-01");

    const october = monthGridDays(new Date(2025, 9, 1)); // 1 Oct 2025 is Wednesday
    expect(october[0].getDay()).toBe(1);
    expect(toDateKey(october[0])).toBe("2025-09-29");
  });

  it("compares calendar days without time", () => {
    const a = new Date(2025, 8, 8, 9, 30);
    const b = new Date(2025, 8, 8, 18, 0);
    expect(isSameDay(a, b)).toBe(true);
    expect(isSameDay(a, addDays(b, 1))).toBe(false);
  });

  it("steps times in 15-minute wraps", () => {
    expect(stepTime("00:00", -15)).toBe("23:45");
    expect(stepTime("23:45", 15)).toBe("00:00");
    expect(stepTime("11:30", 90)).toBe("13:00");
  });
});
