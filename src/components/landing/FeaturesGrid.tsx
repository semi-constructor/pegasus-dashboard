'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { features } from '@/lib/data/features';

/* ------------------------------------------------------------------ */
/*  Helper: kebab-case icon name → PascalCase lucide-react export key */
/* ------------------------------------------------------------------ */
function toLucideKey(kebab: string): string {
  return kebab
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}

function getIcon(name: string): LucideIcon {
  const key = toLucideKey(name) as keyof typeof Icons;
  const Icon = Icons[key];

  // Lucide exports both components and helper utilities — only return
  // actual icon components (functions). Fall back to CircleDot if the
  // lookup misses.
  if (typeof Icon === 'function') return Icon as LucideIcon;
  return Icons.CircleDot as LucideIcon;
}

/* ------------------------------------------------------------------ */
/*  Feature Card                                                       */
/* ------------------------------------------------------------------ */
interface FeatureCardProps {
  feature: (typeof features)[number];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function FeatureCard({ feature, index, isExpanded, onToggle }: FeatureCardProps) {
  const Icon = getIcon(feature.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#050508]/80 p-8 backdrop-blur-sm transition-colors duration-300 hover:border-[#5E5CE6]/30"
    >
      {/* Hover glow — radial gradient at top */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-px left-0 right-0 h-40 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(94,92,230,0.08) 0%, transparent 100%)',
        }}
      />

      {/* Icon container */}
      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-[#5E5CE6]/20 bg-[#5E5CE6]/5 transition-transform duration-300 group-hover:scale-105">
        <Icon className="h-5 w-5 text-[#5E5CE6]" />
      </div>

      {/* Title */}
      <h3 className="mt-5 mb-3 text-xl font-semibold text-white">{feature.title}</h3>

      {/* Description */}
      <p className="mb-4 text-sm leading-relaxed text-neutral-400">{feature.description}</p>

      {/* Expandable "How it works" */}
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-[#5E5CE6]/60 transition-colors duration-200 hover:text-[#5E5CE6]"
      >
        <span>How it works</span>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="inline-flex"
        >
          <Icons.ChevronDown className="h-3 w-3" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="mechanics"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-sm leading-relaxed text-neutral-500">
              {feature.mechanics}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Features Grid (exported)                                           */
/* ------------------------------------------------------------------ */
export default function FeaturesGrid() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <section id="features" className="relative z-20 mx-auto w-full max-w-[1200px] px-6 py-32">
      {/* ---- Section Header ---- */}
      <div className="mb-24 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex rounded-full border border-[#5E5CE6]/20 bg-[#5E5CE6]/5 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-[#5E5CE6]"
        >
          Bot Features
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl text-5xl font-light tracking-tight text-white md:text-7xl"
        >
          Everything you need to run your server, your&nbsp;way.
        </motion.h2>
      </div>

      {/* ---- Bento Grid ---- */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, idx) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            index={idx}
            isExpanded={expandedId === feature.id}
            onToggle={() => toggle(feature.id)}
          />
        ))}
      </div>
    </section>
  );
}
