import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/** Specificity [ids, classes/attributes/pseudo-classes, elements] of a selector without :where(). */
function specificity(selector: string): [number, number, number] {
  let s = selector;
  let a = 0, b = 0, c = 0;
  // :is() / :not() count as their most specific argument; the arguments used here are one simple selector each.
  s = s.replace(/:(?:is|not)\(([^()]*)\)/g, (_, inner: string) => {
    const parts = inner.split(",").map((p) => specificity(p.trim()));
    const max = parts.reduce((m, p) => (p[0] > m[0] || (p[0] === m[0] && (p[1] > m[1] || (p[1] === m[1] && p[2] > m[2]))) ? p : m), [0, 0, 0]);
    a += max[0]; b += max[1]; c += max[2];
    return " ";
  });
  a += (s.match(/#[\w-]+/g) ?? []).length;
  b += (s.match(/\.[\w-]+|\[[^\]]+\]|:[\w-]+/g) ?? []).length;
  c += (s.match(/(^|[\s>+~])[a-z][\w-]*/gi) ?? []).length;
  return [a, b, c];
}

function outranks(x: [number, number, number], y: [number, number, number]): boolean {
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i];
  return false;
}

describe("glass density Off rule", () => {
  const css = readFileSync("src/app/globals.css", "utf8");
  const remap = css.match(/\n\s*(:is\(\[class\*="backdrop-blur-xl"\][^{]*)\{/)?.[1].trim();
  // The Off selector is the first line of that rule, up to its trailing comma.
  const off = css
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith('html[data-glass-density="off"] :is([class*="backdrop-blur-xl"]'))
    ?.replace(/,$/, "");

  it("finds both rules", () => {
    expect(remap).toBeTruthy();
    expect(off).toBeTruthy();
  });

  it("out-ranks the density remap, so Off really sets backdrop-filter: none", () => {
    expect(specificity(remap!)).toEqual([0, 4, 0]);
    expect(outranks(specificity(off!), specificity(remap!))).toBe(true);
  });
});
