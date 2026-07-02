'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { signIn } from 'next-auth/react';

interface ScrollHeaderProps {
  user: { username?: string | null; id?: string | null } | null;
}

export function ScrollHeader({ user }: ScrollHeaderProps) {
  const { scrollY } = useScroll();
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0)', 'rgba(5, 5, 5, 0.95)']
  );

  const borderOpacity = useTransform(
    scrollY,
    [0, 100],
    [0, 0.1]
  );

  const paddingY = useTransform(
    scrollY,
    [0, 100],
    ['1.5rem', '1rem']
  );

  return (
    <motion.header 
      style={{
        backgroundColor,
        borderColor: `rgba(255, 255, 255, ${borderOpacity})`,
        paddingTop: paddingY,
        paddingBottom: paddingY
      }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-transparent transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.2, rotate: 90 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-2.5 h-2.5 bg-[#5E5CE6] shadow-[0_0_15px_#5E5CE6] rounded-sm" 
          />
          <span className="font-mono text-sm tracking-widest font-bold uppercase text-white">Pegasus // System</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider">
          <Link href="/docs" className="hover:text-[#5E5CE6] transition-colors relative group text-neutral-300">
            Documentation
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#5E5CE6] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="#features" className="hover:text-[#5E5CE6] transition-colors relative group text-neutral-300">
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#5E5CE6] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="#metrics" className="hover:text-[#5E5CE6] transition-colors relative group text-neutral-300">
            Live Metrics
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#5E5CE6] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          {user ? (
            <Link href="/dashboard">
              <motion.div 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.05)", boxShadow: "0 5px 15px -5px rgba(94, 92, 230, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="border border-white/10 px-5 py-2.5 hover:border-[#5E5CE6]/50 hover:text-white transition-colors rounded-md bg-[#0a0a0a] flex items-center gap-2"
              >
                <span>{user.username} // Dashboard</span>
              </motion.div>
            </Link>
          ) : (
            <button onClick={() => signIn('discord')} className="cursor-pointer">
              <motion.div 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(94, 92, 230, 0.2)", filter: "brightness(1.1)", boxShadow: "0 5px 15px -5px rgba(94, 92, 230, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="border border-[#5E5CE6]/30 bg-[#5E5CE6]/10 px-5 py-2.5 text-[#5E5CE6] transition-colors rounded-md flex items-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Discord Login</span>
              </motion.div>
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
