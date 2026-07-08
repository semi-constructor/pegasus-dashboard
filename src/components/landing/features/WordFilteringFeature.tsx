'use client';

import { AnimatedSection } from '../AnimatedSection';
import { motion } from 'framer-motion';
import { Search, TextSearch, Globe } from 'lucide-react';

export const WordFilteringFeature = () => {
  return (
    <AnimatedSection className="flex flex-col lg:flex-row items-center gap-16">
      <div className="flex-1 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eab308]/10 border border-[#eab308]/20 text-[#eab308] text-xs font-mono uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-[#eab308] animate-pulse" />
          Content Control
        </div>
        <h2 className="text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.1]">
          Automated <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#eab308]">Filtering.</span>
        </h2>
        <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
          Filter messages using literal substring or regex matching. Configure case sensitivity, whole-word rules, and severity levels to automatically delete content and alert staff channels.
        </p>
      </div>

      <div className="flex-1 w-full relative">
        <div className="aspect-square md:aspect-[4/3] rounded-3xl bg-gradient-to-bl from-[#eab308]/5 to-transparent border border-white/10 p-8 flex flex-col justify-center items-center overflow-hidden relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#eab308]/10 blur-[100px] rounded-full" />

          <div className="w-full max-w-sm space-y-3 relative z-10">
            {/* Filter Rules */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-black/60 backdrop-blur-xl border border-[#eab308]/30 rounded-xl p-4 shadow-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <TextSearch className="w-4 h-4 text-[#eab308]" />
                <span className="text-sm font-mono text-white">/(bad|word)/i</span>
              </div>
              <span className="text-[10px] bg-[#eab308]/20 text-[#eab308] px-2 py-0.5 rounded font-bold uppercase">Regex</span>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-neutral-400" />
                <span className="text-sm font-mono text-neutral-300">"exact match"</span>
              </div>
              <span className="text-[10px] bg-white/10 text-neutral-400 px-2 py-0.5 rounded font-bold uppercase">Literal</span>
            </motion.div>

            {/* Action Trigger */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-6 border-t border-white/10 pt-4 text-center"
            >
              <span className="text-xs text-[#eab308] font-mono bg-[#eab308]/10 px-3 py-1.5 rounded-lg border border-[#eab308]/30 inline-block">
                Action: Auto-Delete & Log
              </span>
            </motion.div>
          </div>

        </div>
      </div>
    </AnimatedSection>
  );
};
