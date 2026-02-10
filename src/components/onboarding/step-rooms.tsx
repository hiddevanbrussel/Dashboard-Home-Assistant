"use client";

import { useEffect, useState } from "react";
import { OnboardingFullscreenLayout } from "./onboarding-fullscreen-layout";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { Plus } from "lucide-react";

export function StepRooms() {
  const {
    rooms,
    areas,
    setAreas,
    addRoom,
    removeEntityFromRoom,
    connectionId,
  } = useOnboardingStore();
  const [newRoomName, setNewRoomName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const url = connectionId
      ? `/api/ha/areas?connectionId=${encodeURIComponent(connectionId)}`
      : "/api/ha/areas";
    fetch(url)
      .then((r) => {
        if (!r.ok) return r.json().then((body) => ({ error: body?.error ?? "Failed to load" }));
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        if ("error" in data) {
          setError(data.error);
          return;
        }
        if (Array.isArray(data)) setAreas(data);
      })
      .catch(() => {
        if (!cancelled) setError("Connection failed. Check that Home Assistant is reachable.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [connectionId, setAreas]);

  const importAreasAsRooms = () => {
    const existingNames = new Set(rooms.map((r) => r.name.toLowerCase()));
    areas.forEach((a) => {
      if (a.name && !existingNames.has(a.name.toLowerCase())) {
        addRoom(a.name);
        existingNames.add(a.name.toLowerCase());
      }
    });
  };

  return (
    <OnboardingFullscreenLayout
      step={4}
      title="Fetch rooms"
      subtitle="Import Home Assistant areas as rooms or create rooms manually. You can assign entities to rooms later in the app."
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Rooms: {rooms.length} · {rooms.reduce((acc, r) => acc + r.entityIds.length, 0)} entities assigned
        </p>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="New room name"
            className="rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm flex-1 max-w-xs"
          />
          <button
            type="button"
            onClick={() => {
              if (newRoomName.trim()) {
                addRoom(newRoomName.trim());
                setNewRoomName("");
              }
            }}
            className="rounded-full bg-accent-yellow dark:bg-accent-green p-2 text-gray-900"
            aria-label="Add room"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        {error && (
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 text-sm text-amber-800 dark:text-amber-200">
            {error}
            {(error.includes("onboarding") || error.includes("connection")) && (
              <p className="mt-2 text-xs">
                Go back to step 2, test the connection and click &quot;Save and continue&quot;.
              </p>
            )}
          </div>
        )}
        {loading && <p className="text-sm text-gray-500">Loading rooms/areas…</p>}
        {!loading && !error && areas.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              HA-areas: {areas.map((a) => a.name).join(", ")}
            </p>
            <button
              type="button"
              onClick={importAreasAsRooms}
              className="rounded-full bg-accent-yellow dark:bg-accent-green px-3 py-1.5 text-sm font-medium text-gray-900"
            >
              Import as rooms
            </button>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4"
            >
              <h4 className="font-medium mb-2">{room.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {room.entityIds.length} entities
              </p>
              <ul className="text-sm space-y-1">
                {room.entityIds.slice(0, 5).map((id) => (
                  <li key={id} className="flex justify-between items-center">
                    <span className="truncate">{id}</span>
                    <button
                      type="button"
                      onClick={() => removeEntityFromRoom(room.id, id)}
                      className="text-red-500 text-xs"
                    >
                      Remove
                    </button>
                  </li>
                ))}
                {room.entityIds.length > 5 && (
                  <li className="text-gray-500">
                    +{room.entityIds.length - 5} more
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </OnboardingFullscreenLayout>
  );
}
