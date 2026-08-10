import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const locales = ["en", "de", "es", "fr"];
const messagesDir = path.join(process.cwd(), "src/i18n/messages");

function getAllKeys(obj: Record<string, any>, prefix = ""): string[] {
  let keys: string[] = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        keys = keys.concat(getAllKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
  }
  return keys;
}

describe("i18n Parity Tests", () => {
  const namespaces = fs
    .readdirSync(path.join(messagesDir, "en"))
    .filter((f) => f.endsWith(".json"));

  it("should have all 28 JSON namespaces present in all locales", () => {
    for (const locale of locales) {
      const localeDir = path.join(messagesDir, locale);
      expect(fs.existsSync(localeDir)).toBe(true);
      const files = fs.readdirSync(localeDir).filter((f) => f.endsWith(".json"));
      expect(files.sort()).toEqual(namespaces.sort());
    }
  });

  it("should have 100% key parity across en, de, es, fr for every namespace", () => {
    for (const nsFile of namespaces) {
      const enContent = JSON.parse(
        fs.readFileSync(path.join(messagesDir, "en", nsFile), "utf-8")
      );
      const enKeys = getAllKeys(enContent).sort();

      for (const locale of ["de", "es", "fr"]) {
        const locContent = JSON.parse(
          fs.readFileSync(path.join(messagesDir, locale, nsFile), "utf-8")
        );
        const locKeys = getAllKeys(locContent).sort();

        const missing = enKeys.filter((k) => !locKeys.includes(k));
        const extra = locKeys.filter((k) => !enKeys.includes(k));

        expect(missing, `Missing keys in ${locale}/${nsFile}`).toEqual([]);
        expect(extra, `Extra keys in ${locale}/${nsFile}`).toEqual([]);
      }
    }
  });
});
