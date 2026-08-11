// @vitest-environment jsdom

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { detectLandingPerformanceTier } from "../src/hooks/useLanding3DPerformance";

describe("Landing 3D Performance Tier Detection", () => {
  const originalWindow = global.window;
  const originalNavigator = global.navigator;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.window = originalWindow;
    global.navigator = originalNavigator;
  });

  it("should return OFF when prefers-reduced-motion is active", () => {
    vi.stubGlobal("window", {
      matchMedia: (query: string) => ({
        matches: query.includes("prefers-reduced-motion: reduce"),
      }),
      innerWidth: 1920,
    });
    vi.stubGlobal("navigator", {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      hardwareConcurrency: 16,
      deviceMemory: 16,
    });

    const tier = detectLandingPerformanceTier();
    expect(tier).toBe("OFF");
  });

  it("should return OFF for mobile user agents", () => {
    vi.stubGlobal("window", {
      matchMedia: () => ({ matches: false }),
      innerWidth: 390,
    });
    vi.stubGlobal("navigator", {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
      maxTouchPoints: 5,
      hardwareConcurrency: 6,
      deviceMemory: 4,
    });

    const tier = detectLandingPerformanceTier();
    expect(tier).toBe("OFF");
  });

  it("should return OFF for devices with low CPU cores (< 4)", () => {
    vi.stubGlobal("window", {
      matchMedia: () => ({ matches: false }),
      innerWidth: 1920,
    });
    vi.stubGlobal("navigator", {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      hardwareConcurrency: 2,
      deviceMemory: 8,
    });

    const tier = detectLandingPerformanceTier();
    expect(tier).toBe("OFF");
  });

  it("should return MEDIUM for mid-tier hardware (4 <= cores < 8)", () => {
    vi.stubGlobal("window", {
      matchMedia: () => ({ matches: false }),
      innerWidth: 1920,
    });
    vi.stubGlobal("navigator", {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      hardwareConcurrency: 4,
      deviceMemory: 4,
    });

    const mockCanvas = {
      getContext: () => ({
        getExtension: () => null,
        getParameter: () => "NVIDIA GeForce RTX 3060",
      }),
    };
    vi.spyOn(document, "createElement").mockReturnValue(mockCanvas as any);

    const tier = detectLandingPerformanceTier();
    expect(tier).toBe("MEDIUM");
  });

  it("should return HIGH for high-tier desktop hardware", () => {
    vi.stubGlobal("window", {
      matchMedia: () => ({ matches: false }),
      innerWidth: 1920,
    });
    vi.stubGlobal("navigator", {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      hardwareConcurrency: 16,
      deviceMemory: 16,
    });

    const mockCanvas = {
      getContext: () => ({
        getExtension: () => ({
          UNMASKED_RENDERER_WEBGL: 37446,
          UNMASKED_VENDOR_WEBGL: 37445,
        }),
        getParameter: () => "NVIDIA GeForce RTX 4080",
      }),
    };
    vi.spyOn(document, "createElement").mockReturnValue(mockCanvas as any);

    const tier = detectLandingPerformanceTier();
    expect(tier).toBe("HIGH");
  });
});
