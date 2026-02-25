"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/layout/glass-card";
import { MediaCardWidget } from "@/components/widgets";
import { OfflinePill } from "@/components/offline-pill";
import Image from "next/image";
import { Music2, Search, Play, Pause, Disc3, User, SkipBack, SkipForward, Volume2, VolumeX, CirclePlus, CircleMinus, X, ArrowLeft, Heart, Donut, Radio, Speaker, ChevronRight, ListMusic, Home, ListPlus } from "lucide-react";
import { useMusicAssistantStore, hydrateMusicAssistantStore, type MusicSectionId } from "@/stores/music-assistant-store";
import { useMusicPlayerStore } from "@/stores/music-player-store";
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

/** True if this item is an album (so album_tracks is valid). Recently played can contain tracks; only open album view for albums. */
function isAlbumItem(item: MASearchItem): boolean {
  const raw = item.uri ?? (item as { item_uri?: string }).item_uri ?? "";
  if (typeof raw === "string" && raw.includes("/album/")) return true;
  const mt = (item as { media_type?: string }).media_type ?? (item as { type?: string }).type;
  return mt === "album";
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

/** Extract hero display info from track or album. */
function getHeroDisplayInfo(item: MASearchItem): { title: string; subtitle: string; trackCount?: number } {
  const artistsStr = getArtistsString(item);
  const albumName = (item.album as { name?: string })?.name;
  const mediaType = (item.media_type ?? (item as { type?: string }).type) as string | undefined;
  const uri = (item.uri ?? (item as { item_uri?: string }).item_uri) ?? "";
  const isAlbum = mediaType === "album" || uri.includes("/album/");
  const isTrack = mediaType === "track" || uri.includes("/track/") || (item.album != null && !isAlbum);
  const isPlaylist = mediaType === "playlist" || uri.includes("/playlist/");

  if (isPlaylist) {
    const title = (item.name as string) ?? "";
    const trackCount =
      Array.isArray((item as { tracks?: unknown[] }).tracks)
        ? (item as { tracks: unknown[] }).tracks.length
        : (item as { total_tracks?: number }).total_tracks;
    return { title, subtitle: "", trackCount };
  }
  if (isTrack) {
    const title = (item.name as string) ?? "";
    const parts = [albumName, artistsStr].filter(Boolean);
    const subtitle = parts.join(" · ");
    return { title, subtitle };
  }
  const title = (item.name as string) ?? "";
  const trackCount =
    Array.isArray((item as { tracks?: unknown[] }).tracks)
      ? (item as { tracks: unknown[] }).tracks.length
      : (item as { total_tracks?: number }).total_tracks;
  return { title, subtitle: artistsStr, trackCount };
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
  args: Record<string, unknown> = {}
): Promise<unknown> {
  const res = await fetch("/api/music-assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ baseUrl, token, command, args }),
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
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [heroHourSeed, setHeroHourSeed] = useState(() => new Date().getHours());
  const [homeScrollTop, setHomeScrollTop] = useState(0);
  const musicScrollRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);
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
    const dbPlaylistId =
      (playlist as { db_id?: string }).db_id ??
      (typeof rawUri === "string" && rawUri ? rawUri : null) ??
      (itemId != null ? `${String(provider).replace(/\/+$/, "")}://playlist/${itemId}` : null) ??
      "";
    if (!dbPlaylistId) return;
    setAddToPlaylistPending(dbPlaylistId);
    setAddToPlaylistError(null);
    try {
      await callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/playlists/add_playlist_tracks", {
        db_playlist_id: dbPlaylistId,
        uris: [trackUri],
      });
      setAddToPlaylistTrack(null);
    } catch (e) {
      setAddToPlaylistError(e instanceof Error ? e.message : "Kon nummer niet toevoegen.");
    } finally {
      setAddToPlaylistPending(null);
    }
  }

  useEffect(() => {
    setPlayersLoading(true);
    setError(null);
    setEntities([]);

    fetch("/api/ha/entities")
      .then((r) => {
        if (!r.ok) throw new Error("Kon geen verbinding maken met Home Assistant.");
        return r.json();
      })
      .then((data: HaEntity[]) => {
        const list = Array.isArray(data) ? data : [];
        setEntities(list.filter((e) => e.entity_id?.startsWith("media_player.")));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Er is iets misgegaan."))
      .finally(() => setPlayersLoading(false));
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

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

  const allFeaturedTracks = useMemo(
    () => featuredPlaylistData.flatMap((d) => d.tracks),
    [featuredPlaylistData]
  );

  const heroItems = useMemo(() => {
    const sources = musicAssistant.heroSliderSources;
    const parts: MASearchItem[][] = [];
    if (sources.includes("featuredPlaylist")) parts.push(allFeaturedTracks);
    if (sources.includes("recentlyPlayed")) parts.push(recentItems);
    if (sources.includes("libraryAlbums")) parts.push(libraryAlbums);
    const combined = parts.flat();
    const seen = new Set<string>();
    const deduped = combined.filter((item) => {
      const uri = item.uri ?? (item as { item_uri?: string }).item_uri;
      const key = typeof uri === "string" ? uri : item.item_id ?? item.name;
      if (key && seen.has(String(key))) return false;
      if (key) seen.add(String(key));
      return true;
    });
    if (deduped.length === 0) return [];
    const n = deduped.length;
    const startIndex = (heroHourSeed * 7) % n;
    const result: MASearchItem[] = [];
    for (let i = 0; i < Math.min(6, n); i++) {
      result.push(deduped[(startIndex + i) % n]!);
    }
    return result;
  }, [allFeaturedTracks, recentItems, libraryAlbums, heroHourSeed, musicAssistant.heroSliderSources]);

  const heroItemCount = heroItems.length;
  useEffect(() => {
    if (heroItemCount > 0) setHeroSlideIndex(heroHourSeed % heroItemCount);
  }, [heroHourSeed, heroItemCount]);

  const heroIntervalMs = musicAssistant.heroSliderIntervalMs;
  useEffect(() => {
    if (heroItemCount <= 1) return;
    const id = setInterval(() => {
      setHeroSlideIndex((i) => (i + 1) % heroItemCount);
    }, heroIntervalMs);
    return () => clearInterval(id);
  }, [heroItemCount, heroIntervalMs]);

  useEffect(() => {
    const el = musicScrollRef.current;
    if (!el) return;
    const syncScroll = () => {
      setHomeScrollTop(el.scrollTop);
    };
    const handleScroll = () => {
      if (scrollRafRef.current != null) cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = requestAnimationFrame(() => {
        syncScroll();
        scrollRafRef.current = null;
      });
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    el.addEventListener("touchmove", handleScroll, { passive: true });
    const poll = setInterval(syncScroll, 150);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      el.removeEventListener("touchmove", handleScroll);
      clearInterval(poll);
      if (scrollRafRef.current != null) cancelAnimationFrame(scrollRafRef.current);
    };
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
        const msg = e instanceof Error ? e.message : "Kon albumnummers niet laden.";
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
        setError(e instanceof Error ? e.message : "Kon albumnummers niet laden.");
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
    const ids = musicAssistant.featuredPlaylistIds?.filter((id) => String(id).trim()) ?? [];
    if (!musicAssistant.enabled || !musicAssistant.baseUrl || ids.length === 0) {
      setFeaturedPlaylistData([]);
      setFeaturedPlaylistLoading(false);
      return;
    }
    setFeaturedPlaylistLoading(true);
    const parsePlaylist = (data: unknown): MASearchItem | null => {
      const err = (data as { error?: string })?.error;
      if (err) return null;
      const d = data as Record<string, unknown>;
      const item =
        (d?.result as MASearchItem) ??
        (d?.playlist as MASearchItem) ??
        (typeof data === "object" && data !== null && (data as MASearchItem).name ? (data as MASearchItem) : null);
      return item && typeof item === "object" && (item.name || item.uri) ? item : null;
    };
    const parsePlaylistTracks = (data: unknown): MASearchItem[] => {
      const err = (data as { error?: string })?.error;
      if (err) return [];
      const d = data as Record<string, unknown>;
      const result = d?.result ?? d;
      const resultObj = typeof result === "object" && result !== null ? (result as Record<string, unknown>) : {};
      const extractTrack = (x: unknown): MASearchItem | null => {
        if (!x || typeof x !== "object") return null;
        const obj = x as Record<string, unknown>;
        const track = (obj?.track ?? obj) as MASearchItem;
        return track && typeof track === "object" ? track : null;
      };
      if (Array.isArray(resultObj.tracks)) return resultObj.tracks as MASearchItem[];
      if (Array.isArray(resultObj.items)) {
        return (resultObj.items as unknown[]).map(extractTrack).filter((x): x is MASearchItem => x != null);
      }
      if (Array.isArray((resultObj as { playlist_tracks?: unknown[] }).playlist_tracks)) {
        return (resultObj as { playlist_tracks: unknown[] }).playlist_tracks.map(extractTrack).filter((x): x is MASearchItem => x != null);
      }
      if (Array.isArray(result)) return result as MASearchItem[];
      return [];
    };
    Promise.all(
      ids.map(async (id) => {
        const [playlistRes, tracksRes] = await Promise.all([
          callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/playlists/get", {
            item_id: id,
            provider_instance_id_or_domain: "library",
          }),
          callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/playlists/playlist_tracks", {
            item_id: id,
            provider_instance_id_or_domain: "library",
          }),
        ]);
        const playlist = parsePlaylist(playlistRes);
        const tracks = parsePlaylistTracks(tracksRes);
        return { id, playlist, tracks };
      })
    )
      .then(setFeaturedPlaylistData)
      .catch(() => setFeaturedPlaylistData([]))
      .finally(() => setFeaturedPlaylistLoading(false));
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, musicAssistant.featuredPlaylistIds]);

  useEffect(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl || !musicAssistant.sectionRadioEnabled) {
      setRadioStations([]);
      setRadioStationsLoading(false);
      return;
    }
    setRadioStationsLoading(true);
    const parseItems = (data: unknown): MASearchItem[] => {
      const err = (data as { error?: string })?.error;
      if (err) return [];
      const d = data as Record<string, unknown>;
      const result = d?.result ?? d;
      const resultObj = typeof result === "object" && result !== null ? (result as Record<string, unknown>) : {};
      if (Array.isArray(resultObj.items)) return resultObj.items as MASearchItem[];
      if (Array.isArray(resultObj.radios)) return resultObj.radios as MASearchItem[];
      if (Array.isArray(result)) return result as MASearchItem[];
      return [];
    };
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/radios/library_items", { limit: 50, in_library_only: true })
      .then((data) => setRadioStations(parseItems(data)))
      .catch(() => setRadioStations([]))
      .finally(() => setRadioStationsLoading(false));
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, musicAssistant.sectionRadioEnabled]);

  useEffect(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl) {
      setLibraryPlaylists([]);
      setLibraryPlaylistsLoading(false);
      return;
    }
    setLibraryPlaylistsLoading(true);
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
      .then((data) => setLibraryPlaylists(parseItems(data)))
      .catch(() => setLibraryPlaylists([]))
      .finally(() => setLibraryPlaylistsLoading(false));
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  useEffect(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl) {
      setLibraryArtists([]);
      setLibraryArtistsLoading(false);
      return;
    }
    setLibraryArtistsLoading(true);
    const parseItems = (data: unknown): MASearchItem[] => {
      const err = (data as { error?: string })?.error;
      if (err) return [];
      const d = data as Record<string, unknown>;
      const result = d?.result ?? d;
      const resultObj = typeof result === "object" && result !== null ? (result as Record<string, unknown>) : {};
      if (Array.isArray(resultObj.items)) return resultObj.items as MASearchItem[];
      if (Array.isArray(resultObj.artists)) return resultObj.artists as MASearchItem[];
      if (Array.isArray(result)) return result as MASearchItem[];
      return [];
    };
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/artists/library_items", { limit: 200, in_library_only: true })
      .then((data) => setLibraryArtists(parseItems(data)))
      .catch(() => setLibraryArtists([]))
      .finally(() => setLibraryArtistsLoading(false));
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  useEffect(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl) {
      setLibraryAlbums([]);
      setLibraryAlbumsLoading(false);
      return;
    }
    setLibraryAlbumsLoading(true);
    const parseItems = (data: unknown): MASearchItem[] => {
      const err = (data as { error?: string })?.error;
      if (err) return [];
      const d = data as Record<string, unknown>;
      const result = d?.result ?? d;
      const resultObj = typeof result === "object" && result !== null ? (result as Record<string, unknown>) : {};
      if (Array.isArray(resultObj.items)) return resultObj.items as MASearchItem[];
      if (Array.isArray(resultObj.albums)) return resultObj.albums as MASearchItem[];
      if (Array.isArray(result)) return result as MASearchItem[];
      return [];
    };
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/albums/library_items", { limit: 200, in_library_only: true })
      .then((data) => setLibraryAlbums(parseItems(data)))
      .catch(() => setLibraryAlbums([]))
      .finally(() => setLibraryAlbumsLoading(false));
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  useEffect(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl) {
      setLibraryArtists([]);
      setLibraryArtistsLoading(false);
      return;
    }
    setLibraryArtistsLoading(true);
    const parseItems = (data: unknown): MASearchItem[] => {
      const err = (data as { error?: string })?.error;
      if (err) return [];
      const d = data as Record<string, unknown>;
      const result = d?.result ?? d;
      const resultObj = typeof result === "object" && result !== null ? (result as Record<string, unknown>) : {};
      if (Array.isArray(resultObj.items)) return resultObj.items as MASearchItem[];
      if (Array.isArray(resultObj.artists)) return resultObj.artists as MASearchItem[];
      if (Array.isArray(result)) return result as MASearchItem[];
      return [];
    };
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/artists/library_items", { limit: 200, in_library_only: true })
      .then((data) => setLibraryArtists(parseItems(data)))
      .catch(() => setLibraryArtists([]))
      .finally(() => setLibraryArtistsLoading(false));
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  useEffect(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl) {
      setLibraryAlbums([]);
      setLibraryAlbumsLoading(false);
      return;
    }
    setLibraryAlbumsLoading(true);
    const parseItems = (data: unknown): MASearchItem[] => {
      const err = (data as { error?: string })?.error;
      if (err) return [];
      const d = data as Record<string, unknown>;
      const result = d?.result ?? d;
      const resultObj = typeof result === "object" && result !== null ? (result as Record<string, unknown>) : {};
      if (Array.isArray(resultObj.items)) return resultObj.items as MASearchItem[];
      if (Array.isArray(resultObj.albums)) return resultObj.albums as MASearchItem[];
      if (Array.isArray(result)) return result as MASearchItem[];
      return [];
    };
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/albums/library_items", { limit: 200, in_library_only: true })
      .then((data) => setLibraryAlbums(parseItems(data)))
      .catch(() => setLibraryAlbums([]))
      .finally(() => setLibraryAlbumsLoading(false));
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

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
    })
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
    fetchRecentItems();
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
    tryAttempt(0, 0).catch((err) => setError(err instanceof Error ? err.message : "Zoeken mislukt.")).finally(() => setSearching(false));
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, searchQuery, searchFilter]);

  const playOnPlayer = useCallback(
    (uri: string) => {
      const trimmedUri = typeof uri === "string" ? uri.trim() : "";
      if (!trimmedUri || !selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) {
        if (!trimmedUri) setError("Geen nummer om af te spelen (ontbrekende gegevens).");
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
          const msg = err instanceof Error ? err.message : "Afspelen mislukt.";
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
  return (
    <AppShell
      activeTab="/music"
      contentNoScroll
      headerFixed
      headerContentLight={!selectedMenu && !selectedCategory && !selectedArtist && !selectedAlbum}
      headerEndAction={
        useMA && maPlayers.length > 0 ? (
          <button
            type="button"
            onClick={() => setSearchOverlayOpen(true)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
              !selectedMenu && !selectedCategory && !selectedArtist && !selectedAlbum
                ? "text-white/90 hover:bg-white/10"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
            )}
            aria-label={t("music.search")}
          >
            <Search className="h-5 w-5" />
          </button>
        ) : undefined
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
      <div className={cn("music-page-content w-full max-w-full flex flex-col h-full min-h-0 relative", !selectedMenu && !selectedCategory && !selectedArtist && !selectedAlbum ? "bg-page-light dark:bg-black" : "bg-page-light dark:bg-dark-page", showPlayerBar && playerBarExpanded && "pb-24")}>
        {!selectedMenu && !selectedCategory && !selectedArtist && !selectedAlbum && heroItems.length > 0 && (() => {
          const heroItem = heroItems[heroSlideIndex] ?? heroItems[0];
          const heroImageSrc = heroItem ? getImageSrc(getItemImageUrl(heroItem), musicAssistant.baseUrl, musicAssistant.token) : null;
          const heroDisplay = heroItem ? getHeroDisplayInfo(heroItem) : { title: "", subtitle: "", trackCount: undefined };
          const heroUri = heroItem
            ? (getPlayableUri(heroItem, "track") || getPlayableUri(heroItem, "album") || getPlayableUri(heroItem, "playlist"))
            : null;
          const heroBlur = Math.min(20, Math.max(0, homeScrollTop * 0.06));
          const heroOverlay = Math.min(0.6, homeScrollTop * 0.003);
          return (
            <div
              className="fixed inset-x-0 top-0 z-20 h-[min(75vh,600px)] w-screen transition-[filter,opacity] duration-300 will-change-[filter]"
              style={{
                maskImage: "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
                filter: heroBlur > 2 ? `blur(${heroBlur}px)` : "none",
              }}
            >
              <div className="absolute inset-0 bg-gray-900">
                {heroImageSrc ? (
                  <Image src={heroImageSrc} alt="" fill className="object-cover object-center scale-105" sizes="100vw" placeholder="blur" blurDataURL={MUSIC_IMAGE_BLUR} unoptimized priority />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <Disc3 className="h-24 w-24 text-white/30" aria-hidden />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" aria-hidden />
                {heroOverlay > 0 && (
                  <div
                    className="absolute inset-0 bg-black/60 transition-opacity duration-300"
                    style={{ opacity: heroOverlay }}
                    aria-hidden
                  />
                )}
              </div>
              <div className="absolute bottom-[10%] left-0 right-0 pl-[calc(3.5rem+30px)] sm:pl-[calc(4rem+30px)] pr-4 sm:pr-6 py-5 sm:py-6 flex flex-row items-end justify-between gap-4 pointer-events-none">
                <div className="min-w-0 flex-1 pointer-events-auto">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg truncate max-w-full">
                    {heroDisplay.title || t("music.unknown")}
                  </h2>
                  {heroDisplay.subtitle ? (
                    <p className="mt-1 text-base sm:text-lg text-white/90 truncate max-w-full">{heroDisplay.subtitle}</p>
                  ) : null}
                  {heroDisplay.trackCount != null && heroDisplay.trackCount > 0 ? (
                    <p className="mt-0.5 text-sm text-white/70">
                      {heroDisplay.trackCount} {heroDisplay.trackCount === 1 ? t("music.trackCountOne") : t("music.trackCountMany")}
                    </p>
                  ) : null}
                  {heroItems.length > 1 && (
                    <div className="flex items-center gap-1.5 mt-3" role="tablist" aria-label={t("music.slides")}>
                      {heroItems.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          role="tab"
                          aria-selected={i === heroSlideIndex}
                          onClick={() => setHeroSlideIndex(i)}
                          className={cn(
                            "rounded-full transition-all duration-200",
                            i === heroSlideIndex ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/70"
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 pointer-events-auto mr-5">
                  <span className="text-sm font-medium text-white/90 uppercase tracking-wider hidden sm:inline">{t("music.play")}</span>
                  <button
                    type="button"
                    onClick={() => heroUri && selectedQueueId && playOnPlayer(normalizePlayMediaUri(heroUri))}
                    disabled={!heroUri || !selectedQueueId}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg hover:scale-105 disabled:opacity-50 transition-transform"
                    aria-label={t("music.play")}
                  >
                    <Play className="h-6 w-6 fill-current ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
        <div className="flex flex-1 min-h-0 min-w-0">
          <nav className="fixed left-[10px] top-[8rem] bottom-0 w-14 py-2 pr-2 flex flex-col items-center gap-1 z-30">
              {(
                [
                  { id: "home" as const, label: t("music.menuHome"), icon: Home },
                  { id: "artists" as const, label: t("music.menuArtists"), icon: User },
                  { id: "albums" as const, label: t("music.menuAlbums"), icon: Disc3 },
                  { id: "playlists" as const, label: t("music.menuPlaylists"), icon: ListMusic },
                ] as const
              ).map(({ id, label, icon: Icon }) => {
                const active = id === "home"
                  ? !selectedMenu && !selectedCategory
                  : selectedMenu === id;
                const isHome = !selectedMenu && !selectedCategory && !selectedArtist && !selectedAlbum;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      if (id === "home") {
                        setSelectedMenu(null);
                        setSelectedCategory(null);
                        setSelectedArtist(null);
                        setSelectedAlbum(null);
                      } else {
                        setSelectedMenu(id);
                        setSelectedCategory(null);
                        if (id === "artists") setSelectedArtist(null);
                        if (id === "albums") setSelectedAlbum(null);
                      }
                    }}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                      isHome
                        ? active
                          ? "bg-white/20 text-white"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                        : active
                          ? "bg-accent-yellow/20 dark:bg-accent-green/20 text-gray-900 dark:text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                    )}
                    aria-label={label}
                    title={label}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                  </button>
                );
              })}
            </nav>
          <div
            ref={musicScrollRef}
            className={cn("flex-1 min-w-0 min-h-0 overflow-x-hidden overflow-y-auto music-content-area pl-[calc(3.5rem+0.75rem)]", !selectedMenu && !selectedCategory && !selectedArtist && !selectedAlbum ? "overflow-x-visible text-gray-900 dark:text-white" : "overflow-x-hidden text-gray-900 dark:text-white")}
          >
        <div className="flex flex-wrap items-center justify-end gap-4 pb-2">
          <OfflinePill />
        </div>
        {error && (
          <div
            className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-800 dark:text-red-200"
            role="alert"
          >
            {error}
          </div>
        )}

        {selectedAlbum ? (
          <div className="space-y-0">
            {(() => {
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
                <>
                  <div
                    className="fixed inset-x-0 top-0 z-20 h-[min(55vh,420px)] w-screen"
                    style={{
                      maskImage: "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)",
                      WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gray-900">
                      {albumImageSrc ? (
                        <Image src={albumImageSrc} alt="" fill className="object-cover object-center scale-105" sizes="100vw" placeholder="blur" blurDataURL={MUSIC_IMAGE_BLUR} unoptimized priority />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                          <Disc3 className="h-24 w-24 text-white/30" aria-hidden />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" aria-hidden />
                    </div>
                    <div className="absolute top-4 left-[calc(3.5rem+0.5rem)] sm:left-[calc(4rem+0.75rem)] flex items-center gap-2 z-10">
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
                        className="flex items-center gap-2 h-9 px-3 sm:px-4 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                        aria-label={t("music.back")}
                      >
                        <ArrowLeft className="h-5 w-5 shrink-0" />
                        <span className="text-sm font-medium hidden sm:inline">{t("music.back")}</span>
                      </button>
                    </div>
                    <div className="absolute bottom-[12%] left-0 right-0 pl-[calc(3.5rem+30px)] sm:pl-[calc(4rem+30px)] pr-4 sm:pr-6 py-5 sm:py-6 flex flex-row items-end justify-between gap-4 pointer-events-none">
                      <div className="min-w-0 flex-1 pointer-events-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg truncate max-w-full">
                          {album.name ?? t("music.unknown")}
                        </h2>
                        <p className="mt-1 text-base sm:text-lg text-white/90 truncate max-w-full">{artistStr}</p>
                        {albumTracks.length > 0 && (
                          <p className="mt-0.5 text-sm text-white/70">
                            {albumTracks.length} {albumTracks.length === 1 ? t("music.trackCountOne") : t("music.trackCountMany")}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0 pointer-events-auto">
                        {albumUri && (
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); addToFavorites(albumUri); }}
                            disabled={favoritePending.has(albumUri)}
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                              isFav ? "text-red-400" : "text-white/80 hover:text-white hover:bg-white/10"
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
                        )}
                        <button
                          type="button"
                          onClick={() => albumUri && selectedQueueId && playOnPlayer(normalizePlayMediaUri(albumUri))}
                          disabled={!albumUri || !selectedQueueId}
                          className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg hover:scale-105 disabled:opacity-50 transition-transform"
                          aria-label={t("music.play")}
                        >
                          <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current ml-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="h-[min(55vh,420px)] shrink-0" aria-hidden />
                </>
              );
            })()}
            <section className="min-w-0 flex-1 w-full pt-2">
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">{t("music.albumTracks")}</h3>
                {albumTracksLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
                  </div>
                ) : albumTracks.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 py-4">{t("music.noAlbumTracks")}</p>
                ) : (
                  <ul className="space-y-1 max-w-2xl" role="list">
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
                          className="flex items-center gap-3 rounded-xl border border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2.5 hover:bg-white dark:hover:bg-white/10"
                          onPointerDown={lp.onPointerDown}
                          onPointerUp={lp.onPointerUp}
                          onPointerLeave={lp.onPointerLeave}
                        >
                          <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums w-8">{index + 1}</span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-gray-900 dark:text-white">{name}</p>
                          </div>
                          <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400 tabular-nums">{formatDuration(duration)}</span>
                          {uri && (
                            <button
                              type="button"
                              onClick={(e) => { e.preventDefault(); addToFavorites(uri); }}
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
                            onClick={lp.wrapClick(() => canPlay && uri && playOnPlayer(normalizePlayMediaUri(uri)))}
                            disabled={!canPlay || !!isPlayPending}
                            className="shrink-0 rounded-full bg-accent-yellow p-2 text-gray-900 hover:opacity-90 disabled:opacity-50 dark:bg-accent-green dark:text-gray-900"
                            aria-label={t("music.playOn")}
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
                )}
              </section>
            </div>
        ) : selectedArtist ? (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => { setSelectedArtist(null); setArtistAlbums([]); setArtistTracks([]); setError(null); }}
              className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white/90 hover:text-gray-800 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("music.back")}
            </button>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                {getImageSrc(getItemImageUrl(selectedArtist), musicAssistant.baseUrl, musicAssistant.token) ? (
                  <Image
                    src={getImageSrc(getItemImageUrl(selectedArtist), musicAssistant.baseUrl, musicAssistant.token)!}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="192px"
                    placeholder="blur"
                    blurDataURL={MUSIC_IMAGE_BLUR}
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-500 dark:text-gray-400" aria-hidden />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{(selectedArtist as MASearchItem).name ?? t("music.unknown")}</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("music.artistAlbums")}</p>
              </div>
            </div>
            <section>
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">{t("music.albums")}</h3>
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
                        className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent-yellow dark:focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-[var(--page-bg)] snap-start [scroll-snap-stop:always]"
                        title={item.name as string}
                      >
                        {imageSrc ? (
                          <span className="relative block w-full h-full">
                            <Image src={imageSrc} alt="" fill className="object-cover" sizes="128px" placeholder="blur" blurDataURL={MUSIC_IMAGE_BLUR} unoptimized />
                          </span>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                            <Disc3 className="h-10 w-10 text-gray-500 dark:text-gray-400" aria-hidden />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
            <section>
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">{t("music.artistTracks")}</h3>
              {artistTracksLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
                </div>
              ) : artistTracks.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-4">{t("music.noTracks")}</p>
              ) : (
                <ul className="space-y-1 max-w-2xl" role="list">
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
                        className="flex items-center gap-3 rounded-xl border border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2.5 hover:bg-white dark:hover:bg-white/10"
                        onPointerDown={lp.onPointerDown}
                        onPointerUp={lp.onPointerUp}
                        onPointerLeave={lp.onPointerLeave}
                      >
                        <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums w-8">{index + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-gray-900 dark:text-white">{name}</p>
                        </div>
                        <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400 tabular-nums">{formatDuration(duration)}</span>
                        {uri && (
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); addToFavorites(uri); }}
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
                          onClick={lp.wrapClick(() => canPlay && uri && playOnPlayer(normalizePlayMediaUri(uri)))}
                          disabled={!canPlay || !!isPlayPending}
                          className="shrink-0 rounded-full bg-accent-yellow p-2 text-gray-900 hover:opacity-90 disabled:opacity-50 dark:bg-accent-green dark:text-gray-900"
                          aria-label={t("music.playOn")}
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
              )}
            </section>
          </div>
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
        ) : selectedAlbum ? (
          <div className="space-y-0">
            {(() => {
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
                <>
                  <div
                    className="fixed inset-x-0 top-0 z-20 h-[min(42vh,320px)] w-screen"
                    style={{
                      maskImage: "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)",
                      WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gray-900">
                      {albumImageSrc ? (
                        <Image src={albumImageSrc} alt="" fill className="object-cover object-center" sizes="100vw" placeholder="blur" blurDataURL={MUSIC_IMAGE_BLUR} unoptimized priority />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                          <Disc3 className="h-20 w-20 text-white/30" aria-hidden />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" aria-hidden />
                    </div>
                    <div className="absolute inset-0 flex items-center pl-[calc(3.5rem+1rem)] sm:pl-[calc(4rem+1.5rem)] pr-4 sm:pr-6">
                      <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-xl overflow-hidden bg-gray-700 shrink-0 shadow-xl">
                        {albumImageSrc ? (
                          <Image src={albumImageSrc} alt="" fill className="object-cover" sizes="176px" placeholder="blur" blurDataURL={MUSIC_IMAGE_BLUR} unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Disc3 className="h-12 w-12 text-gray-500" aria-hidden />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center pl-4 sm:pl-6 pr-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md truncate">{album.name ?? t("music.unknown")}</h2>
                        <p className="mt-0.5 text-sm sm:text-base text-white/90 truncate">{artistStr}</p>
                        {albumTracks.length > 0 && (
                          <p className="mt-0.5 text-xs text-white/70">
                            {albumTracks.length} {albumTracks.length === 1 ? t("music.trackCountOne") : t("music.trackCountMany")}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {albumUri && (
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); addToFavorites(albumUri); }}
                            disabled={favoritePending.has(albumUri)}
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                              isFav ? "text-red-400" : "text-white/80 hover:text-white hover:bg-white/10"
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
                        )}
                        <button
                          type="button"
                          onClick={() => albumUri && selectedQueueId && playOnPlayer(normalizePlayMediaUri(albumUri))}
                          disabled={!albumUri || !selectedQueueId}
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg hover:scale-105 disabled:opacity-50 transition-transform"
                          aria-label={t("music.play")}
                        >
                          <Play className="h-5 w-5 fill-current ml-0.5" />
                        </button>
                      </div>
                    </div>
                    <div className="absolute top-4 left-[calc(3.5rem+0.5rem)] sm:left-[calc(4rem+0.75rem)] flex items-center gap-2 z-10">
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
                        className="flex items-center gap-2 h-9 px-3 sm:px-4 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                        aria-label={t("music.back")}
                      >
                        <ArrowLeft className="h-5 w-5 shrink-0" />
                        <span className="text-sm font-medium hidden sm:inline">{t("music.back")}</span>
                      </button>
                    </div>
                  </div>
                  <div className="h-[min(42vh,320px)] shrink-0" aria-hidden />
                </>
              );
            })()}
            <section className="min-w-0 flex-1 w-full pt-2">
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">{t("music.albumTracks")}</h3>
                {albumTracksLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
                  </div>
                ) : albumTracks.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 py-4">{t("music.noAlbumTracks")}</p>
                ) : (
                  <ul className="space-y-1 max-w-2xl" role="list">
                    {albumTracks.map((item, index) => {
                      const uri = getPlayableUri(item, "track");
                      const name = item.name ?? t("music.unknown");
                      const duration = (item as { duration?: number }).duration ?? item.duration;
                      const isPlayPending = uri && playPending === uri;
                      const canPlay = !!uri && !!selectedQueueId;
                      const lp = createTrackLongPressHandlers(item);
                      return (
                        <li
                          key={uri ?? `track-${index}`}
                          className="flex items-center gap-3 rounded-xl border border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2.5 hover:bg-white dark:hover:bg-white/10"
                          onPointerDown={lp.onPointerDown}
                          onPointerUp={lp.onPointerUp}
                          onPointerLeave={lp.onPointerLeave}
                        >
                          <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums w-8">{index + 1}</span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-gray-900 dark:text-white">{name}</p>
                          </div>
                          <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400 tabular-nums">{formatDuration(duration)}</span>
                          {uri && (
                            <button
                              type="button"
                              onClick={(e) => { e.preventDefault(); addToFavorites(uri); }}
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
                            onClick={lp.wrapClick(() => canPlay && uri && playOnPlayer(normalizePlayMediaUri(uri)))}
                            disabled={!canPlay || !!isPlayPending}
                            className="shrink-0 rounded-full bg-accent-yellow p-2 text-gray-900 hover:opacity-90 disabled:opacity-50 dark:bg-accent-green dark:text-gray-900"
                            aria-label={t("music.playOn")}
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
                )}
              </section>
            </div>
        ) : selectedArtist ? (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => { setSelectedArtist(null); setArtistAlbums([]); setArtistTracks([]); setError(null); }}
              className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white/90 hover:text-gray-800 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("music.back")}
            </button>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                {getImageSrc(getItemImageUrl(selectedArtist), musicAssistant.baseUrl, musicAssistant.token) ? (
                  <Image
                    src={getImageSrc(getItemImageUrl(selectedArtist), musicAssistant.baseUrl, musicAssistant.token)!}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="192px"
                    placeholder="blur"
                    blurDataURL={MUSIC_IMAGE_BLUR}
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-500 dark:text-gray-400" aria-hidden />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{(selectedArtist as MASearchItem).name ?? t("music.unknown")}</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("music.artistAlbums")}</p>
              </div>
            </div>
            <section>
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">{t("music.albums")}</h3>
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
                        className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent-yellow dark:focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-[var(--page-bg)] snap-start [scroll-snap-stop:always]"
                        title={item.name as string}
                      >
                        {imageSrc ? (
                          <span className="relative block w-full h-full">
                            <Image src={imageSrc} alt="" fill className="object-cover" sizes="128px" placeholder="blur" blurDataURL={MUSIC_IMAGE_BLUR} unoptimized />
                          </span>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                            <Disc3 className="h-10 w-10 text-gray-500 dark:text-gray-400" aria-hidden />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
            <section>
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">{t("music.artistTracks")}</h3>
              {artistTracksLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
                </div>
              ) : artistTracks.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-4">{t("music.noTracks")}</p>
              ) : (
                <ul className="space-y-1 max-w-2xl" role="list">
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
                        className="flex items-center gap-3 rounded-xl border border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2.5 hover:bg-white dark:hover:bg-white/10"
                        onPointerDown={lp.onPointerDown}
                        onPointerUp={lp.onPointerUp}
                        onPointerLeave={lp.onPointerLeave}
                      >
                        <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums w-8">{index + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-gray-900 dark:text-white">{name}</p>
                        </div>
                        <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400 tabular-nums">{formatDuration(duration)}</span>
                        {uri && (
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); addToFavorites(uri); }}
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
                          onClick={lp.wrapClick(() => canPlay && uri && playOnPlayer(normalizePlayMediaUri(uri)))}
                          disabled={!canPlay || !!isPlayPending}
                          className="shrink-0 rounded-full bg-accent-yellow p-2 text-gray-900 hover:opacity-90 disabled:opacity-50 dark:bg-accent-green dark:text-gray-900"
                          aria-label={t("music.playOn")}
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
              )}
            </section>
          </div>
        ) : (
          <div className="contents">
        {playersLoading && (
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

        {!playersLoading && useMA && maPlayers.length === 0 && (
          <GlassCard>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Music2 className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("music.noPlayers")}</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                {t("music.noPlayersHint")}
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

        {!playersLoading && useMA && maPlayers.length > 0 && !selectedArtist && !selectedAlbum && (
          <>
            {!selectedMenu && !selectedCategory && heroItems.length > 0 ? (
                <div className="h-[min(55vh,440px)] shrink-0" aria-hidden />
              ) : null}
            {musicAssistant.sectionOrder.map((sectionId) => {
            if (sectionId === "radio" && !musicAssistant.sectionRadioEnabled) return null;
            if (sectionId === "recentlyPlayed" && !musicAssistant.sectionRecentlyPlayedEnabled) return null;
            if (sectionId === "featuredPlaylist" && !musicAssistant.sectionFeaturedPlaylistEnabled) return null;
            if (sectionId === "featuredPlaylist") {
              const show =
                featuredPlaylistData.length > 0 ||
                featuredPlaylistLoading ||
                featuredPlaylistData.some((d) => d.tracks.length > 0);
              if (!show) return null;
              return (
                <div key="featuredPlaylist" className="relative z-30 mt-8 pl-[8px] space-y-8">
                  {featuredPlaylistLoading && featuredPlaylistData.length === 0 ? (
                    <section>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{t("music.recentlyAdded")}</h2>
                      <div className="flex justify-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
                      </div>
                    </section>
                  ) : (
                  featuredPlaylistData.map(({ id, playlist, tracks }) => (
                    <section key={id}>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                          {playlist?.name ?? t("music.playlist")}
                        </h2>
                        {playlist && selectedQueueId && (
                          <button
                            type="button"
                            onClick={() => {
                              const playlistUri = getPlayableUri(playlist, "playlist");
                              if (playlistUri) playOnPlayer(normalizePlayMediaUri(playlistUri));
                            }}
                            className="text-sm font-medium text-accent-yellow dark:text-accent-green hover:underline shrink-0"
                          >
                            {t("music.play")} {t("music.playlist")}
                          </button>
                        )}
                      </div>
                      {featuredPlaylistLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
                        </div>
                      ) : tracks.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 py-4">{t("music.noTracks")}</p>
                      ) : (
                        <div className="music-h-scroll flex gap-4 overflow-x-auto overflow-y-hidden pb-2 pr-4 scroll-smooth snap-x snap-proximity scrollbar-hide overscroll-x-contain touch-pan-x">
                          {tracks.map((item, index) => {
                        const uri = getPlayableUri(item, "track");
                        const albumUri = getPlayableUri(item, "album");
                        const imageSrc = getImageSrc(getItemImageUrl(item), musicAssistant.baseUrl, musicAssistant.token);
                        const canPlay = !!(uri || albumUri) && !!selectedQueueId;
                        const isAlbum = isAlbumItem(item);
                        const albumParams = isAlbum ? getAlbumParams(item) : null;
                        const artistNames = item.artists
                          ? Array.isArray(item.artists)
                            ? (item.artists as { name?: string }[]).map((a) => a?.name).filter(Boolean).join(", ")
                            : (item.artists as { name?: string })?.name ?? ""
                          : "";
                        const lp = createTrackLongPressHandlers(item);
                        const handleClick = lp.wrapClick(() => {
                          if (albumParams) setSelectedAlbum(item);
                          else if (canPlay && uri) playOnPlayer(normalizePlayMediaUri(uri));
                          else if (canPlay && albumUri) playOnPlayer(normalizePlayMediaUri(albumUri));
                        });
                        return (
                          <button
                            key={uri || albumUri || `featured-track-${index}`}
                            type="button"
                            onClick={handleClick}
                            onPointerDown={lp.onPointerDown}
                            onPointerUp={lp.onPointerUp}
                            onPointerLeave={lp.onPointerLeave}
                            disabled={!albumParams && !canPlay}
                            className="shrink-0 w-28 sm:w-32 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent-yellow dark:focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-[var(--page-bg)] disabled:opacity-50 snap-start [scroll-snap-stop:always] text-left"
                            title={albumParams ? t("music.viewAlbum") : (item.name as string)}
                          >
                            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
                              {imageSrc ? (
                                <Image
                                  src={imageSrc}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  sizes="128px"
                                  placeholder="blur"
                                  blurDataURL={MUSIC_IMAGE_BLUR}
                                  unoptimized
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Disc3 className="h-10 w-10 text-gray-500 dark:text-gray-400" aria-hidden />
                                </div>
                              )}
                            </div>
                            <p className="mt-1.5 truncate text-sm font-medium text-gray-900 dark:text-white">
                              {item.name ?? t("music.unknown")}
                            </p>
                            {artistNames ? (
                              <p className="truncate text-xs text-gray-500 dark:text-gray-400">{artistNames}</p>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  )}
                    </section>
                  ))
                )}
                </div>
              );
            }
            if (sectionId === "radio") {
              return (
                <section key="radio" className="relative z-30 mt-8 pl-[8px]">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("radio")}
                    className="flex items-center gap-2 w-full text-left text-lg font-bold text-gray-900 dark:text-white mb-3 hover:text-gray-800 dark:hover:text-white/90 transition-colors"
                  >
                    {t("music.radioStations")}
                    <ChevronRight className="h-5 w-5 shrink-0 opacity-70" />
                  </button>
                  {radioStationsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
                    </div>
                  ) : radioStations.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 py-4">{t("music.noRadioStations")}</p>
                  ) : (
                    <div className="music-h-scroll flex gap-4 overflow-x-auto overflow-y-hidden pb-2 pr-4 scroll-smooth snap-x snap-proximity scrollbar-hide overscroll-x-contain touch-pan-x">
                        {radioStations.map((item, index) => {
                          const radioUri = getPlayableUri(item, "radio");
                          const imageSrc = getImageSrc(getItemImageUrl(item), musicAssistant.baseUrl, musicAssistant.token);
                          const isPlayPending = radioUri && playPending === radioUri;
                          const canPlay = !!radioUri && !!selectedQueueId;
                          const handleClick = () => {
                            if (canPlay && radioUri) playOnPlayer(normalizePlayMediaUri(radioUri));
                          };
                          return (
                            <button
                              key={radioUri || `radio-${index}`}
                              type="button"
                              onClick={handleClick}
                              disabled={!canPlay}
                              className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent-yellow dark:focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-[var(--page-bg)] disabled:opacity-50 snap-start [scroll-snap-stop:always]"
                              title={item.name as string}
                            >
                              {imageSrc ? (
                                <span className="relative block w-full h-full">
                                  <Image src={imageSrc} alt="" fill className="object-cover" sizes="128px" placeholder="blur" blurDataURL={MUSIC_IMAGE_BLUR} unoptimized />
                                </span>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                  <Disc3 className="h-8 w-8 text-gray-500 dark:text-gray-400" aria-hidden />
                                </div>
                              )}
                            </button>
                          );
                        })}
                    </div>
                  )}
                </section>
              );
            }
            if (sectionId === "recentlyPlayed") {
              return (
                <section key="recentlyPlayed" className="relative z-30 mt-8 pl-[10px]">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("recentlyPlayed")}
                    className="flex items-center gap-2 w-full text-left text-lg font-bold text-gray-900 dark:text-white mb-3 hover:text-gray-800 dark:hover:text-white/90 transition-colors"
                  >
                    {t("music.recentlyPlayed")}
                    <ChevronRight className="h-5 w-5 shrink-0 opacity-70" />
                  </button>
                  {recentLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
                    </div>
                  ) : recentItems.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 py-4">{t("music.noHistory")}</p>
                  ) : (
                    <div className="music-h-scroll flex gap-4 overflow-x-auto overflow-y-hidden pb-2 pr-4 scroll-smooth snap-x snap-proximity scrollbar-hide overscroll-x-contain touch-pan-x">
                        {recentItems.map((item, index) => {
                          const uri = getPlayableUri(item, "track");
                          const albumUri = getPlayableUri(item, "album");
                          const imageSrc = getImageSrc(getItemImageUrl(item), musicAssistant.baseUrl, musicAssistant.token);
                          const isPlayPending = (uri && playPending === uri) || (albumUri && playPending === albumUri);
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
                              onPointerDown={lp.onPointerDown}
                              onPointerUp={lp.onPointerUp}
                              onPointerLeave={lp.onPointerLeave}
                              type="button"
                              onClick={handleClick}
                              disabled={!albumParams && !canPlay}
                              className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent-yellow dark:focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-[var(--page-bg)] disabled:opacity-50 snap-start [scroll-snap-stop:always]"
                              title={albumParams ? t("music.viewAlbum") : (item.name as string)}
                            >
                              {imageSrc ? (
                                <span className="relative block w-full h-full">
                                  <Image src={imageSrc} alt="" fill className="object-cover" sizes="128px" placeholder="blur" blurDataURL={MUSIC_IMAGE_BLUR} unoptimized />
                                </span>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                  <Disc3 className="h-8 w-8 text-gray-500 dark:text-gray-400" aria-hidden />
                                </div>
                              )}
                            </button>
                          );
                        })}
                    </div>
                  )}
                </section>
              );
            }
            return null;
          })}
          </>
        )}
        </div>
        )}
      </div>
        </div>
      </div>

    </AppShell>
  );
}
