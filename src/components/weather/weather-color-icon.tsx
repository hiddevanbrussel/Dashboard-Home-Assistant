"use client";

import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";
import { weatherIconSrc } from "@/lib/weather-card";

export function WeatherColorIcon({
  state,
  className,
}: {
  state: string;
  className?: string;
}) {
  return (
    // Color PNGs (not currentColor); keep a plain img so they stay crisp at small sizes.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={withBasePath(weatherIconSrc(state))}
      alt=""
      aria-hidden
      draggable={false}
      className={cn("shrink-0 object-contain", className ?? "h-8 w-8")}
    />
  );
}
