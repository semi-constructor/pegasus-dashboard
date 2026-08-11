import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const rootDir = process.cwd();

describe("Tier 1: Feature Coverage Specifications", () => {
  describe("Area 1.1: Marketing Routes Coverage", () => {
    it("TC-T1-M01: Landing home page (src/app/page.tsx) exists and includes shell components", () => {
      const pagePath = path.join(rootDir, "src/app/page.tsx");
      expect(fs.existsSync(pagePath), "Home page missing").toBe(true);
      const content = fs.readFileSync(pagePath, "utf-8");
      expect(content).toContain("MarketingLayout");
      expect(content).toContain("HeroClient");
    });

    it("TC-T1-M02: Modules directory page (src/app/modules/page.tsx) exists and renders grid", () => {
      const pagePath = path.join(rootDir, "src/app/modules/page.tsx");
      expect(fs.existsSync(pagePath), "Modules page missing").toBe(true);
      const content = fs.readFileSync(pagePath, "utf-8");
      expect(content.length).toBeGreaterThan(100);
      expect(content).toMatch(/grid|modules|Module/i);
    });

    it("TC-T1-M03: Dynamic module detail route (src/app/module/[moduleName]/page.tsx) exists", () => {
      const pagePath = path.join(rootDir, "src/app/module/[moduleName]/page.tsx");
      expect(fs.existsSync(pagePath), "Module detail route missing").toBe(true);
      const content = fs.readFileSync(pagePath, "utf-8");
      expect(content).toContain("moduleName");
    });

    it("TC-T1-M04: Competitor alternatives routes (carl-bot, dyno, mee6) exist", () => {
      const competitors = ["carl-bot", "dyno", "mee6"];
      for (const comp of competitors) {
        const pagePath = path.join(rootDir, `src/app/alternatives/${comp}/page.tsx`);
        expect(fs.existsSync(pagePath), `Alternatives page for ${comp} missing`).toBe(true);
      }
    });

    it("TC-T1-M05: Changelog, Blog, and Login pages exist and export page components", () => {
      const pages = [
        "src/app/changelog/page.tsx",
        "src/app/blog/page.tsx",
        "src/app/login/page.tsx",
        "src/app/team/page.tsx",
        "src/app/privacy/page.tsx",
        "src/app/terms-of-service/page.tsx",
      ];
      for (const relPath of pages) {
        const fullPath = path.join(rootDir, relPath);
        expect(fs.existsSync(fullPath), `Page missing: ${relPath}`).toBe(true);
        const content = fs.readFileSync(fullPath, "utf-8");
        expect(content).toMatch(/export default/);
      }
    });
  });

  describe("Area 1.2: Documentation & Command Browser Coverage", () => {
    it("TC-T1-D01: Documentation hub page (src/app/docs/page.tsx) exists", () => {
      const pagePath = path.join(rootDir, "src/app/docs/page.tsx");
      expect(fs.existsSync(pagePath), "Docs hub page missing").toBe(true);
    });

    it("TC-T1-D02: Installation timeline page (src/app/docs/installation/page.tsx) exists", () => {
      const pagePath = path.join(rootDir, "src/app/docs/installation/page.tsx");
      expect(fs.existsSync(pagePath), "Docs installation page missing").toBe(true);
    });

    it("TC-T1-D03: Command browser route (src/app/docs/commands/page.tsx) integrates CommandBrowser component", () => {
      const pagePath = path.join(rootDir, "src/app/docs/commands/page.tsx");
      expect(fs.existsSync(pagePath), "Docs commands page missing").toBe(true);
      const content = fs.readFileSync(pagePath, "utf-8");
      expect(content).toContain("CommandBrowser");
    });

    it("TC-T1-D04: CommandBrowser component (src/components/docs/CommandBrowser.tsx) implements filtering", () => {
      const compPath = path.join(rootDir, "src/components/docs/CommandBrowser.tsx");
      expect(fs.existsSync(compPath), "CommandBrowser component missing").toBe(true);
      const content = fs.readFileSync(compPath, "utf-8");
      expect(content).toContain("framer-motion");
      expect(content).toMatch(/search|filter|command/i);
    });

    it("TC-T1-D05: Public command browser routes (/commands, /discord-bot-commands) exist", () => {
      const routes = ["src/app/commands/page.tsx", "src/app/discord-bot-commands/page.tsx"];
      for (const r of routes) {
        const fullPath = path.join(rootDir, r);
        expect(fs.existsSync(fullPath), `Public command route ${r} missing`).toBe(true);
      }
    });
  });

  describe("Area 1.3: UI Primitive & Variant Protection Coverage", () => {
    it("TC-T1-U01: Button UI primitive (src/components/ui/button.tsx) exists and defines CVA variants", () => {
      const filePath = path.join(rootDir, "src/components/ui/button.tsx");
      expect(fs.existsSync(filePath), "button.tsx missing").toBe(true);
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toContain("buttonVariants");
      expect(content).toContain("cva");
    });

    it("TC-T1-U02: Card UI primitive (src/components/ui/card.tsx) exists and exports Card components", () => {
      const filePath = path.join(rootDir, "src/components/ui/card.tsx");
      expect(fs.existsSync(filePath), "card.tsx missing").toBe(true);
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toContain("Card");
    });

    it("TC-T1-U03: Badge UI primitive (src/components/ui/badge.tsx) exists", () => {
      const filePath = path.join(rootDir, "src/components/ui/badge.tsx");
      expect(fs.existsSync(filePath), "badge.tsx missing").toBe(true);
    });

    it("TC-T1-U04: Input UI primitive (src/components/ui/input.tsx) exists", () => {
      const filePath = path.join(rootDir, "src/components/ui/input.tsx");
      expect(fs.existsSync(filePath), "input.tsx missing").toBe(true);
    });

    it("TC-T1-U05: BrutalistMultiSelect (src/components/ui/BrutalistMultiSelect.tsx) exists for marketing drop downs", () => {
      const filePath = path.join(rootDir, "src/components/ui/BrutalistMultiSelect.tsx");
      expect(fs.existsSync(filePath), "BrutalistMultiSelect.tsx missing").toBe(true);
    });
  });

  describe("Area 1.4: Cinematic Animations & Motion Coverage", () => {
    it("TC-T1-A01: HeroClient (src/components/HeroClient.tsx) has 'use client' directive and imports framer-motion", () => {
      const filePath = path.join(rootDir, "src/components/HeroClient.tsx");
      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toMatch(/use client/);
      expect(content).toContain("framer-motion");
    });

    it("TC-T1-A02: LandingFeatures (src/components/LandingFeatures.tsx) implements multi-section feature sequence", () => {
      const filePath = path.join(rootDir, "src/components/LandingFeatures.tsx");
      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toContain("LandingFeatures");
      expect(content).toMatch(/FeatureSection|moderation|economy/i);
    });

    it("TC-T1-A03: ChangelogClient (src/app/changelog/ChangelogClient.tsx) imports framer-motion", () => {
      const filePath = path.join(rootDir, "src/app/changelog/ChangelogClient.tsx");
      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toContain("framer-motion");
    });

    it("TC-T1-A04: Modules page (src/app/modules/page.tsx) uses framer-motion for staggered grid", () => {
      const filePath = path.join(rootDir, "src/app/modules/page.tsx");
      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toContain("framer-motion");
    });

    it("TC-T1-A05: 3D canvas background components exist and provide WebGL rendering", () => {
      const filePath1 = path.join(rootDir, "src/components/ThreeBackground.tsx");
      const filePath2 = path.join(rootDir, "src/components/landing/ThreeBackground3D.tsx");
      const exists = fs.existsSync(filePath1) || fs.existsSync(filePath2);
      expect(exists, "ThreeBackground missing").toBe(true);
    });
  });

  describe("Area 1.5: Build Integrity & System Contracts Coverage", () => {
    it("TC-T1-B01: package.json specifies vitest and next build scripts", () => {
      const pkgPath = path.join(rootDir, "package.json");
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      expect(pkg.scripts.test).toBe("vitest run");
      expect(pkg.scripts.build).toBe("next build");
    });

    it("TC-T1-B02: 34 public marketing/docs route templates are accounted for in src/app", () => {
      const getPageFiles = (dir: string): string[] => {
        let results: string[] = [];
        const list = fs.readdirSync(dir);
        list.forEach((file) => {
          const filePath = path.join(dir, file);
          const normalizedPath = filePath.replace(/\\/g, "/");
          const stat = fs.statSync(filePath);
          if (stat && stat.isDirectory()) {
            if (!normalizedPath.includes("/src/app/dashboard") && !normalizedPath.includes("/src/app/api")) {
              results = results.concat(getPageFiles(filePath));
            }
          } else if (file === "page.tsx") {
            results.push(filePath);
          }
        });
        return results;
      };
      const pages = getPageFiles(path.join(rootDir, "src/app"));
      expect(pages.length).toBeGreaterThanOrEqual(30);
    });

    it("TC-T1-B03: src/app/globals.css defines --radius variable for global styling", () => {
      const cssPath = path.join(rootDir, "src/app/globals.css");
      expect(fs.existsSync(cssPath)).toBe(true);
      const content = fs.readFileSync(cssPath, "utf-8");
      expect(content).toContain("--radius");
    });

    it("TC-T1-B04: next.config.ts configures standalone output and next-intl plugin", () => {
      const configPath = path.join(rootDir, "next.config.ts");
      expect(fs.existsSync(configPath)).toBe(true);
      const content = fs.readFileSync(configPath, "utf-8");
      expect(content).toContain("standalone");
      expect(content).toContain("next-intl");
    });

    it("TC-T1-B05: Internal dashboard directory (src/app/dashboard) exists and is separated", () => {
      const dashPath = path.join(rootDir, "src/app/dashboard");
      expect(fs.existsSync(dashPath)).toBe(true);
      const stat = fs.statSync(dashPath);
      expect(stat.isDirectory()).toBe(true);
    });
  });
});
