"use client";

import { GlassCard } from "@/components/layout/glass-card";
import type { LightingBrightnessProps } from "./widget-types";
import { cn } from "@/lib/utils";

export function LightingBrightnessWidget({
  title = "Lighting Brightness",
  value = 70,
  size = "md",
  className,
}: LightingBrightnessProps & { className?: string }) {
  const pct = Math.min(100, Math.max(0, value ?? 0));
  const rotation = -90 + (pct / 100) * 180;
  return (
    <GlassCard
      className={cn(
        "p-4",
        size === "lg" && "p-5",
        size === "sm" && "p-3",
        className
      )}
    >
      <h3 className="text-card-title font-medium mb-4 text-center">{title}</h3>
      <div className="relative w-32 h-24 mx-auto">
        <svg
          viewBox="0 0 100 60"
          className="w-full h-full"
          aria-hidden
        >
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200 dark:text-white/10"
          />
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-accent-yellow dark:text-accent-green"
            strokeDasharray={`${(pct / 100) * 125.6} 125.6`}
          />
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="18"
            stroke="currentColor"
            strokeWidth="3"
            className="text-accent-orange"
            transform={`rotate(${rotation} 50 50)`}
          />
        </svg>
        <p className="text-center text-xl font-bold text-accent-yellow dark:text-accent-green mt-1">
          {pct}%
        </p>
      </div>
    </GlassCard>
  );
}
