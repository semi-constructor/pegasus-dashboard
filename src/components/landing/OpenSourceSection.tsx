'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);
import Link from 'next/link';
import { AnimatedSection } from './AnimatedSection';

export const OpenSourceSection = () => {
  const techStack = [
    { name: 'Discord.js', color: 'bg-[#5865F2]/10 text-[#5865F2] border-[#5865F2]/20' },
    { name: 'TypeScript', color: 'bg-[#3178C6]/10 text-[#3178C6] border-[#3178C6]/20' },
    { name: 'Drizzle ORM', color: 'bg-[#C5F74F]/10 text-[#C5F74F] border-[#C5F74F]/20' },
    { name: 'PostgreSQL', color: 'bg-[#336791]/10 text-[#336791] border-[#336791]/20' },
    { name: 'Express.js', color: 'bg-white/10 text-white border-white/20' },
    { name: 'Redis', color: 'bg-[#DC382D]/10 text-[#DC382D] border-[#DC382D]/20' },
    { name: 'Node Canvas', color: 'bg-[#F24E1E]/10 text-[#F24E1E] border-[#F24E1E]/20' },
    { name: 'Zod', color: 'bg-[#3068B7]/10 text-[#3068B7] border-[#3068B7]/20' },
    { name: 'i18next', color: 'bg-[#009688]/10 text-[#009688] border-[#009688]/20' },
  ];

  return (
    <div className="w-full relative py-32 bg-[#050505] overflow-hidden border-t border-white/5">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-[100%] pointer-events-none" />

      <AnimatedSection className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-mono uppercase tracking-widest mb-8 shadow-2xl">
          <GithubIcon className="w-4 h-4" />
          100% Open Source
        </div>
        
        <h2 className="text-5xl md:text-7xl font-light tracking-tight text-white leading-[1.1] mb-6">
          Built in the <span className="font-semibold">Open.</span>
        </h2>
        
        <p className="text-xl text-neutral-400 font-light max-w-2xl leading-relaxed mb-16">
          Pegasus is fully open-source. Inspect our infrastructure, deploy it to your own hardware, or contribute directly to the core repository. We hide nothing.
        </p>

        {/* Tech Stack Grid */}
        <div className="w-full max-w-4xl mb-16">
          <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-6">Powered By</div>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-medium border ${tech.color}`}
              >
                {tech.name}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            href="https://github.com/semi-constructor/pegasus-dashboard"
            className="flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-neutral-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            <GithubIcon className="w-5 h-5" />
            View Source Code
            <ExternalLink className="w-4 h-4 ml-2 opacity-50" />
          </Link>
        </motion.div>
      </AnimatedSection>
    </div>
  );
};
