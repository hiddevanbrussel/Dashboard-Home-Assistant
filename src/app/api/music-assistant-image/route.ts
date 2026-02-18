import { NextResponse } from "next/server";

/**
 * GET /api/music-assistant-image?baseUrl=...&token=...&url=...
 * Proxies image requests to Music Assistant so auth and CORS work.
 * Only fetches URLs that belong to the given baseUrl (same origin).
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

  try {
    const headers: HeadersInit = { Accept: "image/*" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(imageUrl, { headers });

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    const blob = await res.blob();
    const contentType = res.headers.get("content-type") || "image/jpeg";

    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
  }
}
