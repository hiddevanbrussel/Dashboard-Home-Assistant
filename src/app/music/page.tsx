"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/layout/glass-card";
import { MediaCardWidget } from "@/components/widgets";
import {
  MusicHomeDiscovery,
  type MusicHomeShelf,
  type MusicHomeSpotlight,
  type MusicHomeTile,
} from "@/components/music/music-home-discovery";
import { OfflinePill } from "@/components/offline-pill";
import Image from "next/image";
import { Music2, Search, Play, Pause, Disc3, User, SkipBack, SkipForward, Volume2, VolumeX, CirclePlus, CircleMinus, X, ArrowLeft, Heart, Donut, Radio, ChevronDown, ListMusic, Home, ListPlus } from "lucide-react";
import { useMusicAssistantStore, hydrateMusicAssistantStore, type MusicSectionId } from "@/stores/music-assistant-store";
import { useMusicPlayerStore } from "@/stores/music-player-store";
import { fetchMusicAssistantHome } from "@/lib/music-assistant";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

/** Tiny gray placeholder shown while music images load (blur placeholder). */
const MUSIC_IMAGE_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZTBlMGUwIi8+PC9zdmc+";

type HaEntity = { entity_id: string; attributes?: Record<string, unknown> };

type MAPlayer = { queue_id: string; display_name?: string; [key: string]: unknown };

/** Loose type for MA search result items (track/album/artist). */
type MASearchItem = {
  uri?: string;
  name?: string;
  item_id?: string;
  duration?: number;
  artists?: { name?: string }[] | { name?: string } | unknown[];
  album?: { name?: string; image?: string; image_url?: string; metadata?: { images?: { url?: string }[] } };
  image?: string | { url?: string; value?: string };
  image_url?: string;
  metadata?: { images?: { url?: string; value?: string; type?: string }[] };
  [key: string]: unknown;
};

/** Build playable URI for MA. Prefer item.uri; else use provider_mappings or provider + mediaType + item_id. */
function getPlayableUri(item: MASearchItem, mediaType: "track" | "album" | "artist" | "radio" | "playlist"): string {
  const raw = item.uri ?? (item as { item_uri?: string }).item_uri;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  const mappings = (item as { provider_mappings?: { provider_instance_id?: string; item_id?: string }[] }).provider_mappings;
  if (Array.isArray(mappings) && mappings.length > 0) {
    const first = mappings[0];
    const prov = first?.provider_instance_id ?? (first as { provider_instance?: string })?.provider_instance;
    const id = first?.item_id;
    if (prov && id != null) return `${prov}://${mediaType}/${id}`;
  }
  const itemId =
    item.item_id ??
    (item as { item_id?: number | string }).item_id ??
    (item as { id?: number | string }).id;
  if (itemId == null) return "";
  const provider =
    (item as { provider_instance_id?: string }).provider_instance_id ??
    (item as { provider_instance?: string }).provider_instance ??
    (item as { provider?: string }).provider ??
    "library";
  return `${String(provider).replace(/\/+$/, "")}://${mediaType}/${itemId}`;
}

/** Get item_id and provider for MA API (album_tracks, albums/get, artist_albums, etc.). */
function getItemParams(item: MASearchItem): { item_id: string; provider_instance_id_or_domain: string } | null {
  const mappings = (item as { provider_mappings?: { provider_instance_id?: string; provider_instance?: string; item_id?: string | number }[] }).provider_mappings;
  if (Array.isArray(mappings) && mappings.length > 0) {
    const first = mappings[0];
    const prov = first?.provider_instance_id ?? (first as { provider_instance?: string }).provider_instance ?? (first as { provider?: string }).provider;
    const rawId = first?.item_id ?? (first as { id?: string | number }).id;
    const id = rawId != null ? String(rawId) : null;
    if (prov && id) return { item_id: id, provider_instance_id_or_domain: String(prov).replace(/\/+$/, "") };
  }
  const raw = item.uri ?? (item as { item_uri?: string }).item_uri;
  if (typeof raw === "string" && raw.includes("://")) {
    const [scheme, rest] = raw.split("://");
    const parts = rest?.split("/");
    const id = parts?.pop();
    if (scheme && id) return { item_id: id, provider_instance_id_or_domain: scheme.replace(/\/+$/, "") };
  }
  const itemId = item.item_id ?? (item as { item_id?: number | string }).item_id ?? (item as { id?: number | string }).id;
  if (itemId == null) return null;
  const provider =
    (item as { provider_instance_id?: string }).provider_instance_id ??
    (item as { provider_instance_id_or_domain?: string }).provider_instance_id_or_domain ??
    (item as { provider_instance?: string }).provider_instance ??
    (item as { provider?: string }).provider ??
    (item as { provider_domain?: string }).provider_domain ??
    "library";
  return { item_id: String(itemId), provider_instance_id_or_domain: String(provider).replace(/\/+$/, "") };
}

/** Alias for album flows (album_tracks, albums/get). */
function getAlbumParams(item: MASearchItem): { item_id: string; provider_instance_id_or_domain: string } | null {
  return getItemParams(item);
}

/** Alias for artist flows (artist_albums). */
function getArtistParams(item: MASearchItem): { item_id: string; provider_instance_id_or_domain: string } | null {
  return getItemParams(item);
}

function shuffleSeeded<T>(items: T[], seed: number): T[] {
  const arr = items.slice();
  let s = (seed >>> 0) || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function itemUri(item: MASearchItem): string {
  const raw = item.uri ?? (item as { item_uri?: string }).item_uri ?? "";
  return typeof raw === "string" ? raw : "";
}

function itemMediaTypeHint(item: MASearchItem): string {
  return String((item as { media_type?: string }).media_type ?? (item as { type?: string }).type ?? "");
}

/** True if this item is an album (so album_tracks is valid). Recently played can contain tracks; only open album view for albums. */
function isAlbumItem(item: MASearchItem): boolean {
  if (itemUri(item).includes("/album/")) return true;
  return itemMediaTypeHint(item) === "album";
}

function isArtistItem(item: MASearchItem): boolean {
  if (itemUri(item).includes("/artist/")) return true;
  return itemMediaTypeHint(item) === "artist";
}

function isPlaylistItem(item: MASearchItem): boolean {
  if (itemUri(item).includes("/playlist/")) return true;
  return itemMediaTypeHint(item) === "playlist";
}

function isRadioItem(item: MASearchItem): boolean {
  if (itemUri(item).includes("/radio/")) return true;
  return itemMediaTypeHint(item) === "radio";
}

function detectPlayableType(item: MASearchItem): "track" | "album" | "artist" | "radio" | "playlist" {
  if (isAlbumItem(item)) return "album";
  if (isArtistItem(item)) return "artist";
  if (isPlaylistItem(item)) return "playlist";
  if (isRadioItem(item)) return "radio";
  return "track";
}

/** Normalize MA URI: "provider--instance://type/id" -> "provider://type/id" for play_media (avoids 500 on some MA versions). */
function normalizePlayMediaUri(uri: string): string {
  const u = uri.trim();
  const idx = u.indexOf("://");
  if (idx <= 0) return u;
  const scheme = u.slice(0, idx);
  const rest = u.slice(idx);
  const baseProvider = scheme.split("--")[0];
  if (baseProvider && baseProvider !== scheme) return `${baseProvider}${rest}`;
  return u;
}

/** Human-readable provider label (e.g. spotify--abc123 → Spotify, library → Library). */
function getProviderLabel(item: MASearchItem): string {
  const raw =
    (item as { provider_instance_id?: string }).provider_instance_id ??
    (item as { provider_instance?: string }).provider_instance ??
    (item as { provider?: string }).provider ??
    "";
  const base = (typeof raw === "string" ? raw : "").split("--")[0]?.trim() || "library";
  return base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
}

/** Extract first usable image URL from MA item (tracks/albums use metadata.images or image object). */
function getItemImageUrl(item: MASearchItem): string | null {
  const asStr = (v: unknown): string | null =>
    typeof v === "string" && v.trim() ? v.trim() : null;
  const fromObj = (o: unknown): string | null => {
    if (!o || typeof o !== "object") return null;
    const obj = o as Record<string, unknown>;
    if (typeof obj.url === "string") return asStr(obj.url);
    if (typeof obj.value === "string") return asStr(obj.value);
    if (typeof obj.path === "string") return obj.path.startsWith("/") ? obj.path : `/${obj.path}`;
    return null;
  };

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

  // provider_mappings: MA stores images per provider (playlists, albums, etc.)
  const mappings = (item as { provider_mappings?: { url?: string; image?: string | { url?: string; value?: string } }[] }).provider_mappings;
  if (Array.isArray(mappings) && mappings.length > 0) {
    for (const m of mappings) {
      url = asStr(m?.url) ?? asStr(m?.image) ?? (typeof m?.image === "object" ? fromObj(m.image) : null);
      if (url) return url;
    }
  }

  return null;
}

/** Extract artist string from track/album; MA/Spotify may use artists, artist, artist_names, or metadata.artists. */
function getArtistsString(item: MASearchItem): string {
  const fromArtists = item.artists
    ? Array.isArray(item.artists)
      ? (item.artists as { name?: string }[]).map((a) => a?.name).filter(Boolean).slice(0, 3).join(", ")
      : (item.artists as { name?: string })?.name ?? ""
    : "";
  if (fromArtists) return fromArtists;
  const artistNames = (item as { artist_names?: string[] }).artist_names;
  if (Array.isArray(artistNames) && artistNames.length > 0) return artistNames.slice(0, 3).filter(Boolean).join(", ");
  const singleArtist = (item as { artist?: { name?: string } }).artist;
  if (singleArtist?.name) return singleArtist.name;
  const metaArtists = (item.metadata as { artists?: { name?: string }[] })?.artists;
  if (Array.isArray(metaArtists) && metaArtists.length > 0) return metaArtists.map((a) => a?.name).filter(Boolean).slice(0, 3).join(", ");
  const albumArtists = (item.album as { artists?: { name?: string }[] })?.artists;
  if (Array.isArray(albumArtists) && albumArtists.length > 0) return albumArtists.map((a) => a?.name).filter(Boolean).slice(0, 3).join(", ");
  return "";
}

/** Build src for MA images: proxy relative/MA URLs so auth works and CORS is avoided. */
function getImageSrc(rawUrl: string | null, baseUrl: string | undefined, token: string | undefined): string | null {
  if (!rawUrl || !rawUrl.trim()) return null;
  let url = rawUrl.trim();
  // MA sometimes returns full URLs as path (e.g. "/https://is1-ssl.mzstatic.com/...") – use as external URL
  if (url.startsWith("/") && (url.slice(1).startsWith("http://") || url.slice(1).startsWith("https://"))) {
    url = url.slice(1);
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const base = baseUrl?.replace(/\/+$/, "") ?? "";
    const isOnMaHost = base && url.startsWith(base);
    if (!isOnMaHost) return url;
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

async function callMusicAssistant(
  baseUrl: string,
  token: string,
  command: string,
  args: Record<string, unknown> = {},
  options: { skipCache?: boolean } = {}
): Promise<unknown> {
  const res = await fetch("/api/music-assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ baseUrl, token, command, args, skipCache: options.skipCache === true }),
  });
  const text = await res.text();
  const data = (() => {
    try {
      if (!text.trim()) return {};
      return JSON.parse(text) as Record<string, unknown>;
    } catch {
      return {};
    }
  })();
  if (!res.ok) {
    const err =
      (typeof (data as { error?: string }).error === "string" ? (data as { error: string }).error : null) ??
      (text.length > 0 && text.length < 400 ? text : `Request failed (${res.status})`);
    console.error("[Music Assistant]", res.status, command, err, args);
    return { error: err };
  }
  return data;
}

function formatDuration(seconds?: number): string {
  if (seconds == null || Number.isNaN(seconds)) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type MusicHomeMemory = {
  key: string;
  albums: MASearchItem[];
  artists: MASearchItem[];
  playlists: MASearchItem[];
  radios: MASearchItem[];
  recent: MASearchItem[];
  featured: { id: string; playlist: MASearchItem | null; tracks: MASearchItem[] }[];
};

let musicHomeMemory: MusicHomeMemory | null = null;
let musicHomeInflight: Promise<MusicHomeMemory | { error: string }> | null = null;
let musicHomeInflightKey = "";

function loadMusicHome(
  cacheKey: string,
  input: Parameters<typeof fetchMusicAssistantHome>[0]
): Promise<MusicHomeMemory | { error: string }> {
  if (musicHomeInflight && musicHomeInflightKey === cacheKey) return musicHomeInflight;
  musicHomeInflightKey = cacheKey;
  musicHomeInflight = fetchMusicAssistantHome(input)
    .then((data) => {
      if ("error" in data) return data;
      const next: MusicHomeMemory = {
        key: cacheKey,
        albums: data.albums as MASearchItem[],
        artists: data.artists as MASearchItem[],
        playlists: data.playlists as MASearchItem[],
        radios: data.radios as MASearchItem[],
        recent: data.recent as MASearchItem[],
        featured: data.featured.map((entry) => ({
          id: entry.id,
          playlist: (entry.playlist as MASearchItem | null) ?? null,
          tracks: (entry.tracks as MASearchItem[]) ?? [],
        })),
      };
      musicHomeMemory = next;
      return next;
    })
    .finally(() => {
      if (musicHomeInflightKey === cacheKey) musicHomeInflight = null;
    });
  return musicHomeInflight;
}

const LONG_PRESS_MS = 500;

function useLongPressAddToPlaylist(onLongPress: (item: MASearchItem) => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemRef = useRef<MASearchItem | null>(null);
  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    itemRef.current = null;
  }, []);
  return useCallback(
    (item: MASearchItem) => ({
      onPointerDown: (e: React.PointerEvent) => {
        const btn = (e.target as HTMLElement).closest("button");
        if (btn && btn !== e.currentTarget) return;
        itemRef.current = item;
        clearTimer();
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          if (itemRef.current) onLongPress(itemRef.current);
          itemRef.current = null;
        }, LONG_PRESS_MS);
      },
      onPointerUp: clearTimer,
      onPointerLeave: clearTimer,
    }),
    [onLongPress, clearTimer]
  );
}

export default function MusicPage() {
  const [entities, setEntities] = useState<HaEntity[]>([]);
  const { maPlayers, selectedQueueId, setSelectedQueueId, queueState, playerBarExpanded } = useMusicPlayerStore();
  const [playersLoading, setPlayersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<"all" | "track" | "artist" | "album" | "radio">("all");
  const [searchResults, setSearchResults] = useState<MASearchItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [playPending, setPlayPending] = useState<string | null>(null);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFiredRef = useRef(false);
  const LONG_PRESS_MS = 500;

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current != null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  function createTrackLongPressHandlers(item: MASearchItem, onClick?: () => void) {
    const trackUri = getPlayableUri(item, "track");
    if (!trackUri) return { onPointerDown: undefined, onPointerUp: undefined, onPointerLeave: undefined, wrapClick: (fn: () => void) => fn };
    return {
      onPointerDown: (e: React.PointerEvent) => {
        longPressFiredRef.current = false;
        clearLongPressTimer();
        longPressTimerRef.current = setTimeout(() => {
          longPressTimerRef.current = null;
          longPressFiredRef.current = true;
          setAddToPlaylistTrack(item);
        }, LONG_PRESS_MS);
      },
      onPointerUp: () => clearLongPressTimer(),
      onPointerLeave: () => clearLongPressTimer(),
      wrapClick: (fn: () => void) => () => {
        if (longPressFiredRef.current) {
          longPressFiredRef.current = false;
          return;
        }
        fn();
      },
    };
  }
  const [heroHourSeed, setHeroHourSeed] = useState(() => new Date().getHours());
  const spotlightSeedRef = useRef(Math.floor(Math.random() * 1e9));
  const musicScrollRef = useRef<HTMLDivElement>(null);
  const [recentItems, setRecentItems] = useState<MASearchItem[]>([]);
  const [recentLoading, setRecentLoading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<MASearchItem | null>(null);
  /** Album details from music/albums/get (single media item); fallback is selectedAlbum. */
  const [albumDetails, setAlbumDetails] = useState<MASearchItem | null>(null);
  const [albumTracks, setAlbumTracks] = useState<MASearchItem[]>([]);
  const [albumTracksLoading, setAlbumTracksLoading] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<MASearchItem | null>(null);
  const [artistAlbums, setArtistAlbums] = useState<MASearchItem[]>([]);
  const [artistAlbumsLoading, setArtistAlbumsLoading] = useState(false);
  const [artistTracks, setArtistTracks] = useState<MASearchItem[]>([]);
  const [artistTracksLoading, setArtistTracksLoading] = useState(false);
  const [favoritePending, setFavoritePending] = useState<Set<string>>(new Set());
  const [favorited, setFavorited] = useState<Set<string>>(new Set());
  const [radioStations, setRadioStations] = useState<MASearchItem[]>([]);
  const [radioStationsLoading, setRadioStationsLoading] = useState(false);
  const [libraryPlaylists, setLibraryPlaylists] = useState<MASearchItem[]>([]);
  const [libraryPlaylistsLoading, setLibraryPlaylistsLoading] = useState(false);
  const [libraryArtists, setLibraryArtists] = useState<MASearchItem[]>([]);
  const [libraryArtistsLoading, setLibraryArtistsLoading] = useState(false);
  const [libraryAlbums, setLibraryAlbums] = useState<MASearchItem[]>([]);
  const [libraryAlbumsLoading, setLibraryAlbumsLoading] = useState(false);
  const [featuredPlaylistData, setFeaturedPlaylistData] = useState<{ id: string; playlist: MASearchItem | null; tracks: MASearchItem[] }[]>([]);
  const [featuredPlaylistLoading, setFeaturedPlaylistLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MusicSectionId | null>(null);
  const musicMenuOpen = true;
  const [selectedMenu, setSelectedMenu] = useState<"artists" | "albums" | "playlists" | null>(null);
  const [addToPlaylistTrack, setAddToPlaylistTrack] = useState<MASearchItem | null>(null);
  const [addToPlaylistPlaylists, setAddToPlaylistPlaylists] = useState<MASearchItem[]>([]);
  const [addToPlaylistLoading, setAddToPlaylistLoading] = useState(false);
  const [addToPlaylistPending, setAddToPlaylistPending] = useState<string | null>(null);
  const [addToPlaylistError, setAddToPlaylistError] = useState<string | null>(null);
  const musicAssistant = useMusicAssistantStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (searchOverlayOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOverlayOpen]);

  useEffect(() => {
    if (selectedAlbum || selectedArtist) {
      musicScrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [selectedAlbum, selectedArtist]);

  useEffect(() => {
    hydrateMusicAssistantStore();
  }, []);

  useEffect(() => {
    if (!addToPlaylistTrack || !musicAssistant.enabled || !musicAssistant.baseUrl) {
      setAddToPlaylistPlaylists([]);
      return;
    }
    setAddToPlaylistLoading(true);
    const parseItems = (data: unknown): MASearchItem[] => {
      const err = (data as { error?: string })?.error;
      if (err) return [];
      const d = data as Record<string, unknown>;
      const result = d?.result ?? d;
      const resultObj = typeof result === "object" && result !== null ? (result as Record<string, unknown>) : {};
      if (Array.isArray(resultObj.items)) return resultObj.items as MASearchItem[];
      if (Array.isArray(resultObj.playlists)) return resultObj.playlists as MASearchItem[];
      if (Array.isArray(result)) return result as MASearchItem[];
      return [];
    };
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/playlists/library_items", { limit: 100, in_library_only: true })
      .then((data) => setAddToPlaylistPlaylists(parseItems(data)))
      .catch(() => setAddToPlaylistPlaylists([]))
      .finally(() => setAddToPlaylistLoading(false));
  }, [addToPlaylistTrack, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  const getLongPressHandlers = useLongPressAddToPlaylist((item) => {
    const uri = getPlayableUri(item, "track");
    if (uri) setAddToPlaylistTrack(item);
  });

  async function handleAddTrackToPlaylist(playlist: MASearchItem) {
    const trackUri = addToPlaylistTrack ? getPlayableUri(addToPlaylistTrack, "track") : null;
    if (!trackUri || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
    const rawUri = playlist.uri ?? (playlist as { item_uri?: string }).item_uri;
    const itemId = (playlist as { item_id?: string | number }).item_id ?? (playlist as { id?: string | number }).id;
    const provider = (playlist as { provider_instance_id?: string }).provider_instance_id ?? (playlist as { provider_instance?: string }).provider_instance ?? "library";
    let dbPlaylistId =
      (playlist as { db_id?: string }).db_id ??
      (typeof rawUri === "string" && rawUri ? rawUri : null) ??
      (itemId != null ? `${String(provider).replace(/\/+$/, "")}://playlist/${itemId}` : null) ??
      "";
    // Library playlists in MA use database://playlist/X; add_playlist_tracks expects db_playlist_id in that format
    if (dbPlaylistId && provider === "library" && !dbPlaylistId.startsWith("database://")) {
      const numId = typeof itemId === "number" || typeof itemId === "string" ? String(itemId) : dbPlaylistId.replace(/^.*\/+/, "");
      if (numId) dbPlaylistId = `database://playlist/${numId}`;
    }
    if (!dbPlaylistId) return;
    setAddToPlaylistPending(dbPlaylistId);
    setAddToPlaylistError(null);
    try {
      const result = await callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/playlists/add_playlist_tracks", {
        db_playlist_id: dbPlaylistId,
        uris: [normalizePlayMediaUri(trackUri)],
      });
      const err = (result as { error?: string })?.error;
      if (typeof err === "string" && err) {
        setAddToPlaylistError(err);
        return;
      }
      setAddToPlaylistTrack(null);
    } catch (e) {
      setAddToPlaylistError(e instanceof Error ? e.message : t("music.addTrackFailed"));
    } finally {
      setAddToPlaylistPending(null);
    }
  }

  useEffect(() => {
    if (musicAssistant.enabled && musicAssistant.baseUrl) {
      setEntities([]);
      setPlayersLoading(false);
      return;
    }
    setPlayersLoading(true);
    setError(null);
    setEntities([]);

    fetch("/api/ha/entities")
      .then((r) => {
        if (!r.ok) throw new Error(t("music.haConnectionError"));
        return r.json();
      })
      .then((data: HaEntity[]) => {
        const list = Array.isArray(data) ? data : [];
        setEntities(list.filter((e) => e.entity_id?.startsWith("media_player.")));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Er is iets misgegaan."))
      .finally(() => setPlayersLoading(false));
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, t]);

  useEffect(() => {
    if (musicAssistant.enabled && maPlayers.length > 0) setPlayersLoading(false);
  }, [musicAssistant.enabled, maPlayers.length]);

  useEffect(() => {
    if (maPlayers.length === 0) return;
    const ids = new Set(maPlayers.map((p) => p.queue_id));
    if (!selectedQueueId || !ids.has(selectedQueueId)) {
      setSelectedQueueId(maPlayers[0].queue_id);
    }
  }, [maPlayers, selectedQueueId, setSelectedQueueId]);

  useEffect(() => {
    const tick = () => {
      const h = new Date().getHours();
      setHeroHourSeed((prev) => (prev !== h ? h : prev));
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const allowedIds = musicAssistant.allowedSpeakerIds;
  const selectablePlayers = allowedIds.length > 0 ? maPlayers.filter((p) => allowedIds.includes(p.queue_id)) : maPlayers;
  useEffect(() => {
    if (selectablePlayers.length === 0) return;
    const inSelectable = selectablePlayers.some((p) => p.queue_id === selectedQueueId);
    if (!selectedQueueId || !inSelectable) {
      setSelectedQueueId(selectablePlayers[0].queue_id);
    }
  }, [selectablePlayers, selectedQueueId, setSelectedQueueId]);

  useEffect(() => {
    if (!selectedAlbum || !musicAssistant.enabled || !musicAssistant.baseUrl) {
      setAlbumDetails(null);
      setAlbumTracks([]);
      return;
    }
    const params = getAlbumParams(selectedAlbum);
    if (!params) {
      setAlbumDetails(null);
      setAlbumTracks([]);
      setError(null);
      return;
    }
    setAlbumDetails(null);
    // MA API: music/albums/get for single album (metadata)
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/albums/get", {
      item_id: params.item_id,
      provider_instance_id_or_domain: params.provider_instance_id_or_domain,
    })
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const err = (d?.error as string) ?? (d?.message as string);
        if (err) return;
        const result = d?.result ?? d;
        const obj = typeof result === "object" && result !== null ? (result as MASearchItem) : null;
        if (obj && (obj.item_id != null || obj.name != null || obj.uri)) setAlbumDetails(obj);
      })
      .catch(() => {});
  }, [selectedAlbum, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  useEffect(() => {
    if (!selectedAlbum || !musicAssistant.enabled || !musicAssistant.baseUrl) {
      setAlbumTracks([]);
      return;
    }
    const params = getAlbumParams(selectedAlbum);
    if (!params) {
      setAlbumTracks([]);
      setError(null);
      return;
    }
    setAlbumTracksLoading(true);
    setError(null);
    // MA API: music/albums/album_tracks for this album's tracks
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/albums/album_tracks", {
      item_id: params.item_id,
      provider_instance_id_or_domain: params.provider_instance_id_or_domain,
    })
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const err =
          (d?.error as string) ??
          (d?.message as string) ??
          (typeof (d?.detail as string) === "string" ? (d.detail as string) : null);
        if (err) {
          setError(err);
          setAlbumTracks([]);
          return;
        }
        const result = d?.result ?? d;
        const resultObj = typeof result === "object" && result !== null ? (result as Record<string, unknown>) : {};
        let list: MASearchItem[] = [];
        if (Array.isArray(resultObj.tracks)) list = resultObj.tracks as MASearchItem[];
        else if (Array.isArray(resultObj.items)) list = resultObj.items as MASearchItem[];
        else if (Array.isArray((resultObj as { track?: unknown }).track)) list = (resultObj as { track: MASearchItem[] }).track;
        else if (Array.isArray(result)) list = result as MASearchItem[];
        else if (Array.isArray(d.tracks)) list = d.tracks as MASearchItem[];
        else if (Array.isArray(d.items)) list = d.items as MASearchItem[];
        setAlbumTracks(list);
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : t("music.albumTracksLoadFailed");
        setError(msg);
        setAlbumTracks([]);
      })
      .finally(() => setAlbumTracksLoading(false));
  }, [selectedAlbum, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  // When selectedAlbum has no params but we got albumDetails from music/albums/get, load tracks via album_tracks
  useEffect(() => {
    if (
      !selectedAlbum ||
      !albumDetails ||
      getAlbumParams(selectedAlbum) ||
      !musicAssistant.enabled ||
      !musicAssistant.baseUrl
    ) {
      return;
    }
    const params = getAlbumParams(albumDetails);
    if (!params) return;
    setAlbumTracksLoading(true);
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/albums/album_tracks", {
      item_id: params.item_id,
      provider_instance_id_or_domain: params.provider_instance_id_or_domain,
    })
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const err = (d?.error as string) ?? (d?.message as string) ?? (typeof (d?.detail as string) === "string" ? (d.detail as string) : null);
        if (err) {
          setError(err);
          setAlbumTracks([]);
          return;
        }
        const result = d?.result ?? d;
        const resultObj = typeof result === "object" && result !== null ? (result as Record<string, unknown>) : {};
        let list: MASearchItem[] = [];
        if (Array.isArray(resultObj.tracks)) list = resultObj.tracks as MASearchItem[];
        else if (Array.isArray(resultObj.items)) list = resultObj.items as MASearchItem[];
        else if (Array.isArray((resultObj as { track?: unknown }).track)) list = (resultObj as { track: MASearchItem[] }).track;
        else if (Array.isArray(result)) list = result as MASearchItem[];
        else if (Array.isArray(d.tracks)) list = d.tracks as MASearchItem[];
        else if (Array.isArray(d.items)) list = d.items as MASearchItem[];
        setAlbumTracks(list);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : t("music.albumTracksLoadFailed"));
        setAlbumTracks([]);
      })
      .finally(() => setAlbumTracksLoading(false));
  }, [selectedAlbum, albumDetails, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  useEffect(() => {
    if (!selectedArtist || !musicAssistant.enabled || !musicAssistant.baseUrl) {
      setArtistAlbums([]);
      setArtistTracks([]);
      return;
    }
    const params = getArtistParams(selectedArtist);
    if (!params) {
      setArtistAlbums([]);
      setArtistTracks([]);
      return;
    }
    setArtistAlbumsLoading(true);
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/artists/artist_albums", {
      item_id: params.item_id,
      provider_instance_id_or_domain: params.provider_instance_id_or_domain,
    })
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const err = (d?.error as string) ?? (d?.message as string);
        if (err) return;
        const result = d?.result ?? d;
        const resultObj = typeof result === "object" && result !== null ? (result as Record<string, unknown>) : {};
        let list: MASearchItem[] = [];
        if (Array.isArray(resultObj.albums)) list = resultObj.albums as MASearchItem[];
        else if (Array.isArray(resultObj.items)) list = resultObj.items as MASearchItem[];
        else if (Array.isArray(result)) list = result as MASearchItem[];
        else if (Array.isArray(d.albums)) list = d.albums as MASearchItem[];
        else if (Array.isArray(d.items)) list = d.items as MASearchItem[];
        setArtistAlbums(list);
      })
      .catch(() => setArtistAlbums([]))
      .finally(() => setArtistAlbumsLoading(false));

    setArtistTracksLoading(true);
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/artists/artist_tracks", {
      item_id: params.item_id,
      provider_instance_id_or_domain: params.provider_instance_id_or_domain,
    })
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const err = (d?.error as string) ?? (d?.message as string);
        if (err) return;
        const result = d?.result ?? d;
        const resultObj = typeof result === "object" && result !== null ? (result as Record<string, unknown>) : {};
        let list: MASearchItem[] = [];
        if (Array.isArray(resultObj.tracks)) list = resultObj.tracks as MASearchItem[];
        else if (Array.isArray(resultObj.items)) list = resultObj.items as MASearchItem[];
        else if (Array.isArray(result)) list = result as MASearchItem[];
        else if (Array.isArray(d.tracks)) list = d.tracks as MASearchItem[];
        else if (Array.isArray(d.items)) list = d.items as MASearchItem[];
        setArtistTracks(list);
      })
      .catch(() => setArtistTracks([]))
      .finally(() => setArtistTracksLoading(false));
  }, [selectedArtist, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  useEffect(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl) {
      setFeaturedPlaylistData([]);
      setFeaturedPlaylistLoading(false);
      setRadioStations([]);
      setRadioStationsLoading(false);
      setLibraryPlaylists([]);
      setLibraryPlaylistsLoading(false);
      setLibraryArtists([]);
      setLibraryArtistsLoading(false);
      setLibraryAlbums([]);
      setLibraryAlbumsLoading(false);
      setRecentItems([]);
      setRecentLoading(false);
      return;
    }

    const featuredIds = musicAssistant.sectionFeaturedPlaylistEnabled
      ? (musicAssistant.featuredPlaylistIds ?? []).map((id) => String(id).trim()).filter(Boolean)
      : [];
    const cacheKey = [
      musicAssistant.baseUrl,
      featuredIds.join(","),
      musicAssistant.sectionRadioEnabled ? "radio" : "",
      musicAssistant.sectionRecentlyPlayedEnabled ? "recent" : "",
    ].join("|");
    const cached = musicHomeMemory && musicHomeMemory.key === cacheKey ? musicHomeMemory : null;
    if (cached) {
      setLibraryAlbums(cached.albums);
      setLibraryArtists(cached.artists);
      setLibraryPlaylists(cached.playlists);
      setRadioStations(cached.radios);
      setRecentItems(cached.recent);
      setFeaturedPlaylistData(cached.featured);
      setLibraryAlbumsLoading(false);
      setLibraryArtistsLoading(false);
      setLibraryPlaylistsLoading(false);
      setRadioStationsLoading(false);
      setRecentLoading(false);
      setFeaturedPlaylistLoading(false);
    } else {
      setLibraryAlbumsLoading(true);
      setLibraryArtistsLoading(true);
      setLibraryPlaylistsLoading(true);
      setRadioStationsLoading(musicAssistant.sectionRadioEnabled);
      setRecentLoading(musicAssistant.sectionRecentlyPlayedEnabled);
      setFeaturedPlaylistLoading(featuredIds.length > 0);
    }

    let cancelled = false;
    loadMusicHome(cacheKey, {
      baseUrl: musicAssistant.baseUrl,
      token: musicAssistant.token,
      featuredPlaylistIds: featuredIds,
      includeRadio: musicAssistant.sectionRadioEnabled,
      includeRecent: musicAssistant.sectionRecentlyPlayedEnabled,
    })
      .then((data) => {
        if (cancelled) return;
        if ("error" in data) {
          if (!cached) {
            setLibraryAlbums([]);
            setLibraryArtists([]);
            setLibraryPlaylists([]);
            setRadioStations([]);
            setRecentItems([]);
            setFeaturedPlaylistData([]);
          }
          return;
        }
        setLibraryAlbums(data.albums);
        setLibraryArtists(data.artists);
        setLibraryPlaylists(data.playlists);
        setRadioStations(data.radios);
        setRecentItems(data.recent);
        setFeaturedPlaylistData(data.featured);
      })
      .catch(() => {
        if (cancelled || cached) return;
        setLibraryAlbums([]);
        setLibraryArtists([]);
        setLibraryPlaylists([]);
        setRadioStations([]);
        setRecentItems([]);
        setFeaturedPlaylistData([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLibraryAlbumsLoading(false);
        setLibraryArtistsLoading(false);
        setLibraryPlaylistsLoading(false);
        setRadioStationsLoading(false);
        setRecentLoading(false);
        setFeaturedPlaylistLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    musicAssistant.enabled,
    musicAssistant.baseUrl,
    musicAssistant.token,
    musicAssistant.featuredPlaylistIds,
    musicAssistant.sectionFeaturedPlaylistEnabled,
    musicAssistant.sectionRadioEnabled,
    musicAssistant.sectionRecentlyPlayedEnabled,
  ]);

  const fetchRecentItems = useCallback(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl) return;
    setRecentLoading(true);
    function parseRecentResponse(data: unknown): MASearchItem[] {
      const err = (data as { error?: string })?.error;
      if (err) return [];
      const d = data as Record<string, unknown>;
      const result = d?.result ?? d;
      const resultObj = typeof result === "object" && result !== null ? (result as Record<string, unknown>) : {};
      if (Array.isArray(resultObj.tracks)) return resultObj.tracks as MASearchItem[];
      if (Array.isArray(resultObj.track)) return resultObj.track as MASearchItem[];
      if (Array.isArray(resultObj.items)) return resultObj.items as MASearchItem[];
      if (Array.isArray((resultObj as { recently_played?: MASearchItem[] }).recently_played)) return (resultObj as { recently_played: MASearchItem[] }).recently_played;
      if (Array.isArray((resultObj as { recent_items?: MASearchItem[] }).recent_items)) return (resultObj as { recent_items: MASearchItem[] }).recent_items;
      const dataItems = (resultObj as { data?: MASearchItem[] }).data;
      if (Array.isArray(dataItems)) return dataItems;
      if (Array.isArray(result)) return result as MASearchItem[];
      if (Array.isArray(d.tracks)) return d.tracks as MASearchItem[];
      if (Array.isArray((d as { items?: MASearchItem[] }).items)) return (d as { items: MASearchItem[] }).items;
      const nested = (d as { result?: { items?: MASearchItem[] } }).result?.items;
      if (Array.isArray(nested)) return nested;
      return [];
    }
    const baseUrl = musicAssistant.baseUrl;
    const token = musicAssistant.token;
    callMusicAssistant(baseUrl, token, "music/recently_played_items", {
      limit: 24,
      media_types: ["track", "album"],
      in_library_only: true,
    }, { skipCache: true })
      .then((data) => setRecentItems(parseRecentResponse(data)))
      .catch(() => setRecentItems([]))
      .finally(() => setRecentLoading(false));
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  useEffect(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl) return;
    if (!musicAssistant.sectionRecentlyPlayedEnabled) {
      setRecentItems([]);
      setRecentLoading(false);
      return;
    }
    const interval = setInterval(fetchRecentItems, 45000);
    return () => clearInterval(interval);
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.sectionRecentlyPlayedEnabled, fetchRecentItems]);

  // Refresh recently played when playback starts (e.g. from bar or another tab)
  const prevPlayingRef = useRef(false);
  useEffect(() => {
    const isPlaying = queueState?.state === "playing" || queueState?.state === "paused";
    if (isPlaying && !prevPlayingRef.current && musicAssistant.sectionRecentlyPlayedEnabled) {
      prevPlayingRef.current = true;
      const t = setTimeout(fetchRecentItems, 3000);
      return () => clearTimeout(t);
    }
    prevPlayingRef.current = isPlaying;
  }, [queueState?.state, musicAssistant.sectionRecentlyPlayedEnabled, fetchRecentItems]);

  const runSearch = useCallback(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl || !searchQuery.trim()) return;
    setSearching(true);
    setSearchResults([]);
    setError(null);
    const query = searchQuery.trim();
    const mediaType =
      searchFilter === "track"
        ? "track"
        : searchFilter === "artist"
          ? "artist"
          : searchFilter === "album"
            ? "album"
            : searchFilter === "radio"
              ? "radio"
              : undefined;
    const baseArgs = { search_query: query, limit: 24 };
    const argsWithFilter = mediaType ? { ...baseArgs, media_types: [mediaType] } : baseArgs;
    const argsList: Record<string, unknown>[] = [
      argsWithFilter,
      { query: query, limit: 24, ...(mediaType ? { media_types: [mediaType] } : {}) },
      { name: query, limit: 24 },
    ];
    const commands = ["music/search", "search"] as const;
    function getResultObj(data: unknown): Record<string, unknown> {
      const d = data as Record<string, unknown>;
      const result = d?.result ?? d;
      return typeof result === "object" && result !== null ? (result as Record<string, unknown>) : {};
    }
    function parseTracks(data: unknown): MASearchItem[] {
      const d = data as Record<string, unknown>;
      const resultObj = getResultObj(data);
      if (Array.isArray(resultObj.tracks)) return resultObj.tracks as MASearchItem[];
      if (Array.isArray(resultObj.track)) return resultObj.track as MASearchItem[];
      if (Array.isArray(d?.result)) return (d.result as MASearchItem[]);
      if (Array.isArray(d.tracks)) return d.tracks as MASearchItem[];
      if (Array.isArray((d as { data?: unknown }).data)) return (d as { data: MASearchItem[] }).data;
      const dataTracks = (d as { data?: { tracks?: MASearchItem[] } }).data?.tracks;
      if (Array.isArray(dataTracks)) return dataTracks;
      const albums = resultObj.albums as { tracks?: MASearchItem[] }[] | undefined;
      if (albums?.length) {
        const flat = albums.flatMap((a) => (a?.tracks && Array.isArray(a.tracks) ? a.tracks : []));
        if (flat.length) return flat as MASearchItem[];
      }
      return [];
    }
    function parseArtists(data: unknown): MASearchItem[] {
      const resultObj = getResultObj(data);
      if (Array.isArray(resultObj.artists)) return resultObj.artists as MASearchItem[];
      return [];
    }
    function parseAlbums(data: unknown): MASearchItem[] {
      const resultObj = getResultObj(data);
      if (Array.isArray(resultObj.albums)) return resultObj.albums as MASearchItem[];
      return [];
    }
    function parseRadios(data: unknown): MASearchItem[] {
      const d = data as Record<string, unknown>;
      const resultObj = getResultObj(data);
      if (Array.isArray(resultObj.radios)) return resultObj.radios as MASearchItem[];
      if (Array.isArray(resultObj.radio)) return resultObj.radio as MASearchItem[];
      if (Array.isArray(d.radios)) return d.radios as MASearchItem[];
      return [];
    }
    function collectResults(data: unknown): (MASearchItem & { __mediaType?: "track" | "artist" | "album" | "radio" })[] {
      if (searchFilter === "artist") return parseArtists(data).map((a) => ({ ...a, __mediaType: "artist" as const }));
      if (searchFilter === "album") return parseAlbums(data).map((a) => ({ ...a, __mediaType: "album" as const }));
      if (searchFilter === "track") return parseTracks(data).map((t) => ({ ...t, __mediaType: "track" as const }));
      if (searchFilter === "radio") return parseRadios(data).map((r) => ({ ...r, __mediaType: "radio" as const }));
      const tracks = parseTracks(data).map((t) => ({ ...t, __mediaType: "track" as const }));
      const artists = parseArtists(data).map((a) => ({ ...a, __mediaType: "artist" as const }));
      const albums = parseAlbums(data).map((a) => ({ ...a, __mediaType: "album" as const }));
      const radios = parseRadios(data).map((r) => ({ ...r, __mediaType: "radio" as const }));
      return [...tracks, ...artists, ...albums, ...radios];
    }
    const tryAttempt = (cmdIndex: number, argIndex: number): Promise<void> =>
      callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, commands[cmdIndex]!, argsList[argIndex]!).then(
        (data: unknown) => {
          const err = (data as { error?: string })?.error;
          if (err) {
            if (argIndex + 1 < argsList.length) return tryAttempt(cmdIndex, argIndex + 1);
            if (cmdIndex + 1 < commands.length) return tryAttempt(cmdIndex + 1, 0);
            setError(err);
            return;
          }
          const items = collectResults(data);
          setSearchResults(items);
        }
      );
    tryAttempt(0, 0).catch((err) => setError(err instanceof Error ? err.message : t("music.searchFailed"))).finally(() => setSearching(false));
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, searchQuery, searchFilter]);

  const playOnPlayer = useCallback(
    (uri: string) => {
      const trimmedUri = typeof uri === "string" ? uri.trim() : "";
      if (!trimmedUri || !selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) {
        if (!trimmedUri) setError(t("music.noTrackToPlay"));
        return;
      }
      setPlayPending(trimmedUri);
      const baseUrl = musicAssistant.baseUrl;
      const token = musicAssistant.token;
      const queueId = selectedQueueId;

      const tryPlayMedia = (args: Record<string, unknown>): Promise<void> =>
        callMusicAssistant(baseUrl, token, "player_queues/play_media", args).then((data: unknown) => {
          const e = (data as { error?: string })?.error;
          if (e) throw new Error(e);
        });

      const normalizedUri = normalizePlayMediaUri(trimmedUri);
      const attempts: Record<string, unknown>[] = [
        { queue_id: queueId, media: trimmedUri },
        { queue_id: queueId, media: [trimmedUri] },
        ...(normalizedUri !== trimmedUri ? [{ queue_id: queueId, media: normalizedUri }, { queue_id: queueId, media: [normalizedUri] }] : []),
        { queue_id: queueId, media: trimmedUri, option: "replace" },
        { queue_id: queueId, media: trimmedUri, option: "REPLACE" },
        { queue_id: queueId, media: { uri: trimmedUri } },
      ];
      let p: Promise<void> = tryPlayMedia(attempts[0]!);
      for (let i = 1; i < attempts.length; i++) {
        p = p.catch(() => tryPlayMedia(attempts[i]!));
      }
      p.then(() => fetchRecentItems())
        .catch((err) => {
          const msg = err instanceof Error ? err.message : t("music.playFailed");
          setError(msg);
        })
        .finally(() => setPlayPending(null));
    },
    [selectedQueueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, fetchRecentItems]
  );

  const addToFavorites = useCallback(
    (uri: string) => {
      const trimmed = typeof uri === "string" ? uri.trim() : "";
      if (!trimmed || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
      setFavoritePending((prev) => new Set(prev).add(trimmed));
      callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/favorites/add_item", { item: trimmed })
        .then((data: unknown) => {
          const err = (data as { error?: string })?.error;
          if (err) {
            setError(err);
            return;
          }
          setFavorited((prev) => new Set(prev).add(trimmed));
        })
        .catch((err) => setError(err instanceof Error ? err.message : t("music.favoriteFailed")))
        .finally(() => setFavoritePending((prev) => { const next = new Set(prev); next.delete(trimmed); return next; }));
    },
    [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, t]
  );

  const useMA = musicAssistant.enabled;
  const playerLabel = (p: MAPlayer) => (p.display_name as string) ?? p.queue_id ?? String(p.queue_id);

  const showPlayerBar = useMA && maPlayers.length > 0;

  const searchOverlay = searchOverlayOpen && typeof document !== "undefined" && createPortal(
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-page-light dark:bg-dark-page"
      role="dialog"
      aria-label={t("music.search")}
    >
      <div className="shrink-0 flex items-center gap-2 border-b border-gray-200 dark:border-white/10 bg-white/90 dark:bg-gray-900/95 backdrop-blur-md px-4 py-3">
        <Search className="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" aria-hidden />
        <input
          ref={searchInputRef}
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") runSearch();
            if (e.key === "Escape") setSearchOverlayOpen(false);
          }}
          placeholder={t("music.searchPlaceholder")}
          className="flex-1 min-w-0 rounded-xl border border-gray-200 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:border-accent-yellow dark:focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-yellow dark:focus:ring-accent-green"
          aria-label={t("music.search")}
        />
        <button
          type="button"
          onClick={runSearch}
          disabled={searching || !searchQuery.trim()}
          className="shrink-0 rounded-xl bg-accent-yellow dark:bg-accent-green px-4 py-2.5 text-sm font-medium text-gray-900 disabled:opacity-50"
        >
          {searching ? t("music.searching") : t("music.searchButton")}
        </button>
        <button
          type="button"
          onClick={() => setSearchOverlayOpen(false)}
          className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
          aria-label={t("music.close")}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="shrink-0 flex flex-wrap gap-1.5 px-4 py-2 border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-gray-900/50">
        {(["all", "track", "artist", "album", "radio"] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setSearchFilter(filter)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              searchFilter === filter
                ? "bg-accent-yellow dark:bg-accent-green text-gray-900"
                : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
            )}
          >
            {filter === "all"
              ? t("music.filterAll")
              : filter === "track"
                ? t("music.filterTrack")
                : filter === "artist"
                  ? t("music.filterArtist")
                  : filter === "album"
                    ? t("music.filterAlbum")
                    : t("music.filterRadio")}
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-0 overflow-auto px-4 py-4">
        {selectedQueueId && maPlayers.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-3">
            {t("music.playOn")}: <span className="font-medium text-gray-900 dark:text-white">{playerLabel(maPlayers.find((p) => p.queue_id === selectedQueueId) ?? { queue_id: selectedQueueId })}</span>
          </p>
        )}
        {searchResults.length > 0 ? (
          <ul className="space-y-1 max-w-2xl mx-auto" role="list">
            {searchResults.map((item, index) => {
              const rawUri = item.uri ?? (item as { item_uri?: string })?.item_uri;
              const itemId = item.item_id ?? (item as { item_id?: number | string })?.item_id;
              const provider = (item as { provider?: string })?.provider ?? "library";
              const itemMediaType = (item as { __mediaType?: "track" | "artist" | "album" | "radio" }).__mediaType;
              const mediaType =
                itemMediaType ??
                (searchFilter === "artist"
                  ? "artist"
                  : searchFilter === "album"
                    ? "album"
                    : searchFilter === "radio"
                      ? "radio"
                      : "track");
              const uri =
                typeof rawUri === "string" && rawUri
                  ? rawUri
                  : itemId != null
                    ? `${provider}://${mediaType}/${itemId}`
                    : "";
              const name = item.name ?? t("music.unknown");
              const artists = item.artists;
              const artistNames = Array.isArray(artists)
                ? artists.map((a) => (a && typeof a === "object" && "name" in a ? (a as { name?: string }).name : null)).filter(Boolean).join(", ") || "—"
                : artists && typeof artists === "object" && "name" in artists
                  ? (artists as { name?: string }).name
                  : "—";
              const albumName = item.album?.name;
              const duration = item.duration;
              const providerLabel = getProviderLabel(item);
              const isPlayPending = uri && playPending === uri;
              const canPlay = !!uri && !!selectedQueueId;
              const isAlbum = mediaType === "album";
              const isArtist = mediaType === "artist";
              const isRadio = mediaType === "radio";
              const canOpenAlbum = isAlbum && getAlbumParams(item);
              const canOpenArtist = isArtist && getArtistParams(item);
              const openAlbum = () => {
                if (canOpenAlbum) {
                  setSelectedAlbum(item);
                  setSearchOverlayOpen(false);
                }
              };
              const openArtist = () => {
                if (canOpenArtist) {
                  setSelectedArtist(item);
                  setSearchOverlayOpen(false);
                }
              };
              const canOpen = canOpenAlbum || canOpenArtist;
              const openAction = canOpenAlbum ? openAlbum : canOpenArtist ? openArtist : undefined;
              const openTitle = canOpenAlbum ? t("music.viewAlbum") : canOpenArtist ? t("music.viewArtist") : undefined;
              const lp = createTrackLongPressHandlers(item);
              return (
                <li
                  key={uri ?? `item-${index}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2.5 hover:bg-white dark:hover:bg-white/10"
                  onPointerDown={lp.onPointerDown}
                  onPointerUp={lp.onPointerUp}
                  onPointerLeave={lp.onPointerLeave}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800",
                      canOpen && "cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    )}
                    onClick={canOpen ? openAction : undefined}
                    onKeyDown={canOpen ? (e) => e.key === "Enter" && openAction?.() : undefined}
                    role={canOpen ? "button" : undefined}
                    tabIndex={canOpen ? 0 : undefined}
                    title={openTitle}
                  >
                    {isArtist ? (
                      <User className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden />
                    ) : isRadio ? (
                      <Radio className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden />
                    ) : (
                      <Disc3 className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden />
                    )}
                  </div>
                  <div
                    className={cn("min-w-0 flex-1", canOpen ? "cursor-pointer" : "cursor-default")}
                    onClick={canOpen ? openAction : undefined}
                    onKeyDown={canOpen ? (e) => e.key === "Enter" && openAction?.() : undefined}
                    role={canOpen ? "button" : undefined}
                    tabIndex={canOpen ? 0 : undefined}
                    title={openTitle}
                  >
                    <p className="truncate font-medium text-gray-900 dark:text-white">{name}</p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {artistNames}
                      {albumName ? ` · ${albumName}` : ""}
                      {providerLabel ? ` · ${providerLabel}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400 tabular-nums">
                    {formatDuration(duration)}
                  </span>
                  {uri && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); addToFavorites(uri); }}
                      disabled={favoritePending.has(uri)}
                      className={cn(
                        "shrink-0 rounded-full p-2 transition-colors",
                        favorited.has(uri) || favoritePending.has(uri)
                          ? "text-red-500 dark:text-red-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                      )}
                      title={t("music.addToFavorites")}
                      aria-label={t("music.addToFavorites")}
                    >
                      {favoritePending.has(uri) ? (
                        <span className="h-4 w-4 block animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
                      ) : (
                        <Heart className={cn("h-4 w-4", (favorited.has(uri) || favoritePending.has(uri)) && "fill-current")} aria-hidden />
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); lp.wrapClick(() => canPlay && playOnPlayer(normalizePlayMediaUri(uri)))(); }}
                    disabled={!canPlay || !!isPlayPending}
                    className="shrink-0 rounded-full bg-accent-yellow p-2 text-gray-900 hover:opacity-90 disabled:opacity-50 dark:bg-accent-green dark:text-gray-900"
                    title={`${t("music.playOn")} ${selectedQueueId ? playerLabel(maPlayers.find((x) => x.queue_id === selectedQueueId) ?? { queue_id: selectedQueueId }) : t("music.player")}`}
                  >
                    {isPlayPending ? (
                      <span className="h-4 w-4 block animate-spin rounded-full border-2 border-gray-900 border-t-transparent dark:border-gray-900 dark:border-t-transparent" aria-hidden />
                    ) : (
                      <Play className="h-4 w-4 fill-current" aria-hidden />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : searchQuery.trim() && !searching ? (
          <div className="flex items-center gap-3 py-8 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            <User className="h-10 w-10 shrink-0" aria-hidden />
            <p className="text-sm">{t("music.noResults")} &quot;{searchQuery.trim()}&quot;. {t("music.noResultsTry")}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto py-8">
            {t("music.searchHint")}
          </p>
        )}
      </div>
    </div>,
    document.body
  );

  const allowSpeakerSelection = musicAssistant.allowSpeakerSelection;
  const isMusicHome = !selectedMenu && !selectedCategory && !selectedArtist && !selectedAlbum;
  const headerOverHero = false;

  const homeGreeting =
    heroHourSeed < 12
      ? t("music.greetingMorning")
      : heroHourSeed < 18
        ? t("music.greetingAfternoon")
        : t("music.greetingEvening");

  const homeDiscovery = useMemo(() => {
    if (!useMA) return null;
    const canPlay = !!selectedQueueId;
    const imageSrcFor = (item: MASearchItem) =>
      getImageSrc(getItemImageUrl(item), musicAssistant.baseUrl, musicAssistant.token);
    const unknown = t("music.unknown");

    const toTile = (
      item: MASearchItem,
      index: number,
      prefix: string,
      kind?: ReturnType<typeof detectPlayableType>
    ): MusicHomeTile => {
      const mediaType = kind ?? detectPlayableType(item);
      const albumParams = mediaType === "album" ? getAlbumParams(item) : null;
      const artistParams = mediaType === "artist" ? getArtistParams(item) : null;
      const uri = getPlayableUri(item, mediaType);
      const subtitle =
        mediaType === "playlist"
          ? t("music.playlist")
          : mediaType === "radio"
            ? t("music.filterRadio")
            : getArtistsString(item) || undefined;
      return {
        key: String(item.uri ?? item.item_id ?? `${prefix}-${index}`),
        title: item.name ?? unknown,
        subtitle,
        imageSrc: imageSrcFor(item),
        disabled: albumParams || artistParams ? false : !canPlay || !uri,
        onClick: () => {
          if (albumParams) {
            setSelectedAlbum(item);
            setSelectedMenu(null);
            setSelectedCategory(null);
            return;
          }
          if (artistParams) {
            setSelectedArtist(item);
            setSelectedMenu("artists");
            setSelectedCategory(null);
            return;
          }
          if (canPlay && uri) playOnPlayer(normalizePlayMediaUri(uri));
        },
      };
    };

    const jumpBackIn = musicAssistant.sectionRecentlyPlayedEnabled
      ? recentItems.slice(0, 6).map((item, i) => toTile(item, i, "jump"))
      : [];

    const featuredPlaylists = featuredPlaylistData
      .map((d) => d.playlist)
      .filter((p): p is MASearchItem => !!p);

    const itemKey = (item: MASearchItem, prefix: string, index: number) =>
      String(item.uri ?? item.item_id ?? `${prefix}-${index}`);

    const spotlightPool: { item: MASearchItem; kicker: string; key: string }[] = [];
    const seenSpotlights = new Set<string>();
    const addSpotlight = (item: MASearchItem, kicker: string, prefix: string, index: number) => {
      const key = itemKey(item, prefix, index);
      if (!key || seenSpotlights.has(key) || !imageSrcFor(item)) return;
      seenSpotlights.add(key);
      spotlightPool.push({ item, kicker, key: `${prefix}-${key}` });
    };

    const sources = musicAssistant.heroSliderSources;
    const sourceEnabled = (id: (typeof sources)[number]) => sources.length === 0 || sources.includes(id);

    if (sourceEnabled("libraryAlbums")) {
      libraryAlbums.forEach((item, i) => addSpotlight(item, t("music.yourAlbums"), "album", i));
    }
    if (sourceEnabled("recentlyPlayed") && musicAssistant.sectionRecentlyPlayedEnabled) {
      recentItems.forEach((item, i) => {
        if (detectPlayableType(item) === "album") {
          addSpotlight(item, t("music.recentlyPlayed"), "recent", i);
        }
      });
    }
    if (sourceEnabled("featuredPlaylist") && musicAssistant.sectionFeaturedPlaylistEnabled) {
      featuredPlaylists.forEach((item, i) => addSpotlight(item, t("music.featured"), "featured", i));
    }

    if (spotlightPool.length === 0) {
      libraryAlbums.forEach((item, i) => addSpotlight(item, t("music.listenNow"), "album", i));
      recentItems.forEach((item, i) => addSpotlight(item, t("music.listenNow"), "recent", i));
    }

    const spotlights: MusicHomeSpotlight[] = shuffleSeeded(spotlightPool, spotlightSeedRef.current)
      .slice(0, 32)
      .map(({ item, kicker, key }) => {
      const kind = detectPlayableType(item);
      return {
        key,
        kicker,
        title: item.name ?? unknown,
        subtitle: getArtistsString(item) || undefined,
        imageSrc: imageSrcFor(item),
        disabled: !canPlay,
        onPlay: () => {
          const uri = getPlayableUri(item, kind === "playlist" ? "playlist" : kind === "album" ? "album" : kind);
          if (uri) playOnPlayer(normalizePlayMediaUri(uri));
        },
        onOpen:
          kind === "album"
            ? () => {
                setSelectedAlbum(item);
                setSelectedMenu(null);
                setSelectedCategory(null);
              }
            : kind === "artist"
              ? () => {
                  setSelectedArtist(item);
                  setSelectedMenu("artists");
                  setSelectedCategory(null);
                }
              : undefined,
      };
    });

    const featuredIds = new Set(
      featuredPlaylists.map((p) => String(p.uri ?? p.item_id ?? "")).filter(Boolean)
    );

    const shelves: MusicHomeShelf[] = [];

    if (musicAssistant.sectionFeaturedPlaylistEnabled) {
      shelves.push({
        id: "featured",
        title: t("music.featured"),
        variant: "square",
        loading: featuredPlaylistLoading,
        items: featuredPlaylists.map((p, i) => toTile(p, i, "featured", "playlist")),
        onSeeAll: () => {
          setSelectedMenu("playlists");
          setSelectedCategory(null);
        },
      });
      for (const { id, playlist, tracks } of featuredPlaylistData) {
        if (!playlist || tracks.length === 0) continue;
        shelves.push({
          id: `featured-tracks-${id}`,
          title: playlist.name ?? t("music.playlist"),
          variant: "square",
          items: tracks.slice(0, 16).map((item, i) => toTile(item, i, `ft-${id}`)),
        });
      }
    }

    shelves.push({
      id: "albums",
      title: t("music.yourAlbums"),
      variant: "square",
      loading: libraryAlbumsLoading,
      items: libraryAlbums.slice(0, 16).map((item, i) => toTile(item, i, "album", "album")),
      onSeeAll: () => {
        setSelectedMenu("albums");
        setSelectedCategory(null);
      },
    });

    shelves.push({
      id: "artists",
      title: t("music.yourArtists"),
      variant: "circle",
      loading: libraryArtistsLoading,
      items: libraryArtists.slice(0, 16).map((item, i) => toTile(item, i, "artist", "artist")),
      onSeeAll: () => {
        setSelectedMenu("artists");
        setSelectedCategory(null);
      },
    });

    if (musicAssistant.sectionRadioEnabled) {
      shelves.push({
        id: "radio",
        title: t("music.radioStations"),
        variant: "station",
        loading: radioStationsLoading,
        items: radioStations.slice(0, 16).map((item, i) => toTile(item, i, "radio", "radio")),
        onSeeAll: () => setSelectedCategory("radio"),
      });
    }

    const libraryPlaylistTiles = libraryPlaylists
      .filter((p) => !featuredIds.has(String(p.uri ?? p.item_id ?? "")))
      .slice(0, 16)
      .map((item, i) => toTile(item, i, "playlist", "playlist"));

    shelves.push({
      id: "playlists",
      title: t("music.yourPlaylists"),
      variant: "square",
      loading: libraryPlaylistsLoading,
      items: libraryPlaylistTiles,
      onSeeAll: () => {
        setSelectedMenu("playlists");
        setSelectedCategory(null);
      },
    });

    const loading =
      (musicAssistant.sectionRecentlyPlayedEnabled && recentLoading) ||
      featuredPlaylistLoading ||
      libraryAlbumsLoading ||
      libraryArtistsLoading ||
      libraryPlaylistsLoading ||
      (musicAssistant.sectionRadioEnabled && radioStationsLoading);

    return { jumpBackIn, spotlights, shelves, loading };
  }, [
    useMA,
    selectedQueueId,
    musicAssistant.baseUrl,
    musicAssistant.token,
    musicAssistant.sectionRecentlyPlayedEnabled,
    musicAssistant.sectionFeaturedPlaylistEnabled,
    musicAssistant.sectionRadioEnabled,
    musicAssistant.heroSliderSources,
    recentItems,
    recentLoading,
    featuredPlaylistData,
    featuredPlaylistLoading,
    libraryAlbums,
    libraryAlbumsLoading,
    libraryArtists,
    libraryArtistsLoading,
    libraryPlaylists,
    libraryPlaylistsLoading,
    radioStations,
    radioStationsLoading,
    playOnPlayer,
    t,
  ]);

  return (
    <AppShell
      activeTab="/music"
      contentNoScroll
      headerFixed
      headerContentLight={headerOverHero}
      headerEndAction={
        useMA ? (
          <button
            type="button"
            onClick={() => setSearchOverlayOpen(true)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
              headerOverHero
                ? "text-white/90 hover:bg-white/10"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
            )}
            aria-label={t("music.search")}
          >
            <Search className="h-5 w-5" />
          </button>
        ) : undefined
      }
      headerCenterAction={
        <div
          className={cn(
            "flex items-center gap-0.5 rounded-full p-0.5 backdrop-blur-md",
            headerOverHero ? "bg-white/15" : "bg-black/5 dark:bg-white/10"
          )}
          role="navigation"
          aria-label={t("music.title")}
        >
          {(
            [
              { id: "home" as const, label: t("music.menuHome"), icon: Home },
              { id: "artists" as const, label: t("music.menuArtists"), icon: User },
              { id: "albums" as const, label: t("music.menuAlbums"), icon: Disc3 },
              { id: "playlists" as const, label: t("music.menuPlaylists"), icon: ListMusic },
            ] as const
          ).map(({ id, label, icon: Icon }) => {
            const active = id === "home" ? !selectedMenu && !selectedCategory : selectedMenu === id;
            const light = headerOverHero;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSelectedArtist(null);
                  setSelectedAlbum(null);
                  setSelectedCategory(null);
                  if (id === "home") {
                    setSelectedMenu(null);
                  } else {
                    setSelectedMenu(id);
                  }
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3",
                  light
                    ? active
                      ? "bg-white/25 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                    : active
                      ? "bg-white text-gray-900 shadow-sm dark:bg-white/15 dark:text-white"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                )}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                title={label}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </div>
      }
    >
      {searchOverlay}
      {addToPlaylistTrack && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70"
          role="dialog"
          aria-label={t("music.addToPlaylist")}
          onClick={() => setAddToPlaylistTrack(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("music.addToPlaylist")}</h3>
              <button
                type="button"
                onClick={() => setAddToPlaylistTrack(null)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
                aria-label={t("music.close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 truncate">
              {addToPlaylistTrack.name ?? t("music.unknown")}
            </p>
            {addToPlaylistError && (
              <p className="px-4 py-2 text-sm text-red-600 dark:text-red-400" role="alert">{addToPlaylistError}</p>
            )}
            <div className="max-h-64 overflow-y-auto py-2">
              {addToPlaylistLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
                </div>
              ) : addToPlaylistPlaylists.length === 0 ? (
                <p className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{t("music.noPlaylists")}</p>
              ) : (
                <ul className="space-y-0">
                  {addToPlaylistPlaylists.map((pl) => {
                    const plId = (pl as { db_id?: string }).db_id ?? (pl as { item_id?: string }).item_id ?? pl.uri ?? "";
                    const isPending = addToPlaylistPending === plId;
                    return (
                      <li key={plId || pl.name}>
                        <button
                          type="button"
                          onClick={() => handleAddTrackToPlaylist(pl)}
                          disabled={!!addToPlaylistPending}
                          className="w-full px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-50 flex items-center gap-2"
                        >
                          {isPending ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
                          ) : (
                            <ListPlus className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
                          )}
                          {pl.name ?? t("music.unknown")}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
      <div className={cn("music-page-content w-full max-w-full flex flex-col h-full min-h-0 relative", "bg-page-light dark:bg-dark-page", showPlayerBar && playerBarExpanded && "pb-24")}>
        <div className="flex flex-1 min-h-0 min-w-0">
          <div
            ref={musicScrollRef}
            className={cn(
              "flex-1 min-w-0 min-h-0 overflow-x-hidden overflow-y-auto music-content-area",
              isMusicHome ? "overflow-x-visible text-gray-900 dark:text-white" : "overflow-x-hidden text-gray-900 dark:text-white"
            )}
          >
        <div className="flex flex-wrap items-center justify-end gap-4 pb-2">
          <OfflinePill />
        </div>
        <div className="h-14 shrink-0" aria-hidden />
        {error && (
          <div
            className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-800 dark:text-red-200"
            role="alert"
          >
            {error}
          </div>
        )}

        {selectedAlbum ? (
          (() => {
            const album = albumDetails ?? selectedAlbum;
            const albumImageSrc = getImageSrc(getItemImageUrl(album), musicAssistant.baseUrl, musicAssistant.token);
            const albumUri = getPlayableUri(selectedAlbum, "album");
            const artistStr = album.artists
              ? Array.isArray(album.artists)
                ? (album.artists as { name?: string }[]).map((a) => a?.name).filter(Boolean).join(", ")
                : (album.artists as { name?: string })?.name ?? "—"
              : "—";
            const isFav = albumUri && (favorited.has(albumUri) || favoritePending.has(albumUri));
            return (
              <div className="space-y-4 pb-8">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAlbum(null);
                    setAlbumDetails(null);
                    setAlbumTracks([]);
                    setError(null);
                    setSelectedMenu("albums");
                    setSelectedCategory(null);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-black/[0.04] px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-black/[0.07] dark:bg-white/8 dark:text-white dark:hover:bg-white/12"
                  aria-label={t("music.back")}
                >
                  <ArrowLeft className="h-4 w-4 shrink-0" />
                  {t("music.back")}
                </button>
                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)]">
                  <section className="min-w-0 order-2 lg:order-1">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-white/45">
                      {t("music.albumTracks")}
                    </h3>
                    {albumTracksLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
                      </div>
                    ) : albumTracks.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 py-4">{t("music.noAlbumTracks")}</p>
                    ) : (
                      <ul className="space-y-1" role="list">
                        {albumTracks.map((item, index) => {
                          const uri = getPlayableUri(item, "track");
                          const name = item.name ?? t("music.unknown");
                          const duration = (item as { duration?: number }).duration;
                          const isPlayPending = uri && playPending === uri;
                          const canPlay = !!uri && !!selectedQueueId;
                          const lp = createTrackLongPressHandlers(item);
                          return (
                            <li
                              key={uri ?? `album-track-${index}`}
                              className="flex items-center gap-3 rounded-2xl bg-black/[0.03] px-3 py-2.5 hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/10"
                              onPointerDown={lp.onPointerDown}
                              onPointerUp={lp.onPointerUp}
                              onPointerLeave={lp.onPointerLeave}
                            >
                              <span className="w-8 tabular-nums text-sm text-gray-400">{index + 1}</span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-gray-900 dark:text-white">{name}</p>
                              </div>
                              <span className="shrink-0 tabular-nums text-xs text-gray-400">{formatDuration(duration)}</span>
                              {uri && (
                                <button
                                  type="button"
                                  onClick={(e) => { e.preventDefault(); addToFavorites(uri); }}
                                  disabled={favoritePending.has(uri)}
                                  className={cn(
                                    "shrink-0 rounded-full p-2 transition-colors",
                                    favorited.has(uri) || favoritePending.has(uri)
                                      ? "text-red-500 dark:text-red-400"
                                      : "text-gray-400 hover:text-red-500"
                                  )}
                                  title={t("music.addToFavorites")}
                                  aria-label={t("music.addToFavorites")}
                                >
                                  {favoritePending.has(uri) ? (
                                    <span className="h-4 w-4 block animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
                                  ) : (
                                    <Heart className={cn("h-4 w-4", (favorited.has(uri) || favoritePending.has(uri)) && "fill-current")} aria-hidden />
                                  )}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={lp.wrapClick(() => canPlay && uri && playOnPlayer(normalizePlayMediaUri(uri)))}
                                disabled={!canPlay || !!isPlayPending}
                                className="shrink-0 rounded-full bg-brand p-2 text-white hover:opacity-90 disabled:opacity-50"
                                aria-label={t("music.playOn")}
                              >
                                {isPlayPending ? (
                                  <span className="h-4 w-4 block animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
                                ) : (
                                  <Play className="h-4 w-4 fill-current ml-0.5" aria-hidden />
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </section>
                  <aside className="order-1 lg:order-2 lg:sticky lg:top-20">
                    <div className="relative mx-auto aspect-square w-full max-w-[22rem] overflow-hidden rounded-3xl bg-black/[0.04] shadow-lg dark:bg-white/8">
                      {albumImageSrc ? (
                        <Image src={albumImageSrc} alt="" fill className="object-cover" sizes="352px" placeholder="blur" blurDataURL={MUSIC_IMAGE_BLUR} unoptimized priority />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Disc3 className="h-16 w-16 text-gray-400" aria-hidden />
                        </div>
                      )}
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      {album.name ?? t("music.unknown")}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-white/60">{artistStr}</p>
                    {albumTracks.length > 0 ? (
                      <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-gray-400 dark:text-white/45">
                        {albumTracks.length} {albumTracks.length === 1 ? t("music.trackCountOne") : t("music.trackCountMany")}
                      </p>
                    ) : null}
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => albumUri && selectedQueueId && playOnPlayer(normalizePlayMediaUri(albumUri))}
                        disabled={!albumUri || !selectedQueueId}
                        className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50"
                        aria-label={t("music.play")}
                      >
                        <Play className="h-4 w-4 fill-current ml-0.5" />
                        {t("music.play")}
                      </button>
                      {albumUri ? (
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); addToFavorites(albumUri); }}
                          disabled={favoritePending.has(albumUri)}
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full bg-black/[0.04] dark:bg-white/8",
                            isFav ? "text-red-500" : "text-gray-500 hover:text-red-500"
                          )}
                          title={t("music.addToFavorites")}
                          aria-label={t("music.addToFavorites")}
                        >
                          {favoritePending.has(albumUri) ? (
                            <span className="h-4 w-4 block animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
                          ) : (
                            <Heart className={cn("h-5 w-5", isFav && "fill-current")} aria-hidden />
                          )}
                        </button>
                      ) : null}
                    </div>
                  </aside>
                </div>
              </div>
            );
          })()
        ) : selectedArtist ? (
          (() => {
            const artistImageSrc = getImageSrc(getItemImageUrl(selectedArtist), musicAssistant.baseUrl, musicAssistant.token);
            const artistUri = getPlayableUri(selectedArtist, "artist");
            return (
              <div className="space-y-4 pb-8">
                <button
                  type="button"
                  onClick={() => { setSelectedArtist(null); setArtistAlbums([]); setArtistTracks([]); setError(null); setSelectedMenu("artists"); setSelectedCategory(null); }}
                  className="inline-flex items-center gap-2 rounded-full bg-black/[0.04] px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-black/[0.07] dark:bg-white/8 dark:text-white dark:hover:bg-white/12"
                  aria-label={t("music.back")}
                >
                  <ArrowLeft className="h-4 w-4 shrink-0" />
                  {t("music.back")}
                </button>
                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)]">
                  <div className="min-w-0 order-2 lg:order-1 space-y-8">
                    <section>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-white/45">
                        {t("music.albums")}
                      </h3>
                      {artistAlbumsLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
                        </div>
                      ) : artistAlbums.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 py-4">{t("music.noAlbums")}</p>
                      ) : (
                        <div className="music-h-scroll flex gap-4 overflow-x-auto overflow-y-hidden pb-2 pr-4 scroll-smooth snap-x snap-proximity scrollbar-hide overscroll-x-contain touch-pan-x">
                          {artistAlbums.map((item, index) => {
                            const albumUri = getPlayableUri(item, "album");
                            const imageSrc = getImageSrc(getItemImageUrl(item), musicAssistant.baseUrl, musicAssistant.token);
                            const handleClick = () => {
                              setSelectedAlbum(item);
                              setAlbumDetails(null);
                              setAlbumTracks([]);
                            };
                            return (
                              <button
                                key={albumUri ?? `artist-album-${index}`}
                                type="button"
                                onClick={handleClick}
                                className="w-28 shrink-0 snap-start text-left sm:w-32"
                                title={item.name as string}
                              >
                                <span className="relative block aspect-square overflow-hidden rounded-2xl bg-black/[0.04] dark:bg-white/8">
                                  {imageSrc ? (
                                    <Image src={imageSrc} alt="" fill className="object-cover" sizes="128px" placeholder="blur" blurDataURL={MUSIC_IMAGE_BLUR} unoptimized />
                                  ) : (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                      <Disc3 className="h-10 w-10 text-gray-400" aria-hidden />
                                    </span>
                                  )}
                                </span>
                                <span className="mt-1.5 block truncate text-xs font-medium text-gray-800 dark:text-white">
                                  {item.name ?? t("music.unknown")}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </section>
                    <section>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-white/45">
                        {t("music.artistTracks")}
                      </h3>
                      {artistTracksLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
                        </div>
                      ) : artistTracks.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 py-4">{t("music.noTracks")}</p>
                      ) : (
                        <ul className="space-y-1" role="list">
                          {artistTracks.map((item, index) => {
                            const uri = getPlayableUri(item, "track");
                            const name = item.name ?? t("music.unknown");
                            const duration = (item as { duration?: number }).duration;
                            const isPlayPending = uri && playPending === uri;
                            const canPlay = !!uri && !!selectedQueueId;
                            const lp = createTrackLongPressHandlers(item);
                            return (
                              <li
                                key={uri ?? `artist-track-${index}`}
                                className="flex items-center gap-3 rounded-2xl bg-black/[0.03] px-3 py-2.5 hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/10"
                                onPointerDown={lp.onPointerDown}
                                onPointerUp={lp.onPointerUp}
                                onPointerLeave={lp.onPointerLeave}
                              >
                                <span className="w-8 tabular-nums text-sm text-gray-400">{index + 1}</span>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-medium text-gray-900 dark:text-white">{name}</p>
                                </div>
                                <span className="shrink-0 tabular-nums text-xs text-gray-400">{formatDuration(duration)}</span>
                                {uri && (
                                  <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); addToFavorites(uri); }}
                                    disabled={favoritePending.has(uri)}
                                    className={cn(
                                      "shrink-0 rounded-full p-2 transition-colors",
                                      favorited.has(uri) || favoritePending.has(uri)
                                        ? "text-red-500 dark:text-red-400"
                                        : "text-gray-400 hover:text-red-500"
                                    )}
                                    title={t("music.addToFavorites")}
                                    aria-label={t("music.addToFavorites")}
                                  >
                                    {favoritePending.has(uri) ? (
                                      <span className="h-4 w-4 block animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
                                    ) : (
                                      <Heart className={cn("h-4 w-4", (favorited.has(uri) || favoritePending.has(uri)) && "fill-current")} aria-hidden />
                                    )}
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={lp.wrapClick(() => canPlay && uri && playOnPlayer(normalizePlayMediaUri(uri)))}
                                  disabled={!canPlay || !!isPlayPending}
                                  className="shrink-0 rounded-full bg-brand p-2 text-white hover:opacity-90 disabled:opacity-50"
                                  aria-label={t("music.playOn")}
                                >
                                  {isPlayPending ? (
                                    <span className="h-4 w-4 block animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
                                  ) : (
                                    <Play className="h-4 w-4 fill-current ml-0.5" aria-hidden />
                                  )}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </section>
                  </div>
                  <aside className="order-1 lg:order-2 lg:sticky lg:top-20">
                    <div className="relative mx-auto aspect-square w-full max-w-[22rem] overflow-hidden rounded-3xl bg-black/[0.04] shadow-lg dark:bg-white/8">
                      {artistImageSrc ? (
                        <Image src={artistImageSrc} alt="" fill className="object-cover" sizes="352px" placeholder="blur" blurDataURL={MUSIC_IMAGE_BLUR} unoptimized priority />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <User className="h-16 w-16 text-gray-400" aria-hidden />
                        </div>
                      )}
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      {(selectedArtist as MASearchItem).name ?? t("music.unknown")}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-white/60">{t("music.artistAlbums")}</p>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => artistUri && selectedQueueId && playOnPlayer(normalizePlayMediaUri(artistUri))}
                        disabled={!artistUri || !selectedQueueId}
                        className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50"
                        aria-label={t("music.play")}
                      >
                        <Play className="h-4 w-4 fill-current ml-0.5" />
                        {t("music.play")}
                      </button>
                    </div>
                  </aside>
                </div>
              </div>
            );
          })()
        ) : selectedMenu === "artists" && !selectedCategory ? (
          <div className="space-y-6">
            <div className="relative flex items-center justify-center w-full min-h-[2rem]">
              <button
                type="button"
                onClick={() => setSelectedMenu(null)}
                className="absolute left-0 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white/90 hover:text-gray-800 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("music.back")}
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">{t("music.menuArtists")}</h2>
            </div>
            {libraryArtistsLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
              </div>
            ) : libraryArtists.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("music.artistsHint")}</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {libraryArtists.map((item, index) => {
                  const imageSrc = getImageSrc(getItemImageUrl(item), musicAssistant.baseUrl, musicAssistant.token);
                  const artistParams = getArtistParams(item);
                  const handleClick = () => {
                    if (artistParams) setSelectedArtist(item);
                  };
                  return (
                    <button
                      key={item.uri ?? item.item_id ?? `artist-${index}`}
                      type="button"
                      onClick={handleClick}
                      disabled={!artistParams}
                      className="rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent-yellow dark:focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-[var(--page-bg)] disabled:opacity-50 text-left"
                    >
                      <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-xl overflow-hidden relative bg-gray-200 dark:bg-gray-700">
                        {imageSrc ? (
                          <Image src={imageSrc} alt="" fill className="object-cover rounded-full" sizes="128px" placeholder="blur" blurDataURL={MUSIC_IMAGE_BLUR} unoptimized />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <User className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <p className="mt-1.5 truncate text-sm font-medium text-gray-900 dark:text-white text-center">{item.name ?? t("music.unknown")}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : selectedMenu === "albums" && !selectedCategory ? (
          <div className="space-y-6">
            <div className="relative flex items-center justify-center w-full min-h-[2rem]">
              <button
                type="button"
                onClick={() => setSelectedMenu(null)}
                className="absolute left-0 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white/90 hover:text-gray-800 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("music.back")}
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">{t("music.menuAlbums")}</h2>
            </div>
            {libraryAlbumsLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
              </div>
            ) : libraryAlbums.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("music.noAlbums")}</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {libraryAlbums.map((item, index) => {
                  const albumUri = getPlayableUri(item, "album");
                  const imageSrc = getImageSrc(getItemImageUrl(item), musicAssistant.baseUrl, musicAssistant.token);
                  const albumParams = getAlbumParams(item);
                  const canPlay = !!albumUri && !!selectedQueueId;
                  const handleClick = () => {
                    if (albumParams) setSelectedAlbum(item);
                    else if (canPlay && albumUri) playOnPlayer(normalizePlayMediaUri(albumUri));
                  };
                  return (
                    <button
                      key={albumUri ?? `lib-album-${index}`}
                      type="button"
                      onClick={handleClick}
                      disabled={!albumParams && !canPlay}
                      className="rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent-yellow dark:focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-[var(--page-bg)] disabled:opacity-50 text-left"
                    >
                      <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-xl overflow-hidden relative bg-gray-200 dark:bg-gray-700">
                        {imageSrc ? (
                          <Image src={imageSrc} alt="" fill className="object-cover" sizes="128px" placeholder="blur" blurDataURL={MUSIC_IMAGE_BLUR} unoptimized />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Disc3 className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <p className="mt-1.5 truncate text-sm font-medium text-gray-900 dark:text-white text-center">{item.name ?? t("music.unknown")}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : selectedMenu === "playlists" && !selectedCategory ? (
          <div className="space-y-6">
            <div className="relative flex items-center justify-center w-full min-h-[2rem]">
              <button
                type="button"
                onClick={() => setSelectedMenu(null)}
                className="absolute left-0 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white/90 hover:text-gray-800 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("music.back")}
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">{t("music.menuPlaylists")}</h2>
            </div>
            {libraryPlaylistsLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
              </div>
            ) : libraryPlaylists.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("music.noPlaylists")}</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {libraryPlaylists.map((item, index) => {
                  const playlistUri = getPlayableUri(item, "playlist");
                  const imageSrc = getImageSrc(getItemImageUrl(item), musicAssistant.baseUrl, musicAssistant.token);
                  const canPlay = !!playlistUri && !!selectedQueueId;
                  const handleClick = () => {
                    if (canPlay && playlistUri) playOnPlayer(normalizePlayMediaUri(playlistUri));
                  };
                  return (
                    <button
                      key={playlistUri || `playlist-${index}`}
                      type="button"
                      onClick={handleClick}
                      disabled={!canPlay}
                      className="rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent-yellow dark:focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-[var(--page-bg)] disabled:opacity-50 text-left"
                    >
                      <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-xl overflow-hidden relative bg-gray-200 dark:bg-gray-700">
                        {imageSrc ? (
                          <Image src={imageSrc} alt="" fill className="object-cover" sizes="128px" placeholder="blur" blurDataURL={MUSIC_IMAGE_BLUR} unoptimized />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ListMusic className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <p className="mt-1.5 truncate text-sm font-medium text-gray-900 dark:text-white text-center">{item.name ?? t("music.unknown")}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : selectedCategory ? (
          <div className="space-y-6">
            <div className="relative flex items-center justify-center w-full min-h-[2rem]">
              <button
                type="button"
                onClick={() => { setSelectedCategory(null); setSelectedMenu(null); }}
                className="absolute left-0 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white/90 hover:text-gray-800 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("music.back")}
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                {selectedCategory === "radio" ? t("music.radioStations") : t("music.recentlyPlayed")}
              </h2>
            </div>
            {selectedCategory === "recentlyPlayed" && (recentLoading || recentItems.length > 0) && (
              recentLoading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {recentItems.map((item, index) => {
                    const uri = getPlayableUri(item, "track");
                    const albumUri = getPlayableUri(item, "album");
                    const imageSrc = getImageSrc(getItemImageUrl(item), musicAssistant.baseUrl, musicAssistant.token);
                    const canPlay = !!(uri || albumUri) && !!selectedQueueId;
                    const isAlbum = isAlbumItem(item);
                    const albumParams = isAlbum ? getAlbumParams(item) : null;
                    const lp = createTrackLongPressHandlers(item);
                    const handleClick = lp.wrapClick(() => {
                      if (albumParams) setSelectedAlbum(item);
                      else if (canPlay && uri) playOnPlayer(uri);
                      else if (canPlay && albumUri) playOnPlayer(albumUri);
                    });
                    return (
                      <button
                        key={uri || albumUri || `recent-${index}`}
                        type="button"
                        onPointerDown={lp.onPointerDown}
                        onPointerUp={lp.onPointerUp}
                        onPointerLeave={lp.onPointerLeave}
                        onClick={handleClick}
                        disabled={!albumParams && !canPlay}
                        className="rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent-yellow dark:focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-[var(--page-bg)] disabled:opacity-50 text-left"
                      >
                        <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-xl overflow-hidden relative bg-gray-200 dark:bg-gray-700">
                          {imageSrc ? (
                            <Image src={imageSrc} alt="" fill className="object-cover" sizes="128px" placeholder="blur" blurDataURL={MUSIC_IMAGE_BLUR} unoptimized priority={index < 6} />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Disc3 className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                        </div>
                        <p className="mt-1.5 truncate text-sm font-medium text-gray-900 dark:text-white text-center">{item.name ?? t("music.unknown")}</p>
                      </button>
                    );
                  })}
                </div>
              )
            )}
            {selectedCategory === "radio" && (radioStationsLoading || radioStations.length > 0) && (
              radioStationsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {radioStations.map((item, index) => {
                    const radioUri = getPlayableUri(item, "radio");
                    const imageSrc = getImageSrc(getItemImageUrl(item), musicAssistant.baseUrl, musicAssistant.token);
                    const canPlay = !!radioUri && !!selectedQueueId;
                    return (
                      <button
                        key={radioUri || `radio-${index}`}
                        type="button"
                        onClick={() => canPlay && radioUri && playOnPlayer(normalizePlayMediaUri(radioUri))}
                        disabled={!canPlay}
                        className="rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent-yellow dark:focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-[var(--page-bg)] disabled:opacity-50 text-left"
                      >
                        <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-xl overflow-hidden relative bg-gray-200 dark:bg-gray-700">
                          {imageSrc ? (
                            <Image src={imageSrc} alt="" fill className="object-cover" sizes="128px" placeholder="blur" blurDataURL={MUSIC_IMAGE_BLUR} unoptimized priority={index < 6} />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Radio className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                        </div>
                        <p className="mt-1.5 truncate text-sm font-medium text-gray-900 dark:text-white text-center">{item.name ?? t("music.unknown")}</p>
                      </button>
                    );
                  })}
                </div>
              )
            )}
            {selectedCategory === "recentlyPlayed" && !recentLoading && recentItems.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-8">{t("music.noHistory")}</p>
            )}
            {selectedCategory === "radio" && !radioStationsLoading && radioStations.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-8">{t("music.noRadioStations")}</p>
            )}
          </div>
        ) : (
          <div className="contents">
        {!useMA && playersLoading && (
          <div className="flex justify-center py-12">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent"
              aria-hidden
            />
          </div>
        )}

        {!playersLoading && !useMA && entities.length === 0 && (
          <GlassCard>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Music2 className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("music.noMediaPlayers")}</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                {t("music.noMediaPlayersHint")}
              </p>
            </div>
          </GlassCard>
        )}

        {!playersLoading && !useMA && entities.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {entities.map((e) => {
              const title = (e.attributes?.friendly_name as string) ?? e.entity_id;
              return (
                <MediaCardWidget
                  key={e.entity_id}
                  title={title}
                  entity_id={e.entity_id}
                  size="md"
                />
              );
            })}
          </div>
        )}

        {useMA && homeDiscovery && (
          <MusicHomeDiscovery
            greeting={homeGreeting}
            listenNow={t("music.listenNow")}
            playLabel={t("music.play")}
            seeAllLabel={t("music.seeAll")}
            jumpBackTitle={t("music.jumpBackIn")}
            jumpBackIn={homeDiscovery.jumpBackIn}
            onJumpBackSeeAll={
              musicAssistant.sectionRecentlyPlayedEnabled
                ? () => setSelectedCategory("recentlyPlayed")
                : undefined
            }
            spotlights={homeDiscovery.spotlights}
            spotlightIntervalMs={musicAssistant.heroSliderIntervalMs}
            shelves={homeDiscovery.shelves}
            banner={!playersLoading && maPlayers.length === 0 ? t("music.connectPlayerToPlay") : null}
            emptyLabel={!homeDiscovery.loading ? t("music.homeEmpty") : null}
          />
        )}
        </div>
        )}
      </div>
        </div>
      </div>

    </AppShell>
  );
}
