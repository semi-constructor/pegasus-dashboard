'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function ScrollScrubbedShowcase() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1.2, 0.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section ref={targetRef} className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start justify-between min-h-[300vh]">
      
      {/* Background ambient element responding to scroll */}
      <motion.div 
        style={{ y: backgroundY }} 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <div className="absolute top-[20%] left-[50%] w-[800px] h-[800px] bg-[#5E5CE6] opacity-[0.03] rounded-full blur-[100px] -translate-x-1/2" />
      </motion.div>

      {/* Left Text Column that scrolls naturally */}
      <div className="w-full md:w-1/2 pt-32 pb-[50vh] relative z-10 flex flex-col gap-[40vh]">
        
        <div>
          <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-3">// ARCHITECTURE</div>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-6">Designed for scale.</h2>
          <p className="text-lg text-neutral-400 font-light leading-relaxed">
            Pegasus operates on an elastic serverless infrastructure, dynamically provisioning and orchestrating resources as computational demand surges. Experience sub-millisecond latency and high availability, eliminating the bottlenecks of legacy monolithic bot architectures.
          </p>
        </div>

        <div>
          <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-3">// TRANSPARENCY</div>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-6">Open by default.</h2>
          <p className="text-lg text-neutral-400 font-light leading-relaxed">
            Cryptographically transparent and fully open-source. Fork the entire repository, perform comprehensive code audits, modify core modules, and deploy the system precisely aligned with your security posture. Zero telemetry, no obfuscation, no hidden paywalls.
          </p>
        </div>

        <div>
          <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-3">// MODULARITY</div>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-6">Completely pluggable.</h2>
          <p className="text-lg text-neutral-400 font-light leading-relaxed">
            A highly decoupled architecture allows seamless toggling of independent micro-features. Suspend the economy module, inject custom leveling algorithms, or swap out moderation handlers with absolute freedom. Pegasus mathematically conforms to your bespoke requirements.
          </p>
        </div>

        <div>
          <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-3">// PROGRAMMABILITY</div>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-6">Programmable Custom Commands.</h2>
          <p className="text-lg text-neutral-400 font-light leading-relaxed">
            Leverage a robust custom command engine to define dynamic prefix-based logic routines. Construct tailored multi-stage workflows, trigger complex webhooks, and unleash highly automated responses directly from your chat interface.
          </p>
        </div>
        
      </div>

      {/* Right Sticky Column with the scrubbed object */}
      <div className="hidden md:flex w-full md:w-1/2 sticky top-0 h-screen items-center justify-center z-10 pointer-events-none">
        <motion.div 
          style={{ rotate, scale, opacity }}
          className="relative w-64 h-64 flex items-center justify-center"
        >
          {/* Abstract 3D-looking element (CSS constructed) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#5E5CE6] to-[#000000] rounded-3xl border border-white/20 shadow-[0_0_80px_rgba(94,92,230,0.3)] backdrop-blur-3xl" />
          <div className="absolute inset-4 bg-black rounded-2xl border border-white/10" />
          <div className="absolute inset-8 bg-gradient-to-bl from-[#5E5CE6]/30 to-transparent rounded-xl border border-[#5E5CE6]/20" />
          <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_15px_white]" />
        </motion.div>
      </div>

    </section>
  );
}
