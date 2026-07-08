'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 pt-20 pb-10 px-6 relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-20">
          
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <Link href="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
              <span className="text-[#B026FF]">PEGASUS</span>
            </Link>
            <p className="text-neutral-500 font-light max-w-sm text-sm leading-relaxed">
              An elite infrastructure layer for extreme-scale Discord communities. Fully modular, completely customizable.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">All Systems Operational</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-medium text-sm mb-5">Product</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-5">Resources</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/docs/commands" className="hover:text-white transition-colors">Commands</Link></li>
              <li><Link href="/api-docs" className="hover:text-white transition-colors">API Reference</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Discord Server</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-5">Legal</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/rules" className="hover:text-white transition-colors">Bot Rules</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-neutral-500 text-xs font-mono">
            © {new Date().getFullYear()} Pegasus Bot. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link href="https://github.com/semi-constructor/pegasus-dashboard" className="text-neutral-500 hover:text-white transition-colors text-xs font-mono">
              GitHub
            </Link>
            <Link href="https://twitter.com/pegasusbot" className="text-neutral-500 hover:text-white transition-colors text-xs font-mono">
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
