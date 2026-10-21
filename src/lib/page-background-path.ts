import { stripHaIngressPrefix } from "./ha-ingress-prefix";

function stripIngressPrefix(pathname: string): string {
  // Add-on basePath is a string slice. A regex for `/__ha_ingress__` breaks
  // when the ingress proxy rewrites the literal.
  const withoutAddon = stripHaIngressPrefix(pathname);
  return withoutAddon.replace(/^\/api\/hassio_ingress\/[^/]+(?=\/|$)/, "") || "/";
}

function isPath(pathname: string, root: string): boolean {
  const path = stripIngressPrefix(pathname);
  return path === root || path.startsWith(`${root}/`);
}

/** Dashboard photo wallpaper is hidden on Music, Energy, and Settings (flat page, no photo decode). */
export function hidesDashboardWallpaper(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return isPath(pathname, "/music") || isPath(pathname, "/energy") || isPath(pathname, "/settings");
}
