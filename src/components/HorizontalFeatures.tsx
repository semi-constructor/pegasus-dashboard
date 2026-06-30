'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { InteractiveCard } from './InteractiveElements';
import { Mic, Shield, Gavel, Coins, Sparkles, Ticket } from 'lucide-react';

export function HorizontalFeatures() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Maps vertical scroll to horizontal scroll.
  // With 6 items, we shift to the left by enough to reveal the last items.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]); 

  const features = [
    { icon: Mic, title: "Join to Create (JTC)", desc: "Dynamic voice channel management that instantly spawns temporary rooms with custom templates and automated cleanup." },
    { icon: Shield, title: "AutoMod V2 & Quarantine", desc: "Automated server security and proactive message scanning with flexible triggers, custom thresholds, and an isolating Quarantine Vault." },
    { icon: Gavel, title: "Advanced Moderation", desc: "Comprehensive staff moderation workflows, automated penalty escalation triggers, and immutable audit logging." },
    { icon: Coins, title: "Comprehensive Economy", desc: "Feature-rich server economy with daily rewards, structured jobs, gambling minigames, and a fully customizable item shop." },
    { icon: Sparkles, title: "Engagement Gamification", desc: "Dual text and voice activity tracking, visual rank cards, custom leaderboards, automated role rewards, and engagement quests." },
    { icon: Ticket, title: "Professional Tickets", desc: "Modular support ticketing workflows via interactive panels with dedicated staff routing, transcripts, and advanced analytics." }
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
