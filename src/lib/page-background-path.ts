function isPath(pathname: string, root: string): boolean {
  return pathname === root || pathname.startsWith(`${root}/`);
}

/** Dashboard photo wallpaper is hidden on Music Assistant and Energy. */
export function hidesDashboardWallpaper(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return isPath(pathname, "/music") || isPath(pathname, "/energy");
}

/** Energy uses a flat white/black fill instead of the themed page color. */
export function usesNeutralPageFill(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return isPath(pathname, "/energy");
}
