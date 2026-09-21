/**
 * Resolve Music Assistant item_id + provider for library drill-down commands
 * (artist_albums, artist_tracks, album_tracks, podcast_episodes, …).
 *
 * Prefer the item's own identity (uri / provider + item_id) over provider_mappings[0].
 * Library artists often map to a filesystem/streaming provider that does not support
 * ARTIST_TRACKS, which would return albums from one path and an empty track list.
 */
export type MaItemParams = {
  item_id: string;
  provider_instance_id_or_domain: string;
};

type MaItemLike = {
  uri?: string;
  item_uri?: string;
  item_id?: string | number;
  id?: string | number;
  provider?: string;
  provider_instance_id?: string;
  provider_instance_id_or_domain?: string;
  provider_instance?: string;
  provider_domain?: string;
  provider_mappings?: {
    provider_instance_id?: string;
    provider_instance?: string;
    provider?: string;
    item_id?: string | number;
    id?: string | number;
  }[];
};

function fromUri(raw: string | undefined): MaItemParams | null {
  if (typeof raw !== "string" || !raw.includes("://")) return null;
  const [scheme, rest] = raw.split("://");
  const id = rest?.split("/").filter(Boolean).pop();
  if (!scheme || !id) return null;
  return { item_id: id, provider_instance_id_or_domain: scheme.replace(/\/+$/, "") };
}

function fromOwnFields(item: MaItemLike): MaItemParams | null {
  const itemId = item.item_id ?? item.id;
  if (itemId == null) return null;
  const provider =
    item.provider ??
    item.provider_instance_id_or_domain ??
    item.provider_instance_id ??
    item.provider_instance ??
    item.provider_domain;
  if (!provider) return null;
  return {
    item_id: String(itemId),
    provider_instance_id_or_domain: String(provider).replace(/\/+$/, ""),
  };
}

function fromProviderMappings(item: MaItemLike): MaItemParams | null {
  const mappings = item.provider_mappings;
  if (!Array.isArray(mappings) || mappings.length === 0) return null;
  const first = mappings[0];
  const prov = first?.provider_instance_id ?? first?.provider_instance ?? first?.provider;
  const rawId = first?.item_id ?? first?.id;
  const id = rawId != null ? String(rawId) : null;
  if (!prov || !id) return null;
  return { item_id: id, provider_instance_id_or_domain: String(prov).replace(/\/+$/, "") };
}

export function getMaItemParams(item: MaItemLike | null | undefined): MaItemParams | null {
  if (!item || typeof item !== "object") return null;
  return fromUri(item.uri ?? item.item_uri) ?? fromOwnFields(item) ?? fromProviderMappings(item);
}
