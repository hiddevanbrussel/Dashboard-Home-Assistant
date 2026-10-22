"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  DoorOpen,
  Home,
  ListTodo,
  Music2,
  Settings,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { hydrateMusicAssistantStore } from "@/stores/music-assistant-store";
import { useMusicNavVisible } from "@/hooks/use-music-nav-visible";
import { useCalendarStore, hydrateCalendarStore } from "@/stores/calendar-store";
import { useChoresStore, hydrateChoresStore } from "@/stores/chores-store";
import { useEnergyStore, hydrateEnergyStore } from "@/stores/energy-store";
import { HeaderNotifications } from "./header-notifications";

/** Space reserved on the left for the floating icon rail. */
export const SIDEBAR_INSET = "5.5rem";

const coreItems = [
  { href: "/dashboards", icon: Home, labelKey: "nav.home" },
  { href: "/rooms", icon: DoorOpen, labelKey: "nav.rooms" },
] as const;

const optionalItems = [
  { href: "/calendar", icon: CalendarDays, labelKey: "nav.calendar", flag: "calendar" },
  { href: "/energy", icon: Zap, labelKey: "nav.energy", flag: "energy" },
  { href: "/family", icon: ListTodo, labelKey: "nav.family", flag: "family" },
  { href: "/music", icon: Music2, labelKey: "nav.music", flag: "music" },
] as const;

/**
 * 44×44 tap zone (Redmi Pad SE, ≥44px). Accent only on the active item:
 * light = brand, dark = brand-muted (same as the settings primary button).
 */
function navButtonClass(isActive: boolean) {
  return cn(
    "sidebar-item relative z-[1] flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-150",
    isActive
      ? "bg-brand text-white dark:bg-brand-muted dark:text-[rgb(var(--brand-on-muted))]"
      : "text-gray-700 hover:bg-gray-900/[0.06] active:bg-gray-900/10 aria-expanded:bg-gray-900/10 dark:text-gray-200 dark:hover:bg-white/[0.08] dark:active:bg-white/[0.12] dark:aria-expanded:bg-white/[0.12]"
  );
}

type SidebarProps = {
  activeHref?: string;
  className?: string;
};

export function Sidebar({ activeHref, className }: SidebarProps) {
  const { t } = useTranslation();
  const showMusic = useMusicNavVisible();
  const calendarEnabled = useCalendarStore((s) => s.enabled);
  const choresEnabled = useChoresStore((s) => s.enabled);
  const energyEnabled = useEnergyStore((s) => s.enabled);

  useEffect(() => {
    hydrateMusicAssistantStore();
    hydrateCalendarStore();
    hydrateChoresStore();
    hydrateEnergyStore();
  }, []);

  const extra = optionalItems.filter((item) => {
    if (item.flag === "calendar") return calendarEnabled;
    if (item.flag === "energy") return energyEnabled;
    if (item.flag === "family") return choresEnabled;
    if (item.flag === "music") return showMusic;
    return false;
  });

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <aside
        data-app-sidebar
        className="sidebar-glass relative flex w-14 flex-col items-center gap-1 rounded-full py-1.5 [touch-action:none] [-webkit-user-drag:none]"
        aria-label={t("nav.sidebar")}
      >
        {[...coreItems, ...extra].map(({ href, icon: Icon, labelKey }) => {
          const isActive = activeHref === href;
          return (
            <Link
              key={href}
              href={href}
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
              aria-label={t(labelKey)}
              aria-current={isActive ? "page" : undefined}
              title={t(labelKey)}
              className={cn(navButtonClass(isActive), "[-webkit-user-drag:none]")}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </aside>
      <aside
        className="sidebar-glass relative flex w-14 flex-col items-center gap-1 rounded-full py-1.5 [touch-action:none] [-webkit-user-drag:none]"
        aria-label={t("nav.utilities")}
      >
        <HeaderNotifications placement="sidebar" buttonClassName={navButtonClass(false)} />
        <Link
          href="/settings"
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          aria-label={t("nav.settings")}
          aria-current={activeHref === "/settings" ? "page" : undefined}
          title={t("nav.settings")}
          className={cn(navButtonClass(activeHref === "/settings"), "[-webkit-user-drag:none]")}
        >
          <Settings className="h-5 w-5" />
        </Link>
      </aside>
    </div>
  );
}
