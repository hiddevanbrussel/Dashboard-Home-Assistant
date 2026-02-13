import { NextRequest, NextResponse } from "next/server";

/** Haalt een willekeurige foto op van Pexels voor de screensaver. */
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
  const useSearch = query.length > 0;

  const url = useSearch
    ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=20&orientation=landscape`
    : `https://api.pexels.com/v1/curated?per_page=20`;

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

    const data = (await res.json()) as {
      photos?: { src?: { large2x?: string; original?: string }; url: string; photographer: string }[];
    };

    const photos = data.photos ?? [];
    if (photos.length === 0) {
      return NextResponse.json(
        { error: "Geen foto's gevonden" },
        { status: 404 }
      );
    }

    // Willekeurige foto kiezen voor variatie
    const photo = photos[Math.floor(Math.random() * photos.length)];
    const imageUrl = photo.src?.large2x ?? photo.src?.original ?? null;
    const pexelsUrl = photo.url;
    const photographer = photo.photographer;

    if (!imageUrl) {
      return NextResponse.json({ error: "Geen afbeeldings-URL" }, { status: 502 });
    }

    return NextResponse.json({ imageUrl, pexelsUrl, photographer });
  } catch (err) {
    console.error("[Pexels API]", err);
    return NextResponse.json(
      { error: "Kon geen foto ophalen van Pexels" },
      { status: 500 }
    );
  }
}
