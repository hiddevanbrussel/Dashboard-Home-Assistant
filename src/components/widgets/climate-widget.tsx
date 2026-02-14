"use client";

import { GlassCard } from "@/components/layout/glass-card";
import type { ClimateProps } from "./widget-types";
import { cn } from "@/lib/utils";

export function ClimateWidget({
  title = "Climate",
  value = 23,
  unit = "°",
  state: climateState = "heat",
  size = "md",
  className,
}: ClimateProps & { className?: string }) {
  return (
    <GlassCard
      className={cn(
        "p-4",
        size === "lg" && "p-5",
        size === "sm" && "p-3",
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-card-title font-medium">{title}</h3>
        <button
          type="button"
          role="switch"
          aria-checked={false}
          aria-label="Toggle"
          className="relative inline-flex h-6 w-11 shrink-0 rounded-full bg-accent-green dark:bg-accent-green border-2 border-transparent"
        />
      </div>
      <p className="text-metric font-bold text-center text-accent-orange dark:text-accent-green my-4">
        {value}
        {unit}
      </p>
      <div className="flex gap-1 justify-center text-xs text-gray-500 dark:text-gray-400">
        {["6h", "12h", "18h", "24h"].map((t) => (
          <span key={t} className="px-2 py-1 rounded bg-white/5">
            {t}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}
