"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HaPersistentNotification } from "@/lib/ha/persistent-notifications";
import {
  parsePersistentNotificationSnapshot,
  shouldApplyPersistentNotificationSnapshot,
} from "@/lib/ha/persistent-notifications";

const RETRY_MS = 5000;

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true }
    );
  });
}

/**
 * Live HA persistent notifications. The server holds the websocket
 * subscription; this hook long-polls it and aborts that request on unmount
 * so the server can close the Home Assistant socket.
 */
export function useHaPersistentNotifications(): {
  notifications: HaPersistentNotification[];
  dismiss: (ids: string[]) => Promise<void>;
} {
  const [notifications, setNotifications] = useState<HaPersistentNotification[]>([]);
  const seen = useRef<{ sessionId: string | null; version: number }>({
    sessionId: null,
    version: -1,
  });

  const applyBody = useCallback((body: unknown) => {
    const snapshot = parsePersistentNotificationSnapshot(body);
    if (!snapshot) return false;
    if (!shouldApplyPersistentNotificationSnapshot(seen.current, snapshot)) return false;
    seen.current = { sessionId: snapshot.sessionId, version: snapshot.version };
    setNotifications(snapshot.notifications);
    return true;
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let stopped = false;

    const loop = async () => {
      while (!stopped) {
        const { sessionId, version } = seen.current;
        const params = new URLSearchParams();
        params.set("since", String(version));
        if (sessionId) params.set("session", sessionId);
        try {
          const res = await fetch(`/api/ha/notifications?${params.toString()}`, {
            signal: controller.signal,
            cache: "no-store",
          });
          if (stopped || controller.signal.aborted) return;
          if (!res.ok) {
            await sleep(RETRY_MS, controller.signal);
            continue;
          }
          const applied = applyBody(await res.json());
          if (!applied) await sleep(RETRY_MS, controller.signal);
        } catch {
          if (stopped || controller.signal.aborted) return;
          await sleep(RETRY_MS, controller.signal);
        }
      }
    };

    void loop();
    return () => {
      stopped = true;
      controller.abort();
    };
  }, [applyBody]);

  const dismiss = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return;
      const res = await fetch("/api/ha/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification_ids: ids }),
        cache: "no-store",
      });
      if (!res.ok) return;
      applyBody(await res.json());
    },
    [applyBody]
  );

  return { notifications, dismiss };
}
