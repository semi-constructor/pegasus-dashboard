'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PointMaterial, Points, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { random } from 'maath';

function SpatialParticles(props: any) {
  const ref = useRef<THREE.Points>(null!);
  const sphere = useMemo(() => {
    const data = random.inSphere(new Float32Array(5000 * 3), { radius: 10 });
    // Filter out NaN values that might occasionally occur
    for (let i = 0; i < data.length; i++) {
      if (isNaN(data[i])) data[i] = 0;
    }
    return data;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 30;
      ref.current.rotation.y -= delta / 40;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere as Float32Array} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#5E5CE6"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time / 4) / 4;
      meshRef.current.rotation.y = time / 5;
      meshRef.current.position.y = Math.sin(time / 3) * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={[3, 0, -4]} scale={1.5}>
        <icosahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial 
          ref={materialRef}
          color="#1A1A24"
          emissive="#5E5CE6"
          emissiveIntensity={0.2}
          wireframe
          transparent
          opacity={0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <mesh position={[-4, 2, -5]} scale={1}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial 
          color="#1A1A24"
          emissive="#ffffff"
          emissiveIntensity={0.1}
          wireframe
          transparent
          opacity={0.15}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

export function BackgroundScene() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#020205] overflow-hidden pointer-events-none">
      <div className="absolute inset-0 z-[0] opacity-80">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ alpha: true, antialias: true }} dpr={[1, 2]}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#5E5CE6" />
          <SpatialParticles />
          <FloatingGeometry />
          <Preload all />
        </Canvas>
      </div>
      
      {/* Super soft gradient field */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vh] bg-[#5E5CE6] mix-blend-screen opacity-[0.06] filter blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vh] bg-[#5E5CE6] mix-blend-screen opacity-[0.04] filter blur-[180px] rounded-full" />
      <div className="absolute top-[30%] left-[50%] w-[50vw] h-[50vh] bg-[#ffffff] mix-blend-screen opacity-[0.02] filter blur-[120px] rounded-full" />
      
      {/* Minimal grain overlay for texture */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJz48ZmlsdGVyIGlkPSdub2lzZSc+PGZlVHVyYnVsZW5jZSB0eXBlPSdmcmFjdGFsTm9pc2UnIGJhc2VGcmVxdWVuY3k9JzEuNScgbnVtT2N0YXZlcz0nMycgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWx0ZXI9J3VybCgqbm9pc2UpJyBvcGFjaXR5PScwLjk1JyAvPjwvc3ZnPg==')]" />
    </div>
  );
}
