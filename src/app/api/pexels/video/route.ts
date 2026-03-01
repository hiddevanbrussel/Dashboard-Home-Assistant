import { NextRequest, NextResponse } from "next/server";

type PexelsVideoFile = {
  id: number;
  quality: string;
  file_type: string;
  width: number;
  height: number;
  link: string;
};

type PexelsVideo = {
  id: number;
  url: string;
  user?: { name?: string };
  video_files?: PexelsVideoFile[];
};

/** Haalt een willekeurige video op van Pexels voor de screensaver. */
export async function GET(request: NextRequest) {
  const headerKey = request.headers.get("x-pexels-api-key")?.trim();
  const envKey = process.env.PEXELS_API_KEY?.trim();
  const apiKey = headerKey || envKey;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Geen Pexels API-key. Vul de API-key in bij Instellingen → Screensaver → Pexels, of voeg PEXELS_API_KEY toe aan .env" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() || "nature landscape";
  const page = Math.floor(Math.random() * 10) + 1;
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=20&page=${page}&orientation=landscape`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: apiKey },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Pexels API error: ${res.status}`, details: text },
        { status: 502 }
      );
    }

    const data = (await res.json()) as { videos?: PexelsVideo[] };
    const videos = data.videos ?? [];

    if (videos.length === 0) {
      return NextResponse.json({ error: "Geen video's gevonden" }, { status: 404 });
    }

    const video = videos[Math.floor(Math.random() * videos.length)];
    const files = video.video_files ?? [];

    // Kies voorkeur: HD ≥ 1280px → HD → SD → eerste beschikbare
    const preferred =
      files.find((f) => f.quality === "hd" && f.width >= 1280) ??
      files.find((f) => f.quality === "hd") ??
      files.find((f) => f.quality === "sd") ??
      files[0];

    if (!preferred?.link) {
      return NextResponse.json({ error: "Geen video-URL gevonden" }, { status: 502 });
    }

    return NextResponse.json(
      {
        videoUrl: preferred.link,
        videoType: preferred.file_type,
        pexelsUrl: video.url,
        photographer: video.user?.name ?? null,
      },
      { headers: { "Cache-Control": "no-store, no-cache" } }
    );
  } catch (err) {
    console.error("[Pexels Video API]", err);
    return NextResponse.json({ error: "Kon geen video ophalen van Pexels" }, { status: 500 });
  }
}
