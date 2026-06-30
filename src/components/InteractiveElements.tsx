'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import Link from 'next/link';

export function InteractiveCard({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        boxShadow: "0 20px 40px -10px rgba(94, 92, 230, 0.15)",
        borderColor: "rgba(255, 255, 255, 0.15)",
        backgroundColor: "rgba(255, 255, 255, 0.02)"
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`border border-white/5 bg-white/[0.01] backdrop-blur-md rounded-none transition-colors ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function InteractiveButton({ children, href, className = '', external = false }: { children: ReactNode, href?: string, className?: string, external?: boolean }) {
  const inner = (
    <motion.div
      whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );

  if (href) {
    if (external) {
      return <a href={href} target="_blank" rel="noopener noreferrer" className="block">{inner}</a>;
    }
    return <Link href={href} className="block">{inner}</Link>;
  }
  
  return inner;
}
