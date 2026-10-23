"use client";

import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { StatPillCardWidget } from "@/components/widgets/stat-pill-card-widget";
import type { SensorCondition } from "@/components/widgets/widget-types";
import type { WidgetConfig } from "@/stores/onboarding-store";
import { anchorFromElement, usePopoverDismiss, type TileMenuAnchor } from "./tile-menu";

const slotFocusClass =
  "rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400";

function PinnedPill({
  widget,
  editMode,
  onOpenMenu,
  className,
}: {
  widget: WidgetConfig;
  editMode: boolean;
  onOpenMenu: (widgetId: string, anchor: TileMenuAnchor) => void;
  className?: string;
}) {
  const slotRef = useRef<HTMLDivElement | null>(null);
  const open = () => {
    if (slotRef.current) onOpenMenu(widget.id, anchorFromElement(slotRef.current));
  };
  return (
    // 44 px tall hit area; the parent row is 0 px tall so the header height does not change.
    <div
      ref={slotRef}
      data-header-statpill-id={widget.id}
      className={cn("flex h-11 shrink-0 items-center", editMode && "cursor-pointer", slotFocusClass, className)}
      {...(editMode && {
        role: "button",
        tabIndex: 0,
        "aria-haspopup": "menu" as const,
        onClick: open,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        },
      })}
    >
      <div className={cn(editMode && "animate-edit-wiggle")}>
        <StatPillCardWidget
          title={widget.title ?? "Stat"}
          entity_id={widget.entity_id}
          label={widget.label}
          icon={widget.icon}
          color={(widget.color as "amber" | "purple" | "emerald" | "red") ?? "amber"}
          conditions={widget.conditions as SensorCondition[] | undefined}
          size={(widget.size as "sm" | "md" | "lg") ?? "md"}
          onMoreClick={editMode ? open : undefined}
        />
      </div>
    </div>
  );
}

function OverflowList({
  anchor,
  pills,
  editMode,
  onOpenMenu,
  onClose,
}: {
  anchor: TileMenuAnchor;
  pills: WidgetConfig[];
  editMode: boolean;
  onOpenMenu: (widgetId: string, anchor: TileMenuAnchor) => void;
  onClose: () => void;
}) {
  const listRef = useRef<HTMLDivElement | null>(null);
  usePopoverDismiss(listRef, onClose);
  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      ref={listRef}
      className="fixed z-[300] flex max-w-[calc(100vw-1rem)] flex-col items-end gap-1 rounded-2xl border border-[rgba(17,24,39,0.08)] bg-white/95 p-2 shadow-[0_12px_32px_rgba(15,10,40,0.18)] backdrop-blur-md dark:border-white/10 dark:bg-[#1b1a21] dark:shadow-[0_12px_32px_rgba(0,0,0,0.55)] dark:backdrop-blur-none"
      style={{ top: anchor.bottom + 8, right: Math.max(8, window.innerWidth - anchor.right) }}
    >
      {pills.map((w) => (
        <PinnedPill
          key={w.id}
          widget={w}
          editMode={editMode}
          onOpenMenu={(id, a) => {
            onClose();
            onOpenMenu(id, a);
          }}
          className="px-2"
        />
      ))}
    </div>,
    document.body
  );
}

/**
 * Stat pills pinned to the top bar. Landscape: every pill in a row.
 * Portrait: the first pill plus a "+N" chip that lists the others.
 */
export function HeaderStatPills({
  pills,
  editMode,
  onOpenMenu,
}: {
  pills: WidgetConfig[];
  editMode: boolean;
  onOpenMenu: (widgetId: string, anchor: TileMenuAnchor) => void;
}) {
  const { t } = useTranslation();
  const [overflowAnchor, setOverflowAnchor] = useState<TileMenuAnchor | null>(null);
  const closeOverflow = useCallback(() => setOverflowAnchor(null), []);
  if (pills.length === 0) return null;
  const rest = pills.slice(1);

  return (
    <div data-header-stat-pills className="flex h-0 shrink-0 items-center gap-2">
      {pills.map((w, i) => (
        <PinnedPill
          key={w.id}
          widget={w}
          editMode={editMode}
          onOpenMenu={onOpenMenu}
          className={i > 0 ? "portrait:hidden" : undefined}
        />
      ))}
      {rest.length > 0 && (
        <button
          type="button"
          onClick={(e) => {
            const anchor = anchorFromElement(e.currentTarget);
            setOverflowAnchor((cur) => (cur ? null : anchor));
          }}
          aria-haspopup="true"
          aria-expanded={overflowAnchor != null}
          aria-label={t("tileMenu.moreInTopbar").replace("{n}", String(rest.length))}
          className={cn(
            "hidden h-11 min-w-11 shrink-0 items-center justify-center rounded-full border px-2 text-sm font-semibold tabular-nums portrait:flex",
            "border-[rgba(17,24,39,0.12)] bg-white/90 text-gray-800 dark:border-white/15 dark:bg-[#1b1a21] dark:text-gray-100",
            slotFocusClass
          )}
        >
          +{rest.length}
        </button>
      )}
      {overflowAnchor && (
        <OverflowList
          anchor={overflowAnchor}
          pills={rest}
          editMode={editMode}
          onOpenMenu={onOpenMenu}
          onClose={closeOverflow}
        />
      )}
    </div>
  );
}
