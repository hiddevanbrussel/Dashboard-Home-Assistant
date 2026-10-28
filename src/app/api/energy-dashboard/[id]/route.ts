import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  parseTopDeviceIds,
  sanitizeEnergyDashboardBackgrounds,
  serializeTopDeviceIds,
  usableEnergyBackground,
  validateTopDeviceIds,
} from "@/lib/energy-dashboard";
import { requireApiAuth } from "@/lib/require-api-auth";

/**
 * PUT /api/energy-dashboard/[id] – Update energy dashboard.
 * Accepts intentional `/uploads/` light/dark customs; rejects legacy / bundled / non-upload paths.
 * The shared `background` field is always cleared (never patio/global wallpaper).
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireApiAuth(request);
  if (denied) return denied;
  const { id } = await params;
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const body = raw as {
    layout?: string | null;
    widgets?: string | null;
    background?: string | null;
    backgroundLight?: string | null;
    backgroundDark?: string | null;
    welcomeTitle?: string | null;
    welcomeSubtitle?: string | null;
    topDeviceIds?: unknown;
  };
  const hasTopDeviceIds = Object.prototype.hasOwnProperty.call(body, "topDeviceIds");
  let storedTopDeviceIds: string | null | undefined;
  if (hasTopDeviceIds) {
    const validated = validateTopDeviceIds(body.topDeviceIds);
    if (!validated.ok) {
      return NextResponse.json(
        { error: "Invalid topDeviceIds", code: validated.code },
        { status: 400 }
      );
    }
    storedTopDeviceIds = serializeTopDeviceIds(validated.ids);
  }

  const data = {
    ...(body.layout !== undefined && { layout: body.layout }),
    ...(body.widgets !== undefined && { widgets: body.widgets }),
    // Always null out the deprecated shared field when touched (or when any bg is updated).
    ...((body.background !== undefined ||
      body.backgroundLight !== undefined ||
      body.backgroundDark !== undefined) && { background: null }),
    ...(body.backgroundLight !== undefined && {
      backgroundLight: usableEnergyBackground(body.backgroundLight) ?? null,
    }),
    ...(body.backgroundDark !== undefined && {
      backgroundDark: usableEnergyBackground(body.backgroundDark) ?? null,
    }),
    ...(body.welcomeTitle !== undefined && { welcomeTitle: body.welcomeTitle }),
    ...(body.welcomeSubtitle !== undefined && { welcomeSubtitle: body.welcomeSubtitle }),
    ...(hasTopDeviceIds && { topDeviceIds: storedTopDeviceIds ?? null }),
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
    if (backgrounds.changed) {
      const cleaned = await prisma.energyDashboard.update({
        where: { id },
        data: {
          background: backgrounds.background,
          backgroundLight: backgrounds.backgroundLight,
          backgroundDark: backgrounds.backgroundDark,
        },
      });
      return NextResponse.json({
        id: cleaned.id,
        layout: cleaned.layout,
        widgets: cleaned.widgets,
        background: backgrounds.background,
        backgroundLight: backgrounds.backgroundLight,
        backgroundDark: backgrounds.backgroundDark,
        welcomeTitle: cleaned.welcomeTitle ?? null,
        welcomeSubtitle: cleaned.welcomeSubtitle ?? null,
        topDeviceIds: parseTopDeviceIds(cleaned.topDeviceIds),
      });
    }
    return NextResponse.json({
      id: dashboard.id,
      layout: dashboard.layout,
      widgets: dashboard.widgets,
      background: backgrounds.background,
      backgroundLight: backgrounds.backgroundLight,
      backgroundDark: backgrounds.backgroundDark,
      welcomeTitle: dashboard.welcomeTitle ?? null,
      welcomeSubtitle: dashboard.welcomeSubtitle ?? null,
      topDeviceIds: parseTopDeviceIds(dashboard.topDeviceIds),
    });
  } catch (err) {
    console.error("[PUT /api/energy-dashboard/[id]]", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
