export type MusicGenre = {
  key: string;
  name: string;
  itemId?: string;
};

export type MusicGenreStyle =
  | "music"
  | "pop"
  | "dance"
  | "classical"
  | "experimental"
  | "rock"
  | "electronic"
  | "songwriter";

export function normalizeGenreName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function genreKey(name: string): string {
  return normalizeGenreName(name).toLowerCase();
}

function namesFromUnknown(value: unknown): string[] {
  if (typeof value === "string" && value.trim()) return [normalizeGenreName(value)];
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const entry of value) {
    if (typeof entry === "string" && entry.trim()) {
      out.push(normalizeGenreName(entry));
      continue;
    }
    if (entry && typeof entry === "object") {
      const rec = entry as Record<string, unknown>;
      const name = rec.name ?? rec.title ?? rec.label;
      if (typeof name === "string" && name.trim()) out.push(normalizeGenreName(name));
    }
  }
  return out;
}

export function genreNamesOnItem(item: unknown): string[] {
  if (!item || typeof item !== "object") return [];
  const rec = item as Record<string, unknown>;
  const meta = rec.metadata && typeof rec.metadata === "object" ? (rec.metadata as Record<string, unknown>) : null;
  return [
    ...namesFromUnknown(rec.genres),
    ...namesFromUnknown(rec.genre),
    ...namesFromUnknown(meta?.genres),
    ...namesFromUnknown(meta?.genre),
  ];
}

export function genresFromMediaItems(items: unknown[], limit = 12): MusicGenre[] {
  const seen = new Map<string, MusicGenre>();
  for (const item of items) {
    for (const name of genreNamesOnItem(item)) {
      const key = genreKey(name);
      if (!seen.has(key)) seen.set(key, { key, name });
    }
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name)).slice(0, limit);
}

export function parseMaGenres(items: unknown[], limit = 12): MusicGenre[] {
  const out: MusicGenre[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const name = typeof rec.name === "string" ? normalizeGenreName(rec.name) : "";
    if (!name) continue;
    const key = genreKey(name);
    if (seen.has(key)) continue;
    seen.add(key);
    const rawId = rec.item_id ?? rec.id;
    const fromUri = typeof rec.uri === "string" ? rec.uri.split("/").filter(Boolean).pop() : undefined;
    const itemId = rawId != null && String(rawId).trim() ? String(rawId).trim() : fromUri;
    out.push(itemId ? { key, name, itemId } : { key, name });
  }
  return out.slice(0, limit);
}

export function mergeHomeGenres(libraryGenres: unknown[], albums: unknown[], limit = 8): MusicGenre[] {
  const fromLibrary = parseMaGenres(libraryGenres, limit);
  if (fromLibrary.length > 0) return fromLibrary;
  return genresFromMediaItems(albums, limit);
}

export function albumMatchesGenre(item: unknown, genre: MusicGenre): boolean {
  return genreNamesOnItem(item).some((name) => genreKey(name) === genre.key);
}

export function genreStyleFor(key: string): MusicGenreStyle {
  const k = key.toLowerCase();
  if (/(singer[- ]?songwriter|folk|acoustic|americana)/.test(k)) return "songwriter";
  if (/(experimental|avant|noise)/.test(k)) return "experimental";
  if (/(electronic|electronica|synth|ambient|idm)/.test(k)) return "electronic";
  if (/(dance|house|techno|trance|edm|disco)/.test(k)) return "dance";
  if (/(rock|metal|punk|grunge|indie)/.test(k)) return "rock";
  if (/(classical|klassiek|orchestra|opera|piano|baroque)/.test(k)) return "classical";
  if (/(pop|r&b|rnb|soul)/.test(k)) return "pop";
  return "music";
}
