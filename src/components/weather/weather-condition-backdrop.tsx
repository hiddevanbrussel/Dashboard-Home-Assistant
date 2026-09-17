"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { weatherBackgroundGradient, weatherImageSources } from "@/lib/weather-card";
import { useThemeStore } from "@/stores/theme-store";

export function WeatherConditionBackdrop({
  condition,
  className,
  fade = false,
}: {
  condition: string;
  className?: string;
  fade?: boolean;
}) {
  const isNight = useThemeStore((s) => s.resolved) === "dark";
  const gradient = weatherBackgroundGradient(condition);
  const { src, fallback } = weatherImageSources(condition, isNight);
  const [imageError, setImageError] = useState(false);
  const effective = imageError && fallback ? fallback : src;

  useEffect(() => {
    setImageError(false);
  }, [src]);

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden",
        fade &&
          "[mask-image:linear-gradient(to_bottom,black_38%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_38%,transparent_100%)]",
        className
      )}
      aria-hidden
    >
      <div className={cn("absolute inset-0 bg-gradient-to-b", gradient)} />
      {effective ? (
        <Image
          src={effective}
          alt=""
          fill
          sizes="(max-width: 500px) 100vw, 500px"
          className="object-cover object-center"
          onError={fallback ? () => setImageError(true) : undefined}
        />
      ) : null}
    </div>
  );
}
