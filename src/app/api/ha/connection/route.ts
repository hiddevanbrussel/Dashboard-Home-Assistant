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
    const hasAny = secret !== undefined && secret !== "" ? "set but too short" : "not set";
    console.error("[api/ha/connection] APP_SECRET", hasAny, "(length:", secret?.length ?? 0, "). Restart dev server after changing .env.");
    return NextResponse.json(
      {
        error:
          "APP_SECRET is " +
          (secret?.length ? "too short (min 16)." : "not loaded. Put .env next to package.json and restart the dev server."),
      },
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
    let clientMessage: string;
    if (message.includes("APP_SECRET") || message.toLowerCase().includes("secret")) {
      clientMessage =
        "APP_SECRET not loaded. Put .env in the same folder as package.json, then restart the dev server (env is read at startup).";
    } else if (
      message.includes("SQLite") ||
      message.includes("database") ||
      message.includes("prisma") ||
      (err as { code?: string })?.code === "P2022"
    ) {
      clientMessage = `Database error: ${message}. Try: npx prisma db push`;
    } else {
      clientMessage = message;
    }
    return NextResponse.json({ error: clientMessage }, { status: 500 });
  }
}
