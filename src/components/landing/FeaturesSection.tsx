'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { features } from '@/lib/data/features';
import { InteractiveCard } from './InteractiveCards';
import { FadeInUp, FadeInStagger } from './MotionSystem';

function toLucideKey(kebab: string): string {
  return kebab
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}

function getIcon(name: string): LucideIcon {
  const key = toLucideKey(name) as keyof typeof Icons;
  const Icon = Icons[key];
  if (typeof Icon === 'function') return Icon as LucideIcon;
  return Icons.CircleDot as LucideIcon;
}

export function FeaturesSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  // Bento grid mapping: some features take more space
  // We can assign col-span based on index or specific logic.
  const getColSpan = (index: number) => {
    if (index === 0 || index === 3 || index === 7) return 'md:col-span-2 lg:col-span-2';
    return 'col-span-1';
  };

  return (
    <section id="features" className="relative z-20 mx-auto w-full max-w-[1400px] px-6 py-40">
      <div className="mb-24 flex flex-col items-center text-center">
        <FadeInUp>
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#5E5CE6]/30 bg-[#5E5CE6]/10 px-4 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#5E5CE6] backdrop-blur-md shadow-[0_0_20px_rgba(94,92,230,0.15)]">
            <Icons.Layers className="w-3.5 h-3.5" />
            Core Infrastructure
          </span>
        </FadeInUp>

        <FadeInUp>
          <h2 className="max-w-4xl text-5xl md:text-7xl font-light tracking-tight text-white mb-6 leading-tight drop-shadow-lg">
            Everything you need, <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-[#5E5CE6]">unified.</span>
          </h2>
        </FadeInUp>
        
        <FadeInUp>
          <p className="text-xl text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
            Pegasus replaces dozens of single-purpose bots with one meticulously designed system. 
            Built for scale, speed, and safety.
          </p>
        </FadeInUp>
      </div>

      <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
        {features.map((feature, idx) => {
          const Icon = getIcon(feature.icon);
          const isExpanded = expandedId === feature.id;
          
          return (
            <InteractiveCard 
              key={feature.id}
              delay={idx * 0.05} 
              className={`p-8 flex flex-col cursor-pointer min-h-[280px] ${getColSpan(idx)}`} 
              onClick={() => toggle(feature.id)}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1A1A24] to-[#050508] border border-white/[0.08] flex items-center justify-center text-[#5E5CE6] group-hover:scale-110 group-hover:bg-[#5E5CE6]/10 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_30px_rgba(94,92,230,0.2)]">
                  <Icon strokeWidth={1.5} className="w-6 h-6" />
                </div>
                
                <div className="w-8 h-8 rounded-full bg-white/[0.02] flex items-center justify-center text-neutral-500 group-hover:text-white transition-colors">
                  <motion.div animate={{ rotate: isExpanded ? 45 : 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
                    <Icons.Plus className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>
              
              <h3 className="text-2xl font-medium text-white tracking-tight mb-3 group-hover:text-[#5E5CE6] transition-colors">{feature.title}</h3>
              
              <p className="text-sm md:text-base text-neutral-400 leading-relaxed flex-grow">
                {feature.description}
              </p>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="mechanics"
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden border-t border-white/[0.05] pt-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icons.Cpu className="w-3 h-3 text-[#5E5CE6]" />
                      <span className="text-[10px] font-mono text-[#5E5CE6] uppercase tracking-widest font-semibold">System Mechanics</span>
                    </div>
                    <p className="text-sm text-neutral-300 leading-relaxed font-sans font-light">
                      {feature.mechanics}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </InteractiveCard>
          );
        })}
      </FadeInStagger>
    </section>
  );
}
