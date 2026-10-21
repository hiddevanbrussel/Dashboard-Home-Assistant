"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Bell, RobotVacuum, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppNotificationsStore } from "@/stores/app-notifications-store";
import { useHaPersistentNotifications } from "@/hooks/use-ha-notifications";
import { useTranslation } from "@/hooks/use-translation";

function AppIcon({ name }: { name?: string | null }) {
  if (name === "RobotVacuum") return <RobotVacuum className="h-4 w-4 shrink-0" aria-hidden />;
  return <Bell className="h-4 w-4 shrink-0" aria-hidden />;
}

/**
 * Notification bell: Home Assistant persistent notifications plus in-app rule notifications.
 * Lives in the sidebar utilities rail (beside settings); optional header styling kept for previews.
 */
export function HeaderNotifications({
  contentLight,
  placement = "header",
  buttonClassName,
}: {
  contentLight?: boolean;
  /** Sidebar opens the panel to the right of the rail. */
  placement?: "header" | "sidebar";
  /** Override trigger button classes (e.g. sidebar nav pill). */
  buttonClassName?: string;
} = {}) {
  const { t } = useTranslation();
  const appItems = useAppNotificationsStore((s) => s.items);
  const dismissAppItem = useAppNotificationsStore((s) => s.dismissItem);
  const dismissAllApp = useAppNotificationsStore((s) => s.dismissAll);
  const { notifications: haNotifications, dismiss: dismissHaNotifications } = useHaPersistentNotifications();
  const [open, setOpen] = useState(false);
  const [dismissingIds, setDismissingIds] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const appHistory = useMemo(
    () => appItems.filter((n) => !n.dismissed).slice(0, 20),
    [appItems]
  );

  const count = haNotifications.length + appHistory.length;

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
    setDismissingIds([notificationId]);
    try {
      await dismissHaNotifications([notificationId]);
    } catch {
      // Subscription reconciles on the next poll.
    } finally {
      setDismissingIds([]);
    }
  }

  async function dismissAll() {
    dismissAllApp();
    const ids = haNotifications.map((item) => item.notification_id);
    if (ids.length === 0) return;
    setDismissingIds(ids);
    try {
      await dismissHaNotifications(ids);
    } catch {
      // Subscription reconciles on the next poll.
    } finally {
      setDismissingIds([]);
    }
  }

  return (
    <div className="relative flex items-center" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          buttonClassName ??
            cn(
              "relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4700B5]",
              contentLight
                ? "text-white/90 hover:bg-white/10"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
            )
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
        <div
          className={cn(
            "z-[100] flex max-h-[70vh] w-[320px] flex-col rounded-xl border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-black/50 dark:backdrop-blur-xl",
            placement === "sidebar"
              ? "absolute bottom-0 left-full ml-2"
              : "absolute right-0 top-full mt-1"
          )}
        >
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
                  const title = n.title || t("notifications.item");
                  const message = n.message || "";
                  const isDismissing = dismissingIds.includes(n.notification_id);
                  return (
                    <li
                      key={n.notification_id}
                      className="border-b border-gray-100 last:border-0 dark:border-white/5"
                    >
                      <div className="flex flex-col gap-1 px-4 py-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-white">
                            {title}
                          </p>
                          <button
                            type="button"
                            onClick={() => void dismissHa(n.notification_id)}
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
