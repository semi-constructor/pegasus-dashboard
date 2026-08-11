"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { PerformanceTier } from "@/hooks/useLanding3DPerformance";

function FPSMonitor({ onLowFPS }: { onLowFPS: () => void }) {
  const frameCount = useRef(0);
  const timeAccumulator = useRef(0);
  const lowFpsWindows = useRef(0);

  useFrame((_, delta) => {
    frameCount.current += 1;
    timeAccumulator.current += delta;

    if (timeAccumulator.current >= 1.0) {
      const fps = frameCount.current / timeAccumulator.current;
      frameCount.current = 0;
      timeAccumulator.current = 0;

      if (fps < 35) {
        lowFpsWindows.current += 1;
        if (lowFpsWindows.current >= 3) {
          lowFpsWindows.current = 0;
          onLowFPS();
        }
      } else {
        lowFpsWindows.current = Math.max(0, lowFpsWindows.current - 1);
      }
    }
  });

  return null;
}

function Stars({ tier, ...props }: { tier: PerformanceTier; [key: string]: any }) {
  const ref = useRef<any>(null);
  const count = tier === "MEDIUM" ? 1000 : 3000;

  const sphere = useMemo(() => {
    const data = new Float32Array(count * 3);
    return random.inSphere(data, { radius: 1.5 }) as Float32Array;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 30;
      ref.current.rotation.y -= delta / 40;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.3}
        />
      </Points>
    </group>
  );
}

export interface ThreeBackground3DProps {
  tier: PerformanceTier;
  onLowFPS: () => void;
}

export default function ThreeBackground3D({ tier, onLowFPS }: ThreeBackground3DProps) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <FPSMonitor onLowFPS={onLowFPS} />
        <Stars tier={tier} />
      </Canvas>
    </div>
  );
}
