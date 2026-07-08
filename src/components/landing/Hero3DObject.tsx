'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const AbstractCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.2;
      meshRef.current.rotation.z = t * 0.1;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = -t * 0.15;
      wireframeRef.current.rotation.x = t * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
      {/* Inner Glowing Core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 4]} />
        <MeshDistortMaterial 
          color="#B026FF" 
          emissive="#5E26FF"
          emissiveIntensity={2}
          distort={0.4} 
          speed={2} 
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Outer Wireframe Cage */}
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshStandardMaterial 
          color="#ffffff" 
          wireframe 
          transparent 
          opacity={0.15}
        />
      </mesh>
    </Float>
  );
};

export const Hero3DObject = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#B026FF" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
        <AbstractCore />
      </Canvas>
    </div>
  );
};
