/** Pull a list of library/search items out of a Music Assistant JSON-RPC response. */
export function parseMaItemList(data: unknown, extraKeys: string[] = []): unknown[] {
  if (data == null || typeof data !== "object") return [];
  const root = data as Record<string, unknown>;
  if (typeof root.error === "string" && root.error) return [];
  const result = root.result ?? root;
  if (Array.isArray(result)) return result;
  if (result == null || typeof result !== "object") return [];
  const obj = result as Record<string, unknown>;
  for (const key of ["items", ...extraKeys]) {
    const value = obj[key];
    if (Array.isArray(value)) return value;
  }
  if (Array.isArray(root.items)) return root.items;
  return [];
}

export function parseMaPlaylist(data: unknown): Record<string, unknown> | null {
  if (data == null || typeof data !== "object") return null;
  const root = data as Record<string, unknown>;
  if (typeof root.error === "string" && root.error) return null;
  const item =
    (root.result && typeof root.result === "object" && !Array.isArray(root.result)
      ? (root.result as Record<string, unknown>)
      : null) ??
    (root.playlist && typeof root.playlist === "object" ? (root.playlist as Record<string, unknown>) : null) ??
    (root.name || root.uri ? root : null);
  if (!item || typeof item !== "object") return null;
  return item.name || item.uri ? item : null;
}

export function parseMaPlaylistTracks(data: unknown): unknown[] {
  if (data == null || typeof data !== "object") return [];
  const root = data as Record<string, unknown>;
  if (typeof root.error === "string" && root.error) return [];
  const result = root.result ?? root;
  if (Array.isArray(result)) return result;
  if (result == null || typeof result !== "object") return [];
  const obj = result as Record<string, unknown>;
  const extract = (value: unknown): unknown | null => {
    if (!value || typeof value !== "object") return null;
    const record = value as Record<string, unknown>;
    return record.track && typeof record.track === "object" ? record.track : value;
  };
  if (Array.isArray(obj.tracks)) return obj.tracks;
  if (Array.isArray(obj.items)) return obj.items.map(extract).filter((item) => item != null);
  if (Array.isArray(obj.playlist_tracks)) return obj.playlist_tracks.map(extract).filter((item) => item != null);
  return [];
}

export function parseMaRecentItems(data: unknown): unknown[] {
  const extra = ["tracks", "track", "recently_played", "recent_items", "data"];
  const items = parseMaItemList(data, extra);
  if (items.length) return items;
  if (data == null || typeof data !== "object") return [];
  const nested = (data as { result?: { items?: unknown[] } }).result?.items;
  return Array.isArray(nested) ? nested : [];
}
