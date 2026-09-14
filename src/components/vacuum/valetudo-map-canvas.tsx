"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  entityPointToPixel,
  forEachLayerPixel,
  layerPixelBounds,
  type ValetudoMapLayer,
  type ValetudoRawMap,
} from "@/lib/valetudo-map";

const SEGMENT_COLORS = [
  [124, 92, 196],
  [72, 149, 196],
  [196, 132, 72],
  [72, 176, 132],
  [176, 72, 124],
  [92, 164, 72],
  [72, 116, 176],
  [196, 92, 92],
] as const;

const SELECTED = [71, 0, 181] as const;

function colorForSegment(id: string, selected: boolean): readonly [number, number, number] {
  if (selected) return SELECTED;
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return SEGMENT_COLORS[Math.abs(hash) % SEGMENT_COLORS.length];
}

type Props = {
  map: ValetudoRawMap;
  selectedIds: string[];
  onToggleSegment: (id: string) => void;
  className?: string;
};

export function ValetudoMapCanvas({ map, selectedIds, onToggleSegment, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lookupRef = useRef<{
    data: Uint16Array;
    width: number;
    height: number;
    ids: string[];
    minX: number;
    minY: number;
  } | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const layers = map.layers ?? [];
    const bounds = layerPixelBounds(layers);
    if (!bounds) return;

    const pad = 4;
    const width = bounds.width + pad * 2;
    const height = bounds.height + pad * 2;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = ctx.createImageData(width, height);
    const pixels = image.data;
    const ids = [""];
    const lookup = new Uint16Array(width * height);
    const selected = new Set(selectedIds);

    const put = (px: number, py: number, r: number, g: number, b: number, a: number, segmentIndex = 0) => {
      const x = px - bounds.minX + pad;
      const y = py - bounds.minY + pad;
      if (x < 0 || y < 0 || x >= width || y >= height) return;
      const i = (y * width + x) * 4;
      pixels[i] = r;
      pixels[i + 1] = g;
      pixels[i + 2] = b;
      pixels[i + 3] = a;
      if (segmentIndex > 0) lookup[y * width + x] = segmentIndex;
    };

    for (const layer of layers) {
      if (layer.type !== "floor") continue;
      forEachLayerPixel(layer, (x, y) => put(x, y, 226, 222, 236, 255));
    }

    for (const layer of layers) {
      if (layer.type !== "segment") continue;
      const id = layer.metaData?.segmentId;
      if (!id) continue;
      let index = ids.indexOf(id);
      if (index < 0) {
        ids.push(id);
        index = ids.length - 1;
      }
      const [r, g, b] = colorForSegment(id, selected.has(id));
      const alpha = selected.has(id) ? 230 : 200;
      forEachLayerPixel(layer, (x, y) => put(x, y, r, g, b, alpha, index));
    }

    for (const layer of layers) {
      if (layer.type !== "wall") continue;
      forEachLayerPixel(layer, (x, y) => put(x, y, 42, 32, 58, 255));
    }

    ctx.putImageData(image, 0, 0);

    const pixelSize = map.pixelSize && map.pixelSize > 0 ? map.pixelSize : 5;
    const toCanvas = (pt: { x: number; y: number }) => ({
      x: pt.x - bounds.minX + pad,
      y: pt.y - bounds.minY + pad,
    });

    for (const entity of map.entities ?? []) {
      const pt = entityPointToPixel(entity.points ?? [], pixelSize);
      if (!pt) continue;
      const { x, y } = toCanvas(pt);
      ctx.beginPath();
      if (entity.type === "robot_position") {
        ctx.fillStyle = "#4700B5";
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (entity.type === "charger_location") {
        ctx.fillStyle = "#16a34a";
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    lookupRef.current = {
      data: lookup,
      width,
      height,
      ids,
      minX: bounds.minX,
      minY: bounds.minY,
    };
  }, [map, selectedIds]);

  useEffect(() => {
    draw();
  }, [draw]);

  function handlePointer(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const lookup = lookupRef.current;
    if (!canvas || !lookup) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    if (x < 0 || y < 0 || x >= lookup.width || y >= lookup.height) return;
    const index = lookup.data[y * lookup.width + x];
    const id = lookup.ids[index];
    if (id) onToggleSegment(id);
  }

  return (
    <canvas
      ref={canvasRef}
      onPointerUp={handlePointer}
      className={cn("max-h-full max-w-full cursor-pointer touch-manipulation", className)}
      style={{ imageRendering: "pixelated" }}
    />
  );
}

export function segmentNameFromLayers(layers: ValetudoMapLayer[], id: string): string {
  const layer = layers.find((l) => l.type === "segment" && l.metaData?.segmentId === id);
  const name = layer?.metaData?.name?.trim();
  return name || id;
}
