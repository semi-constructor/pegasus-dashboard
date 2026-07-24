"use client";

import React from "react";
import { ChevronRight, Menu, GitBranch, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav 
      aria-label="Main Navigation" 
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/60 backdrop-blur-xl border-b border-border/50"
    >
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
          <img 
            src="/favicon.ico" 
            alt="Pegasus Discord Bot Logo" 
            className="w-8 h-8 rounded-lg drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
          />
          <span className="font-bold text-xl tracking-tight text-foreground">Pegasus</span>
        </Link>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <Link 
          href="/#features" 
          className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1 transition-colors"
        >
          Features
        </Link>
        <Link 
          href="/changelog" 
          className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1 transition-colors"
        >
          Changelog
        </Link>
        <Link 
          href="/docs/commands" 
          className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1 transition-colors"
        >
          Documentation
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/api/auth/signin" tabIndex={-1}>
          <Button variant="ghost" className="hidden md:flex rounded-xl focus-visible:ring-2 focus-visible:ring-primary">
            Log in
          </Button>
        </Link>
        <Link href="/dashboard" tabIndex={-1}>
          <Button className="rounded-xl shadow-lg hover:shadow-primary/25 transition-all focus-visible:ring-2 focus-visible:ring-primary">
            Dashboard <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open Mobile Menu">
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer aria-labelledby="footer-heading" className="border-t border-border bg-card/30 pt-16 pb-8 mt-auto">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
             <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
                <img 
                  src="/favicon.ico" 
                  alt="Pegasus Logo" 
                  className="w-8 h-8 rounded-lg drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
                />
                <span className="font-bold text-xl tracking-tight text-foreground">Pegasus</span>
              </Link>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
              An open-source Discord bot for moderation, economy, and community tools.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/#features" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:underline transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:underline transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/docs/commands" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:underline transition-colors">
                  Documentation
                </Link>
              </li>

              <li>
                <a href="https://github.com/semi-constructor/pegasus" target="_blank" rel="noopener noreferrer" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:underline transition-colors">
                  Pegasus GitHub
                </a>
              </li>
              <li>
                <a href="https://github.com/semi-constructor/pegasus-dashboard" target="_blank" rel="noopener noreferrer" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:underline transition-colors">
                  Dashboard GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:underline transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:underline transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Pegasus Ecosystem. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <a 
              href="https://github.com/semi-constructor/pegasus" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1 transition-colors"
              aria-label="Pegasus GitHub Repository"
             >
               <GitBranch className="w-5 h-5" aria-hidden="true" />
             </a>
             <a 
              href="https://github.com/semi-constructor/pegasus-dashboard" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1 transition-colors"
              aria-label="Dashboard GitHub Repository"
             >
               <GitBranch className="w-5 h-5" aria-hidden="true" />
             </a>
             <a 
              href="https://pegasus.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1 transition-colors"
              aria-label="Main Website"
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
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-background focus:text-primary">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
