"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { RefreshCw, MoreVertical, Video } from "lucide-react";
import type { CameraCardProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";

export function CameraCardWidget({
  title = "Camera",
  entity_id,
  size = "md",
  refresh = 10,
  show_title = true,
  className,
  onMoreClick,
}: CameraCardProps & { className?: string; onMoreClick?: () => void }) {
  const { t } = useTranslation();
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const friendlyName = (entity?.attributes?.friendly_name as string) ?? entity_id;
  const [refreshKey, setRefreshKey] = useState(0);
  const [imageError, setImageError] = useState(false);

  const imageSrc = entity_id
    ? withBasePath(
        `/api/ha/camera-image?entity_id=${encodeURIComponent(entity_id)}&t=${refreshKey}`
      )
    : null;

  useEffect(() => {
    setImageError(false);
  }, [refreshKey, entity_id]);

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
      <div className="relative flex-1 min-h-0 w-full bg-black overflow-hidden">
        {imageSrc && !imageError ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 640px"
            className="pointer-events-none select-none object-cover"
            draggable={false}
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/50">
            <Video className="h-12 w-12" aria-hidden />
            <span className="sr-only">{t("cameraCard.noCamera")}</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white/90 transition-colors"
            aria-label={t("cameraCard.refresh")}
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
              aria-label={t("common.options")}
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
