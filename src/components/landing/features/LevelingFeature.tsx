'use client';

import { AnimatedSection } from '../AnimatedSection';
import { motion } from 'framer-motion';

export const LevelingFeature = () => {
  return (
    <AnimatedSection className="flex flex-col lg:flex-row items-center gap-16">
      <div className="flex-1 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B026FF]/10 border border-[#B026FF]/20 text-[#B026FF] text-xs font-mono uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-[#B026FF] animate-pulse" />
          Engagement System
        </div>
        <h2 className="text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.1]">
          Reward the <span className="font-semibold">Loyal.</span>
        </h2>
        <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
          Tracks text and voice activity with configurable multipliers. Features visual rank cards, paginated leaderboards, automated role rewards, daily quests, and a peer reputation system.
        </p>
      </div>

      <div className="flex-1 w-full relative">
        <div className="aspect-square md:aspect-[4/3] rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-8 flex flex-col justify-center items-center overflow-hidden relative">
          
          {/* Decorative background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#B026FF]/20 blur-[100px] rounded-full" />

          {/* Rank Card Mockup */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-sm bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative z-10 shadow-2xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#B026FF] to-[#5E26FF] p-0.5">
                  <div className="w-full h-full rounded-full bg-black/50 border border-white/20" />
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">Alex</div>
                  <div className="text-neutral-400 text-sm">Rank #1</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-neutral-500 text-xs uppercase tracking-widest font-mono">Level</div>
                <div className="text-3xl font-light text-white">42</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-neutral-400">
                <span>12,450 XP</span>
                <span>15,000 XP</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '83%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#B026FF] to-[#5E26FF] rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Floating Badges */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 top-1/4 w-20 h-20 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-xl"
          >
            <span className="text-2xl">🏆</span>
          </motion.div>
          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -left-4 bottom-1/4 w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-xl"
          >
            <span className="text-xl">⭐</span>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};
