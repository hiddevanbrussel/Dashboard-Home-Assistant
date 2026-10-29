import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { NowHero } from "@/components/energy/overview/now-hero";
import {
  HOUSE_BODY,
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

describe("labelLayout", () => {
  it("keeps at most four labels clear of the silhouette, with a 44px touch target", () => {
    for (const variant of HOUSE_VARIANTS) {
      const house = anchorPoint(variant, "huis");
      expect(house).not.toBeNull();
      expect(pointInPolygon(house as { x: number; y: number }, HOUSE_BODY)).toBe(true);
      for (const orientation of orientations) {
        const labels = labelLayout(variant, orientation, HERO_LABEL_KINDS);
        expect(labels).toHaveLength(4);
        expect(new Set(labels.map((label) => label.kind)).size).toBe(4);
        for (const label of labels) {
          expect(label.heightPx).toBe(50);
          expect(label.touchWidthPx).toBeGreaterThanOrEqual(44);
          expect(label.touchHeightPx).toBeGreaterThanOrEqual(44);
          expect(labelOverlapsSilhouette(variant, orientation, label)).toBe(false);
        }
      }
      const two = labelLayout(variant, "portrait", ["gridImport", "gridExport"]);
      expect(two.map((label) => label.kind)).toEqual(["gridImport", "gridExport"]);
    }
  });

  it("drops a fifth kind and reads the panel and mint polygons from the anchors", () => {
    const extra = [...HERO_LABEL_KINDS, "solar"] as HeroLabelKind[];
    expect(labelLayout("dag-licht", "landscape", extra)).toHaveLength(4);
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
    expect(overview).toContain("NEXT_PUBLIC_ENERGY_STORY_DEV");
    expect(overview).not.toContain("Verhaal volgt");
  });

  it("limits the app-shell diff to hiding the header energy numbers on /energy", () => {
    let diff = "";
    try {
      diff = execSync("git diff origin/main -- src/components/layout/app-shell.tsx", {
        cwd: process.cwd(),
        encoding: "utf8",
      });
    } catch {
      execSync("git fetch origin main", { cwd: process.cwd() });
      diff = execSync("git diff origin/main -- src/components/layout/app-shell.tsx", {
        cwd: process.cwd(),
        encoding: "utf8",
      });
    }
    const lines = diff
      .split("\n")
      .filter((line) => (line.startsWith("+") || line.startsWith("-")) && !line.startsWith("+++") && !line.startsWith("---"));
    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) {
      expect(line).toMatch(/HeaderEnergyStats|activeTab === "\/energy"/);
    }
  });

  it("renders the hero without solar or battery labels when nothing is linked", () => {
    const html = renderToString(createElement(NowHero, { orientation: "landscape" }));
    const avif = html.indexOf("image/avif");
    const webp = html.indexOf("huis-zonder-licht.webp");
    expect(avif).toBeGreaterThanOrEqual(0);
    expect(webp).toBeGreaterThan(avif);
    expect(html).toContain('width="960"');
    expect(html).toContain('height="727"');
    expect(html).not.toContain("data-now-label");
    expect(html).toContain("huis-zonder-licht");
  });
});
