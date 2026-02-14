"use client";

import { useEffect, useRef } from "react";
import { useEntityStateStore } from "@/stores/entity-state-store";

const POLL_INTERVAL_MS = 5000;

/**
 * Poll GET /api/ha/state and update entity state store.
 * Call once from a provider or dashboard layout so widgets can read live state.
 * Reageert op requestRefresh() voor directe refresh bij bijv. stat pill dashboards.
 */
export function useEntityStatePolling(connectionId?: string) {
  const setStates = useEntityStateStore((s) => s.setStates);
  const setError = useEntityStateStore((s) => s.setError);
  const refreshRequested = useEntityStateStore((s) => s.refreshRequested);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const url = connectionId
      ? `/api/ha/state?connectionId=${encodeURIComponent(connectionId)}`
      : "/api/ha/state";

    function poll() {
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error("Fetch failed");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) setStates(data);
        })
        .catch(() => setError("No connection"));
    }

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [connectionId, setStates, setError]);

  useEffect(() => {
    if (refreshRequested > 0) {
      const url = connectionId
        ? `/api/ha/state?connectionId=${encodeURIComponent(connectionId)}`
        : "/api/ha/state";
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error("Fetch failed");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) setStates(data);
        })
        .catch(() => setError("No connection"));
    }
  }, [refreshRequested, connectionId, setStates, setError]);
}
