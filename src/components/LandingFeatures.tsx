"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

const GovernanceSection = () => {
  return (
    <section className="min-h-screen flex items-center py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-50" />
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">Governance</h2>
              <p className="text-lg text-muted-foreground">
                Messages get scanned the instant they're posted. Repeat offenders lose roles automatically.
              </p>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">AutoMod V2</h3>
                <p className="text-muted-foreground">
                  Keyword, regex, mention-spam, and attachment-spam triggers. Quarantine Vault strips roles from suspicious accounts until staff review.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Advanced Moderation</h3>
                <p className="text-muted-foreground">
                  Ban, kick, mute, timeout, purge, lock, and slowmode. Automated warning-escalation engine. Full audit log.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Word Filtering</h3>
                <p className="text-muted-foreground">
                  Substring and regex matching. Severity levels ranging from Low to Critical. Staff alert routing.
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            {/* Visual Anchor: Quarantine Vault Log */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Quarantine Vault</h4>
                    <p className="text-xs text-muted-foreground">AutoMod V2 Intervention</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-muted-foreground">ID: 8942A</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-lg bg-background border border-border">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-foreground font-mono">User: spammer_99</span>
                      <span className="text-xs text-muted-foreground font-mono">14:23 UTC</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 font-mono">Trigger: Attachment-spam threshold exceeded</p>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-xs px-2 py-1 rounded bg-destructive/10 text-destructive border border-destructive/20 line-through">@Member</span>
                      <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">@Quarantined</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <div className="h-8 flex-1 rounded bg-secondary" />
                  <div className="h-8 flex-1 rounded bg-primary/20" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const EconomySection = () => {
  return (
    <section className="min-h-screen flex items-center py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
             {/* Visual Anchor: Rank Card mock */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="relative mx-auto w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-primary/20 bg-card/90 backdrop-blur-xl"
             >
               <div className="h-24 bg-gradient-to-r from-primary/40 to-purple-500/40" />
               <div className="px-6 pb-6 relative">
                 <div className="absolute -top-12 left-6 w-24 h-24 rounded-full border-4 border-card bg-secondary overflow-hidden">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/40 to-secondary" />
                 </div>
                 <div className="flex justify-end pt-4 pb-2">
                   <div className="text-right">
                     <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Rank</span>
                     <span className="text-xl font-bold text-foreground ml-2">#4</span>
                     <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider ml-4">Level</span>
                     <span className="text-xl font-bold text-primary ml-2">42</span>
                   </div>
                 </div>
                 <div className="mt-2">
                   <h4 className="text-xl font-bold text-foreground">ActiveMember</h4>
                   <p className="text-sm text-muted-foreground">Reputation: High</p>
                 </div>
                 <div className="mt-6">
                   <div className="flex justify-between text-xs mb-2">
                     <span className="text-muted-foreground font-semibold">14,250 / 15,000 XP</span>
                   </div>
                   <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-primary to-purple-500 w-[95%] relative">
                        <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_ease-in-out_infinite]" />
                     </div>
                   </div>
                   <div className="mt-3 flex gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Daily Claimed</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium border border-primary/30">Level Up Imminent</span>
                   </div>
                 </div>
               </div>
             </motion.div>
          </div>

          <div className="order-1 lg:order-2 space-y-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">Community Economy</h2>
              <p className="text-lg text-muted-foreground">
                Users earn currency for chatting. Levels grant roles and channel access automatically.
              </p>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Economy & Marketplace</h3>
                <p className="text-muted-foreground">
                  Daily rewards, work, robbery, and gambling minigames. Custom item shop for community rewards.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">XP & Leveling</h3>
                <p className="text-muted-foreground">
                  Text and voice XP tracking. Rank cards, leaderboards, role rewards, quests, and achievements. Prestige and reputation system included.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Giveaways</h3>
                <p className="text-muted-foreground">
                  Multi-winner support with entry requirements and bonus-entry multipliers. Reroll capabilities and auto-announce scheduling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const InfrastructureSection = () => {
  return (
    <section className="min-h-screen flex items-center py-24 relative overflow-hidden bg-background border-t border-border/50">
       <div className="absolute inset-0 bg-[radial-gradient(#80808033_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
       
       <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">Infrastructure</h2>
              <p className="text-lg text-muted-foreground">
                Voice channels create themselves when users join. Support tickets route to the right staff role.
              </p>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Join-to-Create</h3>
                <p className="text-muted-foreground">
                  Voice channels with custom naming templates and auto cleanup. Owner lock and limit panel.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Ticket System</h3>
                <p className="text-muted-foreground">
                  Multi-department panels with per-department staff roles and routing. Claim, freeze, lock, and close operations.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Utility & Localization</h3>
                <p className="text-muted-foreground">
                  User, role, avatar, banner, and Steam lookups. Latency check. Language switching for en, de, es, fr.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
             {/* Visual Anchor: Voice channel mock */}
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4 shadow-xl max-w-sm mx-auto font-sans"
             >
               <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Voice Channels</div>
               
               <div className="space-y-1">
                 {/* Master Channel */}
                 <div className="flex items-center gap-2 p-2 rounded hover:bg-secondary/50 text-foreground cursor-default transition-colors">
                   <div className="text-muted-foreground">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg>
                   </div>
                   <span className="font-medium text-[15px]">Join to Create</span>
                 </div>
                 
                 {/* Created Channel */}
                 <div className="flex items-center gap-2 p-2 rounded bg-secondary/80 text-foreground cursor-default ml-2 border-l-2 border-primary/50 pl-3 relative overflow-hidden">
                   <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r-full" />
                   <div className="text-muted-foreground">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg>
                   </div>
                   <div className="flex-1 min-w-0">
                     <span className="font-medium text-[15px] truncate block text-primary">gaming room</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                     <span>2/4</span>
                   </div>
                 </div>

                 {/* Users in Channel */}
                 <div className="ml-8 space-y-2 mt-2">
                   <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-primary/20 relative">
                       <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card" />
                     </div>
                     <span className="text-sm text-muted-foreground font-medium">OwnerUser</span>
                     <div className="ml-auto text-primary" title="Channel Owner">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                     </div>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-primary/10 relative">
                       <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card" />
                     </div>
                     <span className="text-sm text-muted-foreground">GuestUser</span>
                   </div>
                 </div>
               </div>
               
               <div className="mt-4 pt-4 border-t border-border flex justify-between gap-2">
                 <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                 </div>
                 <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                 </div>
                 <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                 </div>
                 <div className="h-8 flex-1 rounded bg-destructive/10 text-destructive text-xs font-medium flex items-center justify-center border border-destructive/20 hover:bg-destructive/20 transition-colors cursor-pointer">
                    Disconnect
                 </div>
               </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export function LandingFeatures() {
  return (
    <div className="flex flex-col w-full">
      <GovernanceSection />
      <EconomySection />
      <InfrastructureSection />
    </div>
  );
}
