import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sanitizeEnergyDashboardBackgrounds,
  usableEnergyBackground,
} from "@/lib/energy-dashboard";

/**
 * PUT /api/energy-dashboard/[id] – Update energy dashboard.
 * Rejects all page background URLs (patio / custom / bundled) — energy always uses bundled art.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: {
    layout?: string | null;
    widgets?: string | null;
    background?: string | null;
    backgroundLight?: string | null;
    backgroundDark?: string | null;
    welcomeTitle?: string | null;
    welcomeSubtitle?: string | null;
  } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = {
    ...(body.layout !== undefined && { layout: body.layout }),
    ...(body.widgets !== undefined && { widgets: body.widgets }),
    ...(body.background !== undefined && {
      background: usableEnergyBackground(body.background) ?? null,
    }),
    ...(body.backgroundLight !== undefined && {
      backgroundLight: usableEnergyBackground(body.backgroundLight) ?? null,
    }),
    ...(body.backgroundDark !== undefined && {
      backgroundDark: usableEnergyBackground(body.backgroundDark) ?? null,
    }),
    ...(body.welcomeTitle !== undefined && { welcomeTitle: body.welcomeTitle }),
    ...(body.welcomeSubtitle !== undefined && { welcomeSubtitle: body.welcomeSubtitle }),
  };

  try {
    const dashboard = await prisma.energyDashboard.update({
      where: { id },
      data,
    });
    const backgrounds = sanitizeEnergyDashboardBackgrounds({
      background: dashboard.background,
      backgroundLight: dashboard.backgroundLight,
      backgroundDark: dashboard.backgroundDark,
    });
    return NextResponse.json({
      id: dashboard.id,
      layout: dashboard.layout,
      widgets: dashboard.widgets,
      background: backgrounds.background,
      backgroundLight: backgrounds.backgroundLight,
      backgroundDark: backgrounds.backgroundDark,
      welcomeTitle: dashboard.welcomeTitle ?? null,
      welcomeSubtitle: dashboard.welcomeSubtitle ?? null,
    });
  } catch (err) {
    console.error("[PUT /api/energy-dashboard/[id]]", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
