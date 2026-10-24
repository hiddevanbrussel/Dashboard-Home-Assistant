/**
 * Temperature and humidity for a room tile.
 *
 * Values come from the entity states already kept by `useEntityStatePolling`
 * (`GET /api/ha/state`). That route uses the stored Home Assistant token on
 * the server. This helper does not open a socket, mint a token, or log one.
 */

export type RoomClimateKind = "temperature" | "humidity";

export type RoomClimateEntity = {
  state?: string | null;
  attributes?: Record<string, unknown> | null;
};

const UNUSABLE = new Set(["", "unavailable", "unknown", "none", "null"]);

function parseReading(raw: unknown): number | null {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (UNUSABLE.has(trimmed.toLowerCase())) return null;
  const normalized =
    trimmed.includes(",") && !trimmed.includes(".") ? trimmed.replace(",", ".") : trimmed;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function attribute(entity: RoomClimateEntity, key: string): unknown {
  const attributes = entity.attributes;
  if (!attributes || typeof attributes !== "object") return undefined;
  return attributes[key];
}

/**
 * Numeric temperature or humidity for one entity, or null when it has no reading.
 * Climate entities expose the number on `current_temperature` / `current_humidity`;
 * their `state` is an HVAC mode and is ignored. Sensors use `state`.
 */
export function readClimateNumber(
  entity: RoomClimateEntity | null | undefined,
  kind: RoomClimateKind,
  entityId?: string | null
): number | null {
  if (!entity) return null;
  const climate = (entityId ?? "").startsWith("climate.");
  if (kind === "temperature") {
    if (climate) return parseReading(attribute(entity, "current_temperature"));
    return parseReading(entity.state);
  }
  if (climate) return parseReading(attribute(entity, "current_humidity"));
  return parseReading(entity.state);
}

/** Compact label for the tile. Temperature keeps one decimal; humidity is a whole percent. */
export function formatClimateValue(value: number, kind: RoomClimateKind): string {
  if (kind === "humidity") return `${Math.round(value)}%`;
  const rounded = Math.round(value * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${text}°`;
}
