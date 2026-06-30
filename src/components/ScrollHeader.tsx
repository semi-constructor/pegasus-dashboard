'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { ReactNode } from 'react';

interface ScrollHeaderProps {
  user: { username?: string; id?: string } | null;
}

export function ScrollHeader({ user }: ScrollHeaderProps) {
  const { scrollY } = useScroll();
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)']
  );
  
  const backdropFilter = useTransform(
    scrollY,
    [0, 100],
    ['blur(0px)', 'blur(12px)']
  );

  const borderOpacity = useTransform(
    scrollY,
    [0, 100],
    [0, 0.1]
  );

  return (
    <motion.header 
      style={{
        backgroundColor,
        backdropFilter,
        borderColor: `rgba(255, 255, 255, ${borderOpacity})`
      }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-transparent transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.2, rotate: 90 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            className="w-2.5 h-2.5 bg-[#5E5CE6] shadow-[0_0_15px_#5E5CE6]" 
          />
          <span className="font-mono text-sm tracking-widest font-bold uppercase text-white">Pegasus // System</span>
        </Link>
        <div className="flex items-center gap-6 text-xs font-mono tracking-wider">
          <Link href="/docs" className="hover:text-[#5E5CE6] transition-colors relative group">
            Documentation
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#5E5CE6] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="#features" className="hover:text-[#5E5CE6] transition-colors relative group">
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#5E5CE6] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="#metrics" className="hover:text-[#5E5CE6] transition-colors relative group">
            Live Metrics
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#5E5CE6] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          {user ? (
            <Link href="/dashboard">
              <motion.div 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                whileTap={{ scale: 0.98 }}
                className="border border-white/10 px-4 py-2 hover:border-[#5E5CE6] hover:text-[#5E5CE6] transition-colors rounded-none bg-white/[0.02] flex items-center gap-2"
              >
                <span>{user.username} // Dashboard</span>
              </motion.div>
            </Link>
          ) : (
            <a href="/api/auth/login">
              <motion.div 
                whileHover={{ scale: 1.02, backgroundColor: "#5E5CE6", color: "#000" }}
                whileTap={{ scale: 0.98 }}
                className="border border-[#5E5CE6]/40 bg-[#5E5CE6]/10 px-4 py-2 text-[#5E5CE6] transition-colors rounded-none flex items-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Discord Login</span>
              </motion.div>
            </a>
          )}
        </div>
      </div>
    </motion.header>
  );
}
