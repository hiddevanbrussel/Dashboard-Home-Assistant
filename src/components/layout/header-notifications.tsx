"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Bell, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";

type NotificationItem = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
};

function getNotificationId(entityId: string): string {
  return entityId.replace(/^persistent_notification\./, "");
}

export function HeaderNotifications() {
  const states = useEntityStateStore((s) => s.states);
  const setStates = useEntityStateStore((s) => s.setStates);
  const [open, setOpen] = useState(false);
  const [dismissingId, setDismissingId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const notifications: NotificationItem[] = Object.values(states).filter((e) =>
    e.entity_id.startsWith("persistent_notification.")
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/ha/state");
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (Array.isArray(data)) setStates(data);
      } catch {
        // ignore
      }
    })();
    const t = setInterval(async () => {
      if (cancelled) return;
      try {
        const res = await fetch("/api/ha/state");
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (Array.isArray(data)) setStates(data);
      } catch {
        // ignore
      }
    }, 60000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [setStates]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function dismiss(notificationId: string) {
    setDismissingId(notificationId);
    try {
      const res = await fetch("/api/ha/call-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_id: `persistent_notification.${notificationId}`,
          domain: "persistent_notification",
          service: "dismiss",
          service_data: { notification_id: notificationId },
        }),
      });
      if (res.ok) {
        const data = await fetch("/api/ha/state").then((r) => r.json());
        if (Array.isArray(data)) setStates(data);
      }
    } finally {
      setDismissingId(null);
    }
  }

  const count = notifications.length;

  return (
    <div className="relative flex items-center" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D2FB2]"
        aria-label={count > 0 ? `${count} meldingen` : "Meldingen"}
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" aria-hidden />
        {count > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
            aria-hidden
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="absolute right-0 top-full z-[100] mt-1 w-[320px] max-h-[70vh] flex flex-col rounded-xl border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-gray-800">
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 dark:border-white/10 px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Meldingen
              </h3>
              {count > 0 && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await fetch("/api/ha/call-service", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          entity_id: "persistent_notification.dismiss_all",
                          domain: "persistent_notification",
                          service: "dismiss_all",
                          service_data: {},
                        }),
                      });
                      const data = await fetch("/api/ha/state").then((r) => r.json());
                      if (Array.isArray(data)) setStates(data);
                    } catch {
                      // ignore
                    }
                  }}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Alles wissen
                </button>
              )}
            </div>
            <div className="overflow-auto flex-1 min-h-0">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                  Geen meldingen
                </p>
              ) : (
                <ul className="py-1">
                  {notifications.map((n) => {
                    const id = getNotificationId(n.entity_id);
                    const title = (n.attributes?.title as string) || "Melding";
                    const message = (n.attributes?.message as string) || "";
                    const isDismissing = dismissingId === id;
                    return (
                      <li
                        key={n.entity_id}
                        className="border-b border-gray-100 last:border-0 dark:border-white/5"
                      >
                        <div className="px-4 py-3 flex flex-col gap-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-gray-900 dark:text-white text-sm truncate flex-1 min-w-0">
                              {title}
                            </p>
                            <button
                              type="button"
                              onClick={() => dismiss(id)}
                              disabled={isDismissing}
                              className="shrink-0 p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-50"
                              aria-label="Melding sluiten"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          {message && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">
                              {message}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
