/** Stamped from the TCP peer. Clients cannot keep a spoofed value; the server overwrites it. */
export const SOCKET_IP_HEADER = "x-dashboard-socket-ip";

const UNKNOWN_PEER = "unknown-peer";

/** Only the fields the rate-limit key reads. `process.env` satisfies this. */
export type ClientIpEnv = {
  TRUST_PROXY?: string;
  HA_ADDON?: string;
};

export function trustForwardedClientIp(env: NodeJS.ProcessEnv | ClientIpEnv = process.env): boolean {
  return env.TRUST_PROXY === "1" || env.HA_ADDON === "1" || env.HA_ADDON === "true";
}

export function normalizeClientIp(raw: string | null | undefined): string {
  if (!raw) return "";
  let value = raw.trim();
  if (!value) return "";
  if (value.startsWith("::ffff:")) value = value.slice("::ffff:".length);
  if (value.startsWith("[") && value.includes("]")) {
    value = value.slice(1, value.indexOf("]"));
  }
  return value;
}

export function firstForwardedHop(raw: string | null | undefined): string {
  if (!raw) return "";
  return normalizeClientIp(raw.split(",")[0]);
}

type HeaderSource = { get(name: string): string | null };

/**
 * Rate-limit key for one client.
 * Forwarded headers are used only behind the add-on nginx or when TRUST_PROXY=1.
 * Otherwise the TCP peer is used, so tablets do not share one bucket.
 */
export function clientRateLimitKey(headers: HeaderSource, env: NodeJS.ProcessEnv | ClientIpEnv = process.env): string {
  if (trustForwardedClientIp(env)) {
    const real = normalizeClientIp(headers.get("x-real-ip"));
    if (real) return real;
    const forwarded = firstForwardedHop(headers.get("x-forwarded-for"));
    if (forwarded) return forwarded;
  }
  const socketIp = normalizeClientIp(headers.get(SOCKET_IP_HEADER));
  return socketIp || UNKNOWN_PEER;
}
