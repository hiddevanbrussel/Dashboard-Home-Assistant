/**
 * Largest-consumer suggestions from Home Assistant energy prefs.
 * device_consumption is the proposal. Without it, the picker shows the setup guide.
 * Today’s kWh is requested for at most five visible candidates at a time.
 */

import { filterTopDeviceCandidates, TOP_DEVICE_ID_RE } from "./energy-dashboard";
import type { EnergyDevice, EnergyModel } from "./energy-prefs";

export const TODAY_KWH_BATCH = 5;

export type ProposalDevice = { id: string; name: string | null };

export function proposalFromDevices(devices: readonly Pick<EnergyDevice, "statConsumption" | "name">[]): ProposalDevice[] {
  const seen = new Set<string>();
  const out: ProposalDevice[] = [];
  for (const device of devices) {
    const id = device.statConsumption?.trim() ?? "";
    if (!TOP_DEVICE_ID_RE.test(id) || seen.has(id)) continue;
    seen.add(id);
    out.push({ id, name: device.name });
  }
  return out;
}

export function proposalFromModel(model: EnergyModel): ProposalDevice[] {
  return proposalFromDevices(model.deviceConsumption);
}

/** True when prefs loaded and the energy dashboard has no individual devices. */
export function needsDeviceSetupGuide(devices: readonly ProposalDevice[]): boolean {
  return devices.length === 0;
}

export function mergeProposedCandidates<
  T extends { entity_id: string; attributes?: Record<string, unknown> | null },
>(entities: readonly T[], proposed: readonly ProposalDevice[]): T[] {
  const pool = filterTopDeviceCandidates(entities);
  const byId = new Map(entities.map((entity) => [entity.entity_id, entity]));
  const seen = new Set<string>();
  const out: T[] = [];
  for (const device of proposed) {
    if (seen.has(device.id)) continue;
    seen.add(device.id);
    const known = byId.get(device.id) ?? pool.find((entity) => entity.entity_id === device.id);
    if (known) {
      out.push(known);
      continue;
    }
    const synthetic: T = {
      entity_id: device.id,
      attributes: {
        friendly_name: device.name ?? undefined,
        device_class: "energy",
        state_class: "total_increasing",
      },
    } as unknown as T;
    out.push(synthetic);
  }
  for (const entity of pool) {
    if (seen.has(entity.entity_id)) continue;
    seen.add(entity.entity_id);
    out.push(entity);
  }
  return out;
}

/** The first `max` statistic ids, in list order. The statistics route is called with only these. */
export function visibleStatisticIds(ids: readonly string[], max = TODAY_KWH_BATCH): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const id of ids) {
    if (!TOP_DEVICE_ID_RE.test(id) || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
    if (out.length >= max) break;
  }
  return out;
}

export function roundKwh1(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 10) / 10;
}

export function formatKwh1(value: number, language: "nl" | "en"): string {
  return new Intl.NumberFormat(language === "nl" ? "nl-NL" : "en-GB", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(roundKwh1(value));
}

export function listOverflows(scrollHeight: number, clientHeight: number): boolean {
  return scrollHeight > clientHeight + 1;
}
