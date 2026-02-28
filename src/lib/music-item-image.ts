/**
 * Shared helpers for Music Assistant item images (used by music page and global player bar).
 */

export const MUSIC_IMAGE_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZTBlMGUwIi8+PC9zdmc+";

export type MASearchItemImage = {
  image?: string | { url?: string; value?: string };
  image_url?: string;
  album?: { name?: string; image?: string; image_url?: string; metadata?: { images?: { url?: string; value?: string }[] } };
  metadata?: { images?: { url?: string; value?: string; path?: string }[] };
  [key: string]: unknown;
};

function asStr(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}
function fromObj(o: unknown): string | null {
  if (!o || typeof o !== "object") return null;
  const obj = o as Record<string, unknown>;
  if (typeof obj.url === "string") return asStr(obj.url);
  if (typeof obj.value === "string") return asStr(obj.value);
  if (typeof obj.path === "string") return (obj.path as string).startsWith("/") ? (obj.path as string) : `/${obj.path}`;
  return null;
}

export function getItemImageUrl(item: MASearchItemImage | null | undefined): string | null {
  if (!item) return null;
  let url =
    asStr(item.image) ??
    (typeof item.image === "object" ? fromObj(item.image) : null) ??
    asStr(item.image_url) ??
    asStr(item.album?.image) ??
    asStr((item.album as { image_url?: string })?.image_url) ??
    (typeof item.album?.image === "object" ? fromObj(item.album.image) : null) ??
    asStr((item as { thumbnail?: string }).thumbnail) ??
    asStr((item as { artwork?: string }).artwork) ??
    asStr((item as { picture?: string }).picture) ??
    (typeof (item as { artwork?: unknown }).artwork === "object" ? fromObj((item as { artwork: unknown }).artwork) : null) ??
    asStr((item as { cover?: string }).cover) ??
    asStr((item as { cover_image?: string }).cover_image) ??
    asStr((item as { cover_url?: string }).cover_url) ??
    asStr((item as { icon?: string }).icon) ??
    null;
  if (url) return url;
  const meta = item.metadata as { images?: { url?: string; value?: string; path?: string }[] } | undefined;
  const images = meta?.images;
  if (Array.isArray(images) && images.length > 0) {
    for (const img of images) {
      url = asStr(img?.url) ?? fromObj(img);
      if (url) return url;
    }
  }
  const albumMeta = item.album?.metadata as { images?: { url?: string; value?: string }[] } | undefined;
  const albumImages = albumMeta?.images;
  if (Array.isArray(albumImages) && albumImages.length > 0) {
    for (const img of albumImages) {
      url = asStr(img?.url) ?? fromObj(img);
      if (url) return url;
    }
  }
  const topLevelImages = (item as { images?: unknown[] }).images;
  if (Array.isArray(topLevelImages) && topLevelImages.length > 0) {
    const first = topLevelImages[0];
    url = asStr(first) ?? (typeof first === "object" ? fromObj(first) : null);
    if (url) return url;
  }
  // provider_mappings: Music Assistant stores images per provider (playlists, albums, etc.)
  const mappings = (item as { provider_mappings?: { url?: string; image?: string | { url?: string; value?: string }; image_url?: string }[] }).provider_mappings;
  if (Array.isArray(mappings) && mappings.length > 0) {
    for (const m of mappings) {
      url = asStr(m?.url) ?? asStr(m?.image) ?? asStr(m?.image_url) ?? (typeof m?.image === "object" ? fromObj(m.image) : null);
      if (url) return url;
    }
  }
  return null;
}

export function getImageSrc(
  rawUrl: string | null,
  baseUrl: string | undefined,
  token: string | undefined
): string | null {
  if (!rawUrl || !rawUrl.trim()) return null;
  let url = rawUrl.trim();
  if (url.startsWith("/") && (url.slice(1).startsWith("http://") || url.slice(1).startsWith("https://"))) {
    url = url.slice(1);
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const base = baseUrl?.replace(/\/+$/, "") ?? "";
    if (base && url.startsWith(base)) {
      const params = new URLSearchParams({ baseUrl: base, url });
      if (token) params.set("token", token);
      return `/api/music-assistant-image?${params.toString()}`;
    }
    return url;
  }
  const base = baseUrl?.replace(/\/+$/, "") ?? "";
  const isRelative = url.startsWith("/");
  const isMaOrigin = base && (url.startsWith(base) || url.startsWith("http://localhost") || url.startsWith("http://127.0.0.1"));
  if ((isRelative || isMaOrigin) && base) {
    const full = isRelative ? `${base}${url}` : url;
    const params = new URLSearchParams({ baseUrl: base, url: full });
    if (token) params.set("token", token);
    return `/api/music-assistant-image?${params.toString()}`;
  }
  return url;
}

export function formatDuration(seconds?: number): string {
  if (seconds == null || Number.isNaN(seconds)) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Alias for bar/content components that expect MASearchItem. */
export type MASearchItem = MASearchItemImage;
