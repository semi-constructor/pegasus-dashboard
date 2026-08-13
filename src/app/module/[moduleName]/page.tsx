import React from "react";
import { getTranslations } from "next-intl/server";
import { MarketingLayout } from "@/components/MarketingLayout";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Shield, Coins, MessageSquare, Gift, Users, Clock, Hash, AlertTriangle, Settings, Plus, Zap, TrendingUp, Check, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const getModulesConfig = (): Record<string, any> => ({
  "automod": { icon: Shield },
  "economy": { icon: Coins },
  "engagement": { icon: TrendingUp },
  "giveaways": { icon: Gift },
  "jtc": { icon: Users },
  "moderation": { icon: AlertTriangle },
  "schedule": { icon: Clock },
  "tickets": { icon: MessageSquare },
  "warns": { icon: Hash },
  "xp": { icon: Zap },
  "custom-commands": { icon: Plus },
  "settings": { icon: Settings }
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
      <div className="relative min-h-screen bg-background pt-48 pb-32 overflow-hidden selection:bg-foreground selection:text-background">
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-foreground/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-foreground/[0.03]" />

        <div className="max-w-4xl mx-auto px-6 lg:px-24 relative z-10">
          <Link href="/modules" className="inline-flex items-center text-foreground/30 hover:text-foreground transition-colors mb-12 text-xs uppercase tracking-[0.3em]">
            <ArrowLeft className="w-3 h-3 mr-2" />
            {t("backToModules")}
          </Link>

          <div className="border border-border bg-[#050505] p-8 sm:p-12 relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 sm:items-start mb-12">
              <Icon className="w-8 h-8 text-foreground/30 flex-shrink-0" />
              <div>
                <h1 className="text-3xl sm:text-5xl font-medium text-foreground mb-4 uppercase tracking-tighter">
                  {t(`modules.${moduleName.toLowerCase()}.title`)}
                </h1>
                <p className="text-foreground/40 text-sm font-light leading-relaxed">
                  {t(`modules.${moduleName.toLowerCase()}.fullDescription`)}
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-foreground/10 mb-12" />

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-sm font-medium text-foreground uppercase tracking-[0.3em] mb-8">
                  {t("keyFeatures")}
                </h2>
                <ul className="space-y-4">
                  {features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex gap-3 text-foreground/40">
                      <Check className="w-4 h-4 text-foreground/30 mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-light leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-sm font-medium text-foreground uppercase tracking-[0.3em] mb-8">
                  {t("howToSetUp")}
                </h2>
                <div className="border border-border bg-background p-6">
                  <p className="text-foreground/40 text-sm font-light leading-relaxed mb-8">
                    {t(`modules.${moduleName.toLowerCase()}.setup`)}
                  </p>
                  <Link 
                    href={`/dashboard?module=${moduleName.toLowerCase()}`}
                    className="group inline-flex items-center px-6 py-3 bg-foreground text-background text-xs font-bold tracking-[0.3em] uppercase hover:bg-zinc-200 transition-colors"
                  >
                    {t("configureInDashboard")} <ExternalLink className="w-3 h-3 ml-3" />
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
