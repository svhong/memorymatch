import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CARD_IMAGES } from "./cards";

const sourceDir = dirname(fileURLToPath(import.meta.url));
const asset = (path) => readFileSync(resolve(sourceDir, "../public", path));
const credits = () => JSON.parse(asset("images/refresh/credits.json").toString());

function expectWebP(path, width, height) {
  const bytes = asset(path);
  expect(bytes.toString("ascii", 0, 4)).toBe("RIFF");
  expect(bytes.toString("ascii", 8, 12)).toBe("WEBP");
  // Pillow writes lossy VP8 WebP files; validate their intrinsic dimensions.
  expect(bytes.toString("ascii", 12, 16)).toBe("VP8 ");
  expect(bytes.readUInt16LE(26) & 0x3fff).toBe(width);
  expect(bytes.readUInt16LE(28) & 0x3fff).toBe(height);
}

describe("refreshed movie artwork", () => {
  it("ships 12 distinct local, optimized card images with source attribution", () => {
    expect(CARD_IMAGES).toHaveLength(12);
    expect(new Set(CARD_IMAGES).size).toBe(12);
    for (const path of CARD_IMAGES) {
      expect(path).toMatch(/^images\/refresh\/[a-z-]+\.webp$/);
      expectWebP(path, 640, 640);
      expect(asset(path).length).toBeLessThan(150_000);
      const credit = credits().assets.find((entry) => entry.path === path);
      expect(credit?.description).toBeTruthy();
      expect(credit?.sourcePage).toMatch(/^https:\/\/www\.backtothefuture\.com\/movies\//);
      expect(credit?.sourceImage).toMatch(/^https:\/\/(static1\.squarespace\.com|images\.squarespace-cdn\.com)\//);
    }
  });

  it("ships a separate optimized backdrop and uses it with a readability overlay", () => {
    const path = "images/refresh/clock-tower-night.webp";
    expectWebP(path, 1920, 1080);
    expect(asset(path).length).toBeLessThan(500_000);
    expect(credits().assets.find((entry) => entry.path === path)?.description).toBeTruthy();
    const css = readFileSync(resolve(sourceDir, "App.css"), "utf8");
    expect(css).toContain(path);
    expect(css).toContain("linear-gradient(");
    expect(css).not.toContain("/images/wallpaper.jpg");
  });
});
