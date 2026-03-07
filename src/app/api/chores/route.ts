import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseChildIds(raw: string | null): string[] | null {
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const chores = await prisma.chore.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(
    chores.map((c) => ({
      id: c.id,
      title: c.title,
      points: c.points,
      frequency: c.frequency,
      icon: c.icon,
      order: c.order,
      childIds: parseChildIds(c.childIds),
      timesPerDay: c.timesPerDay,
      createdAt: c.createdAt.toISOString(),
    }))
  );
}

export async function POST(request: Request) {
  let body: {
    title?: string;
    points?: number;
    frequency?: string;
    icon?: string;
    order?: number;
    childIds?: string[] | null;
    timesPerDay?: number;
  } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.title?.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (!body.frequency || !["daily", "weekdays", "weekly"].includes(body.frequency)) {
    return NextResponse.json({ error: "frequency must be daily, weekdays, or weekly" }, { status: 400 });
  }
  try {
    const chore = await prisma.chore.create({
      data: {
        title: body.title.trim(),
        points: body.points ?? 1,
        frequency: body.frequency,
        icon: body.icon ?? null,
        order: body.order ?? 0,
        childIds: body.childIds != null ? JSON.stringify(body.childIds) : null,
        timesPerDay: body.timesPerDay ?? 1,
      },
    });
    return NextResponse.json({
      id: chore.id,
      title: chore.title,
      points: chore.points,
      frequency: chore.frequency,
      icon: chore.icon,
      order: chore.order,
      childIds: parseChildIds(chore.childIds),
      timesPerDay: chore.timesPerDay,
      createdAt: chore.createdAt.toISOString(),
    });
  } catch (err) {
    console.error("[POST /api/chores]", err);
    return NextResponse.json({ error: "Failed to create chore" }, { status: 500 });
  }
}
