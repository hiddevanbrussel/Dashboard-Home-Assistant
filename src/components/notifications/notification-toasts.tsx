"use client";

import { useEffect } from "react";
import { RobotVacuum, X, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppNotificationsStore } from "@/stores/app-notifications-store";
import { useTranslation } from "@/hooks/use-translation";

function ToastIcon({ name }: { name?: string | null }) {
  if (name === "RobotVacuum") return <RobotVacuum className="h-5 w-5" aria-hidden />;
  return <Bell className="h-5 w-5" aria-hidden />;
}

export function NotificationToasts() {
  const { t } = useTranslation();
  const items = useAppNotificationsStore((s) => s.items);
  const dismissToast = useAppNotificationsStore((s) => s.dismissToast);
  const dismissItem = useAppNotificationsStore((s) => s.dismissItem);
  const autoMs = useAppNotificationsStore((s) => s.toastAutoDismissMs);

  const visible = items.filter((n) => n.toastVisible && !n.dismissed).slice(0, 3);

  useEffect(() => {
    if (visible.length === 0) return;
    const timers = visible.map((n) =>
      window.setTimeout(() => dismissToast(n.id), autoMs)
    );
    return () => {
      for (const id of timers) window.clearTimeout(id);
    };
  }, [visible.map((n) => n.id).join(","), autoMs, dismissToast]); // eslint-disable-line react-hooks/exhaustive-deps

  if (visible.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-3 z-[200] flex flex-col items-center gap-2 px-3 sm:items-end sm:px-4"
      aria-live="polite"
      aria-relevant="additions"
    >
      {visible.map((n) => (
        <div
          key={n.id}
          role="status"
          className={cn(
            "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-white/60 bg-white/95 p-3 shadow-lg backdrop-blur-md",
            "dark:border-white/10 dark:bg-black/80",
            "animate-in fade-in slide-in-from-top-2 duration-200"
          )}
        >
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand dark:bg-brand/25 dark:text-white">
            <ToastIcon name={n.icon} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{n.title}</p>
            {n.message ? (
              <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">{n.message}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => dismissItem(n.id)}
            className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-black/5 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200"
            aria-label={t("notifications.dismiss")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
