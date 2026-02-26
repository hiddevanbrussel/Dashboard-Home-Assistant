import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/energy-dashboard – Get the energy dashboard (singleton). Creates one if none exists.
 */
export async function GET() {
  try {
    let dashboard = await prisma.energyDashboard.findFirst({
      orderBy: { createdAt: "asc" },
    });
    if (!dashboard) {
      dashboard = await prisma.energyDashboard.create({
        data: {},
      });
    }
    return NextResponse.json({
      id: dashboard.id,
      layout: dashboard.layout,
      widgets: dashboard.widgets,
      background: dashboard.background,
      backgroundLight: dashboard.backgroundLight ?? null,
      backgroundDark: dashboard.backgroundDark ?? null,
      welcomeTitle: dashboard.welcomeTitle ?? null,
      welcomeSubtitle: dashboard.welcomeSubtitle ?? null,
      createdAt: dashboard.createdAt.toISOString(),
      updatedAt: dashboard.updatedAt.toISOString(),
    });
  } catch (err) {
    console.error("[GET /api/energy-dashboard]", err);
    const message = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
