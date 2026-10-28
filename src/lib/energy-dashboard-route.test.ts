import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";
import { GET } from "@/app/api/energy-dashboard/route";
import { PUT } from "@/app/api/energy-dashboard/[id]/route";

type EnergyRecord = {
  id: string;
  layout: string | null;
  widgets: string | null;
  background: string | null;
  backgroundLight: string | null;
  backgroundDark: string | null;
  welcomeTitle: string | null;
  welcomeSubtitle: string | null;
  topDeviceIds: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const auth = vi.hoisted(() => ({ deny: false }));

const memory = vi.hoisted(() => {
  const createdAt = new Date("2026-10-27T08:00:00.000Z");
  const initial = (): EnergyRecord => ({
    id: "ed1",
    layout: "layout-a",
    widgets: "widgets-a",
    background: null,
    backgroundLight: "/uploads/energy-light.png",
    backgroundDark: "/uploads/energy-dark.png",
    welcomeTitle: "Hi",
    welcomeSubtitle: "There",
    topDeviceIds: null,
    createdAt,
    updatedAt: createdAt,
  });
  let record: EnergyRecord | null = initial();
  return {
    findFirst: vi.fn(async () => record),
    create: vi.fn(async () => {
      record = initial();
      record.topDeviceIds = null;
      return record;
    }),
    update: vi.fn(async ({ data }: { data: Partial<EnergyRecord> }) => {
      if (!record) throw new Error("missing energy dashboard");
      record = { ...record, ...data, updatedAt: new Date("2026-10-27T09:00:00.000Z") };
      return record;
    }),
    reset() {
      record = initial();
      this.findFirst.mockClear();
      this.create.mockClear();
      this.update.mockClear();
    },
    set(next: EnergyRecord | null) {
      record = next;
    },
    read() {
      return record;
    },
  };
});

vi.mock("@/lib/require-api-auth", () => ({
  requireApiAuth: vi.fn(async () => {
    if (auth.deny) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return null;
  }),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    energyDashboard: {
      findFirst: memory.findFirst,
      create: memory.create,
      update: memory.update,
    },
  },
}));

function getDashboard() {
  return GET();
}

function putDashboard(body: unknown) {
  return PUT(
    new Request("http://t/api/energy-dashboard/ed1", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ id: "ed1" }) }
  );
}

describe("energy dashboard topDeviceIds", () => {
  beforeEach(() => {
    auth.deny = false;
    memory.reset();
  });

  it("reads a null column as an empty choice and keeps the other fields", async () => {
    const response = await getDashboard();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.topDeviceIds).toEqual([]);
    expect(body.layout).toBe("layout-a");
    expect(body.widgets).toBe("widgets-a");
    expect(body.backgroundLight).toBe("/uploads/energy-light.png");
    expect(body.backgroundDark).toBe("/uploads/energy-dark.png");
    expect(body.welcomeTitle).toBe("Hi");
    expect(body.welcomeSubtitle).toBe("There");
  });

  it("reads broken stored JSON as an empty choice", async () => {
    const current = memory.read();
    if (!current) throw new Error("missing");
    memory.set({ ...current, topDeviceIds: "{" });
    const body = await (await getDashboard()).json();
    expect(body.topDeviceIds).toEqual([]);
    expect(body.layout).toBe("layout-a");
  });

  it("lets a second client read and replace the saved order", async () => {
    const putA = await putDashboard({ topDeviceIds: ["sensor.c", "sensor.a", "sensor.b"] });
    expect(putA.status).toBe(200);
    expect((await putA.json()).topDeviceIds).toEqual(["sensor.c", "sensor.a", "sensor.b"]);

    const getB = await getDashboard();
    expect((await getB.json()).topDeviceIds).toEqual(["sensor.c", "sensor.a", "sensor.b"]);

    const putB = await putDashboard({ topDeviceIds: ["sensor.b", "sensor.c", "sensor.a"] });
    expect(putB.status).toBe(200);
    const getA = await getDashboard();
    expect((await getA.json()).topDeviceIds).toEqual(["sensor.b", "sensor.c", "sensor.a"]);
    expect(memory.read()?.layout).toBe("layout-a");
    expect(memory.read()?.widgets).toBe("widgets-a");
  });

  it("keeps the choice when a later PUT only changes the layout", async () => {
    const saved = await putDashboard({ topDeviceIds: ["sensor.c", "sensor.a"] });
    expect(saved.status).toBe(200);
    const layout = await putDashboard({ layout: "layout-b" });
    expect(layout.status).toBe(200);
    const body = await layout.json();
    expect(body.layout).toBe("layout-b");
    expect(body.topDeviceIds).toEqual(["sensor.c", "sensor.a"]);
    expect(body.widgets).toBe("widgets-a");
    expect(memory.read()?.topDeviceIds).toBe('["sensor.c","sensor.a"]');
  });

  it("returns 400 for more than 5 ids or an invalid id and does not write", async () => {
    await putDashboard({ topDeviceIds: ["sensor.keep"] });
    memory.update.mockClear();
    const tooMany = await putDashboard({
      topDeviceIds: ["sensor.a", "sensor.b", "sensor.c", "sensor.d", "sensor.e", "sensor.f"],
    });
    expect(tooMany.status).toBe(400);
    expect(await tooMany.json()).toEqual({ error: "Invalid topDeviceIds", code: "too_many" });
    const invalid = await putDashboard({ topDeviceIds: ["sensor.ok", "sensor.Nope"] });
    expect(invalid.status).toBe(400);
    expect((await invalid.json()).code).toBe("invalid_id");
    const notArray = await putDashboard({ topDeviceIds: "sensor.a" });
    expect(notArray.status).toBe(400);
    expect((await notArray.json()).code).toBe("not_array");
    expect(memory.update).not.toHaveBeenCalled();
    expect(memory.read()?.topDeviceIds).toBe('["sensor.keep"]');
  });

  it("strips duplicates and stores null when the choice is cleared", async () => {
    const dupes = await putDashboard({ topDeviceIds: ["sensor.c", "sensor.a", "sensor.a", "sensor.b"] });
    expect((await dupes.json()).topDeviceIds).toEqual(["sensor.c", "sensor.a", "sensor.b"]);
    const cleared = await putDashboard({ topDeviceIds: [] });
    expect(cleared.status).toBe(200);
    expect((await cleared.json()).topDeviceIds).toEqual([]);
    expect(memory.read()?.topDeviceIds).toBeNull();
  });

  it("returns 401 without a session and does not touch the dashboard", async () => {
    auth.deny = true;
    const getResponse = await getDashboard();
    const putResponse = await putDashboard({ topDeviceIds: ["sensor.a"] });
    expect(getResponse.status).toBe(401);
    expect(putResponse.status).toBe(401);
    expect(memory.findFirst).not.toHaveBeenCalled();
    expect(memory.update).not.toHaveBeenCalled();
    expect(memory.read()?.topDeviceIds).toBeNull();
  });
});
