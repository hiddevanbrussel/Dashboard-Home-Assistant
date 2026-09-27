import { describe, expect, it } from "vitest";
import {
  buildNutsWeekBars,
  computeNutsMonthTrend,
  formatNutsValue,
  normalizeNutsAccent,
  nutsChartScale,
  startOfWeekMonday,
  sumNutsMonth,
} from "./nuts-card";

describe("nuts-card helpers", () => {
  it("normalizes accent", () => {
    expect(normalizeNutsAccent("production")).toBe("production");
    expect(normalizeNutsAccent("consumption")).toBe("consumption");
    expect(normalizeNutsAccent("nope")).toBe("consumption");
  });

  it("builds Mon–Sun week bars from daily history", () => {
    // Fixed Wednesday 2026-09-23
    const ref = new Date("2026-09-23T12:00:00");
    const monday = startOfWeekMonday(ref);
    expect(monday.getDay()).toBe(1);

    const points = [
      { date: "2026-09-21", consumption: 10 }, // Mon
      { date: "2026-09-22", consumption: 20 },
      { date: "2026-09-23", consumption: 5 },
      { date: "2026-09-25", consumption: 15 }, // Fri
    ];
    const bars = buildNutsWeekBars(points, ref);
    expect(bars).toHaveLength(7);
    expect(bars[0].value).toBe(10);
    expect(bars[1].value).toBe(20);
    expect(bars[2].value).toBe(5);
    expect(bars[3].value).toBe(0);
    expect(bars[4].value).toBe(15);
  });

  it("sums month totals and computes trend favorability", () => {
    const points = [
      { date: "2026-08-10", consumption: 100 },
      { date: "2026-08-20", consumption: 100 },
      { date: "2026-09-05", consumption: 150 },
      { date: "2026-09-15", consumption: 98 },
    ];
    expect(sumNutsMonth(points, 2026, 7)).toBe(200); // August
    expect(sumNutsMonth(points, 2026, 8)).toBe(248); // September

    const ref = new Date("2026-09-20T12:00:00");
    const consumptionTrend = computeNutsMonthTrend(points, "consumption", ref);
    expect(consumptionTrend?.direction).toBe("up");
    expect(consumptionTrend?.favorable).toBe(false);
    expect(consumptionTrend?.percent).toBe(24);

    const productionTrend = computeNutsMonthTrend(points, "production", ref);
    expect(productionTrend?.favorable).toBe(true);
  });

  it("builds a nice chart scale", () => {
    const scale = nutsChartScale([12, 26, 9]);
    expect(scale.max).toBe(30);
    expect(scale.ticks[0]).toBe(0);
    expect(scale.ticks.at(-1)).toBe(30);
    expect(scale.ticks).toEqual([0, 10, 20, 30]);
  });

  it("formats values with Dutch decimal comma", () => {
    expect(formatNutsValue(8.4, "kWh")).toBe("8,4 kWh");
    expect(formatNutsValue(14, "kWh")).toBe("14 kWh");
    expect(formatNutsValue(undefined, "kWh")).toBe("—");
  });
});
