/**
 * Soft LAN discovery of Home Assistant instances.
 * Probes well-known hostnames and local IPv4 neighbors on :8123.
 * No mDNS required (works in bridge Docker better than multicast).
 */

import os from "os";

export type DiscoveredHaInstance = {
  baseUrl: string;
  /** Best-effort label for the UI. */
  name: string;
  source: "hostname" | "gateway" | "scan" | "loopback";
};

const DEFAULT_PORT = 8123;
const PROBE_TIMEOUT_MS = 700;
const SCAN_CONCURRENCY = 32;
/** Cap neighbor scan so onboarding stays snappy. */
const MAX_SCAN_HOSTS = 64;

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/, "");
}

/** True when a probe response looks like Home Assistant Core. */
export function looksLikeHomeAssistant(status: number, bodySnippet: string, headers?: Headers): boolean {
  if (status === 401 || status === 403) return true;
  const www = headers?.get("www-authenticate")?.toLowerCase() ?? "";
  if (www.includes("bearer") || www.includes("homeassistant")) return true;
  const snippet = bodySnippet.toLowerCase();
  if (status === 200 && (snippet.includes("api running") || snippet.includes("home assistant"))) {
    return true;
  }
  return false;
}

export async function probeHomeAssistant(
  baseUrl: string,
  timeoutMs = PROBE_TIMEOUT_MS
): Promise<DiscoveredHaInstance | null> {
  const base = normalizeBaseUrl(baseUrl);
  if (!/^https?:\/\//i.test(base)) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${base}/api/`, {
      method: "GET",
      signal: controller.signal,
      redirect: "manual",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const text = await res.text().catch(() => "");
    if (!looksLikeHomeAssistant(res.status, text, res.headers)) return null;

    let name = "Home Assistant";
    try {
      const host = new URL(base).hostname;
      if (host && host !== "localhost" && host !== "127.0.0.1") {
        name = host;
      }
    } catch {
      /* ignore */
    }

    return { baseUrl: base, name, source: "hostname" };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function ipv4Parts(ip: string): number[] | null {
  const parts = ip.split(".").map((p) => Number(p));
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return null;
  }
  return parts;
}

/** Local IPv4 addresses (non-internal) from OS interfaces. */
export function listLocalIpv4(): string[] {
  const out: string[] = [];
  const nets = os.networkInterfaces();
  for (const entries of Object.values(nets)) {
    if (!entries) continue;
    for (const e of entries) {
      if (e.family !== "IPv4" && (e.family as string) !== "4") continue;
      if (e.internal) continue;
      out.push(e.address);
    }
  }
  return out;
}

/** Candidate gateway (.1) URLs for each local interface. */
export function gatewayCandidates(localIps: string[], port = DEFAULT_PORT): string[] {
  const urls: string[] = [];
  for (const ip of localIps) {
    const parts = ipv4Parts(ip);
    if (!parts) continue;
    urls.push(`http://${parts[0]}.${parts[1]}.${parts[2]}.1:${port}`);
  }
  return urls;
}

/**
 * Build a short list of neighbor IPs in the same /24 as local addresses,
 * skipping the machine itself and .0/.255.
 */
export function neighborScanTargets(localIps: string[], port = DEFAULT_PORT, maxHosts = MAX_SCAN_HOSTS): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();

  for (const ip of localIps) {
    const parts = ipv4Parts(ip);
    if (!parts) continue;
    const [a, b, c, self] = parts;
    // Prefer higher hosts first (HA often not .1 only), then fill from .2
    const order: number[] = [];
    for (let i = 2; i <= 254; i++) {
      if (i !== self) order.push(i);
    }
    // Bias toward common static IPs near the gateway
    order.sort((x, y) => {
      const dx = Math.min(Math.abs(x - 1), Math.abs(x - self));
      const dy = Math.min(Math.abs(y - 1), Math.abs(y - self));
      return dx - dy;
    });

    for (const host of order) {
      if (urls.length >= maxHosts) return urls;
      const url = `http://${a}.${b}.${c}.${host}:${port}`;
      if (seen.has(url)) continue;
      seen.add(url);
      urls.push(url);
    }
  }
  return urls;
}

async function mapPool<T, R>(items: T[], concurrency: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, Math.max(1, items.length)) }, () => worker());
  await Promise.all(workers);
  return results;
}

const WELL_KNOWN = [
  `http://homeassistant.local:${DEFAULT_PORT}`,
  `http://homeassistant:${DEFAULT_PORT}`,
  `http://hassio.local:${DEFAULT_PORT}`,
  `http://localhost:${DEFAULT_PORT}`,
  `http://127.0.0.1:${DEFAULT_PORT}`,
  `http://host.docker.internal:${DEFAULT_PORT}`,
];

export type DiscoverOptions = {
  /** Extra URLs to try first (e.g. user-typed default). */
  extraUrls?: string[];
  /** When false, skip /24 neighbor scan (faster). Default true. */
  scanNeighbors?: boolean;
  timeoutMs?: number;
};

/**
 * Discover reachable Home Assistant instances on the local network.
 */
export async function discoverHomeAssistant(
  options: DiscoverOptions = {}
): Promise<DiscoveredHaInstance[]> {
  const timeoutMs = options.timeoutMs ?? PROBE_TIMEOUT_MS;
  const scanNeighbors = options.scanNeighbors !== false;
  const found = new Map<string, DiscoveredHaInstance>();

  const add = (hit: DiscoveredHaInstance | null, source: DiscoveredHaInstance["source"]) => {
    if (!hit) return;
    const key = hit.baseUrl.toLowerCase();
    if (found.has(key)) return;
    found.set(key, { ...hit, source });
  };

  const seed: { url: string; source: DiscoveredHaInstance["source"] }[] = [];
  for (const url of [...(options.extraUrls ?? []), ...WELL_KNOWN]) {
    seed.push({ url: normalizeBaseUrl(url), source: url.includes("127.0.0.1") || url.includes("localhost") ? "loopback" : "hostname" });
  }

  const localIps = listLocalIpv4();
  for (const url of gatewayCandidates(localIps)) {
    seed.push({ url, source: "gateway" });
  }

  // Phase 1: quick well-known + gateway probes
  const phase1 = await mapPool(seed, SCAN_CONCURRENCY, async ({ url, source }) => {
    const hit = await probeHomeAssistant(url, timeoutMs);
    return hit ? { ...hit, source } : null;
  });
  for (const hit of phase1) add(hit, hit?.source ?? "hostname");

  // Phase 2: limited neighbor scan when nothing found yet (or always soft-scan a few)
  if (scanNeighbors && found.size === 0) {
    const targets = neighborScanTargets(localIps);
    const phase2 = await mapPool(targets, SCAN_CONCURRENCY, async (url) => {
      const hit = await probeHomeAssistant(url, Math.min(timeoutMs, 500));
      return hit ? { ...hit, source: "scan" as const } : null;
    });
    for (const hit of phase2) add(hit, "scan");
  }

  return Array.from(found.values()).sort((a, b) => a.baseUrl.localeCompare(b.baseUrl));
}
