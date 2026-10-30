/** Per-tablet energy tab. Default is the overview. Corrupt values fall back to that default. */

export const ENERGY_TAB_STORAGE_KEY = "dashboard.energy.tab";

export const ENERGY_TABS = ["overview", "tiles"] as const;

export type EnergyTab = (typeof ENERGY_TABS)[number];

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
