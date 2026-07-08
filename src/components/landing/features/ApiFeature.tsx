'use client';

import { AnimatedSection } from '../AnimatedSection';
import { motion } from 'framer-motion';
import { Activity, Server, Zap } from 'lucide-react';

export const ApiFeature = () => {
  return (
    <AnimatedSection className="flex flex-col lg:flex-row items-center gap-16">
      <div className="flex-1 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ec4899]/10 border border-[#ec4899]/20 text-[#ec4899] text-xs font-mono uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ec4899] animate-pulse" />
          Enterprise API
        </div>
        <h2 className="text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.1]">
          Unrestricted <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#ec4899]">Access.</span>
        </h2>
        <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
          Exposes protected endpoints for live guild analytics, query profiling, and module mutations. Secured via Bearer tokens and optimized with multi-tier rate limiting and in-memory caching.
        </p>
      </div>

      <div className="flex-1 w-full relative">
        <div className="aspect-square md:aspect-[4/3] rounded-3xl bg-gradient-to-bl from-[#ec4899]/5 to-transparent border border-white/10 p-8 flex flex-col justify-center items-center overflow-hidden relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#ec4899]/10 blur-[100px] rounded-full" />

          {/* API Flow Visualization */}
          <div className="w-full max-w-sm relative z-10 flex flex-col items-center gap-6">
            
            {/* Dashboard / Client */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-4 w-full"
            >
              <div className="bg-[#ec4899]/20 p-2 rounded-lg">
                <Activity className="w-5 h-5 text-[#ec4899]" />
              </div>
              <div>
                <div className="text-white text-sm font-medium">Web Dashboard</div>
                <div className="text-neutral-500 text-xs font-mono">GET /api/v1/guilds/stats</div>
              </div>
            </motion.div>

            {/* Connecting lines */}
            <div className="flex justify-center gap-4 py-2 relative">
              <motion.div 
                className="w-[2px] h-12 bg-gradient-to-b from-white/10 to-[#ec4899]/50"
              />
              <motion.div
                animate={{ y: [0, 48, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 w-2 h-2 rounded-full bg-[#ec4899] shadow-[0_0_10px_#ec4899]"
              />
            </div>

            {/* Server / Bot */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-black/60 backdrop-blur-md border border-[#ec4899]/30 rounded-xl p-4 flex items-center gap-4 w-full shadow-[0_0_30px_rgba(236,72,153,0.1)]"
            >
              <div className="bg-[#ec4899]/20 p-2 rounded-lg">
                <Server className="w-5 h-5 text-[#ec4899]" />
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">Pegasus Core</div>
                <div className="text-[#ec4899] text-xs font-mono">200 OK • 12ms</div>
              </div>
              <Zap className="w-4 h-4 text-neutral-500" />
            </motion.div>

          </div>

        </div>
      </div>
    </AnimatedSection>
  );
};
