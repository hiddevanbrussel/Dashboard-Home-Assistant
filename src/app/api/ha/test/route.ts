import { NextResponse } from "next/server";
import { validateConnectionInput } from "@/lib/validation";
import { testConnection } from "@/lib/ha/rest";
import { requireApiAuth } from "@/lib/require-api-auth";

/**
 * POST /api/ha/test – Test HA connection with baseUrl + token.
 * Body: { baseUrl: string, token: string }. Never returns token to client.
 */
export async function POST(request: Request) {
  const denied = await requireApiAuth(request);
  if (denied) return denied;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const validated = validateConnectionInput(body);
  if (!validated.success) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }
  const result = await testConnection({
    baseUrl: validated.data.baseUrl,
    token: validated.data.token,
  });
  if (result.ok) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
}
