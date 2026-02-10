"use client";

import Link from "next/link";
import { useThemeStore } from "@/stores/theme-store";

const gradientLight =
  "linear-gradient(135deg, rgba(246,210,92,0.4) 0%, rgba(180,139,255,0.3) 50%, rgba(100,120,140,0.5) 100%)";
const gradientDark =
  "linear-gradient(135deg, rgba(43,63,75,0.9) 0%, rgba(31,47,58,0.95) 50%, rgba(107,228,107,0.15) 100%)";

export default function OnboardingStartPage() {
  const resolved = useThemeStore((s) => s.resolved);
  const bg = resolved === "dark" ? gradientDark : gradientLight;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-page-light dark:bg-dark-page">
      <div
        className="absolute inset-0 opacity-90 dark:opacity-95"
        style={{ background: bg }}
        aria-hidden
      />
      <main className="relative z-10 max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
          Home Assistant Dashboard Builder
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed">
          Build your own dashboard with live Home Assistant data in minutes.
          Connect your instance, pick entities, and add widgets for lights, climate, media, and more.
        </p>
        <ul className="mt-8 text-left inline-block text-gray-600 dark:text-gray-300 space-y-2">
          <li>• One overview for all your smart devices</li>
          <li>• Automation, climate, lights, media player and weather</li>
          <li>• Customisable layout and custom background</li>
        </ul>
        <Link
          href="/onboarding"
          className="mt-10 inline-block rounded-full bg-accent-yellow dark:bg-accent-green px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg hover:opacity-90 transition-opacity"
        >
          Get Started
        </Link>
      </main>
    </div>
  );
}
