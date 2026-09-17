export const SHEET_SEGMENT_PALETTE = [
  [245, 201, 74],
  [91, 155, 213],
  [241, 137, 107],
  [46, 196, 154],
  [168, 139, 214],
  [125, 184, 116],
] as const;

export function sheetSegmentColor(
  id: string,
  selected: boolean,
  orderIndex?: number
): readonly [number, number, number] {
  let index = orderIndex;
  if (index == null || !Number.isFinite(index) || index < 0) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
    index = Math.abs(hash);
  }
  const [r, g, b] = SHEET_SEGMENT_PALETTE[index % SHEET_SEGMENT_PALETTE.length];
  if (!selected) return [r, g, b];
  return [Math.round(r * 0.88), Math.round(g * 0.88), Math.round(b * 0.88)];
}

export function mixTowardWhite(r: number, g: number, b: number, amount: number): [number, number, number] {
  const t = Math.max(0, Math.min(1, amount));
  return [
    Math.round(r + (255 - r) * t),
    Math.round(g + (255 - g) * t),
    Math.round(b + (255 - b) * t),
  ];
}
