export type SubjectCodeMap = Record<string, string>;

export type FormattedEventTitle = {
  title: string;
  detail?: string;
  original?: string;
};

/** Built-in Dutch school subject codes (Magister / Somtoday / Zermelo style). */
const SUBJECT_CODES_NL: SubjectCodeMap = {
  FA: "Franse taal",
  FATL: "Franse taal",
  NE: "Nederlands",
  NL: "Nederlands",
  NETL: "Nederlands",
  EN: "Engels",
  ENTL: "Engels",
  DU: "Duits",
  DUTL: "Duits",
  SP: "Spaans",
  SPTL: "Spaans",
  LA: "Latijn",
  LATI: "Latijn",
  GR: "Grieks",
  GRIE: "Grieks",
  WI: "Wiskunde",
  WIS: "Wiskunde",
  WISK: "Wiskunde",
  WISA: "Wiskunde A",
  WISB: "Wiskunde B",
  WISC: "Wiskunde C",
  WISD: "Wiskunde D",
  NA: "Natuurkunde",
  NAT: "Natuurkunde",
  NATK: "Natuurkunde",
  SK: "Scheikunde",
  SCH: "Scheikunde",
  SCHK: "Scheikunde",
  SCHE: "Scheikunde",
  NASK: "Natuur- en scheikunde",
  BI: "Biologie",
  BIO: "Biologie",
  BIOK: "Biologie",
  AK: "Aardrijkskunde",
  AARD: "Aardrijkskunde",
  GS: "Geschiedenis",
  GESC: "Geschiedenis",
  EC: "Economie",
  ECON: "Economie",
  MA: "Maatschappijleer",
  MAAT: "Maatschappijleer",
  LO: "Lichamelijke opvoeding",
  LOPV: "Lichamelijke opvoeding",
  MU: "Muziek",
  MUZI: "Muziek",
  TE: "Tekenen",
  DR: "Drama",
  DRAM: "Drama",
  IN: "Informatica",
  INFO: "Informatica",
  BE: "Beeldende vorming",
  BEEL: "Beeldende vorming",
  BV: "Beeldende vorming",
  LV: "Levensbeschouwing",
  GD: "Godsdienst",
  FI: "Filosofie",
  CK: "CKV",
  CKV: "CKV",
  RE: "Rekenen",
  NLT: "Natuur, leven en technologie",
  MENT: "Mentoruur",
  MTR: "Mentoruur",
};

const SUBJECT_CODES_EN: SubjectCodeMap = {
  FA: "French",
  FATL: "French",
  NE: "Dutch",
  NL: "Dutch",
  NETL: "Dutch",
  EN: "English",
  ENTL: "English",
  DU: "German",
  DUTL: "German",
  SP: "Spanish",
  SPTL: "Spanish",
  LA: "Latin",
  LATI: "Latin",
  GR: "Greek",
  GRIE: "Greek",
  WI: "Mathematics",
  WIS: "Mathematics",
  WISK: "Mathematics",
  WISA: "Mathematics A",
  WISB: "Mathematics B",
  WISC: "Mathematics C",
  WISD: "Mathematics D",
  NA: "Physics",
  NAT: "Physics",
  NATK: "Physics",
  SK: "Chemistry",
  SCH: "Chemistry",
  SCHK: "Chemistry",
  SCHE: "Chemistry",
  NASK: "Physics and chemistry",
  BI: "Biology",
  BIO: "Biology",
  BIOK: "Biology",
  AK: "Geography",
  AARD: "Geography",
  GS: "History",
  GESC: "History",
  EC: "Economics",
  ECON: "Economics",
  MA: "Social studies",
  MAAT: "Social studies",
  LO: "Physical education",
  LOPV: "Physical education",
  MU: "Music",
  MUZI: "Music",
  TE: "Art",
  DR: "Drama",
  DRAM: "Drama",
  IN: "Computer science",
  INFO: "Computer science",
  BE: "Visual arts",
  BEEL: "Visual arts",
  BV: "Visual arts",
  LV: "Religious studies",
  GD: "Religion",
  FI: "Philosophy",
  CK: "Cultural education",
  CKV: "Cultural education",
  RE: "Arithmetic",
  NLT: "Nature, life and technology",
  MENT: "Mentor hour",
  MTR: "Mentor hour",
};

function normalizeCodeMap(map: SubjectCodeMap): SubjectCodeMap {
  const out: SubjectCodeMap = {};
  for (const [key, value] of Object.entries(map)) {
    const code = key.trim().toUpperCase();
    const label = value.trim();
    if (code && label) out[code] = label;
  }
  return out;
}

export function subjectCodesFor(language: string, custom: SubjectCodeMap = {}): SubjectCodeMap {
  const base = language === "nl" ? SUBJECT_CODES_NL : SUBJECT_CODES_EN;
  return { ...base, ...normalizeCodeMap(custom) };
}

const LEADING_CODE = /^([A-Za-z][A-Za-z0-9]{0,5})(?:\s*[-–]\s*|\s+)(.+)$/;

/** Turn "FA - ihu - rg1a,ra1a" into a readable subject name when the code is known. */
export function formatCalendarTitle(summary: string, codes: SubjectCodeMap): FormattedEventTitle {
  const raw = summary.trim();
  if (!raw) return { title: "" };

  const whole = codes[raw.toUpperCase()];
  if (whole) return { title: whole, original: raw === whole ? undefined : raw };

  const match = raw.match(LEADING_CODE);
  if (!match) return { title: raw };

  const code = match[1].toUpperCase();
  const label = codes[code];
  if (!label) return { title: raw };

  const rest = match[2]
    .split(/\s+[-–]\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  return {
    title: label,
    detail: rest.length > 0 ? rest.join(" · ") : undefined,
    original: raw,
  };
}
