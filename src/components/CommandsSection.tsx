'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { commands } from '@/lib/data/commands';
import { Terminal } from 'lucide-react';

export function CommandsSection() {
  const [activeCategory, setActiveCategory] = useState(commands[0].category);
  const activeCategoryData = commands.find(c => c.category === activeCategory);

  return (
    <section id="commands" className="max-w-[1200px] w-full mx-auto px-6 py-32 relative z-20">
      
      {/* Section Header */}
      <div className="mb-16 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="inline-flex px-6 py-2 rounded-full border border-[#5E5CE6]/20 bg-[#5E5CE6]/5 text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-8"
        >
          Commands List
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-5xl md:text-6xl font-light tracking-tight text-white mb-6"
        >
          All the commands you need.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1 }}
          className="text-xl text-neutral-400 font-light max-w-2xl mx-auto"
        >
          Browse through all available slash commands to see what Pegasus can do.
        </motion.p>
      </div>

      {/* Boundless Horizontal Category Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-wrap justify-center gap-3 mb-16"
      >
        {commands.map((cat) => (
          <button
            key={cat.category}
            onClick={() => setActiveCategory(cat.category)}
            className={`relative px-5 py-2.5 rounded-full font-mono text-sm tracking-wider transition-colors duration-300 ${
              activeCategory === cat.category ? 'text-white' : 'text-neutral-500 hover:text-neutral-300 border border-transparent'
            }`}
          >
            {activeCategory === cat.category && (
              <motion.div
                layoutId="activeCategoryPill"
                className="absolute inset-0 bg-[#5E5CE6]/10 border border-[#5E5CE6]/40 rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            <span className="relative z-10">{cat.category}</span>
          </button>
        ))}
      </motion.div>

      {/* Open Grid Layout for Commands */}
      <div className="min-h-[500px] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full"
          >
            <div className="mb-12 text-center">
              <p className="text-[#5E5CE6] text-lg max-w-2xl mx-auto font-light">
                {activeCategoryData?.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeCategoryData?.items.map((cmd, idx) => (
                <motion.div
                  key={cmd.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative bg-[#050508] border border-[#5E5CE6]/10 p-6 rounded-3xl flex flex-col hover:border-[#5E5CE6]/30 transition-all duration-300"
                >
                  {/* Subtle hover accent line */}
                  <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#5E5CE6]/0 to-transparent group-hover:via-[#5E5CE6]/50 transition-all duration-500" />
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-[#020205] border border-[#5E5CE6]/20 rounded-xl flex items-center justify-center text-[#5E5CE6] shadow-[0_0_15px_rgba(94,92,230,0.1)] group-hover:scale-110 transition-transform duration-300">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <h4 className="text-white font-mono text-lg tracking-tight">
                      {cmd.name}
                    </h4>
                  </div>
                  
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-grow group-hover:text-neutral-300 transition-colors">
                    {cmd.description}
                  </p>

                  {cmd.options && (
                    <div className="mt-auto pt-4 border-t border-[#5E5CE6]/10">
                      <div className="text-[10px] font-mono text-[#5E5CE6]/70 uppercase tracking-widest font-semibold mb-2">Usage</div>
                      <code className="text-xs font-mono text-neutral-300 break-words block bg-[#020205] px-3 py-2 rounded-lg border border-white/5">
                        {cmd.options}
                      </code>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </section>
  );
}
