import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: { name?: string; emoji?: string | null; color?: string | null; order?: number } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const child = await prisma.child.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.emoji !== undefined && { emoji: body.emoji }),
        ...(body.color !== undefined && { color: body.color }),
        ...(body.order !== undefined && { order: body.order }),
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
    console.error("[PUT /api/children/[id]]", err);
    return NextResponse.json({ error: "Failed to update child" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.$transaction([
      prisma.choreCompletion.deleteMany({ where: { childId: id } }),
      prisma.child.delete({ where: { id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/children/[id]]", err);
    return NextResponse.json({ error: "Failed to delete child" }, { status: 500 });
  }
}
