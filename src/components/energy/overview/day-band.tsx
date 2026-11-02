"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { FOCUS_RING_BRAND } from "@/components/layout/tile-menu";
import { ENERGY_SETTINGS_HREF } from "@/components/energy/overview/story-cards";
import { useTranslation } from "@/hooks/use-translation";
import type { BandCellModel } from "@/lib/energy-day-band";
import type { OverviewOrientation } from "@/lib/energy-house-anchors";
import type { StoryCardModel } from "@/lib/energy-story/types";
import { cn } from "@/lib/utils";

const BAND_ACCENT = {
  solar: { light: "#B45309", dark: "#FBBF24" },
  grid: { light: "#4700B5", dark: "#8357be" },
  peak: { light: "#C2410C", dark: "#FB923C" },
  week: { light: "#4700B5", dark: "#8357be" },
} as const;

export function DayBand({
  cells,
  showLink,
  orientation,
  dark,
  style,
  onOpen,
}: {
  cells: readonly BandCellModel[];
  showLink: boolean;
  orientation: OverviewOrientation;
  dark: boolean;
  style?: CSSProperties;
  onOpen: (card: StoryCardModel, source: HTMLElement) => void;
}) {
  const { t } = useTranslation();
  if (showLink) {
    return (
      <div data-energy-band data-energy-band-link className="energy-day-band" style={style}>
        <div className="flex flex-col items-start gap-3 px-[18px] py-[14px]">
          <p className="text-[18px] font-semibold leading-snug text-[#111827] dark:text-[#f3f4f6]">
            {t("energy.story.linkTitle")}
          </p>
          <Link
            href={ENERGY_SETTINGS_HREF}
            className={cn(
              "inline-flex h-11 items-center justify-center rounded-full bg-[#4700B5] px-4 text-[15px] font-semibold text-white outline-none dark:bg-[#8357be]",
              FOCUS_RING_BRAND
            )}
          >
            {t("energy.story.linkButton")}
          </Link>
        </div>
      </div>
    );
  }
  if (cells.length === 0) return null;
  const portrait = orientation === "portrait";
  const columns = portrait ? (cells.length >= 2 ? "1fr 1fr" : "1fr") : `repeat(${cells.length}, minmax(0, 1fr))`;
  return (
    <div
      data-energy-band
      data-band-count={cells.length}
      className="energy-day-band grid"
      style={{ ...style, gridTemplateColumns: columns }}
    >
      {cells.map((cell) => {
        const accent = dark ? BAND_ACCENT[cell.kind].dark : BAND_ACCENT[cell.kind].light;
        return (
          <button
            key={cell.kind}
            type="button"
            data-band-cell={cell.kind}
            onClick={(event) => onOpen(cell.card, event.currentTarget)}
            className={cn(
              "relative min-h-[44px] px-[18px] py-[14px] text-left leading-none outline-none",
              "before:absolute before:bottom-4 before:left-0 before:top-4 before:w-px before:bg-[rgba(17,24,39,0.14)] first:before:hidden dark:before:bg-[rgba(255,255,255,0.14)]",
              "portrait:[&:nth-child(odd)]:before:hidden portrait:[&:nth-child(n+3)]:border-t portrait:[&:nth-child(n+3)]:border-[rgba(17,24,39,0.14)] dark:portrait:[&:nth-child(n+3)]:border-[rgba(255,255,255,0.14)]",
              FOCUS_RING_BRAND
            )}
          >
            <span className="flex items-center gap-2 text-[13px] font-semibold leading-none text-[#374151] dark:text-[#d1d5db]">
              <i aria-hidden className="inline-block h-[14px] w-[3px] rounded-sm" style={{ background: accent }} />
              {t(cell.labelKey)}
            </span>
            <span
              className={cn(
                "mt-1.5 block font-semibold leading-none tracking-[-0.02em] text-[#111827] tabular-nums dark:text-[#f3f4f6]",
                cell.time ? "text-[28px]" : "text-[34px]"
              )}
            >
              <span data-band-value>{cell.value}</span>
              {cell.unit ? (
                <small data-band-unit className="ml-0.5 text-[17px] font-semibold leading-none tracking-normal">
                  {cell.unit}
                </small>
              ) : null}
            </span>
            <span className="mt-[3px] block truncate text-[12px] font-normal leading-none text-[#374151] dark:text-[#d1d5db]">
              {cell.detail}
            </span>
          </button>
        );
      })}
    </div>
  );
}
