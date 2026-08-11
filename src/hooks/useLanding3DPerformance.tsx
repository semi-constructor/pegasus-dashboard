"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

export type PerformanceTier = "HIGH" | "MEDIUM" | "OFF";

export interface Landing3DPerformanceContextType {
  tier: PerformanceTier;
  overrideTier: (tier: PerformanceTier) => void;
  reportLowFPS: () => void;
  isDetected: boolean;
}

/**
 * Detect client capabilities conservatively for landing page 3D glass elements.
 * Returns OFF for weak/mobile/software WebGL devices, MEDIUM for mid-tier, HIGH for powerful PCs.
 */
export function detectLandingPerformanceTier(): PerformanceTier {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "HIGH";
  }

  // 1. Accessibility: respect reduced motion preferences
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "OFF";
  }

  // 2. Device / Mobile check
  const ua = navigator.userAgent || "";
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(ua) ||
    (typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 1 && window.innerWidth <= 1024);

  if (isMobile) {
    // Conservative: disable heavy WebGL refraction/transmission glass shaders on mobile devices
    return "OFF";
  }

  // 3. WebGL Support and Renderer Inspection
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      return "OFF";
    }

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      const renderer = (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "").toLowerCase();

      // Check software renderer drivers
      if (
        renderer.includes("swiftshader") ||
        renderer.includes("llvmpipe") ||
        renderer.includes("software") ||
        renderer.includes("basic render driver") ||
        renderer.includes("disabled")
      ) {
        return "OFF";
      }

      // Check low-end / older integrated GPUs
      if (
        renderer.includes("intel hd graphics 2000") ||
        renderer.includes("intel hd graphics 3000") ||
        renderer.includes("intel hd graphics 4000") ||
        renderer.includes("mali-g31") ||
        renderer.includes("adreno 306")
      ) {
        return "OFF";
      }
    }
  } catch {
    return "OFF";
  }

  // 4. Hardware Concurrency & Device Memory
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 8;

  // Conservative threshold
  if (cores < 4 || memory < 4) {
    return "OFF";
  }

  if (cores < 8 || memory < 8) {
    return "MEDIUM";
  }

  return "HIGH";
}

const Landing3DContext = createContext<Landing3DPerformanceContextType>({
  tier: "HIGH",
  overrideTier: () => {},
  reportLowFPS: () => {},
  isDetected: false,
});

export function Landing3DProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<PerformanceTier>("HIGH");
  const [isDetected, setIsDetected] = useState(false);
  const lastDowngradeRef = useRef<number>(0);

  useEffect(() => {
    const detectedTier = detectLandingPerformanceTier();
    setTier(detectedTier);
    setIsDetected(true);
  }, []);

  const overrideTier = useCallback((newTier: PerformanceTier) => {
    setTier(newTier);
  }, []);

  // Hysteresis FPS downgrade logic (HIGH -> MEDIUM -> OFF) with debouncing
  const reportLowFPS = useCallback(() => {
    const now = Date.now();
    // At least 4 seconds must pass between downgrades to avoid thrashes
    if (now - lastDowngradeRef.current < 4000) return;

    setTier((prevTier) => {
      if (prevTier === "HIGH") {
        lastDowngradeRef.current = now;
        return "MEDIUM";
      }
      if (prevTier === "MEDIUM") {
        lastDowngradeRef.current = now;
        return "OFF";
      }
      return "OFF";
    });
  }, []);

  return (
    <Landing3DContext.Provider value={{ tier, overrideTier, reportLowFPS, isDetected }}>
      {children}
    </Landing3DContext.Provider>
  );
}

export function useLanding3DPerformance() {
  return useContext(Landing3DContext);
}
