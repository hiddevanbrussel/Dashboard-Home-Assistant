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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: {
    title?: string;
    points?: number;
    frequency?: string;
    icon?: string | null;
    order?: number;
    childIds?: string[] | null;
  } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const chore = await prisma.chore.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.points !== undefined && { points: body.points }),
        ...(body.frequency !== undefined && { frequency: body.frequency }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.childIds !== undefined && {
          childIds: body.childIds != null ? JSON.stringify(body.childIds) : null,
        }),
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
      createdAt: chore.createdAt.toISOString(),
    });
  } catch (err) {
    console.error("[PUT /api/chores/[id]]", err);
    return NextResponse.json({ error: "Failed to update chore" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.$transaction([
      prisma.choreCompletion.deleteMany({ where: { choreId: id } }),
      prisma.chore.delete({ where: { id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/chores/[id]]", err);
    return NextResponse.json({ error: "Failed to delete chore" }, { status: 500 });
  }
}
