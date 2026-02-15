"use client";

import { cn } from "@/lib/utils";
import { DoorOpen, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";

const tabKeys = [
  { href: "/dashboards", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/rooms", labelKey: "nav.rooms", icon: DoorOpen },
] as const;

type TopTabsProps = {
  activeHref?: string;
  className?: string;
};

export function TopTabs({ activeHref, className }: TopTabsProps) {
  const { t } = useTranslation();
  return (
    <nav
      className={cn(
        "flex items-center gap-1 rounded-full bg-black/5 px-1 py-1 dark:bg-white/5",
        className
      )}
      role="tablist"
    >
      {tabKeys.map(({ href, labelKey, icon: Icon }) => {
        const isActive = activeHref === href;
        return (
          <Link
            key={href}
            href={href}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150",
              isActive
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
