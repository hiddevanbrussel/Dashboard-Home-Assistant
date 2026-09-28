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
 * Full-viewport Energy illustration (light/dark): spans left→right edge
 * (including behind the sidebar) and sits under the topbar, with a soft
 * bottom-only fade into `--page-bg`. Bottom-anchored cover keeps house /
 * bike / bolt / battery visible — no side fades, no near-opaque washes.
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
        // fixed + inset-x-0 = true page width (under sidebar); z-0 under chrome (sidebar z-60, header z-70)
        "pointer-events-none fixed inset-x-0 top-0 z-0 overflow-hidden",
        "h-[min(62vh,40rem)] sm:h-[min(68vh,44rem)]",
        className
      )}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_bottom]"
        decoding="async"
        fetchPriority="low"
      />
      {/* Soft verloop alleen onderaan */}
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
