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
    <section ref={targetRef} className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start justify-between min-h-[200vh]">
      
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
            Pegasus runs entirely on a scalable serverless architecture, dynamically spinning up resources as demand increases. Say goodbye to the slow latency of legacy monolithic discord bots.
          </p>
        </div>

        <div>
          <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-3">// TRANSPARENCY</div>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-6">Open by default.</h2>
          <p className="text-lg text-neutral-400 font-light leading-relaxed">
            Every single line of code running on your server is open-source. Fork the repository, modify the modules, and run the system precisely the way you want to. No hidden paywalls.
          </p>
        </div>

        <div>
          <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-3">// MODULARITY</div>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-6">Completely pluggable.</h2>
          <p className="text-lg text-neutral-400 font-light leading-relaxed">
            Don't need the economy module? Turn it off. Want to replace the default leveling system with your own algorithm? Swap it out. Pegasus conforms to you.
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
