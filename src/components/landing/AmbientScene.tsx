'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 1000;
  const dummy = new THREE.Object3D();

  // Initialize particle positions
  const particles = useRef(
    new Array(count).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40,
      z: (Math.random() - 0.5) * 40,
      speed: 0.001 + Math.random() * 0.002
    }))
  );

  useFrame(() => {
    if (!meshRef.current) return;
    
    // Tie Z-movement to the physical scroll position for structural integration
    const scrollY = window.scrollY;
    
    particles.current.forEach((particle, i) => {
      // Slow ambient drift
      particle.y += particle.speed;
      if (particle.y > 20) particle.y = -20;

      dummy.position.set(
        particle.x, 
        particle.y, 
        particle.z + (scrollY * 0.01) // Scroll responsive Z-depth
      );
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <circleGeometry args={[0.03, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
    </instancedMesh>
  );
}

export default function AmbientScene() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <ParticleField />
    </Canvas>
  );
}
