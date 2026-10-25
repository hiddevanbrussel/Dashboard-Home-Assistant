"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Disc3,
  Donut,
  Heart,
  ListMusic,
  Maximize2,
  Pause,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useMusicPlayerStore } from "@/stores/music-player-store";
import { useMusicAssistantStore } from "@/stores/music-assistant-store";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useMusicPlayerActions } from "@/hooks/use-music-player-actions";
import { useTranslation } from "@/hooks/use-translation";
import { MusicQueuePanel } from "@/components/music-queue-panel";
import { callMusicAssistant } from "@/lib/music-assistant";
import { getImageSrc, getItemImageUrl, MUSIC_IMAGE_BLUR, type MASearchItem } from "@/lib/music-item-image";
import { clampVolume, describeNowPlaying, nowPlayingFavoriteUri } from "@/lib/music-now-playing";
import { cn } from "@/lib/utils";

const ICON_BUTTON =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-200/80 disabled:opacity-50 dark:text-white/90 dark:hover:bg-white/10";
const TOGGLE_ON = "bg-accent-yellow text-gray-900 dark:bg-accent-green";

/**
 * Full-width player bar docked at the bottom of /music: now playing, transport,
 * volume, queue, and a button that opens the large floating player.
 */
export function MusicDockBar({ onExpand }: { onExpand: () => void }) {
  const { t } = useTranslation();
  const { queueState, selectedQueueId, maPlayers } = useMusicPlayerStore();
  const musicAssistant = useMusicAssistantStore();
  const {
    queueControl,
    setVolumeLevel,
    volume,
    volumeMuted,
    volumeMute,
    volumePending,
    shuffleEnabled,
    shufflePending,
    toggleShuffle,
    dontStopTheMusicEnabled,
    dontStopTheMusicPending,
    toggleDontStopTheMusic,
  } = useMusicPlayerActions();

  const queueButtonRef = useRef<HTMLButtonElement>(null);
  const queuePanelRef = useRef<HTMLDivElement>(null);
  const [queuePos, setQueuePos] = useState<{ bottom: number; right: number } | null>(null);
  const [volumeDraft, setVolumeDraft] = useState<number | null>(null);
  const [favoritedUri, setFavoritedUri] = useState<string | null>(null);
  const [favoritePending, setFavoritePending] = useState(false);

  const states = useEntityStateStore((s) => s.states);
  const playingMediaPlayer = Object.values(states).find(
    (e) => e.entity_id.startsWith("media_player.") && (e.state === "playing" || e.state === "paused")
  );

  const cur = queueState?.current_item as (MASearchItem & { stream_title?: string }) | undefined;
  const coverSrc = cur ? getImageSrc(getItemImageUrl(cur), musicAssistant.baseUrl, musicAssistant.token) : null;
  const { title, artist } = describeNowPlaying(cur, {
    title: playingMediaPlayer?.attributes?.media_title as string | undefined,
    artist: playingMediaPlayer?.attributes?.media_artist as string | undefined,
  });
  const favoriteUri = nowPlayingFavoriteUri(cur);
  const favorited = favoriteUri != null && favoriteUri === favoritedUri;
  const isPlaying = queueState?.state === "playing";
  const currentItemId = typeof cur?.queue_item_id === "string" ? cur.queue_item_id : null;
  const playerName = (() => {
    const player = maPlayers.find((p) => p.queue_id === selectedQueueId);
    return typeof player?.display_name === "string" ? player.display_name : "";
  })();
  const shownVolume = volumeDraft ?? (volumeMuted ? 0 : volume);

  useEffect(() => {
    if (!queuePos) return;
    const close = (event: MouseEvent) => {
      const target = event.target as Node;
      if (queueButtonRef.current?.contains(target) || queuePanelRef.current?.contains(target)) return;
      setQueuePos(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setQueuePos(null);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [queuePos]);

  /** Send the slider value once, when the finger or key is released, not on every step. */
  function commitVolume() {
    if (volumeDraft == null) return;
    const next = volumeDraft;
    setVolumeDraft(null);
    if (next !== volume || volumeMuted) setVolumeLevel(next);
  }

  async function addFavorite() {
    if (!favoriteUri || favorited || favoritePending || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
    setFavoritePending(true);
    try {
      const data = await callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "music/favorites/add_item", {
        item: favoriteUri,
      });
      if (!(data as { error?: string })?.error) setFavoritedUri(favoriteUri);
    } finally {
      setFavoritePending(false);
    }
  }

  function toggleQueue() {
    if (queuePos) {
      setQueuePos(null);
      return;
    }
    const rect = queueButtonRef.current?.getBoundingClientRect();
    setQueuePos(
      rect
        ? { bottom: Math.max(8, window.innerHeight - rect.top + 12), right: Math.max(12, window.innerWidth - rect.right) }
        : { bottom: 96, right: 12 }
    );
  }

  return (
    <footer
      className={cn(
        "fixed z-[41] left-2 right-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] sm:left-3 sm:right-3",
        "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-4",
        "rounded-[1.35rem] py-2 pl-2 pr-2 sm:pr-3",
        "bg-white/90 shadow-[0_8px_28px_rgba(15,23,42,0.16)] backdrop-blur-md ring-1 ring-black/[0.06]",
        "dark:bg-gray-900/95 dark:shadow-[0_8px_28px_rgba(0,0,0,0.45)] dark:ring-white/10",
        "text-gray-900 dark:text-white animate-music-bar-in"
      )}
      aria-label={t("music.playerBar")}
      data-no-page-swipe
    >
      {/* Left: cover, title and artist, favourite */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onExpand}
          className="flex min-h-11 min-w-0 items-center gap-3 rounded-2xl pr-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow dark:focus-visible:ring-accent-green"
          aria-label={t("music.nowPlayingOpen")}
        >
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-white/10">
            {coverSrc ? (
              <Image
                src={coverSrc}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
                placeholder="blur"
                blurDataURL={MUSIC_IMAGE_BLUR}
                unoptimized
              />
            ) : (
              <Disc3 className="m-3.5 h-5 w-5 text-gray-600 dark:text-white/70" aria-hidden />
            )}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold">{title || "—"}</span>
            <span className="block truncate text-sm text-gray-600 dark:text-white/70">{artist || playerName || "—"}</span>
          </span>
        </button>
        {favoriteUri ? (
          <button
            type="button"
            onClick={addFavorite}
            disabled={favoritePending}
            className={cn(ICON_BUTTON, "hidden sm:flex")}
            aria-label={favorited ? t("music.favorited") : t("music.addToFavorites")}
            aria-pressed={favorited}
          >
            <Heart className={cn("h-5 w-5", favorited && "fill-current text-rose-600 dark:text-rose-400")} aria-hidden />
          </button>
        ) : null}
      </div>

      {/* Centre: shuffle, previous, play/pause, next, keep playing */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={toggleShuffle}
          disabled={shufflePending}
          className={cn(ICON_BUTTON, shuffleEnabled && TOGGLE_ON)}
          aria-label={t("music.shuffle")}
          aria-pressed={shuffleEnabled}
        >
          <Shuffle className="h-5 w-5" aria-hidden />
        </button>
        <button type="button" onClick={() => queueControl("previous")} className={ICON_BUTTON} aria-label={t("music.previous")}>
          <SkipBack className="h-5 w-5 fill-current" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => queueControl(isPlaying ? "pause" : "play")}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-yellow text-gray-900 transition-opacity hover:opacity-90 dark:bg-accent-green"
          aria-label={isPlaying ? t("music.pause") : t("music.play")}
        >
          {isPlaying ? <Pause className="h-6 w-6 fill-current" aria-hidden /> : <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden />}
        </button>
        <button type="button" onClick={() => queueControl("next")} className={ICON_BUTTON} aria-label={t("music.next")}>
          <SkipForward className="h-5 w-5 fill-current" aria-hidden />
        </button>
        <button
          type="button"
          onClick={toggleDontStopTheMusic}
          disabled={dontStopTheMusicPending}
          className={cn(ICON_BUTTON, dontStopTheMusicEnabled && TOGGLE_ON)}
          aria-label={t("music.dontStopTheMusic")}
          aria-pressed={dontStopTheMusicEnabled}
        >
          <Donut className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {/* Right: volume, queue, open the large player */}
      <div className="flex min-w-0 items-center justify-end gap-1">
        <button
          type="button"
          onClick={volumeMute}
          disabled={volumePending}
          className={ICON_BUTTON}
          aria-label={volumeMuted ? t("music.volumeUnmute") : t("music.volumeMute")}
          aria-pressed={volumeMuted}
        >
          {volumeMuted ? <VolumeX className="h-5 w-5" aria-hidden /> : <Volume2 className="h-5 w-5" aria-hidden />}
        </button>
        <div className="relative hidden h-11 w-28 items-center md:flex lg:w-32">
          <div className="pointer-events-none absolute inset-x-0 h-1.5 rounded-full bg-gray-300/80 dark:bg-white/20" aria-hidden>
            <div className="h-full rounded-full bg-gray-800 dark:bg-white/90" style={{ width: `${shownVolume}%` }} />
          </div>
          <span
            className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 rounded-full bg-gray-800 shadow ring-2 ring-white dark:bg-white dark:ring-gray-900"
            style={{ left: `${shownVolume}%` }}
            aria-hidden
          />
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={shownVolume}
            disabled={!selectedQueueId}
            onChange={(event) => setVolumeDraft(clampVolume(Number(event.target.value)))}
            onPointerUp={commitVolume}
            onKeyUp={commitVolume}
            onBlur={commitVolume}
            className="absolute inset-0 h-11 w-full cursor-pointer appearance-none opacity-0 disabled:cursor-default"
            aria-label={t("music.volume")}
          />
        </div>
        {selectedQueueId ? (
          <button
            ref={queueButtonRef}
            type="button"
            onClick={toggleQueue}
            className={cn(ICON_BUTTON, queuePos && "bg-gray-300/80 text-gray-900 dark:bg-white/20 dark:text-white")}
            aria-label={t("music.queue")}
            aria-expanded={queuePos != null}
          >
            <ListMusic className="h-5 w-5" aria-hidden />
          </button>
        ) : null}
        <button type="button" onClick={onExpand} className={ICON_BUTTON} aria-label={t("music.expandPlayer")}>
          <Maximize2 className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {queuePos && selectedQueueId && typeof document !== "undefined"
        ? createPortal(
            <MusicQueuePanel
              key={selectedQueueId}
              queueId={selectedQueueId}
              playerName={playerName}
              currentItemId={currentItemId}
              position={queuePos}
              panelRef={queuePanelRef}
            />,
            document.body
          )
        : null}
    </footer>
  );
}
