import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let body: { rewardId?: string; childId?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.rewardId || !body.childId) {
    return NextResponse.json({ error: "rewardId and childId are required" }, { status: 400 });
  }

  try {
    const reward = await prisma.reward.findUnique({ where: { id: body.rewardId } });
    if (!reward) {
      return NextResponse.json({ error: "Reward not found" }, { status: 404 });
    }

    const claim = await prisma.rewardClaim.create({
      data: {
        rewardId: body.rewardId,
        childId: body.childId,
        pointsSpent: reward.pointsCost,
      },
    });

    return NextResponse.json({
      id: claim.id,
      rewardId: claim.rewardId,
      childId: claim.childId,
      pointsSpent: claim.pointsSpent,
      claimedAt: claim.claimedAt.toISOString(),
    });
  } catch (err) {
    console.error("[POST /api/reward-claims]", err);
    return NextResponse.json({ error: "Failed to create claim" }, { status: 500 });
  }
}
