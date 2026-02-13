"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Disc3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { MediaCardWidget } from "@/components/widgets/media-card-widget";

export function HeaderMediaPlaying() {
  const states = useEntityStateStore((s) => s.states);
  const setStates = useEntityStateStore((s) => s.setStates);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const playingEntities = Object.values(states).filter(
    (e) =>
      e.entity_id.startsWith("media_player.") &&
      (e.state === "playing" || e.state === "paused")
  );
  // Bij meerdere spelers: geef voorrang aan TV Woonkamer
  const playingEntity =
    playingEntities.length === 0
      ? null
      : playingEntities.length === 1
        ? playingEntities[0].entity_id
        : (() => {
            const woonkamer = playingEntities.find(
              (e) =>
                (e.attributes?.friendly_name as string)?.toLowerCase().includes("woonkamer") ||
                e.entity_id.toLowerCase().includes("woonkamer")
            );
            return woonkamer?.entity_id ?? playingEntities[0].entity_id;
          })();
  const isActivelyPlaying = playingEntities.some((e) => e.state === "playing");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/ha/state");
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (Array.isArray(data)) setStates(data);
      } catch {
        // ignore
      }
    })();
    const t = setInterval(async () => {
      if (cancelled) return;
      try {
        const res = await fetch("/api/ha/state");
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (Array.isArray(data)) setStates(data);
      } catch {
        // ignore
      }
    }, 5000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [setStates]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inButton = buttonRef.current?.contains(target);
      const inPanel = panelRef.current?.contains(target);
      if (!inButton && !inPanel) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (playingEntity == null) return null;

  return (
    <div className="relative flex items-center">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-accent-purple dark:text-accent-purple hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D2FB2]"
        aria-label="Media afspelen"
        aria-expanded={open}
      >
        <Disc3
          className={cn("h-5 w-5", isActivelyPlaying && "animate-spin")}
          aria-hidden
        />
      </button>

      {open && playingEntity && typeof document !== "undefined" &&
        createPortal(
          <MediaPanel
            panelRef={panelRef}
            anchorRect={buttonRef.current?.getBoundingClientRect()}
            entity_id={playingEntity}
          />,
          document.body
        )}
    </div>
  );
}

function MediaPanel({
  panelRef,
  anchorRect,
  entity_id,
}: {
  panelRef: React.RefObject<HTMLDivElement | null>;
  anchorRect: DOMRect | undefined;
  entity_id: string;
}) {
  const pos = anchorRect
    ? { top: anchorRect.bottom + 4, right: window.innerWidth - anchorRect.right }
    : { top: 0, right: 0 };
  return (
    <div
      ref={panelRef}
      className="fixed z-[200] w-[336px] p-2 rounded-xl border border-gray-200 bg-white/95 dark:bg-black/80 shadow-xl dark:border-white/10 dark:backdrop-blur-xl"
      style={{ top: pos.top, right: pos.right }}
    >
      <MediaCardWidget entity_id={entity_id} size="md" />
    </div>
  );
}
