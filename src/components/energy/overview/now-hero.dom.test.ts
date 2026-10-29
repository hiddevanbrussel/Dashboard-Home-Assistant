/**
 * @vitest-environment happy-dom
 */
import { act, createElement, useEffect, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EnergyTabs } from "@/components/energy/overview/energy-tabs";
import { NowHero } from "@/components/energy/overview/now-hero";
import { useEntityStateStore, type EntityState } from "@/stores/entity-state-store";
import { hydrateEnergyStore, useEnergyStore } from "@/stores/energy-store";
import { useEnergyOverviewStore } from "@/stores/energy-overview-store";
import { useLanguageStore } from "@/stores/language-store";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function until(check: () => void) {
  return vi.waitFor(check);
}

function solarState(watts: string): EntityState {
  return {
    entity_id: "sensor.solar_power",
    state: watts,
    attributes: { device_class: "power", unit_of_measurement: "W", friendly_name: "Solar" },
  };
}

const sun: EntityState = { entity_id: "sun.sun", state: "above_horizon", attributes: {} };

describe("Nu hero live values", () => {
  let root: Root | null = null;
  let host: HTMLDivElement | null = null;

  beforeEach(() => {
    localStorage.clear();
    useLanguageStore.setState({ language: "nl", ready: true });
    useEnergyOverviewStore.setState({ tab: "overview", ready: true });
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
    vi.unstubAllGlobals();
  });

  it("follows a solar step from 1.65 kW down to zero", async () => {
    useEntityStateStore.getState().setStates([solarState("1650"), sun]);
    await act(async () => {
      root?.render(createElement(NowHero, { orientation: "landscape" }));
    });
    await until(() => {
      expect(document.querySelector("[data-now-label='solar'] b")?.textContent).toBe("1,65 kW");
    });
    for (let step = 0; step < 3; step += 1) {
      await act(async () => {
        useEntityStateStore.getState().setStates([solarState("0"), sun]);
      });
    }
    await until(() => {
      const value = document.querySelector("[data-now-label='solar'] b")?.textContent ?? "";
      expect(value).toBe("0 W");
      expect(value).not.toContain("0,83");
    });
  });

  it("does not load the zonder house before prefs decide the variant", async () => {
    useEnergyStore.getState().setEntity("solarPowerEntityId", "");
    let release: (value: Response) => void = () => undefined;
    const pending = new Promise<Response>((resolve) => {
      release = resolve;
    });
    vi.stubGlobal("fetch", vi.fn(() => pending));
    await act(async () => {
      root?.render(createElement(NowHero, { orientation: "landscape" }));
    });
    expect(document.querySelector("img")).toBeNull();
    expect(document.body.innerHTML).not.toContain("huis-zonder-");
    release(
      new Response(
        JSON.stringify({
          source: "prefs",
          energySources: [{ type: "solar", statEnergyFrom: "sensor.solar_yield", statRate: "sensor.solar_power" }],
          deviceConsumption: [],
          deviceConsumptionWater: [],
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      )
    );
    await until(() => {
      expect(document.querySelector("img")?.getAttribute("src")).toContain("huis-dag-licht.webp");
    });
    expect(document.body.innerHTML).not.toContain("huis-zonder-");
  });
});

describe("energy tabs", () => {
  let root: Root | null = null;
  let host: HTMLDivElement | null = null;

  beforeEach(() => {
    localStorage.clear();
    useLanguageStore.setState({ language: "nl", ready: true });
    useEnergyOverviewStore.setState({ tab: "overview", ready: false });
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

  it("uses a glass segment, arrow keys and aria-controls", async () => {
    function Harness() {
      const [mounted, setMounted] = useState(false);
      useEffect(() => setMounted(true), []);
      return mounted ? createElement(EnergyTabs) : null;
    }
    await act(async () => {
      root?.render(createElement(Harness));
    });
    await until(() => {
      expect(document.querySelector("[role='tablist']")).toBeTruthy();
    });
    const list = document.querySelector("[role='tablist']");
    expect(list?.className).toContain("bg-[var(--glass-strong)]");
    const overview = document.getElementById("energy-tab-overview");
    const tiles = document.getElementById("energy-tab-tiles");
    expect(overview?.getAttribute("aria-controls")).toBe("energy-panel-overview");
    expect(tiles?.getAttribute("aria-controls")).toBe("energy-panel-tiles");
    expect(overview?.className).toContain("bg-[#4700B5]");
    expect(overview?.className).toContain("h-11");
    expect(overview?.tabIndex).toBe(0);
    expect(tiles?.tabIndex).toBe(-1);
    await act(async () => {
      overview?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    });
    await until(() => {
      expect(document.getElementById("energy-tab-tiles")?.getAttribute("aria-selected")).toBe("true");
      expect(document.activeElement).toBe(document.getElementById("energy-tab-tiles"));
    });
  });
});
