"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useLanding3DPerformance } from "@/hooks/useLanding3DPerformance";
import type { ThreeBackground3DProps } from "./landing/ThreeBackground3D";

const ThreeBackground3D = dynamic<ThreeBackground3DProps>(
  () => import("./landing/ThreeBackground3D"),
  {
    ssr: false,
    loading: () => null,
  }
);

export function ThreeBackground() {
  const { tier, reportLowFPS, isDetected } = useLanding3DPerformance();

  if (tier === "OFF" || !isDetected) {
    return null;
  }

  return <ThreeBackground3D tier={tier} onLowFPS={reportLowFPS} />;
}
