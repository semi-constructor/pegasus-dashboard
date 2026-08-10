import { describe, it, expect } from "vitest";
import { locales, defaultLocale, Locale } from "../src/i18n/config";

describe("i18n Config Tests", () => {
  it("should support en, de, es, fr as supported locales", () => {
    expect(locales).toEqual(["en", "de", "es", "fr"]);
  });

  it("should default to en", () => {
    expect(defaultLocale).toBe("en");
  });

  it("should have valid locale type definitions", () => {
    const testLocale: Locale = "de";
    expect(locales.includes(testLocale)).toBe(true);
  });
});
