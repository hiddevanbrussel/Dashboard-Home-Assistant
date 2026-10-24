"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { Disc3, ListX, X } from "lucide-react";
import { UndoToast, UNDO_TOAST_DURATION_MS } from "@/components/undo-toast";
import { useTranslation } from "@/hooks/use-translation";
import { callMusicAssistant } from "@/lib/music-assistant";
import {
  MUSIC_QUEUE_READ_COMMAND,
  createMusicQueueUndo,
  musicQueueItemsArgs,
  musicQueueMutationRequest,
  parseMusicQueueItems,
  type MusicQueueMutation,
  type MusicQueueRow,
} from "@/lib/music-queue";
import { getImageSrc, getItemImageUrl, formatDuration, type MASearchItem } from "@/lib/music-item-image";
import { useMusicAssistantStore } from "@/stores/music-assistant-store";
import { cn } from "@/lib/utils";

export function MusicQueuePanel({
  queueId,
  playerName,
  currentItemId,
  position,
  panelRef,
}: {
  queueId: string;
  playerName: string;
  currentItemId: string | null;
  position: { bottom: number; right: number };
  panelRef: RefObject<HTMLDivElement | null>;
}) {
  const { t } = useTranslation();
  const musicAssistant = useMusicAssistantStore();
  const [items, setItems] = useState<MusicQueueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [removedIds, setRemovedIds] = useState<Set<string>>(() => new Set());
  const [cleared, setCleared] = useState(false);
  const [pendingKind, setPendingKind] = useState<MusicQueueMutation["kind"] | null>(null);
  const undoRef = useRef(createMusicQueueUndo(UNDO_TOAST_DURATION_MS));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aliveRef = useRef(true);
  const sendRef = useRef<(mutation: MusicQueueMutation) => Promise<void>>(async () => {});
  const reloadRef = useRef<(generation: number) => Promise<void>>(async () => {});
  const generationRef = useRef(0);

  const reload = async (generation: number) => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl) {
      if (generation === generationRef.current) {
        setItems([]);
        setLoading(false);
      }
      return;
    }
    try {
      const data = await callMusicAssistant(
        musicAssistant.baseUrl,
        musicAssistant.token,
        MUSIC_QUEUE_READ_COMMAND,
        musicQueueItemsArgs(queueId),
        { skipCache: true }
      );
      if (generation !== generationRef.current) return;
      setItems(parseMusicQueueItems(data));
    } finally {
      if (generation === generationRef.current) setLoading(false);
    }
  };
  reloadRef.current = reload;

  useEffect(() => {
    const generation = ++generationRef.current;
    setLoading(true);
    void reloadRef.current(generation);
  }, [queueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  const send = async (mutation: MusicQueueMutation) => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl) return;
    const generation = ++generationRef.current;
    const request = musicQueueMutationRequest(mutation);
    try {
      await callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, request.command, request.args, {
        skipCache: true,
      });
    } catch {
      if (!aliveRef.current) return;
    }
    if (!aliveRef.current || undoRef.current.peek()) return;
    await reloadRef.current(generation);
    if (generation !== generationRef.current || undoRef.current.peek()) return;
    setRemovedIds(new Set());
    setCleared(false);
    setPendingKind(null);
  };
  sendRef.current = send;

  useEffect(() => {
    aliveRef.current = true;
    const undo = undoRef.current;
    return () => {
      aliveRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      const mutation = undo.flush();
      if (mutation) void sendRef.current(mutation);
    };
  }, []);

  const restartTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const remaining = undoRef.current.remainingMs(Date.now());
    if (remaining == null) return;
    timerRef.current = setTimeout(() => {
      const due = undoRef.current.takeDue(Date.now());
      if (!due) {
        restartTimer();
        return;
      }
      setPendingKind(null);
      void sendRef.current(due);
    }, remaining);
  };

  const arm = (mutation: MusicQueueMutation) => {
    const previous = undoRef.current.schedule(mutation, Date.now());
    if (previous) void sendRef.current(previous);
    setPendingKind(mutation.kind);
    restartTimer();
  };

  const onUndo = () => {
    const pending = undoRef.current.peek();
    undoRef.current.undo();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (pending?.kind === "delete") {
      const id = pending.itemId;
      setRemovedIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
    if (pending?.kind === "clear") setCleared(false);
    setPendingKind(undoRef.current.peek()?.kind ?? null);
  };

  const currentIndex = currentItemId ? items.findIndex((item) => item.id === currentItemId) : -1;
  const current = currentIndex >= 0 ? items[currentIndex] : null;
  const upcoming = (cleared ? [] : items.slice(currentIndex + 1)).filter((item) => !removedIds.has(item.id));

  const coverFor = (row: MusicQueueRow) => {
    const fromMedia = row.mediaItem ? getItemImageUrl(row.mediaItem as MASearchItem) : null;
    return getImageSrc(fromMedia ?? row.imageUrl, musicAssistant.baseUrl, musicAssistant.token);
  };

  const row = (item: MusicQueueRow, isCurrent: boolean) => {
    const src = coverFor(item);
    return (
      <li
        key={item.id}
        className={cn(
          "flex min-h-14 items-center gap-3 rounded-xl px-2",
          isCurrent && "bg-black/[0.05] dark:bg-white/[0.08]"
        )}
      >
        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-200 dark:bg-white/10">
          {src ? (
            <Image src={src} alt="" fill sizes="40px" className="object-cover" unoptimized />
          ) : (
            <Disc3 className="m-2.5 h-5 w-5 text-gray-600 dark:text-white/70" aria-hidden />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
          <span className="block truncate text-xs text-gray-600 dark:text-white/70">
            {isCurrent ? `${t("music.queueNow")} · ${item.artist}` : item.artist}
          </span>
        </span>
        <span className="shrink-0 text-xs tabular-nums text-gray-600 dark:text-white/70">
          {formatDuration(item.duration > 0 ? item.duration : undefined)}
        </span>
        {isCurrent ? (
          <span className="h-11 w-11 shrink-0" aria-hidden />
        ) : (
          <button
            type="button"
            onClick={() => {
              setRemovedIds((currentIds) => new Set(currentIds).add(item.id));
              arm({ kind: "delete", queueId, itemId: item.id });
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-700 hover:bg-black/[0.06] dark:text-white/80 dark:hover:bg-white/10"
            aria-label={t("music.queueRemove")}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        )}
      </li>
    );
  };

  return (
    <div
      ref={panelRef}
      className="fixed z-[320] flex w-[min(420px,calc(100vw-24px))] max-h-[min(62vh,520px)] flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/95 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-[#1b1a21] dark:backdrop-blur-none"
      style={{ bottom: position.bottom, right: position.right }}
      data-no-page-swipe
      data-music-queue-panel
      role="dialog"
      aria-label={t("music.queue")}
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className="flex items-center gap-2 px-4 pb-2 pt-3">
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-gray-900 dark:text-white">{t("music.queue")}</p>
          <p className="truncate text-xs text-gray-600 dark:text-white/70">
            {playerName} · {t("music.queueCount").replace("{n}", String(upcoming.length))}
          </p>
        </div>
        <button
          type="button"
          disabled={upcoming.length === 0}
          onClick={() => {
            setCleared(true);
            arm({ kind: "clear", queueId });
          }}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium text-gray-800 hover:bg-black/[0.06] disabled:opacity-40 dark:text-white/90 dark:hover:bg-white/10"
        >
          <ListX className="h-4 w-4" aria-hidden />
          {t("music.queueClear")}
        </button>
      </div>
      <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-3">
        {loading ? (
          <li className="flex justify-center py-8">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent-yellow border-t-transparent dark:border-accent-green" aria-hidden />
          </li>
        ) : (
          <>
            {current ? row(current, true) : null}
            {upcoming.length > 0 ? (
              <li className="px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-white/65">
                {t("music.queueNext")}
              </li>
            ) : (
              <li className="px-2 py-6 text-center text-sm text-gray-600 dark:text-white/70">{t("music.queueEmpty")}</li>
            )}
            {upcoming.map((item) => row(item, false))}
          </>
        )}
      </ul>
      {pendingKind ? (
        <div className="border-t border-black/[0.06] p-2 dark:border-white/10">
          <UndoToast
            inline
            message={pendingKind === "clear" ? t("music.queueCleared") : t("music.queueItemRemoved")}
            actionLabel={t("dashboardPages.undo")}
            onAction={onUndo}
          />
        </div>
      ) : null}
    </div>
  );
}
