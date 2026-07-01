'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { InteractiveCard } from './InteractiveElements';
import { Mic, Shield, Gavel, Coins, Sparkles, Ticket, Terminal } from 'lucide-react';

export function HorizontalFeatures() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Maps vertical scroll to horizontal scroll.
  // With 7 items, we shift to the left by enough to reveal the last items.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-78%"]); 

  const features = [
    { icon: Mic, title: "Dynamic Voice Allocation", desc: "Algorithmic voice channel management (JTC) that instantly spawns ephemeral rooms with adaptive bitrate templates and automated lifecycle cleanup." },
    { icon: Shield, title: "Proactive Threat Mitigation", desc: "Next-generation AutoMod V2 utilizing heuristic message scanning, customizable neural triggers, and a secure Quarantine Vault for isolated threat analysis." },
    { icon: Gavel, title: "Advanced Moderation Suite", desc: "Enterprise-grade staff workflows featuring automated penalty escalation trees, role-based access control, and cryptographically immutable audit logging." },
    { icon: Coins, title: "Cryptographic Server Economy", desc: "High-frequency transactional economy engine boasting structured employment tiers, variable-probability minigames, and a dynamic supply-demand item shop." },
    { icon: Sparkles, title: "Algorithmic Engagement", desc: "Multi-vector activity tracking computing rich visual rank cards, cross-server Elo leaderboards, automated tier progression, and dynamic retention quests." },
    { icon: Ticket, title: "Enterprise Ticketing", desc: "High-throughput support workflows utilizing interactive routing panels, weighted staff distribution, cryptographically signed transcripts, and real-time SLA analytics." },
    { icon: Terminal, title: "Programmable Prefix Commands", desc: "Design bespoke custom commands with dynamic prefix resolution. Execute programmable multi-stage macros and tailored automated workflows directly from the chat interface." }
  ];

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute top-32 left-6 md:left-24 z-10">
          <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-3">// CAPABILITIES</div>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white">Core Systems</h2>
        </div>
        
        <motion.div style={{ x }} className="flex gap-8 px-6 md:px-24 pt-32">
          {features.map((feature, idx) => (
            <div key={idx} className="w-[85vw] md:w-[400px] h-[400px] shrink-0">
              <InteractiveCard className="p-10 flex flex-col justify-between group h-full bg-black">
                <div>
                  <feature.icon className="w-8 h-8 text-neutral-400 mb-8 group-hover:text-[#5E5CE6] transition-colors" />
                  <h3 className="text-2xl font-normal text-white mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-base text-neutral-400 font-light leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </InteractiveCard>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
