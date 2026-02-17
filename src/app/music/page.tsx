"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/layout/glass-card";
import { MediaCardWidget } from "@/components/widgets";
import { OfflinePill } from "@/components/offline-pill";
import { Music2, Search, Play, Pause, Disc3, User, SkipBack, SkipForward, Volume2, X } from "lucide-react";
import { useMusicAssistantStore, hydrateMusicAssistantStore } from "@/stores/music-assistant-store";
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
  album?: { name?: string };
  [key: string]: unknown;
};

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
  const [searchResults, setSearchResults] = useState<MASearchItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
  const [playPending, setPlayPending] = useState<string | null>(null);
  const [queueState, setQueueState] = useState<{
    state?: "playing" | "paused" | "idle";
    position?: number;
    duration?: number;
    current_item?: { name?: string; [key: string]: unknown };
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
  const musicAssistant = useMusicAssistantStore();

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
          const r = data as { result?: { state?: string; elapsed_time?: number; current_item?: { duration?: number; name?: string }; volume_level?: number } } | Record<string, unknown>;
          type QueueStateRes = { state?: string; elapsed_time?: number; position?: number; current_item?: { duration?: number; name?: string } };
          const res = (r?.result ?? r) as QueueStateRes | null | undefined;
          const state = res?.state;
          const elapsed = res?.elapsed_time ?? res?.position;
          const cur = res?.current_item;
          const duration = cur?.duration;
          setQueueState({
            state: state === "playing" ? "playing" : state === "paused" ? "paused" : "idle",
            position: typeof elapsed === "number" ? elapsed : undefined,
            duration: typeof duration === "number" ? duration : undefined,
            current_item: cur ? { name: (cur as { name?: string }).name } : undefined,
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
    const argsList: Record<string, unknown>[] = [
      { search_query: query, limit: 24 },
      { query, limit: 24 },
      { name: query, limit: 24 },
    ];
    const commands = ["music/search", "search"] as const;
    function parseTracks(data: unknown): MASearchItem[] {
      const d = data as Record<string, unknown>;
      const result = d?.result ?? d;
      const resultObj = typeof result === "object" && result !== null ? (result as Record<string, unknown>) : {};
      if (Array.isArray(resultObj.tracks)) return resultObj.tracks as MASearchItem[];
      if (Array.isArray(resultObj.track)) return resultObj.track as MASearchItem[];
      if (Array.isArray(result)) return result as MASearchItem[];
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
          const tracks = parseTracks(data);
          setSearchResults(tracks);
        }
      );
    tryAttempt(0, 0).catch((err) => setError(err instanceof Error ? err.message : "Zoeken mislukt.")).finally(() => setSearching(false));
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, searchQuery]);

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

      const tryMusicQueueAddAndPlay = (args: { queue_id?: string; player_id?: string; uri: string }): Promise<void> =>
      callMusicAssistant(baseUrl, token, "music/queue/add_item", args).then((addData: unknown) => {
        const e = (addData as { error?: string })?.error;
        if (e) throw new Error(e);
        return callMusicAssistant(baseUrl, token, "music/queue/play", { queue_id: queueId });
      }).then((playData: unknown) => {
        const e = (playData as { error?: string })?.error;
        if (e) throw new Error(e);
      });

    const tryPlayerQueuesAddAndPlay = (addArgs: Record<string, unknown>): Promise<void> =>
      callMusicAssistant(baseUrl, token, "player_queues/add", addArgs).then((addData: unknown) => {
        const addErr = (addData as { error?: string })?.error;
        if (addErr) throw new Error(addErr);
        return callMusicAssistant(baseUrl, token, "player_queues/play", { queue_id: queueId });
      }).then((playData: unknown) => {
        const playErr = (playData as { error?: string })?.error;
        if (playErr) throw new Error(playErr);
      });

    tryMusicQueueAddAndPlay({ queue_id: queueId, uri: trimmedUri })
      .catch(() => tryMusicQueueAddAndPlay({ player_id: queueId, uri: trimmedUri }))
      .catch(() => tryPlayerQueuesAddAndPlay({ queue_id: queueId, uri: trimmedUri }))
      .catch(() => tryPlayerQueuesAddAndPlay({ queue_id: queueId, item: trimmedUri }))
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Afspelen mislukt.";
        setError(msg);
      })
      .finally(() => setPlayPending(null));
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

  const useMA = musicAssistant.enabled;
  const playerLabel = (p: MAPlayer) => (p.display_name as string) ?? p.queue_id ?? String(p.queue_id);

  const showPlayerBar = useMA && maPlayers.length > 0;
  const isPlaying = queueState?.state === "playing";
  const position = queueState?.position ?? 0;
  const duration = queueState?.duration ?? 0;
  const progress = duration > 0 ? Math.min(1, position / duration) : 0;

  const searchOverlay = searchOverlayOpen && typeof document !== "undefined" && createPortal(
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-page-light dark:bg-dark-page"
      role="dialog"
      aria-label="Zoek muziek"
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
          placeholder="Artiest, nummer of album…"
          className="flex-1 min-w-0 rounded-xl border border-gray-200 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:border-accent-yellow dark:focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-yellow dark:focus:ring-accent-green"
          aria-label="Zoek muziek"
        />
        <button
          type="button"
          onClick={runSearch}
          disabled={searching || !searchQuery.trim()}
          className="shrink-0 rounded-xl bg-accent-yellow dark:bg-accent-green px-4 py-2.5 text-sm font-medium text-gray-900 disabled:opacity-50"
        >
          {searching ? "Zoeken…" : "Zoeken"}
        </button>
        <button
          type="button"
          onClick={() => setSearchOverlayOpen(false)}
          className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
          aria-label="Sluiten"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-auto px-4 py-4">
        {selectedQueueId && maPlayers.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-3">
            Afspelen op: <span className="font-medium text-gray-900 dark:text-white">{playerLabel(maPlayers.find((p) => p.queue_id === selectedQueueId) ?? { queue_id: selectedQueueId })}</span>
          </p>
        )}
        {searchResults.length > 0 ? (
          <ul className="space-y-1 max-w-2xl mx-auto" role="list">
            {searchResults.map((item, index) => {
              const rawUri = item.uri ?? (item as { item_uri?: string })?.item_uri;
              const itemId = item.item_id ?? (item as { item_id?: number | string })?.item_id;
              const uri = typeof rawUri === "string" && rawUri
                ? rawUri
                : itemId != null
                  ? `${(item as { provider?: string })?.provider ?? "library"}://track/${itemId}`
                  : "";
              const name = item.name ?? "Onbekend";
              const artists = item.artists;
              const artistNames = Array.isArray(artists)
                ? artists.map((a) => (a && typeof a === "object" && "name" in a ? (a as { name?: string }).name : null)).filter(Boolean).join(", ") || "—"
                : artists && typeof artists === "object" && "name" in artists
                  ? (artists as { name?: string }).name
                  : "—";
              const albumName = item.album?.name;
              const duration = item.duration;
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
                    title={`Afspelen op ${selectedQueueId ? playerLabel(maPlayers.find((x) => x.queue_id === selectedQueueId) ?? { queue_id: selectedQueueId }) : "speler"}`}
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
            <p className="text-sm">Geen resultaten voor &quot;{searchQuery.trim()}&quot;. Probeer een andere zoekterm.</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto py-8">
            Voer een zoekterm in en klik op Zoeken of druk op Enter.
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
            aria-label="Zoek muziek"
          >
            <Search className="h-5 w-5" />
          </button>
        ) : undefined
      }
    >
      {searchOverlay}
      <div className={cn("space-y-6 max-w-3xl", showPlayerBar && "pb-24")}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Muziek</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {useMA
                ? "Zoek muziek en speel af op een gekozen speler."
                : "Bedien je media players via Home Assistant."}
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
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Geen media players gevonden</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                Voeg de Sonos-integratie (of een andere media player) toe in Home Assistant, of schakel Music
                Assistant in onder Instellingen.
              </p>
            </div>
          </GlassCard>
        )}

        {!playersLoading && useMA && maPlayers.length === 0 && (
          <GlassCard>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Music2 className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Geen spelers gevonden</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                Controleer of Music Assistant draait en of er spelers zijn gekoppeld.
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
            <GlassCard>
              <h3 className="text-card-title font-medium text-gray-700 dark:text-gray-200 mb-3">
                Onlangs afgespeeld
              </h3>
              {recentLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" aria-hidden />
                </div>
              ) : recentItems.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-4">Nog geen afspeelgeschiedenis.</p>
              ) : (
                <ul className="space-y-1" role="list">
                  {recentItems.map((item, index) => {
                    const rawUri = item.uri ?? (item as { item_uri?: string })?.item_uri;
                    const itemId = item.item_id ?? (item as { item_id?: number | string })?.item_id;
                    const uri = typeof rawUri === "string" && rawUri ? rawUri : itemId != null ? `${(item as { provider?: string })?.provider ?? "library"}://track/${itemId}` : "";
                    const name = item.name ?? "Onbekend";
                    const artists = item.artists;
                    const artistNames = Array.isArray(artists) ? artists.map((a) => (a && typeof a === "object" && "name" in a ? (a as { name?: string }).name : null)).filter(Boolean).join(", ") || "—" : artists && typeof artists === "object" && "name" in artists ? (artists as { name?: string }).name : "—";
                    const albumName = item.album?.name;
                    const duration = item.duration;
                    const isPlayPending = uri && playPending === uri;
                    const canPlay = !!uri && !!selectedQueueId;
                    return (
                      <li key={uri || `recent-${index}`} className="flex items-center gap-3 rounded-xl border border-transparent bg-white/50 dark:bg-white/5 px-3 py-2.5 hover:bg-white/80 dark:hover:bg-white/10">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                          <Disc3 className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-gray-900 dark:text-white">{name}</p>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">{artistNames}{albumName ? ` · ${albumName}` : ""}</p>
                        </div>
                        <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400 tabular-nums">{formatDuration(duration)}</span>
                        <button
                          type="button"
                          onClick={() => canPlay && playOnPlayer(uri)}
                          disabled={!canPlay || !!isPlayPending}
                          className="shrink-0 rounded-full bg-accent-yellow p-2 text-gray-900 hover:opacity-90 disabled:opacity-50 dark:bg-accent-green dark:text-gray-900"
                          title={`Afspelen op ${selectedQueueId ? playerLabel(maPlayers.find((x) => x.queue_id === selectedQueueId) ?? { queue_id: selectedQueueId }) : "speler"}`}
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
            </GlassCard>
          </>
        )}
      </div>

      {showPlayerBar && (
        <footer
          className="fixed bottom-0 left-0 right-0 z-40 flex items-center border-t border-white/10 bg-gray-900/95 dark:bg-black/90 backdrop-blur-md px-4 sm:px-6 py-3"
          aria-label="Afspeelbalk"
        >
          <div className="w-full flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => queueControl("previous")}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 hover:bg-white/10 transition-colors"
                aria-label="Vorige"
              >
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => queueControl(isPlaying ? "pause" : "play")}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-yellow dark:bg-accent-green text-gray-900 hover:opacity-90 transition-opacity"
                aria-label={isPlaying ? "Pauzeren" : "Afspelen"}
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
                aria-label="Volgende"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-1 max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-white/70 tabular-nums">
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
                  aria-label="Afspeelpositie"
                />
                <span className="w-9 shrink-0 text-right">{formatDuration(duration)}</span>
              </div>
              {queueState?.current_item?.name && (
                <p className="truncate text-sm text-white/90 font-medium">
                  {queueState.current_item.name}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="relative" ref={volumePopoverRef}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setVolumePopoverOpen((v) => !v); }}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 hover:bg-white/10 transition-colors"
                  aria-label="Volume"
                  aria-expanded={volumePopoverOpen}
                >
                  <Volume2 className="h-5 w-5" />
                </button>
                {volumePopoverOpen && (
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center gap-2 rounded-xl border border-white/20 bg-gray-900 dark:bg-black py-3 px-3 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs text-white/70 tabular-nums">{volume}%</span>
                    <div className="h-24 w-2 flex items-center justify-center">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={volume}
                        onChange={(e) => setVolumeLevel(Number(e.target.value))}
                        disabled={volumePending}
                        className="w-24 h-2 appearance-none rounded-full bg-white/20 accent-accent-yellow dark:accent-accent-green disabled:opacity-50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-yellow dark:[&::-webkit-slider-thumb]:bg-accent-green"
                        style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                        aria-label="Volume"
                      />
                    </div>
                  </div>
                )}
              </div>
              <select
                value={selectedQueueId ?? ""}
                onChange={(e) => setSelectedQueueId(e.target.value || null)}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:border-accent-yellow dark:focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-yellow dark:focus:ring-accent-green"
                aria-label="Speler kiezen"
              >
                {maPlayers.map((p) => (
                  <option key={p.queue_id} value={p.queue_id} className="bg-gray-900 text-white">
                    {playerLabel(p)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </footer>
      )}
    </AppShell>
  );
}
