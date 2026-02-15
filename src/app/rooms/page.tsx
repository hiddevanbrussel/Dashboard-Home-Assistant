"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { DoorOpen, LayoutGrid, ChevronRight, Plus, Trash2, X } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

type RoomItem = { areaId: string; name: string; createdAt: string };

export default function RoomsPage() {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newId, setNewId] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

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
      const res = await fetch("/api/room-dashboards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          id: newId.trim() || undefined,
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
      loadRooms();
    } catch {
      setCreateError(t("rooms.genericError"));
    } finally {
      setCreating(false);
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((r) => (
              <Link
                key={r.areaId}
                href={`/rooms/${encodeURIComponent(r.areaId)}`}
                className="group relative flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5 transition-colors hover:border-[#4D2FB2]/40 hover:bg-[#4D2FB2]/5 dark:hover:bg-[#4D2FB2]/10"
              >
                <button
                  type="button"
                  onClick={(e) => handleDelete(r.areaId, e)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 opacity-0 transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                  aria-label={t("rooms.delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#4D2FB2]/10 text-[#4D2FB2] dark:bg-[#4D2FB2]/20">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 pr-8">
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-[#4D2FB2]">
                    {r.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {r.areaId}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-[#4D2FB2]" />
              </Link>
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
    </AppShell>
  );
}
