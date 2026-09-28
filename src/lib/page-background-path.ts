function isPath(pathname: string, root: string): boolean {
  return pathname === root || pathname.startsWith(`${root}/`);
}

/** Dashboard photo wallpaper is hidden on Music Assistant and Energy (Energy has its own art). */
export function hidesDashboardWallpaper(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return isPath(pathname, "/music") || isPath(pathname, "/energy");
}
