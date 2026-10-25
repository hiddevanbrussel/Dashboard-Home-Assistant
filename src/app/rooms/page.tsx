"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, DoorOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { RoomPanel, type PanelRoom } from "@/components/rooms/room-panel";
import { RoomTile } from "@/components/rooms/room-tile";
import { UndoToast, UNDO_TOAST_DURATION_MS } from "@/components/undo-toast";
import { useTranslation } from "@/hooks/use-translation";
import { floorLabelKey, groupRoomsByFloor } from "@/lib/room-catalog";
import {
  clearRoomDeleteHandoff,
  readRoomDeleteHandoff,
  stepRoomList,
  visibleRooms,
  type RoomDeleteHandoff,
  type RoomListAction,
  type RoomListEffect,
  type RoomListState,
} from "@/lib/room-removal";
import { cn } from "@/lib/utils";
import {
  checkEditModePasscode,
  getEditModeAllowed,
  getEditModePasscode,
} from "@/stores/dashboard-settings-store";

type RoomItem = PanelRoom & { createdAt: string };

const EMPTY_LIST: RoomListState<RoomItem> = { rooms: [], pending: null, deleting: [] };

let handoffOwners = 0;
let stagedHandoff: RoomDeleteHandoff | null | undefined;

function consumeHandoff(): RoomDeleteHandoff | null {
  if (stagedHandoff === undefined) {
    stagedHandoff = readRoomDeleteHandoff(window.sessionStorage);
    if (stagedHandoff) clearRoomDeleteHandoff(window.sessionStorage);
  }
  return stagedHandoff;
}

function releaseHandoff() {
  stagedHandoff = undefined;
}

function placeholderRoom(areaId: string, name: string): RoomItem {
  return {
    areaId,
    name,
    icon: null,
    iconBackgroundColor: null,
    floor: null,
    background: null,
    temperatureEntityId: null,
    humidityEntityId: null,
    createdAt: "",
  };
}

export default function RoomsPage() {
  const { t } = useTranslation();
  const [list, setList] = useState<RoomListState<RoomItem>>(EMPTY_LIST);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [panel, setPanel] = useState<{ mode: "add" | "edit"; room?: RoomItem } | null>(null);
  const [menu, setMenu] = useState<{ room: RoomItem; top: number; left: number } | null>(null);
  const [undoMs, setUndoMs] = useState(UNDO_TOAST_DURATION_MS);
  const [floorIndex, setFloorIndex] = useState(0);
  const [passOpen, setPassOpen] = useState(false);
  const [pass, setPass] = useState("");
  const [passError, setPassError] = useState<string | null>(null);
  const listRef = useRef(list);
  const commitRef = useRef<() => void>(() => {});
  const runEffectsRef = useRef<(effects: RoomListEffect[]) => void>(() => {});
  const afterPass = useRef<(() => void) | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pendingFloor = useRef<string | null>(null);
  listRef.current = list;

  const dispatch = useCallback((action: RoomListAction<RoomItem>) => {
    const result = stepRoomList(listRef.current, action);
    listRef.current = result.state;
    setList(result.state);
    return result.effects;
  }, []);

  const settleDelete = useCallback(
    async (areaId: string) => {
      try {
        await fetch(`/api/room-dashboards/${encodeURIComponent(areaId)}`, { method: "DELETE" });
      } catch {
        // The reload below shows the room again when the server still has it.
      }
      try {
        const response = await fetch("/api/room-dashboards");
        if (!response.ok) throw new Error("load");
        const data: unknown = await response.json();
        dispatch({
          type: "settled",
          areaId,
          rooms: Array.isArray(data) ? (data as RoomItem[]) : [],
        });
        setError(null);
      } catch {
        dispatch({ type: "settled", areaId, rooms: listRef.current.rooms });
        setError(t("rooms.loadError"));
      }
    },
    [dispatch, t]
  );

  const runEffects = useCallback(
    (effects: RoomListEffect[]) => {
      for (const effect of effects) {
        switch (effect.type) {
          case "delete":
            void settleDelete(effect.areaId);
            break;
          default: {
            const exhaustive: never = effect.type;
            void exhaustive;
          }
        }
      }
    },
    [settleDelete]
  );
  runEffectsRef.current = runEffects;

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/room-dashboards")
      .then((response) => {
        if (!response.ok) throw new Error("load");
        return response.json();
      })
      .then((data: unknown) => {
        dispatch({ type: "loaded", rooms: Array.isArray(data) ? (data as RoomItem[]) : [] });
        setError(null);
      })
      .catch(() => setError(t("rooms.loadError")))
      .finally(() => setLoading(false));
  }, [dispatch, t]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    handoffOwners += 1;
    const handoff = consumeHandoff();
    if (handoff) {
      const effects = dispatch({
        type: "remove",
        room: placeholderRoom(handoff.areaId, handoff.name),
      });
      runEffectsRef.current(effects);
      const remaining = handoff.commitAt - Date.now();
      if (remaining <= 0) {
        runEffectsRef.current(dispatch({ type: "commit" }));
      } else {
        setUndoMs(remaining);
      }
    }
    return () => {
      handoffOwners -= 1;
      window.setTimeout(() => {
        if (handoffOwners === 0) releaseHandoff();
      }, 0);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!list.pending) return;
    const timer = window.setTimeout(() => commitRef.current(), undoMs);
    return () => window.clearTimeout(timer);
    // The timer restarts only when the pending room changes. A new object for the same room must not reset the 5s window.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.pending?.areaId, undoMs]);

  const rooms = visibleRooms(list);
  const floors = groupRoomsByFloor(rooms);
  const active = floors.length === 0 ? 0 : Math.min(floorIndex, floors.length - 1);

  const goTo = useCallback((index: number) => {
    setFloorIndex(index);
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({ left: index * scroller.clientWidth, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (floorIndex !== active) setFloorIndex(active);
  }, [active, floorIndex]);

  useEffect(() => {
    const target = pendingFloor.current;
    if (target == null || loading) return;
    const index = groupRoomsByFloor(visibleRooms(list)).findIndex((group) => group.floor === target);
    pendingFloor.current = null;
    if (index >= 0) goTo(index);
  }, [list, loading, goTo]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onResize = () => {
      scroller.scrollTo({ left: active * scroller.clientWidth, behavior: "auto" });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active]);

  useEffect(() => {
    if (!menu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  function floorLabel(floor: string) {
    const key = floorLabelKey(floor);
    return key ? t(key) : floor || t("rooms.floorOther");
  }

  function withEdit(after?: () => void) {
    if (!getEditModeAllowed()) return;
    if (editMode) {
      after?.();
      return;
    }
    if (getEditModePasscode().trim()) {
      afterPass.current = after ?? null;
      setPass("");
      setPassError(null);
      setPassOpen(true);
      return;
    }
    setEditMode(true);
    after?.();
  }

  function requestDelete(room: RoomItem) {
    setMenu(null);
    setPanel(null);
    setUndoMs(UNDO_TOAST_DURATION_MS);
    runEffects(dispatch({ type: "remove", room }));
  }

  function undoDelete() {
    dispatch({ type: "undo" });
  }

  commitRef.current = () => {
    runEffects(dispatch({ type: "commit" }));
  };

  function submitPass() {
    if (!checkEditModePasscode(pass)) {
      setPassError(t("settings.dashboard.wrongPasscode"));
      return;
    }
    setEditMode(true);
    setPassOpen(false);
    const next = afterPass.current;
    afterPass.current = null;
    next?.();
  }

  const header = editMode ? (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setPanel({ mode: "add" })}
        className="inline-flex h-11 items-center gap-1.5 rounded-full bg-brand px-4 text-sm font-semibold text-white dark:bg-[#8357be]"
      >
        <Plus className="h-5 w-5" aria-hidden />
        {t("rooms.addRoom")}
      </button>
      <button
        type="button"
        onClick={() => {
          setEditMode(false);
          setMenu(null);
        }}
        className="inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 dark:text-white dark:ring-white/25"
      >
        <Check className="h-5 w-5" aria-hidden />
        {t("editPanel.done")}
      </button>
    </div>
  ) : getEditModeAllowed() ? (
    <button
      type="button"
      onClick={() => withEdit()}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white dark:bg-[#8357be]"
      aria-label={t("roomsUi.edit")}
    >
      <Pencil className="h-5 w-5" />
    </button>
  ) : undefined;

  return (
    <AppShell activeTab="/rooms" contentNoScroll headerEndAction={header}>
      <div data-rooms-page className="flex min-h-0 flex-1 flex-col gap-5 px-2 md:px-4">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            {t("rooms.title")}
          </h1>
          {floors.length > 1 ? (
            <div
              className="flex flex-wrap gap-1 rounded-full bg-black/[0.06] p-1 dark:bg-white/[0.08]"
              role="tablist"
              aria-label={t("rooms.floors")}
            >
              {floors.map(({ floor, rooms: onFloor }, index) => {
                const selected = active === index;
                return (
                  <button
                    key={floor || "_"}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => goTo(index)}
                    className={cn(
                      "inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold",
                      selected
                        ? "bg-white text-gray-900 shadow-sm dark:bg-[#8357be] dark:text-white"
                        : "text-gray-800 dark:text-gray-100"
                    )}
                  >
                    <span>{floorLabel(floor)}</span>
                    <span className={selected ? "text-gray-700 dark:text-white" : "text-gray-700 dark:text-gray-200"}>
                      {onFloor.length}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {loading && list.rooms.length === 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4" aria-busy="true">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-[176px] animate-pulse rounded-3xl bg-black/[0.06] dark:bg-white/[0.06]" />
            ))}
          </div>
        ) : null}

        {error && !loading ? (
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-800 dark:bg-red-500/10 dark:text-red-200">
            <span>{error}</span>
            <button
              type="button"
              onClick={load}
              className="inline-flex h-11 items-center rounded-full px-4 font-semibold ring-1 ring-red-300 dark:ring-red-300/50"
            >
              {t("roomsUi.retry")}
            </button>
          </div>
        ) : null}

        {!loading && !error && rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-black/5 dark:bg-[#1b1a21] dark:ring-white/10">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand dark:bg-[#8357be]/30 dark:text-white">
              <DoorOpen className="h-7 w-7" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{t("rooms.empty")}</p>
            <p className="mt-2 max-w-sm text-sm text-gray-700 dark:text-gray-200">{t("roomsUi.emptyBody")}</p>
            {getEditModeAllowed() ? (
              <button
                type="button"
                onClick={() => withEdit(() => setPanel({ mode: "add" }))}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white dark:bg-[#8357be]"
              >
                <Plus className="h-5 w-5" aria-hidden />
                {t("rooms.addRoom")}
              </button>
            ) : null}
          </div>
        ) : null}

        {rooms.length > 0 ? (
          <div
            ref={scrollerRef}
            className="flex min-h-0 w-full flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden scrollbar-hide overscroll-x-contain"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                goTo(active + 1);
              } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                goTo(active - 1);
              }
            }}
            onScroll={(event) => {
              const scroller = event.currentTarget;
              if (scroller.clientWidth <= 0) return;
              const next = Math.round(scroller.scrollLeft / scroller.clientWidth);
              if (next !== floorIndex) setFloorIndex(next);
            }}
          >
            {floors.map(({ floor, rooms: onFloor }, index) => (
              <section
                key={floor || "_"}
                aria-hidden={active !== index}
                className="box-border h-full w-full min-w-full shrink-0 snap-start overflow-y-auto pb-24"
              >
                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
                  {onFloor.map((room) => (
                    <RoomTile
                      key={room.areaId}
                      room={room}
                      editMode={editMode}
                      onEdit={() => setPanel({ mode: "edit", room })}
                      onMore={(rect) => {
                        const width = 224;
                        const left = Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8));
                        const top = Math.min(rect.bottom + 6, window.innerHeight - 112);
                        setMenu({ room, top, left });
                      }}
                    />
                  ))}
                  {editMode ? (
                    <button
                      type="button"
                      onClick={() => setPanel({ mode: "add" })}
                      className="flex h-[176px] flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-gray-500 text-sm font-semibold text-gray-800 dark:border-white/40 dark:text-gray-100"
                    >
                      <Plus className="h-6 w-6" aria-hidden />
                      {t("rooms.addRoom")}
                    </button>
                  ) : null}
                </div>
              </section>
            ))}
          </div>
        ) : null}
      </div>

      {menu && typeof document !== "undefined"
        ? createPortal(
            <>
              <div className="fixed inset-0 z-[250]" onClick={() => setMenu(null)} aria-hidden />
              <div
                role="menu"
                className="fixed z-[251] w-56 overflow-hidden rounded-2xl bg-white py-1 shadow-xl ring-1 ring-black/10 dark:bg-[#1b1a21] dark:ring-white/10"
                style={{ top: menu.top, left: menu.left }}
              >
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    setPanel({ mode: "edit", room: menu.room });
                    setMenu(null);
                  }}
                  className="flex h-12 w-full items-center gap-3 px-4 text-left text-sm font-medium text-gray-900 hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                >
                  <Pencil className="h-5 w-5 text-gray-700 dark:text-gray-200" aria-hidden />
                  {t("rooms.editRoom")}
                </button>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => requestDelete(menu.room)}
                  className="flex h-12 w-full items-center gap-3 px-4 text-left text-sm font-medium text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="h-5 w-5" aria-hidden />
                  {t("rooms.delete")}
                </button>
              </div>
            </>,
            document.body
          )
        : null}

      {panel ? (
        <RoomPanel
          mode={panel.mode}
          room={panel.room}
          defaultFloor={floors[active]?.floor}
          onClose={() => setPanel(null)}
          onSaved={(floor) => {
            setPanel(null);
            pendingFloor.current = floor;
            load();
          }}
          onDelete={(room) => requestDelete(room as RoomItem)}
        />
      ) : null}

      {list.pending && typeof document !== "undefined"
        ? createPortal(
            <div data-room-undo>
              <UndoToast
                message={t("roomsUi.deleted").replace("{room}", list.pending.name)}
                actionLabel={t("editPanel.undo")}
                onAction={undoDelete}
              />
            </div>,
            document.body
          )
        : null}

      {passOpen && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[300]" role="dialog" aria-modal="true">
              <div className="absolute inset-0 bg-black/40" onClick={() => setPassOpen(false)} aria-hidden />
              <div className="fixed left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-5 shadow-2xl dark:bg-[#1b1a21]">
                <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                  {t("settings.dashboard.enterPasscode")}
                </h3>
                <input
                  type="password"
                  autoFocus
                  value={pass}
                  onChange={(event) => {
                    setPass(event.target.value);
                    setPassError(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      submitPass();
                    }
                  }}
                  placeholder={t("settings.dashboard.editModePasscodePlaceholder")}
                  className="h-12 w-full rounded-2xl bg-gray-100 px-4 text-gray-900 dark:bg-white/5 dark:text-white"
                  autoComplete="off"
                />
                {passError ? (
                  <p className="mt-2 text-sm font-medium text-red-700 dark:text-red-300">{passError}</p>
                ) : null}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPassOpen(false)}
                    className="inline-flex h-11 items-center rounded-full px-4 text-sm font-semibold text-gray-800 ring-1 ring-gray-300 dark:text-gray-100 dark:ring-white/25"
                  >
                    {t("rooms.cancel")}
                  </button>
                  <button
                    type="button"
                    onClick={submitPass}
                    className="inline-flex h-11 items-center rounded-full bg-brand px-4 text-sm font-semibold text-white dark:bg-[#8357be]"
                  >
                    {t("editPanel.done")}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </AppShell>
  );
}
