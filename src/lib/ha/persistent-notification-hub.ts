/**
 * One Home Assistant websocket subscription shared by the open notification
 * panels. Clients long-poll `waitForUpdate`; the socket closes shortly after
 * the last caller unmounts (request abort → release).
 */

import {
  applyPersistentNotificationEvent,
  type HaPersistentNotification,
  type PersistentNotificationSnapshot,
  type PersistentNotificationUpdate,
} from "./persistent-notifications";
import {
  openPersistentNotificationSubscription,
  type PersistentNotificationSocketEnd,
} from "./websocket";

const IDLE_MS = 3000;

export type HaConnectionConfig = { baseUrl: string; token: string };

export type LoadHaConnection = () => Promise<HaConnectionConfig | null>;

export type OpenNotificationSubscription = (
  config: HaConnectionConfig,
  onEvent: (event: PersistentNotificationUpdate) => void
) => Promise<{ close: () => void; done: Promise<PersistentNotificationSocketEnd> }>;

type Waiter = {
  since: number;
  sessionId: string | null;
  resolve: () => void;
};

export class PersistentNotificationHub {
  private sessionId = crypto.randomUUID();
  private version = 0;
  private notifications: HaPersistentNotification[] = [];
  private ready = false;
  private error: string | null = null;
  private connectedBaseUrl: string | null = null;
  private listeners = 0;
  private stopped = false;
  private loopPromise: Promise<void> | null = null;
  private sessionClose: (() => void) | null = null;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private stopWait: (() => void) | null = null;
  private loadConfig: LoadHaConnection = async () => null;
  private readonly waiters = new Set<Waiter>();

  constructor(
    private readonly openSubscription: OpenNotificationSubscription = openPersistentNotificationSubscription,
    private readonly idleMs = IDLE_MS
  ) {}

  snapshot(): PersistentNotificationSnapshot {
    return {
      sessionId: this.sessionId,
      version: this.version,
      notifications: this.notifications.map((item) => ({ ...item })),
      error: this.ready ? null : this.error,
    };
  }

  /** Drop ids that were dismissed through the service, before the removed event lands. */
  noteDismissed(ids: readonly string[]): void {
    if (ids.length === 0) return;
    this.apply({
      type: "removed",
      notifications: ids.map((notification_id) => ({
        notification_id,
        message: "",
        title: null,
        created_at: null,
      })),
    });
  }

  async waitForUpdate(opts: {
    since: number;
    sessionId: string | null;
    signal: AbortSignal;
    loadConfig: LoadHaConnection;
    timeoutMs: number;
  }): Promise<PersistentNotificationSnapshot> {
    this.retain(opts.loadConfig);
    try {
      if (!this.shouldReturn(opts.since, opts.sessionId) && !opts.signal.aborted) {
        await this.waitForChange(opts.since, opts.sessionId, opts.signal, opts.timeoutMs);
      }
      return this.snapshot();
    } finally {
      this.release();
    }
  }

  /** Drop listeners and close the Home Assistant socket. */
  close(): void {
    this.listeners = 0;
    this.stopped = true;
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = null;
    this.stopWait?.();
    this.sessionClose?.();
    this.sessionClose = null;
    this.wakeAll();
  }

  private apply(event: PersistentNotificationUpdate): void {
    this.notifications = applyPersistentNotificationEvent(this.notifications, event);
    this.version += 1;
    // A dismiss before the first `current` event must not publish an empty list.
    if (event.type !== "removed" || this.ready) {
      this.ready = true;
      this.error = null;
    }
    this.wake();
  }

  private shouldReturn(since: number, sessionId: string | null): boolean {
    if (!this.ready) return false;
    if (sessionId !== this.sessionId) return true;
    return this.version > since;
  }

  private wake(): void {
    for (const waiter of this.waiters) {
      if (this.shouldReturn(waiter.since, waiter.sessionId)) waiter.resolve();
    }
  }

  private rotateSession(): void {
    this.sessionId = crypto.randomUUID();
    this.version = 0;
    this.notifications = [];
    this.ready = false;
    this.wakeAll();
  }

  private wakeAll(): void {
    for (const waiter of this.waiters) waiter.resolve();
  }

  private retain(loadConfig: LoadHaConnection): void {
    this.loadConfig = loadConfig;
    this.listeners += 1;
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    this.stopped = false;
    this.kick();
  }

  private release(): void {
    this.listeners = Math.max(0, this.listeners - 1);
    if (this.listeners > 0) return;
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.idleTimer = null;
      if (this.listeners > 0) return;
      this.stopped = true;
      this.stopWait?.();
      this.sessionClose?.();
      this.sessionClose = null;
    }, this.idleMs);
  }

  private kick(): void {
    if (this.loopPromise || this.stopped || this.listeners <= 0) return;
    const promise = this.runLoop();
    this.loopPromise = promise;
    void promise.finally(() => {
      if (this.loopPromise === promise) this.loopPromise = null;
      this.kick();
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.stopWait = null;
        resolve();
      }, ms);
      this.stopWait = () => {
        clearTimeout(timer);
        this.stopWait = null;
        resolve();
      };
    });
  }

  private async runLoop(): Promise<void> {
    let attempt = 0;
    while (!this.stopped && this.listeners > 0) {
      let config: HaConnectionConfig | null = null;
      try {
        config = await this.loadConfig();
      } catch (err) {
        console.error(
          "[ha] persistent notifications:",
          err instanceof Error ? err.message : "connection lookup failed"
        );
        this.error = "No HA connection";
        await this.delay(3000);
        continue;
      }
      if (this.stopped || this.listeners <= 0) return;
      if (!config) {
        this.error = "No HA connection";
        await this.delay(3000);
        continue;
      }
      if (this.connectedBaseUrl && this.connectedBaseUrl !== config.baseUrl) {
        this.rotateSession();
      }
      this.connectedBaseUrl = config.baseUrl;

      try {
        let received = false;
        const session = await this.openSubscription(config, (event) => {
          received = true;
          this.apply(event);
        });
        this.sessionClose = session.close;
        if (this.stopped || this.listeners <= 0) {
          session.close();
          await session.done;
          return;
        }
        const end = await session.done;
        this.sessionClose = null;
        if (this.stopped || this.listeners <= 0) return;
        if (received) attempt = 0;
        else attempt += 1;
        if (end.reason === "auth") {
          this.error = end.message ?? "WebSocket auth failed";
          console.error("[ha] persistent notifications:", this.error);
          await this.delay(10_000);
        } else if (end.reason === "error") {
          this.error = end.message ?? "WebSocket error";
          console.error("[ha] persistent notifications:", this.error);
          await this.delay(Math.min(1000 * 2 ** Math.min(attempt, 4), 15_000));
        } else {
          await this.delay(1000);
        }
      } catch (err) {
        this.sessionClose = null;
        attempt += 1;
        this.error = "WebSocket error";
        console.error(
          "[ha] persistent notifications:",
          err instanceof Error ? err.message : "WebSocket error"
        );
        await this.delay(Math.min(1000 * 2 ** Math.min(attempt, 4), 15_000));
      }
    }
  }

  private waitForChange(
    since: number,
    sessionId: string | null,
    signal: AbortSignal,
    timeoutMs: number
  ): Promise<void> {
    return new Promise((resolve) => {
      const waiter: Waiter = { since, sessionId, resolve: () => {} };
      const finish = () => {
        clearTimeout(timer);
        signal.removeEventListener("abort", finish);
        this.waiters.delete(waiter);
        resolve();
      };
      waiter.resolve = finish;
      const timer = setTimeout(finish, timeoutMs);
      signal.addEventListener("abort", finish);
      this.waiters.add(waiter);
      if (this.shouldReturn(since, sessionId) || signal.aborted) finish();
    });
  }
}

let hub: PersistentNotificationHub | null = null;

export function getPersistentNotificationHub(): PersistentNotificationHub {
  if (!hub) hub = new PersistentNotificationHub();
  return hub;
}
