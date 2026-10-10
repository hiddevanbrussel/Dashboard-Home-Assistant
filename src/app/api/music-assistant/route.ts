import { NextResponse } from "next/server";
import { resolveMusicAssistantBaseUrl, resolveMusicAssistantToken } from "@/lib/music-assistant-env";
import { callMaServer } from "@/lib/ma-server";

/**
 * Proxy to Music Assistant API (https://www.music-assistant.io/api/).
 * Prefers Docker/env `MUSIC_ASSISTANT_URL` + `MUSIC_ASSISTANT_TOKEN` over client body.
 * POST body: { baseUrl?: string, token?: string, command: string, args?: Record<string, unknown>, skipCache?: boolean }
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

  const rawBodyUrl =
    (typeof body?.baseUrl === "string" && body.baseUrl) ||
    (typeof body.url === "string" && body.url) ||
    "";
  const { baseUrl } = resolveMusicAssistantBaseUrl({
    envUrl: process.env.MUSIC_ASSISTANT_URL,
    bodyUrl: rawBodyUrl,
  });
  const { token } = resolveMusicAssistantToken({
    envToken: process.env.MUSIC_ASSISTANT_TOKEN,
    bodyToken: typeof body?.token === "string" ? body.token : null,
  });
  const command = typeof body?.command === "string" ? body.command : "";
  if (!baseUrl || !command) {
    return NextResponse.json(
      {
        error: !baseUrl
          ? "baseUrl required (set MUSIC_ASSISTANT_URL or enter a URL in Settings)"
          : "baseUrl and command required",
      },
      { status: 400 }
    );
  }

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
