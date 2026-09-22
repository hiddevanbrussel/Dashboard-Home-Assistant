/** Minimal LRC / plain lyrics helpers for the now-playing overlay. */

export type LyricLine = {
  time: number | null;
  text: string;
};

/** Parse one LRC line like `[00:29.79] Some lyric text`. */
export function parseLrcLine(line: string): LyricLine {
  const match = line.match(/\[(\d+):(\d+)([.:]\d+)?\](.*)/);
  if (!match) {
    const text = line.trim();
    return { time: null, text: text || " " };
  }
  const minutes = parseInt(match[1]!, 10);
  const seconds = parseInt(match[2]!, 10);
  let milliseconds = 0;
  if (match[3]) {
    const decimalPart = match[3].replace(/[.:]/, ".");
    milliseconds = Math.round(parseFloat(`0${decimalPart}`) * 1000);
  }
  const time = minutes * 60 + seconds + milliseconds / 1000;
  return { time, text: (match[4] ?? "").trim() || " " };
}

/** Turn plain or LRC lyric text into display lines. */
export function parseLyricsText(raw: string | null | undefined): LyricLine[] {
  if (!raw || !raw.trim()) return [];
  const lines = raw
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0);
  const parsed = lines.map(parseLrcLine);
  const timed = parsed.filter((line) => line.time != null);
  // Prefer timed lines when most of the content looks like LRC.
  if (timed.length >= Math.max(2, Math.floor(parsed.length * 0.5))) {
    return timed.sort((a, b) => (a.time ?? 0) - (b.time ?? 0));
  }
  return parsed.map((line) => ({ time: null, text: line.text }));
}

/** Active line index for synced lyrics at `position` seconds. */
export function activeLyricIndex(lines: LyricLine[], positionSeconds: number): number {
  if (!lines.length) return -1;
  let active = -1;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i]!.time;
    if (t == null) return -1;
    if (t <= positionSeconds) active = i;
    else break;
  }
  return active;
}

export function extractTrackLyrics(item: unknown): { plain: string | null; lrc: string | null } {
  if (!item || typeof item !== "object") return { plain: null, lrc: null };
  const root = item as Record<string, unknown>;
  const meta =
    (root.metadata && typeof root.metadata === "object" ? (root.metadata as Record<string, unknown>) : null) ??
    (root.media_item && typeof root.media_item === "object"
      ? ((root.media_item as { metadata?: Record<string, unknown> }).metadata ?? null)
      : null);
  const plain =
    (typeof meta?.lyrics === "string" && meta.lyrics.trim() ? meta.lyrics : null) ??
    (typeof root.lyrics === "string" && root.lyrics.trim() ? root.lyrics : null);
  const lrc =
    (typeof meta?.lrc_lyrics === "string" && meta.lrc_lyrics.trim() ? meta.lrc_lyrics : null) ??
    (typeof root.lrc_lyrics === "string" && root.lrc_lyrics.trim() ? root.lrc_lyrics : null);
  return { plain, lrc };
}
