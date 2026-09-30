/** Trash / waste collection card: next pickup day + waste type themes. */

export type TrashTheme = "gft" | "restafval" | "pmd";

export type TrashPickup = {
  theme: TrashTheme;
  /** Raw waste type string from HA / demo (for display mapping). */
  typeRaw: string;
  /** Parsed pickup date, or null when unknown. */
  date: Date | null;
};

export const TRASH_CARD_DEFAULT_WIDTH = 320;
export const TRASH_CARD_DEFAULT_HEIGHT = 320;
export const TRASH_CARD_MIN_WIDTH = 240;
export const TRASH_CARD_MAX_WIDTH = 480;
export const TRASH_CARD_MIN_HEIGHT = 240;
export const TRASH_CARD_MAX_HEIGHT = 480;

export type TrashCardDensity = "comfortable" | "compact";

export function trashCardDensity(width: number, height: number): TrashCardDensity {
  if (width <= 280 || height <= 280) return "compact";
  return "comfortable";
}

export function clampTrashCardWidth(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return TRASH_CARD_DEFAULT_WIDTH;
  return Math.min(TRASH_CARD_MAX_WIDTH, Math.max(TRASH_CARD_MIN_WIDTH, Math.round(v)));
}

export function clampTrashCardHeight(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return TRASH_CARD_DEFAULT_HEIGHT;
  return Math.min(TRASH_CARD_MAX_HEIGHT, Math.max(TRASH_CARD_MIN_HEIGHT, Math.round(v)));
}

/** Resize from the bottom-right corner while keeping the top-left of the card fixed. */
export function resizeTrashCardFromBottomRight(input: {
  startWidth: number;
  startHeight: number;
  startLeft: number;
  startBottom: number;
  dx: number;
  dy: number;
  viewportWidth: number;
  viewportHeight: number;
}): { width: number; height: number; left: number; bottom: number } {
  const top = input.viewportHeight - input.startBottom - input.startHeight;
  const maxWidth = Math.max(
    TRASH_CARD_MIN_WIDTH,
    Math.min(TRASH_CARD_MAX_WIDTH, Math.floor(input.viewportWidth - input.startLeft))
  );
  const maxHeight = Math.max(
    TRASH_CARD_MIN_HEIGHT,
    Math.min(TRASH_CARD_MAX_HEIGHT, Math.floor(input.viewportHeight - Math.max(0, top)))
  );
  const width = Math.min(maxWidth, clampTrashCardWidth(input.startWidth + input.dx));
  const height = Math.min(maxHeight, clampTrashCardHeight(input.startHeight + input.dy));
  const bottom = Math.max(0, input.viewportHeight - Math.max(0, top) - height);
  return { width, height, left: input.startLeft, bottom };
}

/** Bump when replacing files under `public/trash/` so browsers pick up new art. */
export const TRASH_ASSETS_CACHE_BUST = "20260930a";

export const TRASH_THEME_ASSETS: Record<
  TrashTheme,
  {
    background: string;
    person: string;
    icon: string;
    /** Accent underline / chip icon frame fallback color */
    accent: string;
  }
> = {
  gft: {
    background: `/trash/gft_achtergrond.png?v=${TRASH_ASSETS_CACHE_BUST}`,
    person: `/trash/gft_persoon-container.png?v=${TRASH_ASSETS_CACHE_BUST}`,
    icon: `/trash/gft_icoon.png?v=${TRASH_ASSETS_CACHE_BUST}`,
    accent: "#2F7D3A",
  },
  restafval: {
    background: `/trash/restafval_achtergrond.png?v=${TRASH_ASSETS_CACHE_BUST}`,
    person: `/trash/restafval_persoon-container.png?v=${TRASH_ASSETS_CACHE_BUST}`,
    icon: `/trash/restafval_icoon.png?v=${TRASH_ASSETS_CACHE_BUST}`,
    accent: "#4A4A4A",
  },
  pmd: {
    background: `/trash/pmd_achtergrond.png?v=${TRASH_ASSETS_CACHE_BUST}`,
    person: `/trash/pmd_persoon-container.png?v=${TRASH_ASSETS_CACHE_BUST}`,
    icon: `/trash/pmd_icoon.png?v=${TRASH_ASSETS_CACHE_BUST}`,
    accent: "#E07A2F",
  },
};

/** Specific fraction tokens — always win over generic words like "waste"/"trash". */
const SPECIFIC_THEME_SYNONYMS: Record<TrashTheme, string[]> = {
  gft: [
    "gft afval",
    "gft-afval",
    "g.f.t.",
    "g.f.t",
    "gft",
    "groente fruit tuinafval",
    "groente fruit",
    "tuinafval",
    "groenafval",
    "groente",
    "fruit",
    "organisch",
    "organic",
    "biodegradable",
    "compost",
    "garden waste",
    "green waste",
    "groen",
    "garden",
    "bio",
    "apple",
  ],
  restafval: [
    "restafval",
    "rest afval",
    "residual waste",
    "huisvuil",
    "residual",
    "general waste",
    "grey bin",
    "gray bin",
    "grijs",
    "grey",
    "gray",
    "mixed",
    "refuse",
    "rest",
  ],
  pmd: [
    "pmd afval",
    "pmd-afval",
    "p.m.d.",
    "p.m.d",
    "pbd",
    "pmd",
    "drankenkartons",
    "drinkkarton",
    "plastic metal",
    "plastics",
    "plastic",
    "metaal",
    "metal",
    "packaging",
    "verpakking",
    "carton",
    "recycling",
    "orange",
    "oranje",
  ],
};

/** Generic words that often appear in entity ids; only used when no specific token matches. */
const GENERIC_THEME_SYNONYMS: Record<TrashTheme, string[]> = {
  gft: [],
  restafval: ["trash", "garbage", "waste", "bag", "general"],
  pmd: [],
};

function normalizeToken(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_./-]+/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchSynonymList(
  text: string,
  synonymsByTheme: Record<TrashTheme, string[]>
): TrashTheme | null {
  const ranked: { theme: TrashTheme; synonym: string }[] = [];
  for (const theme of Object.keys(synonymsByTheme) as TrashTheme[]) {
    for (const synonym of synonymsByTheme[theme]) {
      ranked.push({ theme, synonym });
    }
  }
  // Prefer longer / more specific matches first (e.g. restafval before rest).
  ranked.sort((a, b) => b.synonym.length - a.synonym.length);

  for (const { theme, synonym } of ranked) {
    const syn = normalizeToken(synonym);
    if (!syn) continue;
    if (text === syn) return theme;
    // Entity ids like sensor.afvalwijzer_gft_morgen — token boundary match
    if (text.split(" ").includes(syn)) return theme;
    if (text.includes(syn)) return theme;
  }
  return null;
}

/** Map a free-form waste type string (or entity id / friendly name) to a theme. */
export function mapWasteTypeToTheme(raw: unknown): TrashTheme | null {
  if (raw == null) return null;
  const text = normalizeToken(String(raw));
  if (!text) return null;

  // Specific fraction tokens beat generic entity-id words ("waste", "trash", …).
  const specific = matchSynonymList(text, SPECIFIC_THEME_SYNONYMS);
  if (specific) return specific;
  return matchSynonymList(text, GENERIC_THEME_SYNONYMS);
}

/** Resolve theme with fallbacks from multiple candidate strings. */
export function resolveTrashTheme(...candidates: unknown[]): TrashTheme {
  for (const c of candidates) {
    const theme = mapWasteTypeToTheme(c);
    if (theme) return theme;
  }
  return "gft";
}

/** Assets + accent for a resolved waste theme (background, person, icon). */
export function trashThemeAssets(theme: TrashTheme) {
  return TRASH_THEME_ASSETS[theme];
}

const DATE_ATTR_KEYS = [
  "next_date",
  "pickup_date",
  "collection_date",
  "date",
  "day_date",
  "next_pickup_date",
  "ophaaldatum",
  "waste_collection_date",
  "Sort_date",
  "sort_date",
  "year_month_day_date",
];

const TYPE_ATTR_KEYS = [
  "waste_type",
  "type",
  "fraction",
  "waste_fraction",
  "afvalsoort",
  "garbage_type",
  "description",
  "next_waste_type",
  "next_type",
  "pickup_type",
];

function attrString(attrs: Record<string, unknown> | undefined, keys: string[]): string | null {
  if (!attrs) return null;
  for (const key of keys) {
    const v = attrs[key];
    if (v == null || v === "") continue;
    if (typeof v === "string" || typeof v === "number") {
      const text = String(v).trim();
      if (text) return text;
    }
  }
  return null;
}

/** Parse common HA date formats into a local Date at noon. */
export function parseTrashDate(raw: unknown, ref: Date = new Date()): Date | null {
  if (raw == null || raw === "" || raw === "unknown" || raw === "unavailable") return null;

  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    const d = new Date(raw);
    d.setHours(12, 0, 0, 0);
    return d;
  }

  if (typeof raw === "number" && Number.isFinite(raw)) {
    // Days-until style (Afvalwijzer sometimes uses state as days)
    if (raw >= 0 && raw <= 366) {
      const d = new Date(ref);
      d.setHours(12, 0, 0, 0);
      d.setDate(d.getDate() + Math.round(raw));
      return d;
    }
    // Unix seconds / ms
    const ms = raw > 1e12 ? raw : raw * 1000;
    const d = new Date(ms);
    if (!Number.isNaN(d.getTime())) {
      d.setHours(12, 0, 0, 0);
      return d;
    }
    return null;
  }

  const text = String(raw).trim();
  if (!text) return null;
  const lower = text.toLowerCase();

  if (lower === "today" || lower === "vandaag") {
    const d = new Date(ref);
    d.setHours(12, 0, 0, 0);
    return d;
  }
  if (lower === "tomorrow" || lower === "morgen") {
    const d = new Date(ref);
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    return d;
  }

  // Pure day count
  if (/^\d{1,3}$/.test(text)) {
    const days = Number(text);
    if (days >= 0 && days <= 366) {
      const d = new Date(ref);
      d.setHours(12, 0, 0, 0);
      d.setDate(d.getDate() + days);
      return d;
    }
  }

  // YYYY-MM-DD or YYYY/MM/DD
  let m = text.match(/^(\d{4})[/.-](\d{1,2})[/.-](\d{1,2})/);
  if (m) {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0, 0);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // DD-MM-YYYY or DD/MM/YYYY (common NL)
  m = text.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/);
  if (m) {
    const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), 12, 0, 0, 0);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // ISO datetime
  const iso = Date.parse(text);
  if (!Number.isNaN(iso)) {
    const d = new Date(iso);
    d.setHours(12, 0, 0, 0);
    return d;
  }

  return null;
}

function looksLikeDate(raw: unknown): boolean {
  return parseTrashDate(raw) != null && mapWasteTypeToTheme(raw) == null;
}

function looksLikeType(raw: unknown): boolean {
  return mapWasteTypeToTheme(raw) != null;
}

export type HaEntitySnapshot = {
  entity_id?: string;
  state?: string | null;
  attributes?: Record<string, unknown>;
};

/**
 * Resolve next pickup from flexible HA bindings.
 * Supports:
 * - Single sensor with type in state and date in attributes (or vice versa)
 * - Separate type entity + date entity
 * - Afvalwijzer-style per-fraction sensors (state = date, type from entity_id / friendly_name)
 */
export function resolveTrashPickup(input: {
  typeEntity?: HaEntitySnapshot | null;
  dateEntity?: HaEntitySnapshot | null;
  /** When only one entity is bound, pass it here (also used as typeEntity fallback). */
  primaryEntity?: HaEntitySnapshot | null;
  /** Used when HA data has a date but no recognizable waste type. */
  fallbackTheme?: TrashTheme;
  ref?: Date;
}): TrashPickup | null {
  const ref = input.ref ?? new Date();
  const fallbackTheme = input.fallbackTheme ?? "gft";
  const primary = input.primaryEntity ?? input.typeEntity ?? null;
  const typeEnt = input.typeEntity ?? primary;
  const dateEnt = input.dateEntity ?? null;

  const typeCandidates: unknown[] = [];
  const dateCandidates: unknown[] = [];

  const pushType = (v: unknown) => {
    if (v != null && String(v).trim()) typeCandidates.push(v);
  };
  const pushDate = (v: unknown) => {
    if (v != null && String(v).trim()) dateCandidates.push(v);
  };

  if (dateEnt) {
    pushDate(dateEnt.state);
    pushDate(attrString(dateEnt.attributes, DATE_ATTR_KEYS));
  }

  if (typeEnt) {
    const state = typeEnt.state;
    const attrs = typeEnt.attributes ?? {};
    const friendly = attrs.friendly_name;
    // Prefer explicit type attrs / state over entity_id (ids often contain "waste").
    pushType(attrString(attrs, TYPE_ATTR_KEYS));

    if (looksLikeType(state)) {
      pushType(state);
    } else if (looksLikeDate(state)) {
      pushDate(state);
    } else {
      pushType(state);
      pushDate(state);
    }

    pushType(friendly);
    pushType(typeEnt.entity_id);
    pushDate(attrString(attrs, DATE_ATTR_KEYS));
  }

  if (primary && primary !== typeEnt) {
    pushType(attrString(primary.attributes, TYPE_ATTR_KEYS));
    if (looksLikeType(primary.state)) pushType(primary.state);
    else pushType(primary.state);
    pushType(primary.attributes?.friendly_name);
    pushType(primary.entity_id);
    pushDate(attrString(primary.attributes, DATE_ATTR_KEYS));
    if (looksLikeDate(primary.state)) pushDate(primary.state);
  }

  let typeRaw = "";
  let theme: TrashTheme | null = null;
  for (const c of typeCandidates) {
    const t = mapWasteTypeToTheme(c);
    if (t) {
      theme = t;
      typeRaw = String(c).trim();
      break;
    }
  }

  let date: Date | null = null;
  for (const c of dateCandidates) {
    date = parseTrashDate(c, ref);
    if (date) break;
  }

  if (!theme && !date && !typeRaw) return null;

  const resolvedTheme = theme ?? resolveTrashTheme(...typeCandidates, fallbackTheme);
  if (!typeRaw) {
    typeRaw = resolvedTheme;
  }

  return { theme: resolvedTheme, typeRaw, date };
}

/** Demo pickup matching the mockup (GFT on a Friday). */
export function trashDemoPickup(theme: TrashTheme = "gft", ref: Date = new Date()): TrashPickup {
  // Next Friday from ref (or today if Friday)
  const d = new Date(ref);
  d.setHours(12, 0, 0, 0);
  const day = d.getDay(); // 0 Sun
  const daysUntilFri = (5 - day + 7) % 7;
  d.setDate(d.getDate() + daysUntilFri);
  // Offset demos so the three themes land on different Fridays
  if (theme === "restafval") d.setDate(d.getDate() + 7);
  if (theme === "pmd") d.setDate(d.getDate() + 14);
  const labels: Record<TrashTheme, string> = {
    gft: "Gft",
    restafval: "Restafval",
    pmd: "PMD",
  };
  return { theme, typeRaw: labels[theme], date: d };
}

export type TrashLocale = "en" | "nl";

const TYPE_LABELS: Record<TrashLocale, Record<TrashTheme, string>> = {
  en: { gft: "Organic", restafval: "General waste", pmd: "PMD" },
  nl: { gft: "Gft", restafval: "Restafval", pmd: "PMD" },
};

/** Localized display label for a waste theme / raw type. */
export function formatTrashTypeLabel(
  theme: TrashTheme,
  typeRaw: string | undefined,
  locale: TrashLocale
): string {
  const mapped = mapWasteTypeToTheme(typeRaw);
  if (mapped === theme || !typeRaw?.trim()) {
    return TYPE_LABELS[locale][theme];
  }
  // Prefer short known labels when raw is noisy (entity ids)
  if (mapped) return TYPE_LABELS[locale][mapped];
  const cleaned = typeRaw.replace(/^sensor\./i, "").replace(/[_-]+/g, " ").trim();
  if (!cleaned || cleaned.length > 28) return TYPE_LABELS[locale][theme];
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/**
 * Format pickup date like the mockup: "Vrijdag 2 Oktober" / "Friday 2 October".
 * Capitalizes weekday and month for both locales.
 */
export function formatTrashPickupDate(date: Date | null, locale: TrashLocale): string {
  if (!date || Number.isNaN(date.getTime())) return "—";
  const loc = locale === "nl" ? "nl-NL" : "en-GB";
  const weekday = date.toLocaleDateString(loc, { weekday: "long" });
  const day = date.getDate();
  const month = date.toLocaleDateString(loc, { month: "long" });
  const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  return `${cap(weekday)} ${day} ${cap(month)}`;
}
