"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Environment, Float, Sparkles, Text3D, Center } from "@react-three/drei";
import * as THREE from "three";
import { PerformanceTier } from "@/hooks/useLanding3DPerformance";

/**
 * FPS Monitor component inside the Three.js render loop.
 * Monitors average FPS over 1-second windows and triggers a downgrade if performance is consistently poor.
 */
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
        // Downgrade quality after 3 consecutive seconds of poor performance
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

function ThemedGlassShape({ index, tier }: { index: number; tier: PerformanceTier }) {
  const group = useRef<THREE.Group>(null);
  const isMedium = tier === "MEDIUM";

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.4;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      group.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  const getMaterialProps = (color: string) => ({
    backside: true,
    samples: isMedium ? 2 : 6,
    thickness: isMedium ? 1.5 : 2,
    chromaticAberration: isMedium ? 1 : 3,
    anisotropy: isMedium ? 0 : 0.8,
    distortion: isMedium ? 0 : 0.1,
    distortionScale: isMedium ? 0 : 0.2,
    temporalDistortion: 0.0,
    transmission: 1,
    ior: 1.15,
    color,
    roughness: isMedium ? 0.1 : 0.05,
    clearcoat: isMedium ? 0.5 : 1,
    clearcoatRoughness: 0.1,
  });

  const extrudeSettings = useMemo(
    () => ({
      depth: isMedium ? 0.3 : 0.4,
      bevelEnabled: true,
      bevelSegments: isMedium ? 1 : 4,
      steps: isMedium ? 1 : 2,
      bevelSize: isMedium ? 0.03 : 0.05,
      bevelThickness: isMedium ? 0.03 : 0.05,
    }),
    [isMedium]
  );

  // 1. Warning Sign (Triangle with exclamation mark hole)
  const warningShape = useMemo(() => {
    const s = new THREE.Shape();
    const size = 1.8;
    s.moveTo(0, size);
    s.lineTo(size * 0.866, -size * 0.5);
    s.lineTo(-size * 0.866, -size * 0.5);
    s.lineTo(0, size);

    const holeDot = new THREE.Path();
    holeDot.absarc(0, -0.2, 0.15, 0, Math.PI * 2, false);
    s.holes.push(holeDot);

    const holeLine = new THREE.Path();
    holeLine.moveTo(-0.15, 0.1);
    holeLine.lineTo(0.15, 0.1);
    holeLine.lineTo(0.1, 0.8);
    holeLine.lineTo(-0.1, 0.8);
    holeLine.lineTo(-0.15, 0.1);
    s.holes.push(holeLine);

    return s;
  }, []);

  // 3. Ticket
  const ticketShape = useMemo(() => {
    const s = new THREE.Shape();
    const w = 2;
    const h = 1.2;
    const r = 0.3;
    s.moveTo(-w, h);
    s.lineTo(w, h);
    s.lineTo(w, r);
    s.absarc(w, 0, r, Math.PI / 2, -Math.PI / 2, true);
    s.lineTo(w, -h);
    s.lineTo(-w, -h);
    s.lineTo(-w, -r);
    s.absarc(-w, 0, r, -Math.PI / 2, Math.PI / 2, true);
    s.lineTo(-w, h);
    return s;
  }, []);

  // 6. Smiley Face
  const smileyShape = useMemo(() => {
    const s = new THREE.Shape();
    s.absarc(0, 0, 1.6, 0, Math.PI * 2, false);
    const eyeL = new THREE.Path();
    eyeL.absarc(-0.6, 0.4, 0.25, 0, Math.PI * 2, true);
    s.holes.push(eyeL);
    const eyeR = new THREE.Path();
    eyeR.absarc(0.6, 0.4, 0.25, 0, Math.PI * 2, true);
    s.holes.push(eyeR);
    const smile = new THREE.Path();
    smile.absarc(0, -0.2, 0.8, Math.PI, 0, true);
    smile.absarc(0, -0.1, 0.6, 0, Math.PI, false);
    s.holes.push(smile);
    return s;
  }, []);

  const renderShape = () => {
    const cylSegs = isMedium ? 32 : 64;
    const torusSegs1 = isMedium ? 16 : 32;
    const torusSegs2 = isMedium ? 32 : 64;

    switch (index) {
      case 0:
        return (
          <mesh>
            <extrudeGeometry args={[warningShape, extrudeSettings]} />
            <MeshTransmissionMaterial {...getMaterialProps("#ff3333")} />
          </mesh>
        );
      case 1:
        return (
          <group>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[1.5, 1.5, 0.3, cylSegs]} />
              <MeshTransmissionMaterial {...getMaterialProps("#00ff66")} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.5, 0.2, torusSegs1, torusSegs2]} />
              <MeshTransmissionMaterial {...getMaterialProps("#00ff66")} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
              <cylinderGeometry args={[0.8, 0.8, 0.4, 5]} />
              <MeshTransmissionMaterial {...getMaterialProps("#00ff66")} />
            </mesh>
          </group>
        );
      case 2:
        return (
          <mesh>
            <extrudeGeometry args={[ticketShape, { ...extrudeSettings, depth: isMedium ? 0.15 : 0.2 }]} />
            <MeshTransmissionMaterial {...getMaterialProps("#a020f0")} />
          </mesh>
        );
      case 3:
        return (
          <group>
            <mesh>
              <boxGeometry args={[2.2, 2.2, 2.2]} />
              <MeshTransmissionMaterial {...getMaterialProps("#0088ff")} />
            </mesh>
            <mesh>
              <boxGeometry args={[2.3, 2.3, 0.4]} />
              <MeshTransmissionMaterial {...getMaterialProps("#ffffff")} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.4, 2.3, 2.3]} />
              <MeshTransmissionMaterial {...getMaterialProps("#ffffff")} />
            </mesh>
            <mesh position={[0.4, 1.2, 0]} rotation={[0, 0, Math.PI / 4]}>
              <torusGeometry args={[0.4, 0.1, isMedium ? 8 : 16, isMedium ? 16 : 32]} />
              <MeshTransmissionMaterial {...getMaterialProps("#ffffff")} />
            </mesh>
            <mesh position={[-0.4, 1.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
              <torusGeometry args={[0.4, 0.1, isMedium ? 8 : 16, isMedium ? 16 : 32]} />
              <MeshTransmissionMaterial {...getMaterialProps("#ffffff")} />
            </mesh>
          </group>
        );
      case 4:
        return (
          <group>
            <mesh>
              <boxGeometry args={[3.2, 3.8, 2.2]} />
              <MeshTransmissionMaterial {...getMaterialProps("#cccc00")} transmission={0.9} ior={1.1} />
            </mesh>
            <mesh position={[0, 1.2, 0.2]}>
              <boxGeometry args={[2.8, 0.6, 2]} />
              <MeshTransmissionMaterial {...getMaterialProps("#ffff00")} />
            </mesh>
            <mesh position={[0, 0, 0.2]}>
              <boxGeometry args={[2.8, 0.6, 2]} />
              <MeshTransmissionMaterial {...getMaterialProps("#ffff00")} />
            </mesh>
            <mesh position={[0, -1.2, 0.2]}>
              <boxGeometry args={[2.8, 0.6, 2]} />
              <MeshTransmissionMaterial {...getMaterialProps("#ffff00")} />
            </mesh>
          </group>
        );
      case 5:
        return (
          <mesh>
            <extrudeGeometry args={[smileyShape, extrudeSettings]} />
            <MeshTransmissionMaterial {...getMaterialProps("#ffffff")} />
          </mesh>
        );
      case 6:
        return (
          <Center>
            <Text3D
              font="https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_bold.typeface.json"
              size={2}
              height={0.4}
              curveSegments={isMedium ? 4 : 12}
              bevelEnabled
              bevelThickness={0.05}
              bevelSize={0.02}
              bevelOffset={0}
              bevelSegments={isMedium ? 1 : 5}
            >
              {`{ / }`}
              <MeshTransmissionMaterial {...getMaterialProps("#ffffff")} />
            </Text3D>
          </Center>
        );
      case 7:
        return (
          <group>
            <mesh position={[0, 0.8, 0]}>
              <sphereGeometry args={[0.8, isMedium ? 16 : 32, isMedium ? 16 : 32]} />
              <MeshTransmissionMaterial {...getMaterialProps("#ff00ff")} />
            </mesh>
            <mesh position={[0, -0.6, 0]} scale={[1, 0.8, 0.5]}>
              <cylinderGeometry args={[0.5, 1.5, 1.5, isMedium ? 16 : 32]} />
              <MeshTransmissionMaterial {...getMaterialProps("#ff00ff")} />
            </mesh>
          </group>
        );
      default:
        return (
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <MeshTransmissionMaterial {...getMaterialProps("#ffffff")} />
          </mesh>
        );
    }
  };

  return (
    <Float speed={isMedium ? 1.5 : 2.5} rotationIntensity={0.5} floatIntensity={1.5} floatingRange={[-0.2, 0.2]}>
      <group ref={group}>{renderShape()}</group>
    </Float>
  );
}

export interface GlassShapes3DProps {
  index: number;
  tier: PerformanceTier;
  onLowFPS: () => void;
}

export default function GlassShapes3D({ index, tier, onLowFPS }: GlassShapes3DProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-30" style={{ mixBlendMode: "screen" }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <FPSMonitor onLowFPS={onLowFPS} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#ffffff" />
        <spotLight position={[0, 10, 10]} intensity={1.5} angle={0.5} penumbra={1} />

        <ThemedGlassShape index={index} tier={tier} />

        <Sparkles count={tier === "MEDIUM" ? 12 : 40} scale={12} size={3} speed={0.4} opacity={0.6} color="#ffffff" />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
