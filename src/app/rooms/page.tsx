"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { DoorOpen, Image as ImageIcon, LayoutGrid, Plus, Trash2, X } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { CARD_ICONS } from "@/components/widgets/card-icons";
import { RoomPreviewCard } from "@/components/widgets/room-preview-card";

const ROOM_ICON_OPTIONS = ["DoorOpen", "Home", "Sofa", "BedDouble", "Bath", "UtensilsCrossed", "Lamp", "Car", "Building2"] as const;

type RoomItem = { areaId: string; name: string; icon?: string | null; iconBackgroundColor?: string | null; floor?: string | null; background?: string | null; createdAt: string };

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

function RoomIcon({ icon }: { icon?: string | null }) {
  const Icon = icon && icon in CARD_ICONS ? CARD_ICONS[icon] : LayoutGrid;
  return <Icon className="h-5 w-5" aria-hidden />;
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
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

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
      setAddModalOpen(false);
      setNewName("");
      setNewId("");
      setNewIcon(ROOM_ICON_OPTIONS[0]);
      setNewIconBackgroundColor("#3B82F6");
      setNewFloor("");
      setNewCustomFloor("");
      setNewBackgroundFile(null);
      setNewBackgroundPreview(null);
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

  return (
    <AppShell activeTab="/rooms">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("rooms.title")}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("rooms.description")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setAddModalOpen(true);
              setCreateError(null);
              setNewName("");
              setNewId("");
              setNewIcon(ROOM_ICON_OPTIONS[0]);
              setNewIconBackgroundColor("#3B82F6");
              setNewFloor("");
              setNewCustomFloor("");
              setNewBackgroundFile(null);
              setNewBackgroundPreview(null);
            }}
            className="flex items-center gap-2 rounded-xl border border-[#4D2FB2]/40 bg-[#4D2FB2]/10 px-4 py-2.5 text-sm font-medium text-[#4D2FB2] transition-colors hover:bg-[#4D2FB2]/20 dark:border-[#4D2FB2]/40 dark:bg-[#4D2FB2]/20 dark:text-[#4D2FB2] dark:hover:bg-[#4D2FB2]/30"
          >
            <Plus className="h-4 w-4" />
            {t("rooms.addRoom")}
          </button>
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
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && rooms.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-white/20 bg-gray-50/50 dark:bg-white/5 py-16 px-6 text-center">
            <DoorOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("rooms.empty")}
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              {t("rooms.emptyHint")}
            </p>
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="mt-6 flex items-center gap-2 rounded-xl bg-[#4D2FB2] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 dark:bg-[#4D2FB2]"
            >
              <Plus className="h-4 w-4" />
              {t("rooms.addRoom")}
            </button>
          </div>
        )}

        {!loading && !error && rooms.length > 0 && (
          <div className="space-y-6">
            {groupRoomsByFloor(rooms).map(({ floor, rooms: floorRooms }) => (
              <div key={floor || "_"} className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {floor ? floor : t("rooms.floorOther")}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              </div>
            ))}
          </div>
        )}
      </div>

      {addModalOpen && typeof document !== "undefined" && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            aria-hidden
            onClick={() => !creating && setAddModalOpen(false)}
          />
          <div
            className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-gray-900 dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{t("rooms.addRoom")}</h3>
              <button
                type="button"
                onClick={() => !creating && setAddModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
                aria-label={t("rooms.cancel")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
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
                  className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500"
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
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-colors ${
                          newIcon === iconKey
                            ? "border-[#4D2FB2] bg-[#4D2FB2]/10 text-[#4D2FB2]"
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
                    className="h-10 w-14 cursor-pointer rounded-lg border border-gray-300 dark:border-white/20"
                  />
                  <input
                    type="text"
                    value={newIconBackgroundColor ?? ""}
                    onChange={(e) => setNewIconBackgroundColor(e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 text-sm"
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
                  className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white"
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
                    className="mt-2 w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500"
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
                        className="h-16 w-24 shrink-0 rounded-lg bg-cover bg-center"
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
                      className="flex h-16 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-white/20 text-gray-500 hover:border-[#4D2FB2] hover:text-[#4D2FB2]"
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
                  className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t("rooms.roomIdHint")}
                </p>
              </div>
              {createError && (
                <p className="text-sm text-red-600 dark:text-red-400">{createError}</p>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => !creating && setAddModalOpen(false)}
                  className="rounded-lg border border-gray-300 dark:border-white/20 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  {t("rooms.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={creating || !newName.trim()}
                  className="rounded-lg bg-[#4D2FB2] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                >
                  {creating ? "…" : t("rooms.create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editModalOpen && editingRoom && typeof document !== "undefined" && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            aria-hidden
            onClick={() => !updating && setEditModalOpen(false)}
          />
          <div
            className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-gray-900 dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{t("rooms.editRoom")}</h3>
              <button
                type="button"
                onClick={() => !updating && setEditModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
                aria-label={t("rooms.cancel")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
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
                  className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500"
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
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-colors ${
                          editIcon === iconKey
                            ? "border-[#4D2FB2] bg-[#4D2FB2]/10 text-[#4D2FB2]"
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
                    className="h-10 w-14 cursor-pointer rounded-lg border border-gray-300 dark:border-white/20"
                  />
                  <input
                    type="text"
                    value={editIconBackgroundColor ?? ""}
                    onChange={(e) => setEditIconBackgroundColor(e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 text-sm"
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
                  className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white"
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
                    className="mt-2 w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500"
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
                        className="h-16 w-24 shrink-0 rounded-lg bg-cover bg-center"
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
                      className="flex h-16 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-white/20 text-gray-500 hover:border-[#4D2FB2] hover:text-[#4D2FB2]"
                    >
                      <ImageIcon className="h-6 w-6" aria-hidden />
                    </label>
                  )}
                </div>
              </div>
              {updateError && (
                <p className="text-sm text-red-600 dark:text-red-400">{updateError}</p>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => !updating && setEditModalOpen(false)}
                  className="rounded-lg border border-gray-300 dark:border-white/20 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  {t("rooms.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={updating || !editName.trim()}
                  className="rounded-lg bg-[#4D2FB2] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
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
