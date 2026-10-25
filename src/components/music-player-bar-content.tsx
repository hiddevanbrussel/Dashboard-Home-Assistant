"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Disc3,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Donut,
  Shuffle,
  Speaker,
  CircleMinus,
  CirclePlus,
  VolumeX,
  Volume2,
  ChevronDown,
  Users,
  Check,
  ListMusic,
} from "lucide-react";
import { useMusicPlayerStore, type MAPlayer } from "@/stores/music-player-store";
import { useMusicAssistantStore } from "@/stores/music-assistant-store";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useMusicPlayerActions } from "@/hooks/use-music-player-actions";
import { useSpeakerPairing, resolveEntityId } from "@/hooks/use-speaker-pairing";
import { MusicNowPlayingOverlay } from "@/components/music-now-playing-overlay";
import { MusicQueuePanel } from "@/components/music-queue-panel";
import { getItemImageUrl, getImageSrc, formatDuration, MUSIC_IMAGE_BLUR, type MASearchItem } from "@/lib/music-item-image";
import { describeNowPlaying } from "@/lib/music-now-playing";
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
  /** Play slide-up animation when bar appears (legacy full-bleed dock) */
  animateOpen?: boolean;
  /**
   * `floating` — content for the inset sheet (no fixed positioning; parent supplies chrome).
   * `dock` — legacy full-bleed footer (kept for compatibility).
   */
  variant?: "floating" | "dock";
};

export function MusicPlayerBarContent({
  allowSpeakerSelection = true,
  onClose,
  animateOpen = false,
  variant = "floating",
}: MusicPlayerBarContentProps) {
  const isFloating = variant === "floating";
  const { t } = useTranslation();
  const speakerButtonRef = useRef<HTMLButtonElement>(null);
  const speakerPanelRef = useRef<HTMLDivElement>(null);
  const [speakerPopoverOpen, setSpeakerPopoverOpen] = useState(false);
  const [speakerPopoverPos, setSpeakerPopoverPos] = useState<{ bottom: number; right: number } | null>(null);
  const [nowPlayingOpen, setNowPlayingOpen] = useState(false);
  const queueButtonRef = useRef<HTMLButtonElement>(null);
  const queuePanelRef = useRef<HTMLDivElement>(null);
  const [queueOpen, setQueueOpen] = useState(false);
  const [queuePos, setQueuePos] = useState<{ bottom: number; right: number } | null>(null);

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
    shuffleEnabled,
    shufflePending,
    toggleShuffle,
  } = useMusicPlayerActions();

  const isPlaying = queueState?.state === "playing";
  const position = queueState?.position ?? 0;
  const duration = queueState?.duration ?? 0;
  const allowedIds = musicAssistant.allowedSpeakerIds;
  const selectablePlayers = allowedIds.length > 0 ? maPlayers.filter((p) => allowedIds.includes(p.queue_id)) : maPlayers;

  const { entityMap, groupMembers, joinUnjoinPending, handleJoin, handleUnjoin } = useSpeakerPairing({
    enabled: true,
  });

  const updateSpeakerPopoverPos = useCallback(() => {
    const btn = speakerButtonRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setSpeakerPopoverPos({
      // Sit just above the speaker button (panel grows upward).
      bottom: Math.max(8, window.innerHeight - r.top + 8),
      right: Math.max(8, window.innerWidth - r.right),
    });
  }, []);

  useEffect(() => {
    if (!speakerPopoverOpen) {
      setSpeakerPopoverPos(null);
      return;
    }
    updateSpeakerPopoverPos();
    window.addEventListener("resize", updateSpeakerPopoverPos);
    window.addEventListener("scroll", updateSpeakerPopoverPos, true);
    return () => {
      window.removeEventListener("resize", updateSpeakerPopoverPos);
      window.removeEventListener("scroll", updateSpeakerPopoverPos, true);
    };
  }, [speakerPopoverOpen, updateSpeakerPopoverPos]);

  useEffect(() => {
    if (!speakerPopoverOpen && !queueOpen) return;
    const close = (e: MouseEvent) => {
      const target = e.target as Node;
      if (speakerButtonRef.current?.contains(target) || speakerPanelRef.current?.contains(target)) return;
      if (queueButtonRef.current?.contains(target) || queuePanelRef.current?.contains(target)) return;
      setSpeakerPopoverOpen(false);
      setQueueOpen(false);
    };
    // mousedown: avoids racing the opening click; works for portaled panel outside the sheet.
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [speakerPopoverOpen, queueOpen]);

  useEffect(() => {
    if (!queueOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setQueueOpen(false);
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [queueOpen]);

  const states = useEntityStateStore((s) => s.states);
  const playingMediaPlayer = Object.values(states).find(
    (e) => e.entity_id.startsWith("media_player.") && (e.state === "playing" || e.state === "paused")
  );
  const cur = queueState?.current_item as (MASearchItem & { artist?: string; stream_title?: string }) | undefined;
  const coverSrc = cur ? getImageSrc(getItemImageUrl(cur), musicAssistant.baseUrl, musicAssistant.token) : null;
  const { title: titleLine, artist: artistLine } = describeNowPlaying(cur, {
    title: playingMediaPlayer?.attributes?.media_title as string | undefined,
    artist: playingMediaPlayer?.attributes?.media_artist as string | undefined,
  });

  const currentPlayer = selectablePlayers.find((player) => player.queue_id === selectedQueueId) ?? null;
  const groupedWithCurrent = (() => {
    if (!currentPlayer) return 0;
    const mine = resolveEntityId(currentPlayer, entityMap);
    if (!mine || !groupMembers.has(mine)) return 0;
    return selectablePlayers.filter((player) => {
      if (player.queue_id === selectedQueueId) return false;
      const entityId = resolveEntityId(player, entityMap);
      return entityId ? groupMembers.has(entityId) : false;
    }).length;
  })();
  const currentPlayerName = currentPlayer
    ? `${playerLabel(currentPlayer)}${groupedWithCurrent > 0 ? ` +${groupedWithCurrent}` : ""}`
    : "";
  const currentItemId = typeof cur?.queue_item_id === "string" ? cur.queue_item_id : null;

  const Root = isFloating ? "div" : "footer";

  return (
    <Root
      className={cn(
        "relative flex flex-col overflow-visible",
        isFloating
          ? cn(speakerPopoverOpen ? "z-[200]" : "z-10")
          : cn(
              "fixed bottom-0 left-0 right-0 border-t border-gray-200/60 dark:border-white/10",
              speakerPopoverOpen ? "z-[200]" : "z-40",
              animateOpen && "animate-music-bar-in"
            )
      )}
      aria-label={t("music.playerBar")}
    >
      {/* Fill — floating parent already paints glass; dock keeps its own backdrop. */}
      {!isFloating ? (
        <div
          className="absolute inset-0 z-0 bg-white/85 backdrop-blur-md border-t border-gray-200/50 dark:border-transparent dark:bg-gray-900/95"
          aria-hidden
        />
      ) : null}
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
              background: isFloating
                ? "linear-gradient(to right, transparent 0%, rgba(17,24,39,0.55) 30%, rgba(17,24,39,0.92) 55%, rgba(17,24,39,1) 100%)"
                : "linear-gradient(to right, transparent 0%, rgba(17,17,17,0.75) 25%, rgba(17,17,17,0.95) 50%, rgba(17,17,17,1) 100%)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 block dark:hidden"
            style={{
              background: isFloating
                ? "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.45) 30%, rgba(255,255,255,0.88) 55%, rgba(255,255,255,1) 100%)"
                : "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.55) 25%, rgba(255,255,255,0.88) 50%, rgba(255,255,255,1) 100%)",
            }}
            aria-hidden
          />
        </div>
      )}
      <div
        className={cn(
          "relative z-10 flex w-full flex-col",
          isFloating ? "px-3.5 py-3 sm:px-5" : "px-4 py-2 sm:px-6"
        )}
      >
      <div className="w-full flex items-center gap-4 sm:gap-6 min-w-0">
        {/* Left: cover + artist/title */}
        <div className="flex items-center gap-3 min-w-[120px] max-w-[190px] shrink-0 flex-shrink-0">
          <button
            type="button"
            onClick={() => setNowPlayingOpen(true)}
            className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-200/80 dark:bg-white/10 transition-transform active:scale-[0.96] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow dark:focus-visible:ring-accent-green"
            aria-label={t("music.nowPlayingOpen")}
          >
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
          </button>
          <button
            type="button"
            onClick={() => setNowPlayingOpen(true)}
            className="min-w-0 flex-1 flex flex-col gap-0.5 text-left rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow dark:focus-visible:ring-accent-green"
            aria-label={t("music.nowPlayingOpen")}
          >
            <p className="truncate text-xs text-gray-600 dark:text-white/70">{artistLine || "—"}</p>
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white/95">{titleLine || "—"}</p>
            {currentPlayerName ? (
              <p className="flex min-w-0 items-center gap-1 truncate text-xs text-gray-600 dark:text-white/70">
                <Speaker className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="truncate">{currentPlayerName}</span>
              </p>
            ) : null}
          </button>
        </div>

        {/* Center: prev / play / next / dont-stop, then seek */}
        <div className="flex-1 min-w-0 flex flex-col gap-1 items-center">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => queueControl("previous")}
              className="flex h-11 w-11 items-center justify-center rounded-full text-gray-700 dark:text-white/90 hover:bg-gray-200/80 dark:hover:bg-white/10 transition-colors"
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
              className="flex h-11 w-11 items-center justify-center rounded-full text-gray-700 dark:text-white/90 hover:bg-gray-200/80 dark:hover:bg-white/10 transition-colors"
              aria-label={t("music.next")}
            >
              <SkipForward className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={toggleShuffle}
              disabled={shufflePending}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
                shuffleEnabled
                  ? "bg-accent-yellow dark:bg-accent-green text-gray-900"
                  : "text-gray-700 dark:text-white/90 hover:bg-gray-200/80 dark:hover:bg-white/10"
              )}
              aria-label={t("music.shuffle")}
              title={t("music.shuffle")}
            >
              <Shuffle className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={toggleDontStopTheMusic}
              disabled={dontStopTheMusicPending}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
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
          <div className="-my-1 flex items-center gap-2 text-xs text-gray-600 dark:text-white/70 tabular-nums w-full min-w-0 sm:min-w-[220px] max-w-[560px] sm:max-w-[720px] shrink">
            <span className="w-9 shrink-0">{formatDuration(position)}</span>
            <div className="relative flex h-11 min-w-0 flex-1 items-center">
              <div className="pointer-events-none absolute inset-x-0 h-1.5 rounded-full bg-gray-300/80 dark:bg-white/20" aria-hidden>
                <div
                  className="h-full rounded-full bg-accent-yellow dark:bg-accent-green"
                  style={{ width: `${duration > 0 ? Math.min(100, (position / duration) * 100) : 0}%` }}
                />
              </div>
              <span
                className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 rounded-full bg-accent-yellow shadow ring-2 ring-white dark:bg-accent-green dark:ring-gray-900"
                style={{ left: `${duration > 0 ? Math.min(100, (position / duration) * 100) : 0}%` }}
                aria-hidden
              />
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={position}
                step={1}
                disabled={seekPending || duration <= 0}
                onChange={(e) => seekTo(Number(e.target.value))}
                className="absolute inset-0 h-11 w-full cursor-pointer appearance-none opacity-0 disabled:cursor-default"
                aria-label={t("music.position")}
              />
            </div>
            <span className="w-9 shrink-0 text-right">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Right: optional close, speaker picker, volume */}
        <div className="relative flex items-center gap-1 shrink-0">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-700 dark:text-white/90 hover:bg-gray-200/80 dark:hover:bg-white/10 transition-colors"
              aria-label={t("music.close")}
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          )}
          {allowSpeakerSelection && selectablePlayers.length > 0 && (
            <div className="relative">
              <button
                ref={speakerButtonRef}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (speakerPopoverOpen) {
                    setSpeakerPopoverOpen(false);
                    return;
                  }
                  setQueueOpen(false);
                  updateSpeakerPopoverPos();
                  setSpeakerPopoverOpen(true);
                }}
                className={cn(
                  "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors",
                  speakerPopoverOpen ? "bg-gray-300/80 dark:bg-white/20 text-gray-900 dark:text-white" : "text-gray-700 dark:text-white/90 hover:bg-gray-200/80 dark:hover:bg-white/10"
                )}
                aria-label={t("music.choosePlayer")}
                aria-expanded={speakerPopoverOpen}
              >
                <Speaker className="h-5 w-5" />
                {groupedWithCurrent > 0 ? (
                  <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gray-900 px-1 text-[11px] font-semibold leading-none text-white ring-2 ring-white dark:bg-white dark:text-gray-900 dark:ring-gray-900" aria-hidden>
                    +{groupedWithCurrent}
                  </span>
                ) : null}
              </button>
              {speakerPopoverOpen &&
                speakerPopoverPos &&
                typeof document !== "undefined" &&
                createPortal(
                  (() => {
                    const mainPlayer = selectablePlayers.find((p) => p.queue_id === selectedQueueId) ?? null;
                    const mainEntityId = mainPlayer ? resolveEntityId(mainPlayer, entityMap) : null;
                    const otherPlayers = selectablePlayers.filter((p) => p.queue_id !== selectedQueueId);
                    const isActive = queueState?.state === "playing" || queueState?.state === "paused";
                    return (
                      <div
                        ref={speakerPanelRef}
                        className="fixed z-[320] w-[min(340px,calc(100vw-24px))] max-h-[min(62vh,480px)] overflow-y-auto rounded-2xl border border-white/60 bg-white/95 p-2 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-[#1b1a21] dark:backdrop-blur-none"
                        style={{
                          bottom: speakerPopoverPos.bottom,
                          right: speakerPopoverPos.right,
                        }}
                        data-no-page-swipe
                        role="dialog"
                        aria-label={t("music.choosePlayer")}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <p className="px-2 pb-1 pt-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-white/65">
                          {t("music.mainSpeaker")}
                        </p>
                        {mainPlayer ? (
                          <div className="flex min-h-12 items-center gap-3 rounded-xl bg-black/[0.05] px-3 dark:bg-white/[0.08]">
                            <Speaker className="h-5 w-5 shrink-0 text-gray-800 dark:text-white/90" aria-hidden />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">{playerLabel(mainPlayer)}</span>
                              <span className="block text-xs text-gray-600 dark:text-white/70">
                                {isActive ? t("music.playing") : t("music.speakerIdle")}
                                {groupedWithCurrent > 0
                                  ? ` · ${t("music.groupWith").replace("{n}", String(groupedWithCurrent))}`
                                  : ""}
                              </span>
                            </span>
                            <Check className="h-5 w-5 shrink-0 text-gray-900 dark:text-white" aria-hidden />
                          </div>
                        ) : (
                          <p className="px-2 py-2 text-sm text-gray-600 dark:text-white/70">{t("music.noActiveSpeaker")}</p>
                        )}
                        {otherPlayers.length > 0 ? (
                          <>
                            <p className="px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-white/65">
                              {t("music.otherSpeakers")}
                            </p>
                            <div className="space-y-0.5">
                              {otherPlayers.map((p) => {
                                const entityId = resolveEntityId(p, entityMap);
                                const isGrouped = entityId ? groupMembers.has(entityId) : false;
                                const canJoin = !!entityId && !!mainEntityId && !isGrouped;
                                const canUnjoin = !!entityId && isGrouped;
                                return (
                                  <div key={p.queue_id} className="flex min-h-12 items-center gap-1 rounded-xl pl-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedQueueId(p.queue_id);
                                        setSpeakerPopoverOpen(false);
                                      }}
                                      className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl px-2 text-left"
                                      aria-label={`${t("music.switchTo")} ${playerLabel(p)}`}
                                    >
                                      <Speaker className="h-5 w-5 shrink-0 text-gray-600 dark:text-white/70" aria-hidden />
                                      <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">{playerLabel(p)}</span>
                                        <span className="block text-xs text-gray-600 dark:text-white/70">
                                          {isGrouped ? t("music.playsAlong") : t("music.tapToSwitch")}
                                        </span>
                                      </span>
                                    </button>
                                    {canJoin || canUnjoin ? (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (canUnjoin && entityId) handleUnjoin(entityId);
                                          else if (mainEntityId && entityId) handleJoin([mainEntityId, entityId]);
                                        }}
                                        disabled={joinUnjoinPending}
                                        aria-pressed={isGrouped}
                                        className={cn(
                                          "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-colors disabled:opacity-50",
                                          isGrouped
                                            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                                            : "text-gray-800 ring-1 ring-inset ring-gray-400 hover:bg-black/[0.04] dark:text-white/90 dark:ring-white/40 dark:hover:bg-white/10"
                                        )}
                                        title={isGrouped ? t("music.unjoinSpeaker") : t("music.joinSpeakers")}
                                      >
                                        {isGrouped ? <Check className="h-4 w-4" aria-hidden /> : <Users className="h-4 w-4" aria-hidden />}
                                        {isGrouped ? t("music.grouped") : t("music.group")}
                                      </button>
                                    ) : null}
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        ) : null}
                      </div>
                    );
                  })(),
                  document.body
                )}
            </div>
          )}
          {selectedQueueId ? (
            <button
              ref={queueButtonRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSpeakerPopoverOpen(false);
                if (queueOpen) {
                  setQueueOpen(false);
                  return;
                }
                const rect = queueButtonRef.current?.getBoundingClientRect();
                setQueuePos(
                  rect
                    ? {
                        bottom: Math.max(8, window.innerHeight - rect.top + 12),
                        right: Math.max(12, window.innerWidth - rect.right),
                      }
                    : { bottom: 96, right: 12 }
                );
                setQueueOpen(true);
              }}
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors",
                queueOpen
                  ? "bg-gray-300/80 dark:bg-white/20 text-gray-900 dark:text-white"
                  : "text-gray-700 dark:text-white/90 hover:bg-gray-200/80 dark:hover:bg-white/10"
              )}
              aria-label={t("music.queue")}
              aria-expanded={queueOpen}
            >
              <ListMusic className="h-5 w-5" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={volumeDown}
            disabled={volumePending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-700 dark:text-white/90 hover:bg-gray-200/80 dark:hover:bg-white/10 disabled:opacity-50 transition-colors"
            aria-label={t("music.volumeDown")}
          >
            <CircleMinus className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={volumeUp}
            disabled={volumePending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-700 dark:text-white/90 hover:bg-gray-200/80 dark:hover:bg-white/10 disabled:opacity-50 transition-colors"
            aria-label={t("music.volumeUp")}
          >
            <CirclePlus className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={volumeMute}
            disabled={volumePending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-700 dark:text-white/90 hover:bg-gray-200/80 dark:hover:bg-white/10 disabled:opacity-50 transition-colors"
            aria-label={volumeMuted ? t("music.volumeUnmute") : t("music.volumeMute")}
            aria-pressed={volumeMuted}
          >
            {volumeMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
        </div>
      </div>
      </div>
      {queueOpen && selectedQueueId && queuePos && typeof document !== "undefined"
        ? createPortal(
            <MusicQueuePanel
              key={selectedQueueId}
              queueId={selectedQueueId}
              playerName={currentPlayerName}
              currentItemId={currentItemId}
              position={queuePos}
              panelRef={queuePanelRef}
            />,
            document.body
          )
        : null}
      <MusicNowPlayingOverlay
        open={nowPlayingOpen}
        onClose={() => setNowPlayingOpen(false)}
        coverSrc={coverSrc}
        title={titleLine || "—"}
        artist={artistLine || "—"}
        isPlaying={isPlaying}
        position={position}
        duration={duration}
        onPlayPause={() => queueControl(isPlaying ? "pause" : "play")}
        onPrevious={() => queueControl("previous")}
        onNext={() => queueControl("next")}
        labels={{
          close: t("music.close"),
          play: t("music.play"),
          pause: t("music.pause"),
          previous: t("music.previous"),
          next: t("music.next"),
        }}
      />
    </Root>
  );
}
