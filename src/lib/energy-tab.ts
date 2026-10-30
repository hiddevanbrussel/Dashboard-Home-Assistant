/** Per-tablet energy tab. Default is the overview. Corrupt values fall back to that default. */

export const ENERGY_TAB_STORAGE_KEY = "dashboard.energy.tab";

export const ENERGY_TABS = ["overview", "tiles"] as const;

export type EnergyTab = (typeof ENERGY_TABS)[number];

/**
 * One flag for My tiles on /energy.
 * False hides the Overview / My tiles tabs and always shows the overview.
 * The stored tab and the tile dashboard stay untouched, so setting this to true brings them back.
 */
export const ENERGY_MY_TILES_ENABLED: boolean = false;

export type EnergyPageView = "pending" | "overview" | "tiles";

/** Which /energy body to paint. The flag does not read or write the stored tab. */
export function energyPageView(
  stored: EnergyTab,
  ready: boolean,
  myTilesEnabled: boolean = ENERGY_MY_TILES_ENABLED
): EnergyPageView {
  if (!myTilesEnabled) return "overview";
  if (!ready) return "pending";
  switch (stored) {
    case "overview":
    case "tiles":
      return stored;
    default: {
      const neverTab: never = stored;
      return neverTab;
    }
  }
}

export function parseEnergyTab(raw: string | null | undefined): EnergyTab {
  if (raw === "overview" || raw === "tiles") return raw;
  return "overview";
}

export function readEnergyTab(): EnergyTab {
  if (typeof window === "undefined") return "overview";
  try {
    return parseEnergyTab(localStorage.getItem(ENERGY_TAB_STORAGE_KEY));
  } catch {
    return "overview";
  }
}

export function writeEnergyTab(tab: EnergyTab): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ENERGY_TAB_STORAGE_KEY, tab);
  } catch {
    // Ignore private-mode and quota failures. The in-memory tab still switches.
  }
}
