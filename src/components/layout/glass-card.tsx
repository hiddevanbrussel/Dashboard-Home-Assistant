"use client";

import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
};

export function GlassCard({
  children,
  className,
  as: Component = "div",
}: GlassCardProps) {
  return (
    <Component
      className={cn(
        "glass-card rounded-card border border-white/60 p-4 dark:border-white/10",
        "transition-shadow duration-150 hover:shadow-lg dark:hover:shadow-glass-dark",
        className
      )}
    >
      {children}
    </Component>
  );
}
