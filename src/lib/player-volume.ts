export type PreloadedPlayerVolume = {
  volume: number | null;
  muted: boolean | null;
};

/**
 * Volume preload from Music Assistant `config/players/get`.
 * volume_level is the 0..1 value the player bar already sends to volume_set.
 * A truthy error (including a 403 from the proxy) leaves the slider unchanged.
 */
export function readPreloadedPlayerVolume(data: unknown): PreloadedPlayerVolume {
  if (!data || typeof data !== "object") return { volume: null, muted: null };
  const record = data as { error?: unknown; result?: unknown; volume_level?: unknown; volume_muted?: unknown };
  if (typeof record.error === "string" && record.error) return { volume: null, muted: null };
  const nested = record.result;
  const source =
    nested && typeof nested === "object"
      ? (nested as { volume_level?: unknown; volume_muted?: unknown })
      : record;
  const level = source.volume_level;
  const muted = source.volume_muted;
  return {
    volume: typeof level === "number" && level >= 0 && level <= 1 ? Math.round(level * 100) : null,
    muted: typeof muted === "boolean" ? muted : null,
  };
}
