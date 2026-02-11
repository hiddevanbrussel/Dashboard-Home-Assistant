"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Disc3,
  MoreVertical,
} from "lucide-react";
import type { MediaCardProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";

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
  className,
  onMoreClick,
}: MediaCardProps & { className?: string; onMoreClick?: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const setStates = useEntityStateStore((s) => s.setStates);
  const updatedAt = useEntityStateStore((s) => s.updatedAt);

  const isOn =
    entity?.state !== "off" &&
    entity?.state !== "unavailable" &&
    entity?.state !== "unknown";
  const isPlaying = entity?.state === "playing";
  const mediaTitle = (entity?.attributes?.media_title as string) ?? "";
  const mediaArtist = (entity?.attributes?.media_artist as string) ?? "";
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

  // Baseline voor interpolatie: alleen bijwerken bij echte HA-updates, niet bij elke re-render
  const baselineRef = useRef({ position: 0, at: 0 });
  useEffect(() => {
    if (updatedAt != null && position >= 0) {
      baselineRef.current = { position, at: updatedAt };
    }
  }, [position, updatedAt]);

  // Elke seconde re-renderen om tijd/progress te updaten; baseline staat in ref dus herstart niet
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!isPlaying || duration <= 0) return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const { position: basePos, at: baseAt } = baselineRef.current;
  const displayPosition =
    isPlaying && duration > 0 && position >= 0
      ? Math.min(duration, basePos + (Date.now() - baseAt) / 1000)
      : position;
  const progressPct =
    duration > 0 ? Math.min(100, (displayPosition / duration) * 100) : 0;

  // Unieke URL per nummer zodat de afbeelding ververst bij trackwissel (geen oude cache)
  const mediaImageSrc =
    entityPicture?.startsWith("http")
      ? entityPicture
      : entityPicture
        ? `/api/ha/media-image?entity_id=${encodeURIComponent(entity_id)}&v=${encodeURIComponent(entityPicture)}`
        : null;

  // Key per nummer: oude afbeelding verdwijnt direct bij trackwissel, nieuwe laadt in
  const trackKey = [mediaTitle, entityPicture].filter(Boolean).join("|") || "none";

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl bg-white/10 dark:bg-black/50 text-white shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
    >
      {/* Expanded: album art + progress boven de header (uitklapt naar boven); chevron alleen hier */}
      {expanded && (
        <>
          <div className="px-4 pt-4 pb-2">
            {mediaImageSrc ? (
              <button
                key={trackKey}
                type="button"
                onClick={() => setExpanded(false)}
                className="block relative w-full aspect-square max-h-48 mx-auto rounded-xl overflow-hidden bg-white/5 hover:opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Inklappen"
              >
                <img
                  src={mediaImageSrc}
                  alt=""
                  className="w-full h-full object-cover pointer-events-none"
                />
              </button>
            ) : (
              <div className="w-full aspect-square max-h-48 mx-auto rounded-xl bg-white/5 flex items-center justify-center">
                <Disc3 className="h-16 w-16 text-white/20" />
              </div>
            )}
            <div className="mt-2 space-y-1">
              <div
                className="h-1 rounded-full bg-white/20 overflow-hidden"
                role="progressbar"
                aria-valuenow={displayPosition}
                aria-valuemin={0}
                aria-valuemax={duration}
              >
                <div
                  className="h-full rounded-full bg-white transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/60">
                <span>{formatTime(displayPosition)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="flex items-center justify-center gap-1 py-1 text-white/50 hover:text-white/80 transition-colors"
            aria-label="Inklappen"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Header: entity_picture als achtergrond, daarboven icon + titel + entity + thumbnail */}
      <div className="relative overflow-hidden">
        {mediaImageSrc && (
          <div className="absolute inset-0" aria-hidden>
            <img
              src={mediaImageSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover scale-105 blur-md opacity-70"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}
        <div className="relative flex items-center gap-3 px-4 py-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5",
              isPlaying && "animate-spin"
            )}
          >
            <Disc3 className="h-5 w-5 text-white/80" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate text-white/90">{title}</p>
            <p className="text-xs text-white/60 truncate">{deviceName}</p>
          </div>
          {onMoreClick && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMoreClick(); }}
              className="p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Opties"
            >
              <MoreVertical className="h-5 w-5" aria-hidden />
            </button>
          )}
          {mediaImageSrc ? (
          !expanded ? (
            <button
              key={trackKey}
              type="button"
              onClick={() => setExpanded(true)}
              className="h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-white/5 border border-white/20 hover:border-white/40 hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Uitklappen"
            >
              <img
                src={mediaImageSrc}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ) : (
            <div key={trackKey} className="h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-white/5 border border-white/20">
              <img
                src={mediaImageSrc}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          )
        ) : !expanded ? (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="h-10 w-10 shrink-0 rounded-lg bg-white/5 border border-white/20 flex items-center justify-center hover:border-white/40 hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Uitklappen"
          >
            <Disc3 className="h-5 w-5 text-white/30" strokeWidth={1.5} />
          </button>
        ) : (
          <div className="h-10 w-10 shrink-0 rounded-lg bg-white/5 border border-white/20 flex items-center justify-center">
            <Disc3 className="h-5 w-5 text-white/30" strokeWidth={1.5} />
          </div>
        )}
        </div>
      </div>

      {/* Onderste balk: track + controls — altijd hetzelfde */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 bg-black/20 dark:bg-black/30 backdrop-blur-md rounded-b-2xl">
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate text-sm">
            {mediaTitle || "—"}
          </p>
          <p className="text-xs text-white/60 truncate">
            {mediaArtist || "—"}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={loading || !isOn}
            className="p-2 rounded-full text-white/80 hover:bg-white/10 disabled:opacity-40"
            aria-label="Previous"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handlePlayPause}
            disabled={loading || !isOn}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-40"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={loading || !isOn}
            className="p-2 rounded-full text-white/80 hover:bg-white/10 disabled:opacity-40"
            aria-label="Next"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
