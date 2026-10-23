"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { canFocusMenu, firstEnabledIndex, placeTileMenu } from "@/lib/tile-menu-layout";

/** Accent focus ring: #4700B5 in light mode, #8357be in dark mode. */
export const FOCUS_RING_BRAND =
  "focus-visible:ring-2 focus-visible:ring-brand dark:focus-visible:ring-brand-muted";

export type TileMenuItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  /** Secondary text under the label (e.g. why the row is disabled). */
  hint?: string;
  onSelect: () => void;
};

/** Viewport rect the menu is anchored to (usually the tapped tile). */
export type TileMenuAnchor = { left: number; top: number; right: number; bottom: number };

export function anchorFromElement(el: Element): TileMenuAnchor {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
}

/** Close a popover on a tap outside `ref` or on Escape. */
export function usePopoverDismiss(ref: RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
      onClose();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    // Defer so the tap that opened the popover does not close it again.
    const id = window.setTimeout(() => document.addEventListener("pointerdown", onPointerDown, true), 0);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ref, onClose]);
}

/**
 * Small popover menu for a tile. Knows nothing about tile types: callers pass the rows.
 * Closes on outside tap, Escape or selection. Rows are ≥44 px for touch.
 */
export function TileMenu({
  anchor,
  items,
  ariaLabel,
  onClose,
}: {
  anchor: TileMenuAnchor;
  items: TileMenuItem[];
  ariaLabel: string;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const focusedRef = useRef(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    setPos(
      placeTileMenu(
        anchor,
        { width: el.offsetWidth, height: el.offsetHeight },
        { width: window.innerWidth, height: window.innerHeight }
      )
    );
    // anchor is a fresh object per open; its coordinates are what matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchor.left, anchor.top, anchor.right, anchor.bottom]);

  // Move focus in only after placement: while visibility is hidden, focus() is ignored.
  useEffect(() => {
    if (!canFocusMenu(pos != null, focusedRef.current)) return;
    const index = firstEnabledIndex(items);
    const target = index >= 0 ? itemRefs.current[index] : menuRef.current;
    target?.focus({ preventScroll: true });
    focusedRef.current = true;
  }, [pos, items]);

  // Give focus back to whatever opened the menu (e.g. the ⋮), if it is still on the page.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    return () => {
      // Only when focus fell back to <body> (the focused row was removed); never steal it from elsewhere.
      const active = document.activeElement;
      if (opener?.isConnected && (!active || active === document.body || !active.isConnected)) {
        opener.focus({ preventScroll: true });
      }
    };
  }, []);

  usePopoverDismiss(menuRef, onClose);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      aria-label={ariaLabel}
      tabIndex={-1}
      className="fixed z-[310] min-w-[220px] max-w-[calc(100vw-1rem)] overflow-hidden rounded-2xl border border-[rgba(17,24,39,0.08)] bg-white/95 p-1 text-[#111827] shadow-[0_12px_32px_rgba(15,10,40,0.18)] outline-none backdrop-blur-xl dark:border-white/10 dark:bg-[#1b1a21] dark:text-[#f3f4f6] dark:shadow-[0_12px_32px_rgba(0,0,0,0.55)] dark:backdrop-blur-none"
      style={pos ? { left: pos.left, top: pos.top } : { left: -9999, top: -9999, visibility: "hidden" }}
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            aria-disabled={item.disabled || undefined}
            onClick={() => {
              if (item.disabled) return;
              onClose();
              item.onSelect();
            }}
            className={cn(
              "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[15px] font-medium outline-none",
              FOCUS_RING_BRAND,
              "focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#1b1a21]",
              item.disabled
                ? "cursor-not-allowed text-gray-600 dark:text-gray-400"
                : "active:bg-[rgba(17,24,39,0.06)] dark:active:bg-white/10"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            <span className="flex flex-col">
              <span>{item.label}</span>
              {item.hint ? (
                <span className="text-xs font-normal text-gray-600 dark:text-gray-400">{item.hint}</span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>,
    document.body
  );
}
