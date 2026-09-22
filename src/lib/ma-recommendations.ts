import { parseMaItemList } from "@/lib/ma-parse";

export type MaRecommendationFolder = Record<string, unknown>;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function textOf(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function parseRecommendationFolders(data: unknown): MaRecommendationFolder[] {
  const extra = ["recommendations", "folders", "rows"];
  const items = parseMaItemList(data, extra);
  return items.map(asRecord).filter((item): item is MaRecommendationFolder => item != null);
}

export function isStationsForYouFolder(folder: MaRecommendationFolder): boolean {
  const id = textOf(folder.item_id ?? folder.id).toLowerCase();
  const name = textOf(folder.name ?? folder.title).toLowerCase();
  const uri = textOf(folder.uri).toLowerCase();
  return (
    id.includes("stations_for_you") ||
    uri.includes("stations_for_you") ||
    name.includes("stations for you") ||
    name.includes("stations voor jou")
  );
}

export function folderProvider(folder: MaRecommendationFolder): string | null {
  const provider =
    folder.provider_instance_id_or_domain ??
    folder.provider_instance_id ??
    folder.provider_instance ??
    folder.provider;
  return typeof provider === "string" && provider.trim() ? provider.trim() : null;
}

export function folderItemId(folder: MaRecommendationFolder): string | null {
  const id = folder.item_id ?? folder.id;
  if (id != null && String(id).trim()) return String(id).trim();
  const uri = textOf(folder.uri);
  const last = uri.split("/").filter(Boolean).pop();
  return last || null;
}

export function folderItems(folder: MaRecommendationFolder | null): unknown[] {
  if (!folder) return [];
  const nested = folder.items ?? folder.recommendations ?? folder.media_items;
  return Array.isArray(nested) ? nested : [];
}

export function pickStationsForYouFolder(folders: MaRecommendationFolder[]): MaRecommendationFolder | null {
  return folders.find(isStationsForYouFolder) ?? null;
}

export function stationsRequestArgs(folder: MaRecommendationFolder | null): { provider: string; item_id: string } | null {
  if (!folder) return { provider: "apple_music", item_id: "stations_for_you" };
  const item_id = folderItemId(folder);
  const provider = folderProvider(folder) ?? "apple_music";
  if (!item_id) return { provider, item_id: "stations_for_you" };
  return { provider, item_id };
}
