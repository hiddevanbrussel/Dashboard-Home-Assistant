import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { callService } from "@/lib/ha/rest";
import { assertHaServiceCall } from "@/lib/ha-service-policy";
import { requireApiAuth } from "@/lib/require-api-auth";

/**
 * POST /api/ha/call-service – Call an HA service (e.g. light.toggle, light.turn_on).
 * Body: { entity_id: string, domain?: string, service?: string, service_data?: Record<string, unknown> }
 * service_data is merged with entity_id (e.g. { brightness_pct: 50 } for light.turn_on).
 */
export async function POST(request: Request) {
  const denied = await requireApiAuth(request);
  if (denied) return denied;
  let body: {
    entity_id?: string;
    domain?: string;
    service?: string;
    service_data?: Record<string, unknown>;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const entity_id = body?.entity_id;
  if (!entity_id || typeof entity_id !== "string") {
    return NextResponse.json({ error: "entity_id required" }, { status: 400 });
  }
  const domain = body.domain ?? entity_id.split(".")[0] ?? "light";
  const service = body.service ?? "toggle";
  const allowed = assertHaServiceCall(domain, service);
  if (!allowed.ok) {
    return NextResponse.json({ error: allowed.error }, { status: 400 });
  }
  const serviceData = { ...(body.service_data ?? {}), entity_id };
  const config = await getHaConnection();
  if (!config) {
    return NextResponse.json({ error: "No HA connection" }, { status: 400 });
  }
  const result = await callService(config, domain, service, serviceData);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
