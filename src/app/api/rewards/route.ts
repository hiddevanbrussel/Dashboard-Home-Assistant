import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rewards = await prisma.reward.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(
    rewards.map((r) => ({
      id: r.id,
      title: r.title,
      pointsCost: r.pointsCost,
      icon: r.icon,
      order: r.order,
      createdAt: r.createdAt.toISOString(),
    }))
  );
}

export async function POST(request: Request) {
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
  if (!body.title?.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  try {
    const reward = await prisma.reward.create({
      data: {
        title: body.title.trim(),
        pointsCost: body.pointsCost ?? 10,
        icon: body.icon ?? null,
        order: body.order ?? 0,
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
    console.error("[POST /api/rewards]", err);
    return NextResponse.json({ error: "Failed to create reward" }, { status: 500 });
  }
}
