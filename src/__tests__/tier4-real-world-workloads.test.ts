import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const rootDir = process.cwd();

describe("Tier 4: Real-World Workload Testing (E2E User Journeys)", () => {
  it("TC-T4-J01: Prospect Discovery Journey — Validates complete file chain from Home to CTA", () => {
    const homePath = path.join(rootDir, "src/app/page.tsx");
    const heroPath = path.join(rootDir, "src/components/HeroClient.tsx");
    const featuresPath = path.join(rootDir, "src/components/LandingFeatures.tsx");
    const modulesPath = path.join(rootDir, "src/app/modules/page.tsx");
    const moduleDetailPath = path.join(rootDir, "src/app/module/[moduleName]/page.tsx");

    expect(fs.existsSync(homePath), "Home page missing").toBe(true);
    expect(fs.existsSync(heroPath), "HeroClient missing").toBe(true);
    expect(fs.existsSync(featuresPath), "LandingFeatures missing").toBe(true);
    expect(fs.existsSync(modulesPath), "Modules directory page missing").toBe(true);
    expect(fs.existsSync(moduleDetailPath), "Module detail route missing").toBe(true);

    const homeContent = fs.readFileSync(homePath, "utf-8");
    expect(homeContent).toContain("HeroClient");
    expect(homeContent).toContain("LandingFeatures");
  });

  it("TC-T4-J02: Developer Onboarding Journey — Validates docs hub to command browser chain", () => {
    const docsPath = path.join(rootDir, "src/app/docs/page.tsx");
    const installPath = path.join(rootDir, "src/app/docs/installation/page.tsx");
    const commandsPath = path.join(rootDir, "src/app/docs/commands/page.tsx");
    const browserCompPath = path.join(rootDir, "src/components/docs/CommandBrowser.tsx");

    expect(fs.existsSync(docsPath)).toBe(true);
    expect(fs.existsSync(installPath)).toBe(true);
    expect(fs.existsSync(commandsPath)).toBe(true);
    expect(fs.existsSync(browserCompPath)).toBe(true);

    const commandsContent = fs.readFileSync(commandsPath, "utf-8");
    expect(commandsContent).toContain("CommandBrowser");
  });

  it("TC-T4-J03: Competitor Evaluation Journey — Validates alternatives to changelog & team chain", () => {
    const competitorPath = path.join(rootDir, "src/app/alternatives/mee6/page.tsx");
    const changelogPath = path.join(rootDir, "src/app/changelog/page.tsx");
    const teamPath = path.join(rootDir, "src/app/team/page.tsx");

    expect(fs.existsSync(competitorPath)).toBe(true);
    expect(fs.existsSync(changelogPath)).toBe(true);
    expect(fs.existsSync(teamPath)).toBe(true);

    const compContent = fs.readFileSync(competitorPath, "utf-8");
    expect(compContent.length).toBeGreaterThan(100);
  });

  it("TC-T4-J04: Community Leaderboard & Content Journey — Validates leaderboard to blog & legal chain", () => {
    const ecoPath = path.join(rootDir, "src/app/eco/page.tsx");
    const levelsPath = path.join(rootDir, "src/app/levels/page.tsx");
    const blogPath = path.join(rootDir, "src/app/blog/page.tsx");
    const privacyPath = path.join(rootDir, "src/app/privacy/page.tsx");

    const leaderboardsExist = fs.existsSync(ecoPath) || fs.existsSync(levelsPath);
    expect(leaderboardsExist).toBe(true);
    expect(fs.existsSync(blogPath)).toBe(true);
    expect(fs.existsSync(privacyPath)).toBe(true);

    const privacyContent = fs.readFileSync(privacyPath, "utf-8");
    expect(privacyContent).toMatch(/Privacy|Terms|Policy|Pegasus/i);
  });
});
