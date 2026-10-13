"use client";

import { useRef, useState } from "react";
import { Heart, MoreVertical, Music2, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import type { MediaCardProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useMusicAssistantStore } from "@/stores/music-assistant-store";
import { useThemeStore } from "@/stores/theme-store";
import { useTranslation } from "@/hooks/use-translation";
import { callMusicAssistant } from "@/lib/music-assistant";
import { mediaArtworkCacheKey, mediaImageRequestUrl } from "@/lib/media-image";
import { playUiClick } from "@/lib/ui-click";
import {
  clampMediaCardHeight,
  clampMediaCardWidth,
  isMediaCardIdle,
  MEDIA_CARD_DEFAULT_HEIGHT,
  MEDIA_CARD_DEFAULT_WIDTH,
  mediaCardIdleImageSrc,
  resolveMediaCardPlayerName,
} from "@/lib/media-card";

export { MEDIA_CARD_DEFAULT_HEIGHT, MEDIA_CARD_DEFAULT_WIDTH };

const WAVEFORM_BARS = [6, 11, 8, 16, 10, 18, 7, 14, 9, 17, 8, 12];

function Waveform({ playing }: { playing: boolean }) {
  return (
    <div className="flex h-[22px] items-end gap-[2.5px]" aria-hidden>
      {WAVEFORM_BARS.map((height, index) => (
        <span
          key={index}
          className="w-[2.5px] rounded-full bg-white/95"
          style={{
            height: `${height}px`,
            transformOrigin: "bottom",
            animation: playing ? `media-wave 0.85s ease-in-out ${index * 0.06}s infinite alternate` : undefined,
          }}
        />
      ))}
    </div>
  );
}

export function MediaCardWidget({
  title = "Media",
  entity_id,
  size = "md",
  width,
  height,
  className,
  onMoreClick,
  mediaTitleOverride,
  mediaArtistOverride,
}: MediaCardProps & { className?: string; onMoreClick?: () => void; onExpandedChange?: (expanded: boolean) => void }) {
  const { t } = useTranslation();
  const isDark = useThemeStore((s) => s.resolved) === "dark";
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);
  const revertEntityState = useEntityStateStore((s) => s.revertEntityState);
  const requestRefresh = useEntityStateStore((s) => s.requestRefresh);
  const musicAssistant = useMusicAssistantStore();
  const pendingRef = useRef(false);
  const [favorited, setFavorited] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);

  const isPlaying = entity?.state === "playing";
  const entityTitle = (entity?.attributes?.media_title as string) ?? "";
  const entityArtist = (entity?.attributes?.media_artist as string) ?? "";
  const mediaTitle = (mediaTitleOverride?.trim() || entityTitle) || "";
  const mediaArtist = (mediaArtistOverride?.trim() || entityArtist) || "";
  const entityPicture =
    (entity?.attributes?.entity_picture as string | undefined) ??
    (entity?.attributes?.entity_picture_local as string | undefined);
  const mediaContentId = (entity?.attributes?.media_content_id as string | undefined) ?? "";
  const friendlyName = (entity?.attributes?.friendly_name as string | undefined) ?? "";
  const playerName = resolveMediaCardPlayerName({
    title,
    friendlyName,
    entityId: entity_id,
    fallback: t("cardType.media_card"),
  });
  const idle = isMediaCardIdle({ mediaTitle, entityPicture });
  const artworkKey = mediaArtworkCacheKey({
    entityPicture,
    mediaTitle,
    mediaArtist,
    mediaContentId,
  });
  const mediaImageSrc = entityPicture ? mediaImageRequestUrl(entity_id, artworkKey) : null;
  const trackKey = artworkKey || "none";
  const idleBg = withBasePath(mediaCardIdleImageSrc(isDark));
  const cardWidth = clampMediaCardWidth(width);
  const cardHeight = clampMediaCardHeight(height);
  const canFavorite = Boolean(musicAssistant.enabled && musicAssistant.baseUrl && mediaContentId);

  async function callMedia(service: string) {
    const res = await fetch("/api/ha/call-service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity_id,
        domain: "media_player",
        service,
      }),
    });
    if (!res.ok) throw new Error(`call-service failed: ${res.status}`);
  }

  function handlePlayPause() {
    if (!entity_id || pendingRef.current) return;
    playUiClick();
    pendingRef.current = true;
    const previous = entity;
    const nextState = isPlaying ? "paused" : "playing";
    updateEntityState(entity_id, { state: nextState });
    callMedia("media_play_pause")
      .then(() => requestRefresh())
      .catch(() => revertEntityState(entity_id, previous))
      .finally(() => {
        pendingRef.current = false;
      });
  }

  function handleSkip(service: "media_previous_track" | "media_next_track") {
    if (!entity_id || pendingRef.current) return;
    playUiClick();
    pendingRef.current = true;
    callMedia(service)
      .then(() => requestRefresh())
      .finally(() => {
        pendingRef.current = false;
      });
  }

  async function handleFavorite() {
    if (!canFavorite || favoriteBusy || favorited) return;
    setFavoriteBusy(true);
    try {
      const data = await callMusicAssistant(
        musicAssistant.baseUrl,
        musicAssistant.token,
        "music/favorites/add_item",
        { item: mediaContentId }
      );
      if (!(data as { error?: string })?.error) setFavorited(true);
    } finally {
      setFavoriteBusy(false);
    }
  }

  return (
    <div
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-[1.35rem] bg-[#141414] text-white shadow-[0_18px_50px_rgba(15,23,42,0.28)]",
        size === "sm" && "text-sm",
        size === "lg" && "text-lg",
        className
      )}
      style={{ width: cardWidth, height: cardHeight, minHeight: cardHeight }}
    >
      <div className="absolute inset-0" aria-hidden>
        {mediaImageSrc ? (
          // Dynamic HA/cover URLs; next/image would require a remotePatterns allowlist.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={trackKey}
            src={mediaImageSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={idleBg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
            draggable={false}
          />
        )}
        <div
          className={cn(
            "absolute inset-0",
            idle
              ? "bg-gradient-to-b from-black/55 via-black/25 to-black/70"
              : "bg-gradient-to-b from-black/25 via-black/10 to-black/80"
          )}
        />
      </div>

      <div className="relative flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-1">
              <p className="min-w-0 flex-1 truncate text-[1.05rem] font-semibold tracking-tight text-white" title={playerName}>
                {playerName}
              </p>
              {onMoreClick ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoreClick();
                  }}
                  className="shrink-0 rounded-lg p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label={t("common.options")}
                >
                  <MoreVertical className="h-5 w-5" aria-hidden />
                </button>
              ) : null}
            </div>
            {idle ? (
              <p className="mt-0.5 truncate text-sm font-medium text-white/65">{t("mediaCard.idle")}</p>
            ) : null}
          </div>
          {!idle ? <Waveform playing={isPlaying} /> : null}
        </div>

        {idle ? (
          <div className="flex min-h-0 flex-1 items-center gap-4 px-0.5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/35 text-white/90">
              <Music2 className="h-7 w-7" strokeWidth={1.5} aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[1.15rem] font-semibold leading-snug tracking-tight text-white">
                {t("mediaCard.readyTitle")}
              </p>
              <p className="mt-1 text-sm font-medium leading-snug text-white/65">
                {t("mediaCard.readyHint")}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-auto space-y-3 pt-4">
            <div className="min-w-0">
              {mediaArtist ? (
                <p className="truncate text-sm font-medium text-white/75">{mediaArtist}</p>
              ) : null}
              <p className="truncate text-[1.35rem] font-semibold leading-tight tracking-tight">
                {mediaTitle || t("mediaCard.idle")}
              </p>
            </div>
          </div>
        )}

        <div
          className={cn(
            "mt-auto flex items-center gap-1 rounded-full bg-black/45 px-2 py-1.5 backdrop-blur-md",
            idle ? "mt-2" : "mt-4"
          )}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSkip("media_previous_track");
            }}
            disabled={!entity_id}
            className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white disabled:opacity-40"
            aria-label={t("music.previous")}
          >
            <SkipBack className="h-5 w-5 fill-current" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePlayPause();
            }}
            disabled={!entity_id}
            className="mx-auto inline-flex min-w-[7.5rem] flex-1 items-center justify-center gap-2 rounded-full bg-white/22 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/28 disabled:opacity-40"
            aria-label={isPlaying ? t("mediaCard.pause") : t("mediaCard.play")}
          >
            {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
            {isPlaying ? t("mediaCard.pause") : t("mediaCard.play")}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSkip("media_next_track");
            }}
            disabled={!entity_id}
            className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white disabled:opacity-40"
            aria-label={t("music.next")}
          >
            <SkipForward className="h-5 w-5 fill-current" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void handleFavorite();
            }}
            disabled={!canFavorite || favoriteBusy}
            className={cn(
              "rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white",
              (!canFavorite || favoriteBusy) && "opacity-50"
            )}
            aria-label={t("music.addToFavorites")}
            aria-pressed={favorited}
          >
            <Heart className={cn("h-5 w-5", favorited && "fill-current")} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
