'use client';

import { AnimatedSection } from '../AnimatedSection';
import { motion } from 'framer-motion';
import { Languages, Wrench, Search, Wifi } from 'lucide-react';

export const UtilityLanguageFeature = () => {
  return (
    <AnimatedSection className="flex flex-col lg:flex-row-reverse items-center gap-16">
      <div className="flex-1 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/20 text-[#14b8a6] text-xs font-mono uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
          Utility & i18n
        </div>
        <h2 className="text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.1]">
          Global <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#14b8a6]">Tools.</span>
        </h2>
        <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
          Comprehensive lookups for user profiles, avatars, banners, and Steam accounts. Includes a dynamic localization engine allowing servers and individuals to switch between English, German, Spanish, and French.
        </p>
      </div>

      <div className="flex-1 w-full relative">
        <div className="aspect-square md:aspect-[4/3] rounded-3xl bg-gradient-to-br from-[#14b8a6]/5 to-transparent border border-white/10 p-8 flex flex-col justify-center items-center overflow-hidden relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#14b8a6]/10 blur-[100px] rounded-full" />

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm relative z-10">
            {[
              { icon: Languages, label: 'Localization (en, de, es, fr)', delay: 0.1 },
              { icon: Search, label: 'Profile & Avatar Lookups', delay: 0.2 },
              { icon: Wrench, label: 'Steam Account Intel', delay: 0.3 },
              { icon: Wifi, label: 'Websocket Latency', delay: 0.4 }
            ].map((Item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Item.delay, duration: 0.5 }}
                className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center text-center gap-3 shadow-lg"
              >
                <div className="p-3 bg-[#14b8a6]/10 rounded-full text-[#14b8a6]">
                  <Item.icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-white font-medium">{Item.label}</span>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </AnimatedSection>
  );
};
