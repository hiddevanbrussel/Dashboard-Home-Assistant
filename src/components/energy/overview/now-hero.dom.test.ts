/**
 * @vitest-environment happy-dom
 */
import { act, createElement, useEffect, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EnergyTabList, EnergyTabs } from "@/components/energy/overview/energy-tabs";
import { ENERGY_TAB_STORAGE_KEY } from "@/lib/energy-tab";
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
    await act(async () => {
      useEntityStateStore.getState().setStates([solarState("0"), sun]);
    });
    await until(() => {
      const value = document.querySelector("[data-now-label='solar'] b")?.textContent ?? "";
      expect(value).toBe("0 W");
      expect(value).not.toContain("0,83");
    });
  });

  it("uses grid power in the import sentence, not the battery", async () => {
    useEnergyStore.getState().setEntity("gridPowerEntityId", "sensor.grid_power");
    useEnergyStore.getState().setEntity("batteryPowerEntityId", "sensor.battery_power");
    useEntityStateStore.getState().setStates([
      sun,
      { entity_id: "sensor.grid_power", state: "300", attributes: { unit_of_measurement: "W", device_class: "power" } },
      { entity_id: "sensor.battery_power", state: "500", attributes: { unit_of_measurement: "W", device_class: "power" } },
      { entity_id: "sensor.battery_soc", state: "40", attributes: { unit_of_measurement: "%" } },
    ]);
    await act(async () => {
      root?.render(createElement(NowHero, { orientation: "landscape" }));
    });
    await until(() => {
      const sentence = document.querySelector("[data-now-sentence]")?.textContent ?? "";
      expect(sentence).toContain("300 W");
      expect(sentence).toContain("van het net");
      expect(sentence).not.toContain("500");
    });
  });

  it("hides a pill that has no measurement and keeps SoC with the battery direction", async () => {
    useEnergyStore.getState().setEntity("solarPowerEntityId", "sensor.solar_power");
    useEnergyStore.getState().setEntity("batteryPowerEntityId", "sensor.battery_power");
    useEnergyStore.getState().setEntity("batterySocEntityId", "sensor.battery_soc");
    useEntityStateStore.getState().setStates([sun]);
    await act(async () => {
      root?.render(createElement(NowHero, { orientation: "landscape" }));
    });
    await until(() => {
      expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-hero")).not.toBe("pending");
    });
    expect(document.querySelector("[data-now-house]")?.textContent).toContain("–");
    expect(document.querySelector("[data-now-label='solar']")).toBeNull();
    expect(document.querySelector("[data-now-label='battery']")).toBeNull();
    expect(document.body.textContent).not.toContain("rust");
    await act(async () => {
      useEntityStateStore.getState().setStates([
        sun,
        { entity_id: "sensor.battery_power", state: "-700", attributes: { unit_of_measurement: "W", device_class: "power" } },
        { entity_id: "sensor.battery_soc", state: "56", attributes: { unit_of_measurement: "%" } },
      ]);
    });
    await until(() => {
      const battery = document.querySelector("[data-now-label='battery']")?.textContent ?? "";
      expect(battery).toContain("56%");
      expect(battery).toContain("laadt");
    });
    await act(async () => {
      useEntityStateStore.getState().setStates([
        sun,
        { entity_id: "sensor.battery_power", state: "500", attributes: { unit_of_measurement: "W", device_class: "power" } },
        { entity_id: "sensor.battery_soc", state: "40", attributes: { unit_of_measurement: "%" } },
      ]);
    });
    await until(() => {
      const battery = document.querySelector("[data-now-label='battery']")?.textContent ?? "";
      expect(battery).toContain("40%");
      expect(battery).toContain("levert");
      expect(battery).not.toContain("laadt");
    });
  });

  it("shows the same 10 W figure in the sentence and on the pill", async () => {
    useEnergyStore.getState().setEntity("gridPowerEntityId", "sensor.grid_power");
    useEntityStateStore.getState().setStates([
      sun,
      solarState("423"),
      { entity_id: "sensor.grid_power", state: "300", attributes: { unit_of_measurement: "W", device_class: "power" } },
    ]);
    await act(async () => {
      root?.render(createElement(NowHero, { orientation: "landscape" }));
    });
    await until(() => {
      const pill = document.querySelector("[data-now-label='solar'] b")?.textContent ?? "";
      const sentence = document.querySelector("[data-now-sentence]")?.textContent ?? "";
      expect(pill).toBe("420 W");
      expect(sentence).toContain("420 W");
      expect(sentence).not.toContain("423");
    });
    const frame = document.querySelector("[data-now-frame]");
    expect(frame?.contains(document.querySelector("[data-now-label='solar']"))).toBe(true);
    expect(document.querySelector("[data-now-hero]")?.innerHTML).not.toContain("top-16");
    expect(document.querySelector("[data-now-hero]")?.innerHTML).not.toContain("bottom-16");
  });

  it("leaves the sentence empty when a linked battery has no measurement", async () => {
    useEnergyStore.getState().setEntity("batteryPowerEntityId", "sensor.battery_power");
    useEntityStateStore.getState().setStates([sun, solarState("1650")]);
    await act(async () => {
      root?.render(createElement(NowHero, { orientation: "landscape" }));
    });
    await until(() => {
      expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-hero")).not.toBe("pending");
    });
    expect(document.querySelector("[data-now-house]")?.textContent).toContain("–");
    expect(document.querySelector("[data-now-label='solar'] b")?.textContent).toBe("1,65 kW");
    const sentence = document.querySelector("[data-now-sentence]")?.textContent ?? "";
    expect(sentence.trim()).toBe("");
    expect(sentence).not.toContain("van de");
  });

  it("moves the battery leader when the pill gets narrower and dashes it when idle", async () => {
    let batteryRect = new DOMRect(460.5, 480, 211.5, 50);
    const original = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function () {
      if (this.getAttribute("data-now-frame") != null) return new DOMRect(0, 80, 560, 400);
      if (this.getAttribute("data-now-label") === "battery") return batteryRect;
      return new DOMRect(0, 0, 0, 0);
    };
    try {
      useEnergyStore.getState().setEntity("batteryPowerEntityId", "sensor.battery_power");
      useEnergyStore.getState().setEntity("batterySocEntityId", "sensor.battery_soc");
      useEntityStateStore.getState().setStates([
        sun,
        solarState("1650"),
        { entity_id: "sensor.battery_power", state: "-700", attributes: { unit_of_measurement: "W", device_class: "power" } },
        { entity_id: "sensor.battery_soc", state: "56", attributes: { unit_of_measurement: "%" } },
      ]);
      await act(async () => {
        root?.render(createElement(NowHero, { orientation: "landscape" }));
      });
      await until(() => {
        const paths = [...document.querySelectorAll("[data-now-leader] path")].map((node) => node.getAttribute("d") ?? "");
        expect(paths.some((path) => path.startsWith("M478.5 "))).toBe(true);
      });
      batteryRect = new DOMRect(469.9, 480, 202.1, 50);
      await act(async () => {
        useEntityStateStore.getState().setStates([
          sun,
          solarState("1650"),
          { entity_id: "sensor.battery_power", state: "-4", attributes: { unit_of_measurement: "W", device_class: "power" } },
          { entity_id: "sensor.battery_soc", state: "56", attributes: { unit_of_measurement: "%" } },
        ]);
      });
      await until(() => {
        const dashed = [...document.querySelectorAll("[data-now-leader] path")].find(
          (node) => node.getAttribute("stroke-dasharray") === "3 4"
        );
        expect(dashed?.getAttribute("d") ?? "").toMatch(/^M487\.9 /);
      });
    } finally {
      HTMLElement.prototype.getBoundingClientRect = original;
    }
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

  it("shows the sun icon from 50 W during the day while the glow gate is still off", async () => {
    useEntityStateStore.getState().setStates([sun, solarState("50")]);
    await act(async () => {
      root?.render(createElement(NowHero, { orientation: "landscape" }));
    });
    await until(() => {
      expect(document.querySelector("[data-now-label='solar']")?.getAttribute("data-now-off")).toBe("0");
    });
    expect(document.querySelector("[data-now-icon]")?.getAttribute("data-now-icon")).toBe("sun");
    expect(document.querySelector("[data-now-label='solar'] b")?.textContent).toBe("50 W");
  });

  it("goes offline without a zero, a mint line or the word rust", async () => {
    useEnergyStore.getState().setEntity("solarPowerEntityId", "sensor.solar_power");
    useEntityStateStore.getState().setStates([sun, solarState("700")]);
    useEntityStateStore.setState({ error: "No connection", updatedAt: Date.parse("2026-10-23T16:42:00.000Z") });
    await act(async () => {
      root?.render(createElement(NowHero, { orientation: "landscape" }));
    });
    await until(() => {
      expect(document.querySelector("[data-now-offline]")?.getAttribute("data-now-offline")).toBe("1");
    });
    const badge = document.querySelector("[data-now-live]")?.parentElement?.textContent ?? "";
    expect(badge).toMatch(/offline · laatst \d{2}:\d{2}/);
    const sentence = document.querySelector("[data-now-sentence]")?.textContent ?? "";
    expect(sentence).toContain("Home Assistant is even niet bereikbaar");
    expect(sentence).toMatch(/\d{2}:\d{2}/);
    expect(document.querySelector("[data-now-house]")?.textContent).not.toContain("0 W");
    expect(document.body.textContent).not.toContain("rust");
    expect(document.querySelector("[data-now-layers] polyline")).toBeNull();
    expect(document.querySelector("[stroke='#10B981']")).toBeNull();
    expect(document.querySelector("[data-battery-glow]")).toBeNull();
  });

  it("keeps the short offline pill lines from the mockup", async () => {
    useEnergyStore.getState().setEntity("solarPowerEntityId", "sensor.solar_power");
    useEnergyStore.getState().setEntity("gridPowerEntityId", "sensor.grid_power");
    useEnergyStore.getState().setEntity("batteryPowerEntityId", "sensor.battery_power");
    useEnergyStore.getState().setEntity("batterySocEntityId", "sensor.battery_soc");
    useEntityStateStore.getState().setStates([
      sun,
      solarState("700"),
      { entity_id: "sensor.grid_power", state: "-300", attributes: { unit_of_measurement: "W", device_class: "power" } },
      { entity_id: "sensor.battery_power", state: "500", attributes: { unit_of_measurement: "W", device_class: "power" } },
      { entity_id: "sensor.battery_soc", state: "40", attributes: { unit_of_measurement: "%" } },
    ]);
    useEntityStateStore.setState({ error: "No connection", updatedAt: Date.parse("2026-10-23T16:42:00.000Z") });
    await act(async () => {
      root?.render(createElement(NowHero, { orientation: "landscape" }));
    });
    await until(() => {
      expect(document.querySelector("[data-now-offline]")?.getAttribute("data-now-offline")).toBe("1");
      expect(document.querySelector("[data-now-label='grid'] small")?.textContent).toBe("net");
    });
    expect(document.querySelector("[data-now-label='battery'] small")?.textContent).toBe("batterij");
    expect(document.querySelector("[data-now-label='solar'] small")?.textContent).toBe("zon op het dak");
    for (const kind of ["solar", "grid", "battery"]) {
      const pill = document.querySelector(`[data-now-label='${kind}']`);
      expect(pill?.querySelectorAll("svg").length).toBeGreaterThanOrEqual(2);
      const sub = pill?.querySelector("small")?.textContent ?? "";
      expect(sub).not.toContain("terug");
      expect(sub).not.toContain("van het net");
      expect(sub).not.toContain("laadt");
      expect(sub).not.toContain("levert");
      expect(sub).not.toContain("rust");
    }
  });

  it("treats a consumption-only sensor as linked and does not ask to connect sensors", async () => {
    useEnergyStore.getState().setEntity("solarPowerEntityId", "");
    useEnergyStore.getState().setEntity("consumptionEntityId", "sensor.house_power");
    useEntityStateStore.getState().setStates([
      sun,
      { entity_id: "sensor.house_power", state: "700", attributes: { unit_of_measurement: "W", device_class: "power" } },
    ]);
    await act(async () => {
      root?.render(createElement(NowHero, { orientation: "landscape" }));
    });
    await until(() => {
      expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-hero")).not.toBe("pending");
    });
    expect(document.querySelector("[data-now-house]")?.textContent).toContain("700");
    const sentence = document.querySelector("[data-now-sentence]")?.textContent ?? "";
    expect(sentence).toContain("Je huis verbruikt nu");
    expect(sentence).toContain("700");
    expect(sentence).not.toContain("Koppel");
    expect(document.querySelector("[data-now-offline]")?.getAttribute("data-now-offline")).toBe("0");
    expect(document.querySelector("[data-now-label='solar']")).toBeNull();
    expect(document.querySelector("[data-now-label='grid']")).toBeNull();
    expect(document.querySelector("[data-now-label='battery']")).toBeNull();
  });
});

describe("stored energy tab while my tiles are hidden", () => {
  afterEach(() => {
    localStorage.clear();
    useEnergyOverviewStore.setState({ tab: "overview", ready: false });
  });

  it("keeps tiles in storage and leaves the in-memory tab on the overview", () => {
    localStorage.setItem(ENERGY_TAB_STORAGE_KEY, "tiles");
    useEnergyOverviewStore.setState({ tab: "tiles", ready: false });
    useEnergyOverviewStore.getState().hydrate();
    expect(useEnergyOverviewStore.getState().tab).toBe("overview");
    expect(useEnergyOverviewStore.getState().ready).toBe(true);
    expect(localStorage.getItem(ENERGY_TAB_STORAGE_KEY)).toBe("tiles");
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

  it("hides the overview and my tiles tabs", async () => {
    await act(async () => {
      root?.render(createElement(EnergyTabs));
    });
    expect(document.querySelector("[role='tablist']")).toBeNull();
    expect(document.querySelector("[data-energy-tabs]")).toBeNull();
    expect(document.getElementById("energy-tab-overview")).toBeNull();
    expect(document.getElementById("energy-tab-tiles")).toBeNull();
  });

  it("keeps arrow keys on the tab list for when my tiles return", async () => {
    function Harness() {
      const [mounted, setMounted] = useState(false);
      useEffect(() => setMounted(true), []);
      return mounted ? createElement(EnergyTabList) : null;
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
