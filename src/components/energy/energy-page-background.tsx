"use client";

import { withBasePath } from "@/lib/base-path";
import { resolveEnergyPageBackground } from "@/lib/energy-dashboard";
import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";

type EnergyPageBackgroundProps = {
  /** @deprecated Ignored — energy always uses bundled vector illustrations. */
  background?: string | null;
  /** @deprecated Ignored — energy always uses bundled vector illustrations. */
  backgroundLight?: string | null;
  /** @deprecated Ignored — energy always uses bundled vector illustrations. */
  backgroundDark?: string | null;
  className?: string;
};

/**
 * Full-viewport Energy illustration (light/dark): spans left→right edge
 * (including behind the sidebar) and sits under the topbar, with a soft
 * bottom-only fade into `--page-bg`. Always the bundled vector art — never
 * patio / photoreal / dashboard wallpaper / custom uploads.
 */
export function EnergyPageBackground({ className }: EnergyPageBackgroundProps) {
  const resolved = useThemeStore((s) => s.resolved);
  const src = withBasePath(resolveEnergyPageBackground(resolved));

  return (
    <div
      className={cn(
        // fixed + inset-x-0 = true page width (under sidebar); z-0 under chrome (sidebar z-60, header z-70)
        "pointer-events-none fixed inset-x-0 top-0 z-0 overflow-hidden",
        "h-[min(72vh,46rem)] sm:h-[min(78vh,50rem)]",
        className
      )}
      aria-hidden
      data-energy-page-bg={src}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_bottom]"
        decoding="async"
        fetchPriority="high"
        data-energy-bg-src={src}
      />
      {/* Subtle bottom fade only — keep most of the illustration visible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 68%, color-mix(in srgb, var(--page-bg) 18%, transparent) 84%, color-mix(in srgb, var(--page-bg) 55%, transparent) 94%, var(--page-bg) 100%)",
        }}
      />
    </div>
  );
}
