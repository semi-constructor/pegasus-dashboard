'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const PARTICLE_COUNT = 250;
const ACCENT_COLOR = new THREE.Color('#5E5CE6');
const WHITE_COLOR = new THREE.Color('#ffffff');

// ---------------------------------------------------------------------------
// Custom shader material for per-particle size + colour + opacity
// ---------------------------------------------------------------------------
const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aOpacity;
  attribute vec3 aColor;
  varying float vOpacity;
  varying vec3 vColor;

  void main() {
    vOpacity = aOpacity;
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // Scale point size relative to distance so particles feel 3-D
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vOpacity;
  varying vec3 vColor;

  void main() {
    // Soft circle falloff
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.15, d) * vOpacity;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// ---------------------------------------------------------------------------
// Particle system component (rendered inside <Canvas>)
// ---------------------------------------------------------------------------
function ParticleNebula() {
  const pointsRef = useRef<THREE.Points>(null);

  // Shared refs for scroll & mouse (written by listeners in parent via closure)
  const scrollRef = useRef(0); // normalised 0-1
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 }); // NDC -1..1

  // ── Listeners ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // ── Generate initial attributes ──────────────────────────────────────────
  const { positions, basePositions, sizes, opacities, colors, phases } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const basePositions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const opacities = new Float32Array(PARTICLE_COUNT);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const phases = new Float32Array(PARTICLE_COUNT); // individual oscillation phase

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Distribute in an ellipsoid (wider in X/Z, shallower in Y)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 3.5; // radius 2.5 – 6

      const x = r * Math.sin(phi) * Math.cos(theta) * 1.6; // wider X
      const y = r * Math.cos(phi) * 0.8; // shallower Y
      const z = r * Math.sin(phi) * Math.sin(theta) * 1.4; // moderate Z

      const i3 = i * 3;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      basePositions[i3] = x;
      basePositions[i3 + 1] = y;
      basePositions[i3 + 2] = z;

      // Random size within spec range
      sizes[i] = 0.015 + Math.random() * 0.025;

      // ~30% are accent, rest are white, with specified opacities
      const isAccent = Math.random() < 0.3;
      const col = isAccent ? ACCENT_COLOR : WHITE_COLOR;
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      opacities[i] = isAccent ? 0.15 : 0.05;

      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, basePositions, sizes, opacities, colors, phases };
  }, []);

  // Keep a separate Float32Array for mutable opacities so we can tweak per-frame
  const currentOpacities = useRef(new Float32Array(opacities));

  // ── Animation loop ───────────────────────────────────────────────────────
  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const opAttr = geo.attributes.aOpacity as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;
    const opArr = opAttr.array as Float32Array;

    const scroll = scrollRef.current;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const phase = phases[i];

      // Base positions + sinusoidal drift
      const bx = basePositions[i3];
      const by = basePositions[i3 + 1];
      const bz = basePositions[i3 + 2];

      const driftX = Math.sin(time * 0.15 + phase) * 0.12;
      const driftY = Math.cos(time * 0.12 + phase * 1.3) * 0.1;
      const driftZ = Math.sin(time * 0.1 + phase * 0.7) * 0.08;

      let px = bx + driftX;
      let py = by + driftY;
      let pz = bz + driftZ;

      // Scroll parallax — shift field upward as user scrolls
      py += scroll * 2.5;

      // Cursor proximity — subtle attraction
      // Project particle roughly to screen-space for distance check
      const screenX = px / 6; // rough normalised [-1,1]
      const screenY = py / 4;
      const dx = mx - screenX;
      const dy = my - screenY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / 1.2); // 0..1 proximity

      // Small displacement toward cursor
      px += dx * influence * 0.06;
      py += dy * influence * 0.06;

      posArr[i3] = px;
      posArr[i3 + 1] = py;
      posArr[i3 + 2] = pz;

      // Brighten particles near cursor
      const baseOp = opacities[i];
      opArr[i] = baseOp + influence * 0.12;
    }

    posAttr.needsUpdate = true;
    opAttr.needsUpdate = true;

    // Slow global rotation
    pointsRef.current.rotation.y = time * 0.03;
  });

  // ── ShaderMaterial ───────────────────────────────────────────────────────
  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aOpacity"
          args={[new Float32Array(opacities), 1]}
        />
        <bufferAttribute
          attach="attributes-aColor"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <primitive object={shaderMaterial} attach="material" />
    </points>
  );
}

// ---------------------------------------------------------------------------
// Exported wrapper
// ---------------------------------------------------------------------------
export function BackgroundScene() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#020205] overflow-hidden pointer-events-none">
      {/* Three.js particle canvas */}
      <div className="absolute inset-0 z-[0]">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          gl={{ alpha: true, antialias: false }}
          dpr={[1, 1.5]}
        >
          <ParticleNebula />
        </Canvas>
      </div>

      {/* Accent glow orbs */}
      <div className="absolute top-0 left-1/4 w-[50vw] h-[50vh] bg-[#5E5CE6] mix-blend-screen opacity-[0.07] filter blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[60vw] h-[50vh] bg-[#5E5CE6] mix-blend-screen opacity-[0.05] filter blur-[150px] rounded-full" />
    </div>
  );
}
