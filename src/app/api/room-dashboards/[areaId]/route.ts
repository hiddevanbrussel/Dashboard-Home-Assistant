import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ areaId: string }> };

/**
 * GET /api/room-dashboards/[areaId] – Get or create room dashboard for an area.
 */
export async function GET(_request: Request, { params }: RouteParams) {
  const { areaId } = await params;
  if (!areaId) {
    return NextResponse.json({ error: "areaId required" }, { status: 400 });
  }
  const decoded = decodeURIComponent(areaId);
  let rd = await prisma.roomDashboard.findUnique({
    where: { areaId: decoded },
  });
  if (!rd) {
    rd = await prisma.roomDashboard.create({
      data: {
        areaId: decoded,
        name: decoded,
      },
    });
  }
  return NextResponse.json({
    id: rd.id,
    areaId: rd.areaId,
    name: rd.name ?? rd.areaId,
    layout: rd.layout,
    widgets: rd.widgets,
    background: rd.background,
    welcomeTitle: rd.welcomeTitle ?? null,
    welcomeSubtitle: rd.welcomeSubtitle ?? null,
    createdAt: rd.createdAt.toISOString(),
    updatedAt: rd.updatedAt.toISOString(),
  });
}

/**
 * PUT /api/room-dashboards/[areaId] – Update room dashboard.
 */
export async function PUT(request: Request, { params }: RouteParams) {
  const { areaId } = await params;
  if (!areaId) {
    return NextResponse.json({ error: "areaId required" }, { status: 400 });
  }
  const decoded = decodeURIComponent(areaId);
  let body: {
    name?: string | null;
    layout?: string | null;
    widgets?: string | null;
    background?: string | null;
    welcomeTitle?: string | null;
    welcomeSubtitle?: string | null;
  } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data: Record<string, unknown> = {
    ...(body.name !== undefined && { name: body.name }),
    ...(body.layout !== undefined && { layout: body.layout }),
    ...(body.widgets !== undefined && { widgets: body.widgets }),
    ...(body.background !== undefined && { background: body.background }),
    ...(body.welcomeTitle !== undefined && { welcomeTitle: body.welcomeTitle }),
    ...(body.welcomeSubtitle !== undefined && { welcomeSubtitle: body.welcomeSubtitle }),
  };

  const rd = await prisma.roomDashboard.upsert({
    where: { areaId: decoded },
    create: {
      areaId: decoded,
      name: body.name ?? decoded,
      layout: body.layout ?? null,
      widgets: body.widgets ?? null,
      background: body.background ?? null,
      welcomeTitle: body.welcomeTitle ?? null,
      welcomeSubtitle: body.welcomeSubtitle ?? null,
    },
    update: data,
  });

  return NextResponse.json({
    id: rd.id,
    areaId: rd.areaId,
    name: rd.name ?? rd.areaId,
    layout: rd.layout,
    widgets: rd.widgets,
    background: rd.background,
    welcomeTitle: rd.welcomeTitle ?? null,
    welcomeSubtitle: rd.welcomeSubtitle ?? null,
    updatedAt: rd.updatedAt.toISOString(),
  });
}
