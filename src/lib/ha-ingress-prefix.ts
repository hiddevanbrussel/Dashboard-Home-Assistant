/**
 * Baked Next.js basePath for the Home Assistant add-on image.
 * A string constant, never a regex literal: the ingress proxy rewrites this
 * text, and a regex literal would break when its slashes are rewritten.
 */
const HA_INGRESS_PREFIX = "/__ha_ingress__";

/**
 * Drop a leading `/__ha_ingress__` when it is the whole path or a `/` segment.
 * `/__ha_ingress__foo` is left unchanged (same boundary as `(?=/|$)`).
 * Returns "" when the pathname is exactly the prefix.
 */
export function stripHaIngressPrefix(pathname: string): string {
  if (pathname === HA_INGRESS_PREFIX) return "";
  if (pathname.startsWith(`${HA_INGRESS_PREFIX}/`)) {
    return pathname.slice(HA_INGRESS_PREFIX.length);
  }
  return pathname;
}
