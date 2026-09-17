"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { DoorOpen, Image as ImageIcon, Plus, X } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { CARD_ICONS } from "@/components/widgets/card-icons";
import { RoomPreviewCard } from "@/components/widgets/room-preview-card";
import { EntitySelectWithSearch } from "@/components/entity-select-with-search";

const ROOM_ICON_OPTIONS = ["trees", "popcorn", "utensils-crossed", "towel-rack", "baby", "rocket", "gamepad", "tent-tree", "footprints", "eye-closed", "drill", "shelving-unit", "tool-case"] as const;

type RoomItem = { areaId: string; name: string; icon?: string | null; iconBackgroundColor?: string | null; floor?: string | null; background?: string | null; temperatureEntityId?: string | null; humidityEntityId?: string | null; createdAt: string };

/** Floor options for create form. Value is stored; order is for display. */
const FLOOR_OPTIONS = [
  { value: "", labelKey: "rooms.floorOther" as const },
  { value: "Kelder", labelKey: "rooms.floorBasement" as const },
  { value: "Begane grond", labelKey: "rooms.floorGround" as const },
  { value: "1e verdieping", labelKey: "rooms.floor1st" as const },
  { value: "2e verdieping", labelKey: "rooms.floor2nd" as const },
  { value: "3e verdieping", labelKey: "rooms.floor3rd" as const },
  { value: "Zolder", labelKey: "rooms.floorAttic" as const },
] as const;

/** Order for grouping floors. Earlier = higher in list. Unknown floors go last. */
const FLOOR_ORDER = ["Kelder", "Begane grond", "1e verdieping", "2e verdieping", "3e verdieping", "Zolder"];

function groupRoomsByFloor(rooms: RoomItem[]): { floor: string; rooms: RoomItem[] }[] {
  const byFloor = new Map<string, RoomItem[]>();
  for (const r of rooms) {
    const key = r.floor?.trim() || "";
    if (!byFloor.has(key)) byFloor.set(key, []);
    byFloor.get(key)!.push(r);
  }
  const result: { floor: string; rooms: RoomItem[] }[] = [];
  for (const f of FLOOR_ORDER) {
    if (byFloor.has(f)) {
      result.push({ floor: f, rooms: byFloor.get(f)! });
      byFloor.delete(f);
    }
  }
  byFloor.forEach((rooms, floor) => {
    result.push({ floor, rooms });
  });
  return result;
}

export default function RoomsPage() {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newId, setNewId] = useState("");
  const [newIcon, setNewIcon] = useState<string>(ROOM_ICON_OPTIONS[0]);
  const [newIconBackgroundColor, setNewIconBackgroundColor] = useState<string>("#3B82F6");
  const [newFloor, setNewFloor] = useState<string>("");
  const [newCustomFloor, setNewCustomFloor] = useState("");
  const [newBackgroundFile, setNewBackgroundFile] = useState<File | null>(null);
  const [newBackgroundPreview, setNewBackgroundPreview] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState<string>(ROOM_ICON_OPTIONS[0]);
  const [editIconBackgroundColor, setEditIconBackgroundColor] = useState<string>("#3B82F6");
  const [editBackgroundFile, setEditBackgroundFile] = useState<File | null>(null);
  const [editBackgroundPreview, setEditBackgroundPreview] = useState<string | null>(null);
  const [editFloor, setEditFloor] = useState("");
  const [editCustomFloor, setEditCustomFloor] = useState("");
  const [editTemperatureEntityId, setEditTemperatureEntityId] = useState("");
  const [editHumidityEntityId, setEditHumidityEntityId] = useState("");
  const [editEntities, setEditEntities] = useState<{ entity_id: string; attributes?: Record<string, unknown> }[]>([]);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [floorIndex, setFloorIndex] = useState(0);
  const [pendingFloor, setPendingFloor] = useState<string | null>(null);
  const floorScrollerRef = useRef<HTMLDivElement>(null);
  const floorDragRef = useRef<{
    id: number;
    x: number;
    left: number;
    claimed: boolean;
  } | null>(null);
  const floorDragClaimedRef = useRef(false);

  useEffect(() => {
    if (!editModalOpen) return;
    fetch("/api/ha/entities")
      .then((r) => r.json())
      .then((data) => (Array.isArray(data) ? setEditEntities(data) : setEditEntities([])))
      .catch(() => setEditEntities([]));
  }, [editModalOpen]);

  const loadRooms = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch("/api/room-dashboards")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load rooms");
        return r.json();
      })
      .then((data: RoomItem[]) => {
        setRooms(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setCreating(true);
    try {
      let backgroundUrl: string | undefined;
      if (newBackgroundFile) {
        const formData = new FormData();
        formData.set("file", newBackgroundFile);
        const upRes = await fetch("/api/upload", { method: "POST", body: formData });
        const upJson = await upRes.json();
        if (!upRes.ok) throw new Error(upJson?.error ?? "Upload failed");
        backgroundUrl = upJson.url;
      }
      const res = await fetch("/api/room-dashboards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          id: newId.trim() || undefined,
          icon: newIcon || undefined,
          iconBackgroundColor: newIconBackgroundColor || undefined,
          floor: newFloor.trim()
            ? newFloor.trim()
            : newCustomFloor.trim() || undefined,
          background: backgroundUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data?.error ?? "Failed to create room");
        return;
      }
      const createdFloor = newFloor.trim()
        ? newFloor.trim()
        : newCustomFloor.trim() || "";
      setAddModalOpen(false);
      setNewName("");
      setNewId("");
      setNewIcon(ROOM_ICON_OPTIONS[0]);
      setNewIconBackgroundColor("#3B82F6");
      setNewFloor("");
      setNewCustomFloor("");
      setNewBackgroundFile(null);
      setNewBackgroundPreview(null);
      setPendingFloor(createdFloor);
      loadRooms();
    } catch {
      setCreateError(t("rooms.genericError"));
    } finally {
      setCreating(false);
    }
  }

  function openEditModal(r: RoomItem) {
    setEditingRoom(r);
    setEditName(r.name);
    setEditIcon((r.icon as string) || ROOM_ICON_OPTIONS[0]);
    setEditIconBackgroundColor((r.iconBackgroundColor as string) || "#3B82F6");
    setEditBackgroundFile(null);
    setEditBackgroundPreview(r.background || null);
    const isPreset = FLOOR_ORDER.includes(r.floor || "");
    setEditFloor(isPreset ? (r.floor || "") : "");
    setEditCustomFloor(isPreset ? "" : (r.floor || ""));
    setEditTemperatureEntityId(r.temperatureEntityId ?? "");
    setEditHumidityEntityId(r.humidityEntityId ?? "");
    setUpdateError(null);
    setEditModalOpen(true);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingRoom) return;
    setUpdateError(null);
    setUpdating(true);
    try {
      let backgroundUrl: string | null | undefined;
      if (editBackgroundFile) {
        const formData = new FormData();
        formData.set("file", editBackgroundFile);
        const upRes = await fetch("/api/upload", { method: "POST", body: formData });
        const upJson = await upRes.json();
        if (!upRes.ok) throw new Error(upJson?.error ?? "Upload failed");
        backgroundUrl = upJson.url;
      } else {
        backgroundUrl = editBackgroundPreview ?? null;
      }
      const floorValue = editFloor.trim()
        ? editFloor.trim()
        : editCustomFloor.trim() || undefined;
      const res = await fetch(`/api/room-dashboards/${encodeURIComponent(editingRoom.areaId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          icon: editIcon || undefined,
          iconBackgroundColor: editIconBackgroundColor || undefined,
          floor: floorValue,
          background: backgroundUrl,
          temperatureEntityId: editTemperatureEntityId.trim() || null,
          humidityEntityId: editHumidityEntityId.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setUpdateError(data?.error ?? "Failed to update room");
        return;
      }
      setEditModalOpen(false);
      setEditingRoom(null);
      setEditBackgroundFile(null);
      setEditBackgroundPreview(null);
      setPendingFloor(floorValue ?? "");
      loadRooms();
    } catch {
      setUpdateError(t("rooms.genericError"));
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete(areaId: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(t("rooms.deleteConfirm"))) return;
    try {
      await fetch(`/api/room-dashboards/${encodeURIComponent(areaId)}`, {
        method: "DELETE",
      });
      loadRooms();
    } catch {
      // ignore
    }
  }

  const floorsWithRooms = groupRoomsByFloor(rooms);
  const getFloorLabel = (floor: string) => {
    if (!floor) return t("rooms.floorOther");
    const opt = FLOOR_OPTIONS.find((o) => o.value === floor);
    return opt ? t(opt.labelKey) : floor;
  };
  const floorTabs = floorsWithRooms.map(({ floor }) => ({
    key: floor || "_",
    label: getFloorLabel(floor || ""),
    floor: floor || "",
  }));
  const activeFloorIndex = Math.max(0, Math.min(floorIndex, Math.max(0, floorsWithRooms.length - 1)));
  const activeFloor = floorsWithRooms[activeFloorIndex]?.floor ?? "";

  const goToFloor = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const max = Math.max(0, floorsWithRooms.length - 1);
    const clamped = Math.max(0, Math.min(max, index));
    setFloorIndex(clamped);
    const root = floorScrollerRef.current;
    if (!root) return;
    root.scrollTo({ left: clamped * root.clientWidth, behavior });
  }, [floorsWithRooms.length]);

  useEffect(() => {
    if (floorIndex !== activeFloorIndex) setFloorIndex(activeFloorIndex);
  }, [activeFloorIndex, floorIndex]);

  useEffect(() => {
    if (pendingFloor == null || floorsWithRooms.length === 0) return;
    const i = floorsWithRooms.findIndex(({ floor }) => (floor || "") === pendingFloor);
    if (i >= 0) goToFloor(i, "auto");
    setPendingFloor(null);
  }, [floorsWithRooms, goToFloor, pendingFloor]);

  useEffect(() => {
    const root = floorScrollerRef.current;
    if (!root) return;
    const onResize = () => {
      root.scrollTo({ left: activeFloorIndex * root.clientWidth, behavior: "auto" });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeFloorIndex]);

  const openAddModal = () => {
    setAddModalOpen(true);
    setCreateError(null);
    setNewName("");
    setNewId("");
    setNewIcon(ROOM_ICON_OPTIONS[0]);
    setNewIconBackgroundColor("#3B82F6");
    const isPreset = FLOOR_ORDER.includes(activeFloor);
    setNewFloor(isPreset ? activeFloor : "");
    setNewCustomFloor(isPreset ? "" : activeFloor);
    setNewBackgroundFile(null);
    setNewBackgroundPreview(null);
  };

  return (
    <AppShell
      activeTab="/rooms"
      contentNoScroll
      headerEndAction={
        <button
          type="button"
          onClick={openAddModal}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-sm transition-opacity hover:opacity-90"
          aria-label={t("rooms.addRoom")}
        >
          <Plus className="h-5 w-5" />
        </button>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-5 px-2 md:px-4">
        <div className="flex shrink-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">{t("rooms.kicker")}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              {t("rooms.title")}
            </h1>
            <p className="mt-1 max-w-xl text-sm text-gray-500 dark:text-gray-400">
              {t("rooms.description")}
            </p>
          </div>
          {floorTabs.length > 1 && (
            <div className="flex flex-wrap gap-0.5 rounded-full bg-black/5 p-0.5 dark:bg-white/5" role="tablist" aria-label={t("rooms.floors")}>
              {floorTabs.map(({ key, label }, index) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={activeFloorIndex === index}
                  onClick={() => goToFloor(index)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    activeFloorIndex === index
                      ? "bg-white text-gray-900 shadow-sm dark:bg-white/15 dark:text-white"
                      : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent"
              aria-hidden
            />
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && rooms.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-black/[0.03] py-16 px-6 text-center dark:bg-white/5">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand dark:bg-brand/30 dark:text-white">
              <DoorOpen className="h-7 w-7" />
            </div>
            <p className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
              {t("rooms.empty")}
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              {t("rooms.emptyHint")}
            </p>
            <button
              type="button"
              onClick={openAddModal}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              {t("rooms.addRoom")}
            </button>
          </div>
        )}

        {!loading && !error && rooms.length > 0 && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div
              ref={floorScrollerRef}
              className="flex min-h-0 flex-1 cursor-grab snap-x snap-mandatory overflow-x-auto overflow-y-hidden scrollbar-hide overscroll-x-contain touch-pan-x active:cursor-grabbing"
              onPointerDown={(e) => {
                if (e.button !== 0) return;
                const target = e.target as HTMLElement;
                if (target.closest("button")) return;
                floorDragClaimedRef.current = false;
                floorDragRef.current = {
                  id: e.pointerId,
                  x: e.clientX,
                  left: e.currentTarget.scrollLeft,
                  claimed: false,
                };
              }}
              onPointerMove={(e) => {
                const drag = floorDragRef.current;
                const root = e.currentTarget;
                if (!drag || drag.id !== e.pointerId) return;
                const dx = e.clientX - drag.x;
                if (!drag.claimed && Math.abs(dx) < 12) return;
                if (!drag.claimed) {
                  drag.claimed = true;
                  floorDragClaimedRef.current = true;
                  root.setPointerCapture(e.pointerId);
                }
                root.scrollLeft = drag.left - dx;
              }}
              onPointerUp={(e) => {
                const drag = floorDragRef.current;
                floorDragRef.current = null;
                if (!drag?.claimed) return;
                const root = e.currentTarget;
                if (root.clientWidth <= 0) return;
                goToFloor(Math.round(root.scrollLeft / root.clientWidth));
              }}
              onPointerCancel={() => {
                floorDragRef.current = null;
              }}
              onClickCapture={(e) => {
                if (!floorDragClaimedRef.current) return;
                floorDragClaimedRef.current = false;
                e.preventDefault();
                e.stopPropagation();
              }}
              onScroll={(e) => {
                const root = e.currentTarget;
                if (root.clientWidth <= 0) return;
                const next = Math.round(root.scrollLeft / root.clientWidth);
                if (next !== floorIndex) setFloorIndex(next);
              }}
            >
              {floorsWithRooms.map(({ floor, rooms: floorRooms }, index) => (
                <section
                  key={floor || "_"}
                  className="flex h-full w-full min-w-full shrink-0 snap-start flex-col overflow-y-auto pb-4"
                  aria-hidden={activeFloorIndex !== index}
                >
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-white/45">
                    {getFloorLabel(floor || "")}
                  </h3>
                  <div className="flex flex-wrap gap-5">
                    {floorRooms.map((r) => (
                      <RoomPreviewCard
                        key={r.areaId}
                        areaId={r.areaId}
                        name={r.name}
                        icon={r.icon}
                        iconBackgroundColor={r.iconBackgroundColor}
                        background={r.background}
                        onEdit={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openEditModal(r);
                        }}
                        onDelete={(e) => handleDelete(r.areaId, e)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
            {floorsWithRooms.length > 1 ? (
              <div className="flex shrink-0 justify-center pb-1 pt-3">
                <div className="flex items-center gap-1.5" role="tablist" aria-label={t("rooms.floors")}>
                  {floorTabs.map(({ key, label }, index) => (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={activeFloorIndex === index}
                      aria-label={t("rooms.floorN")
                        .replace("{floor}", label)
                        .replace("{n}", String(index + 1))
                        .replace("{total}", String(floorTabs.length))}
                      onClick={() => goToFloor(index)}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        activeFloorIndex === index
                          ? "w-5 bg-brand"
                          : "w-2 bg-black/25 hover:bg-black/40 dark:bg-white/35 dark:hover:bg-white/55"
                      )}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {addModalOpen && typeof document !== "undefined" && (
        <div className="fixed inset-0 z-[200]" aria-modal="true" role="dialog">
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            aria-hidden
            onClick={() => !creating && setAddModalOpen(false)}
          />
          <div
            className="fixed top-4 right-4 bottom-4 z-[201] w-full max-w-md animate-slide-in-right flex flex-col overflow-hidden rounded-3xl border border-white/70 bg-white dark:bg-gray-900 dark:border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 flex items-center justify-between p-5 pb-3 border-b border-white/50 dark:border-white/10">
              <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{t("rooms.addRoom")}</h3>
              <button
                type="button"
                onClick={() => !creating && setAddModalOpen(false)}
                className="p-1.5 rounded-full text-gray-500 hover:bg-black/5 dark:hover:bg-white/10 dark:text-gray-400"
                aria-label={t("rooms.cancel")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="flex flex-1 min-h-0 flex-col overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto p-5 pt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {t("rooms.roomName")}
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t("rooms.roomNamePlaceholder")}
                  required
                  className="w-full rounded-2xl bg-black/[0.04] px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/40 dark:bg-white/5 dark:text-white"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {t("rooms.icon")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {ROOM_ICON_OPTIONS.map((iconKey) => {
                    const Icon = CARD_ICONS[iconKey];
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setNewIcon(iconKey)}
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl border-2 transition-colors ${
                          newIcon === iconKey
                            ? "border-brand bg-brand/10 text-brand"
                            : "border-gray-200 dark:border-white/20 text-gray-500 hover:border-gray-300 dark:hover:border-white/30"
                        }`}
                        title={iconKey}
                      >
                        {Icon && <Icon className="h-5 w-5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {t("rooms.iconBackgroundColor")}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newIconBackgroundColor && /^#[0-9A-Fa-f]{6}$/.test(newIconBackgroundColor) ? newIconBackgroundColor : "#3B82F6"}
                    onChange={(e) => setNewIconBackgroundColor(e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded-2xl border border-white/60 dark:border-white/20"
                  />
                  <input
                    type="text"
                    value={newIconBackgroundColor ?? ""}
                    onChange={(e) => setNewIconBackgroundColor(e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1 rounded-2xl bg-black/[0.04] px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/40 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {t("rooms.floor")}
                </label>
                <select
                  value={newFloor}
                  onChange={(e) => setNewFloor(e.target.value)}
                  className="w-full rounded-2xl bg-black/[0.04] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/40 dark:bg-white/5 dark:text-white"
                >
                  {FLOOR_OPTIONS.map((opt) => (
                    <option key={opt.value || "_"} value={opt.value}>
                      {t(opt.labelKey)}
                    </option>
                  ))}
                </select>
                {!newFloor && (
                  <input
                    type="text"
                    value={newCustomFloor}
                    onChange={(e) => setNewCustomFloor(e.target.value)}
                    placeholder={t("rooms.floorPlaceholder")}
                    className="mt-2 w-full rounded-2xl bg-black/[0.04] px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/40 dark:bg-white/5 dark:text-white"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {t("rooms.background")}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="room-bg-create"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewBackgroundFile(file);
                      setNewBackgroundPreview(URL.createObjectURL(file));
                    }
                    e.target.value = "";
                  }}
                />
                <div className="flex items-center gap-3">
                  {newBackgroundPreview ? (
                    <>
                      <div
                        className="h-16 w-24 shrink-0 rounded-2xl bg-cover bg-center"
                        style={{ backgroundImage: `url(${newBackgroundPreview})` }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setNewBackgroundFile(null);
                          setNewBackgroundPreview(null);
                        }}
                        className="text-sm text-red-600 dark:text-red-400 hover:underline"
                      >
                        {t("rooms.backgroundRemove")}
                      </button>
                    </>
                  ) : (
                    <label
                      htmlFor="room-bg-create"
                      className="flex h-16 w-24 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 text-gray-500 hover:border-brand hover:text-brand"
                    >
                      <ImageIcon className="h-6 w-6" aria-hidden />
                    </label>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {t("rooms.roomId")}
                </label>
                <input
                  type="text"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  placeholder={t("rooms.roomIdPlaceholder")}
                  className="w-full rounded-2xl bg-black/[0.04] px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/40 dark:bg-white/5 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t("rooms.roomIdHint")}
                </p>
              </div>
              {createError && (
                <p className="text-sm text-red-600 dark:text-red-400">{createError}</p>
              )}
              </div>
              <div className="shrink-0 flex justify-end gap-2 p-5 pt-4 border-t border-white/50 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => !creating && setAddModalOpen(false)}
                  className="rounded-full border border-white/60 bg-white/40 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
                >
                  {t("rooms.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={creating || !newName.trim()}
                  className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50"
                >
                  {creating ? "…" : t("rooms.create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editModalOpen && editingRoom && typeof document !== "undefined" && (
        <div className="fixed inset-0 z-[200]" aria-modal="true" role="dialog">
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            aria-hidden
            onClick={() => !updating && setEditModalOpen(false)}
          />
          <div
            className="fixed top-4 right-4 bottom-4 z-[201] w-full max-w-md animate-slide-in-right flex flex-col overflow-hidden rounded-3xl border border-white/70 bg-white dark:bg-gray-900 dark:border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 flex items-center justify-between p-5 pb-3 border-b border-white/50 dark:border-white/10">
              <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{t("rooms.editRoom")}</h3>
              <button
                type="button"
                onClick={() => !updating && setEditModalOpen(false)}
                className="p-1.5 rounded-full text-gray-500 hover:bg-black/5 dark:hover:bg-white/10 dark:text-gray-400"
                aria-label={t("rooms.cancel")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="flex flex-1 min-h-0 flex-col overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto p-5 pt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {t("rooms.roomName")}
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder={t("rooms.roomNamePlaceholder")}
                  required
                  className="w-full rounded-2xl bg-black/[0.04] px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/40 dark:bg-white/5 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {t("rooms.icon")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {ROOM_ICON_OPTIONS.map((iconKey) => {
                    const Icon = CARD_ICONS[iconKey];
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setEditIcon(iconKey)}
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl border-2 transition-colors ${
                          editIcon === iconKey
                            ? "border-brand bg-brand/10 text-brand"
                            : "border-gray-200 dark:border-white/20 text-gray-500 hover:border-gray-300 dark:hover:border-white/30"
                        }`}
                        title={iconKey}
                      >
                        {Icon && <Icon className="h-5 w-5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {t("rooms.iconBackgroundColor")}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editIconBackgroundColor && /^#[0-9A-Fa-f]{6}$/.test(editIconBackgroundColor) ? editIconBackgroundColor : "#3B82F6"}
                    onChange={(e) => setEditIconBackgroundColor(e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded-2xl border border-white/60 dark:border-white/20"
                  />
                  <input
                    type="text"
                    value={editIconBackgroundColor ?? ""}
                    onChange={(e) => setEditIconBackgroundColor(e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1 rounded-2xl bg-black/[0.04] px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/40 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {t("rooms.floor")}
                </label>
                <select
                  value={editFloor}
                  onChange={(e) => setEditFloor(e.target.value)}
                  className="w-full rounded-2xl bg-black/[0.04] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/40 dark:bg-white/5 dark:text-white"
                >
                  {FLOOR_OPTIONS.map((opt) => (
                    <option key={opt.value || "_"} value={opt.value}>
                      {t(opt.labelKey)}
                    </option>
                  ))}
                </select>
                {!editFloor && (
                  <input
                    type="text"
                    value={editCustomFloor}
                    onChange={(e) => setEditCustomFloor(e.target.value)}
                    placeholder={t("rooms.floorPlaceholder")}
                    className="mt-2 w-full rounded-2xl bg-black/[0.04] px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/40 dark:bg-white/5 dark:text-white"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {t("rooms.temperatureEntity")}
                </label>
                <EntitySelectWithSearch
                  entities={editEntities}
                  value={editTemperatureEntityId}
                  onChange={setEditTemperatureEntityId}
                  filter={(e) => e.entity_id.startsWith("sensor.") || e.entity_id.startsWith("climate.")}
                  placeholder={t("rooms.entitySearchPlaceholder")}
                  emptyOption={t("rooms.entityNone")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {t("rooms.humidityEntity")}
                </label>
                <EntitySelectWithSearch
                  entities={editEntities}
                  value={editHumidityEntityId}
                  onChange={setEditHumidityEntityId}
                  filter={(e) => e.entity_id.startsWith("sensor.") || e.entity_id.startsWith("climate.")}
                  placeholder={t("rooms.entitySearchPlaceholder")}
                  emptyOption={t("rooms.entityNone")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {t("rooms.background")}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="room-bg-edit"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEditBackgroundFile(file);
                      setEditBackgroundPreview(URL.createObjectURL(file));
                    }
                    e.target.value = "";
                  }}
                />
                <div className="flex items-center gap-3">
                  {editBackgroundPreview ? (
                    <>
                      <div
                        className="h-16 w-24 shrink-0 rounded-2xl bg-cover bg-center"
                        style={{ backgroundImage: `url(${editBackgroundPreview})` }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEditBackgroundFile(null);
                          setEditBackgroundPreview(null);
                        }}
                        className="text-sm text-red-600 dark:text-red-400 hover:underline"
                      >
                        {t("rooms.backgroundRemove")}
                      </button>
                    </>
                  ) : (
                    <label
                      htmlFor="room-bg-edit"
                      className="flex h-16 w-24 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 text-gray-500 hover:border-brand hover:text-brand"
                    >
                      <ImageIcon className="h-6 w-6" aria-hidden />
                    </label>
                  )}
                </div>
              </div>
              {updateError && (
                <p className="text-sm text-red-600 dark:text-red-400">{updateError}</p>
              )}
              </div>
              <div className="shrink-0 flex justify-end gap-2 p-5 pt-4 border-t border-white/50 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => !updating && setEditModalOpen(false)}
                  className="rounded-full border border-white/60 bg-white/40 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
                >
                  {t("rooms.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={updating || !editName.trim()}
                  className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50"
                >
                  {updating ? "…" : t("rooms.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
