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
      expect(button.className).toMatch(/\bh-11\b/);
      expect(button.className).toContain("focus-visible:ring-2");
    }
    const idle = [...document.querySelectorAll('[role="radio"][aria-checked="false"]')];
    expect(idle.length).toBeGreaterThan(0);
    for (const button of idle) expect(button.querySelector("svg")).toBeNull();
    const choices = [...document.querySelectorAll("[role=radio], [role=switch]")];
    expect(choices.length).toBeGreaterThanOrEqual(5);
    for (const choice of choices) {
      expect(choice.className).toMatch(/\b(?:h-11|min-h-11)\b/);
      expect(choice.className).toContain("outline-none");
      expect(choice.className).toContain("focus-visible:ring-2");
    }
    expect(useEnergyStore.getState().tariffMode).toBe("fixed");
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
