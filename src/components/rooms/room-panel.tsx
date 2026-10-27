"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, ImagePlus, LayoutGrid, X } from "lucide-react";
import { cssUrl } from "@/lib/base-path";
import {
  ROOM_FLOORS,
  ROOM_ICON_COLOR_DEFAULT,
  ROOM_ICON_OPTIONS,
  iconForeground,
  humanizeIconKey,
  roomColorNameKey,
  roomIconLabelKey,
  roomColorOptions,
  sameRoomColor,
} from "@/lib/room-catalog";
import { cn } from "@/lib/utils";
import { CARD_ICONS } from "@/components/widgets/card-icons";
import { EntitySelectWithSearch, type HaEntity } from "@/components/entity-select-with-search";
import { useTranslation } from "@/hooks/use-translation";
import type { RoomTileRoom } from "./room-tile";

export type PanelRoom = RoomTileRoom & { floor?: string | null };

type KnownRoom = { background?: string | null };

const SENSOR_LABEL =
  "mb-1.5 block text-sm font-medium text-gray-800 dark:text-gray-100";
const SENSOR_INPUT =
  "h-11 min-h-11 rounded-2xl px-4 text-base !placeholder:text-gray-600 dark:!placeholder:text-gray-300";
const SENSOR_SELECT =
  "h-11 min-h-11 w-full rounded-2xl border border-gray-300 bg-white px-3 text-base text-gray-900 dark:border-white/20 dark:bg-[#1b1a21] dark:text-gray-100";

function Section({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
      {children}
      {hint ? <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-200">{hint}</p> : null}
    </div>
  );
}

export function toPanelRoom(
  areaId: string,
  data: {
    name?: unknown;
    icon?: unknown;
    iconBackgroundColor?: unknown;
    floor?: unknown;
    background?: unknown;
    temperatureEntityId?: unknown;
    humidityEntityId?: unknown;
  }
): PanelRoom {
  const text = (value: unknown) => (typeof value === "string" && value.trim() ? value : null);
  return {
    areaId,
    name: text(data.name) ?? areaId,
    icon: text(data.icon),
    iconBackgroundColor: text(data.iconBackgroundColor),
    floor: text(data.floor),
    background: text(data.background),
    temperatureEntityId: text(data.temperatureEntityId),
    humidityEntityId: text(data.humidityEntityId),
  };
}

export function roomPanelInitialIconColor(room?: PanelRoom | null): { icon: string; color: string } {
  return {
    icon: room?.icon || ROOM_ICON_OPTIONS[0],
    color: room?.iconBackgroundColor || ROOM_ICON_COLOR_DEFAULT,
  };
}

export function RoomPanel({
  mode,
  room,
  defaultFloor,
  onClose,
  onSaved,
  onDelete,
}: {
  mode: "add" | "edit";
  room?: PanelRoom | null;
  defaultFloor?: string;
  onClose: () => void;
  onSaved: (floor: string) => void;
  onDelete?: (room: PanelRoom) => void;
}) {
  const { t } = useTranslation();
  const initialFloor = room ? (room.floor ?? "") : (defaultFloor ?? "");
  const presetFloor = ROOM_FLOORS.some((floor) => floor.value === initialFloor);
  const [name, setName] = useState(room?.name ?? "");
  const [icon, setIcon] = useState(roomPanelInitialIconColor(room).icon);
  const [color, setColor] = useState(roomPanelInitialIconColor(room).color);
  const [floor, setFloor] = useState(presetFloor ? initialFloor : initialFloor ? "__other" : "");
  const [customFloor, setCustomFloor] = useState(presetFloor ? "" : initialFloor);
  const [background, setBackground] = useState<string | null>(room?.background ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [temperature, setTemperature] = useState(room?.temperatureEntityId ?? "");
  const [humidity, setHumidity] = useState(room?.humidityEntityId ?? "");
  const [roomId, setRoomId] = useState("");
  const [advanced, setAdvanced] = useState(false);
  const [entities, setEntities] = useState<HaEntity[]>([]);
  const [knownRooms, setKnownRooms] = useState<KnownRoom[]>([]);
  const [linked, setLinked] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const backgroundRef = useRef(background);
  backgroundRef.current = background;

  useEffect(() => {
    return () => {
      const current = backgroundRef.current;
      if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ha/entities")
      .then((response) => response.json())
      .then((data: unknown) => {
        if (!cancelled) setEntities(Array.isArray(data) ? (data as HaEntity[]) : []);
      })
      .catch(() => {
        if (!cancelled) setEntities([]);
      });
    fetch("/api/room-dashboards")
      .then((response) => response.json())
      .then((data: unknown) => {
        if (!cancelled) setKnownRooms(Array.isArray(data) ? (data as KnownRoom[]) : []);
      })
      .catch(() => {
        if (!cancelled) setKnownRooms([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !room?.areaId) return;
    let cancelled = false;
    const areaId = room.areaId;
    fetch("/api/room-card-links")
      .then((response) => response.json())
      .then((data: { counts?: Record<string, number> }) => {
        if (cancelled) return;
        const count = data?.counts?.[areaId];
        setLinked(typeof count === "number" && Number.isFinite(count) ? count : 0);
      })
      .catch(() => {
        if (!cancelled) setLinked(null);
      });
    return () => {
      cancelled = true;
    };
  }, [mode, room?.areaId]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  const backgrounds = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    const add = (value?: string | null) => {
      if (!value || value.startsWith("blob:") || seen.has(value)) return;
      seen.add(value);
      list.push(value);
    };
    add(room?.background);
    for (const known of knownRooms) add(known.background);
    return list.slice(0, 6);
  }, [knownRooms, room?.background]);

  const colors = roomColorOptions(color);
  const icons = useMemo(() => {
    const options: string[] = [...ROOM_ICON_OPTIONS];
    if (icon && !options.includes(icon) && icon in CARD_ICONS) options.unshift(icon);
    return options;
  }, [icon]);

  function chooseBackground(next: string | null) {
    setBackground((current) => {
      if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
      return next;
    });
    setFile(null);
  }

  async function save() {
    if (!name.trim() || (mode === "edit" && !room)) return;
    setSaving(true);
    setError(null);
    try {
      let nextBackground = background;
      if (file) {
        const body = new FormData();
        body.set("file", file);
        const upload = await fetch("/api/upload", { method: "POST", body });
        const uploaded = (await upload.json()) as { url?: string; error?: string };
        if (!upload.ok || !uploaded.url) throw new Error(uploaded.error);
        nextBackground = uploaded.url;
      }
      const floorValue = (floor === "__other" ? customFloor : floor).trim();
      const payload = {
        name: name.trim(),
        icon,
        iconBackgroundColor: color,
        floor: floorValue || null,
        background: nextBackground,
        temperatureEntityId: temperature.trim() || null,
        humidityEntityId: humidity.trim() || null,
      };
      const response =
        mode === "add"
          ? await fetch("/api/room-dashboards", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...payload,
                id: roomId.trim() || undefined,
                floor: floorValue || undefined,
                background: nextBackground || undefined,
                temperatureEntityId: payload.temperatureEntityId || undefined,
                humidityEntityId: payload.humidityEntityId || undefined,
              }),
            })
          : await fetch(`/api/room-dashboards/${encodeURIComponent(room!.areaId)}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(result.error);
      onSaved(floorValue);
    } catch (caught) {
      setError(caught instanceof Error && caught.message ? caught.message : t("rooms.genericError"));
    } finally {
      setSaving(false);
    }
  }

  const chip = (active: boolean) =>
    cn(
      "inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-medium ring-1 transition-colors",
      active
        ? "bg-brand text-white ring-brand dark:bg-[#8357be] dark:ring-[#8357be]"
        : "bg-white text-gray-800 ring-gray-300 dark:bg-white/5 dark:text-gray-100 dark:ring-white/20"
    );

  const linkedText =
    linked == null
      ? null
      : linked === 1
        ? t("roomsUi.linkedOne")
        : linked > 1
          ? t("roomsUi.linkedMany").replace("{n}", String(linked))
          : t("roomsUi.linkedNone");

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[360] bg-black/40"
        aria-hidden
        onClick={() => {
          if (!saving) onClose();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={mode === "add" ? t("rooms.addRoom") : t("rooms.editRoom")}
        data-room-panel={mode}
        className="fixed inset-y-0 right-0 z-[361] flex w-full max-w-[420px] flex-col bg-white shadow-2xl dark:bg-[#1b1a21]"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 pl-5 pr-2 dark:border-white/10">
          <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            {mode === "add" ? t("rooms.addRoom") : t("rooms.editRoom")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full text-gray-800 hover:bg-black/5 dark:text-gray-100 dark:hover:bg-white/10"
            aria-label={t("rooms.cancel")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <Section label={t("rooms.roomName")}>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("rooms.roomNamePlaceholder")}
              autoFocus
              className="h-12 w-full rounded-2xl bg-gray-100 px-4 text-base text-gray-900 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/50 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-300"
            />
          </Section>

          <Section label={t("rooms.floor")}>
            <div className="flex flex-wrap gap-2">
              {ROOM_FLOORS.map((entry) => (
                <button
                  key={entry.value}
                  type="button"
                  onClick={() => setFloor(entry.value)}
                  className={chip(floor === entry.value)}
                  aria-pressed={floor === entry.value}
                >
                  {t(entry.labelKey)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setFloor("__other")}
                className={chip(floor === "__other")}
                aria-pressed={floor === "__other"}
              >
                {t("roomsUi.otherFloor")}
              </button>
            </div>
            {floor === "__other" ? (
              <input
                value={customFloor}
                onChange={(event) => setCustomFloor(event.target.value)}
                placeholder={t("rooms.floorPlaceholder")}
                className="mt-2 h-12 w-full rounded-2xl bg-gray-100 px-4 text-base text-gray-900 placeholder:text-gray-600 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-300"
              />
            ) : null}
          </Section>

          <Section label={t("rooms.background")} hint={t("roomsUi.backgroundHint")}>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => chooseBackground(null)}
                aria-pressed={!background && !file}
                className={cn(
                  "flex min-h-11 aspect-[16/10] items-center justify-center rounded-2xl bg-gray-100 text-sm font-medium text-gray-800 ring-2 dark:bg-white/5 dark:text-gray-100",
                  !background && !file ? "ring-brand dark:ring-[#8357be]" : "ring-transparent"
                )}
              >
                {t("roomsUi.noBackground")}
              </button>
              {backgrounds.map((url) => {
                const selected = background === url && !file;
                return (
                  <button
                    key={url}
                    type="button"
                    onClick={() => chooseBackground(url)}
                    aria-pressed={selected}
                    aria-label={t("roomsUi.pickBackground")}
                    className={cn(
                      "relative min-h-11 aspect-[16/10] overflow-hidden rounded-2xl bg-cover bg-center ring-2",
                      selected ? "ring-brand dark:ring-[#8357be]" : "ring-transparent"
                    )}
                    style={{ backgroundImage: cssUrl(url) }}
                  >
                    {selected ? (
                      <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white dark:bg-[#8357be]">
                        <Check className="h-4 w-4" aria-hidden />
                      </span>
                    ) : null}
                  </button>
                );
              })}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const next = event.target.files?.[0];
                  if (next) {
                    setBackground((current) => {
                      if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
                      return URL.createObjectURL(next);
                    });
                    setFile(next);
                  }
                  event.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex min-h-11 aspect-[16/10] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-gray-500 text-sm font-medium text-gray-800 dark:border-white/40 dark:text-gray-100"
              >
                <ImagePlus className="h-5 w-5" aria-hidden />
                {t("roomsUi.uploadPhoto")}
              </button>
            </div>
          </Section>

          <Section label={t("rooms.icon")}>
            <div className="flex flex-wrap gap-1.5">
              {icons.map((key) => {
                const Icon = CARD_ICONS[key];
                const selected = icon === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIcon(key)}
                    aria-pressed={selected}
                    aria-label={(() => {
                      const labelKey = roomIconLabelKey(key);
                      return labelKey ? t(labelKey) : humanizeIconKey(key);
                    })()}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-2xl ring-1",
                      selected
                        ? "ring-transparent"
                        : "bg-white text-gray-800 ring-gray-300 dark:bg-white/5 dark:text-gray-100 dark:ring-white/20"
                    )}
                    style={
                      selected ? { backgroundColor: color, color: iconForeground(color) } : undefined
                    }
                  >
                    {Icon ? <Icon className="h-5 w-5" /> : null}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section label={t("roomsUi.color")}>
            <div className="flex flex-wrap gap-1.5">
              {colors.map((entry) => {
                const selected = sameRoomColor(color, entry);
                const nameKey = roomColorNameKey(entry);
                return (
                  <button
                    key={entry}
                    type="button"
                    onClick={() => {
                      if (selected) return;
                      setColor(entry);
                    }}
                    aria-pressed={selected}
                    aria-label={nameKey ? t(nameKey) : `${t("roomsUi.currentColor")} ${entry}`}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full",
                      selected && "outline outline-2 outline-offset-2"
                    )}
                    style={{
                      backgroundColor: entry,
                      color: iconForeground(entry),
                      outlineColor: entry,
                    }}
                  >
                    {selected ? <Check className="h-5 w-5" aria-hidden /> : null}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section label={t("roomsUi.sensors")} hint={t("roomsUi.sensorsHint")}>
            <div className="space-y-3">
              <EntitySelectWithSearch
                entities={entities}
                value={temperature}
                onChange={setTemperature}
                label={t("roomsUi.temperature")}
                labelClassName={SENSOR_LABEL}
                inputClassName={SENSOR_INPUT}
                selectClassName={SENSOR_SELECT}
                filter={(entity) =>
                  entity.entity_id.startsWith("sensor.") || entity.entity_id.startsWith("climate.")
                }
                placeholder={t("rooms.entitySearchPlaceholder")}
                emptyOption={t("rooms.entityNone")}
              />
              <EntitySelectWithSearch
                entities={entities}
                value={humidity}
                onChange={setHumidity}
                label={t("roomsUi.humidity")}
                labelClassName={SENSOR_LABEL}
                inputClassName={SENSOR_INPUT}
                selectClassName={SENSOR_SELECT}
                filter={(entity) =>
                  entity.entity_id.startsWith("sensor.") || entity.entity_id.startsWith("climate.")
                }
                placeholder={t("rooms.entitySearchPlaceholder")}
                emptyOption={t("rooms.entityNone")}
              />
            </div>
          </Section>

          {mode === "edit" && linkedText ? (
            <Section label={t("roomsUi.onDashboard")}>
              <div className="flex min-h-12 items-center gap-3 rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-800 dark:bg-white/5 dark:text-gray-100">
                <LayoutGrid className="h-5 w-5 shrink-0 text-gray-700 dark:text-gray-200" aria-hidden />
                <span>{linkedText}</span>
              </div>
            </Section>
          ) : null}

          <div>
            <button
              type="button"
              onClick={() => setAdvanced((open) => !open)}
              aria-expanded={advanced}
              className="flex h-11 w-full items-center justify-between text-sm font-semibold text-gray-900 dark:text-white"
            >
              {t("roomsUi.advanced")}
              <ChevronDown className={cn("h-5 w-5 transition-transform", advanced && "rotate-180")} />
            </button>
            {advanced ? (
              mode === "add" ? (
                <div className="mt-2">
                  <input
                    value={roomId}
                    onChange={(event) => setRoomId(event.target.value)}
                    placeholder={t("rooms.roomIdPlaceholder")}
                    className="h-12 w-full rounded-2xl bg-gray-100 px-4 text-base text-gray-900 placeholder:text-gray-600 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-300"
                  />
                  <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-200">{t("rooms.roomIdHint")}</p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
                  {t("roomsUi.address")}: <span className="font-mono">/rooms/{room?.areaId}</span>
                </p>
              )
            ) : null}
          </div>
          {error ? <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2 border-t border-gray-200 px-5 py-4 dark:border-white/10">
          {mode === "edit" && onDelete && room ? (
            <button
              type="button"
              onClick={() => onDelete(room)}
              className="inline-flex h-11 items-center rounded-full px-3 text-sm font-semibold text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"
            >
              {t("rooms.delete")}
            </button>
          ) : null}
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold text-gray-800 ring-1 ring-gray-300 dark:text-gray-100 dark:ring-white/25"
            >
              {t("rooms.cancel")}
            </button>
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving || !name.trim()}
              className="inline-flex h-11 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white disabled:opacity-50 dark:bg-[#8357be]"
            >
              {saving ? "…" : mode === "add" ? t("rooms.create") : t("rooms.save")}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
