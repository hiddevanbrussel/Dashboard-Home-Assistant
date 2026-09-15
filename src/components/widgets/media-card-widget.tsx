"use client";

import { useRef, useState } from "react";
import { Heart, MoreVertical, Pause, Play, SkipBack, SkipForward, Disc3 } from "lucide-react";
import type { MediaCardProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useMusicAssistantStore } from "@/stores/music-assistant-store";
import { useTranslation } from "@/hooks/use-translation";
import { callMusicAssistant } from "@/lib/music-assistant";
import { mediaArtworkCacheKey, mediaImageRequestUrl } from "@/lib/media-image";

export const MEDIA_CARD_DEFAULT_WIDTH = 280;
export const MEDIA_CARD_DEFAULT_HEIGHT = 340;

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
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);
  const revertEntityState = useEntityStateStore((s) => s.revertEntityState);
  const requestRefresh = useEntityStateStore((s) => s.requestRefresh);
  const musicAssistant = useMusicAssistantStore();
  const pendingRef = useRef(false);
  const [favorited, setFavorited] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);

  const isOn =
    entity?.state !== "off" &&
    entity?.state !== "unavailable" &&
    entity?.state !== "unknown" &&
    Boolean(entity?.state);
  const isPlaying = entity?.state === "playing";
  const entityTitle = (entity?.attributes?.media_title as string) ?? "";
  const entityArtist = (entity?.attributes?.media_artist as string) ?? "";
  const mediaTitle = (mediaTitleOverride?.trim() || entityTitle) || "";
  const mediaArtist = (mediaArtistOverride?.trim() || entityArtist) || "";
  const entityPicture =
    (entity?.attributes?.entity_picture as string | undefined) ??
    (entity?.attributes?.entity_picture_local as string | undefined);
  const mediaContentId = (entity?.attributes?.media_content_id as string | undefined) ?? "";
  const displayTitle = mediaTitle || title || t("cardType.media_card");
  const displayArtist = mediaArtist || (isOn ? "" : t("mediaCard.idle"));

  const artworkKey = mediaArtworkCacheKey({
    entityPicture,
    mediaTitle,
    mediaArtist,
    mediaContentId,
  });
  const mediaImageSrc = entityPicture ? mediaImageRequestUrl(entity_id, artworkKey) : null;
  const trackKey = artworkKey || "none";
  const cardWidth = width != null && width > 0 ? width : MEDIA_CARD_DEFAULT_WIDTH;
  const cardHeight = height != null && height > 0 ? height : MEDIA_CARD_DEFAULT_HEIGHT;
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
        "relative flex w-full flex-col overflow-hidden rounded-2xl bg-[#141414] text-white shadow-[0_18px_50px_rgba(15,23,42,0.28)]",
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
          <div className="flex h-full items-start justify-center bg-gradient-to-b from-zinc-800 to-zinc-950 pt-[22%]">
            <Disc3 className="h-20 w-20 text-white/15" strokeWidth={1} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/80" />
      </div>

      <div className="relative flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-3">
          {onMoreClick ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoreClick();
              }}
              className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={t("common.options")}
            >
              <MoreVertical className="h-5 w-5" aria-hidden />
            </button>
          ) : (
            <span />
          )}
          <Waveform playing={isPlaying} />
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {displayArtist ? (
                <p className="truncate text-sm font-medium text-white/75">{displayArtist}</p>
              ) : null}
              <p className="truncate text-[1.35rem] font-semibold leading-tight tracking-tight">{displayTitle}</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                void handleFavorite();
              }}
              disabled={!canFavorite || favoriteBusy}
              className={cn(
                "mt-1 shrink-0 rounded-full p-1 text-white/90 transition-colors hover:bg-white/10",
                (!canFavorite || favoriteBusy) && "opacity-70"
              )}
              aria-label={t("music.addToFavorites")}
              aria-pressed={favorited}
            >
              <Heart className={cn("h-5 w-5", favorited && "fill-current")} aria-hidden />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSkip("media_previous_track");
              }}
              disabled={!isOn}
              className="rounded-full p-2 text-white hover:bg-white/10 disabled:opacity-40"
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
              className="inline-flex min-w-[7.75rem] items-center justify-center gap-2 rounded-full bg-white/25 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/30 disabled:opacity-40"
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
              disabled={!isOn}
              className="rounded-full p-2 text-white hover:bg-white/10 disabled:opacity-40"
              aria-label={t("music.next")}
            >
              <SkipForward className="h-5 w-5 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
