'use client';

import { AnimatedSection } from '../AnimatedSection';
import { motion } from 'framer-motion';
import { LayoutTemplate, Pointer } from 'lucide-react';

export const EmbedsRolesFeature = () => {
  return (
    <AnimatedSection className="flex flex-col lg:flex-row items-center gap-16 opacity-75">
      <div className="flex-1 space-y-8">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 text-[#0ea5e9] text-xs font-mono uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] animate-pulse" />
            Rich Embeds
          </div>
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-mono uppercase tracking-widest">
            Coming Soon
          </div>
        </div>
        <h2 className="text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.1]">
          Reaction <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#0ea5e9]">Roles.</span>
        </h2>
        <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
          Construct custom rich embeds with hex colors, images, and footers. Power your announcements with an automated reaction role system for seamless self-assignment upon reacting.
        </p>
      </div>

      <div className="flex-1 w-full relative grayscale opacity-60">
        <div className="aspect-square md:aspect-[4/3] rounded-3xl bg-gradient-to-bl from-[#0ea5e9]/5 to-transparent border border-white/10 p-8 flex flex-col justify-center items-center overflow-hidden relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#0ea5e9]/10 blur-[100px] rounded-full" />

          <div className="w-full max-w-sm relative z-10">
            {/* Embed */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-black/80 backdrop-blur-xl border-l-4 border-[#0ea5e9] border-y border-r border-white/10 rounded-r-xl p-4 shadow-2xl mb-4"
            >
              <div className="text-white font-bold text-sm mb-2">Choose Your Roles</div>
              <div className="text-xs text-neutral-400 mb-4">React below to automatically receive ping notifications for updates.</div>
              
              {/* Reactions */}
              <div className="flex gap-2">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-1.5 bg-[#0ea5e9]/20 border border-[#0ea5e9]/50 px-2 py-1 rounded text-xs cursor-pointer"
                >
                  <span>📢</span> <span className="text-[#0ea5e9] font-medium">1.2k</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-1 rounded text-xs cursor-pointer"
                >
                  <span>🎮</span> <span className="text-white font-medium">850</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Click animation */}
            <motion.div
              animate={{ x: [0, -20, 0], y: [0, -20, 0], scale: [1, 0.9, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-12 bottom-12 text-white/50"
            >
              <Pointer className="w-6 h-6 fill-white/20" />
            </motion.div>

          </div>

        </div>
      </div>
    </AnimatedSection>
  );
};
