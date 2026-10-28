import { entityLabel, TOP_DEVICE_ID_RE, TOP_DEVICE_MAX } from "@/lib/energy-dashboard";

export type TopDeviceMoveResult =
  | { ok: true; ids: string[] }
  | { ok: false; reason: "full" | "duplicate" | "invalid" };

type NamedEntity = {
  entity_id: string;
  attributes?: Record<string, unknown> | null;
};

/** Friendly name, or the fallback when the name would be the entity id itself. */
export function topDeviceLabel(id: string, entities: readonly NamedEntity[], unnamed: string, missing: string): string {
  const entity = entities.find((item) => item.entity_id === id);
  if (!entity) return missing;
  const label = entityLabel({
    entity_id: entity.entity_id,
    attributes: entity.attributes ?? undefined,
  }).trim();
  if (!label || label === id) return unnamed;
  return label;
}

export function moveTopDevice(ids: readonly string[], from: number, to: number): string[] {
  if (from < 0 || from >= ids.length || to < 0 || to >= ids.length || from === to) return [...ids];
  const next = [...ids];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** One step up or down. At either edge the list is unchanged. */
export function moveTopDeviceBy(ids: readonly string[], index: number, delta: -1 | 1): string[] {
  return moveTopDevice(ids, index, index + delta);
}

export function addTopDevice(ids: readonly string[], id: string): TopDeviceMoveResult {
  if (!TOP_DEVICE_ID_RE.test(id)) return { ok: false, reason: "invalid" };
  if (ids.includes(id)) return { ok: false, reason: "duplicate" };
  if (ids.length >= TOP_DEVICE_MAX) return { ok: false, reason: "full" };
  return { ok: true, ids: [...ids, id] };
}

export function removeTopDevice(ids: readonly string[], id: string): { ids: string[]; index: number } {
  const index = ids.indexOf(id);
  if (index < 0) return { ids: [...ids], index: -1 };
  return { ids: ids.filter((item) => item !== id), index };
}

/** Put a removed id back at its previous index, clamped to the current list. */
export function restoreTopDevice(ids: readonly string[], id: string, index: number): TopDeviceMoveResult {
  if (!TOP_DEVICE_ID_RE.test(id)) return { ok: false, reason: "invalid" };
  if (ids.includes(id)) return { ok: false, reason: "duplicate" };
  if (ids.length >= TOP_DEVICE_MAX) return { ok: false, reason: "full" };
  const next = [...ids];
  const at = Math.max(0, Math.min(index, next.length));
  next.splice(at, 0, id);
  return { ok: true, ids: next };
}
