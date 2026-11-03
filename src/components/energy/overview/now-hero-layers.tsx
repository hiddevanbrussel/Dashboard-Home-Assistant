"use client";

import { useLayoutEffect, useState } from "react";
import { flowPath, labelEdgePoint, type HouseLabelKind } from "@/lib/energy-house-labels";

export type HouseLineSpec = {
  kind: HouseLabelKind;
  accent: string;
  anchor: { x: number; y: number };
  towardHouse: boolean;
  flow: boolean;
  /** Front solar: dashed line over the ridge, no flow. */
  ridge?: boolean;
};

type DrawnLine = {
  kind: HouseLabelKind;
  accent: string;
  staticPath: string;
  flowPath: string | null;
  dashed: boolean;
  dot: { x: number; y: number } | null;
};

/**
 * Straight leaders from each label edge to its anchor.
 * The white dash is a second path and only exists while that flow is on.
 */
export function NowHeroLayers({ specs, sig }: { specs: readonly HouseLineSpec[]; sig: string }) {
  const [lines, setLines] = useState<DrawnLine[]>([]);

  useLayoutEffect(() => {
    const frame = document.querySelector("[data-now-frame]");
    if (!(frame instanceof HTMLElement)) {
      setLines([]);
      return;
    }
    const measure = () => {
      const frameRect = frame.getBoundingClientRect();
      if (frameRect.width < 1 || frameRect.height < 1) {
        setLines([]);
        return;
      }
      const next: DrawnLine[] = [];
      for (const spec of specs) {
        const button = frame.querySelector(`[data-now-label="${spec.kind}"]`);
        if (!(button instanceof HTMLElement)) continue;
        const pill = button.getBoundingClientRect();
        if (pill.width < 1 || pill.height < 1) continue;
        const edge = labelEdgePoint(
          {
            left: pill.left - frameRect.left,
            right: pill.right - frameRect.left,
            top: pill.top - frameRect.top,
            bottom: pill.bottom - frameRect.top,
          },
          {
            x: (spec.anchor.x / 100) * frameRect.width,
            y: (spec.anchor.y / 100) * frameRect.height,
          }
        );
        const anchor = {
          x: (spec.anchor.x / 100) * frameRect.width,
          y: (spec.anchor.y / 100) * frameRect.height,
        };
        if (spec.ridge) {
          const overX = anchor.x - frameRect.width * 0.025;
          const overY = anchor.y - frameRect.height * 0.018;
          const n = (value: number) => value.toFixed(1);
          next.push({
            kind: spec.kind,
            accent: spec.accent,
            staticPath: `M${n(edge.x)} ${n(edge.y)} L${n(anchor.x)} ${n(anchor.y)} L${n(overX)} ${n(overY)}`,
            flowPath: null,
            dashed: true,
            dot: anchor,
          });
          continue;
        }
        next.push({
          kind: spec.kind,
          accent: spec.accent,
          staticPath: flowPath(edge, anchor, true),
          flowPath: spec.flow ? flowPath(edge, anchor, spec.towardHouse) : null,
          dashed: false,
          dot: null,
        });
      }
      setLines(next);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    frame.querySelectorAll("[data-now-label]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [specs, sig]);

  return (
    <div className="pointer-events-none absolute inset-0" data-now-layers>
      <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        {lines.map((line) => (
          <g key={line.kind}>
            <path
              data-now-line={line.kind}
              d={line.staticPath}
              fill="none"
              stroke={line.accent}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeDasharray={line.dashed ? "2 4" : undefined}
            />
            {line.dot ? <circle data-now-ridge={line.kind} cx={line.dot.x} cy={line.dot.y} r={1.5} fill={line.accent} /> : null}
            {line.flowPath ? (
              <path
                data-now-flow={line.kind}
                className="energy-label-flow"
                d={line.flowPath}
                fill="none"
                stroke="#ffffff"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            ) : null}
          </g>
        ))}
      </svg>
    </div>
  );
}
