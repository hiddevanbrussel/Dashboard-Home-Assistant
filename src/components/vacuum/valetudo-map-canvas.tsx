"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { mixTowardWhite, sheetSegmentColor } from "@/lib/valetudo-map-style";
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
  appearance?: "default" | "card";
  showLabels?: boolean;
};

type Lookup = {
  data: Uint16Array;
  width: number;
  height: number;
  ids: string[];
};

export function ValetudoMapCanvas({
  map,
  selectedIds,
  onToggleSegment,
  className,
  appearance = "default",
  showLabels = true,
}: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const lookupRef = useRef<Lookup | null>(null);

  const draw = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
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
      if (layer.type !== "segment") continue;
      const id = normalizeSegmentId(layer.metaData?.segmentId);
      if (!id) continue;
      let index = ids.indexOf(id);
      if (index < 0) {
        ids.push(id);
        index = ids.length - 1;
      }
      const [r, g, b] = appearance === "card"
        ? sheetSegmentColor(id, selected.has(id), index - 1)
        : colorForSegment(id, selected.has(id));
      const alpha = appearance === "card" ? 255 : selected.has(id) ? 230 : 200;
      forEachLayerPixel(layer, (x, y) => put(x, y, r, g, b, alpha, index));
    }

    for (const layer of layers) {
      if (layer.type !== "wall") continue;
      if (appearance === "card") continue;
      forEachLayerPixel(layer, (x, y) => put(x, y, 42, 32, 58, 255));
    }

    if (appearance === "card") {
      const neighbor = (x: number, y: number) =>
        x < 0 || y < 0 || x >= mapW || y >= mapH ? 0 : lookup[y * mapW + x];
      const edge = new Uint8Array(mapW * mapH);
      for (let y = 0; y < mapH; y++) {
        for (let x = 0; x < mapW; x++) {
          const index = lookup[y * mapW + x];
          if (index === 0) continue;
          if (
            neighbor(x - 1, y) !== index ||
            neighbor(x + 1, y) !== index ||
            neighbor(x, y - 1) !== index ||
            neighbor(x, y + 1) !== index
          ) {
            edge[y * mapW + x] = 1;
          }
        }
      }
      for (let y = 0; y < mapH; y++) {
        for (let x = 0; x < mapW; x++) {
          const index = lookup[y * mapW + x];
          if (index === 0) continue;
          const i = (y * mapW + x) * 4;
          const thick =
            edge[y * mapW + x] === 1 ||
            (x > 0 && edge[y * mapW + x - 1] === 1) ||
            (x + 1 < mapW && edge[y * mapW + x + 1] === 1) ||
            (y > 0 && edge[(y - 1) * mapW + x] === 1) ||
            (y + 1 < mapH && edge[(y + 1) * mapW + x] === 1);
          if (thick) {
            pixels[i] = 255;
            pixels[i + 1] = 255;
            pixels[i + 2] = 255;
            pixels[i + 3] = 255;
            continue;
          }
          if (x % 5 === 0 || y % 5 === 0) {
            const [r, g, b] = mixTowardWhite(pixels[i], pixels[i + 1], pixels[i + 2], 0.28);
            pixels[i] = r;
            pixels[i + 1] = g;
            pixels[i + 2] = b;
          }
        }
      }
    }

    const drawW = mapW * DRAW_SCALE;
    const drawH = mapH * DRAW_SCALE;
    const canvas = document.createElement("canvas");
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

    lookupRef.current = { data: lookup, width: mapW, height: mapH, ids };
    img.src = canvas.toDataURL("image/png");
  }, [map, selectedIds, appearance]);

  useEffect(() => {
    draw();
  }, [draw]);

  const bounds = layerPixelBounds(map.layers ?? []);
  const mapW = bounds ? bounds.width + 8 : 1;
  const mapH = bounds ? bounds.height + 8 : 1;
  const roomLabels = useMemo(() => {
    const next = layerPixelBounds(map.layers ?? []);
    if (!next) return [];
    const width = next.width + 8;
    const height = next.height + 8;
    const items: { id: string; name: string; x: number; y: number }[] = [];
    for (const layer of map.layers ?? []) {
      if (layer.type !== "segment") continue;
      const id = normalizeSegmentId(layer.metaData?.segmentId);
      const center = segmentCentroid(layer);
      if (!id || !center) continue;
      items.push({
        id,
        name: segmentLabel(layer, id),
        x: ((center.x - next.minX + 4) / width) * 100,
        y: ((center.y - next.minY + 4) / height) * 100,
      });
    }
    return items;
  }, [map]);

  function handlePointer(e: React.PointerEvent<HTMLImageElement>) {
    const target = e.currentTarget;
    const lookup = lookupRef.current;
    if (!lookup) return;
    const rect = target.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (lookup.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (lookup.height / rect.height));
    if (x < 0 || y < 0 || x >= lookup.width || y >= lookup.height) return;
    const index = lookup.data[y * lookup.width + x];
    const id = lookup.ids[index];
    if (id) onToggleSegment(id);
  }

  return (
    <div
      className={cn(className)}
      style={
        appearance === "card"
          ? { position: "relative", width: "100%", height: "100%", containerType: "size" }
          : { position: "absolute", inset: 12, containerType: "size" }
      }
    >
      <div
        className="relative mx-auto"
        style={{
          width: `min(100cqw, calc(100cqh * ${mapW} / ${mapH}))`,
          height: `min(100cqh, calc(100cqw * ${mapH} / ${mapW}))`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          alt=""
          onPointerUp={handlePointer}
          className="cursor-pointer touch-manipulation"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            imageRendering: "pixelated",
          }}
        />
        {showLabels
          ? roomLabels.map((room) => {
              const selected = selectedIds.includes(room.id);
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSegment(room.id);
                  }}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm",
                    selected ? "bg-brand text-white" : "bg-white/90 text-gray-800"
                  )}
                  style={{ left: `${room.x}%`, top: `${room.y}%` }}
                >
                  {room.name}
                </button>
              );
            })
          : null}
      </div>
    </div>
  );
}

export function segmentNameFromLayers(layers: ValetudoMapLayer[], id: string): string {
  const layer = layers.find(
    (item) => item.type === "segment" && normalizeSegmentId(item.metaData?.segmentId) === id
  );
  return layer ? segmentLabel(layer, id) : id;
}
