import { NextResponse } from "next/server";

const IMAGE_CACHE_MAX = 200;
const imageCache = new Map<
  string,
  { body: ArrayBuffer; contentType: string }
>();

function getCacheKey(imageUrl: string): string {
  try {
    const u = new URL(imageUrl);
    return u.origin + u.pathname + u.search;
  } catch {
    return imageUrl;
  }
}

/**
 * GET /api/music-assistant-image?baseUrl=...&token=...&url=...
 * Proxies image requests to Music Assistant so auth and CORS work.
 * Only fetches URLs that belong to the given baseUrl (same origin).
 * Caches responses in memory (and via Cache-Control in the browser) for faster repeat loads.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const baseUrl = searchParams.get("baseUrl")?.replace(/\/+$/, "");
  const token = searchParams.get("token") ?? "";
  const urlParam = searchParams.get("url");

  if (!baseUrl || !urlParam) {
    return NextResponse.json({ error: "baseUrl and url required" }, { status: 400 });
  }

  const imageUrl = urlParam.startsWith("http") ? urlParam : `${baseUrl}${urlParam.startsWith("/") ? "" : "/"}${urlParam}`;

  try {
    const parsed = new URL(imageUrl);
    const baseParsed = new URL(baseUrl.startsWith("http") ? baseUrl : `http://${baseUrl}`);
    if (parsed.hostname !== baseParsed.hostname || parsed.port !== baseParsed.port) {
      return NextResponse.json({ error: "URL must be same host as baseUrl" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const cacheKey = getCacheKey(imageUrl);
  const cached = imageCache.get(cacheKey);
  if (cached) {
    return new NextResponse(cached.body, {
      headers: {
        "Content-Type": cached.contentType,
        "Cache-Control": "private, max-age=604800, stale-while-revalidate=86400",
        "X-Cache": "HIT",
      },
    });
  }

  try {
    const headers: HeadersInit = { Accept: "image/*" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(imageUrl, { headers });

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";

    if (imageCache.size >= IMAGE_CACHE_MAX) {
      const firstKey = imageCache.keys().next().value;
      if (firstKey !== undefined) imageCache.delete(firstKey);
    }
    imageCache.set(cacheKey, { body: arrayBuffer, contentType });

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=604800, stale-while-revalidate=86400",
        "X-Cache": "MISS",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
  }
}
