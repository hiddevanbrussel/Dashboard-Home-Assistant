"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/layout/glass-card";
import { MediaCardWidget } from "@/components/widgets";
import { OfflinePill } from "@/components/offline-pill";
import Image from "next/image";
import { Music2, Search, Play, Pause, Disc3, User, SkipBack, SkipForward, Volume2, VolumeX, ChevronUp, ChevronDown, X } from "lucide-react";
import { useMusicAssistantStore, hydrateMusicAssistantStore } from "@/stores/music-assistant-store";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

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
function getPlayableUri(item: MASearchItem, mediaType: "track" | "album" | "artist"): string {
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

export default function MusicPage() {
  const [entities, setEntities] = useState<HaEntity[]>([]);
  const [maPlayers, setMaPlayers] = useState<MAPlayer[]>([]);
  const [playersLoading, setPlayersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<"all" | "track" | "artist" | "album">("all");
  const [searchResults, setSearchResults] = useState<MASearchItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
  const [playPending, setPlayPending] = useState<string | null>(null);
  const [queueState, setQueueState] = useState<{
    state?: "playing" | "paused" | "idle";
    position?: number;
    duration?: number;
    current_item?: { name?: string; artists?: { name?: string }[] | { name?: string }; image?: string; [key: string]: unknown };
  } | null>(null);
  const [seekPending, setSeekPending] = useState(false);
  const [volume, setVolume] = useState<number>(80);
  const [volumePending, setVolumePending] = useState(false);
  const [volumePopoverOpen, setVolumePopoverOpen] = useState(false);
  const volumePopoverRef = useRef<HTMLDivElement>(null);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [recentItems, setRecentItems] = useState<MASearchItem[]>([]);
  const [recentLoading, setRecentLoading] = useState(false);
  const musicAssistant = useMusicAssistantStore();

  useEffect(() => {
    if (!volumePopoverOpen) return;
    const close = (e: MouseEvent) => {
      if (volumePopoverRef.current && !volumePopoverRef.current.contains(e.target as Node)) {
        setVolumePopoverOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [volumePopoverOpen]);

  useEffect(() => {
    if (!volumePopoverOpen || !musicAssistant.enabled || !musicAssistant.baseUrl || !selectedQueueId) return;
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "config/players/get", {
      player_id: selectedQueueId,
    })
      .then((data: unknown) => {
        const err = (data as { error?: string })?.error;
        if (err) return;
        const res = (data as { result?: { volume_level?: number } })?.result ?? data as { volume_level?: number };
        const vol = res?.volume_level;
        if (typeof vol === "number" && vol >= 0 && vol <= 1) setVolume(Math.round(vol * 100));
      })
      .catch(() => {});
  }, [volumePopoverOpen, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, selectedQueueId]);

  useEffect(() => {
    if (searchOverlayOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOverlayOpen]);

  useEffect(() => {
    hydrateMusicAssistantStore();
  }, []);

  useEffect(() => {
    setPlayersLoading(true);
    setError(null);
    setMaPlayers([]);
    setEntities([]);

    if (musicAssistant.enabled && musicAssistant.baseUrl) {
      callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "player_queues/all")
        .then((data: unknown) => {
          const err = (data as { error?: string })?.error;
          if (err) {
            setError(err);
            return;
          }
          const list = Array.isArray(data) ? data : (data as { result?: MAPlayer[] })?.result ?? [];
          setMaPlayers(list);
        })
        .catch((err) => setError(err instanceof Error ? err.message : "Er is iets misgegaan."))
        .finally(() => setPlayersLoading(false));
      return;
    }

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
    if (maPlayers.length === 0) return;
    const ids = new Set(maPlayers.map((p) => p.queue_id));
    if (!selectedQueueId || !ids.has(selectedQueueId)) {
      setSelectedQueueId(maPlayers[0].queue_id);
    }
  }, [maPlayers, selectedQueueId]);

  useEffect(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl || !selectedQueueId) return;
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "config/players/get", {
      player_id: selectedQueueId,
    })
      .then((data: unknown) => {
        const err = (data as { error?: string })?.error;
        if (err) return;
        const res = (data as { result?: { volume_level?: number } })?.result ?? data as { volume_level?: number };
        const vol = res?.volume_level;
        if (typeof vol === "number" && vol >= 0 && vol <= 1) setVolume(Math.round(vol * 100));
      })
      .catch(() => {});
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, selectedQueueId]);

  useEffect(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl) return;
    setRecentLoading(true);
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/recently_played_items", {
      limit: 24,
      media_types: ["track", "album"],
    })
      .then((data: unknown) => {
        const err = (data as { error?: string })?.error;
        if (err) return;
        const d = data as Record<string, unknown>;
        const result = d?.result ?? d;
        const resultObj = typeof result === "object" && result !== null ? (result as Record<string, unknown>) : {};
        let items: MASearchItem[] = [];
        if (Array.isArray(resultObj.tracks)) items = resultObj.tracks as MASearchItem[];
        else if (Array.isArray(resultObj.track)) items = resultObj.track as MASearchItem[];
        else if (Array.isArray(resultObj.items)) items = resultObj.items as MASearchItem[];
        else if (Array.isArray(result)) items = result as MASearchItem[];
        else if (Array.isArray(d.tracks)) items = d.tracks as MASearchItem[];
        else if (Array.isArray((d as { items?: MASearchItem[] }).items)) items = (d as { items: MASearchItem[] }).items;
        setRecentItems(Array.isArray(items) ? items : []);
      })
      .catch(() => setRecentItems([]))
      .finally(() => setRecentLoading(false));
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  useEffect(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl || !selectedQueueId) return;
    const fetchState = () => {
      callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "player_queues/get", {
        queue_id: selectedQueueId,
      })
        .then((data: unknown) => {
          const err = (data as { error?: string })?.error;
          if (err) return;
          const r = data as { result?: { state?: string; elapsed_time?: number; current_item?: { duration?: number; name?: string; artists?: { name?: string }[] | { name?: string }; image?: string; image_url?: string; [key: string]: unknown }; volume_level?: number } } | Record<string, unknown>;
          type QueueStateRes = { state?: string; elapsed_time?: number; position?: number; current_item?: { duration?: number; name?: string; artists?: { name?: string }[] | { name?: string }; image?: string; image_url?: string; [key: string]: unknown } };
          const res = (r?.result ?? r) as QueueStateRes | null | undefined;
          const state = res?.state;
          const elapsed = res?.elapsed_time ?? res?.position;
          const cur = res?.current_item;
          const duration = cur?.duration;
          setQueueState({
            state: state === "playing" ? "playing" : state === "paused" ? "paused" : "idle",
            position: typeof elapsed === "number" ? elapsed : undefined,
            duration: typeof duration === "number" ? duration : undefined,
            current_item: cur ? { name: cur.name, artists: cur.artists, image: cur.image ?? cur.image_url, ...cur } : undefined,
          });
        })
        .catch(() => {});
    };
    fetchState();
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, selectedQueueId]);

  const runSearch = useCallback(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl || !searchQuery.trim()) return;
    setSearching(true);
    setSearchResults([]);
    setError(null);
    const query = searchQuery.trim();
    const mediaType =
      searchFilter === "track" ? "track" : searchFilter === "artist" ? "artist" : searchFilter === "album" ? "album" : undefined;
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
    function collectResults(data: unknown): (MASearchItem & { __mediaType?: "track" | "artist" | "album" })[] {
      if (searchFilter === "artist") return parseArtists(data).map((a) => ({ ...a, __mediaType: "artist" as const }));
      if (searchFilter === "album") return parseAlbums(data).map((a) => ({ ...a, __mediaType: "album" as const }));
      if (searchFilter === "track") return parseTracks(data).map((t) => ({ ...t, __mediaType: "track" as const }));
      const tracks = parseTracks(data).map((t) => ({ ...t, __mediaType: "track" as const }));
      const artists = parseArtists(data).map((a) => ({ ...a, __mediaType: "artist" as const }));
      const albums = parseAlbums(data).map((a) => ({ ...a, __mediaType: "album" as const }));
      return [...tracks, ...artists, ...albums];
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
      p.catch((err) => {
        const msg = err instanceof Error ? err.message : "Afspelen mislukt.";
        setError(msg);
      }).finally(() => setPlayPending(null));
    },
    [selectedQueueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]
  );

  const queueControl = useCallback(
    (action: "previous" | "play" | "pause" | "next") => {
      if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
      const cmd =
        action === "play" ? "player_queues/play" :
        action === "pause" ? "player_queues/pause" :
        action === "next" ? "player_queues/next" : "player_queues/previous";
      callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, cmd, { queue_id: selectedQueueId })
        .then((data: unknown) => {
          const err = (data as { error?: string })?.error;
          if (err) setError(err);
        })
        .catch((err) => setError(err instanceof Error ? err.message : "Actie mislukt."));
    },
    [selectedQueueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]
  );

  const seekTo = useCallback(
    (positionSeconds: number) => {
      if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
      setSeekPending(true);
      callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "player_queues/seek", {
        queue_id: selectedQueueId,
        position: positionSeconds,
      })
        .then((data: unknown) => {
          const err = (data as { error?: string })?.error;
          if (err) setError(err);
          else setQueueState((q) => (q ? { ...q, position: positionSeconds } : null));
        })
        .catch((err) => setError(err instanceof Error ? err.message : "Seek mislukt."))
        .finally(() => setSeekPending(false));
    },
    [selectedQueueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]
  );

  const setVolumeLevel = useCallback(
    (pct: number) => {
      if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
      const level = Math.max(0, Math.min(100, pct)) / 100;
      setVolume(Math.round(pct));
      setVolumePending(true);
      callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "config/players/save", {
        player_id: selectedQueueId,
        values: { volume_level: level },
      })
        .then((data: unknown) => {
          const err = (data as { error?: string })?.error;
          if (err) setError(err);
        })
        .catch(() => {})
        .finally(() => setVolumePending(false));
    },
    [selectedQueueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]
  );

  const volumeUp = useCallback(() => {
    if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
    setVolumePending(true);
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "players/cmd/volume_up", {
      player_id: selectedQueueId,
    })
      .then((data: unknown) => {
        const err = (data as { error?: string })?.error;
        if (err) setError(err);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Volume failed"))
      .finally(() => setVolumePending(false));
  }, [selectedQueueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  const volumeDown = useCallback(() => {
    if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
    setVolumePending(true);
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "players/cmd/volume_down", {
      player_id: selectedQueueId,
    })
      .then((data: unknown) => {
        const err = (data as { error?: string })?.error;
        if (err) setError(err);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Volume failed"))
      .finally(() => setVolumePending(false));
  }, [selectedQueueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  const volumeMute = useCallback(() => {
    if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
    setVolumePending(true);
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "players/cmd/volume_mute", {
      player_id: selectedQueueId,
    })
      .then((data: unknown) => {
        const err = (data as { error?: string })?.error;
        if (err) setError(err);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Volume failed"))
      .finally(() => setVolumePending(false));
  }, [selectedQueueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  const useMA = musicAssistant.enabled;
  const playerLabel = (p: MAPlayer) => (p.display_name as string) ?? p.queue_id ?? String(p.queue_id);
  const { t } = useTranslation();

  const showPlayerBar = useMA && maPlayers.length > 0;
  const isPlaying = queueState?.state === "playing";
  const position = queueState?.position ?? 0;
  const duration = queueState?.duration ?? 0;
  const progress = duration > 0 ? Math.min(1, position / duration) : 0;

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
        {(["all", "track", "artist", "album"] as const).map((filter) => (
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
            {filter === "all" ? t("music.filterAll") : filter === "track" ? t("music.filterTrack") : filter === "artist" ? t("music.filterArtist") : t("music.filterAlbum")}
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
              const itemMediaType = (item as { __mediaType?: "track" | "artist" | "album" }).__mediaType;
              const mediaType =
                itemMediaType ?? (searchFilter === "artist" ? "artist" : searchFilter === "album" ? "album" : "track");
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
              return (
                <li
                  key={uri ?? `item-${index}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2.5 hover:bg-white dark:hover:bg-white/10"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Disc3 className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
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
                  <button
                    type="button"
                    onClick={() => canPlay && playOnPlayer(uri)}
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

  return (
    <AppShell
      activeTab="/music"
      headerEndAction={
        useMA && maPlayers.length > 0 ? (
          <button
            type="button"
            onClick={() => setSearchOverlayOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            aria-label={t("music.search")}
          >
            <Search className="h-5 w-5" />
          </button>
        ) : undefined
      }
    >
      {searchOverlay}
      <div className={cn("space-y-6 w-full max-w-full px-4 sm:px-6 overflow-x-hidden", showPlayerBar && "pb-24")}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t("music.title")}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {useMA ? t("music.subtitleMa") : t("music.subtitleHa")}
            </p>
          </div>
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

        {!playersLoading && useMA && maPlayers.length > 0 && (
          <>
            <section className="mt-8">
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">{t("music.recentlyPlayed")}</h3>
              {recentLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
                </div>
              ) : recentItems.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-4">{t("music.noHistory")}</p>
              ) : (
                <div className="w-screen relative left-1/2 -translate-x-1/2">
                  <div className="flex gap-4 overflow-x-auto overflow-y-hidden pb-2 pl-8 pr-4 sm:pl-12 sm:pr-6 scroll-smooth snap-x snap-mandatory scrollbar-hide overscroll-x-contain touch-pan-x">
                  {recentItems.map((item, index) => {
                    const uri = getPlayableUri(item, "track");
                    const imageSrc = getImageSrc(getItemImageUrl(item), musicAssistant.baseUrl, musicAssistant.token);
                    const isPlayPending = uri && playPending === uri;
                    const canPlay = !!uri && !!selectedQueueId;
                    return (
                      <button
                        key={uri || `recent-${index}`}
                        type="button"
                        onClick={() => canPlay && playOnPlayer(uri)}
                        disabled={!canPlay || !!isPlayPending}
                        className="shrink-0 w-40 h-40 sm:w-48 sm:h-48 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent-yellow dark:focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-[var(--page-bg)] disabled:opacity-50 snap-start [scroll-snap-stop:always]"
                        title={item.name as string}
                      >
                        {imageSrc ? (
                          <span className="relative block w-full h-full">
                            <Image src={imageSrc} alt="" fill className="object-cover" sizes="192px" unoptimized />
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
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {showPlayerBar && (
        <footer
          className="fixed bottom-0 left-0 right-0 z-40 flex flex-col border-t border-white/10 bg-gray-900/95 dark:bg-black/90 backdrop-blur-md px-4 sm:px-6 py-2"
          aria-label={t("music.playerBar")}
        >
          {/* Speaker select rechtsboven */}
          <div className="w-full flex justify-end mb-2">
            <select
              value={selectedQueueId ?? ""}
              onChange={(e) => setSelectedQueueId(e.target.value || null)}
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white focus:border-accent-yellow dark:focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-yellow dark:focus:ring-accent-green"
              aria-label={t("music.choosePlayer")}
            >
              {maPlayers.map((p) => (
                <option key={p.queue_id} value={p.queue_id} className="bg-gray-900 text-white">
                  {playerLabel(p)}
                </option>
              ))}
            </select>
          </div>
          {/* Balk: links = hoes + artiest/titel, midden = knoppen + voortgang, rechts = volume */}
          <div className="w-full flex items-center gap-4 sm:gap-6 min-w-0">
            {/* Links: albumhoes, naast artiest (boven) en titel (onder) */}
            <div className="flex items-center gap-3 min-w-[120px] max-w-[220px] sm:max-w-xs shrink-0 flex-shrink-0">
              {(() => {
                const cur = queueState?.current_item as MASearchItem | undefined;
                const coverSrc = cur ? getImageSrc(getItemImageUrl(cur), musicAssistant.baseUrl, musicAssistant.token) : null;
                const artistNames = cur?.artists
                  ? Array.isArray(cur.artists)
                    ? (cur.artists as { name?: string }[]).map((a) => a?.name).filter(Boolean).join(", ")
                    : typeof (cur.artists as { name?: string }).name === "string"
                      ? (cur.artists as { name: string }).name
                      : ""
                  : "";
                return (
                  <>
                    <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-white/10">
                      {coverSrc ? (
                        <Image src={coverSrc} alt="" fill className="object-cover" sizes="56px" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Disc3 className="h-7 w-7 text-white/50" aria-hidden />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-white/70">{artistNames || "—"}</p>
                      <p className="truncate text-sm font-medium text-white/95">{cur?.name ?? "—"}</p>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Midden: vorige / play / volgende, dan voortgang */}
            <div className="flex-1 min-w-0 flex flex-col gap-2 items-center">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => queueControl("previous")}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 hover:bg-white/10 transition-colors"
                  aria-label={t("music.previous")}
                >
                  <SkipBack className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => queueControl(isPlaying ? "pause" : "play")}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-yellow dark:bg-accent-green text-gray-900 hover:opacity-90 transition-opacity"
                  aria-label={isPlaying ? t("music.pause") : t("music.play")}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 fill-current" />
                  ) : (
                    <Play className="h-6 w-6 fill-current ml-0.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => queueControl("next")}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 hover:bg-white/10 transition-colors"
                  aria-label={t("music.next")}
                >
                  <SkipForward className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/70 tabular-nums w-full min-w-0 sm:min-w-[320px] max-w-[560px] sm:max-w-[720px] shrink">
                <span className="w-9 shrink-0">{formatDuration(position)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={position}
                  step={1}
                  disabled={seekPending || duration <= 0}
                  onChange={(e) => seekTo(Number(e.target.value))}
                  className="flex-1 min-w-0 h-1.5 rounded-full appearance-none bg-white/20 accent-accent-yellow dark:accent-accent-green disabled:opacity-50"
                  aria-label={t("music.position")}
                />
                <span className="w-9 shrink-0 text-right">{formatDuration(duration)}</span>
              </div>
            </div>

            {/* Rechts: volume */}
            <div className="relative flex items-center gap-2 shrink-0 w-[140px] sm:w-[180px]" ref={volumePopoverRef}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setVolumePopoverOpen((v) => !v); }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/90 hover:bg-white/10 transition-colors"
                aria-label={t("music.volume")}
                aria-expanded={volumePopoverOpen}
              >
                <Volume2 className="h-5 w-5" />
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolumeLevel(Number(e.target.value))}
                disabled={volumePending}
                className="flex-1 min-w-0 h-2 appearance-none rounded-full bg-white/20 accent-accent-yellow dark:accent-accent-green disabled:opacity-50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-yellow dark:[&::-webkit-slider-thumb]:bg-accent-green [&::-webkit-slider-thumb]:cursor-pointer"
                aria-label={t("music.volume")}
              />
              {volumePopoverOpen && (
                <div
                  className="absolute bottom-full left-0 mb-2 flex flex-col items-center gap-3 rounded-xl border border-white/20 bg-gray-900 dark:bg-black py-4 px-4 shadow-xl min-w-[140px] z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-sm text-white/90 font-medium tabular-nums">{volume}%</span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={volumeDown} disabled={volumePending} className="flex h-8 w-8 items-center justify-center rounded-full text-white/90 hover:bg-white/10 disabled:opacity-50" aria-label={t("music.volumeDown")}>
                      <ChevronDown className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={volumeUp} disabled={volumePending} className="flex h-8 w-8 items-center justify-center rounded-full text-white/90 hover:bg-white/10 disabled:opacity-50" aria-label={t("music.volumeUp")}>
                      <ChevronUp className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={volumeMute} disabled={volumePending} className="flex h-8 w-8 items-center justify-center rounded-full text-white/90 hover:bg-white/10 disabled:opacity-50" aria-label={t("music.volumeMute")}>
                      <VolumeX className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </footer>
      )}
    </AppShell>
  );
}
