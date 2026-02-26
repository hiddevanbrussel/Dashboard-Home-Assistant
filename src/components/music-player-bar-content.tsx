"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
  Disc3,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Donut,
  Speaker,
  CircleMinus,
  CirclePlus,
  VolumeX,
  Volume2,
  ChevronDown,
} from "lucide-react";
import { useMusicPlayerStore, type MAPlayer } from "@/stores/music-player-store";
import { useMusicAssistantStore } from "@/stores/music-assistant-store";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useMusicPlayerActions } from "@/hooks/use-music-player-actions";
import { getItemImageUrl, getImageSrc, formatDuration, MUSIC_IMAGE_BLUR, type MASearchItem } from "@/lib/music-item-image";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

function playerLabel(p: MAPlayer): string {
  return (p.display_name as string) ?? p.queue_id ?? String(p.queue_id);
}

type MusicPlayerBarContentProps = {
  /** Show speaker picker in the bar */
  allowSpeakerSelection?: boolean;
  /** Called when user closes the bar (e.g. in GlobalMusicBar) */
  onClose?: () => void;
  /** Play slide-up animation when bar appears (e.g. when opening from tab) */
  animateOpen?: boolean;
};

export function MusicPlayerBarContent({ allowSpeakerSelection = true, onClose, animateOpen = false }: MusicPlayerBarContentProps) {
  const { t } = useTranslation();
  const speakerPopoverRef = useRef<HTMLDivElement>(null);
  const [speakerPopoverOpen, setSpeakerPopoverOpen] = useState(false);

  const { maPlayers, queueState, selectedQueueId, setSelectedQueueId } = useMusicPlayerStore();
  const musicAssistant = useMusicAssistantStore();
  const {
    queueControl,
    seekTo,
    volumeUp,
    volumeDown,
    volumeMute,
    volumeMuted,
    volume,
    volumePending,
    seekPending,
    dontStopTheMusicEnabled,
    dontStopTheMusicPending,
    toggleDontStopTheMusic,
  } = useMusicPlayerActions();

  const isPlaying = queueState?.state === "playing";
  const position = queueState?.position ?? 0;
  const duration = queueState?.duration ?? 0;
  const allowedIds = musicAssistant.allowedSpeakerIds;
  const selectablePlayers = allowedIds.length > 0 ? maPlayers.filter((p) => allowedIds.includes(p.queue_id)) : maPlayers;

  useEffect(() => {
    if (!speakerPopoverOpen) return;
    const close = (e: MouseEvent) => {
      if (speakerPopoverRef.current?.contains(e.target as Node)) return;
      setSpeakerPopoverOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [speakerPopoverOpen]);

  const states = useEntityStateStore((s) => s.states);
  const playingMediaPlayer = Object.values(states).find(
    (e) => e.entity_id.startsWith("media_player.") && (e.state === "playing" || e.state === "paused")
  );
  const haArtist = (playingMediaPlayer?.attributes?.media_artist as string)?.trim() || "";
  const haTitle = (playingMediaPlayer?.attributes?.media_title as string)?.trim() || "";

  const cur = queueState?.current_item as (MASearchItem & { artist?: string; stream_title?: string }) | undefined;
  const coverSrc = cur ? getImageSrc(getItemImageUrl(cur), musicAssistant.baseUrl, musicAssistant.token) : null;
  const hasStreamTitle = typeof cur?.stream_title === "string" && cur.stream_title.trim().length > 0;
  const stationName = typeof cur?.name === "string" ? cur.name.trim() : "";
  let artistLine =
    cur?.artists != null
      ? Array.isArray(cur.artists)
        ? (cur.artists as { name?: string }[]).map((a) => a?.name).filter(Boolean).join(", ")
        : typeof (cur?.artists as { name?: string })?.name === "string"
          ? (cur.artists as { name: string }).name
          : ""
      : typeof cur?.artist === "string"
        ? cur.artist.trim()
        : "";
  let titleLine =
    hasStreamTitle
      ? cur!.stream_title!.trim()
      : stationName
        ? stationName
        : "";
  if (hasStreamTitle && stationName && !artistLine) {
    artistLine = stationName;
  }
  if (titleLine && !artistLine && !hasStreamTitle) {
    const combined = titleLine;
    const sep = combined.match(/\s*[\-\u2013\u2014]\s+|\s*:\s+/)?.index;
    if (typeof sep === "number" && sep > 0) {
      artistLine = combined.slice(0, sep).trim();
      titleLine = combined.slice(sep).replace(/^\s*[\-\u2013\u2014:]+\s*/, "").trim();
    }
  }
  if (haArtist) artistLine = haArtist;
  if (haTitle) titleLine = haTitle;

  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 right-0 flex flex-col border-t overflow-visible",
        "border-gray-200/60 dark:border-white/10",
        speakerPopoverOpen ? "z-[200]" : "z-40",
        animateOpen && "animate-music-bar-in"
      )}
      aria-label={t("music.playerBar")}
    >
      {/* Light mode: zachter; dark mode: donkere bar */}
      <div className="absolute inset-0 z-0 bg-white/85 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/50 dark:border-transparent" aria-hidden />
      {/* Album cover alleen links, zacht uitfaden (mask + gradient, geen harde rand) */}
      {coverSrc && (
        <div
          className="image-theme-fixed absolute left-0 top-0 bottom-0 z-[1] w-[min(300px,38vw)] overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, black 0%, black 15%, transparent 55%)",
            WebkitMaskImage: "linear-gradient(to right, black 0%, black 15%, transparent 55%)",
          }}
          aria-hidden
        >
          <Image
            src={coverSrc}
            alt=""
            fill
            className="object-cover object-left scale-105"
            sizes="300px"
            priority={false}
            unoptimized
          />
          <div
            className="absolute inset-0 hidden dark:block"
            style={{
              background: "linear-gradient(to right, transparent 0%, rgba(17,17,17,0.75) 25%, rgba(17,17,17,0.95) 50%, rgba(17,17,17,1) 100%)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 block dark:hidden"
            style={{
              background: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.55) 25%, rgba(255,255,255,0.88) 50%, rgba(255,255,255,1) 100%)",
            }}
            aria-hidden
          />
        </div>
      )}
      <div className="relative z-10 flex w-full flex-col px-4 py-2 sm:px-6">
      <div className="w-full flex items-center gap-4 sm:gap-6 min-w-0">
        {/* Left: cover + artist/title */}
        <div className="flex items-center gap-3 min-w-[120px] max-w-[220px] sm:max-w-xs shrink-0 flex-shrink-0">
          <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-200/80 dark:bg-white/10">
            {coverSrc ? (
              <Image
                src={coverSrc}
                alt=""
                fill
                className="object-cover"
                sizes="56px"
                placeholder="blur"
                blurDataURL={MUSIC_IMAGE_BLUR}
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Disc3 className="h-7 w-7 text-gray-500 dark:text-white/50" aria-hidden />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 flex flex-col gap-0.5">
            <p className="truncate text-xs text-gray-600 dark:text-white/70">{artistLine || "—"}</p>
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white/95">{titleLine || "—"}</p>
          </div>
        </div>

        {/* Center: prev / play / next / dont-stop, then seek */}
        <div className="flex-1 min-w-0 flex flex-col gap-2 items-center">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => queueControl("previous")}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 dark:text-white/90 hover:bg-gray-200/80 dark:hover:bg-white/10 transition-colors"
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
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 dark:text-white/90 hover:bg-gray-200/80 dark:hover:bg-white/10 transition-colors"
              aria-label={t("music.next")}
            >
              <SkipForward className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={toggleDontStopTheMusic}
              disabled={dontStopTheMusicPending}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                dontStopTheMusicEnabled
                  ? "bg-accent-yellow dark:bg-accent-green text-gray-900"
                  : "text-gray-700 dark:text-white/90 hover:bg-gray-200/80 dark:hover:bg-white/10"
              )}
              aria-label={t("music.dontStopTheMusic")}
              title={t("music.dontStopTheMusic")}
            >
              <Donut className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-white/70 tabular-nums w-full min-w-0 sm:min-w-[320px] max-w-[560px] sm:max-w-[720px] shrink">
            <span className="w-9 shrink-0">{formatDuration(position)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={position}
              step={1}
              disabled={seekPending || duration <= 0}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="flex-1 min-w-0 h-1.5 rounded-full appearance-none bg-gray-300/80 dark:bg-white/20 accent-accent-yellow dark:accent-accent-green disabled:opacity-50"
              aria-label={t("music.position")}
            />
            <span className="w-9 shrink-0 text-right">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Right: optional close, speaker picker, volume */}
        <div className="relative flex items-center gap-1 shrink-0">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700 dark:text-white/90 hover:bg-gray-200/80 dark:hover:bg-white/10 transition-colors"
              aria-label={t("music.close")}
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          )}
          {allowSpeakerSelection && selectablePlayers.length > 0 && (
            <div className="relative flex items-center gap-2" ref={speakerPopoverRef}>
              <span className="hidden sm:inline text-xs font-medium text-gray-600 dark:text-white/70 truncate max-w-[120px]" title={selectedQueueId ? playerLabel(selectablePlayers.find((p) => p.queue_id === selectedQueueId) ?? { queue_id: selectedQueueId }) : ""}>
                {selectedQueueId ? playerLabel(selectablePlayers.find((p) => p.queue_id === selectedQueueId) ?? { queue_id: selectedQueueId }) : ""}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSpeakerPopoverOpen((v) => !v);
                }}
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                  speakerPopoverOpen ? "bg-gray-300/80 dark:bg-white/20 text-gray-900 dark:text-white" : "text-gray-700 dark:text-white/90 hover:bg-gray-200/80 dark:hover:bg-white/10"
                )}
                aria-label={t("music.choosePlayer")}
                aria-expanded={speakerPopoverOpen}
              >
                <Speaker className="h-5 w-5" />
              </button>
              {speakerPopoverOpen && (
                <div
                  className="absolute bottom-full right-0 mb-2 py-2 min-w-[180px] rounded-lg border border-white/20 bg-gray-900 dark:bg-black shadow-xl z-[201] max-h-[60vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="px-3 py-1.5 text-xs font-medium text-white/70 border-b border-white/10">
                    {t("music.choosePlayer")}
                  </p>
                  {selectablePlayers.map((p) => {
                    const isSelected = selectedQueueId === p.queue_id;
                    const isActive = isSelected && (queueState?.state === "playing" || queueState?.state === "paused");
                    return (
                      <button
                        key={p.queue_id}
                        type="button"
                        onClick={() => {
                          setSelectedQueueId(p.queue_id);
                          setSpeakerPopoverOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors flex items-center justify-between gap-2",
                          isSelected && "bg-white/15 font-medium"
                        )}
                      >
                        <span>{playerLabel(p)}</span>
                        {isActive && (
                          <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" aria-hidden title={t("music.playing")} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={volumeDown}
            disabled={volumePending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700 dark:text-white/90 hover:bg-gray-200/80 dark:hover:bg-white/10 disabled:opacity-50 transition-colors"
            aria-label={t("music.volumeDown")}
          >
            <CircleMinus className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={volumeUp}
            disabled={volumePending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700 dark:text-white/90 hover:bg-gray-200/80 dark:hover:bg-white/10 disabled:opacity-50 transition-colors"
            aria-label={t("music.volumeUp")}
          >
            <CirclePlus className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={volumeMute}
            disabled={volumePending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700 dark:text-white/90 hover:bg-gray-200/80 dark:hover:bg-white/10 disabled:opacity-50 transition-colors"
            aria-label={volumeMuted ? t("music.volumeUnmute") : t("music.volumeMute")}
          >
            {volumeMuted ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
        </div>
      </div>
      </div>
    </footer>
  );
}
