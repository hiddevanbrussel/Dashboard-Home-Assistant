import { describe, expect, it } from "vitest";
import { PersistentNotificationHub } from "./persistent-notification-hub";
import { haWebSocketUrl, type PersistentNotificationSocketEnd } from "./websocket";
import {
  applyPersistentNotificationEvent,
  dismissCallsForShownNotifications,
  parseHaWsFrame,
  parsePersistentNotificationSnapshot,
  reducePersistentNotificationSocket,
  shouldApplyPersistentNotificationSnapshot,
  type HaPersistentNotification,
  type PersistentNotificationUpdate,
  type SocketWatch,
} from "./persistent-notifications";

const battery: HaPersistentNotification = {
  notification_id: "low_battery",
  title: "Low battery",
  message: "Living room sensor is at 12%.",
  created_at: "2024-08-07T12:00:00+00:00",
};

const update: HaPersistentNotification = {
  notification_id: "update_available",
  title: "Update available",
  message: "Home Assistant Core 2024.10.0 is available.",
  created_at: "2024-10-01T08:00:00+00:00",
};

const login: HaPersistentNotification = {
  notification_id: "http_login",
  title: "Login attempt failed",
  message: "Invalid password from the local network.",
  created_at: "2024-10-02T09:30:00+00:00",
};

function eventFrame(type: string, notifications: Record<string, HaPersistentNotification>) {
  return {
    id: 1,
    type: "event",
    event: { type, notifications },
  };
}

describe("persistent notification subscribe events", () => {
  it("parses current, added, updated, and removed websocket events", () => {
    const current = parseHaWsFrame(eventFrame("current", { low_battery: battery, update_available: update }));
    const added = parseHaWsFrame(eventFrame("added", { http_login: login }));
    const updated = parseHaWsFrame(
      eventFrame("updated", {
        low_battery: { ...battery, message: "Living room sensor is at 5%." },
      })
    );
    const removed = parseHaWsFrame(eventFrame("removed", { update_available: update }));

    expect(current).toEqual([
      {
        kind: "event",
        id: 1,
        update: { type: "current", notifications: [battery, update] },
      },
    ]);
    expect(added[0]).toMatchObject({ kind: "event", update: { type: "added", notifications: [login] } });
    expect(updated[0]).toMatchObject({
      kind: "event",
      update: { type: "updated", notifications: [{ ...battery, message: "Living room sensor is at 5%." }] },
    });
    expect(removed[0]).toMatchObject({
      kind: "event",
      update: { type: "removed", notifications: [update] },
    });
  });

  it("applies current, then added, updated, and removed", () => {
    const steps: PersistentNotificationUpdate[] = [
      { type: "current", notifications: [battery, update] },
      { type: "added", notifications: [login] },
      { type: "updated", notifications: [{ ...battery, message: "Living room sensor is at 5%." }] },
      { type: "removed", notifications: [update] },
    ];
    const result = steps.reduce(applyPersistentNotificationEvent, [] as HaPersistentNotification[]);
    expect(result).toEqual([
      { ...battery, message: "Living room sensor is at 5%." },
      login,
    ]);
  });

  it("replaces the list on current and keeps position when an id is added again", () => {
    const replaced = applyPersistentNotificationEvent([login], {
      type: "current",
      notifications: [battery],
    });
    expect(replaced).toEqual([battery]);

    const overwritten = applyPersistentNotificationEvent([battery, update], {
      type: "added",
      notifications: [{ ...battery, title: "Battery" }],
    });
    expect(overwritten.map((item) => item.notification_id)).toEqual(["low_battery", "update_available"]);
    expect(overwritten[0]?.title).toBe("Battery");
  });

  it("reads a coalesced subscribe result plus current event, and a get fallback", () => {
    let watch: SocketWatch = { subscribeId: null, getId: null };
    const authed = reducePersistentNotificationSocket(watch, { kind: "auth_ok" });
    watch = authed.watch;
    expect(authed.actions).toEqual([{ type: "send", command: "subscribe", id: 1 }]);

    const frame = parseHaWsFrame([
      { id: 1, type: "result", success: true, result: null },
      eventFrame("current", { low_battery: battery }),
    ]);
    const actions = frame.flatMap((message) => {
      const step = reducePersistentNotificationSocket(watch, message);
      watch = step.watch;
      return step.actions;
    });
    expect(actions).toEqual([
      { type: "none" },
      { type: "event", update: { type: "current", notifications: [battery] } },
    ]);

    const rejected = reducePersistentNotificationSocket(
      { subscribeId: 1, getId: null },
      { kind: "result", id: 1, success: false, notifications: null }
    );
    expect(rejected.actions).toEqual([{ type: "send", command: "get", id: 2 }]);
    const loaded = reducePersistentNotificationSocket(rejected.watch, {
      kind: "result",
      id: 2,
      success: true,
      notifications: [update, login],
    });
    expect(loaded.actions).toEqual([
      { type: "event", update: { type: "current", notifications: [update, login] } },
    ]);
  });

  it("ignores unrelated events and does not put the access token in socket actions", () => {
    const auth = reducePersistentNotificationSocket(
      { subscribeId: null, getId: null },
      { kind: "auth_required" }
    );
    expect(auth.actions).toEqual([{ type: "authenticate" }]);
    expect(JSON.stringify(auth.actions)).not.toContain("access_token");

    const ignored = parseHaWsFrame({ id: 1, type: "event", event: { type: "state_changed", data: {} } });
    expect(ignored).toEqual([{ kind: "ignore" }]);
  });
});

describe("persistent notification dismiss", () => {
  it("dismisses each shown notification by id and never calls dismiss_all", () => {
    const shown = applyPersistentNotificationEvent([battery, update, login], {
      type: "removed",
      notifications: [update],
    });
    const calls = dismissCallsForShownNotifications(shown);
    expect(calls).toEqual([
      {
        domain: "persistent_notification",
        service: "dismiss",
        service_data: { notification_id: "low_battery" },
      },
      {
        domain: "persistent_notification",
        service: "dismiss",
        service_data: { notification_id: "http_login" },
      },
    ]);
    const encoded = JSON.stringify(calls);
    expect(encoded).not.toContain("dismiss_all");
    expect(encoded).not.toContain("entity_id");
  });

  it("skips blank and duplicate ids", () => {
    expect(
      dismissCallsForShownNotifications([
        { notification_id: "  " },
        { notification_id: "low_battery" },
        { notification_id: "low_battery" },
      ])
    ).toEqual([
      {
        domain: "persistent_notification",
        service: "dismiss",
        service_data: { notification_id: "low_battery" },
      },
    ]);
  });
});

describe("persistent notification snapshots", () => {
  it("drops stale versions from the same session and accepts a new session", () => {
    expect(
      shouldApplyPersistentNotificationSnapshot(
        { sessionId: "a", version: 4 },
        { sessionId: "a", version: 3 }
      )
    ).toBe(false);
    expect(
      shouldApplyPersistentNotificationSnapshot(
        { sessionId: "a", version: 4 },
        { sessionId: "a", version: 4 }
      )
    ).toBe(true);
    expect(
      shouldApplyPersistentNotificationSnapshot(
        { sessionId: "a", version: 4 },
        { sessionId: "b", version: 1 }
      )
    ).toBe(true);
  });

  it("parses a snapshot list", () => {
    expect(
      parsePersistentNotificationSnapshot({
        sessionId: "sess",
        version: 2,
        notifications: [battery],
        error: null,
      })
    ).toEqual({
      sessionId: "sess",
      version: 2,
      notifications: [battery],
      error: null,
    });
  });
});

describe("persistent notification hub", () => {
  it("passes the connection to the socket and publishes subscribe events", async () => {
    const sink: { emit: ((event: PersistentNotificationUpdate) => void) | null } = { emit: null };
    let resolveDone: (end: PersistentNotificationSocketEnd) => void = () => {};
    const seen: { baseUrl: string; token: string }[] = [];
    const hub = new PersistentNotificationHub(async (config, onEvent) => {
      seen.push(config);
      sink.emit = onEvent;
      return {
        close: () => resolveDone({ reason: "closed" }),
        done: new Promise((resolve) => {
          resolveDone = resolve;
        }),
      };
    }, 30);
    const loadConfig = async () => ({ baseUrl: "http://supervisor/core", token: "supervisor-token" });
    try {
      const pending = hub.waitForUpdate({
        since: -1,
        sessionId: null,
        signal: new AbortController().signal,
        loadConfig,
        timeoutMs: 2000,
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(seen).toEqual([{ baseUrl: "http://supervisor/core", token: "supervisor-token" }]);
      sink.emit?.({ type: "current", notifications: [battery, update] });
      const first = await pending;
      expect(first.notifications.map((item) => item.notification_id)).toEqual([
        "low_battery",
        "update_available",
      ]);

      hub.noteDismissed(["low_battery"]);
      const second = await hub.waitForUpdate({
        since: first.version,
        sessionId: first.sessionId,
        signal: new AbortController().signal,
        loadConfig,
        timeoutMs: 2000,
      });
      expect(second.notifications.map((item) => item.notification_id)).toEqual(["update_available"]);
    } finally {
      hub.close();
    }
  });

  it("serves the live cache inside the idle window and waits for a fresh subscribe after idle", async () => {
    const sessions: {
      emit: (event: PersistentNotificationUpdate) => void;
      close: () => void;
    }[] = [];
    const hub = new PersistentNotificationHub(async (_config, onEvent) => {
      let resolveDone: (end: PersistentNotificationSocketEnd) => void = () => {};
      const done = new Promise<PersistentNotificationSocketEnd>((resolve) => {
        resolveDone = resolve;
      });
      const session = {
        emit: onEvent,
        close: () => resolveDone({ reason: "closed" }),
      };
      sessions.push(session);
      return { close: session.close, done };
    }, 30);
    const loadConfig = async () => ({ baseUrl: "http://ha.local", token: "token" });
    const poll = (timeoutMs = 2000) =>
      hub.waitForUpdate({
        since: -1,
        sessionId: null,
        signal: new AbortController().signal,
        loadConfig,
        timeoutMs,
      });

    try {
      const firstPending = poll();
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(sessions).toHaveLength(1);
      sessions[0]?.emit({ type: "current", notifications: [battery] });
      const first = await firstPending;
      expect(first.notifications.map((item) => item.notification_id)).toEqual(["low_battery"]);

      const cached = await poll();
      expect(cached.notifications.map((item) => item.notification_id)).toEqual(["low_battery"]);
      expect(sessions).toHaveLength(1);

      await new Promise((resolve) => setTimeout(resolve, 50));
      sessions[0]?.emit({ type: "current", notifications: [update] });

      let resolved = false;
      const refreshed = poll().then((snapshot) => {
        resolved = true;
        return snapshot;
      });
      await new Promise((resolve) => setTimeout(resolve, 20));
      expect(resolved).toBe(false);

      for (let i = 0; i < 40 && sessions.length < 2; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      expect(sessions).toHaveLength(2);
      expect(resolved).toBe(false);
      sessions[0]?.emit({ type: "current", notifications: [login] });
      await new Promise((resolve) => setTimeout(resolve, 20));
      expect(resolved).toBe(false);

      sessions[1]?.emit({ type: "current", notifications: [update] });
      const next = await refreshed;
      expect(next.notifications.map((item) => item.notification_id)).toEqual(["update_available"]);
      expect(next.sessionId).toBe(first.sessionId);
    } finally {
      hub.close();
    }
  });

  it("does not answer since=-1 with the idle cache when the new subscribe times out", async () => {
    const sessions: { emit: (event: PersistentNotificationUpdate) => void }[] = [];
    const hub = new PersistentNotificationHub(async (_config, onEvent) => {
      let resolveDone: (end: PersistentNotificationSocketEnd) => void = () => {};
      const done = new Promise<PersistentNotificationSocketEnd>((resolve) => {
        resolveDone = resolve;
      });
      sessions.push({ emit: onEvent });
      return {
        close: () => resolveDone({ reason: "closed" }),
        done,
      };
    }, 20);
    const loadConfig = async () => ({ baseUrl: "http://ha.local", token: "token" });
    try {
      const pending = hub.waitForUpdate({
        since: -1,
        sessionId: null,
        signal: new AbortController().signal,
        loadConfig,
        timeoutMs: 2000,
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
      sessions[0]?.emit({ type: "current", notifications: [battery, update] });
      await pending;
      await new Promise((resolve) => setTimeout(resolve, 40));
      const stale = await hub.waitForUpdate({
        since: -1,
        sessionId: null,
        signal: new AbortController().signal,
        loadConfig,
        timeoutMs: 30,
      });
      expect(stale.notifications).toEqual([]);
      expect(sessions.length).toBeGreaterThanOrEqual(2);
    } finally {
      hub.close();
    }
  });
});

describe("ha websocket url", () => {
  it("uses the same websocket path for supervisor, https, and a token host", () => {
    expect(haWebSocketUrl("http://supervisor/core")).toBe("ws://supervisor/core/api/websocket");
    expect(haWebSocketUrl("https://ha.example.com/")).toBe("wss://ha.example.com/api/websocket");
    expect(haWebSocketUrl("http://192.168.1.20:8123")).toBe("ws://192.168.1.20:8123/api/websocket");
  });
});
