'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function AbstractGrid() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create a plane with many segments for vertex manipulation
  const geometry = useMemo(() => new THREE.PlaneGeometry(50, 50, 40, 40), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    // Create a smooth, rolling wave effect
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      positions[i + 2] = Math.sin(x * 0.2 + time * 0.5) * 1.5 + Math.cos(y * 0.2 + time * 0.3) * 1.5;
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Slow rotation
    meshRef.current.rotation.z = time * 0.05;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -5, -15]}>
      <meshBasicMaterial 
        color="#5E5CE6" 
        wireframe={true} 
        transparent={true}
        opacity={0.15}
      />
    </mesh>
  );
}

export function BackgroundScene() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#020205] overflow-hidden pointer-events-none">
      {/* Abstract Grid Canvas */}
      <div className="absolute inset-0 z-[0]">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <AbstractGrid />
        </Canvas>
      </div>
      
      {/* Subtle Accent Glows (not overwhelming, strictly tied to the accent color) */}
      <div className="absolute top-0 left-1/4 w-[50vw] h-[50vh] bg-[#5E5CE6] mix-blend-screen opacity-[0.07] filter blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[60vw] h-[50vh] bg-[#5E5CE6] mix-blend-screen opacity-[0.05] filter blur-[150px] rounded-full" />
    </div>
  );
}
