"use client";

import { cn } from "@/lib/utils";
import { Home, Settings } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";

const mainIcons = [
  { href: "/dashboards", icon: Home, labelKey: "nav.home" },
  { href: "/settings", icon: Settings, labelKey: "nav.settings" },
] as const;

type SidebarProps = {
  activeHref?: string;
  className?: string;
};

export function Sidebar({ activeHref, className }: SidebarProps) {
  const { t } = useTranslation();
  return (
    <aside
      className={cn(
        "flex w-14 flex-col items-center gap-2 rounded-full bg-gray-900/90 py-3 dark:bg-black/40",
        className
      )}
      aria-label="Sidebar"
    >
      {mainIcons.map(({ href, icon: Icon, labelKey }) => {
        const isActive = activeHref === href;
        return (
          <Link
            key={href}
            href={href}
            aria-label={t(labelKey)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150",
              isActive
                ? "bg-white text-gray-900"
                : "text-white/80 hover:bg-white/15 hover:text-white"
            )}
          >
            <Icon className="h-5 w-5" />
          </Link>
        );
      })}
    </aside>
  );
}
