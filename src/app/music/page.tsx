"use client";

import { useEffect, useState, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/layout/glass-card";
import { MediaCardWidget } from "@/components/widgets";
import { OfflinePill } from "@/components/offline-pill";
import { Music2, Search, Play, Pause, Mic2, Disc3, User, SkipBack, SkipForward, Volume2 } from "lucide-react";
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

function callMusicAssistant(
  baseUrl: string,
  token: string,
  command: string,
  args: Record<string, unknown> = {}
): Promise<unknown> {
  return fetch("/api/music-assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ baseUrl, token, command, args }),
  }).then((r) => r.json());
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
  const musicAssistant = useMusicAssistantStore();

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
    if (!musicAssistant.enabled || !musicAssistant.baseUrl || !selectedQueueId) return;
    const fetchState = () => {
      callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "player_queues/get", {
        queue_id: selectedQueueId,
      })
        .then((data: unknown) => {
          const err = (data as { error?: string })?.error;
          if (err) return;
          const r = data as { result?: { state?: string; elapsed_time?: number; current_item?: { duration?: number; name?: string }; volume_level?: number } };
          const res = r?.result ?? r;
          const state = res?.state as string | undefined;
          const elapsed = (res as { elapsed_time?: number })?.elapsed_time ?? (res as { position?: number })?.position;
          const cur = res?.current_item ?? (res as { current_item?: { duration?: number; name?: string } })?.current_item;
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
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/search", {
      search_query: searchQuery.trim(),
      limit: 24,
    })
      .then((data: unknown) => {
        const err = (data as { error?: string })?.error;
        if (err) {
          setError(err);
          return;
        }
        const raw = (data as { result?: { tracks?: MASearchItem[]; track?: MASearchItem[] } })?.result;
        const tracks = raw?.tracks ?? raw?.track ?? (Array.isArray(raw) ? raw : []);
        setSearchResults(Array.isArray(tracks) ? tracks : []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Zoeken mislukt."))
      .finally(() => setSearching(false));
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, searchQuery]);

  const playOnPlayer = useCallback(
    (uri: string) => {
      if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
      setPlayPending(uri);
      const baseUrl = musicAssistant.baseUrl;
      const token = musicAssistant.token;
      const queueId = selectedQueueId;

      callMusicAssistant(baseUrl, token, "player_queues/add", {
          queue_id: queueId,
          uri,
        })
          .then((addData: unknown) => {
            const addErr = (addData as { error?: string })?.error;
            if (addErr) throw new Error(addErr);
            return callMusicAssistant(baseUrl, token, "player_queues/play", { queue_id: queueId });
          })
          .then((playData: unknown) => {
            const playErr = (playData as { error?: string })?.error;
            if (playErr) throw new Error(playErr);
          })
          .catch((err) => setError(err instanceof Error ? err.message : "Afspelen mislukt."))
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

  return (
    <AppShell activeTab="/music">
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
                Speler kiezen
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Muziek wordt afgespeeld op de geselecteerde speler.
              </p>
              <div className="flex flex-wrap gap-2">
                {maPlayers.map((p) => {
                  const id = p.queue_id;
                  const isSelected = selectedQueueId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedQueueId(id)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                        isSelected
                          ? "bg-accent-yellow text-gray-900 dark:bg-accent-green dark:text-gray-900"
                          : "bg-white/80 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/20 hover:bg-white dark:hover:bg-white/20"
                      )}
                    >
                      <Mic2 className="h-4 w-4" aria-hidden />
                      {playerLabel(p)}
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-card-title font-medium text-gray-700 dark:text-gray-200 mb-3">
                Zoek muziek
              </h3>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    aria-hidden
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && runSearch()}
                    placeholder="Artiest, nummer of album…"
                    className="w-full rounded-xl border border-gray-200 dark:border-white/20 bg-white/80 dark:bg-white/10 pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:border-accent-yellow dark:focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-yellow dark:focus:ring-accent-green"
                    aria-label="Zoek muziek"
                  />
                </div>
                <button
                  type="button"
                  onClick={runSearch}
                  disabled={searching || !searchQuery.trim()}
                  className="rounded-xl bg-accent-yellow dark:bg-accent-green px-4 py-2.5 text-sm font-medium text-gray-900 disabled:opacity-50"
                >
                  {searching ? "Zoeken…" : "Zoeken"}
                </button>
              </div>
            </GlassCard>

            {searchResults.length > 0 && (
              <GlassCard>
                <h3 className="text-card-title font-medium text-gray-700 dark:text-gray-200 mb-3">
                  Resultaten
                </h3>
                <ul className="space-y-1" role="list">
                  {searchResults.map((item, index) => {
                    const uri = item.uri ?? (item as { item_id?: string })?.item_id;
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
                        className="flex items-center gap-3 rounded-xl border border-transparent bg-white/50 dark:bg-white/5 px-3 py-2.5 hover:bg-white/80 dark:hover:bg-white/10"
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
              </GlassCard>
            )}

            {searchQuery.trim() && !searching && searchResults.length === 0 && (
              <GlassCard>
                <div className="flex items-center gap-3 py-6 text-gray-500 dark:text-gray-400">
                  <User className="h-10 w-10 shrink-0" aria-hidden />
                  <p className="text-sm">Geen resultaten voor &quot;{searchQuery.trim()}&quot;. Probeer een andere zoekterm.</p>
                </div>
              </GlassCard>
            )}
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

            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs text-white/70 tabular-nums">
                <span>{formatDuration(position)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={position}
                  step={1}
                  disabled={seekPending || duration <= 0}
                  onChange={(e) => seekTo(Number(e.target.value))}
                  className="flex-1 h-1.5 rounded-full appearance-none bg-white/20 accent-accent-yellow dark:accent-accent-green disabled:opacity-50"
                  aria-label="Afspeelpositie"
                />
                <span>{formatDuration(duration)}</span>
              </div>
              {queueState?.current_item?.name && (
                <p className="truncate text-sm text-white/90 font-medium">
                  {queueState.current_item.name}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Volume2 className="h-5 w-5 shrink-0 text-white/70" aria-hidden />
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolumeLevel(Number(e.target.value))}
                disabled={volumePending}
                className="w-20 sm:w-24 h-1.5 rounded-full appearance-none bg-white/20 accent-accent-yellow dark:accent-accent-green disabled:opacity-50"
                aria-label="Volume"
              />
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
