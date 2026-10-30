/**
 * @vitest-environment happy-dom
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { EnergyEntitySettings } from "@/components/settings/energy-entity-settings";
import { useLanguageStore } from "@/stores/language-store";
import { hydrateEnergyStore, useEnergyStore } from "@/stores/energy-store";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("energy live power and tariff settings", () => {
  let root: Root | null = null;
  let host: HTMLDivElement | null = null;

  beforeEach(() => {
    localStorage.clear();
    useLanguageStore.setState({ language: "nl", ready: true });
    hydrateEnergyStore();
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

  function render() {
    act(() => {
      root?.render(
        createElement(EnergyEntitySettings, {
          entities: [
            {
              entity_id: "sensor.grid_power",
              attributes: { friendly_name: "Netvermogen", device_class: "power", unit_of_measurement: "W" },
            },
          ],
        })
      );
    });
  }

  it("defaults to fixed tariff and shows both new groups with 44px choices", () => {
    render();
    expect(document.body.textContent).toContain("Live vermogen net");
    expect(document.body.textContent).toContain("Tarief");
    expect(document.body.textContent).toContain("Vast");
    expect(document.body.textContent).toContain("Standaard. Kosten rekenen met je prijs per kWh.");
    expect(document.body.textContent).not.toContain("Vast is de standaard");
    expect(document.body.textContent).not.toContain("Prijssensor kiezen volgt.");
    const checked = [...document.querySelectorAll('[role="radio"][aria-checked="true"]')];
    expect(checked.map((button) => button.textContent)).toEqual(
      expect.arrayContaining([expect.stringContaining("Eén sensor"), expect.stringContaining("Vast")])
    );
    for (const button of checked) {
      expect(button.querySelector("svg[aria-hidden='true']")).toBeTruthy();
      expect(button.className).toContain("bg-[#4700B5]");
      expect(button.className).toContain("text-white");
      expect(button.className).toContain("border-[#4700B5]");
      expect(button.className).toContain("dark:bg-[#8357be]");
      expect(button.className).toContain("dark:text-white");
      expect(button.className).toContain("dark:border-[#8357be]");
      expect(button.className).toContain("focus-visible:ring-offset-2");
      expect(button.className).toContain("focus-visible:ring-offset-white");
      expect(button.className).toContain("dark:focus-visible:ring-offset-[#1b1a21]");
      expect(button.className).toMatch(/\bh-11\b/);
      expect(button.className).toContain("focus-visible:ring-2");
      expect(button.querySelector("svg")?.getAttribute("class") ?? "").not.toContain("invisible");
    }
    const idle = [...document.querySelectorAll('[role="radio"][aria-checked="false"]')];
    expect(idle.length).toBeGreaterThan(0);
    for (const button of idle) {
      const icon = button.querySelector("svg")?.getAttribute("class") ?? "";
      expect(icon).toContain("invisible");
      expect(icon).toContain("w-4");
    }
    const choices = [...document.querySelectorAll("[role=radio], [role=switch]")];
    expect(choices.length).toBeGreaterThanOrEqual(5);
    for (const choice of choices) {
      expect(choice.className).toMatch(/\b(?:h-11|min-h-11)\b/);
      expect(choice.className).toContain("outline-none");
      expect(choice.className).toContain("focus-visible:ring-2");
    }
    expect(useEnergyStore.getState().tariffMode).toBe("fixed");
  });

  it("keeps choice labels centred without changing width between selected and idle", () => {
    render();
    const radios = [...document.querySelectorAll('[role="radio"]')];
    expect(radios.length).toBeGreaterThanOrEqual(4);
    const layoutOf = (button: Element) =>
      button.className
        .split(/\s+/)
        .filter((token) => token === "relative" || token === "justify-center" || token === "px-8" || token === "inline-flex" || token === "h-11")
        .sort()
        .join(" ");
    const selected = radios.filter((button) => button.getAttribute("aria-checked") === "true");
    const idle = radios.filter((button) => button.getAttribute("aria-checked") === "false");
    expect(selected.length).toBeGreaterThan(0);
    expect(idle.length).toBeGreaterThan(0);
    const layout = layoutOf(selected[0] as Element);
    expect(layout).toContain("px-8");
    expect(layout).toContain("justify-center");
    for (const button of radios) {
      expect(layoutOf(button)).toBe(layout);
      expect(button.className).not.toMatch(/\bgap-/);
      const icon = button.querySelector("svg");
      expect(icon?.getAttribute("class") ?? "").toContain("absolute");
      expect(icon?.getAttribute("class") ?? "").toContain("w-4");
    }
    for (const button of idle) {
      expect(button.querySelector("svg")?.getAttribute("class") ?? "").toContain("invisible");
    }
    for (const button of selected) {
      expect(button.querySelector("svg")?.getAttribute("class") ?? "").not.toContain("invisible");
    }
  });

  it("stores solar yield and solar power when those sensors are chosen", () => {
    act(() => {
      root?.render(
        createElement(EnergyEntitySettings, {
          entities: [
            {
              entity_id: "sensor.solar_yield",
              attributes: { friendly_name: "Zon vandaag", device_class: "energy", unit_of_measurement: "kWh" },
            },
            {
              entity_id: "sensor.solar_yield_wh",
              attributes: { friendly_name: "Zon uur", device_class: "energy", unit_of_measurement: "Wh" },
            },
            {
              entity_id: "sensor.solar_power",
              attributes: { friendly_name: "Zon vermogen", device_class: "power", unit_of_measurement: "W" },
            },
            {
              entity_id: "sensor.solar_kw",
              attributes: { friendly_name: "Zon kilowatt", device_class: "power", unit_of_measurement: "kW" },
            },
            {
              entity_id: "sensor.panel_temp",
              attributes: { friendly_name: "Paneel", device_class: "temperature", unit_of_measurement: "°C" },
            },
          ],
        })
      );
    });
    expect(document.body.textContent).toContain("Zonne-opbrengst vandaag (kWh)");
    expect(document.body.textContent).toContain("Zonnevermogen (W)");
    expect(document.body.textContent).toContain("Kies de sensoren hier.");
    expect(document.body.textContent).not.toContain("zet bewerken aan");
    const yieldSelect = document.getElementById("energy-solar-yield-today");
    const powerSelect = document.getElementById("energy-solar-power");
    if (!(yieldSelect instanceof HTMLSelectElement) || !(powerSelect instanceof HTMLSelectElement)) {
      throw new Error("solar pickers missing");
    }
    const yieldIds = [...yieldSelect.options].map((option) => option.value);
    const powerIds = [...powerSelect.options].map((option) => option.value);
    expect(yieldIds).toEqual(expect.arrayContaining(["", "sensor.solar_yield", "sensor.solar_yield_wh"]));
    expect(yieldIds).not.toContain("sensor.solar_power");
    expect(yieldIds).not.toContain("sensor.solar_kw");
    expect(yieldIds).not.toContain("sensor.panel_temp");
    expect(powerIds).toEqual(expect.arrayContaining(["", "sensor.solar_power", "sensor.solar_kw"]));
    expect(powerIds).not.toContain("sensor.solar_yield");
    expect(powerIds).not.toContain("sensor.solar_yield_wh");
    expect(powerIds).not.toContain("sensor.panel_temp");
    act(() => {
      yieldSelect.value = "sensor.solar_yield";
      yieldSelect.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(useEnergyStore.getState().entities.solarYieldTodayEntityId).toBe("sensor.solar_yield");
    act(() => {
      powerSelect.value = "sensor.solar_power";
      powerSelect.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(useEnergyStore.getState().entities.solarPowerEntityId).toBe("sensor.solar_power");
    act(() => {
      useLanguageStore.setState({ language: "en", ready: true });
    });
    act(() => {
      root?.render(
        createElement(EnergyEntitySettings, {
          entities: [
            {
              entity_id: "sensor.solar_yield",
              attributes: { friendly_name: "Zon vandaag", device_class: "energy", unit_of_measurement: "kWh" },
            },
            {
              entity_id: "sensor.solar_power",
              attributes: { friendly_name: "Zon vermogen", device_class: "power", unit_of_measurement: "W" },
            },
          ],
        })
      );
    });
    expect(document.body.textContent).toContain("Solar yield today (kWh)");
    expect(document.body.textContent).toContain("Solar power (W)");
    expect(document.body.textContent).toContain("Choose the sensors here.");
    expect(useEnergyStore.getState().entities.solarYieldTodayEntityId).toBe("sensor.solar_yield");
    expect(useEnergyStore.getState().entities.solarPowerEntityId).toBe("sensor.solar_power");
  });

  it("shows the later price-sensor note only after dynamic is chosen", () => {
    render();
    const dynamic = [...document.querySelectorAll("button")].find((button) => button.textContent === "Dynamisch");
    if (!(dynamic instanceof HTMLButtonElement)) throw new Error("dynamic missing");
    act(() => {
      dynamic.click();
    });
    expect(document.body.textContent).toContain("Prijssensor kiezen volgt.");
    expect(useEnergyStore.getState().tariffMode).toBe("dynamic");
    expect(localStorage.getItem("dashboard.energy.tariffMode")).toBe("dynamic");
    act(() => {
      useLanguageStore.setState({ language: "en", ready: true });
    });
    render();
    expect(document.body.textContent).toContain("Choosing a price sensor comes later.");
    expect(document.body.textContent).toContain("Live grid power");
    expect(document.body.textContent).not.toContain("Fixed is the default");
    const dynamicEn = [...document.querySelectorAll('[role="radio"][aria-checked="true"]')].find((button) =>
      button.textContent?.includes("Dynamic")
    );
    expect(dynamicEn?.querySelector("svg")).toBeTruthy();
  });
});
