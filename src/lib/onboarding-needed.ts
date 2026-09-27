/**
 * Soft onboarding entry helpers.
 * Fresh installs should see the wizard; auto-created empty "Home" dashboards
 * (from GET /api/dashboard) must not count as completed setup.
 */

export type DashboardOnboardingSnapshot = {
  id?: string;
  name?: string | null;
  theme?: string | null;
  widgets?: unknown;
};

/** Default names used by auto-create and the soft name step. */
const DEFAULT_DASHBOARD_NAMES = new Set(["home", "thuis"]);

export function parseDashboardWidgets(widgets: unknown): unknown[] {
  if (Array.isArray(widgets)) return widgets;
  if (typeof widgets === "string") {
    try {
      const parsed = JSON.parse(widgets) as unknown;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function isPristineDashboard(dashboard: DashboardOnboardingSnapshot | null | undefined): boolean {
  if (!dashboard?.id) return false;
  const name = (dashboard.name ?? "").trim().toLowerCase();
  if (name && !DEFAULT_DASHBOARD_NAMES.has(name)) return false;
  const theme = (dashboard.theme ?? "auto").trim().toLowerCase();
  if (theme && theme !== "auto") return false;
  return parseDashboardWidgets(dashboard.widgets).length === 0;
}

/**
 * When localStorage has no onboarding_completed flag, decide whether to open the wizard.
 * - No dashboard → need onboarding
 * - Only a pristine empty Home/Thuis → need onboarding (likely auto-seeded)
 * - Any customized dashboard → treat as existing install
 */
export function needsSoftOnboarding(
  dashboard: DashboardOnboardingSnapshot | null | undefined
): boolean {
  if (!dashboard?.id) return true;
  return isPristineDashboard(dashboard);
}
