"use client";

import { useThemeStore } from "@/stores/theme-store";

const gradientLight =
  "linear-gradient(135deg, rgba(246,210,92,0.4) 0%, rgba(180,139,255,0.3) 50%, rgba(100,120,140,0.5) 100%)";
const gradientDark =
  "linear-gradient(135deg, rgba(43,63,75,0.9) 0%, rgba(31,47,58,0.95) 50%, rgba(107,228,107,0.15) 100%)";

type OnboardingFullscreenLayoutProps = {
  step: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

/**
 * Fullscreen onboarding layout: no AppShell/menus, gradient background.
 * Used for all onboarding steps so the user only sees the wizard until done.
 */
export function OnboardingFullscreenLayout({
  step,
  title,
  subtitle,
  children,
}: OnboardingFullscreenLayoutProps) {
  const resolved = useThemeStore((s) => s.resolved);
  const bg = resolved === "dark" ? gradientDark : gradientLight;

  return (
    <div className="min-h-screen flex flex-col bg-page-light dark:bg-dark-page">
      <div
        className="fixed inset-0 opacity-90 dark:opacity-95"
        style={{ background: bg }}
        aria-hidden
      />
      <main className="relative z-10 flex-1 flex flex-col items-center p-6 pt-12 pb-24 overflow-auto">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight text-center">
            {title}
          </h1>
          <p className="mt-3 text-base md:text-lg text-gray-700 dark:text-gray-200 text-center">
            {subtitle}
          </p>
          <div className="mt-8 rounded-2xl bg-white/60 dark:bg-black/30 backdrop-blur-sm border border-white/40 dark:border-white/10 p-6 shadow-lg">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
