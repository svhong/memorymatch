import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { basename, dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CARD_IMAGES } from "./cards";

const sourceDir = dirname(fileURLToPath(import.meta.url));
const asset = (name) => readFileSync(resolve(sourceDir, "assets/refresh", name));
const credits = () => JSON.parse(asset("credits.json").toString());

function expectWebP(name, width, height) {
  const bytes = asset(name);
  expect(bytes.toString("ascii", 0, 4)).toBe("RIFF");
  expect(bytes.toString("ascii", 8, 12)).toBe("WEBP");
  expect(bytes.toString("ascii", 12, 16)).toBe("VP8 ");
  expect(bytes.readUInt16LE(26) & 0x3fff).toBe(width);
  expect(bytes.readUInt16LE(28) & 0x3fff).toBe(height);
}

describe("refreshed movie artwork", () => {
  it("bundles 12 distinct optimized card images with source attribution", () => {
    expect(CARD_IMAGES).toHaveLength(12);
    expect(new Set(CARD_IMAGES).size).toBe(12);
    const hashes = new Set();
    for (const url of CARD_IMAGES) {
      expect(url).toMatch(/\/assets\/refresh\/[a-z-]+\.webp$/);
      const name = basename(url);
      expectWebP(name, 640, 640);
      const bytes = asset(name);
      expect(bytes.length).toBeLessThan(150_000);
      hashes.add(createHash("sha256").update(bytes).digest("hex"));
      const credit = credits().assets.find((entry) => entry.path === `assets/refresh/${name}`);
      expect(credit?.description).toBeTruthy();
      expect(credit?.sourcePage).toMatch(/^https:\/\/www\.backtothefuture\.com\/movies\//);
      expect(credit?.sourceImage).toMatch(/^https:\/\/(static1\.squarespace\.com|images\.squarespace-cdn\.com)\//);
    }
    expect(hashes.size).toBe(12);
  });

  it("bundles the backdrop with an overlay scoped to the game, not the host page", () => {
    const name = "clock-tower-night.webp";
    expectWebP(name, 1920, 1080);
    expect(asset(name).length).toBeLessThan(500_000);
    expect(credits().assets.find((entry) => entry.path === `assets/refresh/${name}`)?.description).toBeTruthy();
    const css = readFileSync(resolve(sourceDir, "MemoryGame.module.css"), "utf8");
    const rootRule = css.match(/\.root\s*\{([^}]+)\}/)?.[1];
    expect(rootRule).toMatch(/background:\s*linear-gradient\([\s\S]*url\("\.\/assets\/refresh\/clock-tower-night\.webp"\)/);
    expect(css).not.toContain("wallpaper.jpg");
    expect(css).not.toMatch(/(?:^|\n)\s*(?:body|:root|#root)\s*\{/);
  });
});
