/**
 * Home Assistant persistent notifications (core 2024.8+).
 *
 * Since 2023.6 these are not `persistent_notification.*` entities. The websocket
 * commands are `persistent_notification/subscribe` (events `current`, `added`,
 * `updated`, `removed`) and `persistent_notification/get` (a list). Dismiss is
 * the `persistent_notification.dismiss` service with `notification_id` only.
 */

export type HaPersistentNotification = {
  notification_id: string;
  title: string | null;
  message: string;
  created_at: string | null;
};

export type PersistentNotificationEventType = "current" | "added" | "updated" | "removed";

export type PersistentNotificationUpdate = {
  type: PersistentNotificationEventType;
  notifications: HaPersistentNotification[];
};

export type PersistentNotificationSnapshot = {
  sessionId: string;
  version: number;
  notifications: HaPersistentNotification[];
  error: string | null;
};

export type PersistentNotificationDismissCall = {
  domain: "persistent_notification";
  service: "dismiss";
  service_data: { notification_id: string };
};

const EVENT_TYPES: readonly PersistentNotificationEventType[] = ["current", "added", "updated", "removed"];

function isEventType(value: unknown): value is PersistentNotificationEventType {
  return typeof value === "string" && (EVENT_TYPES as readonly string[]).includes(value);
}

function parseOne(value: unknown, fallbackId?: string): HaPersistentNotification | null {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : null;
  const fromField = record && typeof record.notification_id === "string" ? record.notification_id.trim() : "";
  const fromKey = fallbackId?.trim() ?? "";
  const notificationId = fromField || fromKey;
  if (!notificationId || notificationId.length > 256) return null;
  if (/[\u0000-\u001F\u007F]/.test(notificationId)) return null;
  const message = record && typeof record.message === "string" ? record.message : "";
  const title = record && typeof record.title === "string" && record.title.trim() ? record.title : null;
  const createdAt = record && typeof record.created_at === "string" && record.created_at.trim() ? record.created_at : null;
  return {
    notification_id: notificationId,
    title,
    message,
    created_at: createdAt,
  };
}

/** Dict (subscribe events) or list (`persistent_notification/get`). */
export function parsePersistentNotificationCollection(value: unknown): HaPersistentNotification[] | null {
  if (Array.isArray(value)) {
    return value
      .map((item) => parseOne(item))
      .filter((item): item is HaPersistentNotification => item != null);
  }
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([id, item]) => parseOne(item, id))
      .filter((item): item is HaPersistentNotification => item != null);
  }
  return null;
}

export function parsePersistentNotificationEvent(event: unknown): PersistentNotificationUpdate | null {
  if (!event || typeof event !== "object") return null;
  const type = (event as { type?: unknown }).type;
  if (!isEventType(type)) return null;
  const notifications = parsePersistentNotificationCollection(
    (event as { notifications?: unknown }).notifications
  );
  return { type, notifications: notifications ?? [] };
}

export type ParsedHaWsMessage =
  | { kind: "auth_required" }
  | { kind: "auth_ok" }
  | { kind: "auth_invalid"; message: string }
  | { kind: "result"; id: number; success: boolean; notifications: HaPersistentNotification[] | null }
  | { kind: "event"; id: number; update: PersistentNotificationUpdate }
  | { kind: "ignore" };

export function parseHaWsMessage(message: unknown): ParsedHaWsMessage {
  if (!message || typeof message !== "object") return { kind: "ignore" };
  const record = message as Record<string, unknown>;
  switch (record.type) {
    case "auth_required":
      return { kind: "auth_required" };
    case "auth_ok":
      return { kind: "auth_ok" };
    case "auth_invalid":
      return {
        kind: "auth_invalid",
        message: typeof record.message === "string" ? record.message : "WebSocket auth failed",
      };
    case "result": {
      if (typeof record.id !== "number") return { kind: "ignore" };
      return {
        kind: "result",
        id: record.id,
        success: record.success === true,
        notifications: parsePersistentNotificationCollection(record.result),
      };
    }
    case "event": {
      if (typeof record.id !== "number") return { kind: "ignore" };
      const update = parsePersistentNotificationEvent(record.event);
      if (!update) return { kind: "ignore" };
      return { kind: "event", id: record.id, update };
    }
    default:
      return { kind: "ignore" };
  }
}

/** One JSON text frame may be a message or a coalesced array of messages. */
export function parseHaWsFrame(frame: unknown): ParsedHaWsMessage[] {
  const messages = Array.isArray(frame) ? frame : [frame];
  return messages.map((message) => parseHaWsMessage(message));
}

export type SocketWatch = {
  subscribeId: number | null;
  getId: number | null;
};

export type SocketAction =
  | { type: "authenticate" }
  | { type: "send"; command: "subscribe" | "get"; id: number }
  | { type: "event"; update: PersistentNotificationUpdate }
  | { type: "auth_failed"; message: string }
  | { type: "none" };

/**
 * What to do with one authenticated websocket message.
 * Subscribe failure falls back to `persistent_notification/get`.
 */
export function reducePersistentNotificationSocket(
  watch: SocketWatch,
  message: ParsedHaWsMessage
): { watch: SocketWatch; actions: SocketAction[] } {
  switch (message.kind) {
    case "auth_required":
      return { watch, actions: [{ type: "authenticate" }] };
    case "auth_ok":
      return {
        watch: { subscribeId: 1, getId: null },
        actions: [{ type: "send", command: "subscribe", id: 1 }],
      };
    case "auth_invalid":
      return { watch, actions: [{ type: "auth_failed", message: message.message }] };
    case "result": {
      const actions: SocketAction[] = [];
      let next = watch;
      if (message.notifications && message.success) {
        const isGet = watch.getId != null && message.id === watch.getId;
        const isSubscribe = watch.subscribeId != null && message.id === watch.subscribeId;
        if (isGet || isSubscribe) {
          actions.push({ type: "event", update: { type: "current", notifications: message.notifications } });
        }
      }
      if (watch.subscribeId != null && message.id === watch.subscribeId && !message.success && watch.getId == null) {
        next = { ...watch, getId: 2 };
        actions.push({ type: "send", command: "get", id: 2 });
      }
      if (actions.length === 0) actions.push({ type: "none" });
      return { watch: next, actions };
    }
    case "event": {
      if (watch.subscribeId == null || message.id !== watch.subscribeId) {
        return { watch, actions: [{ type: "none" }] };
      }
      return { watch, actions: [{ type: "event", update: message.update }] };
    }
    case "ignore":
      return { watch, actions: [{ type: "none" }] };
    default: {
      const _exhaustive: never = message;
      return _exhaustive;
    }
  }
}

function indexById(items: readonly HaPersistentNotification[]): Map<string, HaPersistentNotification> {
  const map = new Map<string, HaPersistentNotification>();
  for (const item of items) map.set(item.notification_id, item);
  return map;
}

function inOrder(ids: readonly string[], byId: ReadonlyMap<string, HaPersistentNotification>): HaPersistentNotification[] {
  return ids.map((id) => byId.get(id)).filter((item): item is HaPersistentNotification => item != null);
}

export function applyPersistentNotificationEvent(
  current: readonly HaPersistentNotification[],
  event: PersistentNotificationUpdate
): HaPersistentNotification[] {
  switch (event.type) {
    case "current": {
      const byId = indexById(event.notifications);
      const ids: string[] = [];
      for (const item of event.notifications) {
        if (!ids.includes(item.notification_id)) ids.push(item.notification_id);
      }
      return inOrder(ids, byId);
    }
    case "added":
    case "updated": {
      const byId = indexById(current);
      const ids = current.map((item) => item.notification_id);
      for (const item of event.notifications) {
        if (!byId.has(item.notification_id)) ids.push(item.notification_id);
        byId.set(item.notification_id, item);
      }
      return inOrder(ids, byId);
    }
    case "removed": {
      const remove = new Set(event.notifications.map((item) => item.notification_id));
      return current.filter((item) => !remove.has(item.notification_id));
    }
    default: {
      const _exhaustive: never = event.type;
      return _exhaustive;
    }
  }
}

/** One `persistent_notification.dismiss` per shown id. Never `dismiss_all`. */
export function dismissCallsForShownNotifications(
  shown: readonly { notification_id: string }[]
): PersistentNotificationDismissCall[] {
  const seen = new Set<string>();
  const calls: PersistentNotificationDismissCall[] = [];
  for (const item of shown) {
    const notificationId = item.notification_id.trim();
    if (!notificationId || notificationId.length > 256 || seen.has(notificationId)) continue;
    if (/[\u0000-\u001F\u007F]/.test(notificationId)) continue;
    seen.add(notificationId);
    calls.push({
      domain: "persistent_notification",
      service: "dismiss",
      service_data: { notification_id: notificationId },
    });
  }
  return calls;
}

export function parsePersistentNotificationSnapshot(value: unknown): PersistentNotificationSnapshot | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (typeof record.sessionId !== "string" || !record.sessionId) return null;
  if (typeof record.version !== "number" || !Number.isFinite(record.version)) return null;
  const notifications = parsePersistentNotificationCollection(record.notifications);
  if (!notifications) return null;
  const error = typeof record.error === "string" && record.error.trim() ? record.error : null;
  return {
    sessionId: record.sessionId,
    version: record.version,
    notifications,
    error,
  };
}

export function shouldApplyPersistentNotificationSnapshot(
  seen: { sessionId: string | null; version: number },
  next: { sessionId: string; version: number }
): boolean {
  if (seen.sessionId !== next.sessionId) return true;
  return next.version >= seen.version;
}
