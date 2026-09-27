"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOnboardingCompleted, setOnboardingCompleted } from "@/lib/onboarding-completed";
import { needsSoftOnboarding } from "@/lib/onboarding-needed";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const completed = getOnboardingCompleted();
    const isOnboardingStart = pathname === "/onboarding/start";
    const isOnboardingWizard = pathname === "/onboarding";

    if (completed || isOnboardingStart || isOnboardingWizard) {
      setAllowed(true);
      return;
    }

    // No localStorage flag yet: open soft onboarding for fresh / pristine installs.
    // Existing installs (customized dashboard) are marked completed.
    fetch("/api/dashboard")
      .then((r) => (r.ok ? r.json() : Promise.resolve({ _fetchError: true })))
      .then((d) => {
        if (d && typeof d === "object" && (d as { _fetchError?: boolean })._fetchError) {
          setAllowed(true);
          return;
        }
        if (needsSoftOnboarding(d)) {
          setAllowed(false);
          router.replace("/onboarding");
          return;
        }
        if (d?.id) {
          setOnboardingCompleted();
          setAllowed(true);
          if (pathname === "/" || pathname === "/dashboards") {
            router.replace(`/dashboards/${d.id}`);
          }
          return;
        }
        setAllowed(true);
      })
      .catch(() => {
        setAllowed(true);
      });
  }, [pathname, router]);

  if (allowed === null || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page-light dark:bg-dark-page">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
