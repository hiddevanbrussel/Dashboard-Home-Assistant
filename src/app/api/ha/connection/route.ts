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
  const secret = process.env.APP_SECRET;
  if (!secret || secret.length < 16) {
    console.error("[api/ha/connection] APP_SECRET missing or too short");
    return NextResponse.json(
      { error: "Server config: set APP_SECRET in .env (min 16 characters). See .env.example." },
      { status: 500 }
    );
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
    const message = err instanceof Error ? err.message : "Failed to save connection";
    console.error("[api/ha/connection] POST error:", err);
    // APP_SECRET missing or too short is a common cause
    const isConfigError =
      message.includes("APP_SECRET") ||
      (err instanceof Error && message.length > 0 && message.toLowerCase().includes("secret"));
    const clientMessage = isConfigError
      ? "Server config: set APP_SECRET in .env (min 16 characters). See .env.example."
      : message;
    return NextResponse.json({ error: clientMessage }, { status: 500 });
  }
}
