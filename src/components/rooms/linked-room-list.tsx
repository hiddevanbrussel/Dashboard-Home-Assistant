"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cssUrl } from "@/lib/base-path";
import {
  ROOM_ICON_COLOR_DEFAULT,
  iconForeground,
  orderLinkedRooms,
  type RoomAppearance,
} from "@/lib/room-catalog";
import { cn } from "@/lib/utils";
import { CARD_ICONS } from "@/components/widgets/card-icons";
import { useTranslation } from "@/hooks/use-translation";

export type LinkedRoom = RoomAppearance & {
  areaId: string;
  floor?: string | null;
};

export function LinkedRoomList({
  value,
  onChange,
  onAdopt,
}: {
  value?: string;
  onChange: (areaId: string | undefined) => void;
  onAdopt?: (room: RoomAppearance) => void;
}) {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<LinkedRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/room-dashboards")
      .then((response) => response.json())
      .then((list: unknown) => {
        if (!cancelled) setRooms(Array.isArray(list) ? (list as LinkedRoom[]) : []);
      })
      .catch(() => {
        if (!cancelled) setRooms([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-700 dark:text-gray-200">{t("editPanel.loading")}</p>;
  }

  const selected = rooms.find((room) => room.areaId === value);
  const ordered = orderLinkedRooms(rooms, value);
  const missing = Boolean(value && !selected);

  const row = (active: boolean) =>
    cn(
      "flex min-h-12 w-full items-center gap-3 rounded-xl px-2 text-left text-sm font-medium",
      active
        ? "bg-brand/10 text-gray-900 ring-2 ring-brand dark:bg-[#8357be]/25 dark:text-white dark:ring-[#8357be]"
        : "text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50 dark:text-gray-100 dark:ring-white/15 dark:hover:bg-white/5"
    );

  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-gray-900 dark:text-white">
        {t("roomsUi.linkTitle")}
      </p>
      {rooms.length === 0 && !missing ? (
        <p className="text-sm text-gray-700 dark:text-gray-200">{t("editPanel.linkedRoomEmpty")}</p>
      ) : (
        <div className="flex max-h-56 flex-col gap-1.5 overflow-auto p-0.5" role="radiogroup" aria-label={t("roomsUi.linkTitle")}>
          <button
            type="button"
            role="radio"
            aria-checked={!value}
            onClick={() => onChange(undefined)}
            className={row(!value)}
          >
            <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-200">
              <X className="h-4 w-4" aria-hidden />
            </span>
            {t("roomsUi.linkNone")}
          </button>
          {missing && value ? (
            <button type="button" role="radio" aria-checked className={row(true)} onClick={() => onChange(value)}>
              <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-xs font-semibold text-gray-800 dark:bg-white/10 dark:text-gray-100">
                ?
              </span>
              <span className="min-w-0 flex-1 truncate">{value}</span>
            </button>
          ) : null}
          {ordered.map((room) => {
            const Icon = room.icon && room.icon in CARD_ICONS ? CARD_ICONS[room.icon] : CARD_ICONS.Home;
            const active = value === room.areaId;
            const badge = room.iconBackgroundColor || ROOM_ICON_COLOR_DEFAULT;
            return (
              <button
                key={room.areaId}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange(room.areaId)}
                className={row(active)}
              >
                <span
                  className="relative flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-cover bg-center"
                  style={
                    room.background
                      ? { backgroundImage: cssUrl(room.background) }
                      : { backgroundColor: badge, color: iconForeground(badge) }
                  }
                >
                  {!room.background && Icon ? <Icon className="h-5 w-5" /> : null}
                </span>
                <span className="min-w-0 flex-1 truncate">{room.name}</span>
                {room.floor ? (
                  <span className="shrink-0 text-xs font-medium text-gray-700 dark:text-gray-200">
                    {room.floor}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
      {selected && onAdopt ? (
        <button
          type="button"
          onClick={() => onAdopt(selected)}
          className="mt-2 inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-[#4700B5] ring-1 ring-[#4700B5]/40 dark:text-[#ddd6fe] dark:ring-[#c4b5fd]/50"
        >
          {t("roomsUi.adopt").replace("{room}", selected.name)}
        </button>
      ) : null}
      <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-200">{t("editPanel.linkedRoomHint")}</p>
    </div>
  );
}
