"use client";

import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";

const gradientLight =
  "linear-gradient(135deg, rgba(246,210,92,0.35) 0%, rgba(255,255,255,0.5) 45%, rgba(180,200,210,0.45) 100%)";
const gradientDark =
  "linear-gradient(135deg, rgba(43,63,75,0.92) 0%, rgba(31,47,58,0.96) 55%, rgba(107,228,107,0.12) 100%)";

type SoftOnboardingLayoutProps = {
  step: number;
  totalSteps: number;
  question: string;
  hint?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

/**
 * Soft first-run layout: one question, short hint, progress dots, optional footer CTA.
 */
export function SoftOnboardingLayout({
  step,
  totalSteps,
  question,
  hint,
  children,
  footer,
}: SoftOnboardingLayoutProps) {
  const resolved = useThemeStore((s) => s.resolved);
  const bg = resolved === "dark" ? gradientDark : gradientLight;

  return (
    <div className="relative flex min-h-screen flex-col bg-page-light dark:bg-dark-page">
      <div className="pointer-events-none fixed inset-0 opacity-90" style={{ background: bg }} aria-hidden />
      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-12">
        <div className="mb-8 flex items-center justify-center gap-2" aria-label={`Step ${step} of ${totalSteps}`}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i + 1 === step
                  ? "w-8 bg-gray-900 dark:bg-accent-green"
                  : i + 1 < step
                    ? "w-4 bg-gray-900/40 dark:bg-accent-green/50"
                    : "w-4 bg-gray-900/15 dark:bg-white/20"
              )}
            />
          ))}
        </div>

        <h1 className="text-balance text-center text-3xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-4xl">
          {question}
        </h1>
        {hint ? (
          <p className="mt-3 text-center text-base leading-relaxed text-gray-600 dark:text-gray-300">
            {hint}
          </p>
        ) : null}

        <div className="mt-8 space-y-4">{children}</div>
        {footer ? <div className="mt-8 flex flex-col items-stretch gap-3 sm:items-center">{footer}</div> : null}
      </main>
    </div>
  );
}
