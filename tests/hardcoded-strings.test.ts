import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const corePages = [
  "src/app/dashboard/admin/audit-logs/AuditLogsClient.tsx",
  "src/app/dashboard/admin/bug-reports/_components/bug-reports-client.tsx",
  "src/app/dashboard/admin/database/page.tsx",
  "src/app/dashboard/admin/metrics/components/MetricsClient.tsx",
  "src/app/dashboard/admin/security/_components/security-client.tsx",
  "src/app/dashboard/profile/reports/_components/user-reports-client.tsx",
  "src/app/dashboard/[guildId]/economy/_components/economy-client.tsx",
  "src/app/dashboard/[guildId]/jtc/_components/jtc-client.tsx",
  "src/app/dashboard/[guildId]/settings/_components/settings-client.tsx",
  "src/app/dashboard/[guildId]/tickets/_components/tickets-client.tsx",
  "src/components/dashboard/DashboardLayout.tsx",
];

describe("TSX Localization Inspection", () => {
  it("should use next-intl translation hook (useTranslations) in all core pages", () => {
    for (const relativePath of corePages) {
      const fullPath = path.join(process.cwd(), relativePath);
      expect(fs.existsSync(fullPath), `File missing: ${relativePath}`).toBe(true);
      const content = fs.readFileSync(fullPath, "utf-8");
      expect(content.includes("useTranslations"), `${relativePath} does not use useTranslations`).toBe(true);
    }
  });
});
