"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { MarketingLayout } from "@/components/MarketingLayout";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Coins, MessageSquare, Gift, Users, Clock, Hash, AlertTriangle, Settings, Plus, Zap, TrendingUp, ChevronRight } from "lucide-react";

const getModulesConfig = () => [
  { name: "automod", icon: Shield },
  { name: "economy", icon: Coins },
  { name: "engagement", icon: TrendingUp },
  { name: "giveaways", icon: Gift },
  { name: "jtc", icon: Users },
  { name: "moderation", icon: AlertTriangle },
  { name: "schedule", icon: Clock },
  { name: "tickets", icon: MessageSquare },
  { name: "warns", icon: Hash },
  { name: "xp", icon: Zap },
  { name: "custom-commands", icon: Plus },
  { name: "settings", icon: Settings }
];

export default function ModulesPage() {
  const t = useTranslations("modules");
  const modulesList = getModulesConfig();

  return (
    <MarketingLayout>
      <div className="relative min-h-screen bg-black pt-48 pb-32 overflow-hidden selection:bg-white selection:text-black">
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-white/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-white/[0.03]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-24"
          >
            <div className="inline-flex items-center text-white/30 text-xs tracking-[0.3em] uppercase mb-8 border border-white/10 px-4 py-2">
              // SYSTEM_MODULES
            </div>
            
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-8 uppercase leading-[0.9]">
              Module<br/>Architecture
            </h1>
            
            <p className="text-white/40 tracking-[0.1em] text-sm uppercase max-w-2xl leading-relaxed">
              {t("description")}
            </p>
          </motion.div>

          <div className="w-full h-px bg-white/10 mb-24" />

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10"
          >
            {modulesList.map((mod, i) => (
              <motion.div
                key={mod.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
              >
                <Link href={`/module/${mod.name}`} className="block h-full">
                  <div className="group bg-[#050505] p-8 md:p-10 hover:bg-white/[0.02] transition-all duration-500 h-full flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-px bg-white/0 group-hover:bg-white/20 transition-all duration-700" />
                    
                    <div className="flex items-center justify-between mb-8">
                      <mod.icon className="w-6 h-6 text-white/30 group-hover:text-white transition-colors duration-500" />
                      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-medium text-white mb-4 uppercase tracking-[0.1em] group-hover:tracking-[0.15em] transition-all duration-500">
                      {t(`modules.${mod.name}.title`)}
                    </h3>
                    
                    <p className="text-white/40 text-sm leading-relaxed font-light flex-grow">
                      {t(`modules.${mod.name}.description`)}
                    </p>

                    <div className="mt-8 flex items-center text-xs uppercase tracking-[0.3em] text-white/20 group-hover:text-white transition-colors duration-500">
                      Explore <ChevronRight className="w-3 h-3 ml-2 group-hover:translate-x-2 transition-transform duration-500" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </MarketingLayout>
  );
}
