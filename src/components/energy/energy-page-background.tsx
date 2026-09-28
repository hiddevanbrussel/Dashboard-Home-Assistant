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
 * Page-wide Energy illustration (light/dark): edge-to-edge under the topbar,
 * soft fade only at the bottom into `--page-bg`. Keep the full house in frame
 * (`object-contain`) so bike / bolt / battery stay visible — no heavy washes.
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
        "pointer-events-none absolute z-0 overflow-hidden",
        // Break out of main px/py so art is page-wide and sits behind the topbar
        "inset-x-0 top-0 -mx-4 -mt-4 sm:-mx-6",
        "w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)]",
        "h-[min(62vh,40rem)] sm:h-[min(68vh,44rem)]",
        className
      )}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-contain object-[center_bottom]"
        decoding="async"
        fetchPriority="low"
      />
      {/* Soft verloop alleen onderaan — geen zijfades, geen dichte top-wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 48%, color-mix(in srgb, var(--page-bg) 28%, transparent) 72%, color-mix(in srgb, var(--page-bg) 72%, transparent) 88%, var(--page-bg) 100%)",
        }}
      />
    </div>
  );
}
