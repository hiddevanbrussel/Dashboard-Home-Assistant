"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  DoorOpen,
  Home,
  ListTodo,
  Moon,
  Music2,
  Settings,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { useMusicAssistantStore, hydrateMusicAssistantStore } from "@/stores/music-assistant-store";
import { useCalendarStore, hydrateCalendarStore } from "@/stores/calendar-store";
import { useChoresStore, hydrateChoresStore } from "@/stores/chores-store";
import { useThemeStore } from "@/stores/theme-store";

/** Space reserved on the left for the floating icon rail. */
export const SIDEBAR_INSET = "5.5rem";

const coreItems = [
  { href: "/dashboards", icon: Home, labelKey: "nav.home" },
  { href: "/rooms", icon: DoorOpen, labelKey: "nav.rooms" },
] as const;

const optionalItems = [
  { href: "/calendar", icon: CalendarDays, labelKey: "nav.calendar", flag: "calendar" },
  { href: "/family", icon: ListTodo, labelKey: "nav.family", flag: "family" },
  { href: "/music", icon: Music2, labelKey: "nav.music", flag: "music" },
] as const;

function navButtonClass(isActive: boolean) {
  return cn(
    "relative z-[1] flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150",
    isActive
      ? "bg-brand text-white shadow-sm dark:bg-white dark:text-brand"
      : "text-gray-700 hover:bg-white/55 hover:text-gray-900 dark:text-white/85 dark:hover:bg-white/15 dark:hover:text-white"
  );
}

function ThemeIconButton() {
  const { t } = useTranslation();
  const mode = useThemeStore((s) => s.mode);
  const resolved = useThemeStore((s) => s.resolved);
  const setMode = useThemeStore((s) => s.setMode);
  const effective = mode === "auto" ? resolved : mode;
  const isLight = effective === "light";

  return (
    <button
      type="button"
      onClick={() => setMode(isLight ? "dark" : "light")}
      aria-label={isLight ? t("nav.themeDark") : t("nav.themeLight")}
      title={isLight ? t("nav.themeDark") : t("nav.themeLight")}
      className={navButtonClass(false)}
    >
      {isLight ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}

type SidebarProps = {
  activeHref?: string;
  className?: string;
};

export function Sidebar({ activeHref, className }: SidebarProps) {
  const { t } = useTranslation();
  const musicAssistantEnabled = useMusicAssistantStore((s) => s.enabled);
  const calendarEnabled = useCalendarStore((s) => s.enabled);
  const choresEnabled = useChoresStore((s) => s.enabled);

  useEffect(() => {
    hydrateMusicAssistantStore();
    hydrateCalendarStore();
    hydrateChoresStore();
  }, []);

  const extra = optionalItems.filter((item) => {
    if (item.flag === "calendar") return calendarEnabled;
    if (item.flag === "family") return choresEnabled;
    if (item.flag === "music") return musicAssistantEnabled;
    return false;
  });

  return (
    <aside
      data-app-sidebar
      className={cn(
        "sidebar-glass relative flex w-14 flex-col items-center gap-1 rounded-full py-3 [touch-action:none] [-webkit-user-drag:none]",
        className
      )}
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
            title={t(labelKey)}
            className={cn(navButtonClass(isActive), "[-webkit-user-drag:none]")}
          >
            <Icon className="h-5 w-5" />
          </Link>
        );
      })}
      <span className="relative z-[1] my-1 h-px w-6 bg-black/10 dark:bg-white/25" aria-hidden />
      <ThemeIconButton />
      <Link
        href="/settings"
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
        aria-label={t("nav.settings")}
        title={t("nav.settings")}
        className={cn(navButtonClass(activeHref === "/settings"), "[-webkit-user-drag:none]")}
      >
        <Settings className="h-5 w-5" />
      </Link>
    </aside>
  );
}
