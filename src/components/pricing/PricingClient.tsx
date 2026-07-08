'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { EditorialNavBar } from '@/components/landing/EditorialNavBar';
import { CursorEffect } from '@/components/landing/CursorEffect';
import { Footer } from '@/components/landing/Footer';
import { CheckCircle2, XCircle, Scale } from 'lucide-react';

export const PricingClient = () => {
  return (
    <div className="w-full min-h-screen bg-[#050505] selection:bg-[#B026FF] selection:text-[#050505] font-sans overflow-x-hidden flex flex-col">
      <EditorialNavBar />
      <CursorEffect />
      
      <main className="flex-grow flex flex-col items-center pt-40 pb-32 px-6 relative z-10">
        
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#B026FF]/10 blur-[150px] rounded-[100%] pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B026FF]/10 border border-[#B026FF]/20 text-[#B026FF] text-xs font-mono uppercase tracking-widest mb-8">
            Transparent Pricing
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white leading-[1.1] mb-6">
            Pick the <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#B026FF]">Perfect Plan.</span>
          </h1>
          <p className="text-xl text-neutral-400 font-light leading-relaxed">
            Choose exactly how much you want to pay for extreme-scale infrastructure. 
            (Hint: It's all the same button).
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-32">
          
          {/* Basic Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col relative overflow-hidden group hover:border-white/30 transition-colors"
          >
            <h3 className="text-2xl font-medium text-white mb-2">Basic</h3>
            <div className="text-5xl font-light text-white mb-6">$0<span className="text-xl text-neutral-500">/mo</span></div>
            <p className="text-sm text-neutral-400 mb-8 flex-grow">You host the bot yourself.</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-neutral-300"><CheckCircle2 className="w-5 h-5 text-[#B026FF]" /> Full Source Code Access</li>
              <li className="flex items-center gap-3 text-sm text-neutral-300"><CheckCircle2 className="w-5 h-5 text-[#B026FF]" /> 100% Control of Your Data</li>
              <li className="flex items-center gap-3 text-sm text-neutral-400"><XCircle className="w-5 h-5 text-neutral-500" /> Data Selling to 3rd Parties</li>
            </ul>

            <Link href="https://github.com/semi-constructor/pegasus-dashboard" className="w-full py-3 rounded-xl border border-white/20 text-center font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
              Get Started
            </Link>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-b from-[#B026FF]/10 to-black/40 backdrop-blur-md border border-[#B026FF]/50 rounded-3xl p-8 flex flex-col relative overflow-hidden transform md:-translate-y-4 shadow-[0_0_50px_rgba(176,38,255,0.1)]"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#B026FF] to-[#5E26FF]" />
            <div className="absolute top-4 right-4 bg-[#B026FF]/20 text-[#B026FF] text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">Most Popular</div>

            <h3 className="text-2xl font-medium text-white mb-2">Pro</h3>
            <div className="text-5xl font-light text-white mb-6">$0<span className="text-xl text-neutral-500">/mo</span></div>
            <p className="text-sm text-neutral-400 mb-8 flex-grow">You still host the bot yourself, but you feel slightly more professional doing it.</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-neutral-300"><CheckCircle2 className="w-5 h-5 text-[#B026FF]" /> Same Source Code Access</li>
              <li className="flex items-center gap-3 text-sm text-neutral-300"><CheckCircle2 className="w-5 h-5 text-[#B026FF]" /> Still 100% Control of Your Data</li>
              <li className="flex items-center gap-3 text-sm text-neutral-400"><XCircle className="w-5 h-5 text-neutral-500" /> Hidden Paywalls</li>
            </ul>

            <Link href="https://github.com/semi-constructor/pegasus-dashboard" className="w-full py-3 rounded-xl bg-[#B026FF] text-black text-center font-bold text-sm uppercase tracking-widest hover:bg-white transition-colors">
              Upgrade to Pro
            </Link>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-black/40 backdrop-blur-md border border-[#f59e0b]/30 rounded-3xl p-8 flex flex-col relative overflow-hidden group hover:border-[#f59e0b]/60 transition-colors shadow-[0_0_40px_rgba(245,158,11,0.05)]"
          >
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-[#f59e0b]/20 blur-[50px] rounded-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
            <h3 className="text-2xl font-medium text-white mb-2 relative z-10">Enterprise</h3>
            <div className="text-5xl font-light text-white mb-6">$0<span className="text-xl text-neutral-500">/mo</span></div>
            <p className="text-sm text-neutral-400 mb-8 flex-grow">You host the bot yourself, but on a really expensive AWS instance.</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-neutral-300 relative z-10"><CheckCircle2 className="w-5 h-5 text-[#B026FF]" /> You Guessed It: The Source Code</li>
              <li className="flex items-center gap-3 text-sm text-neutral-300 relative z-10"><CheckCircle2 className="w-5 h-5 text-[#B026FF]" /> Yep, Still Your Data</li>
              <li className="flex items-center gap-3 text-sm text-neutral-400 relative z-10"><XCircle className="w-5 h-5 text-neutral-500" /> Walled Gardens</li>
            </ul>

            <Link href="https://github.com/semi-constructor/pegasus-dashboard" className="w-full py-3 rounded-xl border border-white/20 text-center font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
              Contact Sales
            </Link>
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl text-center space-y-6 bg-white/5 border border-white/10 p-10 rounded-3xl"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-lg">
              <Scale className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-medium text-white">Why are we doing this?</h2>
          <p className="text-neutral-400 font-light leading-relaxed">
            Pegasus stands for <span className="text-white font-medium">freedom</span>, <span className="text-white font-medium">source control</span>, <span className="text-white font-medium">transparency</span>, and the absolute <span className="text-white font-medium">fair control of user data</span>. We believe extreme-scale infrastructure shouldn't be hidden behind a $99/mo paywall or funded by scraping your server's chat logs.
          </p>
          <p className="text-neutral-400 font-light leading-relaxed">
            You own the hardware. You own the code. You own the data. 
            <br />That's it. That's the pitch.
          </p>
        </motion.div>

      </main>

      <Footer />
    </div>
  );
};
