import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export function GET(request: NextRequest) {
  const size = Math.min(
    512,
    Math.max(16, parseInt(request.nextUrl.searchParams.get("size") ?? "192", 10))
  );

  const radius = Math.round(size * 0.22);
  const fontSize = Math.round(size * 0.38);
  const iconSize = Math.round(size * 0.52);
  const strokeW = Math.round(size * 0.045);

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: "linear-gradient(145deg, #3b22a0 0%, #5d38d4 60%, #7c55e8 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: radius,
          position: "relative",
        }}
      >
        {/* House icon (simplified SVG via foreignObject isn't supported in ImageResponse, use divs) */}
        {/* Roof triangle */}
        <div
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            borderLeft: `${iconSize * 0.55}px solid transparent`,
            borderRight: `${iconSize * 0.55}px solid transparent`,
            borderBottom: `${iconSize * 0.45}px solid rgba(255,255,255,0.92)`,
            top: size * 0.16,
          }}
        />
        {/* House body */}
        <div
          style={{
            position: "absolute",
            width: iconSize * 0.78,
            height: iconSize * 0.52,
            background: "rgba(255,255,255,0.92)",
            bottom: size * 0.17,
            borderRadius: `0 0 ${Math.round(size * 0.04)}px ${Math.round(size * 0.04)}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Door */}
          <div
            style={{
              width: iconSize * 0.22,
              height: iconSize * 0.32,
              background: "#4D2FB2",
              borderRadius: `${Math.round(size * 0.03)}px ${Math.round(size * 0.03)}px 0 0`,
              marginTop: "auto",
            }}
          />
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}
