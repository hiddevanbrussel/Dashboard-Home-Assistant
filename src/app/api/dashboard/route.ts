import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/dashboard – The primary dashboard, or `null` when none exists.
 * Does not auto-create: soft onboarding (and /api/dashboards POST) owns first-run creation
 * so add-on / Docker installs still see the wizard (including LAN discovery for Docker).
 */
export async function GET() {
  try {
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
      backgroundLight: dashboard.backgroundLight ?? null,
      backgroundDark: dashboard.backgroundDark ?? null,
      createdAt: dashboard.createdAt.toISOString(),
      updatedAt: dashboard.updatedAt.toISOString(),
    });
  } catch (err) {
    console.error("[GET /api/dashboard]", err);
    const message = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
