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
  "achter-dag-donker.avif": "e4239ef1ebb9df2ec844629f7621e4774fe1b68c6474b9e6fd543c68993cefe7",
  "achter-dag-donker.webp": "7c4984e309b04940b87c1e379e094485142c211ce97bb1fdf044999b9098d6b8",
  "achter-dag-licht.avif": "a683529b700f873ab93752de0a9c024006c258e81140d77e15fab6817b27ff07",
  "achter-dag-licht.webp": "4b820f9915670c79c56e22e0e7c805bc8cc64412ef3a44530a2ec7659dd2bf86",
  "achter-nacht-donker.avif": "3d91240568e0fc36133cd5f93a5161cae1223b53cf1e76e14cb4f9d078296aeb",
  "achter-nacht-donker.webp": "9104f9044f0507be69fe6d8bafc8dfd8e11c3acc947de5b3c89757f891b2e446",
  "achter-nacht-licht.avif": "1ddfd8bda0eb0ef602cc0792a57522dacffc31b5f05b5a82e40b5cc0322607b2",
  "achter-nacht-licht.webp": "9c4299d1eb29054a1ed30a4583b6759a9331997a6dadca25f2b6c495eb7ff9d9",
  "achter-zonder-donker.avif": "1c4bed11355c62fae789fc34a1b1dd9a04db51ddf3ba4476ba2668751973d3ba",
  "achter-zonder-donker.webp": "d0b948fcf6f1e6e37401ef021730f8c6bda53e5d0a9209afb0a816d19952ab54",
  "achter-zonder-licht.avif": "0a03fdf325f2666462b2ddd660d7137008328628d9953ff09fdc9d7a80d9b850",
  "achter-zonder-licht.webp": "d7c7ce089c438960e13349e95d6481d0772dc13214ed4107d7245a1e8d233364",
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
