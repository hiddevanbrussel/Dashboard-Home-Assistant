/** Dashboard photo wallpaper is hidden on Music Assistant in both themes. */
export function hidesDashboardWallpaper(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === "/music" || pathname.startsWith("/music/");
}
