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
  const [shown, setShown] = useState<string | null>(effective);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  useEffect(() => {
    if (!effective) {
      setShown(null);
      return;
    }
    if (shown === effective) return;
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (!cancelled) setShown(effective);
    };
    img.onerror = () => {
      if (cancelled) return;
      if (fallback && effective === src) setImageError(true);
      else setShown(effective);
    };
    img.src = effective;
    return () => {
      cancelled = true;
    };
  }, [effective, fallback, shown, src]);

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
      {shown ? (
        <Image
          src={shown}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 576px"
          className="object-cover object-center transition-opacity duration-300"
          onError={fallback ? () => setImageError(true) : undefined}
        />
      ) : null}
    </div>
  );
}
