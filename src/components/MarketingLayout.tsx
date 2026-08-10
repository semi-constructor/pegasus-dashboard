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

const Navbar = () => {
  const t = useTranslations('navbar');
  const tf = useTranslations('footer');
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <nav 
      aria-label="Main Navigation" 
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/60 backdrop-blur-xl border-b border-border/50"
    >
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
          <Image 
            src="/favicon.ico" 
            alt="Pegasus Discord Bot Logo" 
            width={32}
            height={32}
            className="w-8 h-8 rounded-lg drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
            loading="lazy"
          />
          <span className="font-bold text-xl tracking-tight text-foreground">Pegasus</span>
        </Link>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <Link 
          href="/#features" 
          className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1 transition-colors"
        >
          {t('features')}
        </Link>
        <Link 
          href="/changelog" 
          className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1 transition-colors"
        >
          {t('changelog')}
        </Link>
        <Link 
          href="/docs/commands" 
          className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1 transition-colors"
        >
          {t('documentation')}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1 transition-colors">
            {t('more')} <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-black/90 backdrop-blur-xl border-white/10 text-white">
            <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer focus:bg-white/10 focus:text-white">
              <Link href="/modules" className="flex items-center w-full">
                <Puzzle className="w-4 h-4 mr-2" /> {t('modules')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer focus:bg-white/10 focus:text-white">
              <Link href="/team" className="flex items-center w-full">
                <Users className="w-4 h-4 mr-2" /> {t('team')}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <Link href="/api/auth/signin" tabIndex={-1} onClick={() => sendGTMEvent({ event: 'login_click' })}>
          <Button variant="ghost" className="hidden md:flex rounded-xl focus-visible:ring-2 focus-visible:ring-primary">
            {t('logIn')}
          </Button>
        </Link>
        <Link href="/dashboard" tabIndex={-1} className="hidden sm:block">
          <Button className="rounded-xl shadow-lg hover:shadow-primary/25 transition-all focus-visible:ring-2 focus-visible:ring-primary">
            {t('dashboard')} <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
          </Button>
        </Link>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label={t('openMobileMenu')}>
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" showCloseButton={false} className="p-0 w-screen h-screen max-w-full sm:max-w-full md:max-w-full bg-black/95 backdrop-blur-2xl border-none text-white z-50 overflow-y-auto">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="min-h-screen w-full bg-black/95 backdrop-blur-2xl text-white flex flex-col justify-between p-6 sm:p-10 md:p-14 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 group">
                  <Image src="/favicon.ico" alt="Pegasus Logo" width={40} height={40} className="w-10 h-10 rounded-xl group-hover:scale-105 transition-transform" loading="lazy" />
                  <div>
                    <span className="font-extrabold text-2xl tracking-tight text-white block">Pegasus</span>
                    <span className="text-xs text-white/50">Navigation</span>
                  </div>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-11 w-11 rounded-full bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-colors"
                >
                  <X size={22} />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-8 my-8 max-w-7xl mx-auto w-full">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">
                      Menu
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link href="/#features" onClick={() => setIsOpen(false)}>
                      <div className="flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 group cursor-pointer bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20">
                        <div className="p-2.5 rounded-lg shrink-0 transition-colors bg-white/10 text-white/70 group-hover:text-white group-hover:bg-white/20">
                          <Zap size={20} />
                        </div>
                        <span className="font-semibold text-base tracking-wide">{t('features')}</span>
                      </div>
                    </Link>
                    <Link href="/changelog" onClick={() => setIsOpen(false)}>
                      <div className="flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 group cursor-pointer bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20">
                        <div className="p-2.5 rounded-lg shrink-0 transition-colors bg-white/10 text-white/70 group-hover:text-white group-hover:bg-white/20">
                          <List size={20} />
                        </div>
                        <span className="font-semibold text-base tracking-wide">{t('changelog')}</span>
                      </div>
                    </Link>
                    <Link href="/docs/commands" onClick={() => setIsOpen(false)}>
                      <div className="flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 group cursor-pointer bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20">
                        <div className="p-2.5 rounded-lg shrink-0 transition-colors bg-white/10 text-white/70 group-hover:text-white group-hover:bg-white/20">
                          <BookOpen size={20} />
                        </div>
                        <span className="font-semibold text-base tracking-wide">{t('documentation')}</span>
                      </div>
                    </Link>
                    <Link href="/modules" onClick={() => setIsOpen(false)}>
                      <div className="flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 group cursor-pointer bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20">
                        <div className="p-2.5 rounded-lg shrink-0 transition-colors bg-white/10 text-white/70 group-hover:text-white group-hover:bg-white/20">
                          <Puzzle size={20} />
                        </div>
                        <span className="font-semibold text-base tracking-wide">{t('modules')}</span>
                      </div>
                    </Link>
                    <Link href="/team" onClick={() => setIsOpen(false)}>
                      <div className="flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 group cursor-pointer bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20">
                        <div className="p-2.5 rounded-lg shrink-0 transition-colors bg-white/10 text-white/70 group-hover:text-white group-hover:bg-white/20">
                          <Users size={20} />
                        </div>
                        <span className="font-semibold text-base tracking-wide">{t('team')}</span>
                      </div>
                    </Link>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-4">
                      Account
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Link href="/api/auth/signin" onClick={() => { setIsOpen(false); sendGTMEvent({ event: 'login_click' }); }}>
                        <div className="flex items-center gap-3 p-3.5 rounded-xl border transition-all hover:scale-[1.02] bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white">
                          <LogIn size={18} className="text-primary shrink-0" />
                          <span className="font-medium text-sm">{t('logIn')}</span>
                        </div>
                      </Link>
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center gap-3 p-3.5 rounded-xl border transition-all hover:scale-[1.02] bg-primary/20 border-primary/50 text-white">
                          <LayoutDashboard size={18} className="text-primary shrink-0" />
                          <span className="font-medium text-sm">{t('dashboard')}</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-6 flex flex-col items-center gap-4 max-w-7xl mx-auto w-full">
                <LanguageSwitcher variant="default" />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

const Footer = () => {
  const t = useTranslations('footer');
  return (
    <footer aria-labelledby="footer-heading" className="border-t border-border bg-card/30 pt-16 pb-8 mt-auto">
      <h2 id="footer-heading" className="sr-only">{t('footerHeading')}</h2>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
             <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
                <Image 
                  src="/favicon.ico" 
                  alt="Pegasus Logo" 
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-lg drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
                  loading="lazy"
                />
                <span className="font-bold text-xl tracking-tight text-foreground">Pegasus</span>
              </Link>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
              {t('description')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t('product')}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/#features" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:underline transition-colors">
                  {t('features')}
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:underline transition-colors">
                  {t('changelog')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t('resources')}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/docs/commands" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:underline transition-colors">
                  {t('documentation')}
                </Link>
              </li>

              <li>
                <a href="https://github.com/semi-constructor/pegasus" target="_blank" rel="noopener noreferrer" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:underline transition-colors">
                  {t('pegasusGithub')}
                </a>
              </li>
              <li>
                <a href="https://github.com/semi-constructor/pegasus-dashboard" target="_blank" rel="noopener noreferrer" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:underline transition-colors">
                  {t('dashboardGithub')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t('legal')}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:underline transition-colors">
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:underline transition-colors">
                  {t('termsOfService')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4 flex-wrap">
            <p>{t('copyright', { year: new Date().getFullYear().toString() })}</p>
            <LanguageSwitcher variant="footer" />
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
             <a 
              href="https://github.com/semi-constructor/pegasus" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1 transition-colors"
              aria-label={t('pegasusRepo')}
             >
               <GitBranch className="w-5 h-5" aria-hidden="true" />
             </a>
             <a 
              href="https://github.com/semi-constructor/pegasus-dashboard" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1 transition-colors"
              aria-label={t('dashboardRepo')}
             >
               <GitBranch className="w-5 h-5" aria-hidden="true" />
             </a>
             <a 
              href="https://pegasus.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1 transition-colors"
              aria-label={t('mainWebsite')}
             >
               <Globe className="w-5 h-5" aria-hidden="true" />
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
    <div className="min-h-screen bg-background selection:bg-primary/30 flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-background focus:text-primary">
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
