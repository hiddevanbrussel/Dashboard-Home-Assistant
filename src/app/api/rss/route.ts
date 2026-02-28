import { NextResponse } from "next/server";

export type NewsItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
};

function extractTag(block: string, tag: string): string {
  const m =
    block.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, "i")) ??
    block.match(new RegExp(`<${tag}[^>]*/?>`, "i"));
  return (m?.[1] ?? "").trim();
}

function extractLink(block: string): string {
  // Atom <link href="..."/> or RSS <link>url</link>
  const hrefMatch = block.match(/<link[^>]+href=["']([^"']+)["']/i);
  if (hrefMatch) return hrefMatch[1].trim();
  return extractTag(block, "link");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parseRSS(xml: string, feedUrl: string): NewsItem[] {
  // Source: channel title (RSS) or feed title (Atom)
  const sourceMatch = xml.match(/<(?:channel|feed)[^>]*>[\s\S]*?<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i);
  const source = stripHtml(sourceMatch?.[1] ?? new URL(feedUrl).hostname);

  const items: NewsItem[] = [];
  const itemRegex = /<(?:item|entry)([\s\S]*?)<\/(?:item|entry)>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = stripHtml(extractTag(block, "title"));
    const link = extractLink(block);
    const description = stripHtml(
      extractTag(block, "description") ||
      extractTag(block, "summary") ||
      extractTag(block, "content")
    ).slice(0, 200);
    const pubDate =
      extractTag(block, "pubDate") ||
      extractTag(block, "published") ||
      extractTag(block, "updated") ||
      extractTag(block, "dc:date");

    if (title && link) {
      items.push({ title, link, description, pubDate, source });
    }
  }
  return items;
}

/**
 * GET /api/rss?url=<encoded_feed_url>
 * Fetches and parses an RSS or Atom feed server-side (avoids CORS).
 * Cached for 5 minutes via Next.js fetch cache.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "url parameter required" }, { status: 400 });
  }

  let feedUrl: string;
  try {
    feedUrl = decodeURIComponent(url);
    new URL(feedUrl); // validate
  } catch {
    return NextResponse.json({ error: "Invalid feed URL" }, { status: 400 });
  }

  try {
    const response = await fetch(feedUrl, {
      headers: { "User-Agent": "Dashboard/1.0 RSS Reader" },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Feed returned ${response.status}` },
        { status: 502 }
      );
    }

    const xml = await response.text();
    const items = parseRSS(xml, feedUrl);

    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch feed" },
      { status: 502 }
    );
  }
}
