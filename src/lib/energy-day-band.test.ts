import { describe, expect, it } from "vitest";
import { bandCells, cardForHouseLabel, storySheetLabelKey } from "./energy-day-band";
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
    expect(cardForHouseLabel(facts({ soc: null }), "battery")).toBeNull();
    expect(bandCells(facts({ linked: false }), "nl")).toEqual([]);
  });
});
