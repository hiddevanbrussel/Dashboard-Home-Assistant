"use client";

import { useState, useEffect, useRef } from "react";
import { Pause, Play, SkipBack, SkipForward, Disc3, MoreVertical } from "lucide-react";
import type { MediaCardProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";

function formatTime(seconds: number | undefined): string {
  if (seconds == null || Number.isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
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
  const [loading, setLoading] = useState(false);
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const setStates = useEntityStateStore((s) => s.setStates);
  const updatedAt = useEntityStateStore((s) => s.updatedAt);

  const isOn =
    entity?.state !== "off" &&
    entity?.state !== "unavailable" &&
    entity?.state !== "unknown";
  const isPlaying = entity?.state === "playing";
  const entityTitle = (entity?.attributes?.media_title as string) ?? "";
  const entityArtist = (entity?.attributes?.media_artist as string) ?? "";
  const mediaTitle = (mediaTitleOverride?.trim() || entityTitle) || "";
  const mediaArtist = (mediaArtistOverride?.trim() || entityArtist) || "";
  const entityPicture = entity?.attributes?.entity_picture as string | undefined;
  const duration = Number(entity?.attributes?.media_duration) || 0;
  const position = Number(entity?.attributes?.media_position) || 0;
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

  const baselineRef = useRef({ position: 0, at: 0 });
  useEffect(() => {
    if (updatedAt != null && position >= 0) {
      baselineRef.current = { position, at: updatedAt };
    }
  }, [position, updatedAt]);

  const [, setTick] = useState(0);
  useEffect(() => {
    if (!isPlaying || duration <= 0) return;
    const interval = setInterval(() => setTick((tick) => tick + 1), 1000);
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const { position: basePos, at: baseAt } = baselineRef.current;
  const displayPosition =
    isPlaying && duration > 0 && position >= 0
      ? Math.min(duration, basePos + (Date.now() - baseAt) / 1000)
      : position;
  const progressPct =
    duration > 0 ? Math.min(100, (displayPosition / duration) * 100) : 0;

  const mediaImageSrc =
    entityPicture?.startsWith("http")
      ? entityPicture
      : entityPicture
        ? `/api/ha/media-image?entity_id=${encodeURIComponent(entity_id)}&v=${encodeURIComponent(entityPicture)}`
        : null;

  const trackKey = [mediaTitle, entityPicture].filter(Boolean).join("|") || "none";
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

        <div className="relative mt-auto space-y-1.5 px-4 pb-3 pt-8">
          <div
            className="h-0.5 overflow-hidden rounded-full bg-white/25"
            role="progressbar"
            aria-valuenow={displayPosition}
            aria-valuemin={0}
            aria-valuemax={duration}
          >
            <div
              className="h-full rounded-full bg-white/90 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] tabular-nums text-white/80">
            <span>{formatTime(displayPosition)}</span>
            <span>{formatTime(duration)}</span>
          </div>
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
