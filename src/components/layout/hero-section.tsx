"use client";

import { cn } from "@/lib/utils";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  /** "light" | "dark" = gradient (geen afbeelding), string = URL (eigen upload of /hero-...) */
  backgroundImage?: "light" | "dark" | string;
  className?: string;
  children?: React.ReactNode;
};

const gradientLight =
  "linear-gradient(135deg, rgba(246,210,92,0.4) 0%, rgba(180,139,255,0.3) 50%, rgba(100,120,140,0.5) 100%)";
const gradientDark =
  "linear-gradient(135deg, rgba(43,63,75,0.9) 0%, rgba(31,47,58,0.95) 50%, rgba(107,228,107,0.15) 100%)";

export function HeroSection({
  title,
  subtitle,
  backgroundImage,
  className,
  children,
}: HeroSectionProps) {
  const useGradient =
    backgroundImage === "light" || backgroundImage === "dark";
  const bgUrl =
    backgroundImage && !useGradient ? backgroundImage : undefined;

  return (
    <section
      className={cn(
        "relative flex min-h-[320px] flex-col justify-end rounded-card overflow-hidden",
        className
      )}
    >
      {useGradient && (
        <div
          className="absolute inset-0"
          style={{
            background:
              backgroundImage === "dark" ? gradientDark : gradientLight,
          }}
          aria-hidden
        />
      )}
      {bgUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgUrl})` }}
          aria-hidden
        />
      )}
      <div
        className="absolute inset-0 bg-hero-overlay dark:bg-dark-card/60"
        aria-hidden
      />
      <div className="relative z-10 p-8">
        <h1 className="text-hero-title font-bold tracking-tight text-white drop-shadow-sm">
          {title}
        </h1>
        <p className="mt-2 text-hero-subtitle text-white/95">{subtitle}</p>
        {children}
      </div>
    </section>
  );
}
