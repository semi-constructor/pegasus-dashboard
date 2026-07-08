'use client';

import { AnimatedSection } from '../AnimatedSection';
import { motion } from 'framer-motion';
import { Mic, Plus } from 'lucide-react';

export const JoinToCreateFeature = () => {
  return (
    <AnimatedSection className="flex flex-col lg:flex-row-reverse items-center gap-16">
      <div className="flex-1 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] text-xs font-mono uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
          Dynamic Voice
        </div>
        <h2 className="text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.1]">
          Channels on <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#3b82f6]">Demand.</span>
        </h2>
        <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
          Users join a master channel to spawn a temporary voice room. Features custom name templates, interactive UI panels to lock/unlock rooms or set user limits, and automatic cleanup.
        </p>
      </div>

      <div className="flex-1 w-full relative">
        <div className="aspect-square md:aspect-[4/3] rounded-3xl bg-gradient-to-bl from-[#3b82f6]/5 to-transparent border border-white/10 p-8 flex flex-col justify-center items-center overflow-hidden relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#3b82f6]/10 blur-[100px] rounded-full" />

          <div className="w-full max-w-xs space-y-3 relative z-10">
            {/* Master Channel */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 shadow-lg">
              <Plus className="w-5 h-5 text-[#3b82f6]" />
              <span className="text-white font-medium">Join to Create</span>
            </div>

            {/* Spawned Channels Sequence */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              whileInView={{ height: 'auto', opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="ml-6 space-y-3 border-l-2 border-white/10 pl-4 py-2"
            >
              {[
                { name: "Alex's Room", users: 3 },
                { name: "Gaming Lounge", users: 5 },
                { name: "Private Chat", users: 2 }
              ].map((room, i) => (
                <motion.div
                  key={room.name}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 + (i * 0.2) }}
                  className="bg-black/40 backdrop-blur-md border border-[#3b82f6]/20 rounded-xl p-3 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <Mic className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm text-neutral-200">{room.name}</span>
                  </div>
                  <div className="text-xs font-mono text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-1 rounded">
                    {room.users}/10
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </AnimatedSection>
  );
};
