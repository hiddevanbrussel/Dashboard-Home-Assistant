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
    expect(document.body.textContent).toContain("Kies hier je energiesensoren.");
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
    expect(document.body.textContent).toContain("Choose your energy sensors here.");
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

  it("links one light per zone and keeps Buiten disabled", () => {
    act(() => {
      root?.render(
        createElement(EnergyEntitySettings, {
          entities: [
            {
              entity_id: "sensor.solar_power",
              attributes: { friendly_name: "Zon vermogen", device_class: "power", unit_of_measurement: "W" },
            },
            { entity_id: "light.zolder", attributes: { friendly_name: "Zolder" } },
            { entity_id: "light.leeslamp", attributes: { friendly_name: "Leeslamp" } },
            { entity_id: "switch.lamp", attributes: { friendly_name: "Schakelaar" } },
            { entity_id: "light.plafond", attributes: { friendly_name: "Woonkamer plafond" } },
          ],
        })
      );
    });
    expect(document.body.textContent).toContain("Verlichting op het huis");
    expect(document.body.textContent).toContain(
      "Kies per ruimte een lamp. Is de lamp uit, dan wordt die ruimte op het huis donker getoond."
    );
    expect(document.body.textContent).toContain(
      "Geen lamp gekozen: het huis wordt gewoon getoond, zonder verlichtingslaag."
    );
    expect(document.body.textContent).not.toContain("Komt later.");
    const groups = [...document.querySelectorAll("p")].map((node) => node.textContent);
    const sensorsAt = groups.indexOf("Energiesensoren");
    const lightsAt = groups.indexOf("Verlichting op het huis");
    expect(sensorsAt).toBeGreaterThanOrEqual(0);
    expect(lightsAt).toBeGreaterThan(sensorsAt);

    const living = document.getElementById("energy-light-living-room");
    const upstairs = document.getElementById("energy-light-upstairs");
    const outside = document.getElementById("energy-light-outside");
    if (!(living instanceof HTMLSelectElement) || !(upstairs instanceof HTMLSelectElement) || !(outside instanceof HTMLSelectElement)) {
      throw new Error("light pickers missing");
    }
    for (const select of [living, upstairs, outside]) {
      expect(select.className).toContain("h-11");
      expect(select.className).not.toContain("h-12");
      expect(select.className).toContain("border-[#767b85]");
      expect(select.className).toContain("focus-visible:ring-2");
    }
    expect([...living.options].map((option) => option.value)).toEqual([
      "",
      "light.leeslamp",
      "light.plafond",
      "light.zolder",
    ]);
    expect(living.options[0]?.textContent).toBe("Niet ingesteld");
    expect([...living.options].map((option) => option.value)).not.toContain("sensor.solar_power");
    expect([...living.options].map((option) => option.value)).not.toContain("switch.lamp");
    expect(outside.disabled).toBe(true);
    expect(outside.value).toBe("");
    expect([...outside.options].map((option) => option.value)).toEqual([""]);
    expect(outside.labels?.[0]?.textContent).toContain("Buiten");
    expect(outside.labels?.[0]?.textContent).toContain("Later");
    expect(document.getElementById("energy-solar-power")?.className).toContain("h-12");

    act(() => {
      living.value = "light.plafond";
      living.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(useEnergyStore.getState().lighting.livingRoomEntityId).toBe("light.plafond");
    expect(document.querySelector("[data-house-lights-empty]")).toBeNull();
    expect(JSON.parse(localStorage.getItem("dashboard.energy.lighting") ?? "{}")).toMatchObject({
      livingRoomEntityId: "light.plafond",
    });
    expect(useEnergyStore.getState().entities.solarPowerEntityId).toBe("");

    act(() => {
      useLanguageStore.setState({ language: "en", ready: true });
    });
    act(() => {
      root?.render(
        createElement(EnergyEntitySettings, {
          entities: [
            { entity_id: "light.plafond", attributes: { friendly_name: "Woonkamer plafond" } },
          ],
        })
      );
    });
    expect(document.body.textContent).toContain("Lights on the house");
    expect(document.body.textContent).toContain("Living room");
    expect(document.body.textContent).toContain("Outside");
    expect(document.body.textContent).toContain("Later");
    expect(document.body.textContent).not.toContain("Komt later.");
    expect(document.body.textContent).not.toContain("Geen lamp gekozen");
  });

  it("orders the aircon energy sensor and the five rooms, and keeps an old lighting record", () => {
    localStorage.setItem(
      "dashboard.energy.lighting",
      JSON.stringify({ livingRoomEntityId: "light.plafond", upstairsEntityId: "light.zolder" })
    );
    hydrateEnergyStore();
    act(() => {
      root?.render(
        createElement(EnergyEntitySettings, {
          entities: [
            {
              entity_id: "sensor.airco_energy",
              attributes: { friendly_name: "Airco energie", device_class: "energy", unit_of_measurement: "kWh", state_class: "total_increasing" },
            },
            {
              entity_id: "sensor.airco_power",
              attributes: { friendly_name: "Airco vermogen", device_class: "power", unit_of_measurement: "W" },
            },
            { entity_id: "light.keuken", attributes: { friendly_name: "Keukenlamp" } },
            { entity_id: "light.bad", attributes: { friendly_name: "Badkamerlamp" } },
            { entity_id: "light.werk", attributes: { friendly_name: "Bureaulamp" } },
            { entity_id: "light.plafond", attributes: { friendly_name: "Woonkamer plafond" } },
            { entity_id: "light.zolder", attributes: { friendly_name: "Zolder" } },
            { entity_id: "switch.keuken", attributes: { friendly_name: "Schakelaar" } },
          ],
        })
      );
    });
    const solar = document.getElementById("energy-solar-power");
    const aircon = document.getElementById("energy-aircon-energy");
    if (!(solar instanceof HTMLSelectElement) || !(aircon instanceof HTMLSelectElement)) {
      throw new Error("energy pickers missing");
    }
    expect(solar.compareDocumentPosition(aircon) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(aircon.labels?.[0]?.textContent).toBe("Airco (energie)");
    expect([...aircon.options].map((option) => option.value)).toEqual(["", "sensor.airco_energy"]);
    expect([...aircon.options].map((option) => option.value)).not.toContain("sensor.airco_power");
    const roomIds = [
      "energy-light-living-room",
      "energy-light-kitchen",
      "energy-light-bathroom",
      "energy-light-study",
      "energy-light-upstairs",
      "energy-light-outside",
    ];
    const rooms = roomIds.map((id) => document.getElementById(id));
    for (const room of rooms) {
      if (!(room instanceof HTMLSelectElement)) throw new Error("room picker missing");
    }
    for (let index = 1; index < rooms.length; index += 1) {
      const previous = rooms[index - 1] as HTMLSelectElement;
      const current = rooms[index] as HTMLSelectElement;
      expect(previous.compareDocumentPosition(current) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    const outside = rooms[5] as HTMLSelectElement;
    expect(outside.disabled).toBe(true);
    expect(outside.labels?.[0]?.textContent).toContain("Later");
    const kitchen = rooms[1] as HTMLSelectElement;
    expect([...kitchen.options].map((option) => option.value)).toEqual([
      "",
      "light.bad",
      "light.werk",
      "light.keuken",
      "light.plafond",
      "light.zolder",
    ]);
    expect([...kitchen.options].map((option) => option.value)).not.toContain("switch.keuken");
    expect([...kitchen.options].map((option) => option.value)).not.toContain("sensor.airco_energy");
    expect((rooms[0] as HTMLSelectElement).value).toBe("light.plafond");
    expect((rooms[4] as HTMLSelectElement).value).toBe("light.zolder");
    expect(kitchen.value).toBe("");
    expect((rooms[2] as HTMLSelectElement).value).toBe("");
    expect((rooms[3] as HTMLSelectElement).value).toBe("");
    expect(document.querySelector("[data-house-lights-empty]")).toBeNull();
    act(() => {
      aircon.value = "sensor.airco_energy";
      aircon.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(useEnergyStore.getState().entities.airconEnergyEntityId).toBe("sensor.airco_energy");
  });
});
