"use client";

import Link from "next/link";
import { Droplets, MoreVertical, Thermometer } from "lucide-react";
import { cssUrl } from "@/lib/base-path";
import {
  formatClimateValue,
  readClimateNumber,
  type RoomClimateKind,
} from "@/lib/room-climate";
import { ROOM_ICON_COLOR_DEFAULT, ROOM_PHOTO_SCRIM, iconForeground } from "@/lib/room-catalog";
import { cn } from "@/lib/utils";
import { CARD_ICONS } from "@/components/widgets/card-icons";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";

export type RoomTileRoom = {
  areaId: string;
  name: string;
  icon?: string | null;
  iconBackgroundColor?: string | null;
  background?: string | null;
  temperatureEntityId?: string | null;
  humidityEntityId?: string | null;
};

function useClimateReading(
  entityId: string | null | undefined,
  kind: RoomClimateKind
): number | null {
  return useEntityStateStore((state) =>
    readClimateNumber(entityId ? state.states[entityId] : null, kind, entityId)
  );
}

export function RoomTileView({
  room,
  editMode,
  temperature,
  humidity,
  onEdit,
  onMore,
}: {
  room: RoomTileRoom;
  editMode: boolean;
  temperature: number | null;
  humidity: number | null;
  onEdit: () => void;
  onMore: (anchor: DOMRect) => void;
}) {
  const { t } = useTranslation();
  const Icon =
    room.icon && room.icon in CARD_ICONS ? CARD_ICONS[room.icon] : CARD_ICONS.Home;
  const photo = Boolean(room.background);
  const badge = room.iconBackgroundColor || ROOM_ICON_COLOR_DEFAULT;
  const glyph = iconForeground(badge);
  const shell = cn(
    "relative block h-[176px] w-full overflow-hidden rounded-3xl text-left ring-1 transition-transform active:scale-[0.98]",
    photo ? "ring-black/10 dark:ring-white/10" : "bg-white ring-black/5 dark:bg-[#1b1a21] dark:ring-white/10"
  );

  const body = (
    <>
      {photo ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: cssUrl(room.background ?? "") }}
            aria-hidden
          />
          <div className="absolute inset-0" style={{ background: ROOM_PHOTO_SCRIM }} aria-hidden />
        </>
      ) : null}
      <div className="relative flex h-full flex-col justify-between p-4">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm"
          style={{ backgroundColor: badge, color: glyph }}
          aria-hidden
        >
          {Icon ? <Icon className="h-[22px] w-[22px]" /> : null}
        </span>
        <div className="min-w-0">
          <p
            className={cn(
              "line-clamp-2 text-lg font-semibold leading-snug tracking-tight",
              photo ? "text-white" : "text-gray-900 dark:text-white"
            )}
          >
            {room.name}
          </p>
          {temperature != null || humidity != null ? (
            <p
              className={cn(
                "mt-1 flex items-center gap-3 text-sm font-medium",
                photo ? "text-white" : "text-gray-700 dark:text-gray-200"
              )}
            >
              {temperature != null ? (
                <span className="inline-flex items-center gap-1">
                  <Thermometer className="h-4 w-4" aria-hidden />
                  {formatClimateValue(temperature, "temperature")}
                </span>
              ) : null}
              {humidity != null ? (
                <span className="inline-flex items-center gap-1">
                  <Droplets className="h-4 w-4" aria-hidden />
                  {formatClimateValue(humidity, "humidity")}
                </span>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>
    </>
  );

  return (
    <div className="relative" data-room-tile={room.areaId}>
      {editMode ? (
        <button
          type="button"
          onClick={onEdit}
          className={shell}
          aria-label={`${t("rooms.editRoom")}: ${room.name}`}
        >
          {body}
        </button>
      ) : (
        <Link href={`/rooms/${encodeURIComponent(room.areaId)}`} className={shell}>
          {body}
        </Link>
      )}
      {editMode ? (
        <button
          type="button"
          data-room-more={room.areaId}
          onClick={(event) => onMore(event.currentTarget.getBoundingClientRect())}
          className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-900 shadow-sm ring-1 ring-black/10"
          aria-label={t("roomsUi.more").replace("{room}", room.name)}
        >
          <MoreVertical className="h-5 w-5" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

export function RoomTile({
  room,
  editMode,
  onEdit,
  onMore,
}: {
  room: RoomTileRoom;
  editMode: boolean;
  onEdit: () => void;
  onMore: (anchor: DOMRect) => void;
}) {
  const temperature = useClimateReading(room.temperatureEntityId, "temperature");
  const humidity = useClimateReading(room.humidityEntityId, "humidity");
  return (
    <RoomTileView
      room={room}
      editMode={editMode}
      temperature={temperature}
      humidity={humidity}
      onEdit={onEdit}
      onMore={onMore}
    />
  );
}
