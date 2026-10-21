import { NextResponse } from "next/server";
import { isIntegrationKind, writeIntegration, type IntegrationPayload } from "@/lib/integration-credentials";
import { requireApiAuth } from "@/lib/require-api-auth";

export async function PUT(request: Request) {
  const denied = await requireApiAuth(request);
  if (denied) return denied;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const kind = typeof body.kind === "string" ? body.kind : "";
  if (!isIntegrationKind(kind)) {
    return NextResponse.json({ error: "Unknown integration" }, { status: 400 });
  }
  const patch: IntegrationPayload = {};
  for (const key of ["baseUrl", "apiKey", "token", "username", "password"] as const) {
    if (typeof body[key] === "string") patch[key] = body[key];
  }
  try {
    await writeIntegration(kind, patch);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not store credentials";
    return NextResponse.json({ error: message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
