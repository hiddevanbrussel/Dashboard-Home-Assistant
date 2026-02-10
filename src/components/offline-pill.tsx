"use client";

import { useEntityStateStore } from "@/stores/entity-state-store";
import { cn } from "@/lib/utils";

type OfflinePillProps = {
  className?: string;
};

export function OfflinePill({ className }: OfflinePillProps) {
  const isOffline = useEntityStateStore((s) => s.error != null);
  if (!isOffline) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-red-500/90 px-2.5 py-0.5 text-xs font-medium text-white",
        className
      )}
    >
      Offline
    </span>
  );
}
