import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/dashboard – Het enige dashboard; geef terug of null als er geen is.
 * Does not create a dashboard (user starts onboarding when none exists).
 */
export async function GET() {
  const dashboard = await prisma.dashboard.findFirst({
    orderBy: { createdAt: "asc" },
  });
  if (!dashboard) {
    return NextResponse.json(null);
  }
  return NextResponse.json({
    id: dashboard.id,
    name: dashboard.name,
    theme: dashboard.theme,
    layout: dashboard.layout,
    widgets: dashboard.widgets,
    background: dashboard.background,
    createdAt: dashboard.createdAt.toISOString(),
    updatedAt: dashboard.updatedAt.toISOString(),
  });
}
