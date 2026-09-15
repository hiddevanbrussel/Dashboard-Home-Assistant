import { NextResponse } from "next/server";
import {
  isSafeImmichAssetId,
  isSafeImmichBaseUrl,
  joinImmichUrl,
} from "@/lib/immich-url";

/**
 * Stream an Immich thumbnail or video through this app so the screensaver can
 * use a same-origin URL (and Range requests keep working for video).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const baseUrl = (searchParams.get("baseUrl") ?? "").replace(/\/+$/, "");
  const apiKey = (searchParams.get("apiKey") ?? "").trim();
  const id = (searchParams.get("id") ?? "").trim();
  const kind = searchParams.get("kind") === "video" ? "video" : "preview";

  if (!isSafeImmichBaseUrl(baseUrl) || !isSafeImmichAssetId(id) || !apiKey) {
    return NextResponse.json({ error: "Invalid Immich asset request" }, { status: 400 });
  }

  const path =
    kind === "video"
      ? `/api/assets/${id}/video/playback`
      : `/api/assets/${id}/thumbnail`;
  const search = kind === "video" ? "" : "?size=preview";
  const range = request.headers.get("range");

  const headers: Record<string, string> = {
    Accept: "*/*",
    "x-api-key": apiKey,
  };
  if (range) headers.Range = range;

  try {
    const res = await fetch(joinImmichUrl(baseUrl, path, search), {
      headers,
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok && res.status !== 206) {
      const text = await res.text();
      return NextResponse.json(
        { error: text.slice(0, 200) || `Immich media error: ${res.status}` },
        { status: res.status >= 400 && res.status < 600 ? res.status : 502 }
      );
    }

    const out = new Headers();
    out.set("Content-Type", res.headers.get("content-type") ?? (kind === "video" ? "video/mp4" : "image/jpeg"));
    const contentLength = res.headers.get("content-length");
    if (contentLength) out.set("Content-Length", contentLength);
    const contentRange = res.headers.get("content-range");
    if (contentRange) out.set("Content-Range", contentRange);
    const acceptRanges = res.headers.get("accept-ranges");
    if (acceptRanges) out.set("Accept-Ranges", acceptRanges);
    out.set("Cache-Control", "private, max-age=60");

    return new NextResponse(res.body, {
      status: res.status,
      headers: out,
    });
  } catch (err) {
    const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    return NextResponse.json(
      { error: timedOut ? `Could not reach Immich at ${baseUrl}` : "Failed to load Immich media" },
      { status: 502 }
    );
  }
}
