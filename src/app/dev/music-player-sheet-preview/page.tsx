"use client";

import { useEffect, useState } from "react";
import { MusicPlayerBarContent } from "@/components/music-player-bar-content";
import { useLanguageStore } from "@/stores/language-store";
import { useMusicPlayerStore } from "@/stores/music-player-store";
import { cn } from "@/lib/utils";

/**
 * Dev-only visual of the floating music sheet chrome.
 * Seeds the player store locally (does not require Music Assistant — the live
 * MusicPlayerProvider would otherwise clear mock players when MA is disabled).
 */
export default function MusicPlayerSheetPreviewPage() {
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const setMaPlayers = useMusicPlayerStore((s) => s.setMaPlayers);
  const setQueueState = useMusicPlayerStore((s) => s.setQueueState);
  const setSelectedQueueId = useMusicPlayerStore((s) => s.setSelectedQueueId);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setLanguage("nl");
    setMaPlayers([
      {
        queue_id: "preview-queue",
        display_name: "Woonkamer",
        player_id: "preview-player",
      },
    ]);
    setSelectedQueueId("preview-queue");
    setQueueState({
      state: "playing",
      position: 72,
      duration: 210,
      current_item: {
        name: "Midnight City",
        artists: [{ name: "M83" }],
      },
    });
    return () => {
      setMaPlayers([]);
      setQueueState(null);
    };
  }, [setLanguage, setMaPlayers, setQueueState, setSelectedQueueId]);

  return (
    <div className="relative min-h-screen bg-[#ece7df] p-6 text-gray-900">
      <h1 className="mb-1 text-xl font-semibold">Music player sheet preview</h1>
      <p className="mb-4 max-w-xl text-sm text-gray-600">
        Floating inset sheet: slide-up, light radius, gap from left/right/bottom (same chrome as
        production <code className="text-xs">GlobalMusicBar</code>).
      </p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-xl bg-[#4700B5] px-4 py-2 text-sm font-medium text-white"
      >
        {open ? "Sluiten" : "Open sheet"}
      </button>

      {open ? (
        <div
          className="pointer-events-auto fixed inset-0 z-[120]"
          role="dialog"
          aria-modal="true"
          aria-label="Player bar"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
            aria-label="Sluiten"
            onClick={() => setOpen(false)}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-5">
            <div
              className={cn(
                "animate-music-bar-in pointer-events-auto w-full max-w-[min(48rem,calc(100vw-1.5rem))]",
                "overflow-hidden rounded-[1.35rem]",
                "bg-white/90 shadow-[0_-12px_48px_rgba(15,23,42,0.22)] backdrop-blur-md",
                "ring-1 ring-black/[0.06]"
              )}
            >
              <MusicPlayerBarContent
                allowSpeakerSelection
                variant="floating"
                onClose={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
