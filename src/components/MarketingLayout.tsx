"use client";

import React from "react";
import { ChevronRight, Menu, GitBranch, Globe, X, Zap, List, BookOpen, LogIn, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { sendGTMEvent } from "@next/third-parties/google";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChevronDown, Users, Puzzle } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const t = useTranslations('navbar');
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Main Navigation" 
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 transition-all duration-500 w-full ${scrolled ? 'py-4 bg-black border-b border-white/10' : 'py-6 bg-transparent'}`}
    >
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-4 focus-visible:outline-none group">
          <Image 
            src="/favicon.ico" 
            alt="Pegasus Discord Bot Logo" 
            width={32}
            height={32}
            className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity duration-500 filter grayscale" 
            loading="lazy"
          />
          <span className="font-medium text-lg tracking-[0.3em] uppercase text-white">Pegasus</span>
        </Link>
      </div>
      
      <div className="hidden lg:flex items-center gap-10 text-xs tracking-[0.3em] uppercase font-medium text-white/50">
        <Link 
          href="/#features" 
          className="hover:text-white transition-colors py-2 relative group"
        >
          {t('features')}
          <span className="absolute bottom-0 left-1/2 w-0 h-px bg-white transition-all duration-300 group-hover:w-full group-hover:left-0" />
        </Link>
        <Link 
          href="/changelog" 
          className="hover:text-white transition-colors py-2 relative group"
        >
          {t('changelog')}
          <span className="absolute bottom-0 left-1/2 w-0 h-px bg-white transition-all duration-300 group-hover:w-full group-hover:left-0" />
        </Link>
        <Link 
          href="/docs/commands" 
          className="hover:text-white transition-colors py-2 relative group"
        >
          {t('documentation')}
          <span className="absolute bottom-0 left-1/2 w-0 h-px bg-white transition-all duration-300 group-hover:w-full group-hover:left-0" />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 hover:text-white transition-colors py-2 relative outline-none group data-[state=open]:text-white uppercase tracking-[0.3em] text-xs">
            {t('more')} <ChevronDown className="w-3 h-3 transition-transform duration-500 group-data-[state=open]:rotate-180" />
            <span className="absolute bottom-0 left-1/2 w-0 h-px bg-white transition-all duration-300 group-data-[state=open]:w-full group-data-[state=open]:left-0 group-hover:w-full group-hover:left-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56 bg-black border border-white/10 text-white rounded-none p-0 mt-4">
            <DropdownMenuItem asChild className="hover:bg-white/5 focus:bg-white/5 focus:text-white cursor-pointer rounded-none p-4 transition-colors">
              <Link href="/docs/installation" className="flex items-center w-full text-xs tracking-[0.3em] uppercase">
                Install Guide
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-white/5 focus:bg-white/5 focus:text-white cursor-pointer rounded-none p-4 transition-colors border-t border-white/5">
              <Link href="/modules" className="flex items-center w-full text-xs tracking-[0.3em] uppercase">
                {t('modules')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-white/5 focus:bg-white/5 focus:text-white cursor-pointer rounded-none p-4 transition-colors border-t border-white/5">
              <Link href="/team" className="flex items-center w-full text-xs tracking-[0.3em] uppercase">
                {t('team')}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>
        
        <Link href="/api/auth/signin" tabIndex={-1} onClick={() => sendGTMEvent({ event: 'login_click' })}>
          <Button variant="ghost" className="hidden md:flex rounded-none text-white/50 hover:text-white hover:bg-transparent text-xs tracking-[0.3em] uppercase transition-all">
            {t('logIn')}
          </Button>
        </Link>
        <Link href="/dashboard" tabIndex={-1} className="hidden sm:block">
          <Button className="rounded-none font-medium px-8 h-10 bg-white hover:bg-zinc-200 text-black text-xs tracking-[0.3em] uppercase transition-all border border-white">
            {t('dashboard')}
          </Button>
        </Link>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden rounded-none hover:bg-transparent text-white" aria-label={t('openMobileMenu')}>
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" showCloseButton={false} className="p-0 w-full sm:w-[400px] bg-black border-l border-white/10 text-white z-50">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="h-full w-full flex flex-col p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-8 mb-8">
                <span className="font-medium text-lg tracking-[0.3em] uppercase text-white">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-none hover:bg-transparent text-white/50 hover:text-white transition-transform hover:rotate-90 duration-500">
                  <X size={24} />
                </Button>
              </div>

              <div className="flex flex-col gap-8 mt-4">
                <Link href="/#features" onClick={() => setIsOpen(false)} className="text-sm tracking-[0.3em] uppercase text-white/50 hover:text-white transition-all hover:translate-x-2">
                  {t('features')}
                </Link>
                <Link href="/changelog" onClick={() => setIsOpen(false)} className="text-sm tracking-[0.3em] uppercase text-white/50 hover:text-white transition-all hover:translate-x-2">
                  {t('changelog')}
                </Link>
                <Link href="/docs/commands" onClick={() => setIsOpen(false)} className="text-sm tracking-[0.3em] uppercase text-white/50 hover:text-white transition-all hover:translate-x-2">
                  {t('documentation')}
                </Link>
                <Link href="/modules" onClick={() => setIsOpen(false)} className="text-sm tracking-[0.3em] uppercase text-white/50 hover:text-white transition-all hover:translate-x-2">
                  {t('modules')}
                </Link>
                <Link href="/team" onClick={() => setIsOpen(false)} className="text-sm tracking-[0.3em] uppercase text-white/50 hover:text-white transition-all hover:translate-x-2">
                  {t('team')}
                </Link>
              </div>

              <div className="mt-auto pt-8 border-t border-white/10">
                <div className="flex flex-col gap-4">
                  <Link href="/api/auth/signin" onClick={() => { setIsOpen(false); sendGTMEvent({ event: 'login_click' }); }}>
                    <Button variant="outline" className="w-full rounded-none border-white/10 text-white hover:bg-white/5 hover:text-white text-xs tracking-[0.3em] uppercase h-12 transition-all">
                      {t('logIn')}
                    </Button>
                  </Link>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button className="w-full rounded-none bg-white text-black hover:bg-white/90 text-xs tracking-[0.3em] uppercase h-12 transition-all">
                      {t('dashboard')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
};

const Footer = () => {
  const t = useTranslations('footer');
  return (
    <footer aria-labelledby="footer-heading" className="border-t border-white/10 bg-black pt-24 pb-12 mt-auto">
      <h2 id="footer-heading" className="sr-only">{t('footerHeading')}</h2>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-24">
          <div className="col-span-2 lg:col-span-2">
             <div className="flex items-center gap-4 mb-8">
              <Link href="/" className="flex items-center gap-4 focus-visible:outline-none">
                <Image 
                  src="/favicon.ico" 
                  alt="Pegasus Logo" 
                  width={32}
                  height={32}
                  className="w-8 h-8 filter grayscale opacity-50" 
                  loading="lazy"
                />
                <span className="font-medium text-lg tracking-[0.3em] uppercase text-white">Pegasus</span>
              </Link>
            </div>
            <p className="text-white/40 text-sm max-w-sm leading-relaxed">
              {t('description')}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-xs tracking-[0.3em] uppercase text-white/30 mb-8">{t('product')}</h3>
            <ul className="space-y-4 text-sm text-white/50">
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  {t('features')}
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-white transition-colors">
                  {t('changelog')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-xs tracking-[0.3em] uppercase text-white/30 mb-8">{t('resources')}</h3>
            <ul className="space-y-4 text-sm text-white/50">
              <li>
                <Link href="/docs/commands" className="hover:text-white transition-colors">
                  {t('documentation')}
                </Link>
              </li>
              <li>
                <a href="https://github.com/semi-constructor/pegasus" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  {t('pegasusGithub')}
                </a>
              </li>
              <li>
                <a href="https://github.com/semi-constructor/pegasus-dashboard" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  {t('dashboardGithub')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-xs tracking-[0.3em] uppercase text-white/30 mb-8">{t('legal')}</h3>
            <ul className="space-y-4 text-sm text-white/50">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">
                  {t('termsOfService')}
                </Link>
              </li>
              <li>
                <Link href="/license" className="hover:text-white transition-colors">
                  {t('license')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs tracking-[0.3em] uppercase text-white/30">
          <div className="flex items-center gap-6 flex-wrap">
            <p>{t('copyright', { year: new Date().getFullYear().toString() })}</p>
            <LanguageSwitcher variant="footer" />
          </div>
          <div className="flex gap-6 mt-6 md:mt-0">
             <a href="https://github.com/semi-constructor/pegasus" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
               <GitBranch className="w-4 h-4" />
             </a>
             <a href="https://pegasus.app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
               <Globe className="w-4 h-4" />
             </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('navbar');

  return (
    <div className="min-h-screen bg-black selection:bg-white/20 flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-white focus:text-black">
        {t('skipToMainContent')}
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
