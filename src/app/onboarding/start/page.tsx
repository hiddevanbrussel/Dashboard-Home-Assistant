"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy entry — soft onboarding now lives at `/onboarding`. */
export default function OnboardingStartPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/onboarding");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-page-light dark:bg-dark-page">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-yellow border-t-transparent dark:border-accent-green" />
    </div>
  );
}
