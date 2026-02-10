import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type DashboardListItem = {
  id: string;
  name: string;
  theme: string;
  createdAt: string;
};

/**
 * GET /api/dashboards – List all dashboards.
 */
export async function GET() {
  const list = await prisma.dashboard.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, theme: true, createdAt: true },
  });
  const items: DashboardListItem[] = list.map((d) => ({
    id: d.id,
    name: d.name,
    theme: d.theme,
    createdAt: d.createdAt.toISOString(),
  }));
  return NextResponse.json(items);
}

/**
 * POST /api/dashboards – Create a new dashboard.
 */
export async function POST(request: Request) {
  let body: { name?: string; theme?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const name = body.name ?? "New Dashboard";
  const theme = body.theme ?? "auto";
  const dashboard = await prisma.dashboard.create({
    data: { name, theme },
  });
  return NextResponse.json({
    id: dashboard.id,
    name: dashboard.name,
    theme: dashboard.theme,
    layout: dashboard.layout,
    widgets: dashboard.widgets,
    background: dashboard.background,
  });
}
