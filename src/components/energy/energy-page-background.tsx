"use client";

import { withBasePath } from "@/lib/base-path";
import { resolveEnergyPageBackground } from "@/lib/energy-dashboard";
import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";

type EnergyPageBackgroundProps = {
  /** @deprecated Ignored — energy never uses the shared patio/global wallpaper field. */
  background?: string | null;
  /** Custom light-mode energy page background (`/uploads/...`), else bundled art. */
  backgroundLight?: string | null;
  /** Custom dark-mode energy page background (`/uploads/...`), else bundled art. */
  backgroundDark?: string | null;
  className?: string;
};

/**
 * Full-viewport Energy illustration (light/dark): spans left→right edge
 * (including behind the sidebar) and sits under the topbar, with a soft
 * bottom-only fade into `--page-bg`. Uses a custom upload when set in
 * Settings → Energy; otherwise the bundled vector art. Never inherits the
 * patio / dashboard page wallpaper.
 *
 * Custom uploads (including animated SVG) are rendered via `<img>` so scripts
 * in SVG never execute. SMIL animations typically run; CSS animations inside
 * an external SVG often do not when loaded as an image.
 */
export function EnergyPageBackground({
  backgroundLight,
  backgroundDark,
  className,
}: EnergyPageBackgroundProps) {
  const resolved = useThemeStore((s) => s.resolved);
  const src = withBasePath(
    resolveEnergyPageBackground(resolved, { backgroundLight, backgroundDark })
  );

  return (
    <div
      className={cn(
        // fixed + inset-x-0 = true page width (under sidebar); z-0 under chrome (sidebar z-60, header z-70)
        "pointer-events-none fixed inset-x-0 top-0 z-0 overflow-hidden",
        // Nearly full viewport so the illustration stays visible; only a thin bottom fade
        "h-[100dvh]",
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
      {/* Thin bottom fade only — do not white-out half the page */}
      <div
        className="absolute inset-x-0 bottom-0 h-[28%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--page-bg) 22%, transparent) 55%, color-mix(in srgb, var(--page-bg) 70%, transparent) 82%, var(--page-bg) 100%)",
        }}
      />
    </div>
  );
}
