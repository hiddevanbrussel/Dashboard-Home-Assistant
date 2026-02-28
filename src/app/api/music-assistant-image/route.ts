import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const IMAGE_CACHE_MAX = 350;
const imageCache = new Map<
  string,
  { body: ArrayBuffer; contentType: string }
>();

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=2592000, stale-while-revalidate=604800, immutable",
};

function getCacheKey(imageUrl: string): string {
  try {
    const u = new URL(imageUrl);
    return u.origin + u.pathname + u.search;
  } catch {
    return imageUrl;
  }
}

function getCacheFilename(cacheKey: string): string {
  return createHash("sha256").update(cacheKey).digest("hex") + ".cache";
}

function getCacheDir(): string | null {
  try {
    const dir = path.join(process.cwd(), ".cache", "music-images");
    return dir;
  } catch {
    return null;
  }
}

async function readFromDisk(cacheKey: string): Promise<{ body: ArrayBuffer; contentType: string } | null> {
  const dir = getCacheDir();
  if (!dir) return null;
  try {
    const filePath = path.join(dir, getCacheFilename(cacheKey));
    if (!existsSync(filePath)) return null;
    const metaPath = filePath + ".meta";
    if (!existsSync(metaPath)) return null;
    const [buf, meta] = await Promise.all([
      readFile(filePath),
      readFile(metaPath, "utf-8"),
    ]);
    const contentType = meta.trim() || "image/jpeg";
    return { body: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), contentType };
  } catch {
    return null;
  }
}

async function writeToDisk(cacheKey: string, body: ArrayBuffer, contentType: string): Promise<void> {
  const dir = getCacheDir();
  if (!dir) return;
  try {
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, getCacheFilename(cacheKey));
    const metaPath = filePath + ".meta";
    await Promise.all([
      writeFile(filePath, Buffer.from(body)),
      writeFile(metaPath, contentType, "utf-8"),
    ]);
  } catch {
    // ignore disk write errors
  }
}

/** Allowlisted music CDN domains for external playlist/album covers (Spotify, Apple, etc.) */
const ALLOWED_IMAGE_HOSTS = new Set([
  "i.scdn.co", "m.scdn.co", "image-cdn-ak.spotifycdn.com", "image-cdn-fa.spotifycdn.com",
  "mzstatic.com", "is1-ssl.mzstatic.com", "is2-ssl.mzstatic.com", "is3-ssl.mzstatic.com", "is4-ssl.mzstatic.com", "is5-ssl.mzstatic.com",
  "s.mzstatic.com", "a1.mzstatic.com", "a2.mzstatic.com", "a3.mzstatic.com", "a4.mzstatic.com", "a5.mzstatic.com",
  "m.media-amazon.com", "images-na.ssl-images-amazon.com",
  "lh3.googleusercontent.com", "i.ytimg.com",
]);

/**
 * GET /api/music-assistant-image?baseUrl=...&token=...&url=...
 * Proxies image requests to Music Assistant so auth and CORS work.
 * Also proxies external URLs from allowlisted music CDN domains (Spotify, Apple Music, etc.).
 * Caches in memory + filesystem for fast repeat loads.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const baseUrl = searchParams.get("baseUrl")?.replace(/\/+$/, "") ?? "";
  const token = searchParams.get("token") ?? "";
  const urlParam = searchParams.get("url");

  if (!urlParam) {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }

  const imageUrl = urlParam.startsWith("http") ? urlParam : `${baseUrl}${baseUrl ? (urlParam.startsWith("/") ? "" : "/") : ""}${urlParam}`;

  try {
    const parsed = new URL(imageUrl);
    const isExternal = imageUrl.startsWith("http");
    const isAllowedExternal = isExternal && ALLOWED_IMAGE_HOSTS.has(parsed.hostname);
    const isSameHost = baseUrl && (() => {
      try {
        const baseParsed = new URL(baseUrl.startsWith("http") ? baseUrl : `http://${baseUrl}`);
        return parsed.hostname === baseParsed.hostname && parsed.port === baseParsed.port;
      } catch {
        return false;
      }
    })();

    if (!isSameHost && !isAllowedExternal) {
      if (isExternal) {
        return NextResponse.json({ error: "External URL not from allowed music CDN" }, { status: 400 });
      }
      if (!baseUrl) {
        return NextResponse.json({ error: "baseUrl required for relative URLs" }, { status: 400 });
      }
    }
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const cacheKey = getCacheKey(imageUrl);

  const memCached = imageCache.get(cacheKey);
  if (memCached) {
    return new NextResponse(memCached.body, {
      headers: { "Content-Type": memCached.contentType, ...CACHE_HEADERS, "X-Cache": "HIT-MEM" },
    });
  }

  const diskCached = await readFromDisk(cacheKey);
  if (diskCached) {
    if (imageCache.size < IMAGE_CACHE_MAX) {
      imageCache.set(cacheKey, diskCached);
    }
    return new NextResponse(diskCached.body, {
      headers: { "Content-Type": diskCached.contentType, ...CACHE_HEADERS, "X-Cache": "HIT-DISK" },
    });
  }

  try {
    const headers: HeadersInit = { Accept: "image/*" };
    const isExternalCdn = (() => {
      try {
        const u = new URL(imageUrl);
        return ALLOWED_IMAGE_HOSTS.has(u.hostname);
      } catch {
        return false;
      }
    })();
    if (!isExternalCdn && token) headers.Authorization = `Bearer ${token}`;

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

    writeToDisk(cacheKey, arrayBuffer, contentType).catch(() => {});

    return new NextResponse(arrayBuffer, {
      headers: { "Content-Type": contentType, ...CACHE_HEADERS, "X-Cache": "MISS" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
  }
}
