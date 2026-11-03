import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { NowHero } from "@/components/energy/overview/now-hero";
import {
  HOUSE_BODY,
  leaderStart,
  HERO_LABEL_KINDS,
  anchorPoint,
  heroImagePx,
  labelLayout,
  labelOverlapsSilhouette,
  mintLine,
  panelPolygon,
  pointInPolygon,
  samplePolyline,
  type HeroLabelKind,
  type OverviewOrientation,
} from "./energy-house-anchors";
import { HOUSE_VARIANTS } from "./energy-now";

const orientations: OverviewOrientation[] = ["landscape", "portrait"];

/** sha256 of every file in public/energy/house, including ankers.json. */
const HOUSE_SHA256: Record<string, string> = {
  "achter-dag-donker.avif": "3dcd130f8d690632f93d4bfe12e14776720718d2421fd1825a9f457fc91cafac",
  "achter-dag-donker.webp": "5e3c9c87e58b0a13f9d4542bc63c81b81f0174ed555e3a1c413d15e7f1360747",
  "achter-dag-licht.avif": "eda383b2d7ba6656a06627ddf5f650a4547e973670bebf9e948ae9e2dec53e18",
  "achter-dag-licht.webp": "e27210d46431e2a97a5b20a6a0a89acd27bbcb5e7b1281da47dae59081357ec3",
  "achter-nacht-donker.avif": "9b392479b8461f3899df1356f568e33fdf354a2562710b0d9a76ddd157e12aab",
  "achter-nacht-donker.webp": "930820ff7257d4f36ef4e0f083c3a691cb8712bf3631388bf15ef2d7bf1f0d97",
  "achter-nacht-licht.avif": "1d37cc54f41e8f433251bf236148b91d06182221f78a99f7304704ecdb0b13b2",
  "achter-nacht-licht.webp": "7f3d4a4814b931456a1301e994eaf1823fad23dbea90d48ef704f38b5edb945f",
  "achter-zonder-donker.avif": "00a3cb2324da1ca69ef0e277288f314e24684d0275a7d7dd880f322fda6af4c7",
  "achter-zonder-donker.webp": "cbeb41ea11abd3ab9745f569e9842c2dc429e12c798ea5d55200228a53680ea6",
  "achter-zonder-licht.avif": "4bb2c3b61c29955a9ba524b20c2b94ad131cde1443ccec3047d039e24b62d104",
  "achter-zonder-licht.webp": "1ad3af942d69667fe31a725cbcf4e5225bc320f05460dcd1ad032c7398839862",
  "ankers.json": "4afd16ec1353e0a178e70ea919a2044890fe0869b1475a9fba30da885e108abe",
  "huis-dag-donker.avif": "6c1957ffcda142e2edd83c1a565afa9e51afdb75e36279681b4cfba16a85ad01",
  "huis-dag-donker.webp": "2b1c90697e11e6553516e21f259255f7ebe6ec353240d452a82322d3034ca1c1",
  "huis-dag-licht.avif": "75f62cbfa213190c553da0a1a531848a5f7b9c9e14155b48ebbfafd6d0d8063f",
  "huis-dag-licht.webp": "b76e51b0a95fff022eec2c8d2a6df76f9b33728a1a0c1d6e627beae577dc629b",
  "huis-nacht-donker.avif": "18b6b88f8fa8822c74f9fcd20b924a19874d786a7d283fd1e5e311abd4f643a2",
  "huis-nacht-donker.webp": "76599b92e54ca017af2eda974826a5dceb736a0f25056764f8c75beb14485d71",
  "huis-nacht-licht.avif": "fb99c390e897d176204f9484a9c931fbd068e3bbb5c294ee19241165f0cc156f",
  "huis-nacht-licht.webp": "edf1cc833e76aee0d8232ce40c7ecff6fd7333a9f446c216a1a7de6bbfed87da",
  "huis-zonder-donker.avif": "69d01a5c15b4faee97a5788466b4914df0a468d2f6c4cc087b3565a2221af564",
  "huis-zonder-donker.webp": "fc145a4413b0cb21ac6b58fe146addf9e4aceca2e1d5c242dc2cc7bd7fba26aa",
  "huis-zonder-licht.avif": "272d49aa82a4c811ff8f0b427bed9f77fd01d0f64d311e3173878575e4d64fda",
  "huis-zonder-licht.webp": "0587ff697d5a20ef3c881b0c2e0ebd3dbd98105fc3133b4d06edd8beb5cb9465",
};

describe("labelLayout", () => {
  it("keeps at most four labels clear of the silhouette, with a 44px touch target", () => {
    for (const variant of HOUSE_VARIANTS) {
      const house = anchorPoint(variant, "huis");
      expect(house).not.toBeNull();
      expect(pointInPolygon(house as { x: number; y: number }, HOUSE_BODY)).toBe(true);
      for (const orientation of orientations) {
        const labels = labelLayout(variant, orientation, HERO_LABEL_KINDS);
        expect(labels).toHaveLength(3);
        expect(new Set(labels.map((label) => label.kind)).size).toBe(3);
        for (const label of labels) {
          expect(label.heightPx).toBe(50);
          expect(label.touchWidthPx).toBeGreaterThanOrEqual(44);
          expect(label.touchHeightPx).toBeGreaterThanOrEqual(44);
          expect(labelOverlapsSilhouette(variant, orientation, label)).toBe(false);
        }
      }
      const gridOnly = labelLayout(variant, "portrait", ["grid"]);
      expect(gridOnly.map((label) => label.kind)).toEqual(["grid"]);
    }
  });

  it("drops a fifth kind and reads the panel and mint polygons from the anchors", () => {
    const extra = [...HERO_LABEL_KINDS, "solar"] as HeroLabelKind[];
    expect(labelLayout("dag-licht", "landscape", extra)).toHaveLength(3);
    expect(panelPolygon("dag-licht").length).toBeGreaterThanOrEqual(3);
    expect(panelPolygon("zonder-licht")).toEqual([]);
    expect(mintLine("dag-licht").length).toBeGreaterThan(1);
    expect(mintLine("nacht-licht").length).toBeGreaterThan(1);
    expect(mintLine("zonder-donker")).toEqual([]);
    const image = heroImagePx("portrait");
    expect(image.width).toBeLessThanOrEqual(680);
    expect(image.height).toBeLessThanOrEqual(560);
    const sampled = samplePolyline(mintLine("dag-licht"), 16);
    expect(sampled).toHaveLength(16);
  });

  it("moves a right-aligned leader when the pill gets narrower", () => {
    const wide = leaderStart({ left: 460.5, right: 672, top: 400, bottom: 450 }, "br");
    const narrow = leaderStart({ left: 469.9, right: 672, top: 400, bottom: 450 }, "br");
    expect(wide.x).toBeCloseTo(478.5, 5);
    expect(narrow.x).toBeCloseTo(487.9, 5);
  });
});

describe("now hero source", () => {
  it("does not animate filters or use a backdrop blur on the pills", () => {
    const root = process.cwd();
    const hero = readFileSync(path.join(root, "src/components/energy/overview/now-hero.tsx"), "utf8");
    const layers = readFileSync(path.join(root, "src/components/energy/overview/now-hero-layers.tsx"), "utf8");
    const overview = readFileSync(path.join(root, "src/components/energy/overview/energy-overview.tsx"), "utf8");
    const combined = `${hero}\n${layers}\n${overview}`;
    expect(combined).not.toContain("backdrop-filter");
    expect(combined).not.toContain("backdrop-blur");
    expect(combined).not.toContain("stroke-dashoffset");
    expect(combined).not.toContain("strokeDashoffset");
    expect(hero).toContain("decoding=\"async\"");
    expect(hero).not.toContain('loading="lazy"');
    expect(hero).toContain("requestIdleCallback");
    expect(overview).toContain("EnergyStorySheet");
    expect(overview).not.toContain("StoryCarousel");
    expect(overview).not.toContain("NEXT_PUBLIC_ENERGY_STORY_DEV");
    expect(overview).not.toContain("Verhaal volgt");
  });

  it("locks every file in public/energy/house by sha256", () => {
    const dir = path.join(process.cwd(), "public/energy/house");
    const names = readdirSync(dir)
      .filter((name) => !name.startsWith("."))
      .sort();
    expect(names).toEqual(Object.keys(HOUSE_SHA256).sort());
    expect(names).toHaveLength(25);
    for (const name of names) {
      const hash = createHash("sha256").update(readFileSync(path.join(dir, name))).digest("hex");
      expect(hash, name).toBe(HOUSE_SHA256[name]);
    }
  });

  it("leaves app-shell, widgets, history and the websocket unchanged", () => {
    const paths = [
      "src/components/layout/app-shell.tsx",
      "src/components/widgets",
      "src/app/api/ha/history/route.ts",
      "src/lib/ha/ws-commands.ts",
    ].join(" ");
    const command = `git diff origin/main -- ${paths}`;
    let diff = "";
    try {
      diff = execSync(command, { cwd: process.cwd(), encoding: "utf8" });
    } catch {
      execSync("git fetch origin main", { cwd: process.cwd() });
      diff = execSync(command, { cwd: process.cwd(), encoding: "utf8" });
    }
    const lines = diff
      .split("\n")
      .filter((line) => (line.startsWith("+") || line.startsWith("-")) && !line.startsWith("+++") && !line.startsWith("---"));
    expect(lines).toEqual([]);
  });

  it("keeps the energy store module as it is on main", () => {
    const command = "git diff origin/main -- src/stores/energy-store.ts";
    let diff = "";
    try {
      diff = execSync(command, { cwd: process.cwd(), encoding: "utf8" });
    } catch {
      execSync("git fetch origin main", { cwd: process.cwd() });
      diff = execSync(command, { cwd: process.cwd(), encoding: "utf8" });
    }
    const lines = diff
      .split("\n")
      .filter((line) => (line.startsWith("+") || line.startsWith("-")) && !line.startsWith("+++") && !line.startsWith("---"));
    expect(lines).toEqual([]);
  });

  it("renders the hero without solar or battery labels when nothing is linked", () => {
    const html = renderToString(createElement(NowHero, { orientation: "landscape" }));
    expect(html).not.toContain("data-now-label");
    expect(html).not.toContain("huis-zonder-");
    expect(html).not.toContain("<img");
  });
});
