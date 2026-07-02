'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

function ScrubText({ title, subtitle, desc }: { title: string, subtitle: string, desc: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  // Soft spring physics for the text scrubbing
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });
  const opacity = useTransform(smoothProgress, [0, 0.5, 1], [0.2, 1, 0.2]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const x = useTransform(smoothProgress, [0, 0.5, 1], [-20, 0, -20]);

  return (
    <motion.div ref={ref} style={{ opacity, scale, x }} className="py-[30vh]">
      <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-4">
        // {subtitle}
      </div>
      <h2 className="text-5xl md:text-6xl font-light tracking-tight text-white mb-8 leading-[1.1]">
        {title}
      </h2>
      <p className="text-xl text-neutral-400 font-light leading-relaxed max-w-xl">
        {desc}
      </p>
    </motion.div>
  );
}

export function ScrollScrubbedShowcase() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  // Complex Morphing Physics for the Sticky Object
  const rotate = useTransform(smoothProgress, [0, 1], [0, 720]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.5, 1.5, 0.5]);
  const borderRadius = useTransform(smoothProgress, [0, 0.3, 0.7, 1], ["50%", "10%", "50%", "30%"]);
  
  // Dynamic glow and colors
  const borderColor = useTransform(smoothProgress, [0, 0.5, 1], ["rgba(94, 92, 230, 0.1)", "rgba(94, 92, 230, 0.8)", "rgba(94, 92, 230, 0.1)"]);
  const boxShadow = useTransform(smoothProgress, [0, 0.5, 1], [
    "0 0 0px rgba(94, 92, 230, 0)",
    "0 0 120px rgba(94, 92, 230, 0.4)",
    "0 0 0px rgba(94, 92, 230, 0)"
  ]);

  return (
    <section ref={targetRef} className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start justify-between min-h-[400vh]">
      
      {/* Left Text Column - Scrubbing Texts */}
      <div className="w-full md:w-1/2 relative z-10">
        <ScrubText 
          subtitle="ARCHITECTURE"
          title="Designed for infinite scale."
          desc="Pegasus operates on an elastic serverless infrastructure, dynamically provisioning resources as computational demand surges. Experience sub-millisecond latency and high availability."
        />
        <ScrubText 
          subtitle="TRANSPARENCY"
          title="Completely open by default."
          desc="Cryptographically transparent and fully open-source. Fork the entire repository, perform comprehensive code audits, and deploy the system precisely aligned with your security posture."
        />
        <ScrubText 
          subtitle="MODULARITY"
          title="A fully pluggable ecosystem."
          desc="A highly decoupled architecture allows seamless toggling of independent micro-features. Suspend the economy module or swap out moderation handlers with absolute freedom."
        />
        <ScrubText 
          subtitle="PROGRAMMABILITY"
          title="Script your own logic."
          desc="Leverage a robust custom command engine to define dynamic prefix-based logic routines. Construct tailored multi-stage workflows directly from your chat interface."
        />
      </div>

      {/* Right Sticky Column with the Morphing Object */}
      <div className="hidden md:flex w-full md:w-1/2 sticky top-0 h-screen items-center justify-center z-10 pointer-events-none">
        <motion.div 
          style={{ rotate, scale, borderRadius, borderColor, boxShadow }}
          className="relative w-80 h-80 flex items-center justify-center border border-white/10 border-t-white/20 border-l-white/20 bg-white/[0.03] backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] rounded-[inherit]" />
          {/* Inner reactive core */}
          <motion.div 
            style={{ 
              rotate: useTransform(smoothProgress, [0, 1], [0, -1080]),
              scale: useTransform(smoothProgress, [0, 0.5, 1], [1, 0.2, 1]),
              borderRadius: useTransform(smoothProgress, [0, 0.5, 1], ["10%", "50%", "10%"])
            }}
            className="absolute inset-8 bg-black border border-white/20 flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_20px_white]" />
          </motion.div>
          
          {/* Scanning line effect */}
          <motion.div 
            style={{
              top: useTransform(smoothProgress, [0, 1], ["-10%", "110%"])
            }}
            className="absolute left-0 right-0 h-px bg-[#5E5CE6]/50 shadow-[0_0_10px_#5E5CE6]"
          />
        </motion.div>
      </div>
    </section>
  );
}
