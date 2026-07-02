'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Coins, Trophy, Ticket, Mic } from 'lucide-react';
import { InteractiveCard } from './InteractiveElements';

const features = [
  {
    icon: <Shield className="w-8 h-8 text-white" />,
    title: "Enterprise AutoMod",
    description: "Multi-layered regex filtering, fast-message spam detection, and automated escalation. Protect your community with intelligent infraction thresholds that automatically timeout or ban repeat offenders without human intervention."
  },
  {
    icon: <Coins className="w-8 h-8 text-white" />,
    title: "Dynamic Economy Engine",
    description: "A complete virtual financial system. Users can work jobs, rob each other, gamble in blackjack, and buy custom roles from the dynamic shop. Keep your server highly engaged."
  },
  {
    icon: <Trophy className="w-8 h-8 text-white" />,
    title: "Leveling & Progression",
    description: "Reward activity naturally. Users gain XP for chatting and voice activity. Automatically assign new roles and unlock exclusive channels as users climb the server leaderboard."
  },
  {
    icon: <Ticket className="w-8 h-8 text-white" />,
    title: "Multi-Department Tickets",
    description: "Stop cluttering DMs. A beautiful, button-based ticket panel allows users to open private support channels. Transcripts are automatically saved and logged when the ticket is resolved."
  },
  {
    icon: <Mic className="w-8 h-8 text-white" />,
    title: "Join-to-Create Voice",
    description: "Eliminate empty voice channels. Users join a primary channel, and the bot instantly creates a private, temporary voice channel just for them, deleting it the moment they leave."
  }
];

function FeatureRow({ feature, index }: { feature: any, index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.2 1"]
  });

  const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -100 : 100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div 
      ref={ref}
      style={{ x, opacity }}
      className={`flex w-full mb-32 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
    >
      <div className="w-full md:w-2/3">
        <InteractiveCard className="p-10 flex flex-col md:flex-row gap-10 items-start">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 shadow-inner shrink-0">
            {feature.icon}
          </div>
          <div>
            <h3 className="text-3xl font-light text-white mb-4 tracking-tight">{feature.title}</h3>
            <p className="text-lg text-white/60 font-light leading-relaxed">{feature.description}</p>
          </div>
        </InteractiveCard>
      </div>
    </motion.div>
  );
}

export function FeatureShowcase() {
  return (
    <section className="max-w-[1400px] mx-auto px-6 py-32 relative z-20">
      <div className="text-center mb-32">
        <div className="text-[10px] font-mono tracking-widest text-[#5E5CE6] uppercase mb-4">// EXPANDED CAPABILITIES</div>
        <h2 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-6">Built for scale.</h2>
        <p className="text-xl text-neutral-400 font-light max-w-2xl mx-auto">
          We replaced 5 different bots with a single, highly-optimized core.
        </p>
      </div>

      <div className="flex flex-col">
        {features.map((feature, i) => (
          <FeatureRow key={i} feature={feature} index={i} />
        ))}
      </div>
    </section>
  );
}
