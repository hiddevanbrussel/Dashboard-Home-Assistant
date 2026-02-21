"use client";

import { usePathname } from "next/navigation";
import { Music2, ChevronUp } from "lucide-react";
import { useMusicPlayerStore } from "@/stores/music-player-store";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { MusicPlayerBarContent } from "@/components/music-player-bar-content";

/**
 * On non-music pages: shows a small label at the bottom. Click expands the full
 * player bar in-place (no navigation). When expanded, user can close with the
 * bar's close button.
 */
export function GlobalMusicBar() {
  const pathname = usePathname();
  const { maPlayers, playerBarExpanded, setPlayerBarExpanded } = useMusicPlayerStore();
  const { t } = useTranslation();

  const isMusicPage = pathname === "/music";
  const showLabel = !isMusicPage && maPlayers.length > 0;

  if (!showLabel) return null;

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
        "fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-2 py-2.5 px-4",
        "bg-gray-900/95 dark:bg-black/90 backdrop-blur-md border-t border-white/10",
        "text-white/90 hover:text-white hover:bg-gray-800/95 dark:hover:bg-white/10 transition-colors"
      )}
      aria-label={t("music.playerBar")}
    >
      <Music2 className="h-5 w-5 shrink-0" aria-hidden />
      <span className="text-sm font-medium">{t("music.playerBar")}</span>
      <ChevronUp className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
    </button>
  );
}
