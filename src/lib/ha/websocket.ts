/**
 * Home Assistant WebSocket client. Server-side only.
 * Connects to /api/websocket, authenticates, then subscribes.
 */

import type { WebSocket } from "ws";
import type { HaEntity } from "./rest";
import {
  parseHaWsFrame,
  reducePersistentNotificationSocket,
  type PersistentNotificationUpdate,
  type SocketAction,
  type SocketWatch,
} from "./persistent-notifications";

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

/** `http(s)` base URL → `ws(s)://…/api/websocket`. Shared by every auth path. */
export function haWebSocketUrl(baseUrl: string): string {
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
  const url = haWebSocketUrl(baseUrl);
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
  const url = haWebSocketUrl(baseUrl);
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

export type PersistentNotificationSocketEnd = {
  reason: "closed" | "auth" | "error";
  message?: string;
};

/**
 * One Home Assistant websocket: authenticate with the same access token the
 * REST client uses (supervisor, OAuth, or long-lived), then subscribe to
 * persistent notifications. `persistent_notification/get` is the fallback when
 * subscribe is rejected. Caller closes the socket; `done` settles when it ends.
 */
export async function openPersistentNotificationSubscription(
  config: { baseUrl: string; token: string },
  onEvent: (event: PersistentNotificationUpdate) => void
): Promise<{ close: () => void; done: Promise<PersistentNotificationSocketEnd> }> {
  const WebSocketImpl = (await import("ws")).default;
  const ws: WebSocket = new WebSocketImpl(haWebSocketUrl(config.baseUrl));

  let settled = false;
  let authed = false;
  let watch: SocketWatch = { subscribeId: null, getId: null };
  let failure: PersistentNotificationSocketEnd | null = null;
  let resolveDone: (end: PersistentNotificationSocketEnd) => void = () => {};
  const done = new Promise<PersistentNotificationSocketEnd>((resolve) => {
    resolveDone = resolve;
  });

  const finish = (end: PersistentNotificationSocketEnd) => {
    if (settled) return;
    settled = true;
    clearTimeout(authTimer);
    failure = end;
    resolveDone(end);
    try {
      ws.close();
    } catch {
      // Socket already closing.
    }
  };

  const authTimer = setTimeout(() => {
    if (!authed) finish({ reason: "error", message: "WebSocket timeout" });
  }, 15000);

  const dispatch = (action: SocketAction) => {
    switch (action.type) {
      case "authenticate":
        ws.send(JSON.stringify({ type: "auth", access_token: config.token }));
        return;
      case "send":
        authed = true;
        clearTimeout(authTimer);
        ws.send(
          JSON.stringify({
            id: action.id,
            type:
              action.command === "subscribe"
                ? "persistent_notification/subscribe"
                : "persistent_notification/get",
          })
        );
        return;
      case "event":
        onEvent(action.update);
        return;
      case "auth_failed":
        finish({ reason: "auth", message: action.message });
        return;
      case "none":
        return;
      default: {
        const _exhaustive: never = action;
        return _exhaustive;
      }
    }
  };

  ws.on("message", (raw: Buffer | string) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw.toString());
    } catch {
      return;
    }
    try {
      for (const message of parseHaWsFrame(parsed)) {
        const next = reducePersistentNotificationSocket(watch, message);
        watch = next.watch;
        for (const action of next.actions) dispatch(action);
      }
    } catch (err) {
      finish({
        reason: "error",
        message: err instanceof Error ? err.message : "WebSocket error",
      });
    }
  });

  ws.on("error", (err: Error) => {
    if (!failure) failure = { reason: "error", message: err.message || "WebSocket error" };
  });

  ws.on("close", () => {
    finish(failure ?? { reason: "closed" });
  });

  return {
    close: () => finish({ reason: "closed" }),
    done,
  };
}
