'use client';

import { AnimatedSection } from '../AnimatedSection';
import { motion } from 'framer-motion';
import { Gavel, AlertTriangle, ShieldBan } from 'lucide-react';

export const ModerationFeature = () => {
  return (
    <AnimatedSection className="flex flex-col lg:flex-row items-center gap-16">
      <div className="flex-1 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[#8b5cf6] text-xs font-mono uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-pulse" />
          Advanced Moderation
        </div>
        <h2 className="text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.1]">
          Complete <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#8b5cf6]">Control.</span>
        </h2>
        <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
          Execute staff commands (ban, kick, mute, timeout, purge, lock). The advanced warning engine issues automated penalty triggers based on warning counts or severity, backed by rich audit logging.
        </p>
      </div>

      <div className="flex-1 w-full relative">
        <div className="aspect-square md:aspect-[4/3] rounded-3xl bg-gradient-to-bl from-[#8b5cf6]/5 to-transparent border border-white/10 p-8 flex flex-col justify-center items-center overflow-hidden relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#8b5cf6]/10 blur-[100px] rounded-full" />

          {/* Warning System Mockup */}
          <div className="w-full max-w-sm space-y-4 relative z-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-white font-medium text-sm">Warning Issued</span>
                </div>
                <span className="text-xs text-neutral-500 font-mono">Count: 3/5</span>
              </div>
              <div className="text-neutral-400 text-xs mb-3">User reached severity threshold.</div>
              
              {/* Automated Action */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-2 p-3 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 rounded-lg flex items-center gap-3"
              >
                <ShieldBan className="w-4 h-4 text-[#8b5cf6]" />
                <div className="text-xs text-[#8b5cf6] font-medium">Automated Timeout: 24 Hours</div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </AnimatedSection>
  );
};
