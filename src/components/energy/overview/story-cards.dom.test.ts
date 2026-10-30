/**
 * @vitest-environment happy-dom
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StoryCardView } from "@/components/energy/overview/story-cards";
import { OVERVIEW_REFRESH_MS } from "@/hooks/use-energy-overview-data";
import { createStoryIdle, STORY_IDLE_MS } from "@/lib/energy-story/carousel";
import { heroOfflineState } from "@/lib/energy-story/offline";
import { useLanguageStore } from "@/stores/language-store";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function OfflineLine({ time }: { time: string }) {
  const state = heroOfflineState({
    haReachable: false,
    prefsReady: true,
    linked: true,
    hasMeasurement: false,
    houseKw: null,
    lastAt: null,
    timeZone: "Europe/Amsterdam",
  });
  return createElement(
    "div",
    {
      "data-offline": state.offline ? "1" : "0",
      "data-animate": state.animate ? "1" : "0",
      "data-mint": state.mintLine ? "1" : "0",
    },
    createElement("span", { "data-dot": state.badge }),
    createElement("span", null, `offline · laatst ${time}`),
    createElement("b", null, "–"),
    createElement("p", null, `Home Assistant is even niet bereikbaar. Je ziet de laatste waarden van ${time}.`)
  );
}

describe("story card view", () => {
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

  it("renders the hint without a close button and counts it as a card", () => {
    act(() => {
      root?.render(createElement(StoryCardView, { card: { kind: "hint", mode: "choose" } }));
    });
    expect(document.body.textContent).toContain("Welk apparaat verbruikt het meest?");
    expect(document.body.textContent).toContain("Apparaten kiezen");
    expect(document.querySelector("[data-story-card='hint']")).toBeTruthy();
    expect(document.querySelector("[data-story-close]")).toBeNull();
    expect(document.querySelector("a")?.getAttribute("href")).toContain("apparaten=1");
    expect(document.querySelector("a")?.className).toContain("h-11");
    expect(document.querySelector("a")?.className).toContain("w-fit");
    expect(document.body.textContent).not.toContain("€");
    act(() => {
      root?.render(createElement(StoryCardView, { card: { kind: "hint", mode: "setup" } }));
    });
    expect(document.body.textContent).toContain("Zo stel je het in");
    act(() => {
      root?.render(createElement(StoryCardView, { card: { kind: "link" } }));
    });
    expect(document.body.textContent).toContain("Koppel je energiesensoren");
    expect(document.body.textContent).toContain("Naar instellingen");
  });
});

describe("offline markup", () => {
  it("renders the offline dot, the dash and no animation flag", () => {
    const html = renderToString(createElement(OfflineLine, { time: "18:42" }));
    expect(html).toContain("data-dot=\"offline\"");
    expect(html).toContain("offline · laatst 18:42");
    expect(html).toContain("Home Assistant is even niet bereikbaar. Je ziet de laatste waarden van 18:42.");
    expect(html).toContain(">–<");
    expect(html).toContain("data-animate=\"0\"");
    expect(html).toContain("data-mint=\"0\"");
    expect(html).not.toContain("€");
    expect(html).not.toContain("rust");
  });
});

describe("story idle clock", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts the default timer through window.setTimeout", () => {
    vi.useFakeTimers();
    const reset = vi.fn();
    const idle = createStoryIdle(reset);
    vi.advanceTimersByTime(STORY_IDLE_MS);
    expect(reset).toHaveBeenCalledOnce();
    idle.stop();
  });
});

describe("overview refresh", () => {
  it("waits five minutes between history loads", () => {
    expect(OVERVIEW_REFRESH_MS).toBe(300_000);
    const source = readFileSync(path.join(process.cwd(), "src/hooks/use-energy-overview-data.ts"), "utf8");
    expect(source).toContain("OVERVIEW_REFRESH_MS");
    expect(source).not.toContain("5000");
    const cards = readFileSync(path.join(process.cwd(), "src/components/energy/overview/story-cards.tsx"), "utf8");
    const carousel = readFileSync(path.join(process.cwd(), "src/components/energy/overview/story-carousel.tsx"), "utf8");
    expect(`${cards}\n${carousel}`).not.toContain("€");
    expect(`${cards}\n${carousel}`).not.toContain("backdrop-filter");
    expect(`${cards}\n${carousel}`).not.toContain("Vast tarief");
    expect(cards).not.toContain("@keyframes");
  });
});
