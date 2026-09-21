import { describe, expect, it } from "vitest";
import { getMaItemParams } from "./ma-item-params";

describe("getMaItemParams", () => {
  it("prefers the item uri over provider_mappings", () => {
    expect(
      getMaItemParams({
        uri: "library://artist/42",
        item_id: 42,
        provider: "library",
        provider_mappings: [{ provider_instance_id: "filesystem_xxx", item_id: "Artist/Name" }],
      })
    ).toEqual({ item_id: "42", provider_instance_id_or_domain: "library" });
  });

  it("uses own provider + item_id when uri is missing", () => {
    expect(
      getMaItemParams({
        item_id: 7,
        provider: "library",
        provider_mappings: [{ provider_instance_id: "spotify", item_id: "abc" }],
      })
    ).toEqual({ item_id: "7", provider_instance_id_or_domain: "library" });
  });

  it("falls back to the first provider mapping", () => {
    expect(
      getMaItemParams({
        provider_mappings: [{ provider_instance_id: "spotify--abc", item_id: "track99" }],
      })
    ).toEqual({ item_id: "track99", provider_instance_id_or_domain: "spotify--abc" });
  });

  it("returns null when nothing resolvable is present", () => {
    expect(getMaItemParams({})).toBeNull();
    expect(getMaItemParams(null)).toBeNull();
  });
});
