"use client";

import { useState, useEffect } from "react";
import { RefreshCw, MoreVertical, Video } from "lucide-react";
import type { CameraCardProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";

export function CameraCardWidget({
  title = "Camera",
  entity_id,
  size = "md",
  refresh = 10,
  show_title = true,
  className,
  onMoreClick,
}: CameraCardProps & { className?: string; onMoreClick?: () => void }) {
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const friendlyName = (entity?.attributes?.friendly_name as string) ?? entity_id;
  const [refreshKey, setRefreshKey] = useState(0);

  const imageSrc = entity_id
    ? `/api/ha/camera-image?entity_id=${encodeURIComponent(entity_id)}&t=${refreshKey}`
    : null;

  useEffect(() => {
    if (!refresh || refresh < 1) return;
    const interval = setInterval(() => setRefreshKey((k) => k + 1), refresh * 1000);
    return () => clearInterval(interval);
  }, [refresh]);

  function handleRefresh() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl bg-black/80 dark:bg-black/90 text-white shadow-xl border border-white/20 dark:border-white/10",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
    >
      <div className="relative aspect-video w-full bg-black overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/50">
            <Video className="h-12 w-12" aria-hidden />
            <span className="sr-only">Geen camera</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white/90 transition-colors"
            aria-label="Ververs"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
          </button>
          {onMoreClick && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoreClick();
              }}
              className="p-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white/90 transition-colors"
              aria-label="Opties"
            >
              <MoreVertical className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </div>
      {show_title && (
        <div className="px-3 py-2 flex items-center justify-between gap-2 shrink-0">
          <p className="font-medium truncate text-white/90">{title}</p>
          <p className="text-xs text-white/60 truncate max-w-[40%]">{friendlyName}</p>
        </div>
      )}
    </div>
  );
}
