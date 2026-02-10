"use client";

import { GlassCard } from "@/components/layout/glass-card";
import type { EnergyUsageProps } from "./widget-types";
import { cn } from "@/lib/utils";

export function EnergyUsageWidget({
  title = "Energy Usage",
  value = 65,
  label = "Medium",
  size = "md",
  className,
}: EnergyUsageProps & { className?: string }) {
  const pct = Math.min(100, Math.max(0, value ?? 0));
  return (
    <GlassCard
      className={cn(
        "p-4",
        size === "lg" && "p-5",
        size === "sm" && "p-3",
        className
      )}
    >
      <h3 className="text-card-title font-medium mb-2">{title}</h3>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-2xl font-bold text-accent-yellow dark:text-accent-green">
          {pct}%
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            "bg-gradient-to-r from-accent-yellow to-accent-green dark:from-accent-green dark:to-accent-yellow"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </GlassCard>
  );
}
