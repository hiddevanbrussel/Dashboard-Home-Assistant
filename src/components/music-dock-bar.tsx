"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Disc3,
  Donut,
  Heart,
  ListMusic,
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
import { FOCUS_RING_BRAND } from "@/components/layout/tile-menu";
import { MusicNowPlayingOverlay } from "@/components/music-now-playing-overlay";
import { MusicQueuePanel } from "@/components/music-queue-panel";
import { MusicSpeakerPicker } from "@/components/music-speaker-picker";
import { MusicVolumeSlider } from "@/components/music-volume-slider";
import { callMusicAssistant } from "@/lib/music-assistant";
import { getImageSrc, getItemImageUrl, MUSIC_IMAGE_BLUR, type MASearchItem } from "@/lib/music-item-image";
import { describeNowPlaying, nowPlayingFavoriteUri } from "@/lib/music-now-playing";
import { displayedVolume, volumeFigure, volumePanelText, volumeValueText } from "@/lib/music-volume";
import { cn } from "@/lib/utils";

const ICON_BUTTON =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-200/80 disabled:opacity-50 dark:text-white/90 dark:hover:bg-white/10";
const TOGGLE_ON = "bg-accent-yellow text-gray-900 dark:bg-accent-green";

/**
 * Full-width player bar docked at the bottom of /music: now playing, transport,
 * volume and queue. A tap on the cover or title opens Now playing.
 */
export function MusicDockBar() {
  const { t } = useTranslation();
  const { queueState, selectedQueueId, maPlayers } = useMusicPlayerStore();
  const musicAssistant = useMusicAssistantStore();
  const {
    queueControl,
    seekTo,
    seekPending,
    setVolumeLevel,
    stepVolume,
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
  const volumeButtonRef = useRef<HTMLButtonElement>(null);
  const volumeDownRef = useRef<HTMLButtonElement>(null);
  const volumePanelRef = useRef<HTMLDivElement>(null);
  const volumeDraftRef = useRef<number | null>(null);
  const [queuePos, setQueuePos] = useState<{ bottom: number; right: number } | null>(null);
  const [volumePos, setVolumePos] = useState<{ bottom: number; right: number } | null>(null);
  const [volumeDraft, setVolumeDraft] = useState<number | null>(null);
  const [favoritedUri, setFavoritedUri] = useState<string | null>(null);
  const [favoritePending, setFavoritePending] = useState(false);
  const [nowPlayingOpen, setNowPlayingOpen] = useState(false);
  const [speakerOpen, setSpeakerOpen] = useState<"chip" | "icon" | null>(null);

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
  const position = queueState?.position ?? 0;
  const duration = queueState?.duration ?? 0;
  const currentItemId = typeof cur?.queue_item_id === "string" ? cur.queue_item_id : null;
  const allowedIds = musicAssistant.allowedSpeakerIds;
  const selectablePlayers =
    allowedIds.length > 0 ? maPlayers.filter((player) => allowedIds.includes(player.queue_id)) : maPlayers;
  const showSpeakerPicker = musicAssistant.allowSpeakerSelection && selectablePlayers.length > 1;
  const playerName = (() => {
    const player = maPlayers.find((p) => p.queue_id === selectedQueueId);
    return typeof player?.display_name === "string" ? player.display_name : "";
  })();
  const sliderValue = volumeDraft ?? (volume == null ? 0 : displayedVolume(volume, volumeMuted));
  const volumeLabel = volumeDraft != null ? String(volumeDraft) : volumeFigure(volume, volumeMuted);
  const volumeAnnounced = volumeValueText(volume, volumeDraft);

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

  useEffect(() => {
    if (!volumePos) return;
    volumeDownRef.current?.focus();
    const close = (event: MouseEvent) => {
      const target = event.target as Node;
      if (volumeButtonRef.current?.contains(target) || volumePanelRef.current?.contains(target)) return;
      setVolumePos(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      volumeButtonRef.current?.focus();
      setVolumePos(null);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [volumePos]);

  function rememberDraft(next: number) {
    volumeDraftRef.current = next;
    setVolumeDraft(next);
  }

  /** Send the slider value once, when the finger or key is released, not on every step. */
  function commitVolume() {
    if (volumeDraftRef.current == null) return;
    const next = volumeDraftRef.current;
    volumeDraftRef.current = null;
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

  function openSpeaker(variant: "chip" | "icon") {
    setQueuePos(null);
    setVolumePos(null);
    setSpeakerOpen(variant);
  }

  function toggleVolumePanel() {
    setSpeakerOpen(null);
    setQueuePos(null);
    if (volumePos) {
      setVolumePos(null);
      return;
    }
    const rect = volumeButtonRef.current?.getBoundingClientRect();
    setVolumePos(
      rect
        ? { bottom: Math.max(8, window.innerHeight - rect.top + 12), right: Math.max(12, window.innerWidth - rect.right) }
        : { bottom: 96, right: 12 }
    );
  }

  function changeVolumeBy(delta: number) {
    volumeDraftRef.current = null;
    setVolumeDraft(null);
    stepVolume(delta);
  }

  function toggleQueue() {
    setSpeakerOpen(null);
    setVolumePos(null);
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
          onClick={() => setNowPlayingOpen(true)}
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

      {/* Right: speaker, volume and queue */}
      <div className="flex min-w-0 items-center justify-end gap-1">
        {showSpeakerPicker ? (
          <>
            <MusicSpeakerPicker
              variant="chip"
              className="hidden landscape:xl:flex"
              open={speakerOpen === "chip"}
              onOpenChange={(next) => (next ? openSpeaker("chip") : setSpeakerOpen(null))}
            />
            <MusicSpeakerPicker
              variant="icon"
              className="flex landscape:xl:hidden"
              open={speakerOpen === "icon"}
              onOpenChange={(next) => (next ? openSpeaker("icon") : setSpeakerOpen(null))}
            />
          </>
        ) : null}
        <div className="hidden items-center gap-1 landscape:lg:flex">
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
          <div className="w-40 shrink-0">
            <MusicVolumeSlider
              value={sliderValue}
              width={160}
              disabled={!selectedQueueId}
              label={t("music.volume")}
              valueText={volumeAnnounced}
              onDraft={rememberDraft}
              onCommit={commitVolume}
            />
          </div>
          <span className="w-8 text-sm font-bold tabular-nums">{volumeLabel}</span>
        </div>
        <button
          ref={volumeButtonRef}
          type="button"
          onClick={toggleVolumePanel}
          className={cn(
            "flex h-11 min-w-11 items-center justify-center rounded-full px-2.5 text-sm font-bold tabular-nums outline-none ring-1 ring-gray-500 landscape:lg:hidden dark:ring-white/40",
            FOCUS_RING_BRAND,
            volumePos && "bg-gray-300/80 text-gray-900 dark:bg-white/20 dark:text-white"
          )}
          aria-label={t("music.volumeButton").replace("{n}", volumeLabel)}
          aria-expanded={volumePos != null}
        >
          🔊 <span className="inline-block w-[2ch] text-right">{volumeLabel}</span>
        </button>
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
      {volumePos && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={volumePanelRef}
              className="fixed z-[320] w-[300px] rounded-2xl bg-white/95 p-3 shadow-2xl ring-1 ring-black/10 dark:bg-[#1b1a21] dark:ring-white/10"
              style={{ bottom: volumePos.bottom, right: volumePos.right }}
              data-no-page-swipe
              role="dialog"
              aria-label={t("music.volumePanelTitle").replace("{name}", playerName || "—")}
              onClick={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {t("music.volumePanelTitle").replace("{name}", playerName || "—")}
                  </p>
                  <p className="text-sm font-bold tabular-nums text-gray-900 dark:text-white">
                    {volumePanelText(volumeLabel, t("music.volumePercent"))}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={volumeMute}
                  disabled={!selectedQueueId}
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-700 outline-none hover:bg-gray-200/80 disabled:opacity-50 dark:text-white/90 dark:hover:bg-white/10",
                    FOCUS_RING_BRAND
                  )}
                  aria-label={volumeMuted ? t("music.volumeUnmute") : t("music.volumeMute")}
                  aria-pressed={volumeMuted}
                >
                  {volumeMuted ? <VolumeX className="h-5 w-5" aria-hidden /> : <Volume2 className="h-5 w-5" aria-hidden />}
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button
                  ref={volumeDownRef}
                  type="button"
                  onClick={() => changeVolumeBy(-5)}
                  disabled={!selectedQueueId}
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg text-gray-800 outline-none ring-1 ring-gray-500 disabled:opacity-50 dark:text-white/90 dark:ring-white/40",
                    FOCUS_RING_BRAND
                  )}
                  aria-label={t("music.volumeDown")}
                >
                  −
                </button>
                <MusicVolumeSlider
                  value={sliderValue}
                  width={170}
                  disabled={!selectedQueueId}
                  label={t("music.volume")}
                  valueText={volumeAnnounced}
                  onDraft={rememberDraft}
                  onCommit={commitVolume}
                />
                <button
                  type="button"
                  onClick={() => changeVolumeBy(5)}
                  disabled={!selectedQueueId}
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg text-gray-800 outline-none ring-1 ring-gray-500 disabled:opacity-50 dark:text-white/90 dark:ring-white/40",
                    FOCUS_RING_BRAND
                  )}
                  aria-label={t("music.volumeUp")}
                >
                  +
                </button>
              </div>
            </div>,
            document.body
          )
        : null}
      <MusicNowPlayingOverlay
        open={nowPlayingOpen}
        onClose={() => setNowPlayingOpen(false)}
        coverSrc={coverSrc}
        title={title || "—"}
        artist={artist || "—"}
        isPlaying={isPlaying}
        position={position}
        duration={duration}
        onPlayPause={() => queueControl(isPlaying ? "pause" : "play")}
        onPrevious={() => queueControl("previous")}
        onNext={() => queueControl("next")}
        onSeek={seekTo}
        seekDisabled={seekPending}
        labels={{
          close: t("music.close"),
          play: t("music.play"),
          pause: t("music.pause"),
          previous: t("music.previous"),
          next: t("music.next"),
          position: t("music.position"),
        }}
      />
    </footer>
  );
}
