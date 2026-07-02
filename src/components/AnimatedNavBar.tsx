'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';

interface AnimatedNavBarProps {
  user?: { username?: string | null; id?: string | null } | null;
}

export function AnimatedNavBar({ user: initialUser }: AnimatedNavBarProps) {
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const [fetchedUser, setFetchedUser] = useState<{ username?: string | null; id?: string | null } | null>(null);
  const [activeHash, setActiveHash] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.location.pathname !== '/') return;
      const sections = ['features', 'commands'];
      let current = '';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = `/#${section}`;
          }
        }
      }
      setActiveHash(current);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (initialUser === undefined) {
      fetch('/api/auth/session', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data?.user && Object.keys(data.user).length > 0) setFetchedUser({ username: data.user.name, id: data.user.id });
        })
        .catch(() => {});
    }
  }, [initialUser]);

  const user = initialUser !== undefined ? initialUser : fetchedUser;

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0)', 'rgba(5, 5, 5, 0.75)']
  );

  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);
  const blur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(16px)']);

  const links = [
    { name: 'Features', href: '/#features' },
    { name: 'Commands', href: '/#commands' },
    { name: 'Documentation', href: '/docs' }
  ];

  return (
    <motion.header
      style={{
        backgroundColor,
        borderColor: `rgba(255, 255, 255, ${borderOpacity})`,
        backdropFilter: blur,
      }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-transparent transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group relative">
          <motion.div
            whileHover={{ scale: 1.2, rotate: 90 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="w-3 h-3 bg-[#5E5CE6] shadow-[0_0_15px_#5E5CE6] rounded-sm"
          />
          <span className="font-mono text-sm tracking-widest font-bold uppercase text-white group-hover:text-[#5E5CE6] transition-colors">
            Pegasus
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href || (pathname === '/' && activeHash === link.href) || (pathname?.startsWith('/docs') && link.href === '/docs');
            return (
              <Link key={link.name} href={link.href} className="relative px-4 py-2 font-mono text-xs tracking-wider text-neutral-300 hover:text-white transition-colors">
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-white/[0.05] border border-white/10 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center">
          {user ? (
            <Link href="/dashboard">
              <motion.div
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.05)', boxShadow: '0 5px 15px -5px rgba(94, 92, 230, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="border border-white/10 px-5 py-2.5 rounded-full bg-[#0a0a0a] flex items-center gap-3 font-mono text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                <span className="text-white">{user.username}</span>
              </motion.div>
            </Link>
          ) : (
            <button onClick={() => signIn('discord')} className="cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(94, 92, 230, 0.2)', boxShadow: '0 5px 15px -5px rgba(94, 92, 230, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="border border-[#5E5CE6]/30 bg-[#5E5CE6]/10 px-6 py-2.5 text-[#5E5CE6] rounded-full flex items-center gap-2 font-mono text-xs font-semibold"
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
