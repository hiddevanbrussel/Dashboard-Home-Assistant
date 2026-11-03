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
import { useThemeStore } from "@/stores/theme-store";

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
      expect(document.querySelector("[data-now-label='solar'] [data-now-value]")?.textContent).toBe("1,65");
      expect(document.querySelector("[data-now-label='solar'] [data-now-unit]")?.textContent).toBe("kW");
    });
    await act(async () => {
      useEntityStateStore.getState().setStates([solarState("0"), sun]);
    });
    await until(() => {
      expect(document.querySelector("[data-now-label='solar']")).toBeNull();
      expect(document.body.textContent).not.toContain("0,83");
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
    expect(document.querySelector("[data-now-house]")).toBeNull();
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
      const battery = document.querySelector("[data-now-label='battery']");
      expect(battery?.textContent).toContain("56");
      expect(battery?.textContent).toContain("%");
      expect(battery?.textContent).not.toContain("laadt");
      expect(battery?.getAttribute("aria-label")).toContain("laadt");
    });
    await act(async () => {
      useEntityStateStore.getState().setStates([
        sun,
        { entity_id: "sensor.battery_power", state: "500", attributes: { unit_of_measurement: "W", device_class: "power" } },
        { entity_id: "sensor.battery_soc", state: "40", attributes: { unit_of_measurement: "%" } },
      ]);
    });
    await until(() => {
      const battery = document.querySelector("[data-now-label='battery']");
      expect(battery?.textContent).toContain("40");
      expect(battery?.textContent).not.toContain("levert");
      expect(battery?.textContent).not.toContain("laadt");
      expect(battery?.getAttribute("aria-label")).toContain("levert");
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
      const pill = document.querySelector("[data-now-label='solar'] [data-now-value]")?.textContent ?? "";
      const sentence = document.querySelector("[data-now-sentence]")?.textContent ?? "";
      expect(pill).toBe("420");
      expect(document.querySelector("[data-now-label='solar'] [data-now-unit]")?.textContent).toBe("W");
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
    expect(document.querySelector("[data-now-house]")).toBeNull();
    expect(document.querySelector("[data-now-label='solar'] [data-now-value]")?.textContent).toBe("1,65");
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
        expect(document.querySelector("[data-now-flow='battery']")?.getAttribute("d")).toBe("M369.6 228.0 L460.5 400.0");
        expect(document.querySelector("[data-now-line='battery']")?.getAttribute("d")).toBe("M460.5 400.0 L369.6 228.0");
        expect(document.querySelector("[data-now-line='battery'] circle")).toBeNull();
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
        expect(document.querySelector("[data-now-flow='battery']")).toBeNull();
        expect(document.querySelector("[data-now-line='battery']")?.getAttribute("d")).toBe("M469.9 400.0 L369.6 228.0");
        expect(document.querySelector("[stroke-dasharray='3 4']")).toBeNull();
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
    expect(document.querySelector("[data-now-label='solar'] [data-now-value]")?.textContent).toBe("50");
    expect(document.querySelector("[data-now-label='solar'] [data-now-unit]")?.textContent).toBe("W");
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
    expect(document.querySelector("[data-now-house]")?.textContent ?? "").not.toContain("0 W");
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
      expect(document.querySelector("[data-now-label='grid'] [data-now-unit]")?.textContent).toBe("W");
    });
    expect(document.querySelector("[data-now-label='battery'] [data-now-unit]")?.textContent).toBe("%");
    expect(document.querySelector("[data-now-label='solar']")?.getAttribute("aria-label")).toContain("zon op het dak");
    for (const kind of ["solar", "grid", "battery"]) {
      const pill = document.querySelector(`[data-now-label='${kind}']`);
      expect(pill?.querySelectorAll("svg").length).toBe(1);
      const visible = pill?.textContent ?? "";
      expect(visible).not.toContain("terug");
      expect(visible).not.toContain("van het net");
      expect(visible).not.toContain("laadt");
      expect(visible).not.toContain("levert");
      expect(visible).not.toContain("rust");
      expect(visible).not.toContain("zon op het dak");
    }
    expect(document.querySelector("[data-now-label='grid']")?.getAttribute("aria-label")).toContain("terug naar het net");
    expect(document.querySelector("[data-now-label='battery']")?.getAttribute("aria-label")).toContain("levert");
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

  it("keeps Huis in the aria label only and hides the sun label at night", async () => {
    useEnergyStore.getState().setEntity("consumptionEntityId", "sensor.house_power");
    useEnergyStore.getState().setEntity("gridPowerEntityId", "sensor.grid_power");
    useEntityStateStore.getState().setStates([
      { entity_id: "sun.sun", state: "below_horizon", attributes: {} },
      solarState("0"),
      { entity_id: "sensor.house_power", state: "700", attributes: { unit_of_measurement: "W", device_class: "power" } },
      { entity_id: "sensor.grid_power", state: "-250", attributes: { unit_of_measurement: "W", device_class: "power" } },
    ]);
    await act(async () => {
      root?.render(
        createElement(NowHero, {
          orientation: "landscape",
          labelOpens: (kind) => kind === "house",
          onOpenLabel: () => undefined,
        })
      );
    });
    await until(() => {
      expect(document.querySelector("[data-now-house]")?.getAttribute("aria-label")).toContain("Huis");
    });
    const house = document.querySelector("[data-now-house]");
    expect(house?.textContent).not.toContain("Huis");
    expect(house?.textContent).toContain("700");
    expect(house?.tagName).toBe("BUTTON");
    expect(house?.getAttribute("type")).toBe("button");
    expect(document.querySelector("[data-now-label='solar']")).toBeNull();
    const grid = document.querySelector("[data-now-label='grid']");
    expect(grid?.textContent).not.toContain("-");
    expect(grid?.textContent).not.toContain("terug");
    expect(grid?.getAttribute("aria-label")).toContain("terug naar het net");
    expect(grid?.tagName).toBe("DIV");
  });

  it("draws no window tint until a light with a known state is linked", async () => {
    useEntityStateStore.getState().setStates([
      sun,
      solarState("1650"),
      { entity_id: "light.woonkamer", state: "off", attributes: {} },
    ]);
    await act(async () => {
      root?.render(createElement(NowHero, { orientation: "landscape" }));
    });
    await until(() => {
      expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-hero")).not.toBe("pending");
    });
    expect(document.querySelector("[data-house-light-tint]")).toBeNull();
    expect(document.querySelector("[data-house-light-status]")).toBeNull();
    expect(document.querySelector("[data-now-sentence]")).toBeTruthy();
  });

  it("tints only the off zone, stays under the lines, and speaks each known light once", async () => {
    useEnergyStore.getState().setLightingEntity("livingRoomEntityId", "light.woonkamer");
    useEnergyStore.getState().setLightingEntity("upstairsEntityId", "light.boven");
    useEntityStateStore.getState().setStates([
      sun,
      solarState("1650"),
      { entity_id: "light.woonkamer", state: "on", attributes: {} },
      { entity_id: "light.boven", state: "off", attributes: { brightness: 255 } },
      { entity_id: "light.buiten", state: "unavailable", attributes: {} },
    ]);
    await act(async () => {
      root?.render(createElement(NowHero, { orientation: "landscape" }));
    });
    await until(() => {
      expect(document.querySelector("[data-house-light-zone='upstairs']")).toBeTruthy();
    });
    const frame = document.querySelector("[data-now-frame]");
    const order = [...(frame?.children ?? [])].map((node) => node.tagName + (node.getAttribute("data-house-light-tint") != null ? ":tint" : "") + (node.getAttribute("data-house-light-status") != null ? ":status" : "") + (node.getAttribute("data-now-layers") != null ? ":layers" : ""));
    const tintAt = order.findIndex((name) => name.includes(":tint"));
    const statusAt = order.findIndex((name) => name.includes(":status"));
    const layersAt = order.findIndex((name) => name.includes(":layers"));
    expect(order[0]).toBe("PICTURE");
    expect(tintAt).toBeGreaterThan(0);
    expect(statusAt).toBeGreaterThan(tintAt);
    expect(layersAt).toBeGreaterThan(statusAt);

    const tint = document.querySelector("[data-house-light-tint]");
    expect(tint?.getAttribute("aria-hidden")).toBe("true");
    expect(tint?.getAttribute("aria-live")).toBeNull();
    expect(tint?.tagName).toBe("svg");
    expect(tint?.getAttribute("class")).toContain("pointer-events-none");
    expect(tint?.querySelector("button")).toBeNull();
    expect(tint?.querySelector("feGaussianBlur")?.getAttribute("stdDeviation")).toBe("0.35");

    const opacityOf = (node: Element | null | undefined) =>
      Number(/opacity:\s*([0-9.]+)/.exec(node?.getAttribute("style") ?? "")?.[1]);
    const upstairs = document.querySelector("[data-house-light-zone='upstairs']");
    expect(upstairs?.getAttribute("data-house-light-factor")).toBe("1");
    const upstairsPolys = [...(upstairs?.querySelectorAll("polygon") ?? [])];
    expect(upstairsPolys).toHaveLength(6);
    expect(upstairsPolys[0]?.getAttribute("fill")).toBe("#1f2a44");
    expect(opacityOf(upstairsPolys[0])).toBeCloseTo(0.62, 5);
    expect(upstairsPolys[0]?.getAttribute("style")).toContain("600ms");
    expect(upstairsPolys[0]?.getAttribute("filter")).toContain("house-light-tint-blur");
    expect(upstairsPolys[1]?.getAttribute("fill")).toBe("#3b4a6b");
    expect(opacityOf(upstairsPolys[1])).toBeCloseTo(0.14, 5);
    expect(upstairsPolys[1]?.getAttribute("filter")).toBeNull();

    const living = document.querySelector("[data-house-light-zone='livingRoom']");
    expect(living?.getAttribute("data-house-light-factor")).toBe("0");
    expect(opacityOf(living?.querySelector("polygon"))).toBe(0);
    expect(document.querySelector("[data-house-light-zone='outdoor']")).toBeNull();

    const status = document.querySelector("[data-house-light-status]");
    expect(status?.getAttribute("aria-live")).toBeNull();
    expect(status?.getAttribute("role")).toBeNull();
    expect(status?.textContent).toBe("Woonkamer, licht aan. Boven, licht uit.");
    expect(document.querySelector("[data-now-label='solar'] [data-now-value]")?.textContent).toBe("1,65");
    expect(document.querySelector("[data-now-sentence]")?.getAttribute("data-house-light-status")).toBeNull();
  });

  it("uses the dark tint and drops a zone that is unavailable", async () => {
    useThemeStore.setState({ mode: "dark", resolved: "dark" });
    useEnergyStore.getState().setLightingEntity("livingRoomEntityId", "light.woonkamer");
    useEnergyStore.getState().setLightingEntity("upstairsEntityId", "light.boven");
    useEntityStateStore.getState().setStates([
      sun,
      solarState("1650"),
      { entity_id: "light.woonkamer", state: "on", attributes: { brightness: 128 } },
      { entity_id: "light.boven", state: "unavailable", attributes: {} },
    ]);
    await act(async () => {
      root?.render(createElement(NowHero, { orientation: "portrait" }));
    });
    await until(() => {
      expect(document.querySelector("[data-house-light-zone='livingRoom']")).toBeTruthy();
    });
    expect(document.querySelector("[data-house-light-zone='upstairs']")).toBeNull();
    const poly = document.querySelector("[data-house-light-zone='livingRoom'] polygon");
    expect(poly?.getAttribute("fill")).toBe("#0b1020");
    const opacity = Number(/opacity:\s*([0-9.]+)/.exec(poly?.getAttribute("style") ?? "")?.[1]);
    expect(opacity).toBeCloseTo(0.78 * (1 - 128 / 255), 5);
    expect(document.querySelector("[data-house-light-status]")?.textContent).toBe("Woonkamer, licht aan.");
    act(() => {
      useThemeStore.setState({ mode: "light", resolved: "light" });
    });
  });

  it("skips the opacity transition when reduced motion is on", async () => {
    const spy = vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }));
    try {
      useEnergyStore.getState().setLightingEntity("upstairsEntityId", "light.boven");
      useEntityStateStore.getState().setStates([
        sun,
        solarState("1650"),
        { entity_id: "light.boven", state: "off", attributes: {} },
      ]);
      await act(async () => {
        root?.render(createElement(NowHero, { orientation: "landscape" }));
      });
      await until(() => {
        expect(document.querySelector("[data-house-light-motion]")?.getAttribute("data-house-light-motion")).toBe(
          "reduce"
        );
      });
      const style = document.querySelector("[data-house-light-zone='upstairs'] polygon")?.getAttribute("style") ?? "";
      expect(style).toContain("transition: none");
      expect(style).not.toContain("600ms");
    } finally {
      spy.mockRestore();
    }
  });

  it("places window targets under the labels, and a label opens its sheet without switching a light", async () => {
    const opened: string[] = [];
    useEnergyStore.getState().setLightingEntity("livingRoomEntityId", "light.woonkamer");
    useEntityStateStore.getState().setStates([
      sun,
      solarState("1650"),
      { entity_id: "light.woonkamer", state: "off", attributes: {} },
    ]);
    await act(async () => {
      root?.render(
        createElement(NowHero, {
          orientation: "landscape",
          labelOpens: () => true,
          onOpenLabel: (kind) => opened.push(kind),
        })
      );
    });
    await until(() => {
      expect(document.querySelector("[data-house-light-hotspots]")).toBeTruthy();
      expect(document.querySelector("[data-now-label='solar']")).toBeTruthy();
    });
    const layer = document.querySelector("[data-house-light-hotspots]");
    const label = document.querySelector("[data-now-label='solar']");
    if (!(layer instanceof HTMLElement) || !(label instanceof HTMLElement)) throw new Error("layer missing");
    expect(layer.className).toContain("z-[4]");
    expect(label.className).toContain("z-[5]");
    expect(label.compareDocumentPosition(layer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(layer?.getAttribute("aria-live")).toBeNull();
    expect(document.querySelector("[data-house-light-status]")?.getAttribute("aria-live")).toBeNull();
    await act(async () => {
      label?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(opened).toEqual(["solar"]);
    const calls = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls.map((call) => String(call[0]));
    expect(calls.some((url) => url.includes("call-service"))).toBe(false);
    expect(useEntityStateStore.getState().states["light.woonkamer"]?.state).toBe("off");
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
