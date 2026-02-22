import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/dashboard – Het enige dashboard. Maakt er desnoods één aan als die ontbreekt
 * (bijv. na per ongeluk verwijderen), zodat je niet zonder dashboard komt te zitten.
 */
export async function GET() {
  try {
    let dashboard = await prisma.dashboard.findFirst({
      orderBy: { createdAt: "asc" },
    });
    if (!dashboard) {
      dashboard = await prisma.dashboard.create({
        data: { name: "Home", theme: "auto" },
      });
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
