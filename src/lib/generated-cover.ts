const PALETTES: [string, string][] = [
  ["#4700B5", "#7C3AED"],
  ["#0E7490", "#22D3EE"],
  ["#BE185D", "#F472B6"],
  ["#C2410C", "#FB923C"],
  ["#166534", "#4ADE80"],
  ["#1D4ED8", "#60A5FA"],
  ["#6D28D9", "#C4B5FD"],
  ["#9F1239", "#FB7185"],
];

export function hashTitle(title: string): number {
  let hash = 0;
  for (let i = 0; i < title.length; i += 1) {
    hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function coverInitials(title: string): string {
  const words = title
    .trim()
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word));
  if (words.length === 0) return "♪";
  if (words.length === 1) return Array.from(words[0]).slice(0, 2).join("").toUpperCase();
  return `${Array.from(words[0])[0] ?? ""}${Array.from(words[1])[0] ?? ""}`.toUpperCase();
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function generatedCoverDataUri(title: string): string {
  const label = title.trim() || "Playlist";
  const hash = hashTitle(label);
  const [from, to] = PALETTES[hash % PALETTES.length];
  const initials = escapeXml(coverInitials(label));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${from}"/>
        <stop offset="1" stop-color="${to}"/>
      </linearGradient>
    </defs>
    <rect width="160" height="160" fill="url(#g)"/>
    <circle cx="128" cy="28" r="36" fill="white" fill-opacity="0.12"/>
    <circle cx="24" cy="132" r="48" fill="black" fill-opacity="0.12"/>
    <text x="80" y="96" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="52" font-weight="700" fill="white">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
