"use client";

import { usePathname } from "next/navigation";
import { ChevronUp } from "lucide-react";
import { useMusicPlayerStore } from "@/stores/music-player-store";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { MusicPlayerBarContent } from "@/components/music-player-bar-content";

/**
 * On non-music pages: shows a small chevron at the bottom to expand the player
 * bar. When expanded, user can close with the bar's close button.
 */
export function GlobalMusicBar() {
  const pathname = usePathname();
  const { maPlayers, playerBarExpanded, setPlayerBarExpanded } = useMusicPlayerStore();
  const { t } = useTranslation();

  const isMusicPage = pathname === "/music";
  const showTab = !isMusicPage && maPlayers.length > 0;

  if (!showTab) return null;

  if (playerBarExpanded) {
    return (
      <MusicPlayerBarContent
        allowSpeakerSelection
        onClose={() => setPlayerBarExpanded(false)}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlayerBarExpanded(true)}
      className={cn(
        "fixed bottom-2 right-2 z-40 flex h-9 w-9 items-center justify-center rounded-full",
        "bg-gray-800/90 dark:bg-black/80 backdrop-blur-sm border border-white/10",
        "text-white/80 hover:text-white hover:bg-gray-700/90 dark:hover:bg-white/10 transition-colors shadow-lg"
      )}
      aria-label={t("music.playerBar")}
    >
      <ChevronUp className="h-5 w-5" aria-hidden />
    </button>
  );
}
