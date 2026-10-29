"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  GripVertical,
  Info,
  ListPlus,
  Plug,
  PlugZap,
  Plus,
  RotateCw,
  Search,
  Tablet,
  X,
} from "lucide-react";
import { UndoToast, UNDO_TOAST_DURATION_MS } from "@/components/undo-toast";
import { FOCUS_RING_BRAND } from "@/components/layout/tile-menu";
import { useTranslation } from "@/hooks/use-translation";
import { TOP_DEVICE_MAX } from "@/lib/energy-dashboard";
import {
  addTopDevice,
  moveTopDevice,
  moveTopDeviceBy,
  removeTopDevice,
  restoreTopDevice,
  topDeviceLabel,
} from "@/lib/energy-top-devices-order";
import {
  formatKwh1,
  listOverflows,
  mergeProposedCandidates,
  needsDeviceSetupGuide,
  proposalFromDevices,
  visibleStatisticIds,
  type ProposalDevice,
} from "@/lib/energy-top-devices-proposal";
import { cn } from "@/lib/utils";

const SEARCH_MIN_CANDIDATES = 8;

const hit = cn(
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl outline-none",
  FOCUS_RING_BRAND
);

export type TopDeviceEntity = {
  entity_id: string;
  attributes?: Record<string, unknown> | null;
};

export type TopDeviceEntitiesStatus = "loading" | "error" | "ready";

type UndoRemoval = { id: string; index: number; name: string };

function fill(template: string, vars: Record<string, string | number>): string {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{${key}}`).join(String(value));
  }
  return out;
}

function sameIds(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((id, index) => id === b[index]);
}

/** Shared by the picker and the entry row: wait out the loading state, then restore focus. */
function focusAfterChoiceRetry(
  pending: { current: boolean },
  status: "loading" | "ready" | "error",
  readyTarget: HTMLElement | null,
  errorTarget: HTMLElement | null
) {
  if (!pending.current || status === "loading") return;
  pending.current = false;
  if (status === "ready") readyTarget?.focus();
  else errorTarget?.focus();
}

function labelSources(entities: readonly TopDeviceEntity[], proposal: readonly ProposalDevice[]): TopDeviceEntity[] {
  if (proposal.length === 0) return [...entities];
  const merged = mergeProposedCandidates(entities, proposal);
  const seen = new Set(merged.map((entity) => entity.entity_id));
  return [...merged, ...entities.filter((entity) => !seen.has(entity.entity_id))];
}

function highlightName(name: string, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return name;
  const at = name.toLowerCase().indexOf(needle);
  if (at < 0) return name;
  return (
    <>
      {name.slice(0, at)}
      <mark className="bg-transparent font-bold text-inherit underline decoration-2 underline-offset-[3px]">
        {name.slice(at, at + needle.length)}
      </mark>
      {name.slice(at + needle.length)}
    </>
  );
}

export function EnergyTopDevicesSettings({
  dashboardId,
  entityIds,
  entities,
  entitiesStatus,
  onEntityIds,
  onRefreshEntities,
  choiceStatus = "ready",
  onRetryChoice,
}: {
  dashboardId: string | null;
  entityIds: string[];
  entities: readonly TopDeviceEntity[];
  entitiesStatus: TopDeviceEntitiesStatus;
  onEntityIds: (ids: string[]) => void;
  onRefreshEntities: () => void;
  /** Mirrors the first GET /api/energy-dashboard. Error hides add, remove, and reorder. */
  choiceStatus?: "loading" | "ready" | "error";
  onRetryChoice?: () => void;
}) {
  const { t, language } = useTranslation();
  const text = (key: string, vars?: Record<string, string | number>) =>
    fill(t(key), vars ?? {});
  const [ids, setIds] = useState(entityIds);
  const [ordering, setOrdering] = useState(false);
  const [search, setSearch] = useState("");
  const [grabbedId, setGrabbedId] = useState<string | null>(null);
  const [liftId, setLiftId] = useState<string | null>(null);
  const [live, setLive] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [undo, setUndo] = useState<UndoRemoval | null>(null);
  const idsRef = useRef(ids);
  const dragRef = useRef<{ id: string; origin: string[] } | null>(null);
  const dragCleanup = useRef<(() => void) | null>(null);
  const selectedListRef = useRef<HTMLDivElement | null>(null);
  const gripNodes = useRef(new Map<string, HTMLButtonElement>());
  const focusGrip = useRef<string | null>(null);
  const focusToast = useRef(false);
  const toastHost = useRef<HTMLDivElement | null>(null);
  const searchInput = useRef<HTMLInputElement | null>(null);
  const retryButton = useRef<HTMLButtonElement | null>(null);
  const chosenHeading = useRef<HTMLHeadingElement | null>(null);
  const setupHeading = useRef<HTMLHeadingElement | null>(null);
  const fallbackHeading = useRef<HTMLHeadingElement | null>(null);
  const retryFocus = useRef(false);
  const undoTimer = useRef<number | null>(null);
  const [prefsStatus, setPrefsStatus] = useState<"loading" | "ready" | "error">("loading");
  const [proposal, setProposal] = useState<ProposalDevice[]>([]);
  const [todayKwh, setTodayKwh] = useState<Record<string, number>>({});
  const [canScroll, setCanScroll] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const saveChain = useRef(Promise.resolve());
  const write = useRef(0);
  const syncedWrite = useRef(0);
  idsRef.current = ids;

  useEffect(() => {
    if (dragRef.current || write.current !== syncedWrite.current) return;
    if (sameIds(idsRef.current, entityIds)) return;
    idsRef.current = entityIds;
    setIds(entityIds);
  }, [entityIds]);

  useEffect(() => {
    if (ids.length < 2) setOrdering(false);
  }, [ids.length]);

  useEffect(() => {
    return () => {
      dragCleanup.current?.();
      if (undoTimer.current != null) window.clearTimeout(undoTimer.current);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setPrefsStatus("loading");
    fetch("/api/ha/energy/prefs", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("prefs");
        return response.json() as Promise<{
          deviceConsumption?: Array<{ statConsumption?: string | null; name?: string | null }>;
        }>;
      })
      .then((body) => {
        if (cancelled) return;
        const devices = Array.isArray(body.deviceConsumption) ? body.deviceConsumption : [];
        setProposal(
          proposalFromDevices(
            devices.map((device) => ({
              statConsumption: typeof device.statConsumption === "string" ? device.statConsumption : null,
              name: typeof device.name === "string" ? device.name : null,
            }))
          )
        );
        setPrefsStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setProposal([]);
        setPrefsStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const reloadPrefs = () => {
    setPrefsStatus("loading");
    fetch("/api/ha/energy/prefs", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("prefs");
        return response.json() as Promise<{
          deviceConsumption?: Array<{ statConsumption?: string | null; name?: string | null }>;
        }>;
      })
      .then((body) => {
        const devices = Array.isArray(body.deviceConsumption) ? body.deviceConsumption : [];
        setProposal(
          proposalFromDevices(
            devices.map((device) => ({
              statConsumption: typeof device.statConsumption === "string" ? device.statConsumption : null,
              name: typeof device.name === "string" ? device.name : null,
            }))
          )
        );
        setPrefsStatus("ready");
      })
      .catch(() => {
        setProposal([]);
        setPrefsStatus("error");
      });
  };

  useLayoutEffect(() => {
    const id = focusGrip.current;
    if (!id) return;
    focusGrip.current = null;
    gripNodes.current.get(id)?.focus();
  }, [ids]);

  useLayoutEffect(() => {
    if (!focusToast.current || !undo) return;
    const button = toastHost.current?.querySelector("button");
    if (!(button instanceof HTMLButtonElement)) return;
    focusToast.current = false;
    button.focus();
  }, [undo]);

  const setupGuide = prefsStatus === "ready" && needsDeviceSetupGuide(proposal);
  const candidates = setupGuide ? [] : mergeProposedCandidates(entities, prefsStatus === "ready" ? proposal : []);
  const proposedIds = new Set(proposal.map((device) => device.id));
  const showSearch = candidates.length > SEARCH_MIN_CANDIDATES;
  const query = showSearch ? search.trim().toLowerCase() : "";
  const full = ids.length >= TOP_DEVICE_MAX;

  function labelFor(id: string): string {
    if (entitiesStatus === "loading" && !entities.some((entity) => entity.entity_id === id)) {
      return t("editPanel.loading");
    }
    return topDeviceLabel(
      id,
      candidates.length > 0 ? candidates : entities,
      t("settings.energy.topDevices.unnamed"),
      t("settings.energy.topDevices.notFound")
    );
  }

  function placeText(key: string, id: string, list: readonly string[]) {
    const place = list.indexOf(id) + 1;
    return text(key, { name: labelFor(id), place, total: list.length });
  }

  function save(next: string[], previous = idsRef.current): Promise<boolean> {
    if (choiceStatus !== "ready") return Promise.resolve(false);
    if (sameIds(next, previous)) return Promise.resolve(true);
    const token = ++write.current;
    idsRef.current = next;
    setIds(next);
    setSaveError(null);
    const run = saveChain.current.then(() => persist(next, previous, token));
    saveChain.current = run.then(
      () => undefined,
      () => undefined
    );
    return run;
  }

  async function persist(next: string[], previous: string[], token: number): Promise<boolean> {
    const failed = () => {
      if (token !== write.current) return false;
      syncedWrite.current = token;
      if (sameIds(idsRef.current, next)) {
        idsRef.current = previous;
        setIds(previous);
      }
      setSaveError(t("settings.energy.topDevices.saveError"));
      return false;
    };
    if (!dashboardId) return failed();
    try {
      const res = await fetch(`/api/energy-dashboard/${dashboardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topDeviceIds: next }),
      });
      const data = (await res.json().catch(() => null)) as { topDeviceIds?: unknown } | null;
      if (!res.ok || !data || !Array.isArray(data.topDeviceIds)) return failed();
      const saved = data.topDeviceIds.filter((id): id is string => typeof id === "string");
      if (token !== write.current) return true;
      syncedWrite.current = token;
      if (sameIds(idsRef.current, next)) {
        idsRef.current = saved;
        setIds(saved);
      }
      onEntityIds(saved);
      return true;
    } catch {
      return failed();
    }
  }

  function indexAt(clientY: number): number {
    const rows = selectedListRef.current?.querySelectorAll<HTMLElement>("[data-top-device-row]") ?? [];
    for (let index = 0; index < rows.length; index += 1) {
      const rect = rows[index].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return index;
    }
    return Math.max(0, rows.length - 1);
  }

  function onGripPointerDown(event: React.PointerEvent<HTMLButtonElement>, id: string) {
    if (event.button !== 0) return;
    event.preventDefault();
    dragCleanup.current?.();
    dragRef.current = { id, origin: idsRef.current };
    setLiftId(id);
    const move = (ev: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const from = idsRef.current.indexOf(drag.id);
      const to = indexAt(ev.clientY);
      if (from < 0 || to === from) return;
      const next = moveTopDevice(idsRef.current, from, to);
      idsRef.current = next;
      setIds(next);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      dragCleanup.current = null;
      const drag = dragRef.current;
      dragRef.current = null;
      setLiftId(null);
      if (!drag) return;
      if (!sameIds(idsRef.current, drag.origin)) void save(idsRef.current, drag.origin);
    };
    dragCleanup.current = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function onGripKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, id: string) {
    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      if (grabbedId === id) {
        setGrabbedId(null);
        setLive(placeText("settings.energy.topDevices.dropped", id, idsRef.current));
        return;
      }
      setGrabbedId(id);
      setLive(placeText("settings.energy.topDevices.pickedUp", id, idsRef.current));
      return;
    }
    if (event.key === "Escape" && grabbedId === id) {
      event.preventDefault();
      setGrabbedId(null);
      setLive(placeText("settings.energy.topDevices.dropped", id, idsRef.current));
      return;
    }
    if (grabbedId !== id) return;
    const delta = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
    if (delta === 0) return;
    event.preventDefault();
    const from = idsRef.current.indexOf(id);
    const next = moveTopDeviceBy(idsRef.current, from, delta);
    if (sameIds(next, idsRef.current)) return;
    focusGrip.current = id;
    setLive(placeText("settings.energy.topDevices.pickedUp", id, next));
    void save(next);
  }

  function onAdd(id: string) {
    const result = addTopDevice(idsRef.current, id);
    if (!result.ok) {
      switch (result.reason) {
        case "full":
          return;
        case "duplicate":
        case "invalid":
          return;
        default: {
          const neverReason: never = result.reason;
          return neverReason;
        }
      }
    }
    focusGrip.current = id;
    setUndo(null);
    void save(result.ids);
  }

  function onRemove(id: string) {
    const removed = removeTopDevice(idsRef.current, id);
    if (removed.index < 0) return;
    const name = labelFor(id);
    const nextId = idsRef.current[removed.index + 1] ?? null;
    if (grabbedId === id) setGrabbedId(null);
    if (nextId) focusGrip.current = nextId;
    void save(removed.ids).then((ok) => {
      if (!ok) return;
      setUndo({ id, index: removed.index, name });
      if (!nextId) focusToast.current = true;
      if (undoTimer.current != null) window.clearTimeout(undoTimer.current);
      undoTimer.current = window.setTimeout(() => {
        const active = document.activeElement;
        const host = toastHost.current;
        const inside = Boolean(host && active instanceof Node && host.contains(active));
        if (inside) {
          const search = searchInput.current;
          if (search) search.focus();
          else {
            const next = document.querySelector("[data-top-devices-screen] button");
            if (next instanceof HTMLElement) next.focus();
          }
        }
        setUndo(null);
      }, UNDO_TOAST_DURATION_MS);
    });
  }

  function onUndo() {
    if (!undo) return;
    const restoredId = undo.id;
    const restored = restoreTopDevice(idsRef.current, restoredId, undo.index);
    if (!restored.ok) {
      switch (restored.reason) {
        case "full":
          setSaveError(t("settings.energy.topDevices.full"));
          return;
        case "duplicate":
        case "invalid":
          return;
        default: {
          const neverReason: never = restored.reason;
          return neverReason;
        }
      }
    }
    focusGrip.current = restoredId;
    setUndo(null);
    void save(restored.ids);
  }

  function moveByButton(id: string, delta: -1 | 1) {
    const from = idsRef.current.indexOf(id);
    const next = moveTopDeviceBy(idsRef.current, from, delta);
    if (sameIds(next, idsRef.current)) return;
    focusGrip.current = id;
    void save(next);
  }

  const unselected = candidates.filter((entity) => !ids.includes(entity.entity_id));
  const visibleAvailable = query
    ? candidates.filter((entity) => {
        const name = labelFor(entity.entity_id).toLowerCase();
        return name.includes(query) || entity.entity_id.toLowerCase().includes(query);
      })
    : unselected;
  const availableCount = query
    ? text("settings.energy.topDevices.filtered", { n: visibleAvailable.length, total: candidates.length })
    : String(unselected.length);

  const choiceReady = choiceStatus === "ready";
  const showNone = choiceReady && entitiesStatus === "ready" && candidates.length === 0;
  const showAvailable = choiceReady && entitiesStatus === "ready" && candidates.length > 0 && !ordering;
  const showChosen = choiceReady && !(showNone && ids.length === 0);

  useEffect(() => {
    if (!retryFocus.current || choiceStatus === "loading") return;
    if (choiceStatus === "ready" && prefsStatus === "loading") return;
    const readyTarget =
      searchInput.current ??
      chosenHeading.current ??
      setupHeading.current ??
      fallbackHeading.current;
    focusAfterChoiceRetry(retryFocus, choiceStatus, readyTarget, retryButton.current);
  }, [choiceStatus, prefsStatus, showSearch, showChosen, setupGuide]);

  const kwhIds = visibleStatisticIds(visibleAvailable.map((entity) => entity.entity_id));
  const kwhKey = kwhIds.join(",");

  useEffect(() => {
    if (!showAvailable || !kwhKey) return;
    let cancelled = false;
    fetch(`/api/ha/energy/statistics?view=day&devices=${encodeURIComponent(kwhKey)}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("statistics");
        return response.json() as Promise<{ devices?: { items?: Array<{ id?: unknown; total?: unknown }> } }>;
      })
      .then((body) => {
        if (cancelled) return;
        const next: Record<string, number> = {};
        for (const item of body.devices?.items ?? []) {
          if (typeof item.id === "string" && typeof item.total === "number" && Number.isFinite(item.total)) {
            next[item.id] = item.total;
          }
        }
        setTodayKwh(next);
      })
      .catch(() => {
        if (!cancelled) setTodayKwh({});
      });
    return () => {
      cancelled = true;
    };
  }, [kwhKey, showAvailable]);

  useLayoutEffect(() => {
    const node = listRef.current;
    if (!node || !showAvailable) {
      setCanScroll(false);
      return;
    }
    const measure = () => setCanScroll(listOverflows(node.scrollHeight, node.clientHeight));
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [showAvailable, kwhKey, visibleAvailable.length]);

  return (
    <div data-top-devices-screen>
      <h2 ref={fallbackHeading} tabIndex={-1} data-retry-fallback className="sr-only outline-none">
        {t("settings.energy.topDevices.title")}
      </h2>
      <p className="mb-4 ml-1 flex items-center gap-2 text-sm font-medium text-[#4b5563] dark:text-[#c4c4cc]">
        <Tablet className="h-4 w-4 shrink-0" aria-hidden />
        {t("settings.energy.topDevices.allTablets")}
      </p>
      <p className="sr-only" aria-live="polite">
        {live}
      </p>
      {saveError ? (
        <p role="alert" className="mb-3 ml-1 text-sm text-[#111827] dark:text-[#f3f4f6]">
          {saveError}
        </p>
      ) : null}

      {choiceStatus === "loading" ? (
        <p className="ml-1 text-sm text-[#4b5563] dark:text-[#c4c4cc]">{t("editPanel.loading")}</p>
      ) : null}

      {choiceStatus === "error" ? (
        <div className="flex flex-wrap items-center gap-3 rounded-[18px] border border-[rgba(17,24,39,0.08)] bg-white px-4 py-4 dark:border-white/10 dark:bg-[#1b1a21]">
          <p role="status" className="min-w-0 flex-1 text-sm leading-snug text-[#111827] dark:text-[#f3f4f6]">
            {t("settings.energy.topDevices.loadChoiceError")}
          </p>
          <button
            type="button"
            ref={retryButton}
            onClick={() => {
              retryFocus.current = true;
              onRetryChoice?.();
            }}
            className={cn(
              "inline-flex h-11 items-center rounded-full border border-[#767b85] px-4 text-[15px] font-semibold outline-none dark:border-[#6b6b75] dark:text-[#f3f4f6]",
              FOCUS_RING_BRAND
            )}
          >
            {t("settings.energy.topDevices.retry")}
          </button>
        </div>
      ) : null}

      {showChosen ? <section className="mb-4">
        <div className="mb-1.5 ml-4 flex min-h-5 items-center gap-2">
          <h3
            ref={chosenHeading}
            tabIndex={-1}
            className="text-sm font-semibold text-[#4b5563] outline-none dark:text-[#a1a1aa]"
          >
            {t("settings.energy.topDevices.onCardGroup")}
          </h3>
          <span className="ml-auto flex items-center gap-1">
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                full ? "text-[#4700B5] dark:text-[#B59ED8]" : "text-[#4b5563] dark:text-[#c4c4cc]"
              )}
              aria-label={text("settings.energy.topDevices.countLabel", { n: ids.length, max: TOP_DEVICE_MAX })}
            >
              {text("settings.energy.topDevices.count", { n: ids.length, max: TOP_DEVICE_MAX })}
            </span>
            {ids.length > 1 ? (
              <button
                type="button"
                aria-pressed={ordering}
                onClick={() => setOrdering((on) => !on)}
                className={cn(
                  "inline-flex h-11 items-center rounded-xl px-3 text-[15px] font-semibold text-[#4700B5] outline-none dark:text-[#B59ED8]",
                  FOCUS_RING_BRAND
                )}
              >
                {ordering ? t("settings.energy.topDevices.orderDone") : t("settings.energy.topDevices.order")}
              </button>
            ) : null}
          </span>
        </div>
        <div
          ref={selectedListRef}
          data-selected-list
          className="overflow-hidden rounded-[18px] border border-[rgba(17,24,39,0.08)] bg-white dark:border-white/10 dark:bg-[#1b1a21]"
        >
          {ids.length === 0 ? (
            <div className="flex gap-3.5 px-4 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(71,0,181,0.08)] text-[#4700B5] dark:bg-[rgba(131,87,190,0.18)] dark:text-[#B59ED8]">
                <ListPlus className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block text-base font-semibold text-[#111827] dark:text-[#f3f4f6]">
                  {t("settings.energy.topDevices.emptyTitle")}
                </span>
                <span className="mt-1 block text-[15px] leading-snug text-[#4b5563] dark:text-[#c4c4cc]">
                  {t("settings.energy.topDevices.emptyBody")}
                </span>
              </span>
            </div>
          ) : (
            ids.map((id, index) => {
              const name = labelFor(id);
              return (
                <div
                  key={id}
                  data-top-device-row
                  className={cn(
                    "flex min-h-16 items-center gap-1 border-t border-[rgba(17,24,39,0.08)] px-1 py-1.5 first:border-t-0 dark:border-white/10",
                    liftId === id && "relative z-[1] rounded-[14px] shadow-[0_12px_32px_rgba(15,23,42,0.18)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
                  )}
                >
                  <button
                    type="button"
                    ref={(node) => {
                      if (node) gripNodes.current.set(id, node);
                      else gripNodes.current.delete(id);
                    }}
                    aria-label={text("settings.energy.topDevices.grip", {
                      name,
                      place: index + 1,
                      total: ids.length,
                    })}
                    aria-roledescription={t("settings.energy.topDevices.gripRole")}
                    aria-pressed={grabbedId === id}
                    onPointerDown={(event) => onGripPointerDown(event, id)}
                    onKeyDown={(event) => onGripKeyDown(event, id)}
                    className={cn(hit, "touch-none cursor-grab text-[#4b5563] dark:text-[#a1a1aa]", grabbedId === id && "text-[#4700B5] dark:text-[#B59ED8]")}
                  >
                    <GripVertical className="h-5 w-5" aria-hidden />
                  </button>
                  {ordering ? (
                    <span className="w-6 shrink-0 text-center text-sm font-semibold tabular-nums text-[#4b5563] dark:text-[#c4c4cc]" aria-hidden>
                      {index + 1}
                    </span>
                  ) : null}
                  <span className="mx-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[rgba(17,24,39,0.05)] text-[#111827] dark:bg-white/[0.07] dark:text-[#f3f4f6]">
                    <Plug className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-base font-medium text-[#111827] dark:text-[#f3f4f6]">
                    {name}
                  </span>
                  {ordering ? (
                    <>
                      <button
                        type="button"
                        aria-label={text("settings.energy.topDevices.up", { name })}
                        disabled={index === 0}
                        onClick={() => moveByButton(id, -1)}
                        className={cn(hit, "text-[#4b5563] disabled:opacity-40 dark:text-[#a1a1aa]")}
                      >
                        <ChevronUp className="h-5 w-5" aria-hidden />
                      </button>
                      <button
                        type="button"
                        aria-label={text("settings.energy.topDevices.down", { name })}
                        disabled={index === ids.length - 1}
                        onClick={() => moveByButton(id, 1)}
                        className={cn(hit, "text-[#4b5563] disabled:opacity-40 dark:text-[#a1a1aa]")}
                      >
                        <ChevronDown className="h-5 w-5" aria-hidden />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      aria-label={text("settings.energy.topDevices.remove", { name })}
                      onClick={() => onRemove(id)}
                      className={cn(hit, "text-[#4b5563] dark:text-[#a1a1aa]")}
                    >
                      <X className="h-5 w-5" aria-hidden />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
        {ordering ? (
          <p className="mt-2 ml-4 text-sm leading-snug text-[#4b5563] dark:text-[#c4c4cc]">
            {t("settings.energy.topDevices.orderHint")}
          </p>
        ) : null}
      </section> : null}

      {entitiesStatus === "loading" ? (
        <p className="ml-4 text-sm text-[#4b5563] dark:text-[#c4c4cc]">{t("editPanel.loading")}</p>
      ) : null}

      {entitiesStatus === "error" ? (
        <section className="rounded-[18px] border border-[rgba(17,24,39,0.08)] bg-white px-4 py-4 dark:border-white/10 dark:bg-[#1b1a21]">
          <p className="text-[15px] leading-snug text-[#111827] dark:text-[#f3f4f6]">
            {t("settings.energy.topDevices.loadError")}
          </p>
          <button
            type="button"
            onClick={onRefreshEntities}
            className={cn(
              "mt-3 inline-flex h-11 items-center gap-2 rounded-full border border-[#767b85] px-4 text-[15px] font-semibold text-[#111827] outline-none dark:border-[#6b6b75] dark:text-[#f3f4f6]",
              FOCUS_RING_BRAND
            )}
          >
            <RotateCw className="h-4 w-4" aria-hidden />
            {t("settings.energy.topDevices.refresh")}
          </button>
        </section>
      ) : null}

      {prefsStatus === "error" && entitiesStatus === "ready" ? (
        <p role="status" className="mb-3 ml-1 flex flex-wrap items-center gap-3 text-sm text-[#111827] dark:text-[#f3f4f6]">
          <span>{t("settings.energy.topDevices.prefsError")}</span>
          <button
            type="button"
            onClick={reloadPrefs}
            className={cn(
              "inline-flex h-11 items-center rounded-full border border-[#767b85] px-4 text-[15px] font-semibold outline-none dark:border-[#6b6b75]",
              FOCUS_RING_BRAND
            )}
          >
            {t("settings.energy.topDevices.retry")}
          </button>
        </p>
      ) : null}

      {showNone ? (
        <NoneInHomeAssistant
          headingRef={setupHeading}
          onRefresh={() => {
            onRefreshEntities();
            reloadPrefs();
          }}
        />
      ) : null}

      {showAvailable ? (
        <section>
          <div className="mb-1.5 ml-4 flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#4b5563] dark:text-[#a1a1aa]">
              {t("settings.energy.topDevices.available")}
            </h3>
            <span className="ml-auto text-sm font-semibold tabular-nums text-[#4b5563] dark:text-[#c4c4cc]">
              {availableCount}
            </span>
          </div>
          {showSearch ? (
            <div className="mb-2 flex h-12 items-center gap-2 rounded-[14px] border border-[#767b85] bg-white px-3.5 has-[input:focus-visible]:border-[#4700B5] has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-brand dark:border-[#6b6b75] dark:bg-[#1b1a21] dark:has-[input:focus-visible]:border-[#8357be] dark:has-[input:focus-visible]:ring-brand-muted">
              <Search className="h-5 w-5 shrink-0 text-[#4b5563] dark:text-[#a1a1aa]" aria-hidden />
              <input
                ref={searchInput}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("settings.energy.topDevices.searchPlaceholder")}
                aria-label={t("settings.energy.topDevices.searchLabel")}
                autoComplete="off"
                className="h-11 min-w-0 flex-1 bg-transparent text-base text-[#111827] outline-none focus-visible:!outline-none placeholder:text-[#4b5563] dark:text-[#f3f4f6] dark:placeholder:text-[#c4c4cc]"
              />
              {search ? (
                <button
                  type="button"
                  aria-label={t("settings.energy.topDevices.clearSearch")}
                  onClick={() => {
                    setSearch("");
                    searchInput.current?.focus();
                  }}
                  className={cn(hit, "text-[#4b5563] dark:text-[#a1a1aa]")}
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              ) : null}
            </div>
          ) : null}
          <div className="overflow-hidden rounded-[18px] border border-[rgba(17,24,39,0.08)] bg-white dark:border-white/10 dark:bg-[#1b1a21]">
            {full ? (
              <p
                role="status"
                className="flex gap-3 border-b border-[rgba(17,24,39,0.08)] px-4 py-3.5 text-[15px] leading-snug text-[#111827] dark:border-white/10 dark:text-[#f3f4f6]"
              >
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#4700B5] dark:text-[#B59ED8]" aria-hidden />
                <span>{t("settings.energy.topDevices.full")}</span>
              </p>
            ) : null}
            <div className="relative">
            <div
              ref={listRef}
              data-available-list
              tabIndex={0}
              aria-label={t("settings.energy.topDevices.available")}
              className={cn(
                "max-h-[calc(100dvh-10rem)] overflow-y-auto outline-none focus-visible:!outline-none",
                FOCUS_RING_BRAND
              )}
            >
              {query && visibleAvailable.length === 0 ? (
                <p className="px-4 py-3.5 text-[15px] leading-snug text-[#4b5563] dark:text-[#c4c4cc]">
                  {t("settings.energy.topDevices.noMatch")}
                </p>
              ) : null}
              {visibleAvailable.map((entity) => {
                const name = labelFor(entity.entity_id);
                const onCard = ids.includes(entity.entity_id);
                return (
                  <div
                    key={entity.entity_id}
                    className="flex min-h-16 items-center gap-2 border-t border-[rgba(17,24,39,0.08)] px-3 py-1.5 first:border-t-0 dark:border-white/10"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[rgba(17,24,39,0.05)] text-[#111827] dark:bg-white/[0.07] dark:text-[#f3f4f6]">
                      <Plug className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-base font-medium text-[#111827] dark:text-[#f3f4f6]">
                        {highlightName(name, query)}
                      </span>
                      {proposedIds.has(entity.entity_id) ? (
                        <span data-proposal-line className="block text-sm leading-snug text-[#4b5563] dark:text-[#c4c4cc]">
                          {kwhIds.includes(entity.entity_id) && typeof todayKwh[entity.entity_id] === "number"
                            ? text("settings.energy.topDevices.proposalToday", {
                                kwh: formatKwh1(todayKwh[entity.entity_id] ?? 0, language === "nl" ? "nl" : "en"),
                              })
                            : t("settings.energy.topDevices.proposal")}
                        </span>
                      ) : kwhIds.includes(entity.entity_id) && typeof todayKwh[entity.entity_id] === "number" ? (
                        <span data-today-kwh className="block text-sm leading-snug text-[#4b5563] dark:text-[#c4c4cc]">
                          {text("settings.energy.topDevices.todayKwh", {
                            kwh: formatKwh1(todayKwh[entity.entity_id] ?? 0, language === "nl" ? "nl" : "en"),
                          })}
                        </span>
                      ) : null}
                    </span>
                    {onCard ? (
                      <span className="inline-flex items-center gap-1 pr-2 text-sm font-semibold text-[#4700B5] dark:text-[#B59ED8]">
                        <Check className="h-4 w-4" aria-hidden />
                        {t("settings.energy.topDevices.onCard")}
                      </span>
                    ) : full ? null : (
                      <button
                        type="button"
                        aria-label={text("settings.energy.topDevices.add", { name })}
                        onClick={() => onAdd(entity.entity_id)}
                        className={cn(hit, "rounded-full")}
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4700B5] text-white dark:bg-[#8357be]">
                          <Plus className="h-4 w-4" aria-hidden />
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {canScroll ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent dark:from-[#1b1a21]"
              />
            ) : null}
            </div>
            {canScroll ? <p className="sr-only">{t("settings.energy.topDevices.scrollHint")}</p> : null}
          </div>
        </section>
      ) : null}

      {undo ? (
        <div ref={toastHost}>
          <UndoToast message={text("settings.energy.topDevices.removed", { name: undo.name })} actionLabel={t("editPanel.undo")} onAction={onUndo} />
        </div>
      ) : null}
    </div>
  );
}

function NoneInHomeAssistant({
  onRefresh,
  headingRef,
}: {
  onRefresh: () => void;
  headingRef: { current: HTMLHeadingElement | null };
}) {
  const { t } = useTranslation();
  const steps = [
    t("settings.energy.topDevices.step1"),
    t("settings.energy.topDevices.step2"),
    t("settings.energy.topDevices.step3"),
  ];
  return (
    <section className="rounded-[18px] border border-[rgba(17,24,39,0.08)] bg-white px-4 py-4 dark:border-white/10 dark:bg-[#1b1a21]">
      <div className="flex gap-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(71,0,181,0.08)] text-[#4700B5] dark:bg-[rgba(131,87,190,0.18)] dark:text-[#B59ED8]">
          <PlugZap className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h3
            ref={headingRef}
            tabIndex={-1}
            data-setup-heading
            className="text-base font-semibold text-[#111827] outline-none dark:text-[#f3f4f6]"
          >
            {t("settings.energy.topDevices.noneTitle")}
          </h3>
          <p className="mt-1 text-[15px] leading-snug text-[#4b5563] dark:text-[#c4c4cc]">
            {t("settings.energy.topDevices.noneBody")}
          </p>
          <ol className="mt-3 list-none space-y-2">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-2.5 text-[15px] leading-snug text-[#111827] dark:text-[#f3f4f6]">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(17,24,39,0.05)] text-[13px] font-bold dark:bg-white/[0.07]"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-2 text-[15px] leading-snug text-[#4b5563] dark:text-[#c4c4cc]">
            {t("settings.energy.topDevices.noneAfter")}
          </p>
          <button
            type="button"
            onClick={onRefresh}
            className={cn(
              "mt-3 inline-flex h-11 items-center gap-2 rounded-full border border-[#767b85] px-4 text-[15px] font-semibold text-[#111827] outline-none dark:border-[#6b6b75] dark:text-[#f3f4f6]",
              FOCUS_RING_BRAND
            )}
          >
            <RotateCw className="h-4 w-4" aria-hidden />
            {t("settings.energy.topDevices.refresh")}
          </button>
        </div>
      </div>
    </section>
  );
}

export function EnergyTopDevicesEntry({
  entityIds,
  entities,
  onOpen,
  choiceStatus = "ready",
  onRetry,
}: {
  entityIds: readonly string[];
  entities: readonly TopDeviceEntity[];
  onOpen: () => void;
  choiceStatus?: "loading" | "ready" | "error";
  onRetry?: () => void;
}) {
  const { t } = useTranslation();
  const [proposal, setProposal] = useState<ProposalDevice[]>([]);
  const entryButton = useRef<HTMLButtonElement | null>(null);
  const retryButton = useRef<HTMLButtonElement | null>(null);
  const retryFocus = useRef(false);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/ha/energy/prefs", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("prefs");
        return response.json() as Promise<{
          deviceConsumption?: Array<{ statConsumption?: string | null; name?: string | null }>;
        }>;
      })
      .then((body) => {
        if (cancelled) return;
        const devices = Array.isArray(body.deviceConsumption) ? body.deviceConsumption : [];
        setProposal(
          proposalFromDevices(
            devices.map((device) => ({
              statConsumption: typeof device.statConsumption === "string" ? device.statConsumption : null,
              name: typeof device.name === "string" ? device.name : null,
            }))
          )
        );
      })
      .catch(() => {
        if (!cancelled) setProposal([]);
      });
    return () => {
      cancelled = true;
    };
  }, [entityIds]);
  useEffect(() => {
    focusAfterChoiceRetry(retryFocus, choiceStatus, entryButton.current, retryButton.current);
  }, [choiceStatus]);
  const count = fill(t("settings.energy.topDevices.count"), { n: entityIds.length, max: TOP_DEVICE_MAX });
  const labelEntities = labelSources(entities, proposal);
  const names =
    entityIds.length === 0
      ? t("settings.energy.topDevices.emptyTitle")
      : entityIds
          .map((id) =>
            topDeviceLabel(
              id,
              labelEntities,
              t("settings.energy.topDevices.unnamed"),
              t("settings.energy.topDevices.notFound")
            )
          )
          .join(", ");
  return (
    <div className="mb-4">
      <p className="mb-1.5 ml-4 text-sm font-semibold text-[#4b5563] dark:text-[#a1a1aa]">
        {t("settings.energy.topDevices.group")}
      </p>
      <div
        data-entry-card
        className={cn(
          "overflow-hidden rounded-[18px] border border-[rgba(17,24,39,0.08)] bg-white dark:border-white/10 dark:bg-[#1b1a21]",
          choiceStatus === "error" && "min-h-[148px]"
        )}
      >
        <button
          type="button"
          ref={entryButton}
          onClick={onOpen}
          className={cn(
            "flex min-h-16 w-full items-center gap-3 px-3 py-2 text-left outline-none",
            FOCUS_RING_BRAND
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[rgba(17,24,39,0.05)] text-[#111827] dark:bg-white/[0.07] dark:text-[#f3f4f6]">
            <Plug className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-medium text-[#111827] dark:text-[#f3f4f6]">
              {t("settings.energy.topDevices.title")}
            </span>
            <span data-entry-subline className="mt-0.5 block h-5 overflow-hidden">
              {choiceStatus === "ready" ? (
                <span className="flex h-5 min-w-0 items-center text-sm leading-5 text-[#4b5563] dark:text-[#c4c4cc]">
                  <span data-entry-names className="min-w-0 truncate">
                    {names}
                  </span>
                  <span data-entry-meta className="shrink-0 whitespace-pre">
                    {` · ${count} · ${t("settings.energy.topDevices.rowTablets")}`}
                  </span>
                </span>
              ) : choiceStatus === "loading" ? (
                <span className="block h-5 text-sm leading-5 text-[#4b5563] dark:text-[#c4c4cc]">
                  {t("editPanel.loading")}
                </span>
              ) : (
                <span className="block h-5" />
              )}
            </span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-[#4b5563] dark:text-[#a1a1aa]" aria-hidden />
        </button>
        {choiceStatus === "error" ? (
          <div className="flex flex-wrap items-center gap-3 px-3 pb-3">
            <p role="status" className="min-w-0 flex-1 text-sm leading-snug text-[#111827] dark:text-[#f3f4f6]">
              {t("settings.energy.topDevices.loadChoiceError")}
            </p>
            <button
              type="button"
              ref={retryButton}
              onClick={() => {
                retryFocus.current = true;
                onRetry?.();
              }}
              className={cn(
                "inline-flex h-11 items-center rounded-full border border-[#767b85] px-4 text-[15px] font-semibold outline-none dark:border-[#6b6b75] dark:text-[#f3f4f6]",
                FOCUS_RING_BRAND
              )}
            >
              {t("settings.energy.topDevices.retry")}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
