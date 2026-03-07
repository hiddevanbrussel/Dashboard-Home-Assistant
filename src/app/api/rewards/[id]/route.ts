import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: {
    title?: string;
    pointsCost?: number;
    icon?: string | null;
    order?: number;
  } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const reward = await prisma.reward.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.pointsCost !== undefined && { pointsCost: body.pointsCost }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });
    return NextResponse.json({
      id: reward.id,
      title: reward.title,
      pointsCost: reward.pointsCost,
      icon: reward.icon,
      order: reward.order,
      createdAt: reward.createdAt.toISOString(),
    });
  } catch (err) {
    console.error("[PUT /api/rewards/[id]]", err);
    return NextResponse.json({ error: "Failed to update reward" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.$transaction([
      prisma.rewardClaim.deleteMany({ where: { rewardId: id } }),
      prisma.reward.delete({ where: { id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/rewards/[id]]", err);
    return NextResponse.json({ error: "Failed to delete reward" }, { status: 500 });
  }
}
