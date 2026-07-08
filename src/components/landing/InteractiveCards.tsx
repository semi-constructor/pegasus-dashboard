'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}

export function InteractiveCard({ children, className = '', delay = 0, onClick }: InteractiveCardProps) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-3xl bg-[#030305]/60 backdrop-blur-md border border-white/[0.04] hover:border-[#5E5CE6]/30 transition-colors duration-500 ${className}`}
    >
      {/* Ambient hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(94,92,230,0.08),transparent_70%)]" />
      
      {/* Top border accent line */}
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] group-hover:via-[#5E5CE6]/40 to-transparent transition-all duration-700" />
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: any;
  mechanics: string;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

export function FeatureCard({ title, description, icon: Icon, mechanics, isExpanded, onToggle, index }: FeatureCardProps) {
  return (
    <InteractiveCard delay={index * 0.05} className="p-8 flex flex-col h-full cursor-pointer" onClick={onToggle}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#020205] border border-white/[0.05] flex items-center justify-center text-[#5E5CE6] group-hover:scale-110 group-hover:bg-[#5E5CE6]/10 group-hover:border-[#5E5CE6]/30 transition-all duration-500 shadow-[0_0_20px_rgba(94,92,230,0.0)] group-hover:shadow-[0_0_20px_rgba(94,92,230,0.15)]">
          <Icon strokeWidth={1.5} className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-medium text-white tracking-tight">{title}</h3>
      </div>
      
      <p className="text-sm text-neutral-400 leading-relaxed flex-grow">
        {description}
      </p>

      <div className="mt-6 pt-4 border-t border-white/[0.04] group-hover:border-[#5E5CE6]/10 transition-colors duration-500">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#5E5CE6]/60 uppercase tracking-widest font-semibold group-hover:text-[#5E5CE6] transition-colors">How it works</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500 group-hover:text-[#5E5CE6]">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </div>
        
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <p className="pt-4 text-xs text-neutral-500 leading-relaxed font-mono">
            {mechanics}
          </p>
        </motion.div>
      </div>
    </InteractiveCard>
  );
}
