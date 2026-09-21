export const MA_LIBRARY_CACHE_MS = 60_000;
export const MA_RECENT_CACHE_MS = 15_000;
export const MA_PLAYERS_CACHE_MS = 20_000;

const CACHEABLE_TTL_MS: Record<string, number> = {
  "music/albums/library_items": MA_LIBRARY_CACHE_MS,
  "music/artists/library_items": MA_LIBRARY_CACHE_MS,
  "music/playlists/library_items": MA_LIBRARY_CACHE_MS,
  "music/radios/library_items": MA_LIBRARY_CACHE_MS,
  "music/podcasts/library_items": MA_LIBRARY_CACHE_MS,
  "music/playlists/get": MA_LIBRARY_CACHE_MS,
  "music/playlists/playlist_tracks": MA_LIBRARY_CACHE_MS,
  "music/recently_played_items": MA_RECENT_CACHE_MS,
  "player_queues/all": MA_PLAYERS_CACHE_MS,
};

export type MaCacheEntry<T> = { expires: number; value: T };

export function maCommandCacheTtlMs(command: string): number | null {
  return CACHEABLE_TTL_MS[command] ?? null;
}

export function maCacheKey(baseUrl: string, token: string, command: string, args: Record<string, unknown>): string {
  const tokenPart = token ? `t:${token.length}:${token.slice(0, 6)}` : "anon";
  return `${baseUrl.replace(/\/+$/, "")}|${tokenPart}|${command}|${stableJson(args)}`;
}

function stableJson(value: unknown): string {
  if (value == null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableJson(item)).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`)
    .join(",")}}`;
}

export function readMaCache<T>(store: Map<string, MaCacheEntry<T>>, key: string, now = Date.now()): T | undefined {
  const hit = store.get(key);
  if (!hit) return undefined;
  if (hit.expires <= now) {
    store.delete(key);
    return undefined;
  }
  return hit.value;
}

export function writeMaCache<T>(
  store: Map<string, MaCacheEntry<T>>,
  key: string,
  value: T,
  ttlMs: number,
  now = Date.now()
): void {
  store.set(key, { value, expires: now + ttlMs });
}
