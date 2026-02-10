"use client";

import { cn } from "@/lib/utils";
import { Home, Settings } from "lucide-react";
import Link from "next/link";

const mainIcons = [
  { href: "/dashboards", icon: Home, label: "Home" },
  { href: "/settings", icon: Settings, label: "Settings" },
] as const;

type SidebarProps = {
  activeHref?: string;
  className?: string;
};

export function Sidebar({ activeHref, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex w-14 flex-col items-center gap-2 rounded-full bg-gray-900/90 py-3 dark:bg-black/40",
        className
      )}
      aria-label="Sidebar"
    >
      {mainIcons.map(({ href, icon: Icon, label }) => {
        const isActive = activeHref === href;
        return (
          <Link
            key={label}
            href={href}
            aria-label={label}
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
