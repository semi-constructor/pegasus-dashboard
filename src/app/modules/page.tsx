import React from "react";
import { getTranslations } from "next-intl/server";
import { MarketingLayout } from "@/components/MarketingLayout";
import Link from "next/link";
import { Shield, Coins, MessageSquare, Gift, Users, Clock, Hash, AlertTriangle, Settings, Plus, Zap, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Bot Modules | Pegasus",
  description: "Explore all available bot modules, features, and setup instructions for Pegasus.",
};

const getModulesConfig = () => [
  {
    name: "automod",
    icon: Shield,
    color: "text-red-500",
    bg: "bg-red-500/10"
  },
  {
    name: "economy",
    icon: Coins,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10"
  },
  {
    name: "engagement",
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    name: "giveaways",
    icon: Gift,
    color: "text-pink-500",
    bg: "bg-pink-500/10"
  },
  {
    name: "jtc",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    name: "moderation",
    icon: AlertTriangle,
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    name: "schedule",
    icon: Clock,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    name: "tickets",
    icon: MessageSquare,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10"
  },
  {
    name: "warns",
    icon: Hash,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    name: "xp",
    icon: Zap,
    color: "text-violet-500",
    bg: "bg-violet-500/10"
  },
  {
    name: "custom-commands",
    icon: Plus,
    color: "text-teal-500",
    bg: "bg-teal-500/10"
  },
  {
    name: "settings",
    icon: Settings,
    color: "text-gray-400",
    bg: "bg-gray-400/10"
  }
];

export default async function ModulesPage() {
  const t = await getTranslations("modules");
  const modulesList = getModulesConfig();

  return (
    <MarketingLayout>
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            {t.raw('title').split('Pegasus Modules')[0]}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              Pegasus Modules
            </span>
          </h1>
          <p className="text-lg text-white/60">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modulesList.map((mod) => (
            <Link key={mod.name} href={`/module/${mod.name}`}>
              <div className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(168,85,247,0.3)]">
                <div className={`w-12 h-12 rounded-xl ${mod.bg} ${mod.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <mod.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  {t(`modules.${mod.name}.title`)}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {t(`modules.${mod.name}.description`)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MarketingLayout>
  );
}
