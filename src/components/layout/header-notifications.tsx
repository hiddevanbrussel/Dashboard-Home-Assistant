"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Bell, RobotVacuum, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useAppNotificationsStore } from "@/stores/app-notifications-store";
import { useTranslation } from "@/hooks/use-translation";

type HaNotificationItem = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
};

function getNotificationId(entityId: string): string {
  return entityId.replace(/^persistent_notification\./, "");
}

function AppIcon({ name }: { name?: string | null }) {
  if (name === "RobotVacuum") return <RobotVacuum className="h-4 w-4 shrink-0" aria-hidden />;
  return <Bell className="h-4 w-4 shrink-0" aria-hidden />;
}

/**
 * Header bell: HA persistent_notification.* plus in-app rule notifications.
 */
export function HeaderNotifications({ contentLight }: { contentLight?: boolean } = {}) {
  const { t } = useTranslation();
  const states = useEntityStateStore((s) => s.states);
  const setStates = useEntityStateStore((s) => s.setStates);
  const appItems = useAppNotificationsStore((s) => s.items);
  const dismissAppItem = useAppNotificationsStore((s) => s.dismissItem);
  const dismissAllApp = useAppNotificationsStore((s) => s.dismissAll);
  const [open, setOpen] = useState(false);
  const [dismissingId, setDismissingId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const haNotifications: HaNotificationItem[] = useMemo(
    () =>
      Object.values(states).filter((e) => e.entity_id.startsWith("persistent_notification.")),
    [states]
  );

  const appHistory = useMemo(
    () => appItems.filter((n) => !n.dismissed).slice(0, 20),
    [appItems]
  );

  const count = haNotifications.length + appHistory.length;

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
    return () => {
      cancelled = true;
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

  async function dismissHa(notificationId: string) {
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

  async function dismissAll() {
    dismissAllApp();
    if (haNotifications.length === 0) return;
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
  }

  return (
    <div className="relative flex items-center" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4700B5]",
          contentLight
            ? "text-white/90 hover:bg-white/10"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
        )}
        aria-label={
          count > 0
            ? t("notifications.count").replace("{n}", String(count))
            : t("notifications.title")
        }
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

      {open && (
        <div className="absolute right-0 top-full z-[100] mt-1 flex max-h-[70vh] w-[320px] flex-col rounded-xl border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-black/50 dark:backdrop-blur-xl">
          <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-3 dark:border-white/10">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t("notifications.title")}
            </h3>
            {count > 0 && (
              <button
                type="button"
                onClick={() => void dismissAll()}
                className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {t("notifications.dismissAll")}
              </button>
            )}
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            {count === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                {t("notifications.empty")}
              </p>
            ) : (
              <ul className="py-1">
                {appHistory.map((n) => (
                  <li
                    key={n.id}
                    className="border-b border-gray-100 last:border-0 dark:border-white/5"
                  >
                    <div className="flex flex-col gap-1 px-4 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <AppIcon name={n.icon} />
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                            {n.title}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => dismissAppItem(n.id)}
                          className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10"
                          aria-label={t("notifications.dismiss")}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      {n.message ? (
                        <p className="break-words whitespace-pre-wrap text-xs text-gray-600 dark:text-gray-400">
                          {n.message}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
                {haNotifications.map((n) => {
                  const id = getNotificationId(n.entity_id);
                  const title =
                    (n.attributes?.title as string) || t("notifications.item");
                  const message = (n.attributes?.message as string) || "";
                  const isDismissing = dismissingId === id;
                  return (
                    <li
                      key={n.entity_id}
                      className="border-b border-gray-100 last:border-0 dark:border-white/5"
                    >
                      <div className="flex flex-col gap-1 px-4 py-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-white">
                            {title}
                          </p>
                          <button
                            type="button"
                            onClick={() => void dismissHa(id)}
                            disabled={isDismissing}
                            className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 dark:hover:bg-white/10"
                            aria-label={t("notifications.dismiss")}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        {message ? (
                          <p className="break-words whitespace-pre-wrap text-xs text-gray-600 dark:text-gray-400">
                            {message}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
