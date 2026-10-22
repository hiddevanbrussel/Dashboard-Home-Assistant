import { NextResponse } from "next/server";
import { boundMusicAssistant } from "@/lib/bound-integration";
import { callMaServer } from "@/lib/ma-server";
import { isAllowedMusicAssistantCommand, musicAssistantCommandForLog } from "@/lib/music-assistant-commands";
import { requireApiAuth } from "@/lib/require-api-auth";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function commandSecrets(record: Record<string, unknown> | null): string[] {
  if (!record) return [];
  const secrets: string[] = [];
  for (const key of ["token", "baseUrl", "url"] as const) {
    const value = record[key];
    if (typeof value === "string" && value.length >= 8) secrets.push(value);
  }
  return secrets;
}

/**
 * Proxy to Music Assistant API (https://www.music-assistant.io/api/).
 * Prefers Docker/env `MUSIC_ASSISTANT_URL` + `MUSIC_ASSISTANT_TOKEN` over client body.
 * POST body: { baseUrl?: string, token?: string, command: string, args?: Record<string, unknown>, skipCache?: boolean }
 * `command` must be an exact allowlist entry. The only config command is config/players/get
 * (player-bar volume preload). Every other config/* command returns 403.
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

  const record = isRecord(body) ? body : null;
  if (!record || !isAllowedMusicAssistantCommand(record.command)) {
    console.warn(
      `[music-assistant] rejected command: ${musicAssistantCommandForLog(record?.command, commandSecrets(record))}`
    );
    return NextResponse.json({ error: "Command not allowed" }, { status: 403 });
  }
  const command = record.command;

  const rawBodyUrl =
    (typeof record.baseUrl === "string" && record.baseUrl) ||
    (typeof record.url === "string" && record.url) ||
    "";
  const bound = await boundMusicAssistant({
    baseUrl: rawBodyUrl,
    token: typeof record.token === "string" ? record.token : null,
  });
  if (!bound.ok) {
    return NextResponse.json({ error: bound.error }, { status: 400 });
  }
  const { baseUrl, secret: token } = bound.target;
  const args = isRecord(record.args) ? record.args : {};

  try {
    const data = await callMaServer(baseUrl, token, command, args, {
      skipCache: record.skipCache === true,
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
