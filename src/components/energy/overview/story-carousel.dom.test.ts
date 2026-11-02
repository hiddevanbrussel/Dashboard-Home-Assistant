/**
 * @vitest-environment happy-dom
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StoryCarousel } from "@/components/energy/overview/story-carousel";
import type { StoryFacts } from "@/lib/energy-story/types";
import { useLanguageStore } from "@/stores/language-store";

const { overview } = vi.hoisted(() => ({
  overview: {
    facts: null as StoryFacts | null,
    status: "ready" as "loading" | "ready" | "error",
  },
}));

vi.mock("@/hooks/use-energy-overview-data", () => ({
  useEnergyOverviewData: () => overview,
}));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function storyFacts(patch: Partial<StoryFacts>): StoryFacts {
  return {
    hour: 14.5,
    sunsetHour: 18.5,
    night: false,
    hasSolar: false,
    hasBattery: true,
    hasGrid: true,
    linked: true,
    manualWithoutImport: false,
    solarKwh: 0,
    loadKwh: 4,
    importKwh: 2,
    exportKwh: 0,
    chargeKwh: 0,
    dischargeKwh: 0,
    yesterday: null,
    yesterdayImportKwh: 3,
    hours: [
      { hour: 8, loadKwh: 0.2 },
      { hour: 13, loadKwh: 1.6 },
    ],
    devices: [],
    hasDeviceConsumption: true,
    devicesKnown: true,
    soc: 40,
    chargeKw: 0,
    dischargeKw: 0,
    emptySinceHour: null,
    chargesFromSolarOnly: true,
    weekKwh: 10,
    lastWeekKwh: 12,
    weekDays: [{ weekday: 0, kwh: 2, current: true }],
    ltsDays: 8,
    tariffFixed: true,
    live: { solarKw: 0, homeKw: 0.4, gridImportKw: 0.4, gridExportKw: 0, chargeKw: 0, dischargeKw: 0 },
    ...patch,
  };
}

function storyIndex(): string | null {
  return document.querySelector("[data-story-scroller]")?.getAttribute("data-story-index") ?? null;
}

function placeScroll(offsets: number[], scrollLeft: number, scrollWidth: number, clientWidth: number, paddingLeft: string) {
  const root = document.querySelector("[data-story-scroller]");
  if (!(root instanceof HTMLElement)) throw new Error("scroller");
  root.style.paddingLeft = paddingLeft;
  Object.defineProperty(root, "scrollWidth", { configurable: true, value: scrollWidth });
  Object.defineProperty(root, "clientWidth", { configurable: true, value: clientWidth });
  let left = scrollLeft;
  Object.defineProperty(root, "scrollLeft", {
    configurable: true,
    get: () => left,
    set: (value: number) => {
      left = value;
    },
  });
  [...root.querySelectorAll("[data-story-card]")].forEach((card, index) => {
    Object.defineProperty(card, "offsetLeft", { configurable: true, value: offsets[index] ?? 0 });
  });
  return root;
}

async function swipe() {
  const root = document.querySelector("[data-story-scroller]");
  if (!(root instanceof HTMLElement)) throw new Error("scroller");
  await act(async () => {
    root.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    root.dispatchEvent(new Event("scroll", { bubbles: true }));
  });
}

describe("story carousel", () => {
  let root: Root | null = null;
  let host: HTMLDivElement | null = null;

  beforeEach(() => {
    useLanguageStore.setState({ language: "nl", ready: true });
    overview.facts = storyFacts({});
    overview.status = "ready";
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        media: "",
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }))
    );
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root?.unmount());
    host?.remove();
    root = null;
    host = null;
    vi.unstubAllGlobals();
  });

  it("shows the cards without a heading, dots or arrows", async () => {
    await act(async () => {
      root?.render(createElement(StoryCarousel));
    });
    expect(document.querySelectorAll("[data-story-card]")).toHaveLength(5);
    expect(document.querySelector("[data-story-dot]")).toBeNull();
    expect(document.querySelector("[data-story-prev]")).toBeNull();
    expect(document.querySelector("[data-story-next]")).toBeNull();
    const section = document.querySelector("section");
    expect(section?.getAttribute("aria-label")).toBe("Verhaal");
    expect(section?.textContent).not.toContain("Verhaal");
    expect(storyIndex()).toBe("0");
    const scroller = document.querySelector("[data-story-scroller]");
    expect(scroller?.className).toContain("overflow-x-auto");
    expect(scroller?.className).toContain("snap-x");
    expect(scroller?.className).toContain("snap-mandatory");
    expect(scroller?.className).toContain("gap-3");
    const card = document.querySelector("[data-story-card]");
    expect(card?.className).toContain("w-[252px]");
    expect(card?.className).toContain("h-[280px]");
    expect(card?.className).toContain("portrait:w-[248px]");
    expect(card?.className).toContain("portrait:h-[272px]");
    expect(card?.className).not.toContain("shadow-glass");
    expect((card as HTMLElement).style.boxShadow).toBe("none");
  });

  it("still has no pager chrome when one card is left", async () => {
    overview.facts = storyFacts({ linked: false });
    await act(async () => {
      root?.render(createElement(StoryCarousel));
    });
    expect(document.querySelectorAll("[data-story-card]")).toHaveLength(1);
    expect(document.querySelector("[data-story-prev]")).toBeNull();
    expect(document.querySelector("[data-story-next]")).toBeNull();
    expect(document.querySelector("[data-story-dot]")).toBeNull();
  });

  it("follows a swipe to the nearest card", async () => {
    await act(async () => {
      root?.render(createElement(StoryCarousel));
    });
    expect(document.querySelectorAll("[data-story-card]")).toHaveLength(5);

    // 800×1280. portrait:w-[680px], card 332, gap 16, padding 0.
    // Targets 0, 348, 696, 1044, 1392. maxScroll 1044 is also card 3.
    placeScroll([0, 348, 696, 1044, 1392], 1044, 1724, 680, "0px");
    await swipe();
    expect(storyIndex()).toBe("3");

    // 1280×800. Client 632px. Penultimate target 888 is past max 864, so a swipe stays on card 3.
    placeScroll([16, 312, 608, 904, 1200], 864, 1496, 632, "16px");
    await swipe();
    expect(storyIndex()).toBe("3");

    // Wider landscape track: penultimate 888 is still before max 900, so max scroll is the last card.
    placeScroll([16, 312, 608, 904, 1200], 900, 1496, 596, "16px");
    await swipe();
    expect(storyIndex()).toBe("4");
  });
});
