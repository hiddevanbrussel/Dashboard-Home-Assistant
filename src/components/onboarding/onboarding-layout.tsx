"use client";

import { AppShell } from "@/components/layout/app-shell";
import { HeroSection } from "@/components/layout/hero-section";
import { GlassCard } from "@/components/layout/glass-card";

type OnboardingLayoutProps = {
  step: number;
  heroTitle: string;
  heroSubtitle: string;
  rightCards: React.ReactNode;
  children: React.ReactNode;
};

export function OnboardingLayout({
  step,
  heroTitle,
  heroSubtitle,
  rightCards,
  children,
}: OnboardingLayoutProps) {
  return (
    <AppShell activeTab="/dashboards" showFloatingToolbar={false}>
      <div className="flex gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <HeroSection
            title={heroTitle}
            subtitle={heroSubtitle}
            backgroundImage={step === 1 ? undefined : "light"}
          />
          <div className="rounded-card">{children}</div>
        </div>
        <div className="w-[380px] shrink-0 space-y-4 flex flex-col">
          {rightCards}
        </div>
      </div>
    </AppShell>
  );
}
