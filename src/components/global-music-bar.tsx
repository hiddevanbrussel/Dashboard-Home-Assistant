"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useMusicPlayerStore } from "@/stores/music-player-store";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { MusicPlayerBarContent } from "@/components/music-player-bar-content";
import { MusicDockBar } from "@/components/music-dock-bar";
import { shouldIgnoreVacuumSheetBackdropClose } from "@/lib/vacuum-card";

/**
 * Music Assistant player as an inset floating sheet (not an always-on bottom tab).
 * The sheet opens only from the dashboard cards.
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

  /** On /music the player stays docked. The sheet opens only from the dashboard cards. */
  const musicPageDock =
    onMusicPage && !playerBarExpanded && typeof document !== "undefined"
      ? createPortal(<MusicDockBar />, document.body)
      : null;

  return (
    <>
      {sheet}
      {musicPageDock}
    </>
  );
}
