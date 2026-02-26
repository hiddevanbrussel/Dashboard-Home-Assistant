import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * PUT /api/energy-dashboard/[id] – Update energy dashboard.
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
    ...(body.background !== undefined && { background: body.background }),
    ...(body.backgroundLight !== undefined && { backgroundLight: body.backgroundLight }),
    ...(body.backgroundDark !== undefined && { backgroundDark: body.backgroundDark }),
    ...(body.welcomeTitle !== undefined && { welcomeTitle: body.welcomeTitle }),
    ...(body.welcomeSubtitle !== undefined && { welcomeSubtitle: body.welcomeSubtitle }),
  };

  try {
    const dashboard = await prisma.energyDashboard.update({
      where: { id },
      data,
    });
    return NextResponse.json({
      id: dashboard.id,
      layout: dashboard.layout,
      widgets: dashboard.widgets,
      background: dashboard.background,
      backgroundLight: dashboard.backgroundLight ?? null,
      backgroundDark: dashboard.backgroundDark ?? null,
      welcomeTitle: dashboard.welcomeTitle ?? null,
      welcomeSubtitle: dashboard.welcomeSubtitle ?? null,
    });
  } catch (err) {
    console.error("[PUT /api/energy-dashboard/[id]]", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
