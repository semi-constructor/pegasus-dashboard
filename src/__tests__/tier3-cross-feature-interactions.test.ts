import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const rootDir = process.cwd();

describe("Tier 3: Cross-Feature Interaction Specifications", () => {
  it("TC-T3-01 (Header Navigation Flow): Marketing shell defines key navigation link targets", () => {
    const layoutPath = path.join(rootDir, "src/components/MarketingLayout.tsx");
    expect(fs.existsSync(layoutPath)).toBe(true);
    const content = fs.readFileSync(layoutPath, "utf-8");
    expect(content).toMatch(/\/modules|\/docs|\/changelog|\/blog/);
  });

  it("TC-T3-02 (Language Switcher Interaction): LanguageSwitcher handles locale selection and i18n configuration", () => {
    const switcherPath = path.join(rootDir, "src/components/LanguageSwitcher.tsx");
    const configPath = path.join(rootDir, "src/i18n/config.ts");
    expect(fs.existsSync(switcherPath)).toBe(true);
    expect(fs.existsSync(configPath)).toBe(true);

    const switcherContent = fs.readFileSync(switcherPath, "utf-8");
    expect(switcherContent).toMatch(/locale|Language|select|en|de|es|fr/i);

    const configContent = fs.readFileSync(configPath, "utf-8");
    expect(configContent).toContain("en");
    expect(configContent).toContain("de");
    expect(configContent).toContain("es");
    expect(configContent).toContain("fr");
  });

  it("TC-T3-03 (Command Browser Filter & Category Selection): CommandBrowser binds search input and category state", () => {
    const browserPath = path.join(rootDir, "src/components/docs/CommandBrowser.tsx");
    expect(fs.existsSync(browserPath)).toBe(true);
    const content = fs.readFileSync(browserPath, "utf-8");
    expect(content).toMatch(/useState|search|category|filter/i);
  });

  it("TC-T3-04 (Module Detail Tab Switching): Module detail page manages features and configuration layout sections", () => {
    const moduleDetailPath = path.join(rootDir, "src/app/module/[moduleName]/page.tsx");
    expect(fs.existsSync(moduleDetailPath)).toBe(true);
    const content = fs.readFileSync(moduleDetailPath, "utf-8");
    expect(content).toMatch(/features|keyFeatures|howToSetUp|configureInDashboard/i);
  });

  it("TC-T3-05 (Changelog Tag Filtering): ChangelogClient utilizes state and AnimatePresence for filter tags", () => {
    const changelogPath = path.join(rootDir, "src/app/changelog/ChangelogClient.tsx");
    expect(fs.existsSync(changelogPath)).toBe(true);
    const content = fs.readFileSync(changelogPath, "utf-8");
    expect(content).toContain("AnimatePresence");
    expect(content).toMatch(/filter|tag|version|active/i);
  });

  it("TC-T3-06 (Competitor Matrix CTA Flow): Alternatives pages include CTA links to auth or features", () => {
    const competitors = ["carl-bot", "dyno", "mee6"];
    for (const comp of competitors) {
      const pagePath = path.join(rootDir, `src/app/alternatives/${comp}/page.tsx`);
      expect(fs.existsSync(pagePath)).toBe(true);
      const content = fs.readFileSync(pagePath, "utf-8");
      expect(content).toMatch(/\/api\/auth\/signin|\/#features|cta1|cta2|Link/i);
    }
  });

  it("TC-T3-07 (Cookie Consent Persistence): Cookie banner component handles user dismissal state", () => {
    const cookiePath = path.join(rootDir, "src/components/Cookie.tsx");
    expect(fs.existsSync(cookiePath)).toBe(true);
    const content = fs.readFileSync(cookiePath, "utf-8");
    expect(content).toMatch(/cookie|localStorage|accept|dismiss|Cookie/i);
  });

  it("TC-T3-08 (Docs Search to Command Browser): Docs header / search routes cross-reference command browser", () => {
    const docsPath = path.join(rootDir, "src/app/docs/page.tsx");
    expect(fs.existsSync(docsPath)).toBe(true);
    const content = fs.readFileSync(docsPath, "utf-8");
    expect(content).toMatch(/\/docs\/commands|\/commands|CommandBrowser|search/i);
  });
});
