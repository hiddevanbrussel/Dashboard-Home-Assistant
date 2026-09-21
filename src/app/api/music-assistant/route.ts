import { NextResponse } from "next/server";
import { callMaServer } from "@/lib/ma-server";

/**
 * Proxy to Music Assistant API (https://www.music-assistant.io/api/).
 * Client sends baseUrl, token, and MA request body so we don't store credentials on the server.
 * POST body: { baseUrl: string, token: string, message_id?: string, command: string, args?: Record<string, unknown>, skipCache?: boolean }
 */
export async function POST(request: Request) {
  let body: {
    baseUrl?: string;
    token?: string;
    command?: string;
    args?: Record<string, unknown>;
    skipCache?: boolean;
    url?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawUrl =
    (typeof body?.baseUrl === "string" && body.baseUrl) ||
    (typeof body.url === "string" && body.url) ||
    "";
  const baseUrl = rawUrl.replace(/\/+$/, "");
  const token = typeof body?.token === "string" ? body.token : "";
  const command = typeof body?.command === "string" ? body.command : "";
  if (!baseUrl || !command) {
    return NextResponse.json({ error: "baseUrl and command required" }, { status: 400 });
  }

  try {
    const data = await callMaServer(baseUrl, token, command, body.args ?? {}, { skipCache: body.skipCache === true });
    return NextResponse.json(data as Record<string, unknown>);
  } catch (err) {
    const status = err && typeof err === "object" && "status" in err ? Number((err as { status?: number }).status) : 0;
    const message = err instanceof Error ? err.message : "Failed to reach Music Assistant";
    let errorMessage = message;
    if (status === 401) {
      errorMessage =
        "Music Assistant returned 401 Unauthorized. Add a valid API token in Settings (from Music Assistant → Settings → User management / API token).";
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: status >= 400 && status < 600 ? status : 502 }
    );
  }
}
