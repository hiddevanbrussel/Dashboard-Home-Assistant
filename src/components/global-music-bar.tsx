"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Disc3, Pause, Play } from "lucide-react";
import { useMusicPlayerStore } from "@/stores/music-player-store";
import { useMusicAssistantStore } from "@/stores/music-assistant-store";
import { useTranslation } from "@/hooks/use-translation";
import { callMusicAssistant } from "@/lib/music-assistant";
import { getImageSrc, getItemImageUrl, type MASearchItem } from "@/lib/music-item-image";
import { cn } from "@/lib/utils";
import { MusicPlayerBarContent } from "@/components/music-player-bar-content";
import { shouldIgnoreVacuumSheetBackdropClose } from "@/lib/vacuum-card";

/**
 * Music Assistant player as an inset floating sheet (not an always-on bottom tab).
 * Opens from the dashboard media card (and a compact chip on /music).
 */
export function GlobalMusicBar() {
  const pathname = usePathname();
  const { maPlayers, playerBarExpanded, setPlayerBarExpanded, queueState, selectedQueueId, setQueueState } = useMusicPlayerStore();
  const musicAssistant = useMusicAssistantStore();
  const { t } = useTranslation();
  const openedAtRef = useRef(0);
  const onMusicPage = pathname === "/music" || pathname.startsWith("/music/");

  useEffect(() => {
    setPlayerBarExpanded(false);
  }, [pathname, setPlayerBarExpanded]);

  useEffect(() => {
    if (!playerBarExpanded) return;
    openedAtRef.current = Date.now();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPlayerBarExpanded(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [playerBarExpanded, setPlayerBarExpanded]);

  const hasPlayers = maPlayers.length > 0;
  if (!hasPlayers) return null;

  const close = () => setPlayerBarExpanded(false);

  const sheet =
    playerBarExpanded && typeof document !== "undefined"
      ? createPortal(
          <div
            className="pointer-events-auto fixed inset-0 z-[120]"
            role="dialog"
            aria-modal="true"
            aria-label={t("music.playerBar")}
            data-no-page-swipe
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/35 backdrop-blur-[2px] dark:bg-black/50"
              aria-label={t("music.close")}
              onClick={() => {
                if (shouldIgnoreVacuumSheetBackdropClose(openedAtRef.current, Date.now())) return;
                close();
              }}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-5">
              <div
                className={cn(
                  "animate-music-bar-in pointer-events-auto relative w-full max-w-[min(48rem,calc(100vw-1.5rem))]",
                  // overflow-visible so portaled speaker menu isn’t the only escape hatch;
                  // radius still applies to the painted surface.
                  "overflow-visible rounded-[1.35rem]",
                  "bg-white/90 shadow-[0_-12px_48px_rgba(15,23,42,0.22)] backdrop-blur-md",
                  "dark:bg-gray-900/95 dark:shadow-[0_-12px_48px_rgba(0,0,0,0.55)]",
                  "ring-1 ring-black/[0.06] dark:ring-white/10"
                )}
              >
                <div className="overflow-hidden rounded-[1.35rem]">
                  <MusicPlayerBarContent
                    allowSpeakerSelection
                    animateOpen={false}
                    variant="floating"
                    onClose={close}
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  /** On /music, offer a compact chip so the player is still reachable without the old edge tab. */
  const currentItem = queueState?.current_item as (MASearchItem & { stream_title?: string }) | undefined;
  const chipCover = currentItem
    ? getImageSrc(getItemImageUrl(currentItem), musicAssistant.baseUrl, musicAssistant.token)
    : null;
  const chipTitle =
    (typeof currentItem?.stream_title === "string" ? currentItem.stream_title.trim() : "") ||
    (typeof currentItem?.name === "string" ? currentItem.name : "");
  const chipArtists = Array.isArray(currentItem?.artists)
    ? currentItem.artists.map((artist) => artist?.name).filter(Boolean).join(", ")
    : typeof currentItem?.artists === "object" && currentItem.artists && "name" in currentItem.artists
      ? String(currentItem.artists.name ?? "")
      : "";
  const chipPlayer = maPlayers.find((player) => player.queue_id === selectedQueueId);
  const chipSpeaker = typeof chipPlayer?.display_name === "string" ? chipPlayer.display_name : "";
  const chipSub = [chipArtists, chipSpeaker].filter(Boolean).join(" · ");
  const chipPlaying = queueState?.state === "playing";
  const musicPageChip =
    onMusicPage && !playerBarExpanded && typeof document !== "undefined"
      ? createPortal(
          <div
            className={cn(
              "fixed z-[41] flex items-center gap-1",
              "left-3 right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] sm:left-auto sm:right-5 sm:w-[22rem]",
              "mx-auto sm:mx-0 max-w-[min(22rem,calc(100vw-1.5rem))]",
              "rounded-[1.35rem] p-1.5 pr-2",
              "bg-white/90 shadow-[0_8px_28px_rgba(15,23,42,0.16)] backdrop-blur-md",
              "ring-1 ring-black/[0.06] dark:bg-gray-900/95 dark:shadow-[0_8px_28px_rgba(0,0,0,0.45)] dark:ring-white/10",
              "text-gray-900 dark:text-white",
              "animate-music-bar-in"
            )}
          >
            <button
              type="button"
              onClick={() => setPlayerBarExpanded(true)}
              className="flex min-h-11 min-w-0 flex-1 items-center gap-2.5 rounded-2xl px-1 text-left"
              aria-label={t("music.nowPlayingOpen")}
            >
              <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-white/10">
                {chipCover ? (
                  <Image src={chipCover} alt="" fill sizes="44px" className="object-cover" unoptimized />
                ) : (
                  <Disc3 className="m-3 h-5 w-5 text-gray-600 dark:text-white/70" aria-hidden />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{chipTitle || t("music.nowPlayingOpen")}</span>
                <span className="block truncate text-xs text-gray-600 dark:text-white/70">{chipSub || t("music.playerBar")}</span>
              </span>
            </button>
            {currentItem && selectedQueueId ? (
              <button
                type="button"
                onClick={() => {
                  if (!musicAssistant.enabled || !musicAssistant.baseUrl) return;
                  const action = chipPlaying ? "pause" : "play";
                  void callMusicAssistant(
                    musicAssistant.baseUrl,
                    musicAssistant.token,
                    action === "play" ? "player_queues/play" : "player_queues/pause",
                    { queue_id: selectedQueueId }
                  );
                  if (queueState) setQueueState({ ...queueState, state: action === "play" ? "playing" : "paused" });
                }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-yellow text-gray-900 dark:bg-accent-green"
                aria-label={chipPlaying ? t("music.pause") : t("music.play")}
              >
                {chipPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="ml-0.5 h-5 w-5 fill-current" />}
              </button>
            ) : null}
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {sheet}
      {musicPageChip}
    </>
  );
}
