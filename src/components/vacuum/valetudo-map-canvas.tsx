"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lookupRef = useRef<Lookup | null>(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setViewport({
        w: Math.max(0, Math.floor(rect.width)),
        h: Math.max(0, Math.floor(rect.height)),
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

    const off = document.createElement("canvas");
    off.width = mapW;
    off.height = mapH;
    const offCtx = off.getContext("2d");
    if (!offCtx) return;
    offCtx.putImageData(image, 0, 0);

    const availW = viewport.w || mapW;
    const availH = viewport.h || mapH;
    const scale = Math.max(1, Math.min(availW / mapW, availH / mapH));
    const displayW = Math.max(1, Math.floor(mapW * scale));
    const displayH = Math.max(1, Math.floor(mapH * scale));
    const dpr = typeof window !== "undefined" ? Math.min(3, window.devicePixelRatio || 1) : 1;

    canvas.style.width = `${displayW}px`;
    canvas.style.height = `${displayH}px`;
    canvas.width = Math.round(displayW * dpr);
    canvas.height = Math.round(displayH * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, displayW, displayH);
    ctx.drawImage(off, 0, 0, displayW, displayH);

    const toDisplay = (pt: { x: number; y: number }) => ({
      x: (pt.x - bounds.minX + pad) * (displayW / mapW),
      y: (pt.y - bounds.minY + pad) * (displayH / mapH),
    });

    const pixelSize = map.pixelSize && map.pixelSize > 0 ? map.pixelSize : 5;
    const markerR = Math.max(5, Math.min(11, scale * 0.7));

    for (const entity of map.entities ?? []) {
      const pt = entityPointToPixel(entity.points ?? [], pixelSize);
      if (!pt) continue;
      const { x, y } = toDisplay(pt);
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

    if (scale >= 3) {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `600 ${Math.max(12, Math.min(18, Math.round(scale * 1.1)))}px ui-sans-serif, system-ui, sans-serif`;
      for (const layer of layers) {
        if (layer.type !== "segment") continue;
        const id = normalizeSegmentId(layer.metaData?.segmentId);
        if (!id) continue;
        const center = segmentCentroid(layer);
        if (!center) continue;
        const { x, y } = toDisplay(center);
        const label = segmentLabel(layer, id);
        ctx.lineWidth = 4;
        ctx.strokeStyle = selected.has(id) ? "rgba(71,0,181,0.9)" : "rgba(255,255,255,0.92)";
        ctx.fillStyle = selected.has(id) ? "#ffffff" : "#2a203a";
        ctx.strokeText(label, x, y);
        ctx.fillText(label, x, y);
      }
    }

    lookupRef.current = { data: lookup, width: mapW, height: mapH, ids };
  }, [map, selectedIds, viewport]);

  useEffect(() => {
    draw();
  }, [draw]);

  function handlePointer(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const lookup = lookupRef.current;
    if (!canvas || !lookup) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (lookup.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (lookup.height / rect.height));
    if (x < 0 || y < 0 || x >= lookup.width || y >= lookup.height) return;
    const index = lookup.data[y * lookup.width + x];
    const id = lookup.ids[index];
    if (id) onToggleSegment(id);
  }

  return (
    <div ref={wrapRef} className={cn("flex h-full min-h-0 w-full items-center justify-center", className)}>
      <canvas
        ref={canvasRef}
        onPointerUp={handlePointer}
        className="cursor-pointer touch-manipulation"
        style={{ imageRendering: "pixelated" }}
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
