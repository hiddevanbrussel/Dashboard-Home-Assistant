/** Browser-safe host checks. No Node.js built-ins. */

export function isIpAddress(value: string): boolean {
  const host = value.toLowerCase().replace(/^\[|\]$/g, "");
  if (host.includes(":")) return true;
  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host);
}

export function isMetadataIp(ip: string): boolean {
  const normalized = ip.toLowerCase().replace(/^\[|\]$/g, "");
  const mapped = normalized.startsWith("::ffff:") ? normalized.slice("::ffff:".length) : normalized;
  const parts = mapped.split(".").map((part) => Number(part));
  return parts.length === 4 && parts[0] === 169 && parts[1] === 254;
}

export function isBlockedIp(ip: string): boolean {
  const normalized = ip.toLowerCase().replace(/^\[|\]$/g, "");
  if (normalized.startsWith("::ffff:")) return isBlockedIp(normalized.slice("::ffff:".length));
  if (!isIpAddress(normalized)) return false;
  if (normalized === "::1" || normalized === "0.0.0.0" || normalized === "::") return true;
  if (normalized.startsWith("fe80:") || normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
  const parts = normalized.split(".").map((part) => Number(part));
  if (normalized.includes(":")) {
    if (normalized === "::1" || normalized === "::") return true;
    if (normalized.startsWith("fe80:") || normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
    return false;
  }
  const [a, b] = parts;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a >= 224) return true;
  return false;
}

const METADATA_HOSTS = new Set(["metadata.google.internal", "metadata.google.com", "metadata"]);

export function isLocalHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "");
  if (!host || METADATA_HOSTS.has(host)) return false;
  if (
    host === "localhost" ||
    host === "supervisor" ||
    host === "homeassistant" ||
    host.endsWith(".local") ||
    host.endsWith(".lan") ||
    host.endsWith(".home") ||
    host.endsWith(".internal")
  ) {
    return true;
  }
  if (isIpAddress(host)) return isBlockedIp(host) && !isMetadataIp(host);
  if (!host.includes(".")) return /^[a-z0-9-]+$/.test(host);
  return false;
}

export function isAllowedHaBaseUrl(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return false;
  }
  if (url.username || url.password) return false;
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  const host = url.hostname.toLowerCase();
  if (host === "metadata.google.internal" || isMetadataIp(host)) return false;
  if (url.protocol === "https:") return true;
  if (host === "supervisor") return true;
  return isLocalHostname(host);
}

export function isTrustedEmbedUrl(raw: string, extraHosts: string[] = []): boolean {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return false;
  }
  if (url.username || url.password) return false;
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  const host = url.hostname.toLowerCase();
  if (isMetadataIp(host) || host === "metadata.google.internal") return false;
  const allowed = extraHosts.some((item) => item.trim().toLowerCase() === host);
  if (allowed && url.protocol === "https:") return true;
  return isLocalHostname(host);
}
