"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Disc3 } from "lucide-react";
import { useMusicPlayerStore } from "@/stores/music-player-store";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { MusicPlayerBarContent } from "@/components/music-player-bar-content";
import { shouldIgnoreVacuumSheetBackdropClose } from "@/lib/vacuum-card";

/**
 * Music Assistant player as an inset floating sheet (not an always-on bottom tab).
 * Opens from the dashboard media card (and a compact chip on /music).
 */
export function GlobalMusicBar() {
  const pathname = usePathname();
  const { maPlayers, playerBarExpanded, setPlayerBarExpanded } = useMusicPlayerStore();
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
                  "animate-music-bar-in pointer-events-auto w-full max-w-[min(48rem,calc(100vw-1.5rem))]",
                  "overflow-hidden rounded-[1.35rem]",
                  "bg-white/90 shadow-[0_-12px_48px_rgba(15,23,42,0.22)] backdrop-blur-md",
                  "dark:bg-gray-900/95 dark:shadow-[0_-12px_48px_rgba(0,0,0,0.55)]",
                  "ring-1 ring-black/[0.06] dark:ring-white/10"
                )}
              >
                <MusicPlayerBarContent
                  allowSpeakerSelection
                  animateOpen={false}
                  variant="floating"
                  onClose={close}
                />
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  /** On /music, offer a compact chip so the player is still reachable without the old edge tab. */
  const musicPageChip =
    onMusicPage && !playerBarExpanded && typeof document !== "undefined"
      ? createPortal(
          <button
            type="button"
            onClick={() => setPlayerBarExpanded(true)}
            className={cn(
              "fixed z-[41] flex items-center gap-2.5",
              "left-3 right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] sm:left-auto sm:right-5 sm:w-auto",
              "mx-auto sm:mx-0 max-w-[min(22rem,calc(100vw-1.5rem))]",
              "rounded-[1.35rem] px-3.5 py-2.5",
              "bg-white/90 shadow-[0_8px_28px_rgba(15,23,42,0.16)] backdrop-blur-md",
              "ring-1 ring-black/[0.06] dark:bg-gray-900/95 dark:shadow-[0_8px_28px_rgba(0,0,0,0.45)] dark:ring-white/10",
              "text-left text-gray-900 dark:text-white",
              "animate-music-bar-in"
            )}
            aria-label={t("music.playerBar")}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/10">
              <Disc3 className="h-5 w-5 text-gray-600 dark:text-white/70" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium text-gray-500 dark:text-white/55">
                {t("music.playerBar")}
              </span>
              <span className="block truncate text-sm font-semibold">
                {t("music.nowPlayingOpen")}
              </span>
            </span>
          </button>,
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
