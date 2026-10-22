import { readFileSync } from "node:fs";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { RoomTileView } from "@/components/rooms/room-tile";
import { getTranslations } from "@/lib/i18n";
import {
  ROOM_ICON_COLORS,
  ROOM_PHOTO_SCRIM_TEXT_ALPHA,
  compositeOnWhite,
  contrastRatio,
  countRoomCardLinks,
  groupRoomsByFloor,
  iconForeground,
  orderLinkedRooms,
  reduceRoomCardLink,
  roomCardLinkCounts,
  roomColorOptions,
  sameRoomColor,
} from "@/lib/room-catalog";
import { formatClimateValue, readClimateNumber } from "@/lib/room-climate";
import {
  clearRoomDeleteHandoff,
  readRoomDeleteHandoff,
  stepRoomList,
  visibleRooms,
  writeRoomDeleteHandoff,
  type RoomListState,
} from "@/lib/room-removal";
import { UNDO_TOAST_DURATION_MS } from "@/components/undo-toast";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: ReactNode;
    className?: string;
  }) => createElement("a", { href, className }, children),
}));

type Room = { areaId: string; name: string; floor?: string | null };

function state(rooms: Room[], pending: Room | null = null, deleting: string[] = []): RoomListState<Room> {
  return { rooms, pending, deleting };
}

describe("room climate", () => {
  it("reads sensor numbers and ignores HVAC modes and other entities", () => {
    expect(readClimateNumber({ state: "21.5", attributes: {} }, "temperature", "sensor.temp")).toBe(21.5);
    expect(readClimateNumber({ state: "48", attributes: {} }, "humidity", "sensor.hum")).toBe(48);
    expect(readClimateNumber({ state: "21,5", attributes: {} }, "temperature", "sensor.temp")).toBe(21.5);
    expect(
      readClimateNumber(
        { state: "heat", attributes: { current_temperature: 19.2, current_humidity: 40 } },
        "temperature",
        "climate.woonkamer"
      )
    ).toBe(19.2);
    expect(
      readClimateNumber(
        { state: "heat", attributes: { current_temperature: 19.2, current_humidity: 40 } },
        "humidity",
        "climate.woonkamer"
      )
    ).toBe(40);
    expect(readClimateNumber({ state: "unavailable", attributes: {} }, "temperature", "sensor.temp")).toBeNull();
    expect(readClimateNumber({ state: "on", attributes: {} }, "temperature", "light.lamp")).toBeNull();
    expect(formatClimateValue(21, "temperature")).toBe("21°");
    expect(formatClimateValue(21.04, "temperature")).toBe("21°");
    expect(formatClimateValue(21.46, "temperature")).toBe("21.5°");
    expect(formatClimateValue(48.2, "humidity")).toBe("48%");
  });
});

describe("room colors", () => {
  it("keeps every preset readable with a white icon and leaves other colors untouched", () => {
    for (const color of ROOM_ICON_COLORS) {
      expect(contrastRatio("#ffffff", color), color).toBeGreaterThanOrEqual(4.5);
      expect(iconForeground(color)).toBe("#ffffff");
    }
    expect(iconForeground("#F59E0B")).toBe("#111827");
    expect(iconForeground("#3B82F6")).toBe("#111827");
    const legacy = "#F59E0B";
    const options = roomColorOptions(legacy);
    expect(options[0]).toBe(legacy);
    expect(options).toHaveLength(ROOM_ICON_COLORS.length + 1);
    expect(roomColorOptions("#4700b5")).toEqual([...ROOM_ICON_COLORS]);
    expect(sameRoomColor("#4700b5", "#4700B5")).toBe(true);
    expect(contrastRatio("#ffffff", compositeOnWhite(ROOM_PHOTO_SCRIM_TEXT_ALPHA))).toBeGreaterThanOrEqual(6);
  });
});

describe("room removal", () => {
  const hal = { areaId: "hal", name: "Hal" };
  const keuken = { areaId: "keuken", name: "Keuken" };

  it("hides a room until undo, and deletes only on commit or the next removal", () => {
    const start = state([hal, keuken]);
    const removed = stepRoomList(start, { type: "remove", room: hal });
    expect(removed.effects).toEqual([]);
    expect(visibleRooms(removed.state).map((room) => room.areaId)).toEqual(["keuken"]);

    const undone = stepRoomList(removed.state, { type: "undo" });
    expect(undone.effects).toEqual([]);
    expect(visibleRooms(undone.state)).toEqual([hal, keuken]);

    const again = stepRoomList(start, { type: "remove", room: hal });
    const committed = stepRoomList(again.state, { type: "commit" });
    expect(committed.effects).toEqual([{ type: "delete", areaId: "hal" }]);
    expect(visibleRooms(committed.state).map((room) => room.areaId)).toEqual(["keuken"]);

    const next = stepRoomList(again.state, { type: "remove", room: keuken });
    expect(next.effects).toEqual([{ type: "delete", areaId: "hal" }]);
    expect(visibleRooms(next.state).map((room) => room.areaId)).toEqual([]);

    const staleLoad = stepRoomList(committed.state, { type: "loaded", rooms: [hal, keuken] });
    expect(visibleRooms(staleLoad.state).map((room) => room.areaId)).toEqual(["keuken"]);

    const settled = stepRoomList(committed.state, { type: "settled", areaId: "hal", rooms: [keuken] });
    expect(visibleRooms(settled.state)).toEqual([keuken]);

    const failed = stepRoomList(committed.state, {
      type: "settled",
      areaId: "hal",
      rooms: [hal, keuken],
    });
    expect(visibleRooms(failed.state)).toEqual([hal, keuken]);
  });

  it("round-trips a delete handoff without keeping it after clear", () => {
    const storage = new Map<string, string>();
    const memory = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
    };
    writeRoomDeleteHandoff(memory, { areaId: "hal", name: "Hal", commitAt: 50 });
    expect(readRoomDeleteHandoff(memory)).toEqual({ areaId: "hal", name: "Hal", commitAt: 50 });
    clearRoomDeleteHandoff(memory);
    expect(readRoomDeleteHandoff(memory)).toBeNull();
    memory.setItem("rooms.pending-delete", "{");
    expect(readRoomDeleteHandoff(memory)).toBeNull();
  });
});

describe("linking a dashboard tile", () => {
  const form = {
    title: "Oud",
    icon: "Home",
    icon_background_color: "#111111",
    background_image: "/old.jpg",
    area_id: "",
  };
  const room = {
    name: "Woonkamer",
    icon: "trees",
    iconBackgroundColor: "#F59E0B",
    background: "/woonkamer.jpg",
  };

  it("selects a room without copying its name, icon or photo", () => {
    const selected = reduceRoomCardLink(form, { type: "select", areaId: "woonkamer" });
    expect(selected.area_id).toBe("woonkamer");
    expect(selected.title).toBe("Oud");
    expect(selected.icon).toBe("Home");
    expect(selected.background_image).toBe("/old.jpg");
    expect(selected.icon_background_color).toBe("#111111");

    const adopted = reduceRoomCardLink(selected, { type: "adopt", room });
    expect(adopted).toMatchObject({
      area_id: "woonkamer",
      title: "Woonkamer",
      icon: "trees",
      icon_background_color: "#F59E0B",
      background_image: "/woonkamer.jpg",
    });
  });

  it("puts the linked room first and counts cards across payloads", () => {
    const rooms = [
      { areaId: "hal", name: "Hal" },
      { areaId: "woonkamer", name: "Woonkamer" },
    ];
    expect(orderLinkedRooms(rooms, "woonkamer").map((room) => room.areaId)).toEqual(["woonkamer", "hal"]);
    const widgets = JSON.stringify([
      { type: "room_card", area_id: "woonkamer" },
      { type: "light_card", area_id: "woonkamer" },
      { type: "card_group", children: [{ type: "room_card", area_id: "woonkamer" }] },
    ]);
    expect(countRoomCardLinks([widgets, "not-json", null], "woonkamer")).toBe(2);
    expect(roomCardLinkCounts([widgets]).hal).toBeUndefined();
  });
});

describe("room floors", () => {
  it("keeps the fixed order and appends unknown floors", () => {
    const grouped = groupRoomsByFloor([
      { floor: "Zolder", areaId: "z" },
      { floor: "Serre", areaId: "s" },
      { floor: "", areaId: "o" },
      { floor: "Begane grond", areaId: "b" },
    ]);
    expect(grouped.map((group) => group.floor)).toEqual(["Begane grond", "Zolder", "Serre", ""]);
  });
});

describe("rooms copy", () => {
  it("adds Dutch and English keys without changing existing room or editor strings", () => {
    const en = getTranslations("en");
    const nl = getTranslations("nl");
    const keys = Object.keys(en).filter((key) => key.startsWith("roomsUi."));
    expect(keys.length).toBeGreaterThan(20);
    expect(Object.keys(nl).filter((key) => key.startsWith("roomsUi.")).sort()).toEqual([...keys].sort());
    for (const key of keys) {
      expect(en[key], key).toBeTruthy();
      expect(nl[key], key).toBeTruthy();
      expect(en[key]).not.toBe(key);
    }
    expect(nl["roomsUi.editRoomTile"]).toBe("Kamertegel bewerken");
    expect(nl["roomsUi.adopt"]).toBe("Naam, icoon en foto van {room} overnemen");
    expect(nl["roomsUi.deleted"]).toBe("{room} verwijderd");
    expect(en["editPanel.editRoom"]).toBe("Edit room");
    expect(nl["editPanel.editRoom"]).toBe("Kamer bewerken");
    expect(en["editPanel.addTile"]).toBe("Add tile");
    expect(nl["editPanel.addTile"]).toBe("Tegel toevoegen");
    expect(nl["rooms.deleteConfirm"]).toBe("Deze kamer en alle kaarten verwijderen?");
    expect(nl["editPanel.undo"]).toBe("Ongedaan maken");
  });
});

describe("room tile", () => {
  it("shows only temperature and humidity, with a 44px menu in edit mode", () => {
    const editing = renderToStaticMarkup(
      createElement(RoomTileView, {
        room: {
          areaId: "woonkamer",
          name: "Woonkamer",
          icon: "trees",
          iconBackgroundColor: "#F59E0B",
          background: "/uploads/woonkamer.jpg",
          temperatureEntityId: "sensor.woonkamer_temperatuur",
          humidityEntityId: "sensor.woonkamer_vochtigheid",
        },
        temperature: 21.5,
        humidity: 48,
        editMode: true,
        onEdit: () => {},
        onMore: () => {},
      })
    );
    expect(editing).toContain("21.5°");
    expect(editing).toContain("48%");
    expect(editing).toContain("data-room-more=\"woonkamer\"");
    expect(editing).toContain("h-11 w-11");
    expect(editing).not.toContain("opacity-0");
    expect(editing).not.toContain("playing");
    expect(editing).toContain("#111827");

    const linked = renderToStaticMarkup(
      createElement(RoomTileView, {
        room: {
          areaId: "hal",
          name: "Hal",
          temperatureEntityId: "climate.woonkamer",
          humidityEntityId: "climate.woonkamer",
        },
        temperature: readClimateNumber(
          { state: "heat", attributes: { current_temperature: 19.2, current_humidity: 55 } },
          "temperature",
          "climate.woonkamer"
        ),
        humidity: readClimateNumber(
          { state: "heat", attributes: { current_temperature: 19.2, current_humidity: 55 } },
          "humidity",
          "climate.woonkamer"
        ),
        editMode: false,
        onEdit: () => {},
        onMore: () => {},
      })
    );
    expect(linked).toContain("href=\"/rooms/hal\"");
    expect(linked).toContain("19.2°");
    expect(linked).toContain("55%");
    expect(linked).not.toContain("heat");
    expect(linked).not.toContain("data-room-more");
  });
});

describe("rooms page source", () => {
  it("deletes through the shared undo toast and leaves the old preview card alone", () => {
    const page = readFileSync("src/app/rooms/page.tsx", "utf8");
    expect(page).not.toMatch(/confirm\s*\(/);
    expect(page).not.toContain("RoomPreviewCard");
    expect(page).toContain("UndoToast");
    expect(page).toContain("UNDO_TOAST_DURATION_MS");
    expect(UNDO_TOAST_DURATION_MS).toBe(5000);
    const tile = readFileSync("src/components/rooms/room-tile.tsx", "utf8");
    expect(tile).toContain("useEntityStateStore");
    expect(tile).toContain("readClimateNumber");
    expect(tile).not.toMatch(/light_entity|media_player|playing/);
    const widgetsDiffHint = readFileSync("src/components/widgets/room-preview-card.tsx", "utf8");
    expect(widgetsDiffHint).toContain("RoomPreviewCard");
  });
});
