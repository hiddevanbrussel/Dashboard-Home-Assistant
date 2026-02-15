import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type RoomDashboardListItem = {
  areaId: string;
  name: string;
  icon?: string | null;
  createdAt: string;
};

/**
 * GET /api/room-dashboards – List all room dashboards (custom rooms).
 */
export async function GET() {
  const list = await prisma.roomDashboard.findMany({
    orderBy: { updatedAt: "desc" },
    select: { areaId: true, name: true, icon: true, createdAt: true },
  });
  const items: RoomDashboardListItem[] = list.map((r) => ({
    areaId: r.areaId,
    name: r.name ?? r.areaId,
    icon: r.icon ?? null,
    createdAt: r.createdAt.toISOString(),
  }));
  return NextResponse.json(items);
}

/**
 * Slug: lowercase, letters/numbers/hyphens only, 1-64 chars.
 */
function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 64);
}

/**
 * POST /api/room-dashboards – Create a new room.
 * Body: { name: string, id?: string, icon?: string, background?: string } – id, icon, background optional.
 */
export async function POST(request: Request) {
  let body: { name?: string; id?: string; icon?: string; background?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = body.id?.trim()
    ? slugify(body.id)
    : slugify(name);

  if (!slug) {
    return NextResponse.json(
      { error: "Could not generate a valid room ID from name. Use letters, numbers, or hyphens." },
      { status: 400 }
    );
  }

  const existing = await prisma.roomDashboard.findUnique({
    where: { areaId: slug },
  });

  if (existing) {
    return NextResponse.json(
      { error: "A room with this ID already exists" },
      { status: 409 }
    );
  }

  const icon = typeof body.icon === "string" && body.icon.trim() ? body.icon.trim() : null;
  const background = typeof body.background === "string" && body.background.trim() ? body.background.trim() : null;

  let rd;
  try {
    rd = await prisma.roomDashboard.create({
      data: {
        areaId: slug,
        name: name,
        icon: icon,
        background: background,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Database error";
    console.error("[room-dashboards POST]", msg);
    return NextResponse.json(
      {
        error: msg.includes("table")
          ? "Database schema outdated. Run: npx prisma migrate deploy"
          : "Failed to create room",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    areaId: rd.areaId,
    name: rd.name ?? rd.areaId,
    icon: rd.icon ?? null,
    createdAt: rd.createdAt.toISOString(),
  });
}
