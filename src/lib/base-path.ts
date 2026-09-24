/**
 * Prefix same-origin paths with Next.js `basePath` (addon: `/__ha_ingress__`).
 * Under HA Ingress, nginx rewrites that placeholder to `X-Ingress-Path`.
 * Leave http(s), data:, blob:, and already-prefixed paths unchanged.
 */
export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH || "";
}

export function withBasePath(path: string): string {
  if (!path) return path;
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:") ||
    path.startsWith("//")
  ) {
    return path;
  }
  const base = getBasePath();
  if (!base) return path;
  if (!path.startsWith("/")) return path;
  if (path === base || path.startsWith(`${base}/`)) return path;
  return `${base}${path}`;
}

/** CSS `url(...)` with basePath applied to same-origin paths. */
export function cssUrl(path: string): string {
  return `url(${withBasePath(path)})`;
}
