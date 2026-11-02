"use client";

import { useEffect, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import { StoryCardView } from "@/components/energy/overview/story-cards";
import { useTranslation } from "@/hooks/use-translation";
import type { StoryCardModel } from "@/lib/energy-story/types";
import { cn } from "@/lib/utils";

function focusable(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea")].filter(
    (node) => !node.hasAttribute("disabled")
  );
}

/**
 * One story card, centered at the bottom. Same dialog pattern as the weather sheet,
 * without its shadow or a visible close label.
 */
export function EnergyStorySheet({
  card,
  label,
  offlineLabel,
  reducedMotion,
  returnFocus,
  onClose,
}: {
  card: StoryCardModel | null;
  label: string;
  offlineLabel: string | null;
  reducedMotion: boolean;
  returnFocus: RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!card) return;
    const opener = returnFocus.current;
    const node = dialogRef.current;
    node?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !node) return;
      const items = focusable(node);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === node || !node.contains(active))) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [card, returnFocus]);

  if (!card || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={dialogRef}
      className="pointer-events-auto fixed inset-0 z-[120] outline-none"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      data-energy-story-sheet
      data-no-page-swipe
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px] dark:bg-black/50"
        aria-label={t("appShell.close")}
        onClick={onClose}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-3">
        <div
          className={cn(
            "pointer-events-auto flex flex-col items-center gap-3",
            !reducedMotion && "energy-story-sheet-in"
          )}
        >
          {offlineLabel ? (
            <p
              data-energy-sheet-offline
              className="rounded-full bg-[rgba(255,255,255,0.9)] px-3 py-1 text-sm font-semibold text-[#374151] dark:bg-[rgba(28,22,38,0.9)] dark:text-[#d1d5db]"
            >
              {offlineLabel}
            </p>
          ) : null}
          <StoryCardView card={card} />
        </div>
      </div>
    </div>,
    document.body
  );
}
