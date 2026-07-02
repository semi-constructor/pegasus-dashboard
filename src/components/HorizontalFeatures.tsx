'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { InteractiveCard } from './InteractiveElements';
import { Shield, Coins, Wrench, Server, CheckCircle2 } from 'lucide-react';

export function HorizontalFeatures() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Maps vertical scroll to horizontal scroll.
  // With 4 very wide items, we shift to the left by enough to reveal the last items.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]); 

  const pillars = [
    { 
      icon: Shield, 
      title: "Security & Moderation", 
      desc: "Enterprise-grade protection mechanisms and advanced moderation workflows.",
      features: [
        { name: "AutoMod V2 & Quarantine", desc: "Regex triggers, mention spam detection, and automatic role-stripping." },
        { name: "Advanced Warnings", desc: "Automated penalty escalation (kick/ban) based on infraction thresholds." },
        { name: "Automated Word Filtering", desc: "Proactive message scanning with severity classifications and logging." }
      ]
    },
    { 
      icon: Coins, 
      title: "Economy & Engagement", 
      desc: "Robust gamification systems to drastically increase server retention.",
      features: [
        { name: "Comprehensive Economy", desc: "Jobs, robberies, gambling minigames, and a dynamic item shop." },
        { name: "XP & Leveling", desc: "Voice/text tracking, rank cards, and automated role rewards." },
        { name: "Automated Giveaways", desc: "Multi-winner selection, entry requirements, and bonus multipliers." }
      ]
    },
    { 
      icon: Wrench, 
      title: "Server Utility", 
      desc: "Modular tools to automate daily server management operations.",
      features: [
        { name: "Join to Create (JTC)", desc: "Dynamic, temporary voice channel allocation and automated cleanup." },
        { name: "Ticket Support Panels", desc: "Multi-department routing, staff claiming, and transcript logging." },
        { name: "Multi-Language Engine", desc: "Dynamic localization supporting English, German, Spanish, and French." }
      ]
    },
    { 
      icon: Server, 
      title: "Platform & Integration", 
      desc: "Deep API integrations and advanced message formatting.",
      features: [
        { name: "Custom Rich Embeds", desc: "Professional announcements with automated reaction role assignment." },
        { name: "REST API Server", desc: "Secure endpoints for live telemetry, query profiling, and module mutations." },
        { name: "Real-Time Dashboard", desc: "Web-based control plane interacting securely with the bot's core memory." }
      ]
    }
  ];

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-transparent">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute top-24 left-6 md:left-24 z-10 bg-white/[0.03] backdrop-blur-2xl p-6 rounded-2xl border border-white/10 border-t-white/20 border-l-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]" />
          <div className="relative z-10">
            <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-3 drop-shadow-md">// ARCHITECTURE PILLARS</div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white drop-shadow-lg shadow-black/50">Comprehensive Systems</h2>
          </div>
        </div>
        
        <motion.div style={{ x }} className="flex gap-12 px-6 md:px-24 pt-32">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="w-[85vw] md:w-[600px] h-[550px] shrink-0">
              <InteractiveCard className="p-10 flex flex-col group h-full">
                <div className="mb-8 border-b border-white/10 pb-8">
                  <pillar.icon className="w-10 h-10 text-neutral-400 mb-6 group-hover:text-[#5E5CE6] transition-colors" />
                  <h3 className="text-3xl font-light text-white mb-4 tracking-tight">{pillar.title}</h3>
                  <p className="text-lg text-neutral-400 font-light leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
                <div className="flex-1 flex flex-col gap-6">
                  {pillar.features.map((feat, fidx) => (
                    <div key={fidx} className="flex gap-4 items-start">
                      <CheckCircle2 className="w-5 h-5 text-[#5E5CE6] shrink-0 mt-1" />
                      <div>
                        <h4 className="text-white font-medium mb-1">{feat.name}</h4>
                        <p className="text-sm text-neutral-500 font-light leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </InteractiveCard>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
