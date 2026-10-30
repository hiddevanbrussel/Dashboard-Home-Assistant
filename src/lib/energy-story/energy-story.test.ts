import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildStoryCards } from "./cards";
import { createStoryIdle, stepStoryIndex, storyArrowEnabled, storyIndexAfterIdle, storyIndexAfterScroll, storyIndexFromScroll, storyPagerVisible, storyScrollLeft, STORY_IDLE_MS } from "./carousel";
import { formatKwh, largestRemainder, selfPctShown } from "./format";
import { getTranslations } from "@/lib/i18n";
import { heroOfflineState } from "./offline";
import { batterySentence, deviceSentence, gridSentence, nowSentence, peakSentence, solarSentence, weekSentence } from "./sentences";
import type { StoryFacts, StoryLine } from "./types";

const PRICE = 0.27;

function text(line: StoryLine | string | null, language: "nl" | "en"): string {
  if (line == null) return "";
  return typeof line === "string" ? line : line[language];
}

function baseFacts(patch: Partial<StoryFacts>): StoryFacts {
  return {
    hour: 14.5,
    sunsetHour: 18.516666666666666,
    night: false,
    hasSolar: true,
    hasBattery: true,
    hasGrid: true,
    linked: true,
    manualWithoutImport: false,
    solarKwh: 6.925,
    loadKwh: 9.28,
    importKwh: 3.48,
    exportKwh: 0.325,
    chargeKwh: 2.3,
    dischargeKwh: 1.5,
    yesterday: { solarKwh: 5.555, loadKwh: 18.4905, selfPct: 36.8026824585598 },
    yesterdayImportKwh: 1.2883 / PRICE,
    hours: [
      { hour: 0, loadKwh: 0.42 },
      { hour: 1, loadKwh: 0.38 },
      { hour: 2, loadKwh: 0.35 },
      { hour: 3, loadKwh: 0.35 },
      { hour: 4, loadKwh: 0.36 },
      { hour: 5, loadKwh: 0.45 },
      { hour: 6, loadKwh: 0.7 },
      { hour: 7, loadKwh: 0.95 },
      { hour: 8, loadKwh: 0.8 },
      { hour: 9, loadKwh: 0.62 },
      { hour: 10, loadKwh: 0.55 },
      { hour: 11, loadKwh: 0.6 },
      { hour: 12, loadKwh: 0.85 },
      { hour: 13, loadKwh: 1.55 },
    ],
    devices: [
      { name: { nl: "Warmtepomp", en: "Heat pump" }, kwh: 2.322, peakKwh: 0.155 },
      { name: { nl: "Wasmachine", en: "Washing machine" }, kwh: 1.1, peakKwh: 1.1 },
      { name: { nl: "Koelkast", en: "Fridge" }, kwh: 0.435, peakKwh: 0.03 },
    ],
    hasDeviceConsumption: true,
    devicesKnown: true,
    soc: 56,
    chargeKw: 0.7,
    dischargeKw: 0,
    emptySinceHour: null,
    chargesFromSolarOnly: true,
    weekKwh: 9.8996 / PRICE,
    lastWeekKwh: 11.42 / PRICE,
    weekDays: [],
    ltsDays: 30,
    tariffFixed: true,
    live: { solarKw: 1.65, homeKw: 0.7, gridImportKw: 0, gridExportKw: 0.25, chargeKw: 0.7, dischargeKw: 0 },
    ...patch,
  };
}

const afternoon = baseFacts({});
const night = baseFacts({
  hour: 23 + 10 / 60,
  night: true,
  solarKwh: 10.1,
  loadKwh: 17.21,
  importKwh: 6.06,
  exportKwh: 0.45,
  chargeKwh: 3.25,
  dischargeKwh: 4.75,
  yesterdayImportKwh: 3.0417 / PRICE,
  weekKwh: 10.5962 / PRICE,
  soc: 10,
  chargeKw: 0,
  dischargeKw: 0,
  emptySinceHour: 22,
  devices: [
    { name: { nl: "Warmtepomp", en: "Heat pump" }, kwh: 4.305, peakKwh: 0.155 },
    { name: { nl: "Wasmachine", en: "Washing machine" }, kwh: 1.1, peakKwh: 1.1 },
    { name: { nl: "Koelkast", en: "Fridge" }, kwh: 0.695, peakKwh: 0.03 },
  ],
  live: { solarKw: 0, homeKw: 0.48, gridImportKw: 0.48, gridExportKw: 0, chargeKw: 0, dischargeKw: 0 },
});
const morning = baseFacts({
  hour: 7.5,
  night: true,
  solarKwh: 0,
  loadKwh: 3.485,
  importKwh: 1.985,
  exportKwh: 0,
  chargeKwh: 0,
  dischargeKwh: 1.5,
  yesterdayImportKwh: 0.6505 / PRICE,
  weekKwh: 9.496 / PRICE,
  hours: [
    { hour: 0, loadKwh: 0.42 },
    { hour: 1, loadKwh: 0.38 },
    { hour: 2, loadKwh: 0.35 },
    { hour: 3, loadKwh: 0.35 },
    { hour: 4, loadKwh: 0.36 },
    { hour: 5, loadKwh: 0.45 },
    { hour: 6, loadKwh: 0.7 },
  ],
  devices: [
    { name: { nl: "Warmtepomp", en: "Heat pump" }, kwh: 1.161, peakKwh: 0.21 },
    { name: { nl: "Koelkast", en: "Fridge" }, kwh: 0.225, peakKwh: 0.03 },
    { name: { nl: "Wasmachine", en: "Washing machine" }, kwh: 0, peakKwh: 0 },
  ],
  soc: 10,
  chargeKw: 0,
  dischargeKw: 0,
  emptySinceHour: 4,
  live: { solarKw: 0, homeKw: 0.95, gridImportKw: 0.95, gridExportKw: 0, chargeKw: 0, dischargeKw: 0 },
});
const noSolar = baseFacts({
  hasSolar: false,
  hasBattery: false,
  solarKwh: 0,
  loadKwh: 9.28,
  importKwh: 9.28,
  exportKwh: 0,
  chargeKwh: 0,
  dischargeKwh: 0,
  yesterday: { solarKwh: 0, loadKwh: 18.4905, selfPct: 0 },
  yesterdayImportKwh: 2.6309 / PRICE,
  soc: null,
  chargeKw: 0,
  ltsDays: 5,
  weekKwh: null,
  live: { solarKw: 0, homeKw: 0.7, gridImportKw: 0.7, gridExportKw: 0, chargeKw: 0, dischargeKw: 0 },
});

function parts(facts: StoryFacts): string[] {
  const solar = solarSentence(facts);
  const grid = gridSentence(facts);
  const peak = peakSentence(facts);
  const battery = batterySentence(facts);
  const device = deviceSentence(facts);
  const week = weekSentence(facts);
  const now = nowSentence(facts);
  return [now, solar?.lead, solar?.big, solar?.tail, grid?.lead, grid?.big, grid?.tail, peak?.lead, peak?.big, peak?.sub, peak?.tail, battery?.lead, battery?.big, battery?.tail, device?.lead, device?.big, device?.tail, week?.lead, week?.big, week?.tail]
    .flatMap((part) => (part == null ? [] : typeof part === "string" ? [part] : [part.nl, part.en]));
}

describe("story sentences", () => {
  it("matches the 14:30 example, in kWh instead of euros", () => {
    expect(text(nowSentence(afternoon), "nl")).toBe("De zon dekt je huis nu volledig, de rest gaat terug.");
    expect(text(nowSentence(afternoon), "en")).toBe("The sun covers the whole house; the rest goes to the grid.");
    const solar = solarSentence(afternoon);
    expect(text(solar?.lead ?? null, "nl")).toBe("Zon en batterij dekten tot nu");
    expect(text(solar?.lead ?? null, "en")).toBe("Sun and battery covered so far");
    expect(solar?.big).toBe("63%");
    expect(text(solar?.tail ?? null, "en")).toBe("of your usage");
    const grid = gridSentence(afternoon);
    expect(text(grid?.lead ?? null, "nl")).toBe("Van het net, vandaag tot nu");
    expect(text(grid?.lead ?? null, "en")).toBe("From the grid, today so far");
    expect(text(grid?.big ?? null, "nl")).toBe("3,5 kWh");
    expect(text(grid?.big ?? null, "en")).toBe("3.5 kWh");
    expect(text(grid?.tail ?? null, "nl")).toBe("1,3 kWh minder dan gisteren rond deze tijd.");
    expect(text(grid?.tail ?? null, "en")).toBe("1.3 kWh less than yesterday at this time.");
    const peak = peakSentence(afternoon);
    expect(peak?.big).toBe("13:00–14:00");
    expect(text(peak?.sub ?? null, "nl")).toBe("1,6 kWh");
    expect(text(peak?.tail ?? null, "nl")).toBe("Toen draaide de wasmachine.");
    expect(text(peak?.tail ?? null, "en")).toBe("The washing machine was running.");
    const battery = batterySentence(afternoon);
    expect(battery?.big).toBe("56%");
    expect(text(battery?.tail ?? null, "nl")).toBe("Laadt nu met 700 W uit zon.");
    expect(text(battery?.tail ?? null, "en")).toBe("Charging at 700 W from solar.");
    const device = deviceSentence(afternoon);
    expect(text(device?.lead ?? null, "nl")).toBe("Warmtepomp verbruikte");
    expect(text(device?.big ?? null, "nl")).toBe("2,3 kWh");
    expect(text(device?.tail ?? null, "nl")).toBe("25% van je verbruik tot nu.");
    expect(text(device?.tail ?? null, "en")).toBe("25% of your usage so far.");
    const week = weekSentence(afternoon);
    expect(text(week?.lead ?? null, "nl")).toBe("Van het net, deze week tot nu");
    expect(text(week?.lead ?? null, "en")).toBe("From the grid, this week so far");
    expect(text(week?.big ?? null, "nl")).toBe("36,7 kWh");
    expect(text(week?.big ?? null, "en")).toBe("36.7 kWh");
    expect(text(week?.tail ?? null, "nl")).toBe("5,6 kWh minder dan vorige week.");
    expect(text(week?.tail ?? null, "en")).toBe("5.6 kWh less than last week.");
  });

  it("matches 23:10, 07:30 and a house without solar or a battery", () => {
    expect(text(nowSentence(night), "nl")).toBe("Je huis haalt nu 480 W van het net.");
    expect(text(solarSentence(night)?.lead ?? null, "nl")).toBe("Zon en batterij dekten vandaag");
    expect(solarSentence(night)?.big).toBe("65%");
    expect(text(gridSentence(night)?.big ?? null, "nl")).toBe("6,1 kWh");
    expect(text(gridSentence(night)?.tail ?? null, "nl")).toBe("5,2 kWh minder dan gisteren rond deze tijd.");
    expect(text(batterySentence(night)?.tail ?? null, "nl")).toBe("Leeg sinds 22:00. Laadt weer op zon.");
    expect(text(batterySentence(night)?.tail ?? null, "en")).toBe("Empty since 22:00. Recharges from solar.");
    expect(text(deviceSentence(night)?.big ?? null, "nl")).toBe("4,3 kWh");
    expect(text(deviceSentence(night)?.tail ?? null, "nl")).toBe("25% van je verbruik vandaag.");
    expect(text(weekSentence(night)?.big ?? null, "nl")).toBe("39,2 kWh");

    expect(text(nowSentence(morning), "nl")).toBe("Je huis haalt nu 950 W van het net.");
    expect(text(solarSentence(morning)?.lead ?? null, "nl")).toBe("Gisteren: zon en batterij dekten");
    expect(text(solarSentence(morning)?.lead ?? null, "en")).toBe("Yesterday: sun and battery covered");
    expect(solarSentence(morning)?.big).toBe("37%");
    expect(text(gridSentence(morning)?.big ?? null, "nl")).toBe("2,0 kWh");
    expect(text(gridSentence(morning)?.tail ?? null, "nl")).toBe("0,4 kWh minder dan gisteren rond deze tijd.");
    expect(text(peakSentence(morning)?.big ?? null, "nl")).toBe("06:00–07:00");
    expect(text(peakSentence(morning)?.sub ?? null, "nl")).toBe("0,7 kWh");
    expect(text(peakSentence(morning)?.tail ?? null, "nl")).toBe("Geen apparaat sprong eruit.");
    expect(text(peakSentence(morning)?.tail ?? null, "en")).toBe("No single device stood out.");
    expect(text(batterySentence(morning)?.tail ?? null, "nl")).toBe("Leeg sinds 04:00. Laadt weer op zon.");
    expect(text(deviceSentence(morning)?.big ?? null, "nl")).toBe("1,2 kWh");
    expect(text(deviceSentence(morning)?.tail ?? null, "nl")).toBe("33% van je verbruik tot nu.");

    expect(solarSentence(noSolar)).toBeNull();
    expect(batterySentence(noSolar)).toBeNull();
    expect(weekSentence(noSolar)).toBeNull();
    expect(text(nowSentence(noSolar), "nl")).toBe("Je huis haalt nu 700 W van het net.");
    expect(text(gridSentence(noSolar)?.big ?? null, "nl")).toBe("9,3 kWh");
    expect(text(peakSentence(noSolar)?.tail ?? null, "nl")).toBe("Toen draaide de wasmachine.");
    expect(text(deviceSentence(noSolar)?.lead ?? null, "en")).toBe("Heat pump used");
  });

  it("keeps every sentence within 60 characters and never mentions money", () => {
    const lines = [afternoon, night, morning, noSolar].flatMap(parts);
    expect(lines.length).toBeGreaterThan(20);
    for (const line of lines) {
      expect(line.length).toBeLessThanOrEqual(60);
      expect(line).not.toContain("€");
      expect(line).not.toContain("—");
      expect(line.toLowerCase()).not.toContain("onbekend");
      expect(line.toLowerCase()).not.toContain("vast tarief");
    }
  });

  it("says about the same when the rounded kWh difference is under the threshold", () => {
    const same = gridSentence(baseFacts({ importKwh: 3.48, yesterdayImportKwh: 3.52 }));
    expect(text(same?.tail ?? null, "nl")).toBe("Ongeveer evenveel als gisteren.");
    const more = gridSentence(baseFacts({ importKwh: 4.2, yesterdayImportKwh: 3.48 }));
    expect(text(more?.tail ?? null, "nl")).toBe("0,7 kWh meer dan gisteren rond deze tijd.");
    const week = weekSentence(baseFacts({ weekKwh: 10, lastWeekKwh: 10.04 }));
    expect(text(week?.tail ?? null, "nl")).toBe("Ongeveer evenveel als vorige week.");
    expect(text(weekSentence(baseFacts({ hour: 23.95, weekKwh: 10, lastWeekKwh: 12 }))?.tail ?? null, "en")).toBe(
      "2.0 kWh less than last week."
    );
    const late = gridSentence(baseFacts({ hour: 23.95, importKwh: 3, yesterdayImportKwh: 4 }));
    expect(text(late?.tail ?? null, "nl")).toBe("1,0 kWh minder dan gisteren.");
    expect(text(late?.tail ?? null, "en")).not.toContain("at this time");
  });

  it("clamps self-sufficiency and splits the solar bar to 100", () => {
    expect(selfPctShown(99.6, 10, 0.04)).toBe(100);
    expect(selfPctShown(0.2, 10, 9.96)).toBe(0);
    expect(selfPctShown(0.4, 10, 8)).toBe(1);
    expect(selfPctShown(100, 10, 1)).toBe(99);
    expect(largestRemainder([1, 1, 1]).reduce((sum, value) => sum + value, 0)).toBe(100);
    expect(formatKwh(100.4, "nl")).toBe("100 kWh");
  });

  it("names a device only when it was at least half of the peak hour", () => {
    const quiet = peakSentence(baseFacts({ devices: [{ name: { nl: "Wasmachine", en: "Washing machine" }, kwh: 1, peakKwh: 0.4 }] }));
    expect(text(quiet?.tail ?? null, "nl")).toBe("Geen apparaat sprong eruit.");
    expect(deviceSentence(baseFacts({ devices: [{ name: { nl: "Lamp", en: "Lamp" }, kwh: 0.4, peakKwh: 0.1 }] }))).toBeNull();
    const capped = deviceSentence(
      baseFacts({
        loadKwh: 3.4,
        devices: [{ name: { nl: "Koelkast", en: "Fridge" }, kwh: 3.9, peakKwh: 0.2 }],
      })
    );
    expect(text(capped?.tail ?? null, "nl")).toBe("100% van je verbruik tot nu.");
    expect(text(capped?.tail ?? null, "en")).toBe("100% of your usage so far.");
    expect(peakSentence(baseFacts({ tariffFixed: false }))).toBeNull();
    expect(peakSentence(baseFacts({ loadKwh: 0.4 }))).toBeNull();
  });

  it("drops the solar phrase when the battery is charging from the grid", () => {
    const charging = batterySentence(baseFacts({ chargesFromSolarOnly: false, emptySinceHour: null, chargeKw: 0.7 }));
    expect(text(charging?.tail ?? null, "nl")).toBe("Laadt nu met 700 W.");
    expect(text(charging?.tail ?? null, "en")).toBe("Charging at 700 W.");
    const unscoped = baseFacts({ importKwh: null, weekKwh: null, solarKwh: 6.9, yesterdayImportKwh: null });
    expect(gridSentence(unscoped)).toBeNull();
    expect(weekSentence(unscoped)).toBeNull();
    expect(solarSentence(unscoped)).toBeNull();
    const empty = batterySentence(baseFacts({ chargesFromSolarOnly: false, emptySinceHour: 22, soc: 10, chargeKw: 0 }));
    expect(text(empty?.tail ?? null, "nl")).toBe("Leeg sinds 22:00.");
  });
});

describe("story cards", () => {
  it("hides cards without data and keeps the hint until a device is chosen", () => {
    const full = buildStoryCards(afternoon);
    expect(full.map((card) => card.kind)).toEqual(["solar", "grid", "peak", "battery", "devices", "week"]);
    const hint = buildStoryCards(baseFacts({ devices: [] }));
    expect(hint.map((card) => card.kind)).toEqual(["solar", "grid", "peak", "battery", "hint", "week"]);
    expect(hint.find((card) => card.kind === "hint")).toMatchObject({ mode: "choose" });
    const setup = buildStoryCards(baseFacts({ devices: [], hasDeviceConsumption: false }));
    expect(setup.find((card) => card.kind === "hint")).toMatchObject({ mode: "setup" });
    const waiting = buildStoryCards(baseFacts({ devices: [], devicesKnown: false }));
    expect(waiting.some((card) => card.kind === "hint")).toBe(false);
    const chosen = buildStoryCards(baseFacts({ devices: [afternoon.devices[0]!] }));
    expect(chosen.some((card) => card.kind === "hint")).toBe(false);
    expect(chosen.some((card) => card.kind === "devices")).toBe(true);
    const below = buildStoryCards(
      baseFacts({ devices: [{ name: { nl: "Lamp", en: "Lamp" }, kwh: 0.2, peakKwh: 0.05 }] })
    );
    expect(below.some((card) => card.kind === "devices" || card.kind === "hint")).toBe(false);
    expect(below).toHaveLength(5);
    const bare = buildStoryCards(noSolar);
    expect(bare.map((card) => card.kind)).toEqual(["grid", "peak", "devices"]);
    const link = buildStoryCards(baseFacts({ linked: false }));
    expect(link).toEqual([{ kind: "link" }]);
    const manual = buildStoryCards(
      baseFacts({
        devices: [],
        hasDeviceConsumption: false,
        importKwh: null,
        weekKwh: null,
        yesterdayImportKwh: null,
        manualWithoutImport: true,
      })
    );
    expect(manual.some((card) => card.kind === "hint")).toBe(false);
    expect(manual.some((card) => card.kind === "link")).toBe(true);
    expect(manual.find((card) => card.kind === "link")).toEqual({ kind: "link" });
    const chosenManual = buildStoryCards(
      baseFacts({
        devices: [afternoon.devices[0]!],
        hasDeviceConsumption: true,
        importKwh: null,
        weekKwh: null,
        yesterdayImportKwh: null,
        manualWithoutImport: true,
      })
    );
    expect(chosenManual.some((card) => card.kind === "devices")).toBe(false);
    expect(chosenManual.some((card) => card.kind === "hint")).toBe(false);
    expect(chosenManual.find((card) => card.kind === "link")).toEqual({ kind: "link" });
  });

  it("does not build a price card", () => {
    expect(buildStoryCards(baseFacts({ tariffFixed: false })).some((card) => card.kind === "peak")).toBe(false);
    const kinds = buildStoryCards(afternoon).map((card) => card.kind);
    expect(kinds).not.toContain("cheap");
  });
});

describe("carousel index", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("stops at the ends and returns to the first card after two quiet minutes", () => {
    expect(stepStoryIndex(0, 6, "prev")).toBe(0);
    expect(stepStoryIndex(5, 6, "next")).toBe(5);
    expect(stepStoryIndex(2, 6, "next")).toBe(3);
    expect(storyArrowEnabled(0, 6)).toEqual({ prev: false, next: true });
    expect(storyArrowEnabled(5, 6)).toEqual({ prev: true, next: false });
    expect(storyIndexAfterIdle()).toBe(0);
    expect(storyScrollLeft(688, 16)).toBe(672);
    expect(storyScrollLeft(16, 16)).toBe(0);
    expect(storyIndexFromScroll([{ offsetLeft: 16 }, { offsetLeft: 312 }, { offsetLeft: 608 }], 296, 16)).toBe(1);
    const row = [
      { offsetLeft: 16 },
      { offsetLeft: 312 },
      { offsetLeft: 608 },
      { offsetLeft: 904 },
      { offsetLeft: 1200 },
    ];
    expect(storyIndexFromScroll(row, 800, 16, 900)).toBe(3);
    expect(storyIndexFromScroll(row, 900, 16, 900)).toBe(4);
    // 800×1280. Carousel portrait:w-[680px], card 332, gap 16, padding 0, five cards.
    // Targets 0, 348, 696, 1044, 1392. scrollWidth 1724. maxScroll 1044, shared with card 3.
    const portrait = [0, 348, 696, 1044, 1392].map((offsetLeft) => ({ offsetLeft }));
    expect(storyIndexFromScroll(portrait, 696, 0, 1044)).toBe(2);
    expect(storyIndexFromScroll(portrait, 1044, 0, 1044)).toBe(3);
    expect(storyIndexAfterScroll(portrait, 1044, 0, 1044, { fromControl: true, heldIndex: 3 })).toBe(3);
    expect(storyIndexAfterScroll(portrait, 1044, 0, 1044, { fromControl: true, heldIndex: 4 })).toBe(4);
    // 1280×800. Content 1280 − 88 sidebar − 560 hero = 632.
    // Landscape card 280, gap 16, padding 16. Targets 0, 296, 592, 888, 1184.
    // scrollWidth 1496, maxScroll 864. Card 3 (888) is already past that max.
    const landscape = [16, 312, 608, 904, 1200].map((offsetLeft) => ({ offsetLeft }));
    expect(1496 - 632).toBe(864);
    expect(storyIndexFromScroll(landscape, 864, 16, 864)).toBe(3);
    expect(storyIndexAfterScroll(landscape, 864, 16, 864, { fromControl: true, heldIndex: 4 })).toBe(4);
    expect(storyIndexFromScroll(landscape, 900, 16, 900)).toBe(4);
    expect(storyPagerVisible(1)).toBe(false);
    expect(storyPagerVisible(0)).toBe(false);
    expect(storyPagerVisible(2)).toBe(true);

    vi.useFakeTimers();
    const reset = vi.fn();
    const idle = createStoryIdle(reset, {
      schedule: (callback, ms) => setTimeout(callback, ms),
      clear: (timer) => clearTimeout(timer),
    });
    vi.advanceTimersByTime(STORY_IDLE_MS - 1);
    expect(reset).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(reset).toHaveBeenCalledOnce();
    idle.touch();
    vi.advanceTimersByTime(STORY_IDLE_MS - 1);
    expect(reset).toHaveBeenCalledOnce();
    vi.advanceTimersByTime(1);
    expect(reset).toHaveBeenCalledTimes(2);
    idle.stop();
  });
});

describe("offline hero", () => {
  const zone = "Europe/Amsterdam";
  const last = new Date("2026-10-23T16:42:00.000Z");

  it("dims the last reading and does not animate", () => {
    const state = heroOfflineState({
      haReachable: false,
      prefsReady: true,
      linked: true,
      hasMeasurement: true,
      houseKw: 0.48,
      lastAt: last,
      timeZone: zone,
    });
    expect(state.offline).toBe(true);
    expect(state.badge).toBe("offline");
    expect(state.time).toBe("18:42");
    expect(state.houseDash).toBe(false);
    expect(state.animate).toBe(false);
    expect(state.glow).toBe(false);
    expect(state.mintLine).toBe(false);
    expect(state.leadersDotted).toBe(true);
    expect(state.hideIdle).toBe(true);
  });

  it("uses a dash when the last value or the clock is unknown, and never a zero", () => {
    const unknown = heroOfflineState({
      haReachable: true,
      prefsReady: true,
      linked: true,
      hasMeasurement: false,
      houseKw: null,
      lastAt: null,
      timeZone: zone,
    });
    expect(unknown.offline).toBe(false);
    expect(unknown.badge).toBe("live");
    expect(unknown.houseDash).toBe(true);
    expect(unknown.time).toBe("");
    const down = heroOfflineState({
      haReachable: false,
      prefsReady: true,
      linked: true,
      hasMeasurement: true,
      houseKw: 0.48,
      lastAt: null,
      timeZone: zone,
    });
    expect(down.offline).toBe(true);
    expect(down.time).toBe("");
    const zero = heroOfflineState({
      haReachable: false,
      prefsReady: true,
      linked: true,
      hasMeasurement: true,
      houseKw: 0,
      lastAt: last,
      timeZone: zone,
    });
    expect(zero.houseDash).toBe(true);
    const live = heroOfflineState({
      haReachable: true,
      prefsReady: true,
      linked: true,
      hasMeasurement: true,
      houseKw: 0.7,
      lastAt: last,
      timeZone: zone,
    });
    expect(live.offline).toBe(false);
    expect(live.badge).toBe("live");
    expect(live.animate).toBe(true);
    const nl = getTranslations("nl");
    const en = getTranslations("en");
    expect(nl["energy.story.offlineBadge"].replace("{time}", "18:42")).toBe("offline · laatst 18:42");
    expect(en["energy.story.offlineBadge"].replace("{time}", "18:42")).toBe("offline · last 18:42");
    expect(nl["energy.story.offlineSentence"].replace("{time}", "18:42")).toBe(
      "Home Assistant is even niet bereikbaar. Je ziet de laatste waarden van 18:42."
    );
    expect(en["energy.story.offlineSentence"].replace("{time}", "18:42")).toBe(
      "Home Assistant can't be reached just now. You're seeing the last values from 18:42."
    );
    expect(nl["energy.story.offlineSentence"]).not.toContain("€");
  });
});

describe("story sources", () => {
  it("does not format money or call server-local clock helpers", () => {
    const root = path.join(process.cwd(), "src/lib/energy-story");
    const files = readdirSync(root).filter((name) => name.endsWith(".ts") && !name.endsWith(".test.ts"));
    expect(files.length).toBeGreaterThan(3);
    for (const name of files) {
      const full = path.join(root, name);
      expect(statSync(full).isFile()).toBe(true);
      const source = readFileSync(full, "utf8");
      expect(source).not.toContain("€");
      expect(source).not.toContain("costPerKwh");
      expect(source).not.toContain("stat_cost");
      expect(source).not.toContain("statCost");
      expect(source).not.toContain("toISOString().slice");
      expect(source).not.toContain("setHours(0)");
      expect(source).not.toContain("getHours()");
      expect(source).not.toContain("Vast tarief");
      if (name === "carousel.ts") expect(source).toContain("window.setTimeout");
    }
    expect(files).not.toContain("energy-costs.ts");
  });
});
