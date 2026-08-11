import { Metadata } from 'next';
import Link from 'next/link';
import { TerminalSquare, Download, LayoutDashboard, ArrowRight } from 'lucide-react';
import { MarketingLayout } from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Documentation | Pegasus',
  description: 'Everything you need to know about using Pegasus Discord Bot.',
};

export default function DocsIndexPage() {
  return (
    <MarketingLayout>
      <div className="relative min-h-screen bg-black pt-48 pb-32 overflow-hidden selection:bg-white selection:text-black">
        {/* Architectural background lines */}
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-white/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-white/[0.03]" />
        
        <div className="max-w-6xl mx-auto px-6 lg:px-24 relative z-10">
          <div className="mb-32">
            <div className="inline-flex items-center text-white/30 text-xs tracking-[0.3em] uppercase mb-8 border border-white/10 px-4 py-2">
              // Documentation Hub
            </div>
            
            <h1 className="text-6xl md:text-8xl font-medium tracking-tighter text-white mb-8 uppercase leading-[0.9]">
              Documentation
            </h1>
            
            <p className="text-xl md:text-2xl text-white/40 font-light max-w-2xl leading-relaxed mb-12">
              Everything you need to master Pegasus. Explore command references, installation guides, and detailed dashboard walkthroughs.
            </p>
          </div>

          <div className="w-full h-px bg-white/10 mb-24" />

          <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
            <Link href="/docs/installation" className="group">
              <div className="h-full bg-black p-12 hover:bg-white/[0.02] transition-colors relative flex flex-col justify-between min-h-[400px]">
                <div>
                  <Download className="w-8 h-8 text-white/30 mb-8 group-hover:text-white transition-colors" />
                  <h3 className="text-2xl font-medium tracking-tighter uppercase text-white mb-4">Installation Guide</h3>
                  <p className="text-white/40 font-light leading-relaxed">Step-by-step instructions on deploying Pegasus to your own server.</p>
                </div>
                <div className="flex items-center text-white/40 text-sm tracking-widest uppercase group-hover:text-white transition-colors mt-12">
                  Read Guide <ArrowRight className="w-4 h-4 ml-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            </Link>

            <Link href="/docs/commands" className="group">
              <div className="h-full bg-black p-12 hover:bg-white/[0.02] transition-colors relative flex flex-col justify-between min-h-[400px]">
                <div>
                  <TerminalSquare className="w-8 h-8 text-white/30 mb-8 group-hover:text-white transition-colors" />
                  <h3 className="text-2xl font-medium tracking-tighter uppercase text-white mb-4">Command Reference</h3>
                  <p className="text-white/40 font-light leading-relaxed">A complete interactive list of every bot command and argument.</p>
                </div>
                <div className="flex items-center text-white/40 text-sm tracking-widest uppercase group-hover:text-white transition-colors mt-12">
                  View Commands <ArrowRight className="w-4 h-4 ml-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            </Link>

            <Link href="/docs/dashboard" className="group">
              <div className="h-full bg-black p-12 hover:bg-white/[0.02] transition-colors relative flex flex-col justify-between min-h-[400px]">
                <div>
                  <LayoutDashboard className="w-8 h-8 text-white/30 mb-8 group-hover:text-white transition-colors" />
                  <h3 className="text-2xl font-medium tracking-tighter uppercase text-white mb-4">Dashboard Guide</h3>
                  <p className="text-white/40 font-light leading-relaxed">Learn how to configure your modules with detailed screenshot guides.</p>
                </div>
                <div className="flex items-center text-white/40 text-sm tracking-widest uppercase group-hover:text-white transition-colors mt-12">
                  Explore Dashboard <ArrowRight className="w-4 h-4 ml-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
