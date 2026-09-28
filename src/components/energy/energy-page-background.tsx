"use client";

import { withBasePath } from "@/lib/base-path";
import { resolveEnergyPageBackground } from "@/lib/energy-dashboard";
import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";

type EnergyPageBackgroundProps = {
  background?: string | null;
  backgroundLight?: string | null;
  backgroundDark?: string | null;
  className?: string;
};

/**
 * Full-bleed Energy dashboard art (light/dark) with a soft theme wash so
 * chrome and floating cards stay readable.
 */
export function EnergyPageBackground({
  background,
  backgroundLight,
  backgroundDark,
  className,
}: EnergyPageBackgroundProps) {
  const resolved = useThemeStore((s) => s.resolved);
  const src = withBasePath(
    resolveEnergyPageBackground(resolved, {
      background,
      backgroundLight,
      backgroundDark,
    })
  );

  return (
    <div
      className={cn("pointer-events-none fixed inset-0 z-0 overflow-hidden", className)}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* Soft light gradient: theme color from edges into the illustration */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-b from-page-light/92 via-page-light/35 to-page-light/80",
          "dark:from-dark-page/92 dark:via-dark-page/30 dark:to-dark-page/85"
        )}
      />
      <div
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-r from-page-light/75 via-transparent to-page-light/55",
          "dark:from-dark-page/70 dark:via-transparent dark:to-dark-page/60"
        )}
      />
    </div>
  );
}
