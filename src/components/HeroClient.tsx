"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, ChevronRight, Users, Server, Layers } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { sendGTMEvent } from "@next/third-parties/google";

export const HeroClient = ({ stats }: { stats: { users: number, guilds: number, shards: number } }) => {
  const t = useTranslations('landing');
  return (
    <section 
      aria-labelledby="hero-heading" 
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-background -z-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/15 rounded-full blur-[150px] -z-10 opacity-70 animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />

      <div className="container px-4 md:px-6 mx-auto flex flex-col items-center z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8 backdrop-blur-md shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" aria-hidden="true"></span>
            {t('badge')}
          </motion.div>
          
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 mb-6 leading-tight text-glow"
          >
            {t('heroTitle1')} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 text-glow">
              {t('heroTitle2')}
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t('heroDescription')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center gap-6 w-full sm:w-auto"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link 
                href="/dashboard" 
                className="w-full sm:w-auto" 
                tabIndex={-1}
                onClick={() => sendGTMEvent({ event: 'click', value: 'open_dashboard' })}
              >
                <Button size="lg" className="w-full text-base group rounded-xl shadow-lg hover:shadow-primary/25 transition-all focus-visible:ring-2 focus-visible:ring-primary">
                  {t('openDashboard')}
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Button>
              </Link>
              <Link 
                href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=872320742191095&integration_type=0&scope=bot+applications.commands`} 
                target="_blank" 
                rel="noopener noreferrer"
                tabIndex={-1}
                onClick={() => sendGTMEvent({ event: 'click', value: 'invite_bot' })}
              >
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base rounded-xl border border-border hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-primary">
                  <Shield className="w-5 h-5 mr-2" aria-hidden="true" />
                  {t('inviteToServer')}
                </Button>
              </Link>
            </div>
            
            <a href="https://top.gg/bot/1375140177961418774" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform duration-200">
              <img src="https://top.gg/api/widget/upvotes/1375140177961418774.svg" alt="Top.gg Vote Widget" />
            </a>
          </motion.div>

          {/* New Stats Display */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            <div className="flex flex-col items-center justify-center p-6 glass-panel animate-float hover:scale-105">
              <Users className="w-8 h-8 text-purple-400 mb-2" />
              <div className="text-3xl font-black text-white text-glow">{stats.users.toLocaleString()}</div>
              <div className="text-sm text-white/50 uppercase tracking-wider font-bold mt-1">Total Users</div>
            </div>
            <div className="flex flex-col items-center justify-center p-6 glass-panel animate-float hover:scale-105" style={{ animationDelay: '0.2s' }}>
              <Server className="w-8 h-8 text-blue-400 mb-2" />
              <div className="text-3xl font-black text-white text-glow">{stats.guilds.toLocaleString()}</div>
              <div className="text-sm text-white/50 uppercase tracking-wider font-bold mt-1">Total Guilds</div>
            </div>
            <div className="flex flex-col items-center justify-center p-6 glass-panel animate-float hover:scale-105" style={{ animationDelay: '0.4s' }}>
              <Layers className="w-8 h-8 text-indigo-400 mb-2" />
              <div className="text-3xl font-black text-white text-glow">{stats.shards.toLocaleString()}</div>
              <div className="text-sm text-white/50 uppercase tracking-wider font-bold mt-1">Active Shards</div>
            </div>
          </motion.div>

        </div>

        {/* Discord Visual Mockup */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.7, delay: 0.5 }}
           className="w-full max-w-3xl relative rounded-xl border border-border bg-[#313338] shadow-2xl overflow-hidden font-sans text-left mx-auto ring-1 ring-white/10"
        >
          {/* Discord Header */}
          <div className="bg-[#2b2d31] border-b border-[#1e1f22] px-4 py-3 flex items-center gap-3">
             <div className="text-[#80848e]">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
             </div>
             <span className="font-bold text-[#dbdee1] text-base">{t('discordMockChannel')}</span>
          </div>
          
          {/* Discord Message */}
          <div className="p-4 bg-[#313338] space-y-4">
             <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden shadow-sm">
                   <Image src="/favicon.ico" alt="Pegasus Avatar" width={40} height={40} className="w-full h-full object-cover bg-primary/20" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2 flex-wrap">
                     <span className="font-medium text-[#dbdee1] hover:underline cursor-pointer">Pegasus</span>
                     <span className="text-[10px] bg-[#5865F2] text-white px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold leading-none mt-0.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M5 12l5 5l10 -10"></path></svg> BOT</span>
                     <span className="text-xs text-[#80848e] ml-1">Today at 10:42 AM</span>
                   </div>
                   <p className="text-[#dbdee1] mt-1">Hey <span className="bg-[#5865F2]/20 text-[#c9cdfb] px-1 rounded hover:bg-[#5865F2]/40 cursor-pointer">@everyone</span>, check out my stats! 🎉</p>
                   
                   {/* Discord Embed */}
                   <div className="mt-3 rounded border-l-4 border-primary bg-[#2b2d31] p-4 max-w-sm w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-primary text-xs font-bold">#1</span>
                        </div>
                        <span className="font-bold text-[#dbdee1]">{t('userProfile')}</span>
                      </div>
                      <p className="text-sm text-[#dbdee1] mb-4">{t('levelAndStatus')}</p>
                      
                      <div className="space-y-3">
                         <div>
                            <div className="flex justify-between text-xs mb-1">
                               <span className="text-[#b5bac1] font-semibold uppercase tracking-wider">{t('experience')}</span>
                               <span className="text-[#dbdee1]">14,250 / 15,000 XP</span>
                            </div>
                            <div className="h-2 w-full bg-[#404249] rounded-full overflow-hidden">
                               <div className="h-full bg-primary w-[95%]"></div>
                            </div>
                         </div>
                         <div className="flex gap-6 text-sm">
                            <div>
                               <span className="text-[#b5bac1] block text-xs font-semibold uppercase tracking-wider mb-0.5">{t('wallet')}</span>
                               <span className="text-[#dbdee1] font-medium flex items-center gap-1.5">
                                 <div className="w-4 h-4 rounded-full bg-yellow-500/20 flex items-center justify-center text-[10px]">🪙</div> 2,450
                               </span>
                            </div>
                            <div>
                               <span className="text-[#b5bac1] block text-xs font-semibold uppercase tracking-wider mb-0.5">{t('bank')}</span>
                               <span className="text-[#dbdee1] font-medium flex items-center gap-1.5">
                                 <div className="w-4 h-4 rounded-full bg-yellow-500/20 flex items-center justify-center text-[10px]">🪙</div> 15,000
                               </span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
