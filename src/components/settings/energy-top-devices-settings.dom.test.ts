/**
 * @vitest-environment happy-dom
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EnergyTopDevicesSettings, type TopDeviceEntity } from "@/components/settings/energy-top-devices-settings";
import { useLanguageStore } from "@/stores/language-store";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const NAMES = [
  "Warmtepomp",
  "Wasmachine",
  "Koelkast",
  "Laadpaal",
  "Boiler",
  "Wasdroger",
  "Vaatwasser",
  "Oven",
  "Netwerkkast",
  "Tv",
  "Lamp",
  "Airco",
];

function sensor(name: string, index = NAMES.indexOf(name)): TopDeviceEntity {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  return {
    entity_id: `sensor.${slug || "device"}_${index}`,
    attributes: {
      friendly_name: name,
      device_class: "energy",
      state_class: "total_increasing",
    },
  };
}

function devices(count: number): TopDeviceEntity[] {
  return NAMES.slice(0, count).map((name, index) => sensor(name, index));
}

describe("largest consumer picker", () => {
  let root: Root | null = null;
  let host: HTMLDivElement | null = null;
  let entityIds: string[] = [];
  const onEntityIds = vi.fn((ids: string[]) => {
    entityIds = ids;
  });
  const onRefreshEntities = vi.fn();

  beforeEach(() => {
    useLanguageStore.setState({ language: "nl", ready: true });
    entityIds = ["sensor.warmtepomp_0", "sensor.wasmachine_1", "sensor.koelkast_2"];
    onEntityIds.mockClear();
    onRefreshEntities.mockClear();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init?: RequestInit) => {
        const body = JSON.parse(String(init?.body)) as { topDeviceIds: string[] };
        return {
          ok: true,
          json: async () => ({ topDeviceIds: body.topDeviceIds }),
        };
      })
    );
  });

  afterEach(() => {
    if (root) act(() => root?.unmount());
    host?.remove();
    root = null;
    host = null;
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
  });

  function render(props: { entities: TopDeviceEntity[]; ids?: string[]; status?: "loading" | "error" | "ready" }) {
    const next = {
      entities: props.entities,
      ids: props.ids ?? entityIds,
      status: props.status ?? "ready",
    };
    if (!host) {
      host = document.createElement("div");
      document.body.appendChild(host);
      root = createRoot(host);
    }
    act(() => {
      root?.render(
        createElement(EnergyTopDevicesSettings, {
          dashboardId: "ed1",
          entityIds: next.ids,
          entities: next.entities,
          entitiesStatus: next.status,
          onEntityIds,
          onRefreshEntities,
        })
      );
    });
  }

  function selectedText(): string {
    return document.querySelector("[data-selected-list]")?.textContent ?? "";
  }

  function buttonByLabel(label: string): HTMLButtonElement {
    const found = [...document.querySelectorAll("button")].find(
      (button) => button.getAttribute("aria-label") === label
    );
    if (!(found instanceof HTMLButtonElement)) throw new Error(`missing button ${label}`);
    return found;
  }

  function until(check: () => void) {
    return vi.waitFor(check);
  }

  it("shows search above 8 candidates, hides it at 8, and keeps 44px targets", async () => {
    render({ entities: devices(12) });
    const search = document.querySelector('input[aria-label="Zoek een apparaat"]');
    expect(search).toBeTruthy();
    expect(document.body.textContent).toContain("3 van 5");
    expect(document.body.textContent).toContain("Geldt voor alle tablets");
    expect(document.body.textContent).not.toContain("sensor.");

    const screen = document.querySelector("[data-top-devices-screen]");
    const buttons = [...(screen?.querySelectorAll("button") ?? [])];
    expect(buttons.length).toBeGreaterThan(0);
    for (const button of buttons) {
      expect(button.className, button.getAttribute("aria-label") ?? button.textContent ?? "").toMatch(/\bh-11\b/);
    }
    expect(search).toBeInstanceOf(HTMLInputElement);
    expect((search as HTMLInputElement).className).toMatch(/\bh-11\b/);

    render({ entities: devices(8) });
    expect(document.querySelector('input[aria-label="Zoek een apparaat"]')).toBeNull();

    render({ entities: devices(9) });
    expect(document.querySelector('input[aria-label="Zoek een apparaat"]')).toBeTruthy();
  });

  it("searches by name and entity id without showing the id", async () => {
    render({ entities: devices(12) });
    const input = document.querySelector('input[aria-label="Zoek een apparaat"]');
    if (!(input instanceof HTMLInputElement)) throw new Error("search missing");
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    await act(async () => {
      setter?.call(input, "was");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(document.body.textContent).toContain("3 van 12");
    expect(document.querySelector("mark")?.textContent).toBe("Was");
    expect(document.body.textContent).toContain("Op de kaart");
    expect(document.body.textContent).not.toContain("sensor.wasmachine");

    await act(async () => {
      setter?.call(input, "laadpaal_3");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    const available = document.querySelector("[data-available-list]")?.textContent ?? "";
    expect(available).toContain("Laadpaal");
    expect(available).not.toContain("sensor.");
  });

  it("hides add buttons and shows the maximum message at 5", () => {
    const five = devices(6);
    render({
      entities: five,
      ids: five.slice(0, 5).map((entity) => entity.entity_id),
    });
    expect(document.body.textContent).toContain("Je hebt er 5 gekozen, het maximum. Haal er eerst een weg om te wisselen.");
    expect(document.body.textContent).toContain("5 van 5");
    expect([...document.querySelectorAll("button")].some((button) =>
      (button.getAttribute("aria-label") ?? "").includes("op de kaart zetten")
    )).toBe(false);
  });

  it("removes a device and undoes it back to the same place", async () => {
    render({ entities: devices(12) });
    await act(async () => {
      buttonByLabel("Wasmachine weghalen van de kaart").click();
    });
    expect(selectedText()).not.toContain("Wasmachine");
    await until(() => {
      expect(document.querySelector("[role=status]")?.textContent).toContain("Wasmachine weggehaald");
    });
    const undo = [...document.querySelectorAll("button")].find((button) => button.textContent === "Ongedaan maken");
    if (!(undo instanceof HTMLButtonElement)) throw new Error("undo missing");
    await act(async () => {
      undo.click();
    });
    await until(() => {
      expect(selectedText()).toContain("Wasmachine");
    });
    expect(selectedText().indexOf("Warmtepomp")).toBeLessThan(selectedText().indexOf("Wasmachine"));
    expect(selectedText().indexOf("Wasmachine")).toBeLessThan(selectedText().indexOf("Koelkast"));
  });

  it("announces keyboard moves and reorders with the arrow keys", async () => {
    render({ entities: devices(12) });
    const grip = buttonByLabel("Wasmachine verplaatsen, plek 2 van 3");
    await act(async () => {
      grip.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    });
    expect(document.querySelector("[aria-live=polite]")?.textContent).toBe("Wasmachine opgepakt. Plek 2 van 3.");
    const grabbed = buttonByLabel("Wasmachine verplaatsen, plek 2 van 3");
    await act(async () => {
      grabbed.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    });
    await until(() => {
      expect(document.querySelector("[aria-live=polite]")?.textContent).toBe("Wasmachine opgepakt. Plek 3 van 3.");
    });
    expect(selectedText().indexOf("Koelkast")).toBeLessThan(selectedText().indexOf("Wasmachine"));
  });

  it("uses up and down in order mode and hides the available list", async () => {
    render({ entities: devices(12) });
    const order = [...document.querySelectorAll("button")].find((button) => button.textContent === "Volgorde");
    if (!(order instanceof HTMLButtonElement)) throw new Error("order missing");
    await act(async () => {
      order.click();
    });
    expect(document.body.textContent).not.toContain("Beschikbaar in Home Assistant");
    expect(buttonByLabel("Warmtepomp omhoog").disabled).toBe(true);
    await act(async () => {
      buttonByLabel("Warmtepomp omlaag").click();
    });
    await until(() => {
      expect(selectedText().indexOf("Wasmachine")).toBeLessThan(selectedText().indexOf("Warmtepomp"));
    });
  });

  it("explains the empty choice and the case with no Home Assistant devices", () => {
    render({ entities: devices(3), ids: [] });
    expect(document.body.textContent).toContain("Nog niets gekozen");
    expect(document.body.textContent).toContain("Kies hieronder tot 5 apparaten.");

    render({ entities: [], ids: [] });
    expect(document.body.textContent).toContain("Nog geen apparaten in Home Assistant");
    expect(document.body.textContent).toContain("Instellingen › Dashboards › Energie");
    expect(document.body.textContent).toContain("Individuele apparaten");
    expect(document.body.textContent).toContain("energiesensor in kWh");
    const again = [...document.querySelectorAll("button")].find((button) => button.textContent?.includes("Opnieuw kijken"));
    if (!(again instanceof HTMLButtonElement)) throw new Error("refresh missing");
    expect(again.className).toMatch(/\bh-11\b/);
    act(() => {
      again.click();
    });
    expect(onRefreshEntities).toHaveBeenCalledTimes(1);
  });

  it("keeps a missing id as not found, without showing the id", () => {
    render({ entities: devices(3), ids: ["sensor.gone_meter", ...entityIds] });
    expect(selectedText()).toContain("Niet gevonden");
    expect(document.body.textContent).not.toContain("sensor.gone_meter");
    expect(buttonByLabel("Niet gevonden weghalen van de kaart")).toBeTruthy();
  });

  it("restores the previous choice when saving fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        json: async () => ({ error: "Invalid topDeviceIds", code: "invalid_id" }),
      }))
    );
    render({ entities: devices(12) });
    await act(async () => {
      buttonByLabel("Laadpaal op de kaart zetten").click();
    });
    await until(() => {
      expect(document.querySelector("[role=alert]")?.textContent).toContain("Opslaan mislukt");
    });
    expect(selectedText()).not.toContain("Laadpaal");
    expect(selectedText()).toContain("Warmtepomp");
  });

  it("switches the visible copy to English", () => {
    render({ entities: devices(12) });
    act(() => {
      useLanguageStore.setState({ language: "en", ready: true });
    });
    render({ entities: devices(12) });
    expect(document.body.textContent).toContain("On the card");
    expect(document.body.textContent).toContain("Applies to all tablets");
    expect(document.body.textContent).not.toContain("Op de kaart");
    expect(document.body.textContent).not.toContain("Geldt voor alle tablets");
  });

  it("keeps Dutch and English sentences in the dictionaries, not in the component", () => {
    const source = readFileSync(
      path.join(process.cwd(), "src/components/settings/energy-top-devices-settings.tsx"),
      "utf8"
    );
    expect(source).not.toContain("Nog niets gekozen");
    expect(source).not.toContain("Op de kaart");
    expect(source).not.toContain("localStorage");
    expect(source).toContain("settings.energy.topDevices.");
  });
});
