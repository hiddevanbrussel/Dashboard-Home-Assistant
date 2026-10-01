import { NextRequest, NextResponse } from "next/server";
import {
  PEXELS_DEFAULT_QUERY,
  PEXELS_PHOTO_PER_PAGE,
  fetchPexelsRandomPage,
  pexelsErrorMessage,
  pickRandomItem,
  resolvePexelsApiKey,
} from "@/lib/pexels";

type PexelsPhoto = {
  src?: { large2x?: string; large?: string; original?: string; landscape?: string };
  url: string;
  photographer: string;
};

/** Haalt een willekeurige foto op van Pexels voor de screensaver. */
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
      kind: "photo",
      apiKey,
      query,
      perPage: PEXELS_PHOTO_PER_PAGE,
      allowCurated: false,
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

    const photos = (result.data.photos as PexelsPhoto[] | undefined) ?? [];
    const photo = pickRandomItem(photos);
    if (!photo) {
      return NextResponse.json(
        { error: pexelsErrorMessage("empty"), code: "empty" },
        { status: 404 }
      );
    }

    const imageUrl =
      photo.src?.large2x ?? photo.src?.large ?? photo.src?.landscape ?? photo.src?.original ?? null;
    if (!imageUrl) {
      return NextResponse.json({ error: "Geen afbeeldings-URL", code: "upstream" }, { status: 502 });
    }

    return NextResponse.json(
      { imageUrl, pexelsUrl: photo.url, photographer: photo.photographer },
      { headers: { "Cache-Control": "no-store, no-cache" } }
    );
  } catch (err) {
    console.error("[Pexels API]", err);
    return NextResponse.json(
      { error: pexelsErrorMessage("network"), code: "network" },
      { status: 500 }
    );
  }
}
