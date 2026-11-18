/** Map CSS-pixel drawing coordinates exactly onto the rounded backing store. */
export function canvasBacking(cssWidth: number, cssHeight: number, dpr: number): {
  width: number; height: number; scaleX: number; scaleY: number;
} {
  const width = Math.max(1, Math.round(cssWidth * dpr));
  const height = Math.max(1, Math.round(cssHeight * dpr));
  return { width, height, scaleX: cssWidth > 0 ? width / cssWidth : dpr,
    scaleY: cssHeight > 0 ? height / cssHeight : dpr };
}
