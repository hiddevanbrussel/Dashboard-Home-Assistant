import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ENERGY_MY_TILES_ENABLED, energyPageView, parseEnergyTab } from "./energy-tab";

describe("energy tab", () => {
  it("defaults to overview and treats a corrupt value as the default", () => {
    expect(parseEnergyTab(null)).toBe("overview");
    expect(parseEnergyTab(undefined)).toBe("overview");
    expect(parseEnergyTab("")).toBe("overview");
    expect(parseEnergyTab("tiles ")).toBe("overview");
    expect(parseEnergyTab("overview")).toBe("overview");
    expect(parseEnergyTab("tiles")).toBe("tiles");
  });

  it("hides My tiles without rewriting the stored tab", () => {
    expect(ENERGY_MY_TILES_ENABLED).toBe(false);
    expect(energyPageView("tiles", true)).toBe("overview");
    expect(energyPageView("tiles", false)).toBe("overview");
    expect(energyPageView("overview", false)).toBe("overview");
    expect(energyPageView("tiles", true, true)).toBe("tiles");
    expect(energyPageView("overview", false, true)).toBe("pending");
    expect(energyPageView("overview", true, true)).toBe("overview");
    const page = readFileSync(path.join(process.cwd(), "src/app/energy/page.tsx"), "utf8");
    const tabs = readFileSync(path.join(process.cwd(), "src/components/energy/overview/energy-tabs.tsx"), "utf8");
    expect(page).toContain("energyPageView");
    expect(page).not.toContain("writeEnergyTab");
    expect(page).not.toContain("localStorage.removeItem");
    expect(tabs).toContain("ENERGY_MY_TILES_ENABLED");
    const store = readFileSync(path.join(process.cwd(), "src/stores/energy-overview-store.ts"), "utf8");
    const hook = readFileSync(path.join(process.cwd(), "src/hooks/use-energy-overview-data.ts"), "utf8");
    expect(store).toContain("ENERGY_MY_TILES_ENABLED");
    expect(store).not.toContain("localStorage.removeItem");
    expect(hook).toContain("ENERGY_MY_TILES_ENABLED && useEnergyOverviewStore.getState().tab !== \"overview\"");
  });
});
