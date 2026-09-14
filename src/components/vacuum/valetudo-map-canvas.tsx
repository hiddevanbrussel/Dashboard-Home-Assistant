"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  entityPointToPixel,
  forEachLayerPixel,
  layerPixelBounds,
  normalizeSegmentId,
  segmentCentroid,
  segmentLabel,
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
/** Extra pixels per map cell so CSS scaling stays sharp enough for labels. */
const DRAW_SCALE = 4;

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

type Lookup = {
  data: Uint16Array;
  width: number;
  height: number;
  ids: string[];
};

export function ValetudoMapCanvas({ map, selectedIds, onToggleSegment, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lookupRef = useRef<Lookup | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const layers = map.layers ?? [];
    const bounds = layerPixelBounds(layers);
    if (!bounds) return;

    const pad = 4;
    const mapW = bounds.width + pad * 2;
    const mapH = bounds.height + pad * 2;
    const image = new ImageData(mapW, mapH);
    const pixels = image.data;
    const ids = [""];
    const lookup = new Uint16Array(mapW * mapH);
    const selected = new Set(selectedIds);

    const put = (px: number, py: number, r: number, g: number, b: number, a: number, segmentIndex = 0) => {
      const x = px - bounds.minX + pad;
      const y = py - bounds.minY + pad;
      if (x < 0 || y < 0 || x >= mapW || y >= mapH) return;
      const i = (y * mapW + x) * 4;
      pixels[i] = r;
      pixels[i + 1] = g;
      pixels[i + 2] = b;
      pixels[i + 3] = a;
      if (segmentIndex > 0) lookup[y * mapW + x] = segmentIndex;
    };

    for (const layer of layers) {
      if (layer.type !== "floor") continue;
      forEachLayerPixel(layer, (x, y) => put(x, y, 226, 222, 236, 255));
    }

    for (const layer of layers) {
      if (layer.type !== "segment") continue;
      const id = normalizeSegmentId(layer.metaData?.segmentId);
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

    const drawW = mapW * DRAW_SCALE;
    const drawH = mapH * DRAW_SCALE;
    canvas.width = drawW;
    canvas.height = drawH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    const off = document.createElement("canvas");
    off.width = mapW;
    off.height = mapH;
    const offCtx = off.getContext("2d");
    if (!offCtx) return;
    offCtx.putImageData(image, 0, 0);
    ctx.drawImage(off, 0, 0, drawW, drawH);

    const toDraw = (pt: { x: number; y: number }) => ({
      x: (pt.x - bounds.minX + pad) * DRAW_SCALE,
      y: (pt.y - bounds.minY + pad) * DRAW_SCALE,
    });

    const pixelSize = map.pixelSize && map.pixelSize > 0 ? map.pixelSize : 5;
    const markerR = 2.4 * DRAW_SCALE;

    for (const entity of map.entities ?? []) {
      const pt = entityPointToPixel(entity.points ?? [], pixelSize);
      if (!pt) continue;
      const { x, y } = toDraw(pt);
      ctx.beginPath();
      if (entity.type === "robot_position") {
        ctx.fillStyle = "#4700B5";
        ctx.arc(x, y, markerR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (entity.type === "charger_location") {
        ctx.fillStyle = "#16a34a";
        ctx.arc(x, y, markerR * 0.85, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    const fontSize = Math.max(12, Math.round(3.2 * DRAW_SCALE));
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `600 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
    for (const layer of layers) {
      if (layer.type !== "segment") continue;
      const id = normalizeSegmentId(layer.metaData?.segmentId);
      if (!id) continue;
      const center = segmentCentroid(layer);
      if (!center) continue;
      const { x, y } = toDraw(center);
      const label = segmentLabel(layer, id);
      const width = ctx.measureText(label).width;
      const padX = 8;
      const padY = 5;
      const boxW = width + padX * 2;
      const boxH = fontSize + padY * 2;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(x - boxW / 2, y - boxH / 2, boxW, boxH, 999);
      } else {
        ctx.rect(x - boxW / 2, y - boxH / 2, boxW, boxH);
      }
      ctx.fillStyle = selected.has(id) ? "rgba(71,0,181,0.92)" : "rgba(255,255,255,0.9)";
      ctx.fill();
      ctx.fillStyle = selected.has(id) ? "#ffffff" : "#2a203a";
      ctx.fillText(label, x, y);
    }

    lookupRef.current = { data: lookup, width: mapW, height: mapH, ids };
  }, [map, selectedIds]);

  useEffect(() => {
    draw();
  }, [draw]);

  function handlePointer(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const lookup = lookupRef.current;
    if (!canvas || !lookup) return;
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(rect.width / lookup.width, rect.height / lookup.height);
    if (scale <= 0) return;
    const contentW = lookup.width * scale;
    const contentH = lookup.height * scale;
    const x = Math.floor((e.clientX - rect.left - (rect.width - contentW) / 2) / scale);
    const y = Math.floor((e.clientY - rect.top - (rect.height - contentH) / 2) / scale);
    if (x < 0 || y < 0 || x >= lookup.width || y >= lookup.height) return;
    const index = lookup.data[y * lookup.width + x];
    const id = lookup.ids[index];
    if (id) onToggleSegment(id);
  }

  return (
    <div className={cn("absolute inset-3 sm:inset-4", className)}>
      <canvas
        ref={canvasRef}
        onPointerUp={handlePointer}
        className="h-full w-full cursor-pointer touch-manipulation"
        style={{ imageRendering: "pixelated", objectFit: "contain" }}
      />
    </div>
  );
}

export function segmentNameFromLayers(layers: ValetudoMapLayer[], id: string): string {
  const layer = layers.find(
    (item) => item.type === "segment" && normalizeSegmentId(item.metaData?.segmentId) === id
  );
  return layer ? segmentLabel(layer, id) : id;
}
