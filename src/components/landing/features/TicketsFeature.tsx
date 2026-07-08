'use client';

import { AnimatedSection } from '../AnimatedSection';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle2, Lock } from 'lucide-react';

export const TicketsFeature = () => {
  return (
    <AnimatedSection className="flex flex-col lg:flex-row-reverse items-center gap-16">
      <div className="flex-1 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] text-xs font-mono uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse" />
          Support Desks
        </div>
        <h2 className="text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.1]">
          Professional <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#f59e0b]">Support.</span>
        </h2>
        <p className="text-xl text-neutral-400 font-light max-w-lg leading-relaxed">
          Define multiple specialized departments with dedicated staff roles, custom welcome messages, and category routing. Staff can claim, freeze, lock, and close tickets with logged reasons.
        </p>
      </div>

      <div className="flex-1 w-full relative">
        <div className="aspect-square md:aspect-[4/3] rounded-3xl bg-gradient-to-br from-[#f59e0b]/5 to-transparent border border-white/10 p-8 flex flex-col justify-center items-center overflow-hidden relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#f59e0b]/10 blur-[100px] rounded-full" />

          {/* Ticket Workflow Animation */}
          <div className="w-full max-w-sm space-y-4 relative z-10">
            {/* Panel */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-5 mb-8"
            >
              <div className="text-white font-medium mb-1">Support Center</div>
              <div className="text-sm text-neutral-400 mb-4">Click a category below to open a ticket.</div>
              <div className="flex gap-2">
                <div className="bg-[#f59e0b] text-black text-xs font-medium px-3 py-1.5 rounded flex items-center gap-2 cursor-pointer">
                  <MessageSquare className="w-3 h-3" />
                  General
                </div>
                <div className="bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded flex items-center gap-2 cursor-pointer">
                  Billing
                </div>
              </div>
            </motion.div>

            {/* Opened Ticket */}
            <motion.div
              initial={{ x: 50, opacity: 0, height: 0 }}
              whileInView={{ x: 0, opacity: 1, height: 'auto' }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-black/60 backdrop-blur-xl border border-[#f59e0b]/30 rounded-xl p-4 ml-8 relative shadow-2xl"
            >
              <div className="absolute -left-4 top-6 w-8 h-[2px] bg-[#f59e0b]/30" />
              <div className="absolute -left-4 top-6 w-2 h-2 rounded-full bg-[#f59e0b] -translate-y-1/2" />
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-[#f59e0b] font-mono text-xs">#ticket-0042</span>
                <Lock className="w-3 h-3 text-neutral-500" />
              </div>
              <div className="text-sm text-white mb-2">I need help setting up the bot.</div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.5 }}
                className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-[#f59e0b]/20 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-[#f59e0b]" />
                </div>
                <div className="text-xs text-neutral-400">Resolved by Admin</div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </AnimatedSection>
  );
};
