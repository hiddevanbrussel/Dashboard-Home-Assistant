"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOnboardingCompleted } from "@/lib/onboarding-completed";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const completed = getOnboardingCompleted();
    const isOnboardingStart = pathname === "/onboarding/start";
    const isOnboardingWizard = pathname === "/onboarding";
    if (!completed && !isOnboardingStart && !isOnboardingWizard) {
      router.replace("/onboarding/start");
    }
    setChecked(true);
  }, [pathname, router]);

  const completed = typeof window !== "undefined" && getOnboardingCompleted();
  const allowed =
    completed ||
    pathname === "/onboarding/start" ||
    pathname === "/onboarding";

  if (!checked || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page-light dark:bg-dark-page">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
