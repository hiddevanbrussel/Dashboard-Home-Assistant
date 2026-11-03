/**
 * @vitest-environment happy-dom
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NowHero } from "@/components/energy/overview/now-hero";
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
    attributes: { device_class: "power", unit_of_measurement: "W" },
  };
}

function light(id: string, state: string, attributes: Record<string, unknown> = {}): EntityState {
  return { entity_id: id, state, attributes };
}

function linkRooms() {
  useEnergyStore.getState().setLightingEntity("livingRoomEntityId", "light.woonkamer");
  useEnergyStore.getState().setLightingEntity("kitchenEntityId", "light.keuken");
  useEnergyStore.getState().setLightingEntity("bathroomEntityId", "light.badkamer");
  useEnergyStore.getState().setLightingEntity("studyEntityId", "light.werkkamer");
  useEnergyStore.getState().setLightingEntity("upstairsEntityId", "light.boven");
}

function serviceCalls(): { url: string; body: Record<string, unknown> }[] {
  const calls: { url: string; body: Record<string, unknown> }[] = [];
  for (const call of (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls) {
    const url = String(call[0]);
    const init = call[1] as RequestInit | undefined;
    if (!url.includes("call-service") || typeof init?.body !== "string") continue;
    calls.push({ url, body: JSON.parse(init.body) as Record<string, unknown> });
  }
  return calls;
}

function primary(zone: string): HTMLButtonElement {
  const node = document.querySelector(`[data-house-light-hit='${zone}'][data-house-light-primary='1']`);
  if (!(node instanceof HTMLButtonElement)) throw new Error(`missing ${zone}`);
  return node;
}

function pointer(target: HTMLElement, type: string, x: number, y: number) {
  target.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      pointerId: 1,
      button: 0,
      pointerType: "mouse",
    })
  );
}

describe("house light hotspots", () => {
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
      vi.fn(async (url: string) => {
        if (String(url).includes("call-service")) return { ok: true, status: 200, json: async () => ({}) };
        return { ok: false, status: 500, json: async () => ({ error: "down" }) };
      })
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

  async function show(orientation: "landscape" | "portrait" = "landscape") {
    await act(async () => {
      root?.render(createElement(NowHero, { orientation }));
    });
    await vi.waitFor(() => {
      expect(document.querySelector("[data-now-hero]")?.getAttribute("data-now-hero")).not.toBe("pending");
    });
  }

  it("draws two zones on the front and four on the back", async () => {
    linkRooms();
    useEntityStateStore.getState().setStates([
      sun,
      solarState("1650"),
      light("light.woonkamer", "off"),
      light("light.keuken", "off"),
      light("light.badkamer", "on"),
      light("light.werkkamer", "off"),
      light("light.boven", "off"),
    ]);
    await show();
    expect(document.querySelectorAll("[data-house-light-primary='1']")).toHaveLength(2);
    expect(document.querySelector("[data-house-light-hit='kitchen']")).toBeNull();
    vi.useFakeTimers();
    await act(async () => {
      document.querySelector<HTMLButtonElement>("[data-now-turn]")?.click();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(550);
    });
    expect(document.querySelectorAll("[data-house-light-primary='1']")).toHaveLength(4);
    expect(document.querySelector("[data-house-light-hit='livingRoom']")).toBeNull();
  });

  it("turns a light on without service data, and turns an on light off", async () => {
    linkRooms();
    useEntityStateStore.getState().setStates([
      sun,
      solarState("1650"),
      light("light.woonkamer", "off", { brightness: 180 }),
      light("light.boven", "on", { brightness: 200 }),
    ]);
    await show();
    await act(async () => {
      pointer(primary("livingRoom"), "pointerdown", 20, 20);
      pointer(primary("livingRoom"), "pointerup", 20, 20);
    });
    expect(useEntityStateStore.getState().states["light.woonkamer"]?.state).toBe("on");
    const onCall = serviceCalls().at(-1);
    expect(onCall?.body).toEqual({ entity_id: "light.woonkamer", domain: "light", service: "turn_on" });
    expect(onCall?.body).not.toHaveProperty("service_data");
    await act(async () => {
      pointer(primary("upstairs"), "pointerdown", 30, 30);
      pointer(primary("upstairs"), "pointerup", 30, 30);
    });
    expect(serviceCalls().at(-1)?.body).toEqual({
      entity_id: "light.boven",
      domain: "light",
      service: "turn_off",
    });
    expect(document.querySelector("[data-house-light-notice]")).toBeNull();
  });

  it("shows a loading ring after 600ms and reverts with the exact failure text", async () => {
    linkRooms();
    useEntityStateStore.getState().setStates([
      sun,
      solarState("1650"),
      light("light.woonkamer", "off"),
      light("light.boven", "off"),
    ]);
    let release: ((value: { ok: boolean; status: number; json: () => Promise<unknown> }) => void) | null = null;
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (String(url).includes("call-service")) {
          return new Promise((resolve) => {
            release = resolve;
          });
        }
        return Promise.resolve({ ok: false, status: 500, json: async () => ({}) });
      })
    );
    await show();
    vi.useFakeTimers();
    await act(async () => {
      pointer(primary("livingRoom"), "pointerdown", 12, 18);
      pointer(primary("livingRoom"), "pointerup", 12, 18);
    });
    expect(useEntityStateStore.getState().states["light.woonkamer"]?.state).toBe("on");
    expect(document.querySelector("[data-house-light-loading]")).toBeNull();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(600);
    });
    expect(document.querySelector("[data-house-light-loading]")).toBeTruthy();
    await act(async () => {
      release?.({ ok: false, status: 500, json: async () => ({}) });
    });
    expect(useEntityStateStore.getState().states["light.woonkamer"]?.state).toBe("off");
    expect(document.querySelector("[data-house-light-loading]")).toBeNull();
    expect(document.querySelector("[data-house-light-notice]")?.textContent).toBe(
      "Woonkamer: licht schakelen mislukt"
    );
    expect(document.querySelector("[data-house-light-notice] button")).toBeNull();
  });

  it("does not call Home Assistant for an unavailable light", async () => {
    linkRooms();
    useEntityStateStore.getState().setStates([
      sun,
      solarState("1650"),
      light("light.woonkamer", "unavailable"),
      light("light.boven", "off"),
    ]);
    await show();
    const before = serviceCalls().length;
    await act(async () => {
      pointer(primary("livingRoom"), "pointerdown", 8, 8);
      pointer(primary("livingRoom"), "pointerup", 8, 8);
    });
    expect(serviceCalls().length).toBe(before);
    expect(primary("livingRoom").getAttribute("aria-disabled")).toBe("true");
    expect(document.querySelector("[data-house-light-notice]")?.textContent).toBe(
      "Woonkamer: lamp niet bereikbaar"
    );
    expect(document.querySelector("[data-house-light-sheet]")).toBeNull();
  });

  it("opens the sheet on a 500ms press and does not toggle, cancels a 12px move, and toggles a 300ms release", async () => {
    linkRooms();
    useEntityStateStore.getState().setStates([
      sun,
      solarState("1650"),
      light("light.woonkamer", "off", { supported_color_modes: ["brightness"], brightness: 200 }),
      light("light.boven", "off"),
    ]);
    await show();
    vi.useFakeTimers();
    await act(async () => {
      pointer(primary("livingRoom"), "pointerdown", 10, 10);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(document.querySelector("[data-house-light-sheet]")).toBeTruthy();
    expect(serviceCalls()).toHaveLength(0);
    await act(async () => {
      pointer(primary("livingRoom"), "pointerup", 10, 10);
      primary("livingRoom").click();
    });
    expect(useEntityStateStore.getState().states["light.woonkamer"]?.state).toBe("off");
    expect(serviceCalls()).toHaveLength(0);

    await act(async () => {
      document.querySelector<HTMLButtonElement>("[aria-label='Sluiten']")?.click();
    });
    expect(document.querySelector("[data-house-light-sheet]")).toBeNull();

    await act(async () => {
      pointer(primary("upstairs"), "pointerdown", 0, 0);
      pointer(primary("upstairs"), "pointermove", 12, 0);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(document.querySelector("[data-house-light-sheet]")).toBeNull();
    await act(async () => {
      pointer(primary("upstairs"), "pointerup", 12, 0);
    });
    expect(serviceCalls()).toHaveLength(0);
    expect(useEntityStateStore.getState().states["light.boven"]?.state).toBe("off");

    await act(async () => {
      pointer(primary("upstairs"), "pointerdown", 4, 4);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    expect(document.querySelector("[data-house-light-sheet]")).toBeNull();
    await act(async () => {
      pointer(primary("upstairs"), "pointerup", 4, 4);
    });
    expect(serviceCalls().at(-1)?.body).toMatchObject({ entity_id: "light.boven", service: "turn_on" });
    expect(serviceCalls().at(-1)?.body).not.toHaveProperty("service_data");
  });

  it("opens the sheet from Shift+F10 and the context menu", async () => {
    linkRooms();
    useEntityStateStore.getState().setStates([
      sun,
      solarState("1650"),
      light("light.woonkamer", "off", { supported_color_modes: ["brightness"] }),
      light("light.boven", "off"),
    ]);
    await show();
    primary("livingRoom").focus();
    await act(async () => {
      primary("livingRoom").dispatchEvent(
        new KeyboardEvent("keydown", { key: "F10", shiftKey: true, bubbles: true, cancelable: true })
      );
    });
    expect(document.querySelector("[data-house-light-sheet]")).toBeTruthy();
    expect(serviceCalls()).toHaveLength(0);
    await act(async () => {
      document.querySelector<HTMLButtonElement>("[aria-label='Sluiten']")?.click();
    });
    await act(async () => {
      primary("upstairs").dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 6, clientY: 6 }));
    });
    expect(document.querySelector("[data-house-light-sheet]")).toBeTruthy();
    expect(serviceCalls()).toHaveLength(0);
  });

  it("ignores a press while the house is turning", async () => {
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
    linkRooms();
    useEntityStateStore.getState().setStates([
      sun,
      solarState("1650"),
      light("light.woonkamer", "off"),
      light("light.boven", "off"),
    ]);
    await show();
    vi.useFakeTimers();
    await act(async () => {
      document.querySelector<HTMLButtonElement>("[data-now-turn]")?.click();
    });
    expect(document.querySelector("[data-now-turn]")?.getAttribute("aria-disabled")).toBe("true");
    await act(async () => {
      pointer(primary("livingRoom"), "pointerdown", 10, 10);
      primary("livingRoom").dispatchEvent(
        new KeyboardEvent("keydown", { key: "F10", shiftKey: true, bubbles: true, cancelable: true })
      );
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(document.querySelector("[data-house-light-sheet]")).toBeNull();
    expect(serviceCalls()).toHaveLength(0);
    expect(useEntityStateStore.getState().states["light.woonkamer"]?.state).toBe("off");
  });

  it("exposes a switch without aria-live", async () => {
    linkRooms();
    useEntityStateStore.getState().setStates([
      sun,
      solarState("1650"),
      light("light.woonkamer", "on", { supported_color_modes: ["brightness"], brightness: 255 }),
      light("light.boven", "off", { supported_color_modes: ["onoff"] }),
    ]);
    await show();
    const living = primary("livingRoom");
    expect(living.getAttribute("role")).toBe("switch");
    expect(living.getAttribute("aria-checked")).toBe("true");
    expect(living.getAttribute("aria-label")).toBe("Woonkamer licht");
    const hintId = living.getAttribute("aria-describedby");
    expect(hintId).toBeTruthy();
    expect(document.getElementById(hintId ?? "")?.textContent).toBe(
      "Lang indrukken of Shift+F10 voor helderheid"
    );
    expect(living.getAttribute("aria-live")).toBeNull();
    expect(document.querySelector("[data-house-light-hotspots]")?.getAttribute("aria-live")).toBeNull();
    expect(document.querySelector("[data-house-light-status]")?.getAttribute("aria-live")).toBeNull();
    expect(document.querySelector("[data-house-light-status]")?.getAttribute("role")).toBeNull();
    const upstairs = primary("upstairs");
    expect(document.getElementById(upstairs.getAttribute("aria-describedby") ?? "")?.textContent).toBe(
      "Lang indrukken of Shift+F10 voor details"
    );
    expect(document.querySelectorAll("[role='switch']").length).toBe(2);
  });

  it("does not mention brightness in the hidden hint of an unavailable light", async () => {
    linkRooms();
    useEntityStateStore.getState().setStates([
      sun,
      solarState("1650"),
      light("light.woonkamer", "unavailable", { supported_color_modes: ["brightness"], brightness: 180 }),
      light("light.boven", "off"),
    ]);
    await show();
    const hint = document.getElementById(primary("livingRoom").getAttribute("aria-describedby") ?? "");
    expect(hint?.textContent).toBe("Lang indrukken of Shift+F10 voor details");
    expect(hint?.textContent?.toLowerCase()).not.toContain("helderheid");
    await act(async () => {
      useLanguageStore.setState({ language: "en", ready: true });
    });
    const hintEn = document.getElementById(primary("livingRoom").getAttribute("aria-describedby") ?? "");
    expect(hintEn?.textContent).toBe("Long press or Shift+F10 for details");
    expect(hintEn?.textContent?.toLowerCase()).not.toContain("brightness");
  });

  it("ignores a second tap on the same window within 400ms and while the call is running", async () => {
    linkRooms();
    useEntityStateStore.getState().setStates([
      sun,
      solarState("1650"),
      light("light.woonkamer", "off", { brightness: 180 }),
      light("light.boven", "off"),
    ]);
    await show();
    vi.useFakeTimers();
    await act(async () => {
      pointer(primary("livingRoom"), "pointerdown", 20, 20);
      pointer(primary("livingRoom"), "pointerup", 20, 20);
    });
    expect(serviceCalls()).toHaveLength(1);
    expect(serviceCalls()[0]?.body).toMatchObject({ entity_id: "light.woonkamer", service: "turn_on" });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(96);
      pointer(primary("livingRoom"), "pointerdown", 20, 20);
      pointer(primary("livingRoom"), "pointerup", 20, 20);
    });
    expect(serviceCalls()).toHaveLength(1);
    await act(async () => {
      pointer(primary("upstairs"), "pointerdown", 30, 30);
      pointer(primary("upstairs"), "pointerup", 30, 30);
    });
    expect(serviceCalls()).toHaveLength(2);
    expect(serviceCalls()[1]?.body).toMatchObject({ entity_id: "light.boven", service: "turn_on" });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
      pointer(primary("livingRoom"), "pointerdown", 20, 20);
      pointer(primary("livingRoom"), "pointerup", 20, 20);
    });
    expect(serviceCalls()).toHaveLength(3);
    expect(serviceCalls()[2]?.body).toMatchObject({ entity_id: "light.woonkamer", service: "turn_off" });
  });

  it("ignores another tap on the same window while call-service is still running", async () => {
    linkRooms();
    useEntityStateStore.getState().setStates([
      sun,
      solarState("1650"),
      light("light.woonkamer", "off"),
      light("light.boven", "off"),
    ]);
    let release: ((value: { ok: boolean; status: number; json: () => Promise<unknown> }) => void) | null = null;
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (String(url).includes("call-service")) {
          return new Promise((resolve) => {
            release = resolve;
          });
        }
        return Promise.resolve({ ok: false, status: 500, json: async () => ({}) });
      })
    );
    await show();
    vi.useFakeTimers();
    await act(async () => {
      pointer(primary("livingRoom"), "pointerdown", 12, 18);
      pointer(primary("livingRoom"), "pointerup", 12, 18);
    });
    expect(serviceCalls()).toHaveLength(1);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(700);
      pointer(primary("livingRoom"), "pointerdown", 12, 18);
      pointer(primary("livingRoom"), "pointerup", 12, 18);
    });
    expect(serviceCalls()).toHaveLength(1);
    await act(async () => {
      release?.({ ok: true, status: 200, json: async () => ({}) });
    });
    await act(async () => {
      pointer(primary("livingRoom"), "pointerdown", 12, 18);
      pointer(primary("livingRoom"), "pointerup", 12, 18);
    });
    expect(serviceCalls()).toHaveLength(2);
  });
});
