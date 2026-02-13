"use client";

import { MoreVertical, Sun } from "lucide-react";
import type { EnergyMonitorCardProps } from "./widget-types";
import { cn } from "@/lib/utils";

export function EnergyMonitorCardWidget({
  title = "Afbeeldingskaart",
  background_image,
  minimal = false,
  size = "md",
  className,
  onMoreClick,
}: EnergyMonitorCardProps & { className?: string; onMoreClick?: () => void }) {
  return (
    <div
      className={cn(
        "relative flex w-full min-h-[200px] flex-col overflow-hidden rounded-2xl text-white",
        !minimal && "shadow-xl border border-white/20 dark:border-white/10",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
    >
      {/* Achtergrond: afbeelding of gradient */}
      {background_image ? (
        <div
          className={cn(
            "absolute inset-0 rounded-2xl overflow-hidden flex items-center justify-center",
            !minimal && "bg-slate-900"
          )}
        >
          <img
            src={background_image}
            alt=""
            className="w-full h-full object-contain object-center"
          />
        </div>
      ) : (
        !minimal && (
          <div
            className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-2xl"
            aria-hidden
          />
        )
      )}
      {!minimal && (
        <div className="absolute inset-0 bg-black/30 dark:bg-black/40 rounded-2xl" />
      )}

      <div className="relative flex flex-col z-10 flex-1 min-h-0">
        {!minimal ? (
          <div className="flex items-center justify-between gap-2 flex-shrink-0 px-4 pt-3 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/30 text-amber-400">
                <Sun className="h-5 w-5" aria-hidden />
              </div>
              <p className="font-semibold text-white/95">{title}</p>
            </div>
            {onMoreClick && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoreClick();
                }}
                className="p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Opties"
              >
                <MoreVertical className="h-5 w-5" aria-hidden />
              </button>
            )}
          </div>
        ) : onMoreClick ? (
          <div className="absolute right-2 top-2 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoreClick();
              }}
              className="p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Opties"
            >
              <MoreVertical className="h-5 w-5" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
