import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let body: { rewardId?: string; childId?: string; points?: number; reason?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.childId) {
    return NextResponse.json({ error: "childId is required" }, { status: 400 });
  }

  try {
    // Manual penalty: no rewardId, custom points + optional reason
    if (!body.rewardId) {
      if (!body.points || body.points < 1) {
        return NextResponse.json({ error: "points is required for manual penalties" }, { status: 400 });
      }
      const claim = await prisma.rewardClaim.create({
        data: {
          rewardId: null,
          childId: body.childId,
          pointsSpent: body.points,
          reason: body.reason ?? null,
        },
      });
      return NextResponse.json({
        id: claim.id,
        rewardId: claim.rewardId,
        childId: claim.childId,
        pointsSpent: claim.pointsSpent,
        reason: claim.reason,
        claimedAt: claim.claimedAt.toISOString(),
      });
    }

    // Reward claim
    const reward = await prisma.reward.findUnique({ where: { id: body.rewardId } });
    if (!reward) {
      return NextResponse.json({ error: "Reward not found" }, { status: 404 });
    }

    const claim = await prisma.rewardClaim.create({
      data: {
        rewardId: body.rewardId,
        childId: body.childId,
        pointsSpent: reward.pointsCost,
        reason: null,
      },
    });

    return NextResponse.json({
      id: claim.id,
      rewardId: claim.rewardId,
      childId: claim.childId,
      pointsSpent: claim.pointsSpent,
      reason: claim.reason,
      claimedAt: claim.claimedAt.toISOString(),
    });
  } catch (err) {
    console.error("[POST /api/reward-claims]", err);
    return NextResponse.json({ error: "Failed to create claim" }, { status: 500 });
  }
}
