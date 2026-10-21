import { createRequire } from "node:module";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const { rewriteText, rewriteLinkHeader } = require("../../homeassistant-addon/rootfs/ingress-proxy.js") as {
  rewriteText: (text: string, ingressPath: string) => string;
  rewriteLinkHeader: (link: string | string[] | undefined, ingressPath: string) => string | string[] | undefined;
};

const INGRESS = "/api/hassio_ingress/x";

describe("rewriteText ingress placeholder", () => {
  it("keeps a regex literal valid by escaping every slash", () => {
    const input = 'e.replace(/^\\/__ha_ingress__(?=\\/|$)/,"")';
    const rewritten = rewriteText(input, INGRESS);
    expect(rewritten).toBe('e.replace(/^\\/api\\/hassio_ingress\\/x(?=\\/|$)/,"")');
    expect(() => new vm.Script(rewritten)).not.toThrow();
    expect(rewritten).not.toContain("__ha_ingress__");
    const broken = 'e.replace(/^\\/api/hassio_ingress/x(?=\\/|$)/,"")';
    expect(() => new vm.Script(broken)).toThrow(SyntaxError);
  });

  it("rewrites a normal string without adding a trailing slash to the basePath", () => {
    expect(rewriteText('var base="/__ha_ingress__";', INGRESS)).toBe(`var base="${INGRESS}";`);
    expect(rewriteText('const path = "/__ha_ingress__/energy";', INGRESS)).toBe(
      `const path = "${INGRESS}/energy";`
    );
    const escapedString = 'const path = "\\/__ha_ingress__\\/energy";';
    const rewritten = rewriteText(escapedString, INGRESS);
    expect(rewritten).toBe('const path = "\\/api\\/hassio_ingress\\/x\\/energy";');
    expect(new vm.Script(`${rewritten}\npath`).runInNewContext()).toBe(`${INGRESS}/energy`);
  });

  it("rewrites \\\\u002F escapes without inserting a raw slash", () => {
    const input = "/^\\u002F__ha_ingress__(?=\\u002F|$)/";
    const rewritten = rewriteText(input, INGRESS);
    expect(rewritten).toBe("/^\\u002Fapi\\u002Fhassio_ingress\\u002Fx(?=\\u002F|$)/");
    expect(rewritten).not.toMatch(/hassio_ingress\/x/);
    const pattern = new vm.Script(rewritten).runInNewContext() as RegExp;
    expect(pattern.test(INGRESS)).toBe(true);
    expect(pattern.test(`${INGRESS}/energy`)).toBe(true);
    expect(pattern.test(`${INGRESS}tra`)).toBe(false);

    const asString = 'const path = "\\u002F__ha_ingress__\\u002Fenergy";';
    const rewrittenString = rewriteText(asString, INGRESS);
    expect(rewrittenString).toBe('const path = "\\u002Fapi\\u002Fhassio_ingress\\u002Fx\\u002Fenergy";');
    expect(new vm.Script(`${rewrittenString}\npath`).runInNewContext()).toBe(`${INGRESS}/energy`);
  });

  it("rewrites %2F escapes without inserting a raw slash", () => {
    const input = "/^%2F__ha_ingress__(?=%2F|$)/";
    const rewritten = rewriteText(input, INGRESS);
    expect(rewritten).toBe("/^%2Fapi%2Fhassio_ingress%2Fx(?=%2F|$)/");
    expect(rewritten).not.toContain("/api/");
    expect(() => new vm.Script(rewritten)).not.toThrow();

    expect(rewriteText("%2F__ha_ingress__%2Fenergy", INGRESS)).toBe("%2Fapi%2Fhassio_ingress%2Fx%2Fenergy");
  });

  it("rewrites a Link preload header", () => {
    const header =
      '</__ha_ingress__/_next/static/media/e4af272ccee01ff0-s.p.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2"';
    const rewritten = rewriteText(header, INGRESS);
    expect(rewritten).toBe(
      '</api/hassio_ingress/x/_next/static/media/e4af272ccee01ff0-s.p.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2"'
    );
    expect(rewritten).not.toContain("__ha_ingress__");
  });
});

describe("rewriteLinkHeader", () => {
  const font = (file: string) =>
    `</__ha_ingress__/_next/static/media/${file}>; rel=preload; as="font"; crossorigin=""; type="font/woff2"`;
  const rewrittenFont = (file: string) =>
    `</api/hassio_ingress/x/_next/static/media/${file}>; rel=preload; as="font"; crossorigin=""; type="font/woff2"`;

  it("rewrites one header and a comma-joined pair", () => {
    expect(rewriteLinkHeader(font("a.woff2"), INGRESS)).toBe(rewrittenFont("a.woff2"));
    const joined = `${font("a.woff2")}, ${font("b.woff2")}`;
    expect(rewriteLinkHeader(joined, INGRESS)).toBe(`${rewrittenFont("a.woff2")}, ${rewrittenFont("b.woff2")}`);
  });

  it("rewrites an array of Link headers and leaves them alone without an ingress path", () => {
    expect(rewriteLinkHeader([font("a.woff2"), font("b.woff2")], INGRESS)).toEqual([
      rewrittenFont("a.woff2"),
      rewrittenFont("b.woff2"),
    ]);
    expect(rewriteLinkHeader(font("a.woff2"), "")).toBe(font("a.woff2"));
    expect(rewriteLinkHeader(undefined, INGRESS)).toBeUndefined();
  });
});
