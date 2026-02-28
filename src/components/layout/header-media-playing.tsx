"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { Disc3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useMusicPlayerStore } from "@/stores/music-player-store";
import { useMusicAssistantStore } from "@/stores/music-assistant-store";
import { MediaCardWidget } from "@/components/widgets/media-card-widget";

function getMaArtistTitle(cur: { name?: string; artists?: { name?: string }[] | { name?: string }; artist?: string; stream_title?: string } | undefined): { artist: string; title: string } {
  if (!cur) return { artist: "", title: "" };
  const hasStreamTitle = typeof cur.stream_title === "string" && cur.stream_title.trim().length > 0;
  const stationName = typeof cur.name === "string" ? cur.name.trim() : "";
  let artist =
    cur.artists != null
      ? Array.isArray(cur.artists)
        ? (cur.artists as { name?: string }[]).map((a) => a?.name).filter(Boolean).join(", ")
        : typeof (cur.artists as { name?: string })?.name === "string"
          ? (cur.artists as { name: string }).name
          : ""
      : typeof cur.artist === "string"
        ? cur.artist.trim()
        : "";
  let title = hasStreamTitle ? cur.stream_title!.trim() : stationName ? stationName : "";
  if (hasStreamTitle && stationName && !artist) artist = stationName;
  if (title && !artist && !hasStreamTitle) {
    const sep = title.match(/\s*[\-\u2013\u2014]\s+|\s*:\s+/)?.index;
    if (typeof sep === "number" && sep > 0) {
      artist = title.slice(0, sep).trim();
      title = title.slice(sep).replace(/^\s*[\-\u2013\u2014:]+\s*/, "").trim();
    }
  }
  return { artist, title };
}

export function HeaderMediaPlaying({ contentLight }: { contentLight?: boolean } = {}) {
  const states = useEntityStateStore((s) => s.states);
  const setStates = useEntityStateStore((s) => s.setStates);
  const queueState = useMusicPlayerStore((s) => s.queueState);
  const selectedQueueId = useMusicPlayerStore((s) => s.selectedQueueId);
  const musicAssistant = useMusicAssistantStore();
  const [open, setOpen] = useState(false);
  const [entityMap, setEntityMap] = useState<Record<string, string>>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const playingEntities = Object.values(states).filter(
    (e) =>
      e.entity_id.startsWith("media_player.") &&
      (e.state === "playing" || e.state === "paused")
  );

  useEffect(() => {
    if (musicAssistant.enabled && (queueState?.state === "playing" || queueState?.state === "paused")) {
      fetch("/api/ha/ma-entity-map")
        .then((r) => (r.ok ? r.json() : {}))
        .then((map: Record<string, string>) => setEntityMap(map))
        .catch(() => setEntityMap({}));
    }
  }, [musicAssistant.enabled, queueState?.state]);

  const playingEntity = useMemo(() => {
    if (playingEntities.length === 0) return null;
    if (playingEntities.length === 1) return playingEntities[0].entity_id;
    const maPlaying = musicAssistant.enabled && (queueState?.state === "playing" || queueState?.state === "paused") && selectedQueueId;
    if (maPlaying && entityMap[selectedQueueId!]) {
      const maEntity = entityMap[selectedQueueId!];
      const isPlaying = playingEntities.some((e) => e.entity_id === maEntity);
      if (isPlaying) return maEntity;
    }
    const woonkamer = playingEntities.find(
      (e) =>
        (e.attributes?.friendly_name as string)?.toLowerCase().includes("woonkamer") ||
        e.entity_id.toLowerCase().includes("woonkamer")
    );
    return woonkamer?.entity_id ?? playingEntities[0].entity_id;
  }, [playingEntities, musicAssistant.enabled, queueState?.state, selectedQueueId, entityMap]);

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

  const cur = queueState?.current_item as { name?: string; artists?: unknown; artist?: string; stream_title?: string } | undefined;
  const useMaOverride = musicAssistant.enabled && (queueState?.state === "playing" || queueState?.state === "paused") && cur;
  const { artist: maArtist, title: maTitle } = useMaOverride ? getMaArtistTitle(cur) : { artist: "", title: "" };

  return (
    <div className="relative flex items-center">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D2FB2]",
        contentLight ? "text-white/90 hover:bg-white/10" : "text-accent-purple dark:text-accent-purple hover:bg-gray-100 dark:hover:bg-white/10"
      )}
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
            mediaTitleOverride={maTitle || undefined}
            mediaArtistOverride={maArtist || undefined}
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
  mediaTitleOverride,
  mediaArtistOverride,
}: {
  panelRef: React.RefObject<HTMLDivElement | null>;
  anchorRect: DOMRect | undefined;
  entity_id: string;
  mediaTitleOverride?: string;
  mediaArtistOverride?: string;
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
      <MediaCardWidget
        title="Media"
        entity_id={entity_id}
        size="md"
        mediaTitleOverride={mediaTitleOverride}
        mediaArtistOverride={mediaArtistOverride}
      />
    </div>
  );
}
