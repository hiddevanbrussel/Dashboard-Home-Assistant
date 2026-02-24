"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useMusicPlayerStore } from "@/stores/music-player-store";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { MusicPlayerBarContent } from "@/components/music-player-bar-content";

/** Bottom-offset van het tabje wanneer de bar open is: net op de bovenrand van de kaart. */
const TAB_BOTTOM_WHEN_OPEN = "bottom-[83px]";

/**
 * On non-music pages: shows a small chevron-tab at the bottom-left to expand
 * the player bar. When expanded, the same tab shows chevron down to close.
 */
export function GlobalMusicBar() {
  const pathname = usePathname();
  const { maPlayers, playerBarExpanded, setPlayerBarExpanded } = useMusicPlayerStore();
  const { t } = useTranslation();

  useEffect(() => {
    setPlayerBarExpanded(false);
  }, [pathname, setPlayerBarExpanded]);

  const isMusicPage = pathname === "/music";
  const showTab = !isMusicPage && maPlayers.length > 0;

  if (!showTab) return null;

  return (
    <>
      {playerBarExpanded && (
        <MusicPlayerBarContent allowSpeakerSelection animateOpen />
      )}
      <button
        type="button"
        onClick={() => setPlayerBarExpanded(!playerBarExpanded)}
        className={cn(
          "fixed left-6 z-[41] flex h-10 min-w-[2.5rem] items-center justify-center rounded-t-lg px-3 transition-[bottom] duration-200",
          playerBarExpanded ? TAB_BOTTOM_WHEN_OPEN : "bottom-0",
          "bg-gray-800/90 dark:bg-black/80 backdrop-blur-sm border border-b-0 border-white/10",
          "text-white/80 hover:text-white hover:bg-gray-700/90 dark:hover:bg-white/10 shadow-lg"
        )}
        aria-label={playerBarExpanded ? t("music.close") : t("music.playerBar")}
        aria-expanded={playerBarExpanded}
      >
        {playerBarExpanded ? (
          <ChevronDown className="h-5 w-5" aria-hidden />
        ) : (
          <ChevronUp className="h-5 w-5" aria-hidden />
        )}
      </button>
    </>
  );
}
