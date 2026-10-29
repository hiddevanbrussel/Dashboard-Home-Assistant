"use client";

import { useEffect, useRef, useState } from "react";
import {
  anchorPoint,
  batteryLed,
  mintLine,
  panelPolygon,
  samplePolyline,
  type Point,
} from "@/lib/energy-house-anchors";
import { flowDurationMs, type HouseVariantId } from "@/lib/energy-now";

const DOTS = 8;
const SAMPLES = 16;

function scale(point: Point, width: number, height: number): Point {
  return { x: (point.x / 100) * width, y: (point.y / 100) * height };
}

function cycle(points: readonly Point[], offset: number): Point[] {
  if (points.length === 0) return [];
  const start = offset % points.length;
  const spun = [...points.slice(start), ...points.slice(0, start)];
  const first = spun[0];
  return first ? [...spun, first] : spun;
}

/**
 * Live layers in the same percent space as the render.
 * The viewBox matches the pixel size so dots and the LED stay circles.
 * Motion is transform and opacity only.
 */
export function NowHeroLayers({
  variant,
  animate,
  step,
  panelGlow,
  batteryGlow,
  dark,
}: {
  variant: HouseVariantId;
  animate: boolean;
  step: 1 | 2 | 3;
  panelGlow: boolean;
  batteryGlow: boolean;
  dark: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<SVGPolygonElement | null>(null);
  const battRef = useRef<HTMLSpanElement | null>(null);
  const dotRefs = useRef<Array<SVGCircleElement | null>>([]);
  const [box, setBox] = useState({ w: 960, h: 727 });

  useEffect(() => {
    const node = hostRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const read = () => {
      const rect = node.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      setBox({ w: rect.width, h: rect.height });
    };
    read();
    const observer = new ResizeObserver(read);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const panels = panelPolygon(variant).map((point) => scale(point, box.w, box.h));
  const line = mintLine(variant).map((point) => scale(point, box.w, box.h));
  const sampled = samplePolyline(line, SAMPLES);
  const dotPoints = sampled.filter((_, index) => index % 2 === 0).slice(0, DOTS);
  const ledRaw = batteryLed(variant);
  const ledPoint = ledRaw.length > 0 ? scale(ledRaw[0] as Point, box.w, box.h) : null;
  const battery = anchorPoint(variant, "batterij");
  const pointsAttr = (points: readonly Point[]) => points.map((point) => `${point.x},${point.y}`).join(" ");

  useEffect(() => {
    const animations: Animation[] = [];
    const track = (animation: Animation) => {
      animation.finished.catch(() => undefined);
      animations.push(animation);
    };
    const path = samplePolyline(mintLine(variant), SAMPLES).map((point) => scale(point, box.w, box.h));
    const rest = path.filter((_, index) => index % 2 === 0).slice(0, DOTS);
    const place = (node: SVGElement, point: Point, opacity: string) => {
      node.style.transform = `translate(${point.x}px, ${point.y}px)`;
      node.style.opacity = opacity;
    };
    dotRefs.current.forEach((dot, index) => {
      const point = rest[index];
      if (!dot || !point) return;
      if (!animate || path.length < 2) {
        place(dot, point, "1");
        return;
      }
      const frames = cycle(path, index * 2).map((frame, frameIndex, all) => ({
        transform: `translate(${frame.x}px, ${frame.y}px)`,
        opacity: frameIndex === 0 || frameIndex === all.length - 1 ? 0.35 : 1,
      }));
      track(dot.animate(frames, { duration: flowDurationMs(step), iterations: Infinity, easing: "linear" }));
    });
    const glow = glowRef.current;
    if (glow) {
      if (!animate) glow.style.opacity = "0.85";
      else {
        track(
          glow.animate(
            [{ opacity: 0.6 }, { opacity: 1 }, { opacity: 0.6 }],
            { duration: 4800, iterations: Infinity, easing: "ease-in-out" }
          )
        );
      }
    }
    const batt = battRef.current;
    if (batt) {
      if (!animate) batt.style.opacity = "0.85";
      else {
        track(
          batt.animate(
            [{ opacity: 0.6 }, { opacity: 1 }, { opacity: 0.6 }],
            { duration: 3600, iterations: Infinity, easing: "ease-in-out" }
          )
        );
      }
    }
    return () => {
      for (const animation of animations) {
        try {
          animation.cancel();
        } catch {
          // Some DOM implementations reject a cancelled animation.
        }
      }
    };
  }, [animate, step, variant, box.w, box.h]);

  const battColor = dark ? "#38BDF8" : "#0EA5E9";

  return (
    <div ref={hostRef} className="pointer-events-none absolute inset-0" data-now-layers>
      {batteryGlow && battery ? (
        <span
          ref={battRef}
          data-battery-glow
          className="absolute block rounded-full"
          style={{
            left: `${battery.x}%`,
            top: `${battery.y}%`,
            width: box.w * 0.16,
            height: box.w * 0.16,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(closest-side, color-mix(in srgb, ${battColor} 45%, transparent), transparent)`,
          }}
        />
      ) : null}
      <svg
        viewBox={`0 0 ${box.w} ${box.h}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden
      >
        {panelGlow && panels.length >= 3 ? (
          <>
            <defs>
              <linearGradient id="now-panel-glow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FFE9A8" stopOpacity="0.55" />
                <stop offset="0.55" stopColor="#FCD34D" stopOpacity="0.12" />
                <stop offset="1" stopColor="#FCD34D" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon
              ref={glowRef}
              points={pointsAttr(panels)}
              fill="url(#now-panel-glow)"
              className="[mix-blend-mode:screen]"
            />
            <polygon
              points={pointsAttr(panels)}
              fill="none"
              stroke="#FDE68A"
              strokeWidth={1.4}
              strokeLinejoin="round"
              opacity={dark ? 0.7 : 0.55}
            />
          </>
        ) : null}
        {line.length >= 2 ? (
          <polyline
            points={pointsAttr(line)}
            fill="none"
            stroke="#6EE7B7"
            strokeWidth={2.2}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.95}
          />
        ) : null}
        {dotPoints.map((point, index) => (
          <circle
            key={`${variant}-${index}`}
            ref={(node) => {
              dotRefs.current[index] = node;
            }}
            cx={0}
            cy={0}
            r={2.3}
            fill="#ECFDF5"
            stroke="#10B981"
            strokeWidth={1.2}
            style={{ transform: `translate(${point.x}px, ${point.y}px)` }}
          />
        ))}
        {ledPoint ? (
          <circle
            cx={ledPoint.x}
            cy={ledPoint.y}
            r={2.3}
            fill="#ECFDF5"
            stroke="#10B981"
            strokeWidth={1.2}
          />
        ) : null}
      </svg>
    </div>
  );
}
