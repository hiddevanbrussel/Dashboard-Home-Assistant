/**
 * @vitest-environment happy-dom
 */
import { act, createElement, useState, type RefObject } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DayBand } from "@/components/energy/overview/day-band";
import { EnergyStorySheet } from "@/components/energy/overview/energy-story-sheet";
import { bandCells } from "@/lib/energy-day-band";
import type { StoryCardModel, StoryFacts } from "@/lib/energy-story/types";
import { useLanguageStore } from "@/stores/language-store";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const solarCard: StoryCardModel = {
  kind: "solar",
  label: "sun",
  lead: { nl: "Zon en batterij dekten tot nu", en: "Sun and battery covered so far" },
  big: "83%",
  tail: { nl: "van je verbruik", en: "of your usage" },
  parts: [
    { key: "direct", pct: 70 },
    { key: "battery", pct: 13 },
    { key: "grid", pct: 17 },
  ],
};

function facts(): StoryFacts {
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
    devices: [],
    hasDeviceConsumption: false,
    devicesKnown: true,
    soc: 56,
    chargeKw: 0,
    dischargeKw: 0,
    emptySinceHour: null,
    chargesFromSolarOnly: true,
    weekKwh: 13.9,
    lastWeekKwh: 15,
    weekDays: [{ weekday: 0, kwh: 2, current: true }],
    ltsDays: 8,
    tariffFixed: true,
    live: { solarKw: 1.65, homeKw: 0.7, gridImportKw: 0, gridExportKw: 0.25, chargeKw: 0, dischargeKw: 0 },
  };
}

function SheetHarness({
  reducedMotion,
  offlineLabel,
  returnFocus,
}: {
  reducedMotion: boolean;
  offlineLabel: string | null;
  returnFocus: RefObject<HTMLElement | null>;
}) {
  const [card, setCard] = useState<StoryCardModel | null>(solarCard);
  return createElement(EnergyStorySheet, {
    card,
    label: "Zon",
    offlineLabel,
    reducedMotion,
    returnFocus,
    onClose: () => setCard(null),
  });
}

describe("energy story sheet", () => {
  let root: Root | null = null;
  let host: HTMLDivElement | null = null;

  beforeEach(() => {
    useLanguageStore.setState({ language: "nl", ready: true });
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root?.unmount());
    host?.remove();
    root = null;
    host = null;
  });

  it("opens one card, traps focus, and closes without a shadow", async () => {
    const opener = document.createElement("button");
    opener.type = "button";
    document.body.appendChild(opener);
    opener.focus();
    const returnFocus = { current: opener };
    await act(async () => {
      root?.render(
        createElement(SheetHarness, { reducedMotion: true, offlineLabel: "offline · laatst 18:42", returnFocus })
      );
    });
    const dialog = document.querySelector("[data-energy-story-sheet]");
    expect(dialog?.getAttribute("role")).toBe("dialog");
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
    expect(dialog?.getAttribute("aria-label")).toBe("Zon");
    expect(dialog?.getAttribute("tabindex")).toBe("-1");
    expect(document.activeElement).toBe(dialog);
    expect(document.body.innerHTML).not.toContain("shadow-[");
    expect(document.querySelector("[data-story-card='solar']")).toBeTruthy();
    expect(document.querySelector("[data-energy-sheet-offline]")?.textContent).toBe("offline · laatst 18:42");
    expect(dialog?.innerHTML).not.toContain("energy-story-sheet-in");
    const backdrop = document.querySelector("[data-energy-story-sheet] > button");
    expect(backdrop?.getAttribute("aria-label")).toBe("Sluiten");
    await act(async () => {
      backdrop?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(document.querySelector("[data-energy-story-sheet]")).toBeNull();
    expect(document.activeElement).toBe(opener);
    opener.remove();
  });

  it("closes on Escape and opens the band cell's card", async () => {
    const returnFocus = { current: null as HTMLElement | null };
    function BandHarness() {
      const [card, setCard] = useState<StoryCardModel | null>(null);
      const cells = bandCells(facts(), "nl");
      return createElement(
        "div",
        null,
        createElement(DayBand, {
          cells,
          showLink: false,
          orientation: "landscape",
          dark: false,
          onOpen: (next: StoryCardModel, source: HTMLElement) => {
            returnFocus.current = source;
            setCard(next);
          },
        }),
        createElement(EnergyStorySheet, {
          card,
          label: card ? "Net" : "",
          offlineLabel: null,
          reducedMotion: false,
          returnFocus,
          onClose: () => setCard(null),
        })
      );
    }
    await act(async () => {
      root?.render(createElement(BandHarness));
    });
    const grid = document.querySelector("[data-band-cell='grid']");
    expect(grid?.tagName).toBe("BUTTON");
    expect((grid as HTMLButtonElement).type).toBe("button");
    expect(grid?.textContent).toContain("1,3");
    expect(grid?.textContent).toContain("Van het net, vandaag tot nu");
    expect(grid?.textContent).not.toContain("€");
    await act(async () => {
      (grid as HTMLButtonElement).click();
    });
    expect(document.querySelector("[data-story-card='grid']")).toBeTruthy();
    expect(document.querySelector("[data-energy-story-sheet]")?.className).toContain("outline-none");
    expect(document.querySelector(".energy-story-sheet-in")).toBeTruthy();
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(document.querySelector("[data-energy-story-sheet]")).toBeNull();
    expect(document.activeElement).toBe(grid);
  });
});
