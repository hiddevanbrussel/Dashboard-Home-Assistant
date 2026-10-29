"use client";

import { useEffect, useRef } from "react";
import {
  batteryLed,
  mintLine,
  panelPolygon,
  samplePolyline,
  type Point,
} from "@/lib/energy-house-anchors";
import { flowDurationMs, type HouseVariantId } from "@/lib/energy-now";

const DOTS = 8;
const SAMPLES = 16;

function pointsAttr(points: readonly Point[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

function cycle(points: readonly Point[], offset: number): Point[] {
  if (points.length === 0) return [];
  const start = offset % points.length;
  const spun = [...points.slice(start), ...points.slice(0, start)];
  const first = spun[0];
  return first ? [...spun, first] : spun;
}

/** Live layers in the same percent space as the render. Motion is transform and opacity only. */
export function NowHeroLayers({
  variant,
  animate,
  step,
}: {
  variant: HouseVariantId;
  animate: boolean;
  step: 1 | 2 | 3;
}) {
  const panels = panelPolygon(variant);
  const line = mintLine(variant);
  const led = batteryLed(variant);
  const sampled = samplePolyline(line, SAMPLES);
  const dotPoints = sampled.filter((_, index) => index % 2 === 0).slice(0, DOTS);
  const glowRef = useRef<SVGPolygonElement | null>(null);
  const ledRef = useRef<SVGCircleElement | null>(null);
  const dotRefs = useRef<Array<SVGCircleElement | null>>([]);

  useEffect(() => {
    const animations: Animation[] = [];
    const path = samplePolyline(mintLine(variant), SAMPLES);
    const rest = path.filter((_, index) => index % 2 === 0).slice(0, DOTS);
    const ledPoint = batteryLed(variant)[0];
    const place = (node: SVGElement, point: Point, opacity: string) => {
      node.style.transformBox = "view-box";
      node.style.transformOrigin = "0 0";
      node.style.transform = `translate(${point.x}%, ${point.y}%)`;
      node.style.opacity = opacity;
    };
    dotRefs.current.forEach((dot, index) => {
      const point = rest[index];
      if (!dot || !point) return;
      if (!animate) {
        place(dot, point, "1");
        return;
      }
      dot.style.transformBox = "view-box";
      dot.style.transformOrigin = "0 0";
      const frames = cycle(path, index * 2).map((frame, frameIndex, all) => ({
        transform: `translate(${frame.x}%, ${frame.y}%)`,
        opacity: frameIndex === 0 || frameIndex === all.length - 1 ? 0.35 : 1,
      }));
      animations.push(
        dot.animate(frames, { duration: flowDurationMs(step), iterations: Infinity, easing: "linear" })
      );
    });
    const glow = glowRef.current;
    if (glow) {
      if (!animate) glow.style.opacity = "0";
      else {
        animations.push(
          glow.animate(
            [{ opacity: 0.2 }, { opacity: 0.8 }, { opacity: 0.2 }],
            { duration: 2800, iterations: Infinity }
          )
        );
      }
    }
    const ledNode = ledRef.current;
    if (ledNode && ledPoint) {
      if (!animate) place(ledNode, ledPoint, "1");
      else {
        ledNode.style.transformBox = "view-box";
        ledNode.style.transformOrigin = "0 0";
        ledNode.style.transform = `translate(${ledPoint.x}%, ${ledPoint.y}%)`;
        animations.push(
          ledNode.animate(
            [{ opacity: 0.4 }, { opacity: 1 }, { opacity: 0.4 }],
            { duration: 1600, iterations: Infinity }
          )
        );
      }
    }
    return () => {
      for (const animation of animations) animation.cancel();
    };
  }, [animate, step, variant]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
      data-now-layers
    >
      {panels.length >= 3 ? (
        <polygon ref={glowRef} points={pointsAttr(panels)} fill="#6ee7b7" opacity={0} />
      ) : null}
      {line.length >= 2 ? (
        <polyline points={pointsAttr(line)} fill="none" stroke="#5eead4" strokeWidth={0.7} strokeLinejoin="round" strokeLinecap="round" />
      ) : null}
      {dotPoints.map((point, index) => (
        <circle
          key={`${variant}-${index}`}
          ref={(node) => {
            dotRefs.current[index] = node;
          }}
          cx={0}
          cy={0}
          r={1.1}
          fill="#5eead4"
          style={{ transformBox: "view-box", transformOrigin: "0 0", transform: `translate(${point.x}%, ${point.y}%)` }}
        />
      ))}
      {led[0] ? (
        <circle
          ref={ledRef}
          cx={0}
          cy={0}
          r={1.3}
          fill="#6ee7b7"
          style={{
            transformBox: "view-box",
            transformOrigin: "0 0",
            transform: `translate(${led[0].x}%, ${led[0].y}%)`,
          }}
        />
      ) : null}
    </svg>
  );
}
