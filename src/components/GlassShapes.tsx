"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useLanding3DPerformance } from "@/hooks/useLanding3DPerformance";
import { GlassVisualFallback } from "./landing/GlassVisualFallback";
import type { GlassShapes3DProps } from "./landing/GlassShapes3D";

const GlassShapes3D = dynamic<GlassShapes3DProps>(
  () => import("./landing/GlassShapes3D"),
  {
    ssr: false,
    loading: () => null,
  }
);

export function GlassVisual({ index }: { index: number }) {
  const { tier, reportLowFPS, isDetected } = useLanding3DPerformance();

  // If tier is OFF or before client detection completes, render lightweight CSS glass fallback
  if (tier === "OFF" || !isDetected) {
    return <GlassVisualFallback index={index} />;
  }

  return <GlassShapes3D index={index} tier={tier} onLowFPS={reportLowFPS} />;
}
