'use client';

import { AnimatedSection } from '../AnimatedSection';
import { motion } from 'framer-motion';
import { Gift, Users, Clock } from 'lucide-react';

export const GiveawaysFeature = () => {
  return (
    <AnimatedSection className="flex flex-col lg:flex-row items-center gap-16">
      <div className="flex-1 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f43f5e]/10 border border-[#f43f5e]/20 text-[#f43f5e] text-xs font-mono uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] animate-pulse" />
          Giveaways
        </div>
        <h2 className="text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.1]">
          Reward <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#f43f5e]">Engagement.</span>
        </h2>
        <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
          Host giveaways with custom entry requirements (roles, XP level, time in server) and bonus multipliers. Supports precise end durations, multi-winner selections, and automated announcements.
        </p>
      </div>

      <div className="flex-1 w-full relative">
        <div className="aspect-square md:aspect-[4/3] rounded-3xl bg-gradient-to-br from-[#f43f5e]/5 to-transparent border border-white/10 p-8 flex flex-col justify-center items-center overflow-hidden relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#f43f5e]/10 blur-[100px] rounded-full" />

          {/* Giveaway Embed Mockup */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="w-full max-w-xs bg-black/60 backdrop-blur-xl border-l-4 border-[#f43f5e] border-y border-r border-white/10 rounded-r-xl p-5 shadow-2xl relative z-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5 text-[#f43f5e]" />
              <div className="text-white font-bold">Nitro Classic Giveway</div>
            </div>
            
            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Users className="w-4 h-4 text-neutral-500" />
                <span>3 Winners</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Clock className="w-4 h-4 text-neutral-500" />
                <span>Ends in 24 hours</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2 mb-4">
              <div className="text-[10px] font-mono text-[#f43f5e] uppercase">Requirements</div>
              <div className="text-xs text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#f43f5e] rounded-full" /> Level 10+
              </div>
              <div className="text-xs text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#f43f5e] rounded-full" /> Server Booster (2x Entry)
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 bg-[#f43f5e]/20 text-[#f43f5e] text-sm font-medium rounded border border-[#f43f5e]/50"
            >
              🎉 Enter Giveaway
            </motion.button>
          </motion.div>

        </div>
      </div>
    </AnimatedSection>
  );
};
