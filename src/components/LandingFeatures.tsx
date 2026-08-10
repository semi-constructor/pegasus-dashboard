"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, CheckCircle2, Ticket, Gift, Gamepad2, MessageSquare, Coins, Swords, ArrowRight, BarChart3, TerminalSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface FeatureSectionProps {
  title: string;
  description: string;
  features: { title: string; desc: string }[];
  visual: React.ReactNode;
  reverse?: boolean;
  moduleLink?: string;
  moduleLinkText?: string;
}

const FeatureSection = ({ title, description, features, visual, reverse, moduleLink, moduleLinkText }: FeatureSectionProps) => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden border-b border-border/50 bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(#80808015_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className={`grid lg:grid-cols-2 gap-16 items-center ${reverse ? '' : ''}`}>
          <div className={`space-y-10 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">{title}</h2>
              <p className="text-lg text-muted-foreground">{description}</p>
            </div>
            
            <div className="space-y-6">
              {features.map((f, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {moduleLink && moduleLinkText && (
              <div className="mt-8">
                <Link href={moduleLink}>
                  <Button variant="outline" className="group rounded-full px-6 py-6 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary transition-all text-sm font-bold">
                    {moduleLinkText}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className={`relative ${reverse ? 'lg:order-1' : 'lg:order-2'}`}>
            {visual}
          </div>
        </div>
      </div>
    </section>
  );
};

export function LandingFeatures() {
  const t = useTranslations('features');
  const tCommon = useTranslations('common');

  return (
    <div className="flex flex-col w-full" id="features">
      
      {/* 1. Moderation */}
      <FeatureSection
        title={t('moderation.title')}
        description={t('moderation.description')}
        moduleLink="/module/automod"
        moduleLinkText={tCommon('learnMore')}
        features={[
          { title: t('moderation.automod.title'), desc: t('moderation.automod.desc') },
          { title: t('moderation.warning.title'), desc: t('moderation.warning.desc') },
          { title: t('moderation.auditing.title'), desc: t('moderation.auditing.desc') }
        ]}
        visual={
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full max-w-md relative rounded-md border border-[#1e1f22] bg-[#313338] shadow-2xl overflow-hidden font-sans text-left mx-auto"
          >
            <div className="p-4 flex gap-4">
              <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-primary/20">
                 <Image src="/favicon.ico" alt="Pegasus" width={40} height={40} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 flex-wrap">
                   <span className="font-medium text-[#dbdee1] hover:underline cursor-pointer">Pegasus</span>
                   <span className="text-[10px] bg-[#5865F2] text-white px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold leading-none mt-0.5">BOT</span>
                   <span className="text-xs text-[#80848e] ml-1">Today at 14:23</span>
                 </div>
                 <div className="mt-2 rounded border-l-4 border-red-500 bg-[#2b2d31] p-4">
                    <div className="flex items-center gap-2 mb-2">
                       <ShieldAlert className="w-4 h-4 text-red-500" />
                       <span className="font-bold text-[#dbdee1]">{t('moderation.quarantineTriggered')}</span>
                    </div>
                    <p className="text-sm text-[#dbdee1] mb-2">
                      {t.rich('moderation.userQuarantined', {
                        username: (chunks) => <span className="bg-[#1e1f22] px-1 rounded">{chunks}</span>
                      })}
                    </p>
                    <div className="space-y-2 mt-3">
                       <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1 text-xs text-[#b5bac1] font-semibold uppercase">{t('moderation.reason')}</div>
                          <div className="col-span-2 text-sm text-[#dbdee1]">{t('moderation.reasonText')}</div>
                       </div>
                       <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1 text-xs text-[#b5bac1] font-semibold uppercase">{t('moderation.actionTaken')}</div>
                          <div className="col-span-2 text-sm text-[#dbdee1]">{t('moderation.actionText')}</div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        }
      />

      {/* 2. Economy & XP */}
      <FeatureSection
        title={t('economy.title')}
        description={t('economy.description')}
        reverse={true}
        moduleLink="/module/economy"
        moduleLinkText={tCommon('learnMore')}
        features={[
          { title: t('economy.rankCards.title'), desc: t('economy.rankCards.desc') },
          { title: t('economy.globalEconomy.title'), desc: t('economy.globalEconomy.desc') },
          { title: t('economy.roleRewards.title'), desc: t('economy.roleRewards.desc') }
        ]}
        visual={
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full max-w-md relative rounded-md border border-[#1e1f22] bg-[#313338] shadow-2xl overflow-hidden font-sans text-left mx-auto"
          >
            <div className="p-4 flex gap-4">
              <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-primary/20">
                 <Image src="/favicon.ico" alt="Pegasus" width={40} height={40} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 flex-wrap">
                   <span className="font-medium text-[#dbdee1] hover:underline cursor-pointer">Pegasus</span>
                   <span className="text-[10px] bg-[#5865F2] text-white px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold leading-none mt-0.5">BOT</span>
                 </div>
                 
                 {/* The Image Attachment */}
                 <div className="mt-3 rounded-xl overflow-hidden shadow-sm border border-[#1e1f22] bg-[#2b2d31]">
                    <div className="h-20 bg-gradient-to-r from-primary/40 to-purple-500/40" />
                    <div className="px-5 pb-5 relative">
                      <div className="absolute -top-10 left-5 w-20 h-20 rounded-full border-4 border-[#2b2d31] bg-secondary overflow-hidden">
                         <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/40 to-secondary" />
                      </div>
                      <div className="flex justify-end pt-3 pb-1">
                        <div className="text-right">
                          <span className="text-[10px] text-[#b5bac1] font-semibold uppercase tracking-wider">{t('economy.rank')}</span>
                          <span className="text-lg font-bold text-[#dbdee1] ml-1">#4</span>
                          <span className="text-[10px] text-[#b5bac1] font-semibold uppercase tracking-wider ml-3">{t('economy.level')}</span>
                          <span className="text-lg font-bold text-primary ml-1">42</span>
                        </div>
                      </div>
                      <div className="mt-1">
                        <h4 className="text-lg font-bold text-[#dbdee1]">ActiveMember</h4>
                        <p className="text-xs text-[#b5bac1]">{t('economy.reputationHigh')}</p>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-[#b5bac1] font-semibold">14,250 / 15,000 XP</span>
                        </div>
                        <div className="h-2.5 w-full bg-[#1e1f22] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-purple-500 w-[95%]"></div>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        }
      />

      {/* 3. Tickets */}
      <FeatureSection
        title={t('tickets.title')}
        description={t('tickets.description')}
        moduleLink="/module/tickets"
        moduleLinkText={tCommon('learnMore')}
        features={[
          { title: t('tickets.multiDepartment.title'), desc: t('tickets.multiDepartment.desc') },
          { title: t('tickets.staffTooling.title'), desc: t('tickets.staffTooling.desc') },
          { title: t('tickets.webTranscripts.title'), desc: t('tickets.webTranscripts.desc') }
        ]}
        visual={
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full max-w-md relative rounded-md border border-[#1e1f22] bg-[#313338] shadow-2xl overflow-hidden font-sans text-left mx-auto"
          >
            <div className="p-4 flex gap-4">
              <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-primary/20">
                 <Image src="/favicon.ico" alt="Pegasus" width={40} height={40} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 flex-wrap">
                   <span className="font-medium text-[#dbdee1] hover:underline cursor-pointer">Pegasus</span>
                   <span className="text-[10px] bg-[#5865F2] text-white px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold leading-none mt-0.5">BOT</span>
                 </div>
                 
                 <div className="mt-2 rounded border-l-4 border-indigo-500 bg-[#2b2d31] p-4">
                    <div className="flex items-center gap-2 mb-3">
                       <Ticket className="w-5 h-5 text-indigo-500" />
                       <span className="font-bold text-[#dbdee1] text-lg">{t('tickets.supportCenter')}</span>
                    </div>
                    <p className="text-sm text-[#dbdee1] mb-4 leading-relaxed">
                      {t('tickets.supportCenterDesc')}
                    </p>
                    <div className="flex flex-col gap-2">
                       <div className="bg-[#4752c4] hover:bg-[#5865F2] cursor-pointer text-white text-sm font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2">
                          <span>🎫</span> {t('tickets.generalSupport')}
                       </div>
                       <div className="bg-[#248046] hover:bg-[#1a6334] cursor-pointer text-white text-sm font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2">
                          <span>💰</span> {t('tickets.billingInquiry')}
                       </div>
                       <div className="bg-[#4e5058] hover:bg-[#6d6f78] cursor-pointer text-white text-sm font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2">
                          <span>📝</span> {t('tickets.staffApplication')}
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        }
      />

      {/* 4. Giveaways */}
      <FeatureSection
        title={t('giveaways.title')}
        description={t('giveaways.description')}
        reverse={true}
        moduleLink="/module/giveaways"
        moduleLinkText={tCommon('learnMore')}
        features={[
          { title: t('giveaways.multiWinner.title'), desc: t('giveaways.multiWinner.desc') },
          { title: t('giveaways.entryReqs.title'), desc: t('giveaways.entryReqs.desc') },
          { title: t('giveaways.bonusEntries.title'), desc: t('giveaways.bonusEntries.desc') }
        ]}
        visual={
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full max-w-md relative rounded-md border border-[#1e1f22] bg-[#313338] shadow-2xl overflow-hidden font-sans text-left mx-auto"
          >
            <div className="p-4 flex gap-4">
              <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-primary/20">
                 <Image src="/favicon.ico" alt="Pegasus" width={40} height={40} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 flex-wrap">
                   <span className="font-medium text-[#dbdee1] hover:underline cursor-pointer">Pegasus</span>
                   <span className="text-[10px] bg-[#5865F2] text-white px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold leading-none mt-0.5">BOT</span>
                 </div>
                 
                 <div className="mt-2 rounded border-l-4 border-pink-500 bg-[#2b2d31] p-4">
                    <div className="flex items-center gap-2 mb-2">
                       <Gift className="w-5 h-5 text-pink-500" />
                       <span className="font-bold text-[#dbdee1] text-lg">{t('giveaways.giveawayTitle')}</span>
                    </div>
                    <p className="text-sm text-[#b5bac1] mb-4">{t('giveaways.reactToEnter')}</p>
                    
                    <div className="space-y-2 mt-3 mb-4">
                       <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1 text-xs text-[#b5bac1] font-semibold uppercase">{t('giveaways.ends')}</div>
                          <div className="col-span-2 text-sm text-[#dbdee1]">{t('giveaways.endsIn')}</div>
                       </div>
                       <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1 text-xs text-[#b5bac1] font-semibold uppercase">{t('giveaways.hostedBy')}</div>
                          <div className="col-span-2 text-sm text-primary hover:underline cursor-pointer">@AdminUser</div>
                       </div>
                       <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1 text-xs text-[#b5bac1] font-semibold uppercase">{t('giveaways.entries')}</div>
                          <div className="col-span-2 text-sm text-[#dbdee1]">1,245</div>
                       </div>
                    </div>
                    
                    <div className="inline-flex bg-[#3b3d44] hover:bg-[#404249] cursor-pointer border border-[#1e1f22] rounded px-3 py-1.5 items-center gap-2">
                       <span className="text-lg">🎉</span>
                       <span className="text-[#dbdee1] font-bold text-sm">1245</span>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        }
      />

      {/* 5. Fun & Games */}
      <FeatureSection
        title={t('fun.title')}
        description={t('fun.description')}
        moduleLink="/module/economy"
        moduleLinkText={tCommon('learnMore')}
        features={[
          { title: t('fun.interactiveGames.title'), desc: t('fun.interactiveGames.desc') },
          { title: t('fun.bettingWagers.title'), desc: t('fun.bettingWagers.desc') },
          { title: t('fun.socialCommands.title'), desc: t('fun.socialCommands.desc') }
        ]}
        visual={
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full max-w-md relative rounded-md border border-[#1e1f22] bg-[#313338] shadow-2xl overflow-hidden font-sans text-left mx-auto"
          >
            <div className="p-4 flex gap-4">
              <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-primary/20">
                 <Image src="/favicon.ico" alt="Pegasus" width={40} height={40} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 flex-wrap">
                   <span className="font-medium text-[#dbdee1] hover:underline cursor-pointer">Pegasus</span>
                   <span className="text-[10px] bg-[#5865F2] text-white px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold leading-none mt-0.5">BOT</span>
                 </div>
                 
                 <div className="mt-2 rounded border-l-4 border-blue-400 bg-[#2b2d31] p-4">
                    <div className="flex items-center gap-2 mb-2">
                       <Gamepad2 className="w-5 h-5 text-blue-400" />
                       <span className="font-bold text-[#dbdee1] text-lg">{t('fun.triviaChallenge')}</span>
                    </div>
                    <p className="text-sm text-[#dbdee1] mb-2 font-medium">{t('fun.triviaQuestion')}</p>
                    <p className="text-xs text-[#b5bac1] mb-4">{t('fun.triviaDifficulty')}</p>
                    
                    <div className="grid grid-cols-2 gap-2">
                       <div className="bg-[#4e5058] hover:bg-[#6d6f78] cursor-pointer text-white text-sm font-medium py-2 px-3 rounded transition-colors text-center border border-[#1e1f22]">
                          A) 2013
                       </div>
                       <div className="bg-[#4e5058] hover:bg-[#6d6f78] cursor-pointer text-white text-sm font-medium py-2 px-3 rounded transition-colors text-center border border-[#1e1f22]">
                          B) 2014
                       </div>
                       <div className="bg-[#4752c4] text-white text-sm font-medium py-2 px-3 rounded transition-colors text-center border border-[#1e1f22] ring-2 ring-white/20">
                          C) 2015
                       </div>
                       <div className="bg-[#4e5058] hover:bg-[#6d6f78] cursor-pointer text-white text-sm font-medium py-2 px-3 rounded transition-colors text-center border border-[#1e1f22]">
                          D) 2016
                       </div>
                    </div>
                    
                    <p className="text-sm text-green-400 mt-4 font-bold flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4" /> {t('fun.triviaCorrect')}
                    </p>
                 </div>
              </div>
            </div>
          </motion.div>
        }
      />

      {/* 6. Infrastructure (Join-to-Create) */}
      <FeatureSection
        title={t('infrastructure.title')}
        description={t('infrastructure.description')}
        reverse={true}
        moduleLink="/module/jtc"
        moduleLinkText={tCommon('learnMore')}
        features={[
          { title: t('infrastructure.dynamicVoice.title'), desc: t('infrastructure.dynamicVoice.desc') },
          { title: t('infrastructure.autoCleanup.title'), desc: t('infrastructure.autoCleanup.desc') },
          { title: t('infrastructure.ownerControls.title'), desc: t('infrastructure.ownerControls.desc') }
        ]}
        visual={
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-md border border-[#1e1f22] bg-[#2b2d31] p-3 shadow-2xl max-w-sm mx-auto font-sans w-full"
          >
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#80848e] uppercase tracking-wider mb-2 px-2">
               <div className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform transition-transform -rotate-90"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  {t('infrastructure.voiceChannels')}
               </div>
            </div>
            
            <div className="space-y-0.5">
              {/* Master Channel */}
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[#35373c] text-[#80848e] cursor-pointer transition-colors group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg>
                <span className="font-medium text-[15px] group-hover:text-[#dbdee1]">➕ {t('infrastructure.joinToCreate')}</span>
              </div>
              
              {/* Created Channel */}
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-[#35373c] text-[#dbdee1] cursor-pointer relative overflow-hidden mt-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-[#80848e]"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-[15px] truncate block text-[#dbdee1]">🎮 Late Night Gaming</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#80848e]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <span>3/4</span>
                </div>
              </div>

              {/* Users in Channel */}
              <div className="ml-[26px] space-y-[2px] mt-0.5">
                <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#35373c] cursor-pointer group">
                  <div className="w-6 h-6 rounded-full bg-primary/20 relative">
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#2b2d31]" />
                  </div>
                  <span className="text-[14px] text-[#80848e] group-hover:text-[#dbdee1] font-medium">OwnerUser</span>
                  <div className="ml-auto text-yellow-500" title={t('infrastructure.channelOwner')}>
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#35373c] cursor-pointer group">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 relative">
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#2b2d31]" />
                  </div>
                  <span className="text-[14px] text-[#80848e] group-hover:text-[#dbdee1]">GuestUser</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#35373c] cursor-pointer group">
                  <div className="w-6 h-6 rounded-full bg-pink-500/20 relative">
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#2b2d31]" />
                  </div>
                  <span className="text-[14px] text-[#80848e] group-hover:text-[#dbdee1]">ThirdWheel</span>
                </div>
              </div>
            </div>
          </motion.div>
        }
      />

      {/* 7. Engagement & Tracking */}
      <FeatureSection
        title={t('engagement.title')}
        description={t('engagement.description')}
        moduleLink="/module/engagement"
        moduleLinkText={tCommon('learnMore')}
        features={[
          { title: t('engagement.voiceTracking.title'), desc: t('engagement.voiceTracking.desc') },
          { title: t('engagement.messageTracking.title'), desc: t('engagement.messageTracking.desc') },
          { title: t('engagement.rewards.title'), desc: t('engagement.rewards.desc') }
        ]}
        visual={
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full max-w-md relative rounded-md border border-[#1e1f22] bg-[#313338] shadow-2xl overflow-hidden font-sans text-left mx-auto p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-[#dbdee1] text-lg">Weekly Activity</h4>
                <p className="text-xs text-[#b5bac1]">Top Members this week</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded bg-[#2b2d31] border border-white/5">
                 <div className="flex items-center gap-3">
                   <div className="font-bold text-[#dbdee1] w-4">1</div>
                   <div className="w-8 h-8 rounded-full bg-primary/20" />
                   <span className="font-medium text-[#dbdee1]">ActiveUser</span>
                 </div>
                 <div className="text-right">
                   <div className="text-sm font-bold text-emerald-400">14.5k Msgs</div>
                   <div className="text-xs text-[#b5bac1]">45h Voice</div>
                 </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-[#2b2d31] border border-white/5">
                 <div className="flex items-center gap-3">
                   <div className="font-bold text-[#b5bac1] w-4">2</div>
                   <div className="w-8 h-8 rounded-full bg-blue-500/20" />
                   <span className="font-medium text-[#dbdee1]">ChatterBox</span>
                 </div>
                 <div className="text-right">
                   <div className="text-sm font-bold text-emerald-400">12.1k Msgs</div>
                   <div className="text-xs text-[#b5bac1]">32h Voice</div>
                 </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-[#2b2d31] border border-white/5">
                 <div className="flex items-center gap-3">
                   <div className="font-bold text-[#b5bac1] w-4">3</div>
                   <div className="w-8 h-8 rounded-full bg-pink-500/20" />
                   <span className="font-medium text-[#dbdee1]">QuietOne</span>
                 </div>
                 <div className="text-right">
                   <div className="text-sm font-bold text-emerald-400">4.2k Msgs</div>
                   <div className="text-xs text-[#b5bac1]">86h Voice</div>
                 </div>
              </div>
            </div>
          </motion.div>
        }
      />

      {/* 8. Custom Commands */}
      <FeatureSection
        title={t('customCommands.title')}
        description={t('customCommands.description')}
        reverse={true}
        moduleLink="/module/custom-commands"
        moduleLinkText={tCommon('learnMore')}
        features={[
          { title: t('customCommands.autoResponders.title'), desc: t('customCommands.autoResponders.desc') },
          { title: t('customCommands.variables.title'), desc: t('customCommands.variables.desc', { user: '{user}', server: '{server}' }) },
          { title: t('customCommands.embeds.title'), desc: t('customCommands.embeds.desc') }
        ]}
        visual={
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full max-w-md relative rounded-md border border-[#1e1f22] bg-[#313338] shadow-2xl overflow-hidden font-sans text-left mx-auto"
          >
            <div className="p-4 flex gap-4">
              <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-primary/20">
                 <Image src="/favicon.ico" alt="User" width={40} height={40} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 flex-wrap">
                   <span className="font-medium text-[#dbdee1] hover:underline cursor-pointer">AdminUser</span>
                   <span className="text-xs text-[#80848e] ml-1">Today at 18:04</span>
                 </div>
                 <p className="text-[#dbdee1] mt-1">/apply</p>
              </div>
            </div>
            
            <div className="p-4 flex gap-4 pt-0">
              <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-primary/20">
                 <Image src="/favicon.ico" alt="Pegasus" width={40} height={40} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 flex-wrap">
                   <span className="font-medium text-[#dbdee1] hover:underline cursor-pointer">Pegasus</span>
                   <span className="text-[10px] bg-[#5865F2] text-white px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold leading-none mt-0.5">BOT</span>
                 </div>
                 <div className="mt-2 rounded border-l-4 border-teal-500 bg-[#2b2d31] p-4">
                    <div className="flex items-center gap-2 mb-2">
                       <TerminalSquare className="w-5 h-5 text-teal-500" />
                       <span className="font-bold text-[#dbdee1] text-lg">Staff Application</span>
                    </div>
                    <p className="text-sm text-[#dbdee1] mb-2 leading-relaxed">
                      Hello AdminUser, thanks for your interest in joining the staff team!
                    </p>
                    <p className="text-sm text-[#b5bac1]">
                      Please fill out the form at the link below. Good luck!
                    </p>
                    <div className="mt-4 inline-flex bg-[#3b3d44] text-[#dbdee1] font-bold text-sm px-4 py-2 rounded">
                      Open Application Form
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#1e1f22] text-xs text-[#80848e] italic">
                      Dev Note: We are working to ship this feature with custom action embeds
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        }
      />

    </div>
  );
}
