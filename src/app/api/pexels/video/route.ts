import { NextRequest, NextResponse } from "next/server";
import {
  PEXELS_DEFAULT_QUERY,
  PEXELS_VIDEO_PER_PAGE,
  fetchPexelsRandomPage,
  pexelsErrorMessage,
  pickRandomItem,
  resolvePexelsApiKey,
} from "@/lib/pexels";

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

function preferHttps(url: string): string {
  if (url.startsWith("http://")) return `https://${url.slice("http://".length)}`;
  return url;
}

function pickVideoFile(files: PexelsVideoFile[]): PexelsVideoFile | null {
  if (!files.length) return null;
  return (
    files.find((f) => f.quality === "hd" && f.width >= 1280) ??
    files.find((f) => f.quality === "hd") ??
    files.find((f) => f.quality === "sd") ??
    files[0] ??
    null
  );
}

/** Haalt een willekeurige video op van Pexels voor de screensaver. */
export async function GET(request: NextRequest) {
  const { apiKey } = resolvePexelsApiKey({
    envKey: process.env.PEXELS_API_KEY,
    headerKey: request.headers.get("x-pexels-api-key"),
  });
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Geen Pexels API-key. Vul de API-key in bij Instellingen → Apps → Pexels, of voeg PEXELS_API_KEY toe aan .env / de add-on opties.",
        code: "missing_key",
      },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() || PEXELS_DEFAULT_QUERY;

  try {
    const result = await fetchPexelsRandomPage({
      kind: "video",
      apiKey,
      query,
      perPage: PEXELS_VIDEO_PER_PAGE,
    });

    if (!result.ok) {
      const status =
        result.kind === "unauthorized" ? 401 : result.kind === "rate_limited" ? 429 : result.kind === "empty" ? 404 : 502;
      return NextResponse.json(
        {
          error: pexelsErrorMessage(result.kind, result.status),
          code: result.kind,
          details: result.details,
        },
        { status }
      );
    }

    const videos = (result.data.videos as PexelsVideo[] | undefined) ?? [];
    const video = pickRandomItem(videos);
    if (!video) {
      return NextResponse.json(
        { error: pexelsErrorMessage("empty"), code: "empty" },
        { status: 404 }
      );
    }

    const preferred = pickVideoFile(video.video_files ?? []);
    if (!preferred?.link) {
      return NextResponse.json({ error: "Geen video-URL gevonden", code: "upstream" }, { status: 502 });
    }

    return NextResponse.json(
      {
        videoUrl: preferHttps(preferred.link),
        videoType: preferred.file_type,
        pexelsUrl: video.url,
        photographer: video.user?.name ?? null,
      },
      { headers: { "Cache-Control": "no-store, no-cache" } }
    );
  } catch (err) {
    console.error("[Pexels Video API]", err);
    return NextResponse.json(
      { error: pexelsErrorMessage("network"), code: "network" },
      { status: 500 }
    );
  }
}
