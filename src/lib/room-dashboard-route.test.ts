import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, PUT } from "@/app/api/room-dashboards/[areaId]/route";
import { roomPanelInitialIconColor, toPanelRoom } from "@/components/rooms/room-panel";

const AREA_ID = "qa_woonkamer";
const URL = "http://t/api/room-dashboards/qa_woonkamer";

type RoomRecord = {
  id: string;
  areaId: string;
  name: string | null;
  icon: string | null;
  iconBackgroundColor: string | null;
  floor: string | null;
  layout: string | null;
  widgets: string | null;
  background: string | null;
  welcomeTitle: string | null;
  welcomeSubtitle: string | null;
  temperatureEntityId: string | null;
  humidityEntityId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const memory = vi.hoisted(() => {
  const createdAt = new Date("2026-10-27T08:00:00.000Z");
  const updatedAt = new Date("2026-10-27T08:00:00.000Z");
  const initial = (): RoomRecord => ({
    id: "r1",
    areaId: "qa_woonkamer",
    name: "Woonkamer",
    icon: "rocket",
    iconBackgroundColor: "#123456",
    floor: null,
    layout: null,
    widgets: null,
    background: null,
    welcomeTitle: null,
    welcomeSubtitle: null,
    temperatureEntityId: null,
    humidityEntityId: null,
    createdAt,
    updatedAt,
  });
  let record: RoomRecord | null = initial();
  const findUnique = vi.fn(async () => record);
  const create = vi.fn(async ({ data }: { data: Partial<RoomRecord> & { areaId: string } }) => {
    const now = new Date();
    const created: RoomRecord = {
      id: "r1",
      areaId: data.areaId,
      name: data.name ?? data.areaId,
      icon: data.icon ?? null,
      iconBackgroundColor: data.iconBackgroundColor ?? null,
      floor: data.floor ?? null,
      layout: data.layout ?? null,
      widgets: data.widgets ?? null,
      background: data.background ?? null,
      welcomeTitle: data.welcomeTitle ?? null,
      welcomeSubtitle: data.welcomeSubtitle ?? null,
      temperatureEntityId: data.temperatureEntityId ?? null,
      humidityEntityId: data.humidityEntityId ?? null,
      createdAt: now,
      updatedAt: now,
    };
    record = created;
    return created;
  });
  const upsert = vi.fn(async ({ update }: { update: Partial<RoomRecord> }) => {
    if (!record) throw new Error("upsert without a room record");
    const next: RoomRecord = { ...record, ...update, updatedAt: new Date() };
    record = next;
    return next;
  });
  return {
    findUnique,
    create,
    upsert,
    reset() {
      record = initial();
      findUnique.mockClear();
      create.mockClear();
      upsert.mockClear();
    },
    set(next: RoomRecord | null) {
      record = next;
    },
  };
});

vi.mock("@/lib/require-api-auth", () => ({
  requireApiAuth: vi.fn(async () => null),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    roomDashboard: {
      findUnique: memory.findUnique,
      create: memory.create,
      upsert: memory.upsert,
    },
  },
}));

function roomParams() {
  return { params: Promise.resolve({ areaId: AREA_ID }) };
}

function getRoom() {
  return GET(new Request(URL), roomParams());
}

function putRoom(body: unknown) {
  return PUT(
    new Request(URL, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
    roomParams()
  );
}

function savePayload(room: ReturnType<typeof toPanelRoom>, iconBackgroundColor?: string) {
  const { icon, color } = roomPanelInitialIconColor(room);
  return {
    name: room.name,
    icon,
    iconBackgroundColor: iconBackgroundColor ?? color,
    floor: room.floor,
    background: room.background,
    temperatureEntityId: room.temperatureEntityId,
    humidityEntityId: room.humidityEntityId,
  };
}

describe("room dashboard icon and color", () => {
  beforeEach(() => {
    memory.reset();
  });

  it("returns the stored icon and color", async () => {
    const response = await getRoom();
    expect(response.status).toBe(200);
    const body = (await response.json()) as { icon: string | null; iconBackgroundColor: string | null };
    expect(body.icon).toBe("rocket");
    expect(body.iconBackgroundColor).toBe("#123456");
  });

  it("keeps rocket and #123456 when the panel saves without edits", async () => {
    const first = await getRoom();
    const getJson = (await first.json()) as Parameters<typeof toPanelRoom>[1];
    const room = toPanelRoom(AREA_ID, getJson);
    const { icon, color } = roomPanelInitialIconColor(room);
    const payload = savePayload(room);
    expect(payload).toEqual({
      name: room.name,
      icon,
      iconBackgroundColor: color,
      floor: room.floor,
      background: room.background,
      temperatureEntityId: room.temperatureEntityId,
      humidityEntityId: room.humidityEntityId,
    });

    const put = await putRoom(payload);
    expect(put.status).toBe(200);
    const putJson = (await put.json()) as { icon: string | null; iconBackgroundColor: string | null };
    const update = memory.upsert.mock.calls.at(-1)?.[0].update;

    expect(update?.icon).toBe("rocket");
    expect(update?.iconBackgroundColor).toBe("#123456");
    expect(update?.icon).not.toBe("trees");
    expect(update?.iconBackgroundColor).not.toBe("#4700B5");
    expect(putJson.icon).toBe("rocket");
    expect(putJson.iconBackgroundColor).toBe("#123456");
    expect(putJson.icon).not.toBe("trees");
    expect(putJson.iconBackgroundColor).not.toBe("#4700B5");

    const second = await getRoom();
    const again = (await second.json()) as { icon: string | null; iconBackgroundColor: string | null };
    expect(again.icon).toBe("rocket");
    expect(again.iconBackgroundColor).toBe("#123456");
    expect(again.icon).not.toBe("trees");
    expect(again.iconBackgroundColor).not.toBe("#4700B5");
  });

  it("uses the catalog defaults when the GET body has no icon fields", () => {
    const legacy = {
      id: "r1",
      areaId: AREA_ID,
      name: "Woonkamer",
      floor: null,
      layout: null,
      widgets: null,
      background: null,
      welcomeTitle: null,
      welcomeSubtitle: null,
      temperatureEntityId: null,
      humidityEntityId: null,
    };
    const room = toPanelRoom(AREA_ID, legacy);
    const { icon, color } = roomPanelInitialIconColor(room);
    // dit was #299-B1
    expect({ icon, color }).toEqual({ icon: "trees", color: "#4700B5" });
  });

  it("stores a changed preset color and keeps the icon", async () => {
    const first = await getRoom();
    const room = toPanelRoom(AREA_ID, (await first.json()) as Parameters<typeof toPanelRoom>[1]);
    const payload = savePayload(room, "#0F766E");
    const put = await putRoom(payload);
    expect(put.status).toBe(200);

    const second = await getRoom();
    const again = (await second.json()) as { icon: string | null; iconBackgroundColor: string | null };
    expect(again.icon).toBe("rocket");
    expect(again.iconBackgroundColor).toBe("#0F766E");
  });

  it("returns null icon fields for a new room and the helper falls back", async () => {
    memory.set(null);
    const response = await getRoom();
    expect(response.status).toBe(200);
    expect(memory.create).toHaveBeenCalled();
    const body = (await response.json()) as { icon: string | null; iconBackgroundColor: string | null };
    expect(body.icon).toBeNull();
    expect(body.iconBackgroundColor).toBeNull();
    const room = toPanelRoom(AREA_ID, body);
    expect(roomPanelInitialIconColor(room)).toEqual({ icon: "trees", color: "#4700B5" });
  });

  it("includes every PUT field on GET except the timestamps", async () => {
    const first = await getRoom();
    const getJson = (await first.json()) as Record<string, unknown>;
    const room = toPanelRoom(AREA_ID, getJson);
    const put = await putRoom(savePayload(room));
    const putJson = (await put.json()) as Record<string, unknown>;
    const putKeys = Object.keys(putJson).filter((key) => key !== "createdAt" && key !== "updatedAt");
    const getKeys = new Set(Object.keys(getJson));
    for (const key of putKeys) {
      expect(getKeys.has(key)).toBe(true);
    }
  });
});
