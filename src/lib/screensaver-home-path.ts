/** True for the main home dashboard, not room dashboards or other app pages. */
export function isMainDashboardPath(pathname: string): boolean {
  if (pathname === "/" || pathname === "/dashboards") return true;
  if (pathname.startsWith("/dashboards/room-")) return false;
  return /^\/dashboards\/[^/]+$/.test(pathname);
}
