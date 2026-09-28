function stripIngressPrefix(pathname: string): string {
  return pathname.replace(/^\/__ha_ingress__(?=\/|$)/, "") || "/";
}

function isPath(pathname: string, root: string): boolean {
  const path = stripIngressPrefix(pathname);
  return path === root || path.startsWith(`${root}/`);
}

/** Dashboard photo wallpaper is hidden on Music Assistant and Energy (Energy has its own art). */
export function hidesDashboardWallpaper(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return isPath(pathname, "/music") || isPath(pathname, "/energy");
}
