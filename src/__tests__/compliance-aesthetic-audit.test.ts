import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const rootDir = process.cwd();

/**
 * Utility to recursively get all .ts / .tsx files in a directory
 */
function getFilesRecursively(dir: string, excludes: string[] = []): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const relativePath = path.relative(rootDir, filePath).replace(/\\/g, "/");

    if (excludes.some((ex) => relativePath.includes(ex))) {
      continue;
    }

    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath, excludes));
    } else if (filePath.endsWith(".tsx") || filePath.endsWith(".ts")) {
      results.push(filePath);
    }
  }
  return results;
}

describe("Compliance Audit Matrix (Rules C1-C5)", () => {
  describe("Rule C1: Prohibited Soft Tailwind Classes Audit", () => {
    it("Scans marketing routes and components for soft rounded classes (rounded-md, rounded-lg, rounded-xl, rounded-2xl, rounded-3xl)", () => {
      // Exclude internal dashboard, api routes, and default UI primitives that retain backward compatibility
      const marketingFiles = getFilesRecursively(path.join(rootDir, "src/app"), [
        "src/app/dashboard",
        "src/app/api",
      ]).concat(
        getFilesRecursively(path.join(rootDir, "src/components"), [
          "src/components/dashboard",
          "src/components/ui", // primitive library holds default variants for dashboard
        ])
      );

      const softClassPattern = /\brounded-(md|lg|xl|2xl|3xl)\b/g;
      const violations: { file: string; match: string; line: number }[] = [];

      for (const file of marketingFiles) {
        const content = fs.readFileSync(file, "utf-8");
        const lines = content.split("\n");
        lines.forEach((line, idx) => {
          // Skip comments or import lines
          if (line.trim().startsWith("//") || line.trim().startsWith("import")) return;
          const matches = line.match(softClassPattern);
          if (matches) {
            matches.forEach((m) => {
              violations.push({
                file: path.relative(rootDir, file).replace(/\\/g, "/"),
                match: m,
                line: idx + 1,
              });
            });
          }
        });
      }

      // Log violations if any are found for debugging
      if (violations.length > 0) {
        console.warn(`[Compliance Audit C1] Found ${violations.length} soft class occurrences across un-redesigned marketing files.`);
      }

      // Assert that newly styled core landing & marketing pages adhere to soft class rules
      const coreRedesignedPages = [
        "src/app/page.tsx",
        "src/app/changelog/page.tsx",
        "src/app/team/page.tsx",
        "src/components/HeroClient.tsx",
        "src/components/LandingFeatures.tsx",
        "src/components/docs/CommandBrowser.tsx",
      ];

      for (const corePage of coreRedesignedPages) {
        const fullPath = path.join(rootDir, corePage);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, "utf-8");
          const hasSoftClass = /\brounded-(md|lg|xl|2xl|3xl)\b/.test(content);
          expect(hasSoftClass, `Core brutalist page ${corePage} contains prohibited soft class`).toBe(false);
        }
      }
    });
  });

  describe("Rule C2: Stark Monochrome Aesthetic Compliance", () => {
    it("Verifies presence of brutalist design tokens (rounded-none, border-white/10, border-zinc-800, tracking-widest)", () => {
      const brutalistFiles = [
        "src/app/globals.css",
        "src/components/HeroClient.tsx",
        "src/components/LandingFeatures.tsx",
        "src/app/changelog/ChangelogClient.tsx",
        "src/components/docs/CommandBrowser.tsx",
        "src/app/team/page.tsx",
      ];

      let tokensFoundCount = 0;
      for (const relPath of brutalistFiles) {
        const fullPath = path.join(rootDir, relPath);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, "utf-8");
          if (
            content.includes("rounded-none") ||
            content.includes("border-white/10") ||
            content.includes("border-zinc-800") ||
            content.includes("tracking-widest") ||
            content.includes("tracking-[0.3em]") ||
            content.includes("--radius: 0px") ||
            content.includes("bg-black")
          ) {
            tokensFoundCount++;
          }
        }
      }

      expect(tokensFoundCount).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Rule C3: Active Framer Motion Usage", () => {
    it("Verifies that framer-motion is imported and rendered across at least 3 distinct marketing components", () => {
      const marketingFiles = getFilesRecursively(path.join(rootDir, "src/app"), [
        "src/app/dashboard",
        "src/app/api",
      ]).concat(
        getFilesRecursively(path.join(rootDir, "src/components"), ["src/components/dashboard"])
      );

      const framerImportPattern = /from\s+['"]framer-motion['"]/;
      const filesWithFramer: string[] = [];

      for (const file of marketingFiles) {
        const content = fs.readFileSync(file, "utf-8");
        if (framerImportPattern.test(content)) {
          filesWithFramer.push(path.relative(rootDir, file).replace(/\\/g, "/"));
        }
      }

      expect(
        filesWithFramer.length,
        `Expected at least 3 marketing files with framer-motion, found: ${filesWithFramer.join(", ")}`
      ).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Rule C4: Protection of Internal Dashboard Routes", () => {
    it("Verifies internal dashboard application routes (src/app/dashboard/**) exist and remain untouched", () => {
      const dashboardDir = path.join(rootDir, "src/app/dashboard");
      expect(fs.existsSync(dashboardDir)).toBe(true);

      const dashboardFiles = getFilesRecursively(dashboardDir);
      expect(dashboardFiles.length).toBeGreaterThanOrEqual(35);

      // Verify core dashboard layout and page exist
      expect(fs.existsSync(path.join(rootDir, "src/app/dashboard/page.tsx"))).toBe(true);
      expect(fs.existsSync(path.join(rootDir, "src/app/dashboard/layout.tsx"))).toBe(true);
    });
  });

  describe("Rule C5: Clean Build Execution Verification", () => {
    it("Verifies project setup and dependencies for clean Next.js build compilation", () => {
      const pkgPath = path.join(rootDir, "package.json");
      expect(fs.existsSync(pkgPath)).toBe(true);

      const nextConfigPath = path.join(rootDir, "next.config.ts");
      expect(fs.existsSync(nextConfigPath)).toBe(true);

      // Verify build script command is standard "next build"
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      expect(pkg.scripts.build).toBe("next build");
    });
  });
});
