'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export function EditorialNavBar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: '-100%', opacity: 0 }
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.6, ease: [0.8, 0, 0.1, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${isScrolled ? 'bg-[#050505]/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}
    >
      <div className="max-w-[1800px] mx-auto px-8 h-24 flex items-center justify-between font-mono text-xs uppercase tracking-widest">
        <Link href="/" className="hover:text-[#B026FF] transition-colors duration-300">
          Pegasus // System
        </Link>
        
        <div className="flex gap-12 items-center">
          <Link href="/changelog" className="text-neutral-400 hover:text-white transition-colors duration-300 hidden md:block">
            Changelog
          </Link>
          <Link href="/pricing" className="text-neutral-400 hover:text-white transition-colors duration-300 hidden md:block">
            Pricing
          </Link>
          <Link href="/docs/commands" className="text-neutral-400 hover:text-white transition-colors duration-300 hidden md:block">
            Documentation
          </Link>
          <a href="https://github.com/cptcr/pegasus" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors duration-300 hidden md:block">
            GitHub
          </a>
          <Link href="/dashboard" className="px-6 py-3 border border-white/20 hover:border-[#B026FF] hover:text-[#B026FF] transition-all duration-300">
            Authenticate
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
