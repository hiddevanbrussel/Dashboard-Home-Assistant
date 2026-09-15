"use client";

import { useState } from "react";
import { Pause, Play, SkipBack, SkipForward, Disc3, MoreVertical } from "lucide-react";
import type { MediaCardProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";
import { mediaArtworkCacheKey, mediaImageRequestUrl } from "@/lib/media-image";

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
  const [loading, setLoading] = useState(false);
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const setStates = useEntityStateStore((s) => s.setStates);

  const isOn =
    entity?.state !== "off" &&
    entity?.state !== "unavailable" &&
    entity?.state !== "unknown";
  const isPlaying = entity?.state === "playing";
  const entityTitle = (entity?.attributes?.media_title as string) ?? "";
  const entityArtist = (entity?.attributes?.media_artist as string) ?? "";
  const mediaTitle = (mediaTitleOverride?.trim() || entityTitle) || "";
  const mediaArtist = (mediaArtistOverride?.trim() || entityArtist) || "";
  const entityPicture =
    (entity?.attributes?.entity_picture as string | undefined) ??
    (entity?.attributes?.entity_picture_local as string | undefined);
  const mediaContentId = (entity?.attributes?.media_content_id as string | undefined) ?? "";
  const deviceName =
    (entity?.attributes?.friendly_name as string) || entity_id;

  async function callMedia(service: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/ha/call-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_id,
          domain: "media_player",
          service,
        }),
      });
      if (res.ok) {
        const data = await fetch("/api/ha/state").then((r) => r.json());
        if (Array.isArray(data)) setStates(data);
      }
    } finally {
      setLoading(false);
    }
  }

  function handlePlayPause() {
    callMedia("media_play_pause");
  }

  function handlePrevious() {
    callMedia("media_previous_track");
  }

  function handleNext() {
    callMedia("media_next_track");
  }

  const artworkKey = mediaArtworkCacheKey({
    entityPicture,
    mediaTitle,
    mediaArtist,
    mediaContentId,
  });
  const mediaImageSrc = entityPicture ? mediaImageRequestUrl(entity_id, artworkKey) : null;
  const trackKey = artworkKey || "none";
  const hasFixedHeight = height != null && height > 0;

  return (
    <div
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 text-white shadow-xl",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
      style={{
        ...(width != null && width > 0 && { width }),
        ...(hasFixedHeight && { height, minHeight: height }),
      }}
    >
      <div
        className={cn(
          "relative flex min-h-[168px] flex-col overflow-hidden",
          hasFixedHeight && "min-h-0 flex-1"
        )}
      >
        <div className="absolute inset-0 bg-[#1a120c]" aria-hidden>
          {mediaImageSrc ? (
            // Dynamic HA/cover URLs; next/image would require a remotePatterns allowlist.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={trackKey}
              src={mediaImageSrc}
              alt=""
              className="absolute inset-0 h-full w-full scale-110 object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Disc3 className="h-24 w-24 text-white/15" strokeWidth={1} aria-hidden />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/70" />
        </div>

        <div className="relative flex items-center gap-3 px-4 pt-3 pb-2">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10",
              isPlaying && "animate-spin"
            )}
          >
            <Disc3 className="h-4 w-4 text-white/90" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium leading-tight text-white">{title}</p>
            <p className="truncate text-xs text-white/65">{deviceName}</p>
          </div>
          {onMoreClick && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoreClick();
              }}
              className="shrink-0 rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={t("common.options")}
            >
              <MoreVertical className="h-5 w-5" aria-hidden />
            </button>
          )}
        </div>
      </div>

      <div className="relative flex shrink-0 items-center justify-between gap-2 bg-black/75 px-4 py-3 backdrop-blur-md">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{mediaTitle || "—"}</p>
          <p className="truncate text-xs text-white/60">{mediaArtist || "—"}</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={loading || !isOn}
            className="rounded-full p-2 text-white/85 hover:bg-white/10 disabled:opacity-40"
            aria-label="Previous"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handlePlayPause}
            disabled={loading || !isOn}
            className="rounded-xl bg-white/15 p-2 text-white hover:bg-white/25 disabled:opacity-40"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={loading || !isOn}
            className="rounded-full p-2 text-white/85 hover:bg-white/10 disabled:opacity-40"
            aria-label="Next"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
