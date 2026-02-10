import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/dashboards/[id] – Get one dashboard.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dashboard = await prisma.dashboard.findUnique({ where: { id } });
  if (!dashboard) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    id: dashboard.id,
    name: dashboard.name,
    theme: dashboard.theme,
    layout: dashboard.layout,
    widgets: dashboard.widgets,
    background: dashboard.background,
    welcomeTitle: dashboard.welcomeTitle ?? null,
    welcomeSubtitle: dashboard.welcomeSubtitle ?? null,
    createdAt: dashboard.createdAt.toISOString(),
    updatedAt: dashboard.updatedAt.toISOString(),
  });
}

/**
 * PUT /api/dashboards/[id] – Update dashboard (name, theme, layout, widgets, background).
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: {
    name?: string;
    theme?: string;
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

  const baseData = {
    ...(body.name != null && { name: body.name }),
    ...(body.theme != null && { theme: body.theme }),
    ...(body.layout !== undefined && { layout: body.layout }),
    ...(body.widgets !== undefined && { widgets: body.widgets }),
    ...(body.background !== undefined && { background: body.background }),
  };
  const welcomeData = {
    ...(body.welcomeTitle !== undefined && { welcomeTitle: body.welcomeTitle }),
    ...(body.welcomeSubtitle !== undefined && { welcomeSubtitle: body.welcomeSubtitle }),
  };

  let dashboard;
  try {
    dashboard = await prisma.dashboard.update({
      where: { id },
      data: { ...baseData, ...welcomeData },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("welcomeTitle") || message.includes("welcomeSubtitle") || message.includes("no such column")) {
      dashboard = await prisma.dashboard.update({
        where: { id },
        data: baseData,
      });
    } else {
      throw err;
    }
  }

  return NextResponse.json({
    id: dashboard.id,
    name: dashboard.name,
    theme: dashboard.theme,
    layout: dashboard.layout,
    widgets: dashboard.widgets,
    background: dashboard.background,
    welcomeTitle: dashboard.welcomeTitle ?? null,
    welcomeSubtitle: dashboard.welcomeSubtitle ?? null,
  });
}

/**
 * DELETE /api/dashboards/[id] – Delete dashboard.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.dashboard.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
