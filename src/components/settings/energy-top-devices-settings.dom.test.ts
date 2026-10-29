/**
 * @vitest-environment happy-dom
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { act, createElement, useEffect, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  EnergyTopDevicesEntry,
  EnergyTopDevicesSettings,
  type TopDeviceEntity,
} from "@/components/settings/energy-top-devices-settings";
import { UNDO_TOAST_DURATION_MS } from "@/components/undo-toast";
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
  let prefsDevices: Array<{ statConsumption: string; name: string | null }> = [];
  let statTotal = 1.26;
  const fetchedUrls: string[] = [];
  const onEntityIds = vi.fn((ids: string[]) => {
    entityIds = ids;
  });
  const onRefreshEntities = vi.fn();

  beforeEach(() => {
    useLanguageStore.setState({ language: "nl", ready: true });
    entityIds = ["sensor.warmtepomp_0", "sensor.wasmachine_1", "sensor.koelkast_2"];
    prefsDevices = [{ statConsumption: "sensor.warmtepomp_0", name: "Warmtepomp" }];
    statTotal = 1.26;
    fetchedUrls.length = 0;
    onEntityIds.mockClear();
    onRefreshEntities.mockClear();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) => {
        const target = String(url);
        fetchedUrls.push(target);
        if (target.includes("/api/ha/energy/prefs")) {
          return {
            ok: true,
            json: async () => ({
              source: prefsDevices.length > 0 ? "prefs" : "manual",
              deviceConsumption: prefsDevices,
              deviceConsumptionWater: [],
              energySources: [],
            }),
          };
        }
        if (target.includes("/api/ha/energy/statistics")) {
          const devices = new URL(target, "http://localhost").searchParams.get("devices") ?? "";
          const ids = devices.split(",").filter(Boolean);
          return {
            ok: true,
            json: async () => ({
              devices: { items: ids.map((id) => ({ id, total: statTotal, perHour: [] })) },
            }),
          };
        }
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
    const mark = document.querySelector("mark");
    expect(mark?.textContent).toBe("Was");
    expect(mark?.className).toContain("text-inherit");
    expect(input.className).not.toContain("focus-visible:ring");
    expect(input.className).toContain("focus-visible:!outline-none");
    expect(input.parentElement?.className).toContain("has-[input:focus-visible]:ring-2");
    expect(input.parentElement?.className).toContain("has-[input:focus-visible]:ring-brand");
    expect(input.parentElement?.className).toContain("dark:has-[input:focus-visible]:ring-brand-muted");
    expect(input.parentElement?.className).not.toContain("focus-within:");
    expect(document.body.textContent).toContain("Op de kaart");
    expect(document.body.textContent).not.toContain("sensor.wasmachine");

    await act(async () => {
      setter?.call(input, "laadpaal_3");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    const available = document.querySelector("[data-available-list]")?.textContent ?? "";
    expect(available).toContain("Laadpaal");
    expect(available).not.toContain("sensor.");

    await act(async () => {
      setter?.call(input, "zzzz-geen-treffer");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(document.querySelector("[data-available-list]")?.textContent).toContain("Geen apparaat gevonden");

    await act(async () => {
      buttonByLabel("Zoekveld leegmaken").click();
    });
    expect(document.querySelector('input[aria-label="Zoek een apparaat"]')).toBe(document.activeElement);
    expect(document.body.textContent).not.toContain("Geen apparaat gevonden");
  });

  it("hides add buttons and shows the maximum message at 5", () => {
    const five = devices(6);
    render({
      entities: five,
      ids: five.slice(0, 5).map((entity) => entity.entity_id),
    });
    expect(document.body.textContent).toContain("Je hebt er 5 gekozen, het maximum. Haal er eerst een weg om te wisselen.");
    const limit = [...document.querySelectorAll("[role=status]")].find((node) =>
      node.textContent?.includes("Je hebt er 5 gekozen")
    );
    expect(limit?.tagName).toBe("P");
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
      expect(document.body.textContent).toContain("Wasmachine weggehaald");
    });
    expect(document.activeElement?.getAttribute("aria-label")).toContain("Koelkast verplaatsen");
    const undo = [...document.querySelectorAll("button")].find((button) => button.textContent === "Ongedaan maken");
    if (!(undo instanceof HTMLButtonElement)) throw new Error("undo missing");
    await act(async () => {
      undo.click();
    });
    await until(() => {
      expect(selectedText()).toContain("Wasmachine");
    });
    expect(document.activeElement?.getAttribute("aria-label")).toContain("Wasmachine verplaatsen");
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

  it("explains the empty choice when devices can still be chosen", () => {
    render({ entities: devices(3), ids: [] });
    expect(document.body.textContent).toContain("Nog niets gekozen");
    expect(document.body.textContent).toContain("Kies hieronder tot 5 apparaten.");
  });

  it("shows the setup guide when prefs have no individual devices", async () => {
    prefsDevices = [];
    render({ entities: devices(4), ids: [] });
    await until(() => {
      expect(document.body.textContent).toContain("Zo stel je het in");
    });
    expect(document.body.textContent).toContain("energiedashboard");
    expect(document.body.textContent).toContain("Instellingen › Dashboards › Energie");
    expect(document.body.textContent).toContain("Individuele apparaten");
    expect(document.body.textContent).toContain("energiesensor in kWh");
    expect([...document.querySelectorAll("button")].some((button) =>
      (button.getAttribute("aria-label") ?? "").includes("op de kaart zetten")
    )).toBe(false);
    act(() => {
      useLanguageStore.setState({ language: "en", ready: true });
    });
    render({ entities: devices(4), ids: [] });
    expect(document.body.textContent).toContain("How to set this up");
    expect(document.body.textContent).toContain("Individual devices are not in the Home Assistant energy dashboard yet.");
    act(() => {
      useLanguageStore.setState({ language: "nl", ready: true });
    });
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
      vi.fn(async (url: string) => {
        const target = String(url);
        if (target.includes("/api/ha/energy/prefs")) {
          return {
            ok: true,
            json: async () => ({
              source: "prefs",
              deviceConsumption: prefsDevices,
              deviceConsumptionWater: [],
              energySources: [],
            }),
          };
        }
        if (target.includes("/api/ha/energy/statistics")) {
          return { ok: true, json: async () => ({ devices: { items: [] } }) };
        }
        return {
          ok: false,
          json: async () => ({ error: "Invalid topDeviceIds", code: "invalid_id" }),
        };
      })
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

  it("focuses the new grip after adding and the toast when the last device is removed", async () => {
    render({ entities: devices(12) });
    await act(async () => {
      buttonByLabel("Laadpaal op de kaart zetten").click();
    });
    expect(document.activeElement?.getAttribute("aria-label")).toContain("Laadpaal verplaatsen");

    render({ entities: devices(3), ids: ["sensor.warmtepomp_0"] });
    await act(async () => {
      buttonByLabel("Warmtepomp weghalen van de kaart").click();
    });
    await until(() => {
      const undo = [...document.querySelectorAll("button")].find((button) => button.textContent === "Ongedaan maken");
      expect(undo).toBe(document.activeElement);
    });
  });

  it("keeps the count beside truncated names on the entry row", () => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    const long = devices(5).map((entity) => ({
      ...entity,
      attributes: {
        ...entity.attributes,
        friendly_name: `Zeer lange naam ${entity.attributes?.friendly_name ?? ""}`,
      },
    }));
    act(() => {
      root?.render(
        createElement(EnergyTopDevicesEntry, {
          entityIds: long.map((entity) => entity.entity_id),
          entities: long,
          onOpen: () => undefined,
        })
      );
    });
    const names = document.querySelector("[data-entry-names]");
    expect(names?.className).toContain("truncate");
    expect(names?.textContent).toContain("Zeer lange naam Warmtepomp");
    expect(names?.textContent).not.toContain("van 5");
    const line = names?.parentElement;
    expect(line?.className).toContain("flex");
    expect(line?.textContent).toContain("5 van 5");
    expect(line?.textContent).toContain("alle tablets");
    const meta = line?.querySelector("[data-entry-meta]");
    expect(meta?.className).toContain("whitespace-pre");
    expect(meta?.textContent).toBe(" · 5 van 5 · alle tablets");
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
    expect(source).not.toContain("max-h-80");
    expect(source).toContain("focus-visible:!outline-none");
    expect(source).toContain("has-[input:focus-visible]:ring-2");
  });

  it("puts the prefs proposal first and rounds today to one decimal for five rows", async () => {
    prefsDevices = [{ statConsumption: "sensor.airco_11", name: "Airco" }];
    statTotal = 1.26;
    render({ entities: devices(12) });
    await until(() => {
      expect(document.querySelector("[data-proposal-line]")?.textContent).toBe("Voorstel · vandaag 1,3 kWh");
    });
    const list = document.querySelector("[data-available-list]");
    expect(list?.className).toContain("max-h-[calc(100dvh-10rem)]");
    expect(list?.className).not.toContain("max-h-80");
    const text = list?.textContent ?? "";
    expect(text.indexOf("Airco")).toBeGreaterThanOrEqual(0);
    expect(text.indexOf("Airco")).toBeLessThan(text.indexOf("Laadpaal"));
    const proposalLine = document.querySelector("[data-proposal-line]");
    expect(proposalLine?.parentElement?.querySelectorAll("[data-proposal-line], [data-today-kwh]")).toHaveLength(1);
    const statCall = fetchedUrls.find((url) => url.includes("/api/ha/energy/statistics"));
    const ids = new URL(statCall ?? "http://localhost/", "http://localhost").searchParams.get("devices") ?? "";
    expect(ids.split(",").filter(Boolean)).toHaveLength(5);
    expect(document.querySelectorAll("[data-today-kwh], [data-proposal-line]")).toHaveLength(5);
  });

  it("shows the prefs name for a proposal that has no Home Assistant state", async () => {
    prefsDevices = [{ statConsumption: "sensor.zolder_ketel", name: "Zolderketel" }];
    render({ entities: devices(3), ids: [] });
    await until(() => {
      expect(document.querySelector("[data-available-list]")?.textContent).toContain("Zolderketel");
      expect(document.querySelector("[data-proposal-line]")?.textContent).toBe("Voorstel · vandaag 1,3 kWh");
    });
    expect(document.querySelector("[data-available-list]")?.textContent).not.toContain("Niet gevonden");
  });

  it("keeps a proposal line as only Voorstel when there is no kWh yet", async () => {
    prefsDevices = [{ statConsumption: "sensor.zolder_ketel", name: "Zolderketel" }];
    statTotal = Number.NaN;
    render({ entities: devices(3), ids: [] });
    await until(() => {
      expect(document.querySelector("[data-proposal-line]")?.textContent).toBe("Voorstel");
    });
    expect(document.querySelector("[data-today-kwh]")).toBeNull();
  });

  it("moves focus out of the undo toast when it closes", async () => {
    vi.useFakeTimers();
    try {
      render({ entities: devices(3), ids: ["sensor.warmtepomp_0"] });
      await act(async () => {
        buttonByLabel("Warmtepomp weghalen van de kaart").click();
        await vi.advanceTimersByTimeAsync(0);
      });
      const undo = [...document.querySelectorAll("button")].find((button) => button.textContent === "Ongedaan maken");
      expect(undo).toBeInstanceOf(HTMLButtonElement);
      expect(document.activeElement).toBe(undo);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(UNDO_TOAST_DURATION_MS);
      });
      const screen = document.querySelector("[data-top-devices-screen]");
      expect(document.activeElement).not.toBe(document.body);
      expect(screen?.contains(document.activeElement)).toBe(true);
      expect(document.body.textContent).not.toContain("Warmtepomp weggehaald");
    } finally {
      vi.useRealTimers();
    }
  });

  it("shows a retry instead of 0 of 5 when the saved choice failed to load", () => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    act(() => {
      root?.render(
        createElement(EnergyTopDevicesEntry, {
          entityIds: [],
          entities: [],
          onOpen: () => undefined,
          choiceStatus: "error",
          onRetry: onRefreshEntities,
        })
      );
    });
    expect(document.body.textContent).toContain("De opgeslagen keuze kon niet geladen worden.");
    expect(document.body.textContent).not.toContain("0 van 5");
    const retry = [...document.querySelectorAll("button")].find((button) => button.textContent === "Opnieuw proberen");
    if (!(retry instanceof HTMLButtonElement)) throw new Error("retry missing");
    expect(retry.className).toMatch(/\bh-11\b/);
    expect(retry.className).toContain("focus-visible:ring-2");
    act(() => {
      retry.click();
    });
    expect(onRefreshEntities).toHaveBeenCalledTimes(1);
  });

  it("keeps the picker closed for changes until a failed choice load succeeds", async () => {
    let dashboardOk = false;
    const puts: string[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) => {
        const target = String(url);
        if (target.includes("/api/ha/energy/prefs")) {
          return {
            ok: true,
            json: async () => ({
              source: "prefs",
              deviceConsumption: [{ statConsumption: "sensor.warmtepomp_0", name: "Warmtepomp" }],
              deviceConsumptionWater: [],
              energySources: [],
            }),
          };
        }
        if (target.includes("/api/ha/energy/statistics")) {
          return { ok: true, json: async () => ({ devices: { items: [] } }) };
        }
        if (init?.method === "PUT") {
          puts.push(String(init.body));
          return { ok: true, json: async () => ({ topDeviceIds: [] }) };
        }
        if (!dashboardOk) return { ok: false, status: 502, json: async () => ({ error: "down" }) };
        return {
          ok: true,
          json: async () => ({ id: "ed1", topDeviceIds: ["sensor.warmtepomp_0", "sensor.wasmachine_1"] }),
        };
      })
    );

    function Harness() {
      const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
      const [ids, setIds] = useState<string[]>([]);
      const [attempt, setAttempt] = useState(0);
      useEffect(() => {
        let cancelled = false;
        fetch("/api/energy-dashboard", { cache: "no-store" })
          .then(async (response) => {
            if (!response.ok) throw new Error("fail");
            return response.json() as Promise<{ topDeviceIds?: string[] }>;
          })
          .then((body) => {
            if (cancelled) return;
            setIds(Array.isArray(body.topDeviceIds) ? body.topDeviceIds : []);
            setStatus("ready");
          })
          .catch(() => {
            if (!cancelled) setStatus((current) => (current === "ready" ? "ready" : "error"));
          });
        return () => {
          cancelled = true;
        };
      }, [attempt]);
      return createElement(EnergyTopDevicesSettings, {
        dashboardId: "ed1",
        entityIds: ids,
        entities: devices(12),
        entitiesStatus: "ready",
        onEntityIds: setIds,
        onRefreshEntities: () => undefined,
        choiceStatus: status,
        onRetryChoice: () => setAttempt((value) => value + 1),
      });
    }

    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    await act(async () => {
      root?.render(createElement(Harness));
    });
    await until(() => {
      expect(document.body.textContent).toContain("De opgeslagen keuze kon niet geladen worden.");
    });
    expect(document.body.textContent).not.toContain("0 van 5");
    expect(
      [...document.querySelectorAll("button")].some((button) =>
        (button.getAttribute("aria-label") ?? "").includes("op de kaart zetten")
      )
    ).toBe(false);
    expect(puts).toEqual([]);
    const retry = [...document.querySelectorAll("button")].find((button) => button.textContent === "Opnieuw proberen");
    if (!(retry instanceof HTMLButtonElement)) throw new Error("retry missing");
    expect(retry.disabled).toBe(false);
    expect(retry.className).toMatch(/\bh-11\b/);
    dashboardOk = true;
    await act(async () => {
      retry.click();
    });
    await until(() => {
      expect(document.body.textContent).toContain("2 van 5");
      expect(document.body.textContent).toContain("Warmtepomp");
      expect(document.body.textContent).toContain("Wasmachine");
      expect(document.activeElement).not.toBe(document.body);
      expect(document.activeElement?.getAttribute("aria-label")).toBe("Zoek een apparaat");
    });
    expect(document.body.textContent).not.toContain("De opgeslagen keuze kon niet geladen worden.");
    expect(puts).toEqual([]);
  });

  it("shows a device_consumption name on the energy row when Home Assistant has no state", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          source: "prefs",
          deviceConsumption: [{ statConsumption: "sensor.qa_e2b_spook", name: "QA Spookapparaat" }],
          deviceConsumptionWater: [],
          energySources: [],
        }),
      }))
    );
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    await act(async () => {
      root?.render(
        createElement(EnergyTopDevicesEntry, {
          entityIds: ["sensor.qa_e2b_spook"],
          entities: [],
          onOpen: () => undefined,
          choiceStatus: "ready",
        })
      );
    });
    await until(() => {
      expect(document.querySelector("[data-entry-names]")?.textContent).toContain("QA Spookapparaat");
    });
    expect(document.body.textContent).not.toContain("Niet gevonden");
  });

  it("focuses the setup heading after retry when search and the chosen heading are absent", async () => {
    prefsDevices = [];
    let dashboardOk = false;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        const target = String(url);
        if (target.includes("/api/ha/energy/prefs")) {
          return {
            ok: true,
            json: async () => ({
              source: "manual",
              deviceConsumption: [],
              deviceConsumptionWater: [],
              energySources: [],
            }),
          };
        }
        if (target.includes("/api/ha/energy/statistics")) {
          return { ok: true, json: async () => ({ devices: { items: [] } }) };
        }
        if (!dashboardOk) return { ok: false, status: 502, json: async () => ({ error: "down" }) };
        return { ok: true, json: async () => ({ id: "ed1", topDeviceIds: [] }) };
      })
    );

    function Harness() {
      const [status, setStatus] = useState<"loading" | "ready" | "error">("error");
      const [attempt, setAttempt] = useState(0);
      useEffect(() => {
        let cancelled = false;
        fetch("/api/energy-dashboard", { cache: "no-store" })
          .then(async (response) => {
            if (!response.ok) throw new Error("fail");
            return response.json() as Promise<unknown>;
          })
          .then(() => {
            if (!cancelled) setStatus("ready");
          })
          .catch(() => {
            if (!cancelled) setStatus("error");
          });
        return () => {
          cancelled = true;
        };
      }, [attempt]);
      return createElement(EnergyTopDevicesSettings, {
        dashboardId: "ed1",
        entityIds: [],
        entities: devices(4),
        entitiesStatus: "ready",
        onEntityIds: () => undefined,
        onRefreshEntities: () => undefined,
        choiceStatus: status,
        onRetryChoice: () => setAttempt((value) => value + 1),
      });
    }

    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    await act(async () => {
      root?.render(createElement(Harness));
    });
    const retry = [...document.querySelectorAll("button")].find((button) => button.textContent === "Opnieuw proberen");
    if (!(retry instanceof HTMLButtonElement)) throw new Error("retry missing");
    dashboardOk = true;
    await act(async () => {
      retry.click();
    });
    await until(() => {
      expect(document.body.textContent).toContain("Zo stel je het in");
      expect(document.activeElement).toBe(document.querySelector("[data-setup-heading]"));
      expect(document.activeElement).not.toBe(document.body);
    });
  });

  it("labels a nameless device that exists only in device consumption as not found", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          source: "prefs",
          deviceConsumption: [{ statConsumption: "sensor.qa_e2b_naamloos", name: null }],
          deviceConsumptionWater: [],
          energySources: [],
        }),
      }))
    );
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    await act(async () => {
      root?.render(
        createElement(EnergyTopDevicesEntry, {
          entityIds: ["sensor.qa_e2b_naamloos"],
          entities: [],
          onOpen: () => undefined,
          choiceStatus: "ready",
        })
      );
    });
    await until(() => {
      expect(document.querySelector("[data-entry-names]")?.textContent).toContain("Niet gevonden");
    });
    expect(document.body.textContent).not.toContain("Energiesensor");
    expect(document.body.textContent).not.toContain("sensor.qa_e2b_naamloos");
  });

  it("returns focus to the entry row after retry and keeps the sub-line height", async () => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    function Harness() {
      const [status, setStatus] = useState<"loading" | "ready" | "error">("error");
      return createElement(EnergyTopDevicesEntry, {
        entityIds: [],
        entities: [],
        onOpen: () => undefined,
        choiceStatus: status,
        onRetry: () => setStatus("ready"),
      });
    }
    await act(async () => {
      root?.render(createElement(Harness));
    });
    const subline = document.querySelector("[data-entry-subline]");
    expect(subline?.className).toContain("h-5");
    expect(subline?.textContent?.trim()).toBe("");
    const retry = [...document.querySelectorAll("button")].find((button) => button.textContent === "Opnieuw proberen");
    if (!(retry instanceof HTMLButtonElement)) throw new Error("retry missing");
    await act(async () => {
      retry.click();
    });
    await until(() => {
      const opener = document.querySelector("[data-entry-subline]")?.closest("button");
      expect(opener).toBeInstanceOf(HTMLButtonElement);
      expect(document.activeElement).toBe(opener);
      expect(document.activeElement).not.toBe(document.body);
    });
    expect(document.querySelector("[data-entry-subline]")?.className).toContain("h-5");
  });
});
