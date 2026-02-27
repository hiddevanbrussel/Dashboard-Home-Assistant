"use client";

import { create } from "zustand";

const STORAGE_KEY_ENABLED = "dashboard.energy.enabled";
const STORAGE_KEY_COST_PER_KWH = "dashboard.energy.costPerKwh";
const STORAGE_KEY_NETBEHEERKOSTEN = "dashboard.energy.netbeheerkostenPerDag";
const STORAGE_KEY_VASTE_LEVERING = "dashboard.energy.vasteLeveringskostenPerMaand";
const STORAGE_KEY_GAS_COST_PER_M3 = "dashboard.energy.gasCostPerM3";
const STORAGE_KEY_GAS_NETBEHEER = "dashboard.energy.gasNetbeheerkostenPerDag";
const STORAGE_KEY_GAS_VASTE_LEVERING = "dashboard.energy.gasVasteLeveringskostenPerMaand";

function getStored<T>(key: string, fallback: T, parse: (s: string) => T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    if (v === null || v === "") return fallback;
    return parse(v);
  } catch {
    return fallback;
  }
}

function setStored(key: string, value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // ignore
  }
}

function setStoredNum(key: string, value: number | undefined): void {
  if (typeof window === "undefined") return;
  try {
    if (value == null || Number.isNaN(value)) localStorage.removeItem(key);
    else localStorage.setItem(key, String(value));
  } catch {
    // ignore
  }
}

type EnergyStore = {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  /** Kosten per kWh (€) – gebruikt als input voor berekening. */
  costPerKwh: number | undefined;
  setCostPerKwh: (v: number | undefined) => void;
  /** Netbeheerkosten per dag (€). */
  netbeheerkostenPerDag: number | undefined;
  setNetbeheerkostenPerDag: (v: number | undefined) => void;
  /** Vaste leveringskosten per maand (€). */
  vasteLeveringskostenPerMaand: number | undefined;
  setVasteLeveringskostenPerMaand: (v: number | undefined) => void;
  /** Gas: kosten per m³ (€). */
  gasCostPerM3: number | undefined;
  setGasCostPerM3: (v: number | undefined) => void;
  /** Gas: netbeheerkosten per dag (€). */
  gasNetbeheerkostenPerDag: number | undefined;
  setGasNetbeheerkostenPerDag: (v: number | undefined) => void;
  /** Gas: vaste leveringskosten per maand (€). */
  gasVasteLeveringskostenPerMaand: number | undefined;
  setGasVasteLeveringskostenPerMaand: (v: number | undefined) => void;
};

export const useEnergyStore = create<EnergyStore>((set) => ({
  enabled: getStored(STORAGE_KEY_ENABLED, false, (v) => v === "true"),
  setEnabled: (v) => {
    setStored(STORAGE_KEY_ENABLED, v);
    set({ enabled: v });
  },
  costPerKwh: getStored(STORAGE_KEY_COST_PER_KWH, undefined, (v) => {
    const n = parseFloat(v);
    return Number.isNaN(n) ? undefined : n;
  }),
  setCostPerKwh: (v) => {
    setStoredNum(STORAGE_KEY_COST_PER_KWH, v);
    set({ costPerKwh: v });
  },
  netbeheerkostenPerDag: getStored(STORAGE_KEY_NETBEHEERKOSTEN, undefined, (v) => {
    const n = parseFloat(v);
    return Number.isNaN(n) ? undefined : n;
  }),
  setNetbeheerkostenPerDag: (v) => {
    setStoredNum(STORAGE_KEY_NETBEHEERKOSTEN, v);
    set({ netbeheerkostenPerDag: v });
  },
  vasteLeveringskostenPerMaand: getStored(STORAGE_KEY_VASTE_LEVERING, undefined, (v) => {
    const n = parseFloat(v);
    return Number.isNaN(n) ? undefined : n;
  }),
  setVasteLeveringskostenPerMaand: (v) => {
    setStoredNum(STORAGE_KEY_VASTE_LEVERING, v);
    set({ vasteLeveringskostenPerMaand: v });
  },
  gasCostPerM3: getStored(STORAGE_KEY_GAS_COST_PER_M3, undefined, (v) => {
    const n = parseFloat(v);
    return Number.isNaN(n) ? undefined : n;
  }),
  setGasCostPerM3: (v) => {
    setStoredNum(STORAGE_KEY_GAS_COST_PER_M3, v);
    set({ gasCostPerM3: v });
  },
  gasNetbeheerkostenPerDag: getStored(STORAGE_KEY_GAS_NETBEHEER, undefined, (v) => {
    const n = parseFloat(v);
    return Number.isNaN(n) ? undefined : n;
  }),
  setGasNetbeheerkostenPerDag: (v) => {
    setStoredNum(STORAGE_KEY_GAS_NETBEHEER, v);
    set({ gasNetbeheerkostenPerDag: v });
  },
  gasVasteLeveringskostenPerMaand: getStored(STORAGE_KEY_GAS_VASTE_LEVERING, undefined, (v) => {
    const n = parseFloat(v);
    return Number.isNaN(n) ? undefined : n;
  }),
  setGasVasteLeveringskostenPerMaand: (v) => {
    setStoredNum(STORAGE_KEY_GAS_VASTE_LEVERING, v);
    set({ gasVasteLeveringskostenPerMaand: v });
  },
}));

export function hydrateEnergyStore() {
  if (typeof window === "undefined") return;
  useEnergyStore.setState({
    enabled: getStored(STORAGE_KEY_ENABLED, false, (v) => v === "true"),
    costPerKwh: getStored(STORAGE_KEY_COST_PER_KWH, undefined, (v) => {
      const n = parseFloat(v);
      return Number.isNaN(n) ? undefined : n;
    }),
    netbeheerkostenPerDag: getStored(STORAGE_KEY_NETBEHEERKOSTEN, undefined, (v) => {
      const n = parseFloat(v);
      return Number.isNaN(n) ? undefined : n;
    }),
    vasteLeveringskostenPerMaand: getStored(STORAGE_KEY_VASTE_LEVERING, undefined, (v) => {
      const n = parseFloat(v);
      return Number.isNaN(n) ? undefined : n;
    }),
    gasCostPerM3: getStored(STORAGE_KEY_GAS_COST_PER_M3, undefined, (v) => {
      const n = parseFloat(v);
      return Number.isNaN(n) ? undefined : n;
    }),
    gasNetbeheerkostenPerDag: getStored(STORAGE_KEY_GAS_NETBEHEER, undefined, (v) => {
      const n = parseFloat(v);
      return Number.isNaN(n) ? undefined : n;
    }),
    gasVasteLeveringskostenPerMaand: getStored(STORAGE_KEY_GAS_VASTE_LEVERING, undefined, (v) => {
      const n = parseFloat(v);
      return Number.isNaN(n) ? undefined : n;
    }),
  });
}
