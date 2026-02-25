"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { DoorOpen, LayoutDashboard, Music2 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { useMusicAssistantStore, hydrateMusicAssistantStore } from "@/stores/music-assistant-store";

const tabKeys = [
  { href: "/dashboards", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/rooms", labelKey: "nav.rooms", icon: DoorOpen },
] as const;

const musicTab = { href: "/music", labelKey: "nav.music", icon: Music2 } as const;

type TopTabsProps = {
  activeHref?: string;
  className?: string;
  contentLight?: boolean;
};

export function TopTabs({ activeHref, className, contentLight }: TopTabsProps) {
  const { t } = useTranslation();
  const musicAssistantEnabled = useMusicAssistantStore((s) => s.enabled);
  useEffect(() => {
    hydrateMusicAssistantStore();
  }, []);
  const tabs = [...tabKeys, ...(musicAssistantEnabled ? [musicTab] : [])];
  return (
    <nav
      className={cn(
        "flex items-center gap-1 rounded-full px-1 py-1",
        contentLight ? "bg-white/10" : "bg-black/5 dark:bg-white/5",
        className
      )}
      role="tablist"
    >
      {tabs.map(({ href, labelKey, icon: Icon }) => {
        const isActive = activeHref === href;
        return (
          <Link
            key={href}
            href={href}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150",
              contentLight
                ? isActive
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
                : isActive
                  ? "bg-white text-gray-900 shadow-sm dark:bg-white/95 dark:text-gray-900"
                  : "text-gray-600 hover:bg-white/50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {t(labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
