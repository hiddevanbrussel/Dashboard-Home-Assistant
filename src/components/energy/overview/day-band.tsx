"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import Link from "next/link";
import { FOCUS_RING_BRAND } from "@/components/layout/tile-menu";
import { ENERGY_SETTINGS_HREF } from "@/components/energy/overview/story-cards";
import { useSwapClock } from "@/hooks/use-swap-clock";
import { useTranslation } from "@/hooks/use-translation";
import { swapPhase, type BandCellModel, type SwapPhase } from "@/lib/energy-day-band";
import type { OverviewOrientation } from "@/lib/energy-house-anchors";
import type { StoryCardModel } from "@/lib/energy-story/types";
import { cn } from "@/lib/utils";

const BAND_ACCENT = {
  solar: { light: "#B45309", dark: "#FBBF24" },
  grid: { light: "#4700B5", dark: "#8357be" },
  peak: { light: "#C2410C", dark: "#FB923C" },
  week: { light: "#4700B5", dark: "#8357be" },
} as const;

const CELL_CLASS = cn(
  "relative min-h-[44px] px-[18px] py-[14px] text-left leading-none outline-none",
  "before:absolute before:bottom-4 before:left-0 before:top-4 before:w-px before:bg-[rgba(17,24,39,0.14)] first:before:hidden dark:before:bg-[rgba(255,255,255,0.14)]",
  "portrait:[&:nth-child(odd)]:before:hidden portrait:[&:nth-child(n+3)]:border-t portrait:[&:nth-child(n+3)]:border-[rgba(17,24,39,0.14)] dark:portrait:[&:nth-child(n+3)]:border-[rgba(255,255,255,0.14)]",
  FOCUS_RING_BRAND
);

export function DayBand({
  cells,
  showLink,
  orientation,
  dark,
  style,
  onOpen,
  paused = false,
  reducedMotion = false,
}: {
  cells: readonly BandCellModel[];
  showLink: boolean;
  orientation: OverviewOrientation;
  dark: boolean;
  style?: CSSProperties;
  onOpen: (card: StoryCardModel, source: HTMLElement) => void;
  /** Sheet, hidden tab, screensaver, off-screen or a non-overview tab. Focus is handled on the solar cell. */
  paused?: boolean;
  reducedMotion?: boolean;
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
        switch (cell.swap) {
          case "static":
            return (
              <StaticBandCell
                key={cell.kind}
                cell={cell}
                accent={accent}
                label={t(cell.labelKey)}
                onOpen={onOpen}
              />
            );
          case "swap":
          case "todayOnly":
            return (
              <SolarBandCell
                key={cell.kind}
                cell={cell}
                accent={accent}
                label={t(cell.labelKey)}
                paused={paused}
                reducedMotion={reducedMotion}
                onOpen={onOpen}
              />
            );
          default: {
            const neverSwap: never = cell.swap;
            return neverSwap;
          }
        }
      })}
    </div>
  );
}

function BandLabel({ accent, label }: { accent: string; label: string }) {
  return (
    <span className="flex items-center gap-2 text-[13px] font-semibold leading-none text-[#374151] dark:text-[#d1d5db]">
      <i aria-hidden className="inline-block h-[14px] w-[3px] rounded-sm" style={{ background: accent }} />
      {label}
    </span>
  );
}

function BandReadout({
  value,
  unit,
  detail,
  time,
  inset,
}: {
  value: string;
  unit: string;
  detail: string;
  time: boolean;
  inset: boolean;
}) {
  return (
    <>
      <span
        className={cn(
          "block font-semibold leading-none tracking-[-0.02em] text-[#111827] tabular-nums dark:text-[#f3f4f6]",
          time ? "text-[28px]" : "text-[34px]",
          !inset && "mt-1.5"
        )}
      >
        <span data-band-value>{value}</span>
        {unit ? (
          <small data-band-unit className="ml-0.5 text-[17px] font-semibold leading-none tracking-normal">
            {unit}
          </small>
        ) : null}
      </span>
      <span className="mt-[3px] block truncate text-[12px] font-normal leading-none text-[#374151] dark:text-[#d1d5db]">
        {detail}
      </span>
    </>
  );
}

function StaticBandCell({
  cell,
  accent,
  label,
  onOpen,
}: {
  cell: BandCellModel;
  accent: string;
  label: string;
  onOpen: (card: StoryCardModel, source: HTMLElement) => void;
}) {
  return (
    <button
      type="button"
      data-band-cell={cell.kind}
      aria-label={cell.ariaLabel || undefined}
      onClick={(event) => onOpen(cell.card, event.currentTarget)}
      className={CELL_CLASS}
    >
      <BandLabel accent={accent} label={label} />
      <BandReadout value={cell.value} unit={cell.unit} detail={cell.detail} time={cell.time} inset={false} />
    </button>
  );
}

function useDisplayedPhase(live: SwapPhase, hold: boolean, active: boolean): { phase: SwapPhase; animate: boolean } {
  const [shown, setShown] = useState<SwapPhase>("primary");
  const [animate, setAnimate] = useState(false);
  const prevHold = useRef(false);
  const ready = useRef(false);

  useLayoutEffect(() => {
    if (!active) return;
    if (hold) {
      if (!ready.current) {
        ready.current = true;
        setAnimate(false);
        setShown(live);
      }
      prevHold.current = true;
      return;
    }
    const resume = !ready.current || prevHold.current;
    prevHold.current = false;
    ready.current = true;
    if (resume) {
      setAnimate(false);
      setShown(swapPhase(Date.now()));
      return;
    }
    setAnimate(true);
    setShown(live);
  }, [active, hold, live]);

  return { phase: shown, animate: active && animate && !hold };
}

function placeRoll(root: HTMLElement, phase: SwapPhase, animate: boolean, phaseRef: RefObject<SwapPhase | null>) {
  const pct = root.querySelector<HTMLElement>("[data-band-layer='pct']");
  const kwh = root.querySelector<HTMLElement>("[data-band-layer='kwh']");
  if (!pct || !kwh) return;
  const previous = phaseRef.current;
  if (previous === phase) return;
  const first = previous == null;
  phaseRef.current = phase;
  if (first || !animate) {
    root.dataset.bandMotion = "off";
    pct.dataset.roll = phase === "primary" ? "show" : "in";
    kwh.dataset.roll = phase === "alt" ? "show" : "in";
    return;
  }
  const incoming = phase === "alt" ? kwh : pct;
  const outgoing = phase === "alt" ? pct : kwh;
  root.dataset.bandMotion = "off";
  incoming.dataset.roll = "in";
  void incoming.offsetWidth;
  root.dataset.bandMotion = "on";
  outgoing.dataset.roll = "out";
  incoming.dataset.roll = "show";
}

function SolarBandCell({
  cell,
  accent,
  label,
  paused,
  reducedMotion,
  onOpen,
}: {
  cell: BandCellModel;
  accent: string;
  label: string;
  paused: boolean;
  reducedMotion: boolean;
  onOpen: (card: StoryCardModel, source: HTMLElement) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState(false);
  const rollRef = useRef<HTMLSpanElement>(null);
  const phaseRef = useRef<SwapPhase | null>(null);
  const modeRef = useRef(cell.swap);
  const active = mounted && cell.swap === "swap" && !reducedMotion;
  const live = useSwapClock(active);
  const held = useDisplayedPhase(live, !active || paused || focused, active);
  const phase: SwapPhase = cell.swap === "todayOnly" ? "alt" : held.phase;
  const face = phase === "alt" ? "kwh" : "pct";

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (modeRef.current !== cell.swap) {
    modeRef.current = cell.swap;
    phaseRef.current = null;
  }

  useLayoutEffect(() => {
    const root = rollRef.current;
    if (!root) return;
    if (cell.swap === "todayOnly") {
      root.dataset.bandMotion = "off";
      const kwh = root.querySelector<HTMLElement>("[data-band-layer='kwh']");
      if (kwh) kwh.dataset.roll = "show";
      phaseRef.current = "alt";
      return;
    }
    placeRoll(root, phase, held.animate, phaseRef);
  }, [cell.swap, held.animate, phase]);

  const pct = cell.swap === "swap" ? cell : null;
  const kwh = cell.swap === "todayOnly" ? cell : cell.alt;

  return (
    <button
      type="button"
      data-band-cell={cell.kind}
      data-band-swap={face}
      aria-label={cell.ariaLabel || undefined}
      onFocus={(event) => setFocused(event.currentTarget.matches(":focus-visible"))}
      onBlur={() => setFocused(false)}
      onClick={(event) => onOpen(cell.card, event.currentTarget)}
      className={CELL_CLASS}
    >
      <BandLabel accent={accent} label={label} />
      <span ref={rollRef} className="energy-band-roll" aria-hidden="true">
        {pct ? (
          <span className="energy-band-roll-layer" data-band-layer="pct" aria-hidden="true">
            <BandReadout value={pct.value} unit={pct.unit} detail={pct.detail} time={false} inset />
          </span>
        ) : null}
        {kwh ? (
          <span className="energy-band-roll-layer" data-band-layer="kwh" aria-hidden="true">
            <BandReadout value={kwh.value} unit={kwh.unit} detail={kwh.detail} time={false} inset />
          </span>
        ) : null}
      </span>
    </button>
  );
}
