/**
 * Reolink / HA doorbell ring detection helpers.
 * Typical entities: binary_sensor.*_visitor (off → on), camera.* for the feed.
 */

export const DEFAULT_DOORBELL_COOLDOWN_MS = 30_000;
export const DEFAULT_DOORBELL_SNAPSHOT_REFRESH_MS = 1000;
export const DOORBELL_STORAGE_KEY = "dashboard.doorbell.settings";

/** States that mean "someone rang / visitor present". */
export const DOORBELL_RING_STATES = ["on", "pressed", "detected"] as const;

export type DoorbellSettings = {
  enabled: boolean;
  /** binary_sensor (visitor) or event-like entity that goes on when rung. */
  sensorEntityId: string;
  /** camera.* entity for snapshot / proxy feed. */
  cameraEntityId: string;
  /**
   * Optional go2rtc / WebRTC page URL (e.g. http://ha:1984/stream.html?src=doorbell&media=video+audio+microphone).
   * When set, the popup embeds this for live A/V + talkback instead of snapshot refresh.
   */
  webrtcStreamUrl: string;
  /** Minimum ms between ring popups. */
  cooldownMs: number;
  /** Snapshot refresh interval while popup is open (ms). Ignored when webrtc URL is set. */
  snapshotRefreshMs: number;
  playChime: boolean;
};

export type DoorbellRingEvent = {
  sensorEntityId: string;
  cameraEntityId: string;
  webrtcStreamUrl: string;
  atMs: number;
};

export function defaultDoorbellSettings(): DoorbellSettings {
  return {
    enabled: false,
    sensorEntityId: "",
    cameraEntityId: "",
    webrtcStreamUrl: "",
    cooldownMs: DEFAULT_DOORBELL_COOLDOWN_MS,
    snapshotRefreshMs: DEFAULT_DOORBELL_SNAPSHOT_REFRESH_MS,
    playChime: true,
  };
}

function normalizeState(state: string | undefined | null): string {
  return (state ?? "").toLowerCase().trim().replace(/\s+/g, "_");
}

export function isDoorbellRingState(state: string | undefined | null): boolean {
  const s = normalizeState(state);
  return (DOORBELL_RING_STATES as readonly string[]).includes(s);
}

/**
 * True when the configured sensor transitions into a ring state.
 * First sighting of an entity (no previous) does not count — avoids popup on page load.
 */
export function isDoorbellRingTransition(input: {
  sensorEntityId: string;
  fromState: string | undefined | null;
  toState: string | undefined | null;
}): boolean {
  const id = (input.sensorEntityId ?? "").trim();
  if (!id) return false;
  if (!isDoorbellRingState(input.toState)) return false;
  const from = normalizeState(input.fromState);
  const to = normalizeState(input.toState);
  if (!from) return false; // no previous observation
  if (from === to) return false;
  // Already in a ring state → still in ring state: ignore
  if (isDoorbellRingState(from) && isDoorbellRingState(to)) return false;
  return true;
}

export function isDoorbellInCooldown(
  lastRingAtMs: number | undefined | null,
  cooldownMs: number,
  nowMs: number
): boolean {
  if (lastRingAtMs == null || lastRingAtMs <= 0) return false;
  const cool = Number.isFinite(cooldownMs) ? Math.max(0, cooldownMs) : DEFAULT_DOORBELL_COOLDOWN_MS;
  return nowMs - lastRingAtMs < cool;
}

export function shouldTriggerDoorbell(input: {
  settings: DoorbellSettings;
  sensorEntityId: string;
  fromState: string | undefined | null;
  toState: string | undefined | null;
  lastRingAtMs: number | undefined | null;
  nowMs: number;
}): boolean {
  const { settings } = input;
  if (!settings.enabled) return false;
  const configured = (settings.sensorEntityId ?? "").trim().toLowerCase();
  if (!configured) return false;
  if (input.sensorEntityId.trim().toLowerCase() !== configured) return false;
  if (
    !isDoorbellRingTransition({
      sensorEntityId: settings.sensorEntityId,
      fromState: input.fromState,
      toState: input.toState,
    })
  ) {
    return false;
  }
  if (isDoorbellInCooldown(input.lastRingAtMs, settings.cooldownMs, input.nowMs)) return false;
  return true;
}

export function parseDoorbellSettings(raw: unknown): DoorbellSettings {
  const defaults = defaultDoorbellSettings();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return defaults;
  const r = raw as Record<string, unknown>;
  const cooldownMs =
    typeof r.cooldownMs === "number" && Number.isFinite(r.cooldownMs)
      ? Math.max(0, Math.round(r.cooldownMs))
      : defaults.cooldownMs;
  const snapshotRefreshMs =
    typeof r.snapshotRefreshMs === "number" && Number.isFinite(r.snapshotRefreshMs)
      ? Math.max(250, Math.round(r.snapshotRefreshMs))
      : defaults.snapshotRefreshMs;
  return {
    enabled: r.enabled === true,
    sensorEntityId: typeof r.sensorEntityId === "string" ? r.sensorEntityId.trim() : "",
    cameraEntityId: typeof r.cameraEntityId === "string" ? r.cameraEntityId.trim() : "",
    webrtcStreamUrl: typeof r.webrtcStreamUrl === "string" ? r.webrtcStreamUrl.trim() : "",
    cooldownMs,
    snapshotRefreshMs,
    playChime: r.playChime !== false,
  };
}

export function doorbellUsesWebRtc(settings: Pick<DoorbellSettings, "webrtcStreamUrl">): boolean {
  return (settings.webrtcStreamUrl ?? "").trim().length > 0;
}
