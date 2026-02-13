"use client";

import { GlassCard } from "@/components/layout/glass-card";
import type { WifiProps } from "./widget-types";
import { Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

export function WifiWidget({
  title = "Wi-Fi",
  value = "on",
  size = "md",
  className,
}: WifiProps & { className?: string }) {
  const on = value === "on";
  return (
    <GlassCard
      className={cn(
        "p-4 flex items-center justify-between",
        size === "lg" && "p-5",
        size === "sm" && "p-3",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Wifi
          className={cn(
            "h-6 w-6 text-accent-orange dark:text-accent-green",
            !on && "opacity-50 text-gray-400 dark:text-gray-500"
          )}
        />
        <h3 className="text-card-title font-medium">{title}</h3>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors",
          on
            ? "bg-accent-green dark:bg-accent-green"
            : "bg-gray-300 dark:bg-white/20"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition",
            on ? "translate-x-5" : "translate-x-1"
          )}
        />
      </button>
    </GlassCard>
  );
}
