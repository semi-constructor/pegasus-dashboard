'use client';

import { motion } from 'framer-motion';

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-[#000000]">
      {/* Orb 1: Primary Indigo */}
      <motion.div
        animate={{
          x: ['-20vw', '20vw', '-20vw'],
          y: ['-20vh', '30vh', '-20vh'],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-[#5E5CE6] mix-blend-screen opacity-30 filter blur-[100px] md:blur-[180px]"
      />
      
      {/* Orb 2: Deep Purple */}
      <motion.div
        animate={{
          x: ['20vw', '-20vw', '20vw'],
          y: ['30vh', '-10vh', '30vh'],
          scale: [1.2, 1, 1.2],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#8A2BE2] mix-blend-screen opacity-30 filter blur-[100px] md:blur-[180px]"
      />

      {/* Orb 3: Cyan/Blue accent */}
      <motion.div
        animate={{
          x: ['0vw', '10vw', '0vw'],
          y: ['0vh', '10vh', '0vh'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-[#00BFFF] mix-blend-screen opacity-20 filter blur-[100px] md:blur-[180px]"
      />
      
      {/* Subtle Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
