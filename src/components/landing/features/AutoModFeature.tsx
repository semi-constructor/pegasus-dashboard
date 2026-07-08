'use client';

import { AnimatedSection } from '../AnimatedSection';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

export const AutoModFeature = () => {
  return (
    <AnimatedSection className="flex flex-col lg:flex-row-reverse items-center gap-16">
      <div className="flex-1 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] text-xs font-mono uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
          AutoMod V2
        </div>
        <h2 className="text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.1]">
          Quarantine <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#ef4444]">Vault.</span>
        </h2>
        <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
          Configure Keyword, Regex, Mention, and Attachment spam thresholds. Suspicious accounts are automatically stripped of original roles and isolated until staff review.
        </p>
      </div>

      <div className="flex-1 w-full relative">
        <div className="aspect-square md:aspect-[4/3] rounded-3xl bg-gradient-to-br from-[#ef4444]/5 to-transparent border border-white/10 p-8 flex flex-col justify-center items-center overflow-hidden relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#ef4444]/20 blur-[100px] rounded-full" />

          {/* Radar/Shield Animation */}
          <div className="relative w-48 h-48 flex items-center justify-center z-10">
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border border-[#ef4444]/50"
            />
            <motion.div 
              animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute inset-0 rounded-full border border-[#ef4444]/30"
            />
            
            <div className="relative bg-black/80 backdrop-blur-md p-6 rounded-full border border-[#ef4444]/30">
              <Shield className="w-12 h-12 text-[#ef4444]" />
            </div>

            {/* Threat detected floating tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -right-12 -top-4 bg-black/60 backdrop-blur-md border border-[#ef4444]/30 px-3 py-1.5 rounded-lg flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-[#ef4444]" />
              <span className="text-xs font-mono text-white">Spam Blocked</span>
            </motion.div>

            {/* Safe tag */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -left-12 -bottom-4 bg-black/60 backdrop-blur-md border border-[#10b981]/30 px-3 py-1.5 rounded-lg flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#10b981]" />
              <span className="text-xs font-mono text-white">Vault Secured</span>
            </motion.div>
          </div>

        </div>
      </div>
    </AnimatedSection>
  );
};
