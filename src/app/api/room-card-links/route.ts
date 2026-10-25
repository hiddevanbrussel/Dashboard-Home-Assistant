import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiAuth } from "@/lib/require-api-auth";
import { roomCardLinkCounts } from "@/lib/room-catalog";

/**
 * GET /api/room-card-links – how many dashboard tiles open each room.
 * Reads stored widget JSON only. No schema change and no Home Assistant call.
 */
export async function GET(request: Request) {
  const denied = await requireApiAuth(request);
  if (denied) return denied;
  const [dashboards, rooms] = await Promise.all([
    prisma.dashboard.findMany({ select: { widgets: true } }),
    prisma.roomDashboard.findMany({ select: { widgets: true } }),
  ]);
  const counts = roomCardLinkCounts([
    ...dashboards.map((dashboard) => dashboard.widgets),
    ...rooms.map((room) => room.widgets),
  ]);
  return NextResponse.json({ counts });
}
