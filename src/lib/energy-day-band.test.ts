import { describe, expect, it } from "vitest";
import {
  bandCells,
  cardForHouseLabel,
  resolveSolarTodayKwh,
  solarBandMode,
  solarYieldToKwh,
  storySheetLabelKey,
  swapPhase,
} from "./energy-day-band";
import { getTranslations } from "./i18n";
import type { StoryFacts } from "./energy-story/types";

function facts(patch: Partial<StoryFacts> = {}): StoryFacts {
  return {
    hour: 14.5,
    sunsetHour: 18.5,
    night: false,
    hasSolar: true,
    hasBattery: true,
    hasGrid: true,
    linked: true,
    manualWithoutImport: false,
    solarKwh: 8,
    loadKwh: 10,
    importKwh: 1.3,
    exportKwh: 0.4,
    chargeKwh: 1,
    dischargeKwh: 0.5,
    yesterday: { solarKwh: 6, loadKwh: 9, selfPct: 40 },
    yesterdayImportKwh: 2,
    hours: [
      { hour: 8, loadKwh: 0.4 },
      { hour: 13, loadKwh: 1.6 },
    ],
    devices: [{ name: { nl: "Wasmachine", en: "Washing machine" }, kwh: 2.2, peakKwh: 1.1 }],
    hasDeviceConsumption: true,
    devicesKnown: true,
    soc: 56,
    chargeKw: 0.7,
    dischargeKw: 0,
    emptySinceHour: null,
    chargesFromSolarOnly: true,
    weekKwh: 13.9,
    lastWeekKwh: 15,
    weekDays: [{ weekday: 0, kwh: 2, current: true }],
    ltsDays: 8,
    tariffFixed: true,
    airconKwh: null,
    live: { solarKw: 1.65, homeKw: 0.7, gridImportKw: 0, gridExportKw: 0.25, chargeKw: 0.7, dischargeKw: 0 },
    ...patch,
  };
}

describe("day band", () => {
  it("builds the four cells from the story cards and drops a missing one", () => {
    const cells = bandCells(facts(), "nl");
    expect(cells.map((cell) => cell.kind)).toEqual(["solar", "grid", "peak", "week"]);
    expect(cells[0]?.detail).toBe("van je verbruik");
    expect(cells[0]?.unit).toBe("%");
    expect(cells[1]?.detail).toBe("Van het net, vandaag tot nu");
    expect(cells[1]?.unit).toBe("kWh");
    expect(cells[1]?.value).toBe("1,3");
    expect(cells[2]?.value).toBe("13:00–14:00");
    expect(cells[2]?.time).toBe(true);
    expect(cells[2]?.detail).toBe("Grootste verbruik");
    expect(cells[3]?.detail).toBe("Van het net, deze week tot nu");
    expect(cells[3]?.value).toBe("13,9");
    const english = bandCells(facts(), "en");
    expect(english[0]?.detail).toBe("of your usage");
    expect(english[1]?.detail).toBe("From the grid, today so far");
    const withoutSolar = bandCells(facts({ hasSolar: false, solarKwh: 0 }), "nl");
    expect(withoutSolar.map((cell) => cell.kind)).not.toContain("solar");
    expect(withoutSolar.length).toBeGreaterThan(0);
  });

  it("opens the matching card, the hint, or the manual link", () => {
    const full = facts();
    expect(cardForHouseLabel(full, "solar")?.kind).toBe("solar");
    expect(cardForHouseLabel(full, "house")?.kind).toBe("devices");
    expect(cardForHouseLabel(full, "grid")?.kind).toBe("grid");
    expect(cardForHouseLabel(full, "battery")?.kind).toBe("battery");
    expect(storySheetLabelKey(cardForHouseLabel(full, "solar")!)).toBe("energy.story.sun");

    const hint = facts({ devices: [], devicesKnown: true });
    expect(cardForHouseLabel(hint, "house")?.kind).toBe("hint");
    const unknown = facts({ devices: [], devicesKnown: false });
    expect(cardForHouseLabel(unknown, "house")).toBeNull();

    const manual = facts({ manualWithoutImport: true, importKwh: null, hasGrid: false });
    expect(cardForHouseLabel(manual, "grid")?.kind).toBe("link");
    const linkTitleKey = storySheetLabelKey(cardForHouseLabel(manual, "grid")!);
    expect(linkTitleKey).toBe("energy.story.gridLabel");
    expect(getTranslations("nl")[linkTitleKey]).toBe("Net");
    expect(getTranslations("en")[linkTitleKey]).toBe("Grid");
    expect(linkTitleKey).not.toBe("energy.story.devices");
    expect(cardForHouseLabel(facts({ soc: null }), "battery")).toBeNull();
    expect(cardForHouseLabel(facts({ airconKwh: 2.4 }), "aircon")).toEqual({ kind: "aircon", todayKwh: 2.4 });
    expect(cardForHouseLabel(facts({ airconKwh: null }), "aircon")).toBeNull();
    expect(storySheetLabelKey({ kind: "aircon", todayKwh: 2.4 })).toBe("energy.story.aircon");
    expect(getTranslations("nl")["energy.story.aircon"]).toBe("Airco");
    expect(getTranslations("en")["energy.story.aircon"]).toBe("Air conditioning");
    expect(bandCells(facts({ linked: false }), "nl")).toEqual([]);
  });
});

function ariaFacts(patch: Partial<StoryFacts> = {}): StoryFacts {
  return facts({ loadKwh: 10, importKwh: 1.7, solarKwh: 8, ...patch });
}

describe("solar band swap", () => {
  it("follows the mode table", () => {
    expect(solarBandMode({ night: false, yesterday: false, solarTodayKwh: 4.2, reducedMotion: false })).toBe("swap");
    expect(solarBandMode({ night: false, yesterday: true, solarTodayKwh: 4.2, reducedMotion: false })).toBe("static");
    expect(solarBandMode({ night: false, yesterday: false, solarTodayKwh: 0.049, reducedMotion: false })).toBe("static");
    expect(solarBandMode({ night: false, yesterday: false, solarTodayKwh: null, reducedMotion: false })).toBe("static");
    expect(solarBandMode({ night: true, yesterday: false, solarTodayKwh: 4.2, reducedMotion: false })).toBe("todayOnly");
    expect(solarBandMode({ night: true, yesterday: false, solarTodayKwh: 4.2, reducedMotion: true })).toBe("todayOnly");
    expect(solarBandMode({ night: false, yesterday: false, solarTodayKwh: 4.2, reducedMotion: true })).toBe("static");

    const day = bandCells(ariaFacts(), "nl", { solarTodayKwh: 4.2 });
    expect(day[0]?.swap).toBe("swap");
    expect(day[0]?.value).toBe("83");
    expect(day[0]?.unit).toBe("%");
    expect(day.map((cell) => cell.kind)).toEqual(["solar", "grid", "peak", "week"]);

    const yesterday = bandCells(
      facts({
        solarKwh: 0.2,
        hour: 8,
        night: false,
        yesterday: { solarKwh: 6, loadKwh: 9, selfPct: 40 },
      }),
      "nl",
      { solarTodayKwh: 4.2 }
    )[0];
    expect(yesterday?.swap).toBe("static");
    expect(yesterday?.alt).toBeUndefined();
    expect(yesterday?.unit).toBe("%");
    expect(yesterday?.ariaLabel).toBe("");

    const low = bandCells(facts(), "nl", { solarTodayKwh: 0.049 })[0];
    expect(low?.swap).toBe("static");
    expect(low?.alt).toBeUndefined();
    expect(low?.ariaLabel).toBe("");

    const missing = bandCells(facts(), "nl", { solarTodayKwh: null })[0];
    expect(missing?.swap).toBe("static");
    expect(missing?.alt).toBeUndefined();

    const night = bandCells(ariaFacts({ night: true, hour: 21, sunsetHour: 18 }), "nl", { solarTodayKwh: 4.2 })[0];
    expect(night?.swap).toBe("todayOnly");
    expect(night?.value).toBe("4,2");
    expect(night?.unit).toBe("kWh");
    expect(night?.detail).toBe("opgewekt vandaag");

    const nightWithoutCard = bandCells(
      facts({ night: true, hour: 21, sunsetHour: 18, solarKwh: 0.2 }),
      "nl",
      { solarTodayKwh: 4.2 }
    );
    expect(nightWithoutCard.map((cell) => cell.kind)).not.toContain("solar");

    const reduced = bandCells(ariaFacts(), "nl", { solarTodayKwh: 4.2, reducedMotion: true })[0];
    expect(reduced?.swap).toBe("static");
    expect(reduced?.value).toBe("83");
    expect(reduced?.unit).toBe("%");
    expect(reduced?.alt).toBeUndefined();
    expect(reduced?.ariaLabel).toBe("Zon, 83% van je verbruik, 4,2 kWh opgewekt vandaag");
  });

  it("formats kWh and never offers a zero alt", () => {
    expect(bandCells(facts(), "nl", { solarTodayKwh: 4.2 })[0]?.alt).toEqual({
      value: "4,2",
      unit: "kWh",
      detail: "opgewekt vandaag",
    });
    expect(bandCells(facts(), "en", { solarTodayKwh: 4.2 })[0]?.alt).toEqual({
      value: "4.2",
      unit: "kWh",
      detail: "generated today",
    });
    expect(bandCells(facts(), "nl", { solarTodayKwh: 12.64 })[0]?.alt?.value).toBe("12,6");
    expect(bandCells(facts(), "nl", { solarTodayKwh: 104.4 })[0]?.alt?.value).toBe("104");
    expect(bandCells(facts(), "nl", { solarTodayKwh: 0.05 })[0]?.alt?.value).toBe("0,1");
    expect(bandCells(facts(), "nl", { solarTodayKwh: 0.049 })[0]?.alt).toBeUndefined();
    const shown = JSON.stringify(bandCells(facts(), "nl", { solarTodayKwh: 4.2 })[0]);
    expect(shown).not.toMatch(/(?<![kK])Wh/);
    expect(shown).not.toContain("0,0");
    expect(shown).not.toContain("€");
  });

  it("converts Wh and MWh before the alt is built", () => {
    expect(solarYieldToKwh(4200, "Wh")).toBe(4.2);
    expect(solarYieldToKwh(0.0042, "MWh")).toBeCloseTo(4.2);
    expect(bandCells(facts(), "nl", { solarTodayKwh: solarYieldToKwh(4200, "Wh") })[0]?.alt?.value).toBe("4,2");
    expect(bandCells(facts(), "nl", { solarTodayKwh: solarYieldToKwh(0.0042, "MWh") })[0]?.alt?.value).toBe("4,2");
    expect(resolveSolarTodayKwh({ state: "4200", unit: "Wh", factsKwh: 1 })).toBe(4.2);
    expect(resolveSolarTodayKwh({ state: "0.0042", unit: "MWh", factsKwh: 1 })).toBeCloseTo(4.2);
    expect(resolveSolarTodayKwh({ state: "4.2", unit: "kWh", factsKwh: 9 })).toBe(4.2);
    expect(resolveSolarTodayKwh({ state: "0", unit: "kWh", factsKwh: 4.2 })).toBe(0);
    expect(resolveSolarTodayKwh({ state: "unavailable", factsKwh: 4.2 })).toBe(4.2);
    expect(resolveSolarTodayKwh({ state: "unknown", factsKwh: null })).toBeNull();
    expect(resolveSolarTodayKwh({ state: "nope", factsKwh: 3 })).toBe(3);
    expect(resolveSolarTodayKwh({ state: "", factsKwh: null })).toBeNull();
    expect(resolveSolarTodayKwh({ state: "-1", unit: "kWh", factsKwh: 4.2 })).toBe(4.2);
  });

  it("splits the shared clock into 8s then 5s", () => {
    expect(swapPhase(0)).toBe("primary");
    expect(swapPhase(7999)).toBe("primary");
    expect(swapPhase(8000)).toBe("alt");
    expect(swapPhase(12999)).toBe("alt");
    expect(swapPhase(13000)).toBe("primary");
  });

  it("builds a stable aria sentence in Dutch and English", () => {
    const nl = bandCells(ariaFacts(), "nl", { solarTodayKwh: 4.2 })[0];
    const en = bandCells(ariaFacts(), "en", { solarTodayKwh: 4.2 })[0];
    expect(nl?.ariaLabel).toBe("Zon, 83% van je verbruik, 4,2 kWh opgewekt vandaag");
    expect(en?.ariaLabel).toBe("Solar, 83% of your usage, 4.2 kWh generated today");
    const evening = bandCells(ariaFacts({ night: true, hour: 21, sunsetHour: 18 }), "nl", { solarTodayKwh: 4.2 })[0];
    const eveningEn = bandCells(ariaFacts({ night: true, hour: 21, sunsetHour: 18 }), "en", { solarTodayKwh: 4.2 })[0];
    expect(evening?.ariaLabel).toBe("Zon, 4,2 kWh opgewekt vandaag, 83% van je verbruik");
    expect(eveningEn?.ariaLabel).toBe("Solar, 4.2 kWh generated today, 83% of your usage");
    expect(getTranslations("nl")["energy.band.solarToday"]).toBe("opgewekt vandaag");
    expect(getTranslations("en")["energy.band.solarToday"]).toBe("generated today");
  });
});
