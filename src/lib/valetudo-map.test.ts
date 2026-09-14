import { describe, expect, it } from "vitest";
import {
  entityPointToPixel,
  forEachLayerPixel,
  layerPixelBounds,
  normalizeSegmentId,
  segmentCentroid,
  segmentLabel,
} from "./valetudo-map";

describe("valetudo-map", () => {
  it("expands compressed pixel runs", () => {
    const points: Array<[number, number]> = [];
    forEachLayerPixel({ type: "segment", compressedPixels: [2, 4, 3] }, (x, y) => {
      points.push([x, y]);
    });
    expect(points).toEqual([
      [2, 4],
      [3, 4],
      [4, 4],
    ]);
  });

  it("reads uncompressed pixels", () => {
    const points: Array<[number, number]> = [];
    forEachLayerPixel({ type: "wall", pixels: [1, 1, 2, 3] }, (x, y) => {
      points.push([x, y]);
    });
    expect(points).toEqual([
      [1, 1],
      [2, 3],
    ]);
  });

  it("computes bounds of mixed layers", () => {
    expect(
      layerPixelBounds([
        { type: "floor", pixels: [0, 0, 10, 5] },
        { type: "wall", compressedPixels: [8, 2, 4] },
      ])
    ).toEqual({ minX: 0, minY: 0, maxX: 11, maxY: 5, width: 12, height: 6 });
  });

  it("converts entity cm coordinates to pixels", () => {
    expect(entityPointToPixel([250, 100], 5)).toEqual({ x: 50, y: 20 });
  });

  it("prefers a segment name over the id", () => {
    expect(segmentLabel({ type: "segment", metaData: { name: "Kitchen", segmentId: "16" } }, "16")).toBe(
      "Kitchen"
    );
    expect(segmentLabel({ type: "segment", metaData: { segmentId: "16" } }, "16")).toBe("16");
  });

  it("normalizes numeric segment ids", () => {
    expect(normalizeSegmentId(16)).toBe("16");
    expect(normalizeSegmentId(" 1 ")).toBe("1");
    expect(normalizeSegmentId("")).toBeNull();
  });

  it("computes a segment centroid", () => {
    expect(segmentCentroid({ type: "segment", compressedPixels: [0, 0, 4, 0, 1, 4] })).toEqual({
      x: 1.5,
      y: 0.5,
    });
  });
});
