import { NextResponse } from "next/server";
import { validateConnectionInput } from "@/lib/validation";
import { encrypt } from "@/lib/encrypt";
import { prisma } from "@/lib/prisma";
import { getHaConnection, getHaConnectionStatus } from "@/lib/db";
import { getAddonHaConfig, isSupervisorBaseUrl } from "@/lib/ha/addon";
import { testConnection } from "@/lib/ha/rest";

/**
 * GET /api/ha/connection – Current connection (baseUrl only, never token).
 * When running as a HA app, Supervisor credentials are used automatically.
 * Pass ?test=1 to verify the Supervisor/API link.
 */
export async function GET(request: Request) {
  const status = await getHaConnectionStatus();
  // Touch getHaConnection so addon seed runs
  await getHaConnection();

  const wantTest = new URL(request.url).searchParams.get("test") === "1";
  if (wantTest && status.addon) {
    const addon = getAddonHaConfig();
    if (!addon) {
      return NextResponse.json({
        ...status,
        ok: false,
        error: "Supervisor token missing. Enable Home Assistant API access for this app.",
      });
    }
    const test = await testConnection(addon);
    return NextResponse.json({
      baseUrl: addon.baseUrl,
      source: "supervisor" as const,
      addon: true,
      ok: test.ok === true,
      error: test.ok ? undefined : test.error,
    });
  }

  return NextResponse.json({
    baseUrl: status.baseUrl,
    source: status.source,
    addon: status.addon,
  });
}

/**
 * POST /api/ha/connection – Save HA connection (single connection; existing is replaced).
 * Body: { baseUrl: string, token: string }. Never return token.
 * Body: { useSupervisor: true } — re-link via Supervisor when running as an app.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    body &&
    typeof body === "object" &&
    (body as { useSupervisor?: boolean }).useSupervisor === true
  ) {
    const addon = getAddonHaConfig();
    if (!addon) {
      return NextResponse.json(
        { error: "Not running as a Home Assistant app, or Supervisor token is missing." },
        { status: 400 }
      );
    }
    const test = await testConnection(addon);
    if (!test.ok) {
      return NextResponse.json({ error: test.error }, { status: 400 });
    }
    body = { baseUrl: addon.baseUrl, token: addon.token };
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
    return NextResponse.json({
      connectionId: conn.id,
      baseUrl: validated.data.baseUrl,
      source: isSupervisorBaseUrl(validated.data.baseUrl) ? "supervisor" : "manual",
    });
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
