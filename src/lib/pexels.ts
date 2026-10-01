/** Shared Pexels API helpers for screensaver photo/video routes. */

export const PEXELS_DEFAULT_QUERY = "nature landscape";
export const PEXELS_PHOTO_PER_PAGE = 40;
export const PEXELS_VIDEO_PER_PAGE = 20;
/** Cap random page depth so we stay within typical result sets. */
export const PEXELS_MAX_RANDOM_PAGE = 80;

export type PexelsKeySource = "env" | "header" | null;

/**
 * Prefer the server/Docker env key when set so a stale browser-stored key
 * cannot override a working `PEXELS_API_KEY`. Fall back to the client header.
 */
export function resolvePexelsApiKey(input: {
  envKey?: string | null;
  headerKey?: string | null;
}): { apiKey: string; source: PexelsKeySource } {
  const envKey = input.envKey?.trim() ?? "";
  if (envKey) return { apiKey: envKey, source: "env" };
  const headerKey = input.headerKey?.trim() ?? "";
  if (headerKey) return { apiKey: headerKey, source: "header" };
  return { apiKey: "", source: null };
}

/**
 * Pick a random page within the results the API actually has.
 * Requesting page 8 when `total_results` only covers 2 pages returns an empty
 * list — the previous fixed `1..10` random caused intermittent screensaver failures.
 */
export function pickPexelsPage(totalResults: number, perPage: number, random = Math.random): number {
  const safePerPage = Math.max(1, perPage);
  const total = Math.max(0, Math.floor(totalResults));
  if (total <= 0) return 1;
  const totalPages = Math.max(1, Math.ceil(total / safePerPage));
  const maxPage = Math.min(totalPages, PEXELS_MAX_RANDOM_PAGE);
  return Math.floor(random() * maxPage) + 1;
}

export function pickRandomItem<T>(items: T[], random = Math.random): T | null {
  if (!items.length) return null;
  return items[Math.floor(random() * items.length)] ?? null;
}

export type PexelsUpstreamErrorKind = "unauthorized" | "rate_limited" | "upstream" | "empty" | "network";

export function classifyPexelsHttpStatus(status: number): PexelsUpstreamErrorKind {
  if (status === 401 || status === 403) return "unauthorized";
  if (status === 429) return "rate_limited";
  return "upstream";
}

export function pexelsErrorMessage(kind: PexelsUpstreamErrorKind, status?: number): string {
  switch (kind) {
    case "unauthorized":
      return "Pexels API-key is ongeldig. Controleer de key in Instellingen → Apps → Pexels of PEXELS_API_KEY.";
    case "rate_limited":
      return "Pexels rate limit bereikt. Probeer het later opnieuw.";
    case "empty":
      return "Geen Pexels-media gevonden voor deze zoekterm. Probeer een bredere term.";
    case "network":
      return "Kon Pexels niet bereiken. Controleer de internetverbinding van de server.";
    default:
      return status ? `Pexels API error: ${status}` : "Pexels API error";
  }
}

export function buildPexelsSearchUrl(opts: {
  kind: "photo" | "video";
  query: string;
  page: number;
  perPage: number;
}): string {
  const q = encodeURIComponent(opts.query);
  if (opts.kind === "video") {
    return `https://api.pexels.com/videos/search?query=${q}&per_page=${opts.perPage}&page=${opts.page}&orientation=landscape`;
  }
  return `https://api.pexels.com/v1/search?query=${q}&per_page=${opts.perPage}&page=${opts.page}&orientation=landscape`;
}

export function buildPexelsCuratedUrl(page: number, perPage: number): string {
  return `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${page}`;
}

type PexelsListResponse = {
  total_results?: number;
  photos?: unknown[];
  videos?: unknown[];
};

/**
 * Fetch a random page of Pexels results without requesting pages that do not exist.
 * Uses page 1 to learn `total_results`, then optionally fetches another page.
 */
export async function fetchPexelsRandomPage(opts: {
  kind: "photo" | "video";
  apiKey: string;
  query: string;
  perPage: number;
  /** When true and query is empty, use curated photos (photos only). */
  allowCurated?: boolean;
  fetchImpl?: typeof fetch;
  random?: () => number;
}): Promise<
  | { ok: true; data: PexelsListResponse; page: number }
  | { ok: false; kind: PexelsUpstreamErrorKind; status?: number; details?: string }
> {
  const fetchImpl = opts.fetchImpl ?? fetch;
  const random = opts.random ?? Math.random;
  const query = opts.query.trim();
  const useCurated = opts.kind === "photo" && opts.allowCurated && !query;

  const firstUrl = useCurated
    ? buildPexelsCuratedUrl(1, opts.perPage)
    : buildPexelsSearchUrl({
        kind: opts.kind,
        query: query || PEXELS_DEFAULT_QUERY,
        page: 1,
        perPage: opts.perPage,
      });

  let firstRes: Response;
  try {
    firstRes = await fetchImpl(firstUrl, {
      headers: { Authorization: opts.apiKey },
      cache: "no-store",
    });
  } catch {
    return { ok: false, kind: "network" };
  }

  if (!firstRes.ok) {
    const details = await firstRes.text().catch(() => "");
    return {
      ok: false,
      kind: classifyPexelsHttpStatus(firstRes.status),
      status: firstRes.status,
      details,
    };
  }

  const firstData = (await firstRes.json()) as PexelsListResponse;
  const listKey = opts.kind === "video" ? "videos" : "photos";
  const firstItems = (firstData[listKey] as unknown[] | undefined) ?? [];
  const totalResults =
    typeof firstData.total_results === "number" && Number.isFinite(firstData.total_results)
      ? firstData.total_results
      : firstItems.length;

  if (firstItems.length === 0 || totalResults === 0) {
    return { ok: false, kind: "empty" };
  }

  const page = pickPexelsPage(totalResults, opts.perPage, random);
  if (page === 1) {
    return { ok: true, data: firstData, page: 1 };
  }

  const nextUrl = useCurated
    ? buildPexelsCuratedUrl(page, opts.perPage)
    : buildPexelsSearchUrl({
        kind: opts.kind,
        query: query || PEXELS_DEFAULT_QUERY,
        page,
        perPage: opts.perPage,
      });

  let nextRes: Response;
  try {
    nextRes = await fetchImpl(nextUrl, {
      headers: { Authorization: opts.apiKey },
      cache: "no-store",
    });
  } catch {
    // Network blip on page N — still return page 1 results.
    return { ok: true, data: firstData, page: 1 };
  }

  if (!nextRes.ok) {
    return { ok: true, data: firstData, page: 1 };
  }

  const nextData = (await nextRes.json()) as PexelsListResponse;
  const nextItems = (nextData[listKey] as unknown[] | undefined) ?? [];
  if (nextItems.length === 0) {
    return { ok: true, data: firstData, page: 1 };
  }
  return { ok: true, data: nextData, page };
}
