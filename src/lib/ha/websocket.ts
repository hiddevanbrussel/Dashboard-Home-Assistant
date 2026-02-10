/**
 * Home Assistant WebSocket client. Server-side only.
 * Connects to /api/websocket, authenticates, subscribes to state_changed.
 */

import type { HaEntity } from "./rest";

export type HaAreaWs = { area_id: string; name: string };

export type HaStateChangedEvent = {
  entity_id: string;
  old_state: HaEntity | null;
  new_state: HaEntity | null;
};

export type HaWsMessage =
  | { type: "auth_required" }
  | { type: "auth_ok" }
  | { type: "auth_invalid"; message?: string }
  | { type: "result"; id: number; success: boolean; result: unknown }
  | { type: "event"; id: number; event: { data: { entity_id: string; old_state: unknown; new_state: unknown } } };

function getWsUrl(baseUrl: string): string {
  const u = baseUrl.trim().replace(/\/+$/, "");
  return u.replace(/^http/, "ws") + "/api/websocket";
}

/**
 * One-shot: connect, auth, send config/area_registry/list, return areas, close.
 */
export async function fetchAreasViaWebSocket(
  baseUrl: string,
  token: string
): Promise<HaAreaWs[]> {
  const WebSocket = (await import("ws")).default;
  const url = getWsUrl(baseUrl);
  const ws = new WebSocket(url);

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error("WebSocket timeout"));
    }, 15000);

    let authenticated = false;
    const listId = 1;

    ws.on("message", (raw: Buffer | string) => {
      let msg: HaWsMessage;
      try {
        msg = JSON.parse(raw.toString()) as HaWsMessage;
      } catch {
        return;
      }
      if (msg.type === "auth_required") {
        ws.send(JSON.stringify({ type: "auth", access_token: token }));
        return;
      }
      if (msg.type === "auth_ok") {
        authenticated = true;
        ws.send(JSON.stringify({ id: listId, type: "config/area_registry/list" }));
        return;
      }
      if (msg.type === "auth_invalid") {
        clearTimeout(timeout);
        ws.close();
        reject(new Error(msg.message ?? "WebSocket auth failed"));
        return;
      }
      if (msg.type === "result" && msg.id === listId) {
        clearTimeout(timeout);
        ws.close();
        const result = msg.result;
        const list = Array.isArray(result)
          ? result.map((a: { area_id?: string; name?: string }) => ({
              area_id: a.area_id ?? "",
              name: a.name ?? "",
            }))
          : [];
        resolve(list);
      }
    });

    ws.on("error", (err: Error) => {
      clearTimeout(timeout);
      reject(err);
    });
    ws.on("close", () => {
      clearTimeout(timeout);
    });
  });
}

/**
 * Create a WebSocket connection to HA, authenticate, and subscribe to state_changed.
 * onEvent is called for each state_changed event. Returns a disconnect function.
 */
export async function connectHaWebSocket(
  baseUrl: string,
  token: string,
  onEvent: (data: HaStateChangedEvent) => void
): Promise<() => void> {
  const WebSocket = (await import("ws")).default;
  const url = getWsUrl(baseUrl);
  const ws = new WebSocket(url);

  let messageId = 1;
  const pending = new Map<number, { resolve: () => void }>();

  return new Promise((resolve, reject) => {
    ws.on("open", () => {});

    ws.on("message", (raw: Buffer | string) => {
      let msg: HaWsMessage;
      try {
        msg = JSON.parse(raw.toString()) as HaWsMessage;
      } catch {
        return;
      }
      if (msg.type === "auth_required") {
        ws.send(JSON.stringify({ type: "auth", access_token: token }));
        return;
      }
      if (msg.type === "auth_ok") {
        ws.send(JSON.stringify({ id: messageId, type: "subscribe_events", event_type: "state_changed" }));
        const id = messageId++;
        pending.set(id, { resolve: () => {} });
        return;
      }
      if (msg.type === "auth_invalid") {
        reject(new Error(msg.message ?? "WebSocket auth failed"));
        return;
      }
      if (msg.type === "result" && msg.id !== undefined) {
        const p = pending.get(msg.id);
        if (p) {
          pending.delete(msg.id);
          p.resolve();
        }
        if (pending.size === 0) {
          resolve(() => ws.close());
        }
        return;
      }
      if (msg.type === "event" && msg.event?.data) {
        const d = msg.event.data;
        onEvent({
          entity_id: d.entity_id,
          old_state: (d.old_state as HaEntity) ?? null,
          new_state: (d.new_state as HaEntity) ?? null,
        });
      }
    });

    ws.on("error", (err: Error) => reject(err));
    ws.on("close", () => {
      pending.forEach((p) => p.resolve());
    });
  });
}
