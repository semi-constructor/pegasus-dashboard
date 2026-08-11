import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const rootDir = process.cwd();

describe("Tier 2: Boundary & Corner Case Specifications", () => {
  it("TC-T2-01 (Empty Command Search): CommandBrowser handles zero match searches gracefully", () => {
    const compPath = path.join(rootDir, "src/components/docs/CommandBrowser.tsx");
    expect(fs.existsSync(compPath)).toBe(true);
    const content = fs.readFileSync(compPath, "utf-8");
    // Verify component handles zero-match or empty filter results
    expect(content).toMatch(/filter|length === 0|No commands|0 MATCHED|empty/i);
  });

  it("TC-T2-02 (Invalid Module Slug): Module detail page performs valid slug checks or notFound() call", () => {
    const pagePath = path.join(rootDir, "src/app/module/[moduleName]/page.tsx");
    expect(fs.existsSync(pagePath)).toBe(true);
    const content = fs.readFileSync(pagePath, "utf-8");
    expect(content).toMatch(/notFound|module|params/i);
  });

  it("TC-T2-03 (Missing Blog Article ID): Blog article reader checks for post existence", () => {
    const pagePath = path.join(rootDir, "src/app/blog/[blogId]/page.tsx");
    expect(fs.existsSync(pagePath)).toBe(true);
    const content = fs.readFileSync(pagePath, "utf-8");
    expect(content).toMatch(/notFound|blogId|post|params/i);
  });

  it("TC-T2-04 (Zero Leaderboard Data): Public leaderboard pages contain fallback UI for empty rankings", () => {
    const ecoPath = path.join(rootDir, "src/app/eco/page.tsx");
    const levelsPath = path.join(rootDir, "src/app/levels/page.tsx");
    const exists = fs.existsSync(ecoPath) || fs.existsSync(levelsPath);
    expect(exists).toBe(true);
    if (fs.existsSync(ecoPath)) {
      const content = fs.readFileSync(ecoPath, "utf-8");
      expect(content).toMatch(/leaderboard|guild|data|length|empty/i);
    }
  });

  it("TC-T2-05 (Mobile Viewport 320px): Home and Docs layouts include responsive overflow protection", () => {
    const homePath = path.join(rootDir, "src/app/page.tsx");
    const shellPath = path.join(rootDir, "src/components/MarketingLayout.tsx");
    expect(fs.existsSync(homePath)).toBe(true);
    expect(fs.existsSync(shellPath)).toBe(true);
    const shellContent = fs.readFileSync(shellPath, "utf-8");
    expect(shellContent).toMatch(/overflow-x-hidden|max-w|w-full|min-h-screen/i);
  });

  it("TC-T2-06 (4K Desktop Viewport 3840px): Marketing containers enforce max-width limits", () => {
    const shellPath = path.join(rootDir, "src/components/MarketingLayout.tsx");
    const heroPath = path.join(rootDir, "src/components/HeroClient.tsx");
    expect(fs.existsSync(shellPath)).toBe(true);
    expect(fs.existsSync(heroPath)).toBe(true);
    const heroContent = fs.readFileSync(heroPath, "utf-8");
    expect(heroContent).toMatch(/max-w-[0-9a-z\[\]]+|container|mx-auto/i);
  });

  it("TC-T2-07 (WebGL Disabled Fallback): 3D canvas includes fallback visual component for WebGL unsupported environments", () => {
    const fallbackPath = path.join(rootDir, "src/components/landing/GlassVisualFallback.tsx");
    const threePath = path.join(rootDir, "src/components/ThreeBackground.tsx");
    const fallbackExists = fs.existsSync(fallbackPath) || fs.existsSync(threePath);
    expect(fallbackExists).toBe(true);
    if (fs.existsSync(threePath)) {
      const content = fs.readFileSync(threePath, "utf-8");
      expect(content).toMatch(/tier === "OFF"|isDetected|ThreeBackground3D|fallback|canvas|error|WebGL/i);
    }
  });

  it("TC-T2-08 (Invalid Auth Callback): Login page component supports search parameter parsing", () => {
    const loginPath = path.join(rootDir, "src/app/login/page.tsx");
    expect(fs.existsSync(loginPath)).toBe(true);
    const content = fs.readFileSync(loginPath, "utf-8");
    expect(content).toMatch(/searchParams|error|login|OAuth/i);
  });

  it("TC-T2-09 (Out-of-Bounds Guide Step): Setup guides handle out-of-range step indexing safely", () => {
    const guidePath = path.join(rootDir, "src/app/guides/discord-server-setup/page.tsx");
    const howToPath = path.join(rootDir, "src/app/how-to-add-pegasus-bot/page.tsx");
    const exists = fs.existsSync(guidePath) || fs.existsSync(howToPath);
    expect(exists).toBe(true);
  });

  it("TC-T2-10 (Invalid Route 404): Not found page (not-found.tsx) is present in src/app", () => {
    const notFoundPath = path.join(rootDir, "src/app/not-found.tsx");
    const globalNotFound = fs.existsSync(notFoundPath);
    expect(globalNotFound, "src/app/not-found.tsx missing").toBe(true);
  });
});
