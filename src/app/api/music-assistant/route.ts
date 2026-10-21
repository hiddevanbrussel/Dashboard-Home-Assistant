import { NextResponse } from "next/server";
import { boundMusicAssistant } from "@/lib/bound-integration";
import { callMaServer } from "@/lib/ma-server";
import { requireApiAuth } from "@/lib/require-api-auth";

/**
 * Proxy to Music Assistant API (https://www.music-assistant.io/api/).
 * Prefers Docker/env `MUSIC_ASSISTANT_URL` + `MUSIC_ASSISTANT_TOKEN` over client body.
 * POST body: { baseUrl?: string, token?: string, command: string, args?: Record<string, unknown>, skipCache?: boolean }
 */
export async function POST(request: Request) {
  const denied = await requireApiAuth(request);
  if (denied) return denied;
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

  const rawBodyUrl =
    (typeof body?.baseUrl === "string" && body.baseUrl) ||
    (typeof body.url === "string" && body.url) ||
    "";
  const bound = await boundMusicAssistant({
    baseUrl: rawBodyUrl,
    token: typeof body?.token === "string" ? body.token : null,
  });
  const command = typeof body?.command === "string" ? body.command : "";
  if (!bound.ok || !command) {
    return NextResponse.json(
      { error: bound.ok ? "command required" : bound.error },
      { status: 400 }
    );
  }
  const { baseUrl, secret: token } = bound.target;

  try {
    const data = await callMaServer(baseUrl, token, command, body.args ?? {}, {
      skipCache: body.skipCache === true,
    });
    return NextResponse.json(data as Record<string, unknown>);
  } catch (err) {
    const status = err && typeof err === "object" && "status" in err ? Number((err as { status?: number }).status) : 0;
    const message = err instanceof Error ? err.message : "Failed to reach Music Assistant";
    let errorMessage = message;
    if (status === 401) {
      errorMessage =
        "Music Assistant returned 401 Unauthorized. Set MUSIC_ASSISTANT_TOKEN on the server (Docker / add-on), or add a valid API token in Settings (from Music Assistant → Settings → User management / API token).";
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: status >= 400 && status < 600 ? status : 502 }
    );
  }
}
