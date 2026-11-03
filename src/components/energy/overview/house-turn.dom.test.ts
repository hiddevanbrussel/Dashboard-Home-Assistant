/**
 * @vitest-environment happy-dom
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NowHero } from "@/components/energy/overview/now-hero";
import { HOUSE_BACK_IDLE_MS } from "@/components/energy/overview/use-house-turn";
import { useEntityStateStore, type EntityState } from "@/stores/entity-state-store";
import { hydrateEnergyStore, useEnergyStore } from "@/stores/energy-store";
import { useEnergyOverviewStore } from "@/stores/energy-overview-store";
import { useLanguageStore } from "@/stores/language-store";
import { useThemeStore } from "@/stores/theme-store";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const sun: EntityState = { entity_id: "sun.sun", state: "above_horizon", attributes: {} };

function solarState(watts: string): EntityState {
  return {
    entity_id: "sensor.solar_power",
    state: watts,
    attributes: { device_class: "power", unit_of_measurement: "W", friendly_name: "Solar" },
  };
}

function button(): HTMLButtonElement {
  const node = document.querySelector("[data-now-turn]");
  if (!(node instanceof HTMLButtonElement)) throw new Error("turn button missing");
  return node;
}

describe("house turn", () => {
  let root: Root | null = null;
  let host: HTMLDivElement | null = null;

  beforeEach(() => {
    localStorage.clear();
    useLanguageStore.setState({ language: "nl", ready: true });
    useEnergyOverviewStore.setState({ tab: "overview", ready: true });
    useThemeStore.setState({ mode: "light", resolved: "light" });
    hydrateEnergyStore();
    useEnergyStore.getState().setEntity("solarPowerEntityId", "sensor.solar_power");
    useEntityStateStore.setState({ states: {}, updatedAt: null, error: null, optimisticLockUntil: {} });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 500, json: async () => ({ error: "down" }) }))
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
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  async function showFront() {
    useEntityStateStore.getState().setStates([solarState("1650"), sun]);
    await act(async () => {
      root?.render(createElement(NowHero, { orientation: "landscape", airconKwh: null }));
    });
    await vi.waitFor(() => {
      expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-hero")).not.toBe("pending");
    });
  }

  it("names the destination on each side and keeps focus on the button", async () => {
    await showFront();
    expect(button().textContent).toContain("Achterkant");
    expect(button().getAttribute("aria-label")).toBe("Draai naar de achterkant");
    expect(button().className).toContain("h-11");
    expect(button().disabled).toBe(false);
    expect(button().getAttribute("aria-disabled")).not.toBe("true");
    expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-side")).toBe("front");
    button().focus();
    vi.useFakeTimers();
    await act(async () => {
      button().click();
    });
    expect(button().disabled).toBe(false);
    expect(button().getAttribute("aria-disabled")).toBe("true");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(80);
    });
    expect(button().getAttribute("aria-disabled")).toBe("true");
    expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-side")).toBe("front");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(470);
    });
    expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-side")).toBe("back");
    expect(button().textContent).toContain("Voorkant");
    expect(button().getAttribute("aria-label")).toBe("Draai naar de voorkant");
    expect(button().disabled).toBe(false);
    expect(button().getAttribute("aria-disabled")).not.toBe("true");
    expect(document.activeElement).toBe(button());
    expect(document.querySelector("[data-now-frame]")?.getAttribute("style") ?? "").not.toContain("rotateY");
  });

  it("keeps focus after Enter or click, turns again on Space, and ignores a second activation", async () => {
    await showFront();
    button().focus();
    vi.useFakeTimers();
    await act(async () => {
      button().dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    });
    expect(button().getAttribute("aria-disabled")).toBe("true");
    expect(document.activeElement).toBe(button());
    await act(async () => {
      button().dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true }));
      button().click();
    });
    expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-side")).toBe("front");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(550);
    });
    expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-side")).toBe("back");
    expect(document.activeElement).toBe(button());
    expect(button().getAttribute("aria-disabled")).not.toBe("true");
    await act(async () => {
      button().dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true }));
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(550);
    });
    expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-side")).toBe("front");
    expect(document.activeElement).toBe(button());
    expect(button().textContent).toContain("Achterkant");
  });

  it("ignores a second press while the house is turning", async () => {
    await showFront();
    vi.useFakeTimers();
    await act(async () => {
      button().click();
      button().click();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(550);
    });
    expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-side")).toBe("back");
    expect(button().textContent).toContain("Voorkant");
  });

  it("returns to the front after 120s and resets that timer on pointerdown", async () => {
    await showFront();
    vi.useFakeTimers();
    await act(async () => {
      button().click();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(550);
    });
    expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-side")).toBe("back");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(HOUSE_BACK_IDLE_MS - 1000);
    });
    expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-side")).toBe("back");
    await act(async () => {
      document.dispatchEvent(new Event("pointerdown"));
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(HOUSE_BACK_IDLE_MS - 1000);
    });
    expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-side")).toBe("back");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000 + 550);
    });
    expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-side")).toBe("front");
    expect(button().textContent).toContain("Achterkant");
  });

  it("crossfades without rotateY when reduced motion is on", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }));
    await showFront();
    const frame = document.querySelector("[data-now-frame]");
    expect(frame?.getAttribute("data-now-motion")).toBe("reduce");
    vi.useFakeTimers();
    await act(async () => {
      button().click();
    });
    expect(button().disabled).toBe(false);
    expect(button().getAttribute("aria-disabled")).toBe("true");
    expect(frame?.getAttribute("style") ?? "").not.toContain("rotateY");
    expect(["", "none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(getComputedStyle(frame as Element).transform);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(document.querySelector("[data-now-frame]")?.getAttribute("style") ?? "").not.toContain("rotateY");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-side")).toBe("back");
    expect(document.querySelector("[data-now-frame]")?.getAttribute("style") ?? "").not.toContain("rotateY");
    expect(["", "none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(
      getComputedStyle(document.querySelector("[data-now-frame]") as Element).transform
    );
  });

  it("shows the aircon label only on the back, and only with a known total", async () => {
    useEntityStateStore.getState().setStates([solarState("1650"), sun]);
    await act(async () => {
      root?.render(
        createElement(NowHero, {
          orientation: "landscape",
          airconKwh: 2.4,
          labelOpens: (kind) => kind === "aircon",
        })
      );
    });
    await vi.waitFor(() => {
      expect(document.querySelector("[data-now-turn]")).toBeTruthy();
    });
    expect(document.querySelector("[data-now-label='aircon']")).toBeNull();
    vi.useFakeTimers();
    await act(async () => {
      button().click();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(550);
    });
    const label = document.querySelector("[data-now-label='aircon']");
    expect(label?.textContent).toContain("2,4");
    expect(label?.querySelector("[data-now-unit]")?.textContent).toBe("kWh");
    expect(label?.textContent?.replaceAll("kWh", "")).not.toContain("W");
    expect(label?.textContent).not.toContain("vandaag");
    expect(label?.getAttribute("aria-label")).toBe("Airco, 2,4 kWh, vandaag");
    expect(label?.tagName).toBe("BUTTON");
    expect(document.querySelector("[data-now-flow='aircon']")).toBeNull();

    await act(async () => {
      root?.render(createElement(NowHero, { orientation: "landscape", airconKwh: null }));
    });
    expect(document.querySelector("[data-now-label='aircon']")).toBeNull();
    expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-side")).toBe("back");
  });
});
