import { NextResponse } from "next/server";

/**
 * GET /api/health – 200 OK for Docker/load balancer health checks.
 */
export async function GET() {
  return NextResponse.json({ status: "ok" }, { status: 200 });
}
