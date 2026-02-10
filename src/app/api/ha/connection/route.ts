import { NextResponse } from "next/server";
import { validateConnectionInput } from "@/lib/validation";
import { encrypt } from "@/lib/encrypt";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/ha/connection – Current connection (baseUrl only, never token).
 */
export async function GET() {
  const conn = await prisma.connection.findFirst({
    orderBy: { createdAt: "desc" },
    select: { baseUrl: true },
  });
  if (!conn) return NextResponse.json({ baseUrl: null });
  return NextResponse.json({ baseUrl: conn.baseUrl });
}

/**
 * POST /api/ha/connection – Save HA connection (single connection; existing is replaced).
 * Body: { baseUrl: string, token: string }. Never return token.
 */
export async function POST(request: Request) {
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
  try {
    await prisma.connection.deleteMany({});
    const encryptedToken = encrypt(validated.data.token);
    const conn = await prisma.connection.create({
      data: {
        baseUrl: validated.data.baseUrl,
        encryptedToken,
      },
    });
    return NextResponse.json({ connectionId: conn.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save connection" },
      { status: 500 }
    );
  }
}
