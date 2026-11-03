/**
 * @vitest-environment happy-dom
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { act, createElement, useEffect, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DayBand } from "@/components/energy/overview/day-band";
import { resetSwapClockForTests } from "@/hooks/use-swap-clock";
import { bandCells } from "@/lib/energy-day-band";
import type { StoryFacts } from "@/lib/energy-story/types";
import { useLanguageStore } from "@/stores/language-store";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

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
    importKwh: 1.7,
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

function cellsFor(options: { solarTodayKwh?: number | null; reducedMotion?: boolean; night?: boolean } = {}) {
  return bandCells(
    facts(options.night ? { night: true, hour: 21, sunsetHour: 18 } : {}),
    "nl",
    { solarTodayKwh: options.solarTodayKwh === undefined ? 4.2 : options.solarTodayKwh, reducedMotion: options.reducedMotion }
  );
}

function renderBand(
  root: Root,
  options: { paused?: boolean; reducedMotion?: boolean; night?: boolean; solarTodayKwh?: number | null } = {}
) {
  root.render(
    createElement(DayBand, {
      cells: cellsFor(options),
      showLink: false,
      orientation: "landscape",
      dark: false,
      paused: options.paused ?? false,
      reducedMotion: options.reducedMotion ?? false,
      onOpen: () => {},
    })
  );
}

function solarButton(): HTMLButtonElement {
  const button = document.querySelector("[data-band-cell='solar']");
  if (!(button instanceof HTMLButtonElement)) throw new Error("missing solar cell");
  return button;
}

describe("solar band roll", () => {
  let root: Root | null = null;
  let host: HTMLDivElement | null = null;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"] });
    vi.setSystemTime(0);
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
    resetSwapClockForTests();
    vi.useRealTimers();
  });

  it("keeps one aria sentence, hides the faces, and rolls on the shared clock", async () => {
    await act(async () => {
      renderBand(root!);
    });
    const button = solarButton();
    const aria = "Zon, 83% van je verbruik, 4,2 kWh opgewekt vandaag";
    expect(button.getAttribute("aria-label")).toBe(aria);
    expect(button.getAttribute("data-band-swap")).toBe("pct");
    const band = document.querySelector("[data-energy-band]");
    expect(band?.querySelector("[aria-live]")).toBeNull();
    expect(band?.querySelector("[role='status']")).toBeNull();
    const layers = button.querySelectorAll("[data-band-layer]");
    expect(layers).toHaveLength(2);
    for (const layer of layers) expect(layer.getAttribute("aria-hidden")).toBe("true");
    expect(button.querySelector(".energy-band-roll")?.getAttribute("aria-hidden")).toBe("true");
    expect(button.querySelector("[data-band-layer='pct']")?.getAttribute("data-roll")).toBe("show");
    expect(button.querySelector("[data-band-layer='kwh']")?.getAttribute("data-roll")).toBe("in");

    await act(async () => {
      vi.advanceTimersByTime(8000);
    });
    expect(button.getAttribute("data-band-swap")).toBe("kwh");
    expect(button.getAttribute("aria-label")).toBe(aria);
    expect(button.querySelector("[data-band-layer='pct']")?.getAttribute("data-roll")).toBe("out");
    expect(button.querySelector("[data-band-layer='kwh']")?.getAttribute("data-roll")).toBe("show");

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });
    expect(button.getAttribute("data-band-swap")).toBe("pct");
    expect(button.getAttribute("aria-label")).toBe(aria);
    expect(button.querySelector("[data-band-layer='pct']")?.getAttribute("data-roll")).toBe("show");
    expect(button.querySelector("[data-band-layer='kwh']")?.getAttribute("data-roll")).toBe("out");
    expect(button.textContent).not.toContain("€");
    expect(button.textContent ?? "").not.toMatch(/(?<![kK])Wh/);
    expect(button.textContent).not.toContain("0,0");
  });

  it("holds the swap on keyboard focus (:focus-visible), then snaps when that focus leaves", async () => {
    await act(async () => {
      renderBand(root!);
    });
    const button = solarButton();
    // happy-dom treats :focus-visible like :focus, so the stub stands in for Chrome: Tab matches.
    stubFocusVisible(button, true);
    await act(async () => {
      button.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
      button.focus();
    });
    expect(document.activeElement).toBe(button);
    expect(button.matches(":focus-visible")).toBe(true);
    await act(async () => {
      vi.advanceTimersByTime(8000);
    });
    expect(button.getAttribute("data-band-swap")).toBe("pct");
    await act(async () => {
      button.blur();
    });
    expect(button.getAttribute("data-band-swap")).toBe("kwh");
  });

  it("does not hold the swap after a pointer tap or opener.focus() when the sheet closes", async () => {
    await act(async () => {
      renderBand(root!);
    });
    const tapped = solarButton();
    // A tap focuses the cell, but Chrome does not mark that focus :focus-visible.
    stubFocusVisible(tapped, false);
    await act(async () => {
      tapped.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1, pointerType: "touch" }));
      tapped.focus();
    });
    expect(document.activeElement).toBe(tapped);
    expect(tapped.matches(":focus-visible")).toBe(false);
    await act(async () => {
      vi.advanceTimersByTime(8000);
    });
    expect(document.activeElement).toBe(tapped);
    expect(tapped.getAttribute("data-band-swap")).toBe("kwh");

    await act(async () => {
      root?.unmount();
    });
    resetSwapClockForTests();
    vi.setSystemTime(0);
    root = createRoot(host!);
    const bandProps = {
      cells: cellsFor(),
      showLink: false,
      orientation: "landscape" as const,
      dark: false,
      paused: false,
      reducedMotion: false,
      onOpen: () => {},
    };
    await act(async () => {
      root?.render(createElement("div", null, createElement(DayBand, bandProps), createElement(SheetFocusReturn)));
    });
    const returned = solarButton();
    stubFocusVisible(returned, false);
    await act(async () => {
      root?.render(createElement("div", null, createElement(DayBand, bandProps)));
    });
    expect(document.activeElement).toBe(returned);
    expect(returned.matches(":focus-visible")).toBe(false);
    await act(async () => {
      vi.advanceTimersByTime(8000);
    });
    expect(document.activeElement).toBe(returned);
    expect(solarButton().getAttribute("data-band-swap")).toBe("kwh");
  });

  it("holds the face while paused, then snaps to the running phase", async () => {
    await act(async () => {
      root?.unmount();
    });
    resetSwapClockForTests();
    vi.setSystemTime(0);
    root = createRoot(host!);
    await act(async () => {
      renderBand(root!, { paused: true });
    });
    const paused = solarButton();
    expect(paused.getAttribute("data-band-swap")).toBe("pct");
    await act(async () => {
      vi.advanceTimersByTime(8000);
    });
    expect(paused.getAttribute("data-band-swap")).toBe("pct");
    await act(async () => {
      renderBand(root!, { paused: false });
    });
    expect(solarButton().getAttribute("data-band-swap")).toBe("kwh");
  });

  it("does not roll under reduced motion or after sunset", async () => {
    await act(async () => {
      renderBand(root!, { reducedMotion: true });
    });
    const reduced = solarButton();
    expect(reduced.getAttribute("data-band-swap")).toBeNull();
    expect(reduced.querySelector("[data-band-layer]")).toBeNull();
    expect(reduced.querySelector("[data-band-value]")?.textContent).toBe("83");
    expect(reduced.getAttribute("aria-label")).toBe("Zon, 83% van je verbruik, 4,2 kWh opgewekt vandaag");
    await act(async () => {
      vi.advanceTimersByTime(13000);
    });
    expect(reduced.querySelector("[data-band-value]")?.textContent).toBe("83");
    expect(reduced.textContent).not.toContain("4,2");

    await act(async () => {
      renderBand(root!, { night: true });
    });
    const evening = solarButton();
    expect(evening.getAttribute("data-band-swap")).toBe("kwh");
    expect(evening.querySelectorAll("[data-band-layer]")).toHaveLength(1);
    expect(evening.querySelector("[data-band-layer='kwh']")).toBeTruthy();
    expect(evening.querySelector("[data-band-value]")?.textContent).toBe("4,2");
    expect(evening.textContent).not.toContain("83");
    expect(evening.getAttribute("aria-label")).toBe("Zon, 4,2 kWh opgewekt vandaag, 83% van je verbruik");
    await act(async () => {
      vi.advanceTimersByTime(13000);
    });
    expect(evening.getAttribute("data-band-swap")).toBe("kwh");
    expect(evening.querySelector("[data-band-value]")?.textContent).toBe("4,2");
  });

  it("keeps the band as tall as a band without a swap, and leaves the other cells alone", async () => {
    const style = document.createElement("style");
    style.textContent = `
      .text-\\[34px\\] { font-size: 34px; line-height: 1; }
      .text-\\[28px\\] { font-size: 28px; line-height: 1; }
      .text-\\[13px\\] { font-size: 13px; line-height: 1; }
      .text-\\[12px\\] { font-size: 12px; line-height: 1; }
      .leading-none { line-height: 1; }
      .mt-1\\.5 { margin-top: 6px; }
      .mt-\\[3px\\] { margin-top: 3px; }
      .py-\\[14px\\] { padding-top: 14px; padding-bottom: 14px; }
      .block { display: block; }
      .energy-band-roll { display: grid; height: 54px; margin-top: 6px; margin-bottom: -5px; overflow: hidden; }
    `;
    document.head.appendChild(style);

    function px(value: string): number {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    function faceHeight(button: HTMLElement): number {
      const pad = px(getComputedStyle(button).paddingTop) + px(getComputedStyle(button).paddingBottom);
      const label = button.querySelector(":scope > span");
      const labelHeight = label instanceof HTMLElement ? px(getComputedStyle(label).fontSize) : 0;
      const roll = button.querySelector(".energy-band-roll");
      if (roll instanceof HTMLElement) {
        const rollStyle = getComputedStyle(roll);
        return pad + labelHeight + px(rollStyle.marginTop) + px(rollStyle.height) + px(rollStyle.marginBottom);
      }
      const value = button.querySelector("[data-band-value]")?.parentElement;
      const detail = value?.nextElementSibling;
      const valueStyle = value instanceof HTMLElement ? getComputedStyle(value) : null;
      const detailStyle = detail instanceof HTMLElement ? getComputedStyle(detail) : null;
      return (
        pad +
        labelHeight +
        px(valueStyle?.marginTop ?? "0") +
        px(valueStyle?.fontSize ?? "0") +
        px(detailStyle?.marginTop ?? "0") +
        px(detailStyle?.fontSize ?? "0")
      );
    }

    const swapHost = document.createElement("div");
    const staticHost = document.createElement("div");
    document.body.append(swapHost, staticHost);
    const swapRoot = createRoot(swapHost);
    const staticRoot = createRoot(staticHost);
    await act(async () => {
      swapRoot.render(
        createElement(DayBand, {
          cells: cellsFor({ solarTodayKwh: 4.2 }),
          showLink: false,
          orientation: "landscape",
          dark: false,
          onOpen: () => {},
        })
      );
      staticRoot.render(
        createElement(DayBand, {
          cells: cellsFor({ solarTodayKwh: null }),
          showLink: false,
          orientation: "landscape",
          dark: false,
          onOpen: () => {},
        })
      );
    });

    const swapSolar = swapHost.querySelector("[data-band-cell='solar']");
    const staticSolar = staticHost.querySelector("[data-band-cell='solar']");
    const swapGrid = swapHost.querySelector("[data-band-cell='grid']");
    const staticGrid = staticHost.querySelector("[data-band-cell='grid']");
    expect(swapSolar).toBeTruthy();
    expect(staticSolar).toBeTruthy();
    expect(faceHeight(swapSolar as HTMLElement)).toBe(faceHeight(staticSolar as HTMLElement));
    expect(faceHeight(swapSolar as HTMLElement)).toBe(faceHeight(swapGrid as HTMLElement));
    expect(swapGrid?.innerHTML).toBe(staticGrid?.innerHTML);
    expect(swapHost.querySelector("[data-band-cell='peak']")?.innerHTML).toBe(
      staticHost.querySelector("[data-band-cell='peak']")?.innerHTML
    );
    expect(swapHost.querySelector("[data-band-cell='week']")?.innerHTML).toBe(
      staticHost.querySelector("[data-band-cell='week']")?.innerHTML
    );

    const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    expect(css).toMatch(/\.energy-band-roll\s*\{[^}]*height:\s*54px/);
    expect(css).toMatch(/\.energy-band-roll\s*\{[^}]*margin-bottom:\s*-5px/);
    expect(css).toContain("cubic-bezier(0.3, 0, 0.2, 1)");
    expect(css).toContain("translateY(-100%)");
    expect(css).toContain("translateY(100%)");

    await act(async () => {
      swapRoot.unmount();
      staticRoot.unmount();
    });
    swapHost.remove();
    staticHost.remove();
    style.remove();
  });
});

/** happy-dom reports :focus-visible for every focused element. Chrome does not, after a tap or opener.focus(). */
function stubFocusVisible(element: HTMLElement, visible: boolean) {
  const original = element.matches.bind(element);
  element.matches = (selectors: string) => (selectors === ":focus-visible" ? visible : original(selectors));
}

/** Same cleanup as EnergyStorySheet: opener?.focus() when the sheet unmounts. */
function SheetFocusReturn() {
  useEffect(() => {
    return () => {
      document.querySelector<HTMLElement>("[data-band-cell='solar']")?.focus();
    };
  }, []);
  return null;
}

function PauseHarness() {
  const [paused, setPaused] = useState(true);
  return createElement(
    "div",
    null,
    createElement(DayBand, {
      cells: cellsFor(),
      showLink: false,
      orientation: "landscape",
      dark: false,
      paused,
      onOpen: () => {},
    }),
    createElement("button", { type: "button", "data-test-release": "1", onClick: () => setPaused(false) }, "release")
  );
}

describe("solar band pause release", () => {
  let root: Root | null = null;
  let host: HTMLDivElement | null = null;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"] });
    vi.setSystemTime(0);
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
    resetSwapClockForTests();
    vi.useRealTimers();
  });

  it("releases from inside the tree", async () => {
    await act(async () => {
      root?.render(createElement(PauseHarness));
    });
    expect(solarButton().getAttribute("data-band-swap")).toBe("pct");
    await act(async () => {
      vi.advanceTimersByTime(8000);
    });
    expect(solarButton().getAttribute("data-band-swap")).toBe("pct");
    await act(async () => {
      document.querySelector<HTMLButtonElement>("[data-test-release]")?.click();
    });
    expect(solarButton().getAttribute("data-band-swap")).toBe("kwh");
  });
});
