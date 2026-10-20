"use client";

import { useEffect } from "react";
import { useLanguageStore } from "@/stores/language-store";
import { useMusicPlayerStore } from "@/stores/music-player-store";

/** Dev-only: floating music sheet without a live Music Assistant (uses layout GlobalMusicBar). */
export default function MusicPlayerSheetPreviewPage() {
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const setMaPlayers = useMusicPlayerStore((s) => s.setMaPlayers);
  const setQueueState = useMusicPlayerStore((s) => s.setQueueState);
  const setSelectedQueueId = useMusicPlayerStore((s) => s.setSelectedQueueId);
  const setPlayerBarExpanded = useMusicPlayerStore((s) => s.setPlayerBarExpanded);
  const playerBarExpanded = useMusicPlayerStore((s) => s.playerBarExpanded);

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
    // After GlobalMusicBar’s pathname effect collapses the sheet on navigation.
    const id = window.setTimeout(() => setPlayerBarExpanded(true), 50);
    return () => {
      window.clearTimeout(id);
      setPlayerBarExpanded(false);
      setMaPlayers([]);
      setQueueState(null);
    };
  }, [
    setLanguage,
    setMaPlayers,
    setQueueState,
    setSelectedQueueId,
    setPlayerBarExpanded,
  ]);

  return (
    <div className="relative min-h-screen bg-[#ece7df] p-6 text-gray-900">
      <h1 className="mb-1 text-xl font-semibold">Music player sheet preview</h1>
      <p className="mb-4 max-w-xl text-sm text-gray-600">
        Floating inset sheet: slide-up, light radius, inset from left/right/bottom. Seeded mock queue;
        rendered by layout <code className="text-xs">GlobalMusicBar</code>.
      </p>
      <button
        type="button"
        onClick={() => setPlayerBarExpanded(!playerBarExpanded)}
        className="rounded-xl bg-[#4700B5] px-4 py-2 text-sm font-medium text-white"
      >
        {playerBarExpanded ? "Sluiten" : "Open sheet"}
      </button>
    </div>
  );
}
