import {
  buildNutsChartBars,
  buildNutsMonthBars,
  buildNutsWeekBars,
  clampNutsCardHeight,
  clampNutsCardWidth,
  computeNutsMonthTrend,
  computeNutsTrend,
  computeNutsWeekTrend,
  formatNutsParts,
  formatNutsValue,
  normalizeNutsAccent,
  normalizeNutsPeriod,
  nutsCardDensity,
  nutsChartScale,
  nutsHistoryDays,
  resizeNutsCardFromBottomRight,
  shouldShowNutsMonthTick,
  startOfWeekMonday,
  sumNutsMonth,
  sumNutsWeek,
  toggleNutsPeriod,
} from "./nuts-card";

describe("nuts-card helpers", () => {
  it("normalizes accent and period", () => {
    expect(normalizeNutsAccent("production")).toBe("production");
    expect(normalizeNutsAccent("consumption")).toBe("consumption");
    expect(normalizeNutsAccent("nope")).toBe("consumption");
    expect(normalizeNutsPeriod("month")).toBe("month");
    expect(normalizeNutsPeriod("week")).toBe("week");
    expect(normalizeNutsPeriod("nope")).toBe("week");
    expect(normalizeNutsPeriod(undefined)).toBe("week");
  });

  it("toggles period between week and month", () => {
    expect(toggleNutsPeriod("week")).toBe("month");
    expect(toggleNutsPeriod("month")).toBe("week");
  });

  it("picks history window by period", () => {
    expect(nutsHistoryDays("week")).toBe(21);
    expect(nutsHistoryDays("month")).toBe(65);
  });

  it("uses compact density at 250×250", () => {
    expect(nutsCardDensity(250, 250)).toBe("compact");
    expect(nutsCardDensity(320, 300)).toBe("comfortable");
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

    const chart = buildNutsChartBars(points, "week", ref);
    expect(chart).toHaveLength(7);
    expect(chart[0].tick).toBe(0);
    expect(chart[0].value).toBe(10);
  });

  it("builds month bars for every day of the month", () => {
    const ref = new Date("2026-09-15T12:00:00");
    const points = [
      { date: "2026-09-01", consumption: 3 },
      { date: "2026-09-15", consumption: 9 },
      { date: "2026-09-30", consumption: 4 },
    ];
    const bars = buildNutsMonthBars(points, ref);
    expect(bars).toHaveLength(30);
    expect(bars[0]).toMatchObject({ tick: 1, value: 3 });
    expect(bars[14]).toMatchObject({ tick: 15, value: 9 });
    expect(bars[29]).toMatchObject({ tick: 30, value: 4 });
    expect(bars[1].value).toBe(0);

    expect(shouldShowNutsMonthTick(1, 30)).toBe(true);
    expect(shouldShowNutsMonthTick(5, 30)).toBe(true);
    expect(shouldShowNutsMonthTick(6, 30)).toBe(false);
    expect(shouldShowNutsMonthTick(30, 30)).toBe(true);
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

    expect(computeNutsTrend(points, "consumption", "month", ref)?.percent).toBe(24);
  });

  it("sums week totals and computes week-over-week trend", () => {
    // Week of Mon 2026-09-21 … Sun 2026-09-27 vs previous week
    const points = [
      { date: "2026-09-14", consumption: 10 },
      { date: "2026-09-15", consumption: 10 },
      { date: "2026-09-16", consumption: 10 },
      { date: "2026-09-17", consumption: 10 },
      { date: "2026-09-18", consumption: 10 },
      { date: "2026-09-19", consumption: 10 },
      { date: "2026-09-20", consumption: 10 }, // prev week = 70
      { date: "2026-09-21", consumption: 20 },
      { date: "2026-09-22", consumption: 20 },
      { date: "2026-09-23", consumption: 20 },
      { date: "2026-09-24", consumption: 10 },
      { date: "2026-09-25", consumption: 10 },
      { date: "2026-09-26", consumption: 10 },
      { date: "2026-09-27", consumption: 10 }, // this week = 100
    ];
    const ref = new Date("2026-09-23T12:00:00");
    const monday = startOfWeekMonday(ref);
    expect(sumNutsWeek(points, monday)).toBe(100);
    const prev = new Date(monday);
    prev.setDate(monday.getDate() - 7);
    expect(sumNutsWeek(points, prev)).toBe(70);

    const trend = computeNutsWeekTrend(points, "consumption", ref);
    expect(trend?.direction).toBe("up");
    expect(trend?.percent).toBe(43); // (100-70)/70 ≈ 42.8
    expect(trend?.favorable).toBe(false);

    expect(computeNutsTrend(points, "production", "week", ref)?.favorable).toBe(true);
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
    expect(formatNutsParts(18.2, "kWh")).toEqual({ value: "18,2", unit: "kWh" });
  });

  it("clamps width/height to card bounds", () => {
    expect(clampNutsCardWidth(100)).toBe(250);
    expect(clampNutsCardWidth(999)).toBe(480);
    expect(clampNutsCardHeight(100)).toBe(250);
    expect(clampNutsCardHeight(999)).toBe(420);
  });

  it("resizes from bottom-right within viewport and card clamps", () => {
    const next = resizeNutsCardFromBottomRight({
      startWidth: 320,
      startHeight: 300,
      startLeft: 40,
      startBottom: 200,
      dx: 80,
      dy: 60,
      viewportWidth: 1200,
      viewportHeight: 800,
    });
    expect(next.width).toBe(400);
    expect(next.height).toBe(360);
    expect(next.left).toBe(40);
    // top stays put: bottom = viewportHeight - top - height
    expect(next.bottom).toBe(800 - (800 - 200 - 300) - 360);
  });

  it("clamps resize height to remaining viewport space", () => {
    const next = resizeNutsCardFromBottomRight({
      startWidth: 320,
      startHeight: 300,
      startLeft: 40,
      startBottom: 40,
      dx: 0,
      dy: 200,
      viewportWidth: 1200,
      viewportHeight: 800,
    });
    // top=460 → maxHeight = min(420, 340) = 340
    expect(next.height).toBe(340);
    expect(next.bottom).toBe(0);
  });
});
