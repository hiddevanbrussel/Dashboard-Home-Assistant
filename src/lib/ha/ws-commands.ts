/**
 * One Home Assistant websocket: authenticate, send an allowlisted batch, close.
 * Commands run in parallel (all sent after auth, not one after another).
 * Server-side only. The access token is sent on the socket and never logged.
 */

import { haWebSocketUrl } from "./websocket";

export const HA_WS_COMMAND_ALLOWLIST = [
  "energy/get_prefs",
  "energy/info",
  "recorder/statistics_during_period",
  "recorder/list_statistic_ids",
] as const;

export type HaWsCommandType = (typeof HA_WS_COMMAND_ALLOWLIST)[number];

const ALLOWED: ReadonlySet<string> = new Set(HA_WS_COMMAND_ALLOWLIST);

export const HA_WS_COMMAND_TIMEOUT_MS = 15_000;

export type HaWsCommand = { type: HaWsCommandType } & Record<string, unknown>;

export type HaWsCommandInput = { type: string } & Record<string, unknown>;

export type HaWsCommandResult =
  | { success: true; result: unknown }
  | { success: false; error: { code: string; message: string } };

export type HaWsConfig = { baseUrl: string; token: string };

type HaWsFrame = {
  type?: string;
  id?: number;
  success?: boolean;
  result?: unknown;
  message?: string;
  error?: { code?: string; message?: string };
};

function isAllowedCommand(value: { type?: unknown }): value is HaWsCommand {
  return typeof value.type === "string" && ALLOWED.has(value.type);
}

function commandPayload(command: HaWsCommand, id: number): Record<string, unknown> {
  const payload: Record<string, unknown> = { id, type: command.type };
  for (const [key, value] of Object.entries(command)) {
    if (key === "type" || key === "id") continue;
    payload[key] = value;
  }
  return payload;
}

/**
 * Connect, authenticate, send every command, return results in request order, close.
 * Any type outside the fixed allowlist throws before a socket is opened.
 * `energy/save_prefs` and every other write command are rejected here.
 */
export async function haWsCommands(
  config: HaWsConfig,
  commands: readonly HaWsCommandInput[],
  options?: { timeoutMs?: number }
): Promise<HaWsCommandResult[]> {
  for (const command of commands) {
    if (!isAllowedCommand(command)) {
      const type = typeof command?.type === "string" ? command.type : "unknown";
      throw new Error(`Disallowed websocket command: ${type}`);
    }
  }
  if (commands.length === 0) return [];

  const timeoutMs = options?.timeoutMs ?? HA_WS_COMMAND_TIMEOUT_MS;
  const WebSocketImpl = (await import("ws")).default;
  const ws = new WebSocketImpl(haWebSocketUrl(config.baseUrl));

  return new Promise((resolve, reject) => {
    let settled = false;
    const results: HaWsCommandResult[] = new Array(commands.length);
    let received = 0;

    const timer = setTimeout(() => {
      finish(new Error("WebSocket timeout"));
    }, timeoutMs);

    const finish = (error: Error | null, value?: HaWsCommandResult[]) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        ws.close();
      } catch {
        // The socket is already closing.
      }
      if (error) reject(error);
      else resolve(value ?? []);
    };

    const fail = (error: Error) => finish(error);

    ws.on("message", (raw: Buffer | string) => {
      let frame: HaWsFrame;
      try {
        frame = JSON.parse(raw.toString()) as HaWsFrame;
      } catch {
        return;
      }
      if (frame.type === "auth_required") {
        ws.send(JSON.stringify({ type: "auth", access_token: config.token }));
        return;
      }
      if (frame.type === "auth_invalid") {
        const detail = typeof frame.message === "string" ? frame.message : "";
        fail(new Error(detail.includes(config.token) ? "WebSocket auth failed" : detail || "WebSocket auth failed"));
        return;
      }
      if (frame.type === "auth_ok") {
        for (let index = 0; index < commands.length; index += 1) {
          const command = commands[index];
          if (!isAllowedCommand(command)) continue;
          ws.send(JSON.stringify(commandPayload(command, index + 1)));
        }
        return;
      }
      if (frame.type === "result" && typeof frame.id === "number") {
        const index = frame.id - 1;
        if (index < 0 || index >= commands.length || results[index]) return;
        if (frame.success) {
          results[index] = { success: true, result: frame.result };
        } else {
          const code = typeof frame.error?.code === "string" ? frame.error.code : "error";
          const message = typeof frame.error?.message === "string" ? frame.error.message : "Command failed";
          results[index] = {
            success: false,
            error: {
              code,
              message: message.includes(config.token) ? "Command failed" : message,
            },
          };
        }
        received += 1;
        if (received === commands.length) finish(null, results);
      }
    });

    ws.on("error", (error: Error) => {
      const message = error instanceof Error ? error.message : "WebSocket error";
      fail(new Error(message.includes(config.token) ? "WebSocket error" : message));
    });

    ws.on("close", () => {
      if (!settled) fail(new Error("WebSocket closed"));
    });
  });
}
