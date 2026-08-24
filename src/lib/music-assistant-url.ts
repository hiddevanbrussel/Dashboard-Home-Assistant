export const DEFAULT_MA_PORT = 8095;

export type MusicAssistantEndpoint = {
  protocol: "http" | "https";
  host: string;
  port: string;
};

function stripPath(host: string): string {
  return host.trim().replace(/\/.*$/, "");
}

/** Parse a stored MA base URL or a raw IP/host into protocol, host and port. */
export function parseMusicAssistantEndpoint(baseUrl: string): MusicAssistantEndpoint {
  const trimmed = (baseUrl || "").trim();
  if (!trimmed) {
    return { protocol: "http", host: "", port: String(DEFAULT_MA_PORT) };
  }
  try {
    const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
    const url = new URL(withProto);
    const protocol = url.protocol === "https:" ? "https" : "http";
    const port =
      url.port ||
      (protocol === "https" ? "443" : String(DEFAULT_MA_PORT));
    return { protocol, host: url.hostname, port };
  } catch {
    const host = stripPath(trimmed.replace(/^https?:\/\//i, ""));
    return { protocol: "http", host, port: String(DEFAULT_MA_PORT) };
  }
}

/** Build a MA base URL (no trailing slash, no /api suffix). */
export function buildMusicAssistantBaseUrl(
  host: string,
  port: string = String(DEFAULT_MA_PORT),
  protocol: "http" | "https" = "http"
): string {
  const raw = stripPath(host).replace(/^https?:\/\//i, "");
  if (!raw) return "";
  const parsed = parseMusicAssistantEndpoint(
    /^https?:\/\//i.test(host) ? host : `${protocol}://${raw}`
  );
  const h = parsed.host || raw;
  const p = (port || parsed.port || String(DEFAULT_MA_PORT)).trim();
  const proto = protocol || parsed.protocol;
  const hidePort =
    (proto === "http" && p === "80") || (proto === "https" && p === "443");
  return `${proto}://${h}${hidePort ? "" : `:${p}`}`;
}

/**
 * Accept IP, hostname, host:port or a full URL and return a usable MA base URL.
 * `192.168.1.50` → `http://192.168.1.50:8095`
 */
export function normalizeMusicAssistantBaseUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const parsed = parseMusicAssistantEndpoint(trimmed);
  if (!parsed.host) return "";
  return buildMusicAssistantBaseUrl(parsed.host, parsed.port, parsed.protocol);
}
