import React from "react";
import { getTranslations } from "next-intl/server";
import { MarketingLayout } from "@/components/MarketingLayout";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Shield, Coins, MessageSquare, Gift, Users, Clock, Hash, AlertTriangle, Settings, Plus, Zap, TrendingUp, Settings2, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const getModulesConfig = (): Record<string, any> => ({
  "automod": {
    icon: Shield,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  "economy": {
    icon: Coins,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  "engagement": {
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  "giveaways": {
    icon: Gift,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  "jtc": {
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  "moderation": {
    icon: AlertTriangle,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  "schedule": {
    icon: Clock,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  "tickets": {
    icon: MessageSquare,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  "warns": {
    icon: Hash,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  "xp": {
    icon: Zap,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  "custom-commands": {
    icon: Plus,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
  "settings": {
    icon: Settings,
    color: "text-gray-400",
    bg: "bg-gray-400/10",
  }
});

export default async function ModuleDetailsPage({
  params,
}: {
  params: Promise<{ moduleName: string }>;
}) {
  const resolvedParams = await params;
  const { moduleName } = resolvedParams;
  const modulesConfig = getModulesConfig();
  const mod = modulesConfig[moduleName.toLowerCase()];

  if (!mod) {
    return notFound();
  }

  const t = await getTranslations("modules");
  const Icon = mod.icon;

  const features = t.raw(`modules.${moduleName.toLowerCase()}.features`) as string[];

  return (
    <MarketingLayout>
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto">
          
          <Link href="/modules" className="inline-flex items-center text-white/50 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToModules")}
          </Link>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 backdrop-blur-xl relative overflow-hidden">
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-96 h-96 ${mod.bg} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none`} />

            <div className="relative z-10 flex flex-col sm:flex-row gap-6 sm:items-center mb-8">
              <div className={`w-20 h-20 rounded-2xl ${mod.bg} ${mod.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                  {t(`modules.${moduleName.toLowerCase()}.title`)}
                </h1>
                <p className="text-lg text-white/60">
                  {t(`modules.${moduleName.toLowerCase()}.fullDescription`)}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mt-12">
              <div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" /> {t("keyFeatures")}
                </h2>
                <ul className="space-y-4">
                  {features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex gap-3 text-white/70">
                      <div className="mt-1 bg-primary/20 p-1 rounded-full text-primary shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-primary" /> {t("howToSetUp")}
                </h2>
                <div className="bg-black/30 border border-white/5 rounded-2xl p-6">
                  <p className="text-white/70 leading-relaxed mb-6">
                    {t(`modules.${moduleName.toLowerCase()}.setup`)}
                  </p>
                  <Link href={`/dashboard?module=${moduleName.toLowerCase()}`}>
                    <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold py-6 px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                      {t("configureInDashboard")} <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}


