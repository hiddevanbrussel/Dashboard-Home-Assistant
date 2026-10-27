"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Speaker, Users } from "lucide-react";
import { FOCUS_RING_BRAND } from "@/components/layout/tile-menu";
import { useSpeakerPairing, resolveEntityId } from "@/hooks/use-speaker-pairing";
import { useTranslation } from "@/hooks/use-translation";
import { groupMemberIds } from "@/lib/ma-group-leader";
import { writeStoredQueueId } from "@/lib/music-selected-player";
import { speakerRowAriaLabel, speakerStatus, type SpeakerDot } from "@/lib/music-speaker-status";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useMusicAssistantStore } from "@/stores/music-assistant-store";
import { useMusicPlayerStore, type MAPlayer } from "@/stores/music-player-store";

const DOT_CLASS: Record<SpeakerDot, string> = {
  green: "bg-green-700 dark:bg-green-400",
  amber: "bg-amber-700 dark:bg-amber-400",
  gray: "bg-gray-500 dark:bg-gray-400",
  ring: "ring-[1.5px] ring-gray-500 dark:ring-white/60",
};

function playerLabel(player: MAPlayer): string {
  return (player.display_name as string) ?? player.queue_id ?? String(player.queue_id);
}

function playingAlongAsMember(
  entityId: string | null,
  state: string | undefined,
  states: Record<string, { attributes?: Record<string, unknown> }>
): boolean {
  if (!entityId || state !== "playing") return false;
  for (const entity of Object.values(states)) {
    const members = groupMemberIds(entity.attributes);
    if (!members?.includes(entityId) || members[0] === entityId) continue;
    return true;
  }
  return false;
}

type MusicSpeakerPickerProps = {
  variant: "chip" | "icon";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
};

/**
 * Speaker list for the dock and the large player. Choosing a row only switches
 * which player this bar controls; the music stays where it is.
 */
export function MusicSpeakerPicker({ variant, open, onOpenChange, className }: MusicSpeakerPickerProps) {
  const { t } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ bottom: number; right: number } | null>(null);
  const focusedOpen = useRef(false);

  const { maPlayers, selectedQueueId, setSelectedQueueId } = useMusicPlayerStore();
  const allowedIds = useMusicAssistantStore((s) => s.allowedSpeakerIds);
  const states = useEntityStateStore((s) => s.states);
  const { entityMap, groupMembers, joinUnjoinPending, handleJoin, handleUnjoin } = useSpeakerPairing({
    enabled: true,
  });

  const selectablePlayers =
    allowedIds.length > 0 ? maPlayers.filter((player) => allowedIds.includes(player.queue_id)) : maPlayers;
  const activePlayer = selectablePlayers.find((player) => player.queue_id === selectedQueueId) ?? null;
  const otherPlayers = selectablePlayers.filter((player) => player.queue_id !== selectedQueueId);
  const rows = activePlayer ? [activePlayer, ...otherPlayers] : otherPlayers;
  const activeEntityId = activePlayer ? resolveEntityId(activePlayer, entityMap) : null;
  const groupedWithCurrent = (() => {
    if (!activePlayer) return 0;
    const mine = resolveEntityId(activePlayer, entityMap);
    if (!mine || !groupMembers.has(mine)) return 0;
    return selectablePlayers.filter((player) => {
      if (player.queue_id === selectedQueueId) return false;
      const entityId = resolveEntityId(player, entityMap);
      return entityId ? groupMembers.has(entityId) : false;
    }).length;
  })();
  const activeName = activePlayer ? playerLabel(activePlayer) : "";

  const updatePosition = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    setPosition({
      bottom: Math.max(8, window.innerHeight - rect.top + 8),
      right: Math.max(8, window.innerWidth - rect.right),
    });
  }, []);

  useEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) {
      focusedOpen.current = false;
      return;
    }
    if (!position || focusedOpen.current) return;
    focusedOpen.current = true;
    const active = panelRef.current?.querySelector<HTMLButtonElement>("[data-speaker-row='active']");
    const first = panelRef.current?.querySelector<HTMLButtonElement>("[data-speaker-row]");
    (active ?? first)?.focus();
  }, [open, position]);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      onOpenChange(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      buttonRef.current?.focus();
      onOpenChange(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open, onOpenChange]);

  function choose(queueId: string) {
    setSelectedQueueId(queueId);
    if (typeof window !== "undefined") writeStoredQueueId(window.localStorage, queueId);
    buttonRef.current?.focus();
    onOpenChange(false);
  }

  const buttonClass = cn(
    "relative shrink-0 outline-none",
    FOCUS_RING_BRAND,
    variant === "chip"
      ? "inline-flex h-11 max-w-full items-center gap-2 rounded-full px-3 ring-1 ring-gray-500 dark:ring-white/40"
      : "flex h-11 w-11 items-center justify-center rounded-full",
    open
      ? "bg-gray-300/80 text-gray-900 dark:bg-white/20 dark:text-white"
      : "text-gray-700 hover:bg-gray-200/80 dark:text-white/90 dark:hover:bg-white/10"
  );

  return (
    <div className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          if (open) {
            onOpenChange(false);
            return;
          }
          updatePosition();
          onOpenChange(true);
        }}
        className={buttonClass}
        aria-label={t("music.chooseSpeakerNamed").replace("{name}", activeName || "—")}
        aria-expanded={open}
        title={t("music.controlSpeakerRow").replace("{name}", activeName || "—")}
      >
        <Speaker className="h-5 w-5 shrink-0" aria-hidden />
        {variant === "chip" ? (
          <span className="max-w-[120px] truncate text-sm font-medium">{activeName || "—"}</span>
        ) : null}
        {groupedWithCurrent > 0 ? (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gray-900 px-1 text-[11px] font-semibold leading-none text-white ring-2 ring-white dark:bg-white dark:text-gray-900 dark:ring-gray-900"
            aria-hidden
          >
            +{groupedWithCurrent}
          </span>
        ) : null}
      </button>
      {open && position && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={panelRef}
              className="fixed z-[320] flex w-[min(360px,calc(100vw-24px))] max-h-[min(62vh,520px)] flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/95 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-[#1b1a21] dark:backdrop-blur-none"
              style={{ bottom: position.bottom, right: position.right }}
              data-no-page-swipe
              role="dialog"
              aria-label={t("music.controlSpeaker")}
              onClick={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="px-4 pb-2 pt-3">
                <p className="text-base font-semibold text-gray-900 dark:text-white">{t("music.controlSpeaker")}</p>
                <p className="text-xs text-gray-600 dark:text-white/70">{t("music.controlSpeakerHint")}</p>
              </div>
              <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2">
                {rows.map((player) => {
                  const name = playerLabel(player);
                  const entityId = resolveEntityId(player, entityMap);
                  const haState = entityId ? states[entityId]?.state : undefined;
                  const status = speakerStatus(haState, {
                    inGroupAsMember: playingAlongAsMember(entityId, haState, states),
                  });
                  const statusLabel = t(status.labelKey);
                  const selected = player.queue_id === selectedQueueId;
                  const groupWith =
                    selected && groupedWithCurrent > 0
                      ? t("music.groupWith").replace("{n}", String(groupedWithCurrent))
                      : null;
                  const rowLabel = speakerRowAriaLabel({
                    name,
                    status: statusLabel,
                    groupWith,
                    selected,
                    rowTemplate: t("music.speakerRowLabel"),
                    selectedSuffix: t("music.speakerSelectedSuffix"),
                  });
                  const isGrouped = entityId ? groupMembers.has(entityId) : false;
                  const canJoin = !!entityId && !!activeEntityId && !isGrouped && !selected;
                  const canUnjoin = !!entityId && isGrouped && !selected;
                  const groupable = status.code !== "off" && (canJoin || canUnjoin);
                  return (
                    <div
                      key={player.queue_id}
                      className={cn("flex min-h-14 items-center gap-1 rounded-xl", status.dimmed && "opacity-60")}
                    >
                      <button
                        type="button"
                        data-speaker-row={selected ? "active" : ""}
                        onClick={() => choose(player.queue_id)}
                        className={cn(
                          "flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-xl px-2 text-left outline-none",
                          FOCUS_RING_BRAND,
                          selected && "bg-[#4700B5]/[0.06] dark:bg-[#8357be]/20"
                        )}
                        aria-label={rowLabel}
                      >
                        <Speaker className="h-5 w-5 shrink-0 text-gray-700 dark:text-white/80" aria-hidden />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">{name}</span>
                          <span className="flex items-center gap-1.5">
                            <span className={cn("h-2 w-2 shrink-0 rounded-full", DOT_CLASS[status.dot])} aria-hidden />
                            <span className="truncate text-xs text-gray-600 dark:text-gray-400">
                              {statusLabel}
                              {groupWith ? ` · ${groupWith}` : null}
                            </span>
                          </span>
                        </span>
                        {selected ? (
                          <Check className="h-5 w-5 shrink-0 text-[#4700B5] dark:text-[#B59ED8]" aria-hidden />
                        ) : null}
                      </button>
                      {groupable ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            if (canUnjoin && entityId) handleUnjoin(entityId);
                            else if (activeEntityId && entityId) handleJoin([activeEntityId, entityId]);
                          }}
                          disabled={joinUnjoinPending}
                          aria-pressed={isGrouped}
                          className={cn(
                            "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium outline-none transition-colors disabled:opacity-50",
                            FOCUS_RING_BRAND,
                            isGrouped
                              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                              : "text-gray-800 ring-1 ring-inset ring-gray-500 hover:bg-black/[0.04] dark:text-white/90 dark:ring-white/40 dark:hover:bg-white/10"
                          )}
                          title={isGrouped ? t("music.unjoinSpeaker") : t("music.joinSpeakers")}
                        >
                          {isGrouped ? <Check className="h-4 w-4" aria-hidden /> : <Users className="h-4 w-4" aria-hidden />}
                          {isGrouped ? t("music.grouped") : t("music.group")}
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <p className="px-4 py-3 text-xs text-gray-600 dark:text-white/70">{t("music.savedOnDevice")}</p>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
