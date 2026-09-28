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
 * Energy hero illustration (light/dark) — decorative panel, not a full-viewport
 * wallpaper. Keep the full house in frame (`object-contain`) so bike / bolt /
 * battery stay visible; soft fade into `--page-bg` so cards stay readable.
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
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden",
        "h-[min(58vh,36rem)] sm:h-[min(62vh,40rem)]",
        className
      )}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-contain object-center"
        decoding="async"
        fetchPriority="low"
      />
      {/* Soft vertical verloop into page background — keep art readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--page-bg) 28%, transparent) 0%, transparent 18%, transparent 55%, color-mix(in srgb, var(--page-bg) 35%, transparent) 78%, var(--page-bg) 100%)",
        }}
      />
      {/* Side fades so the panel doesn’t read edge-to-edge */}
      <div
        className="absolute inset-y-0 left-0 w-[8%] max-w-20"
        style={{
          background: "linear-gradient(to right, var(--page-bg), transparent)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-[8%] max-w-20"
        style={{
          background: "linear-gradient(to left, var(--page-bg), transparent)",
        }}
      />
    </div>
  );
}
