'use client';

import { motion } from 'framer-motion';
import { features } from '@/lib/data/features';
import * as Icons from 'lucide-react';

export function FeatureSection() {
  return (
    <section id="features" className="max-w-[1200px] w-full mx-auto px-6 py-32 relative z-20">
      
      {/* Section Header */}
      <div className="mb-40 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="inline-flex px-6 py-2 rounded-full border border-[#5E5CE6]/20 bg-[#5E5CE6]/5 text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-8"
        >
          Bot Features
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-5xl md:text-7xl font-light tracking-tight text-white max-w-4xl leading-tight"
        >
          Everything you need to run your server, your way.
        </motion.h2>
      </div>

      {/* Timeline Layout */}
      <div className="relative">
        {/* The central line */}
        <div className="absolute left-[40px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#5E5CE6]/20 to-transparent -translate-x-1/2" />

        <div className="flex flex-col gap-32 md:gap-48">
          {features.map((feature, idx) => {
            const IconComponent = (Icons as any)[feature.icon] || Icons.Box;
            const isEven = idx % 2 === 0;

            return (
              <div key={feature.id} className="relative flex items-center md:justify-center w-full min-h-[30vh]">
                
                {/* The Timeline Node / Icon */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-200px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute left-[40px] md:left-1/2 w-16 h-16 bg-[#020205] border-2 border-[#5E5CE6] rounded-2xl flex items-center justify-center text-[#5E5CE6] z-10 -translate-x-1/2 shadow-[0_0_30px_rgba(94,92,230,0.3)]"
                >
                  <IconComponent className="w-8 h-8" strokeWidth={1.5} />
                </motion.div>

                {/* The Content */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? 50 : -50, filter: 'blur(10px)' }}
                  whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: "-200px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`w-full md:w-1/2 pl-28 md:px-16 flex flex-col justify-center ${isEven ? 'md:ml-auto md:text-left' : 'md:mr-auto md:text-right md:items-end'}`}
                >
                  <div className="text-xs font-mono text-[#5E5CE6]/70 uppercase tracking-widest mb-4">
                    Module {String(idx + 1).padStart(2, '0')}
                  </div>
                  
                  <h3 className="text-3xl md:text-5xl text-white font-medium mb-6 tracking-tight drop-shadow-sm">
                    {feature.title}
                  </h3>
                  
                  <p className="text-lg md:text-xl text-neutral-400 font-light leading-relaxed mb-8 max-w-xl">
                    {feature.description}
                  </p>
                  
                  <div className={`bg-[#050508] border border-[#5E5CE6]/10 p-6 rounded-2xl relative overflow-hidden group hover:border-[#5E5CE6]/30 transition-colors w-full max-w-xl ${isEven ? 'text-left' : 'md:text-right'}`}>
                    {/* Accent bar */}
                    <div className={`absolute top-0 w-1 h-full bg-[#5E5CE6]/50 group-hover:bg-[#5E5CE6] transition-colors ${isEven ? 'left-0' : 'left-0 md:left-auto md:right-0'}`} />
                    
                    <div className={`flex items-center gap-2 mb-3 ${isEven ? '' : 'md:justify-end'}`}>
                      <div className="text-[10px] font-mono text-[#5E5CE6] uppercase tracking-widest font-semibold">How it works</div>
                    </div>
                    <p className="text-sm text-neutral-500 leading-relaxed group-hover:text-neutral-300 transition-colors">
                      {feature.mechanics}
                    </p>
                  </div>
                </motion.div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
