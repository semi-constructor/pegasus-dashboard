'use client';

import { AnimatedSection } from '../AnimatedSection';
import { motion } from 'framer-motion';

export const EconomyFeature = () => {
  return (
    <AnimatedSection className="flex flex-col lg:flex-row-reverse items-center gap-16">
      <div className="flex-1 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] text-xs font-mono uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          Economy Engine
        </div>
        <h2 className="text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.1]">
          A Thriving <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#10b981]">Market.</span>
        </h2>
        <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
          Members earn currency through daily rewards, jobs, robberies, and gambling minigames (dice, slots). Includes a fully customizable server item shop.
        </p>
      </div>

      <div className="flex-1 w-full relative">
        <div className="aspect-square md:aspect-[4/3] rounded-3xl bg-gradient-to-bl from-white/[0.05] to-transparent border border-white/10 p-8 flex flex-col justify-center items-center overflow-hidden relative group">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#10b981]/10 blur-[100px] rounded-full transition-opacity duration-700 group-hover:opacity-100 opacity-50" />

          {/* Interactive Item Grid */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm relative z-10">
            {[
              { icon: '💎', name: 'Diamond', price: '50,000', delay: 0.1 },
              { icon: '🗡️', name: 'Iron Sword', price: '2,500', delay: 0.2 },
              { icon: '🛡️', name: 'Shield', price: '4,000', delay: 0.3 },
              { icon: '🧪', name: 'Potion', price: '500', delay: 0.4 }
            ].map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item.delay }}
                whileHover={{ y: -5, scale: 1.05, transition: { duration: 0.2 } }}
                className="bg-black/40 backdrop-blur-md border border-white/5 hover:border-[#10b981]/50 rounded-2xl p-4 cursor-pointer transition-colors"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="text-white font-medium text-sm">{item.name}</div>
                <div className="text-[#10b981] font-mono text-xs mt-1">⏣ {item.price}</div>
              </motion.div>
            ))}
          </div>

          {/* Balance Overlay */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute bottom-8 left-8 bg-white text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
              <span className="text-xl">💼</span>
            </div>
            <div>
              <div className="text-xs font-mono text-black/50 uppercase tracking-wider font-semibold">Wallet Balance</div>
              <div className="text-2xl font-bold tracking-tight">⏣ 142,850</div>
            </div>
          </motion.div>

        </div>
      </div>
    </AnimatedSection>
  );
};
