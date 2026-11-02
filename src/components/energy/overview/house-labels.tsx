"use client";

import type { CSSProperties, ReactNode } from "react";
import { FOCUS_RING_BRAND } from "@/components/layout/tile-menu";
import type { HouseLabelKind } from "@/lib/energy-house-labels";
import { cn } from "@/lib/utils";

export function HouseLabel({
  kind,
  value,
  unit,
  accent,
  left,
  top,
  ariaLabel,
  interactive,
  offline,
  active,
  icon,
  onOpen,
}: {
  kind: HouseLabelKind;
  value: string;
  unit: string;
  accent: string;
  left: number;
  top: number;
  ariaLabel: string;
  interactive: boolean;
  offline: boolean;
  active: boolean;
  icon: ReactNode;
  onOpen?: (source: HTMLElement) => void;
}) {
  const className = cn(
    "energy-house-label absolute z-[5] inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-xl border border-white/80 bg-[rgba(255,255,255,0.84)] py-2 pl-3 pr-2.5 text-left outline-none dark:border-white/10 dark:bg-[rgba(28,22,38,0.86)]",
    interactive && FOCUS_RING_BRAND
  );
  const style = {
    left: `${left}%`,
    top: `${top}%`,
    "--label-accent": accent,
  } as CSSProperties;
  const body = (
    <>
      <span
        data-now-icon={kind === "solar" ? "sun" : kind}
        className="inline-flex shrink-0 text-[color:var(--label-accent)]"
      >
        {icon}
      </span>
      <b
        className={cn(
          "text-[22px] font-semibold leading-none tracking-[-0.01em] text-[#111827] tabular-nums dark:text-[#f3f4f6]",
          offline && "text-[#4b5563] dark:text-[#b4b4bd]"
        )}
      >
        <span data-now-value>{value}</span>
        {unit ? (
          <small
            data-now-unit
            className={cn(
              "ml-0.5 text-[13px] font-semibold tracking-normal text-[#374151] dark:text-[#d1d5db]",
              offline && "text-[#4b5563] dark:text-[#b4b4bd]"
            )}
          >
            {unit}
          </small>
        ) : null}
      </b>
    </>
  );
  const marker = kind === "house" ? { "data-now-house": "" } : {};
  if (!interactive) {
    return (
      <div
        data-now-label={kind}
        data-now-interactive="0"
        data-now-off={active ? "0" : "1"}
        aria-label={ariaLabel}
        className={className}
        style={style}
        {...marker}
      >
        {body}
      </div>
    );
  }
  return (
    <button
      type="button"
      data-now-label={kind}
      data-now-interactive="1"
      data-now-off={active ? "0" : "1"}
      aria-label={ariaLabel}
      className={className}
      style={style}
      onClick={(event) => onOpen?.(event.currentTarget)}
      {...marker}
    >
      {body}
    </button>
  );
}
