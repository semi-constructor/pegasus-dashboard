"use client";

import React from "react";
import { ChevronRight, Menu, GitBranch, Globe, X, Zap, List, BookOpen, LogIn, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { sendGTMEvent } from "@next/third-parties/google";
import { ThemeToggle } from "@/components/ThemeToggle";

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
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 transition-all duration-500 w-full ${scrolled ? 'py-4 bg-background border-b border-border' : 'py-6 bg-transparent'}`}
    >
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-4 focus-visible:outline-none group">
          <>
<Image src="/logos/whitemode-logo.png" alt="Pegasus Discord Bot Logo" width={32} height={32} className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity duration-500 dark:hidden block" loading="lazy" />
<Image src="/logos/darkmode-logo.png" alt="Pegasus Discord Bot Logo" width={32} height={32} className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity duration-500 hidden dark:block" loading="lazy" />
</>
          <span className="font-medium text-lg tracking-wider uppercase text-foreground">Pegasus</span>
        </Link>
      </div>
      
      <div className="hidden lg:flex items-center gap-10 text-xs tracking-wider uppercase font-medium text-foreground/50">
        <Link 
          href="/#features" 
          className="hover:text-foreground transition-colors py-2 relative group"
        >
          {t('features')}
          <span className="absolute bottom-0 left-1/2 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full group-hover:left-0" />
        </Link>
        <Link 
          href="/changelog" 
          className="hover:text-foreground transition-colors py-2 relative group"
        >
          {t('changelog')}
          <span className="absolute bottom-0 left-1/2 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full group-hover:left-0" />
        </Link>
        <Link 
          href="/docs/commands" 
          className="hover:text-foreground transition-colors py-2 relative group"
        >
          {t('documentation')}
          <span className="absolute bottom-0 left-1/2 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full group-hover:left-0" />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 hover:text-foreground transition-colors py-2 relative outline-none group data-[state=open]:text-foreground uppercase tracking-wider text-xs">
            {t('more')} <ChevronDown className="w-3 h-3 transition-transform duration-500 group-data-[state=open]:rotate-180" />
            <span className="absolute bottom-0 left-1/2 w-0 h-px bg-foreground transition-all duration-300 group-data-[state=open]:w-full group-data-[state=open]:left-0 group-hover:w-full group-hover:left-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56 bg-background border border-border text-foreground rounded-none p-0 mt-4">
            <DropdownMenuItem asChild className="hover:bg-foreground/5 focus:bg-foreground/5 focus:text-foreground cursor-pointer rounded-none p-4 transition-colors">
              <Link href="/docs/installation" className="flex items-center w-full text-xs tracking-wider uppercase">
                Install Guide
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-foreground/5 focus:bg-foreground/5 focus:text-foreground cursor-pointer rounded-none p-4 transition-colors border-t border-border">
              <Link href="/modules" className="flex items-center w-full text-xs tracking-wider uppercase">
                {t('modules')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-foreground/5 focus:bg-foreground/5 focus:text-foreground cursor-pointer rounded-none p-4 transition-colors border-t border-border">
              <Link href="/team" className="flex items-center w-full text-xs tracking-wider uppercase">
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
          <Button variant="ghost" className="hidden md:flex rounded-none text-foreground/50 hover:text-foreground hover:bg-transparent text-xs tracking-wider uppercase transition-all">
            {t('logIn')}
          </Button>
        </Link>
        <Link href="/dashboard" tabIndex={-1} className="hidden sm:block">
          <Button className="rounded-none font-medium px-8 h-10 bg-foreground hover:bg-zinc-200 text-background text-xs tracking-wider uppercase transition-all border border-border">
            {t('dashboard')}
          </Button>
        </Link>
        <ThemeToggle />
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden rounded-none hover:bg-transparent text-foreground" aria-label={t('openMobileMenu')}>
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" showCloseButton={false} className="p-0 w-full sm:w-[400px] bg-background border-l border-border text-foreground z-50">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="h-full w-full flex flex-col p-8">
              <div className="flex items-center justify-between border-b border-border pb-8 mb-8">
                <span className="font-medium text-lg tracking-wider uppercase text-foreground">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-none hover:bg-transparent text-foreground/50 hover:text-foreground transition-transform hover:rotate-90 duration-500">
                  <X size={24} />
                </Button>
              </div>

              <div className="flex flex-col gap-8 mt-4">
                <Link href="/#features" onClick={() => setIsOpen(false)} className="text-sm tracking-wider uppercase text-foreground/50 hover:text-foreground transition-all hover:translate-x-2">
                  {t('features')}
                </Link>
                <Link href="/changelog" onClick={() => setIsOpen(false)} className="text-sm tracking-wider uppercase text-foreground/50 hover:text-foreground transition-all hover:translate-x-2">
                  {t('changelog')}
                </Link>
                <Link href="/docs/commands" onClick={() => setIsOpen(false)} className="text-sm tracking-wider uppercase text-foreground/50 hover:text-foreground transition-all hover:translate-x-2">
                  {t('documentation')}
                </Link>
                <Link href="/modules" onClick={() => setIsOpen(false)} className="text-sm tracking-wider uppercase text-foreground/50 hover:text-foreground transition-all hover:translate-x-2">
                  {t('modules')}
                </Link>
                <Link href="/team" onClick={() => setIsOpen(false)} className="text-sm tracking-wider uppercase text-foreground/50 hover:text-foreground transition-all hover:translate-x-2">
                  {t('team')}
                </Link>
              </div>

              <div className="mt-auto pt-8 border-t border-border">
                <div className="flex flex-col gap-4">
                  <Link href="/api/auth/signin" onClick={() => { setIsOpen(false); sendGTMEvent({ event: 'login_click' }); }}>
                    <Button variant="outline" className="w-full rounded-none border-border text-foreground hover:bg-foreground/5 hover:text-foreground text-xs tracking-wider uppercase h-12 transition-all">
                      {t('logIn')}
                    </Button>
                  </Link>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button className="w-full rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs tracking-wider uppercase h-12 transition-all">
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
    <footer aria-labelledby="footer-heading" className="border-t border-border bg-background pt-24 pb-12 mt-auto">
      <h2 id="footer-heading" className="sr-only">{t('footerHeading')}</h2>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-24">
          <div className="col-span-2 lg:col-span-2">
             <div className="flex items-center gap-4 mb-8">
              <Link href="/" className="flex items-center gap-4 focus-visible:outline-none">
                <>
<Image src="/logos/whitemode-logo.png" alt="Pegasus Logo" width={32} height={32} className="w-8 h-8  opacity-50 dark:hidden block" loading="lazy" />
<Image src="/logos/darkmode-logo.png" alt="Pegasus Logo" width={32} height={32} className="w-8 h-8  opacity-50 hidden dark:block" loading="lazy" />
</>
                <span className="font-medium text-lg tracking-wider uppercase text-foreground">Pegasus</span>
              </Link>
            </div>
            <p className="text-foreground/40 text-sm max-w-sm leading-relaxed">
              {t('description')}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-xs tracking-wider uppercase text-foreground/30 mb-8">{t('product')}</h3>
            <ul className="space-y-4 text-sm text-foreground/50">
              <li>
                <Link href="/#features" className="hover:text-foreground transition-colors">
                  {t('features')}
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-foreground transition-colors">
                  {t('changelog')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-xs tracking-wider uppercase text-foreground/30 mb-8">{t('resources')}</h3>
            <ul className="space-y-4 text-sm text-foreground/50">
              <li>
                <Link href="/docs/commands" className="hover:text-foreground transition-colors">
                  {t('documentation')}
                </Link>
              </li>
              <li>
                <a href="https://github.com/semi-constructor/pegasus" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  {t('pegasusGithub')}
                </a>
              </li>
              <li>
                <a href="https://github.com/semi-constructor/pegasus-dashboard" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  {t('dashboardGithub')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-xs tracking-wider uppercase text-foreground/30 mb-8">{t('legal')}</h3>
            <ul className="space-y-4 text-sm text-foreground/50">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-foreground transition-colors">
                  {t('termsOfService')}
                </Link>
              </li>
              <li>
                <Link href="/license" className="hover:text-foreground transition-colors">
                  {t('license')}
                </Link>
              </li>
              <li>
                <Link href="/imprint" className="hover:text-foreground transition-colors">
                  {t('imprint')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-xs tracking-wider uppercase text-foreground/30">
          <div className="flex items-center gap-6 flex-wrap">
            <p>{t('copyright', { year: new Date().getFullYear().toString() })}</p>
            <LanguageSwitcher variant="footer" />
          </div>
          <div className="flex gap-6 mt-6 md:mt-0">
             <a href="https://github.com/semi-constructor/pegasus" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
               <GitBranch className="w-4 h-4" />
             </a>
             <a href="https://pegasus.app" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
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
    <div className="min-h-screen bg-background selection:bg-foreground/20 flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-foreground focus:text-background">
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
