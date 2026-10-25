import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** #281: a direct port mapped to another host port (3000 → 3005) must not redirect to :3000. */
describe("add-on direct port nginx", () => {
  const conf = readFileSync(join(process.cwd(), "homeassistant-addon/rootfs/etc/nginx/http.d/direct.conf"), "utf8");

  it("keeps its own redirects relative", () => {
    expect(conf).toMatch(/^\s*absolute_redirect off;/m);
  });

  it("still sends / to the ingress basePath with a relative target", () => {
    expect(conf).toMatch(/location = \/ \{\s*return 302 \/__ha_ingress__;\s*\}/);
  });
});
