"use client";

import { cn } from "@/lib/utils";
import { ZoomIn, ZoomOut, Search, X } from "lucide-react";

type FloatingToolbarProps = {
  className?: string;
};

export function FloatingToolbar({ className }: FloatingToolbarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-gray-900/90 px-3 py-2 shadow-lg dark:bg-black/50",
        className
      )}
      role="toolbar"
      aria-label="Floating toolbar"
    >
      <button
        type="button"
        aria-label="Zoom in"
        className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/15 hover:text-white"
      >
        <ZoomIn className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Zoom out"
        className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/15 hover:text-white"
      >
        <ZoomOut className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Search"
        className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/15 hover:text-white"
      >
        <Search className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Close"
        className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/15 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
