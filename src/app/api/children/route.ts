import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const children = await prisma.child.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(
    children.map((c) => ({
      id: c.id,
      name: c.name,
      emoji: c.emoji,
      color: c.color,
      order: c.order,
      createdAt: c.createdAt.toISOString(),
    }))
  );
}

export async function POST(request: Request) {
  let body: { name?: string; emoji?: string; color?: string; order?: number } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  try {
    const child = await prisma.child.create({
      data: {
        name: body.name.trim(),
        emoji: body.emoji ?? null,
        color: body.color ?? null,
        order: body.order ?? 0,
      },
    });
    return NextResponse.json({
      id: child.id,
      name: child.name,
      emoji: child.emoji,
      color: child.color,
      order: child.order,
      createdAt: child.createdAt.toISOString(),
    });
  } catch (err) {
    console.error("[POST /api/children]", err);
    return NextResponse.json({ error: "Failed to create child" }, { status: 500 });
  }
}
