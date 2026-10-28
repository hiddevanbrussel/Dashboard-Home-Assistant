import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseTopDeviceIds, sanitizeEnergyDashboardBackgrounds } from "@/lib/energy-dashboard";
import { requireApiAuth } from "@/lib/require-api-auth";

/**
 * GET /api/energy-dashboard – Get the energy dashboard (singleton). Creates one if none exists.
 * Keeps intentional `/uploads/` light/dark customs; clears legacy / bundled / shared wallpaper paths.
 */
export async function GET() {
  const denied = await requireApiAuth();
  if (denied) return denied;
  try {
    let dashboard = await prisma.energyDashboard.findFirst({
      orderBy: { createdAt: "asc" },
    });
    if (!dashboard) {
      dashboard = await prisma.energyDashboard.create({
        data: {},
      });
    }

    const sanitized = sanitizeEnergyDashboardBackgrounds({
      background: dashboard.background,
      backgroundLight: dashboard.backgroundLight,
      backgroundDark: dashboard.backgroundDark,
    });

    if (sanitized.changed) {
      dashboard = await prisma.energyDashboard.update({
        where: { id: dashboard.id },
        data: {
          background: sanitized.background,
          backgroundLight: sanitized.backgroundLight,
          backgroundDark: sanitized.backgroundDark,
        },
      });
    }

    return NextResponse.json({
      id: dashboard.id,
      layout: dashboard.layout,
      widgets: dashboard.widgets,
      background: sanitized.background,
      backgroundLight: sanitized.backgroundLight,
      backgroundDark: sanitized.backgroundDark,
      welcomeTitle: dashboard.welcomeTitle ?? null,
      welcomeSubtitle: dashboard.welcomeSubtitle ?? null,
      topDeviceIds: parseTopDeviceIds(dashboard.topDeviceIds),
      createdAt: dashboard.createdAt.toISOString(),
      updatedAt: dashboard.updatedAt.toISOString(),
    });
  } catch (err) {
    console.error("[GET /api/energy-dashboard]", err);
    const message = err instanceof Error ? err.message : "Database error";
    const hint =
      message.includes("no such table") || message.includes("EnergyDashboard")
        ? "Run: npx prisma migrate deploy"
        : undefined;
    return NextResponse.json(
      { error: message, hint },
      { status: 500 }
    );
  }
}
