/**
 * @vitest-environment happy-dom
 */
import { act, createElement, useRef, useState, type RefObject } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HouseLightSheet } from "@/components/energy/overview/house-light-sheet";
import type { HouseLightZoneId } from "@/lib/energy-now";
import { useEntityStateStore, type EntityState } from "@/stores/entity-state-store";
import { hydrateEnergyStore, useEnergyStore } from "@/stores/energy-store";
import { useLanguageStore } from "@/stores/language-store";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function light(id: string, state: string, attributes: Record<string, unknown>): EntityState {
  return { entity_id: id, state, attributes };
}

function serviceBodies(): Record<string, unknown>[] {
  return (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls
    .map((call) => {
      const init = call[1] as RequestInit | undefined;
      if (typeof init?.body !== "string") return null;
      return JSON.parse(init.body) as Record<string, unknown>;
    })
    .filter((body): body is Record<string, unknown> => body != null);
}

function SheetHarness({
  zoneId,
  onClose,
}: {
  zoneId: HouseLightZoneId;
  onClose?: () => void;
}) {
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  const flushRef = useRef<(() => void) | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [open, setOpen] = useState(true);
  return createElement(
    "div",
    null,
    createElement("button", { ref: returnFocus, type: "button", "data-return": "" }, "terug"),
    open
      ? createElement(HouseLightSheet, {
          zoneId,
          orientation: "landscape",
          reducedMotion: true,
          returnFocus: returnFocus as RefObject<HTMLElement | null>,
          notice,
          flushRef,
          onClose: () => {
            setOpen(false);
            onClose?.();
          },
          onNotice: setNotice,
          onNoticeDone: () => setNotice(null),
          onUserAction: () => undefined,
        })
      : null
  );
}

function setSlider(input: HTMLInputElement, value: string) {
  const proto = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  proto?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

describe("house light sheet", () => {
  let root: Root | null = null;
  let host: HTMLDivElement | null = null;

  beforeEach(() => {
    localStorage.clear();
    useLanguageStore.setState({ language: "nl", ready: true });
    hydrateEnergyStore();
    useEntityStateStore.setState({ states: {}, updatedAt: null, error: null, optimisticLockUntil: {} });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, status: 200, json: async () => ({}) }))
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

  it("shows both sliders, brightness only, or the on/off sentence", async () => {
    useEnergyStore.getState().setLightingEntity("livingRoomEntityId", "light.woonkamer");
    useEnergyStore.getState().setLightingEntity("kitchenEntityId", "light.keuken");
    useEnergyStore.getState().setLightingEntity("bathroomEntityId", "light.badkamer");
    useEntityStateStore.getState().setStates([
      light("light.woonkamer", "on", {
        brightness: 178,
        supported_color_modes: ["color_temp"],
        color_temp_kelvin: 2700,
        min_color_temp_kelvin: 2000,
        max_color_temp_kelvin: 6500,
      }),
    ]);
    await act(async () => {
      root?.render(createElement(SheetHarness, { zoneId: "livingRoom" }));
    });
    expect(document.querySelector("[data-house-light-brightness]")).toBeTruthy();
    expect(document.querySelector("[data-house-light-kelvin]")).toBeTruthy();
    expect(document.querySelector("[data-house-light-only]")).toBeNull();
    expect(document.querySelector("[data-house-light-sheet]")?.getAttribute("aria-label")).toBe("Woonkamer licht");
    expect(document.querySelector("[data-house-light-sheet]")?.className).not.toContain("backdrop-blur");

    useEntityStateStore.getState().setStates([
      light("light.keuken", "on", { brightness_pct: 45, supported_color_modes: ["brightness"] }),
    ]);
    await act(async () => {
      root?.render(createElement(SheetHarness, { zoneId: "kitchen" }));
    });
    expect(document.querySelector("[data-house-light-brightness]")).toBeTruthy();
    expect(document.querySelector("[data-house-light-kelvin]")).toBeNull();
    expect(document.querySelector("[data-house-light-only]")).toBeNull();

    useEntityStateStore.getState().setStates([
      light("light.badkamer", "off", { supported_color_modes: ["onoff"] }),
    ]);
    await act(async () => {
      root?.render(createElement(SheetHarness, { zoneId: "bathroom" }));
    });
    expect(document.querySelector("[data-house-light-brightness]")).toBeNull();
    expect(document.querySelector("[data-house-light-kelvin]")).toBeNull();
    expect(document.querySelector("[data-house-light-only]")?.textContent).toBe(
      "Deze lamp kan alleen aan en uit."
    );
  });

  it("sends at most one drag call per 250ms, plus the value on release", async () => {
    useEnergyStore.getState().setLightingEntity("livingRoomEntityId", "light.woonkamer");
    useEntityStateStore.getState().setStates([
      light("light.woonkamer", "on", { brightness_pct: 70, supported_color_modes: ["brightness"] }),
    ]);
    await act(async () => {
      root?.render(createElement(SheetHarness, { zoneId: "livingRoom" }));
    });
    const slider = document.querySelector("[data-house-light-brightness]");
    if (!(slider instanceof HTMLInputElement)) throw new Error("slider missing");
    vi.useFakeTimers();
    await act(async () => {
      slider.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 }));
      setSlider(slider, "40");
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
      setSlider(slider, "50");
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
      setSlider(slider, "60");
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60);
      setSlider(slider, "80");
    });
    await act(async () => {
      slider.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: 1 }));
    });
    const bodies = serviceBodies();
    expect(bodies.length).toBeGreaterThanOrEqual(2);
    expect(bodies.length).toBeLessThanOrEqual(3);
    expect(bodies[0]).toMatchObject({ service: "turn_on", service_data: { brightness_pct: 40 } });
    expect(bodies.at(-1)).toMatchObject({ service: "turn_on", service_data: { brightness_pct: 80 } });
    const dragBodies = bodies.slice(0, -1);
    expect(dragBodies.length).toBeLessThanOrEqual(2);
  });

  it("restores the slider and shows the failure text when the call fails", async () => {
    useEnergyStore.getState().setLightingEntity("livingRoomEntityId", "light.woonkamer");
    useEntityStateStore.getState().setStates([
      light("light.woonkamer", "on", { brightness_pct: 70, supported_color_modes: ["brightness"] }),
    ]);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 500, json: async () => ({}) }))
    );
    await act(async () => {
      root?.render(createElement(SheetHarness, { zoneId: "livingRoom" }));
    });
    const slider = document.querySelector("[data-house-light-brightness]");
    if (!(slider instanceof HTMLInputElement)) throw new Error("slider missing");
    await act(async () => {
      slider.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 }));
      setSlider(slider, "30");
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(slider.value).toBe("70");
    expect(document.querySelector("[data-house-light-notice]")?.textContent).toBe(
      "Woonkamer: helderheid aanpassen mislukt"
    );
    expect(document.querySelector("[data-house-light-notice] button")).toBeNull();
  });

  it("closes on Escape and returns focus to the window", async () => {
    useEnergyStore.getState().setLightingEntity("livingRoomEntityId", "light.woonkamer");
    useEntityStateStore.getState().setStates([
      light("light.woonkamer", "on", { supported_color_modes: ["brightness"], brightness_pct: 70 }),
    ]);
    await act(async () => {
      root?.render(createElement(SheetHarness, { zoneId: "livingRoom" }));
    });
    expect(document.activeElement).toBe(document.querySelector("[data-house-light-switch]"));
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(document.querySelector("[data-house-light-sheet]")).toBeNull();
    expect(document.activeElement).toBe(document.querySelector("[data-return]"));
  });

  it("names a group of three lights", async () => {
    useEnergyStore.getState().setLightingEntity("upstairsEntityId", "light.boven");
    useEntityStateStore.getState().setStates([
      light("light.boven", "on", {
        brightness_pct: 100,
        supported_color_modes: ["brightness"],
        entity_id: ["light.lamp1", "light.lamp2", "light.lamp3"],
      }),
    ]);
    await act(async () => {
      root?.render(createElement(SheetHarness, { zoneId: "upstairs" }));
    });
    expect(document.querySelector("[data-house-light-sheet-status]")?.textContent).toContain("groep, 3 lampen");
    expect(document.querySelector("[data-house-light-kelvin]")).toBeNull();
  });

  it("shows a dash and a grey fill when the light is off, and says Uit instead of 1 percent", async () => {
    useEnergyStore.getState().setLightingEntity("livingRoomEntityId", "light.woonkamer");
    useEntityStateStore.getState().setStates([
      light("light.woonkamer", "off", {
        brightness: 0,
        supported_color_modes: ["color_temp"],
        color_temp_kelvin: 2700,
        min_color_temp_kelvin: 2000,
        max_color_temp_kelvin: 6500,
      }),
    ]);
    await act(async () => {
      root?.render(createElement(SheetHarness, { zoneId: "livingRoom" }));
    });
    expect(document.querySelector("[data-house-light-brightness-value]")?.textContent).toBe("–");
    const fill = document.querySelector("[data-house-light-brightness-fill]");
    expect(fill?.className).toContain("bg-[#9ca3af]");
    expect(fill?.className).toContain("dark:bg-white/25");
    expect(fill?.className).not.toContain("bg-[#4700B5]");
    const track = document.querySelector("[data-house-light-switch-track]");
    expect(track?.className).toContain("bg-[#6b7280]");
    expect(track?.className).toContain("dark:bg-white/40");
    const slider = document.querySelector("[data-house-light-brightness]");
    expect(slider?.getAttribute("aria-valuetext")).toBe("Uit");
    expect(slider?.getAttribute("aria-valuetext")).not.toContain("procent");
    const kelvin = document.querySelector("[data-house-light-kelvin]");
    expect(kelvin?.parentElement?.className).toContain("focus-within:ring-2");
    expect(kelvin?.parentElement?.className).toContain("focus-within:ring-brand");
    expect(kelvin?.parentElement?.className).toContain("dark:focus-within:ring-brand-muted");
    expect(slider?.parentElement?.className).toContain("dark:focus-within:ring-brand-muted");

    useLanguageStore.setState({ language: "en", ready: true });
    await act(async () => {
      root?.render(createElement(SheetHarness, { zoneId: "livingRoom" }));
    });
    expect(document.querySelector("[data-house-light-brightness]")?.getAttribute("aria-valuetext")).toBe("Off");
    expect(document.querySelector("[data-house-light-brightness-value]")?.textContent).toBe("–");
  });

  it("keeps the last brightness on the grey fill and does not announce that percent while off", async () => {
    useEnergyStore.getState().setLightingEntity("livingRoomEntityId", "light.woonkamer");
    useEntityStateStore.getState().setStates([
      light("light.woonkamer", "off", {
        brightness_pct: 70,
        supported_color_modes: ["brightness"],
      }),
    ]);
    await act(async () => {
      root?.render(createElement(SheetHarness, { zoneId: "livingRoom" }));
    });
    const fill = document.querySelector("[data-house-light-brightness-fill]");
    expect(fill?.getAttribute("style")).toContain("70%");
    expect(fill?.className).toContain("bg-[#9ca3af]");
    expect(document.querySelector("[data-house-light-brightness-value]")?.textContent).toBe("–");
    expect(document.querySelector("[data-house-light-brightness]")?.getAttribute("aria-valuetext")).toBe("Uit");
  });
});
