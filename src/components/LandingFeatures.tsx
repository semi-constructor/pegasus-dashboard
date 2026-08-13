"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { GlassVisual } from "./GlassShapes";

interface FeatureSectionProps {
  title: string;
  description: string;
  features: { title: string; desc: string }[];
  visual: React.ReactNode;
  reverse?: boolean;
  moduleLink?: string;
  moduleLinkText?: string;
  index: number;
}

const FeatureSection = ({ title, description, features, visual, reverse, moduleLink, moduleLinkText, index }: FeatureSectionProps) => {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const yGlass = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const opacityElement = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={containerRef}
      className="py-32 md:py-56 relative bg-background border-t border-border/[0.05] overflow-hidden"
    >
      {/* Floating Glass Element placed outside the image in the background */}
      <motion.div 
        style={{ y: yGlass, opacity: opacityElement }}
        className={`absolute top-1/2 -translate-y-1/2 ${reverse ? '-left-32 md:left-0' : '-right-32 md:right-0'} w-[600px] h-[600px] md:w-[800px] md:h-[800px] pointer-events-none z-0`}
      >
        <GlassVisual index={index} />
      </motion.div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className={`grid lg:grid-cols-2 gap-16 lg:gap-32 items-center`}>
          <motion.div 
            style={{ y: yText, opacity: opacityElement }}
            className={`flex flex-col space-y-12 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}
          >
            <div>
              <div className="text-foreground/30 text-sm tracking-widest uppercase mb-4">
                0{index + 1} // Module
              </div>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground mb-6 leading-[0.9]">
                {title}
              </h2>
              <p className="text-xl md:text-2xl text-foreground/50 font-light leading-relaxed max-w-xl">
                {description}
              </p>
            </div>
            
            <div className="flex flex-col gap-8">
              {features.map((f, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium text-foreground tracking-tight uppercase">
                    {f.title}
                  </h3>
                  <p className="text-base text-foreground/40 font-light leading-relaxed max-w-md">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
            
            {moduleLink && moduleLinkText && (
              <div className="pt-8 border-t border-border mt-8">
                <Link href={moduleLink} className="group flex items-center text-foreground/70 hover:text-foreground transition-colors text-sm uppercase tracking-widest font-medium">
                  {moduleLinkText}
                  <ArrowRight className="w-4 h-4 ml-3 opacity-50 group-hover:translate-x-2 transition-all duration-300 group-hover:opacity-100" />
                </Link>
              </div>
            )}
          </motion.div>
          
          <motion.div 
            style={{ opacity: opacityElement }}
            className={`relative ${reverse ? 'lg:order-1' : 'lg:order-2'} z-20 h-full w-full flex items-center justify-center`}
          >
            {visual}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const DashboardScreenshot = ({ src, alt }: { src: string, alt: string }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Default to dark during SSR to avoid hydration mismatch flashes for most users
  const theme = mounted ? (resolvedTheme === 'light' ? 'light' : 'dark') : 'dark';
  
  const ext = src.substring(src.lastIndexOf('.'));
  const base = src.substring(0, src.lastIndexOf('.'));
  const themedSrc = `${base}-${theme}${ext}?v=2`;

  return (
    <div className="w-full relative border border-border bg-background p-2 overflow-hidden mx-auto group z-20">
      <div className="p-0 relative bg-background aspect-[16/10]">
        <Image 
          src={themedSrc} 
          alt={alt} 
          fill
          className="object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-1000 filter contrast-125 saturate-50 grayscale-[20%] brightness-[0.85] group-hover:grayscale-0 z-0"
          loading="lazy"
          quality={100}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-100 z-10" />
      </div>
    </div>
  );
};

export function LandingFeatures() {
  const t = useTranslations('features');
  const tCommon = useTranslations('common');

  return (
    <div className="flex flex-col w-full bg-[#030303]" id="features">
      
      {/* 1. Moderation */}
      <FeatureSection
        index={0}
        title={t('moderation.title')}
        description={t('moderation.description')}
        moduleLink="/module/automod"
        moduleLinkText={tCommon('learnMore')}
        features={[
          { title: t('moderation.automod.title'), desc: t('moderation.automod.desc') },
          { title: t('moderation.warning.title'), desc: t('moderation.warning.desc') },
          { title: t('moderation.auditing.title'), desc: t('moderation.auditing.desc') }
        ]}
        visual={<DashboardScreenshot src="/screenshots/warns/list-warns.png" alt="Moderation Dashboard" />}
      />

      {/* 2. Economy & XP */}
      <FeatureSection
        index={1}
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
        visual={<DashboardScreenshot src="/screenshots/economy/transactions.png" alt="Economy Dashboard" />}
      />

      {/* 3. Tickets */}
      <FeatureSection
        index={2}
        title={t('tickets.title')}
        description={t('tickets.description')}
        moduleLink="/module/tickets"
        moduleLinkText={tCommon('learnMore')}
        features={[
          { title: t('tickets.multiDepartment.title'), desc: t('tickets.multiDepartment.desc') },
          { title: t('tickets.staffTooling.title'), desc: t('tickets.staffTooling.desc') },
          { title: t('tickets.webTranscripts.title'), desc: t('tickets.webTranscripts.desc') }
        ]}
        visual={<DashboardScreenshot src="/screenshots/tickets/ticketboard.png" alt="Tickets Dashboard" />}
      />

      {/* 4. Giveaways */}
      <FeatureSection
        index={3}
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
        visual={<DashboardScreenshot src="/screenshots/giveaways/gws.png" alt="Giveaways Dashboard" />}
      />


      {/* 5. Infrastructure (Join-to-Create) */}
      <FeatureSection
        index={4}
        title={t('infrastructure.title')}
        description={t('infrastructure.description')}
        moduleLink="/module/jtc"
        moduleLinkText={tCommon('learnMore')}
        features={[
          { title: t('infrastructure.dynamicVoice.title'), desc: t('infrastructure.dynamicVoice.desc') },
          { title: t('infrastructure.autoCleanup.title'), desc: t('infrastructure.autoCleanup.desc') },
          { title: t('infrastructure.ownerControls.title'), desc: t('infrastructure.ownerControls.desc') }
        ]}
        visual={<DashboardScreenshot src="/screenshots/jtc/jtc.png" alt="Infrastructure Dashboard" />}
      />

      {/* 6. Engagement & Tracking */}
      <FeatureSection
        index={5}
        title={t('engagement.title')}
        description={t('engagement.description')}
        reverse={true}
        moduleLink="/module/engagement"
        moduleLinkText={tCommon('learnMore')}
        features={[
          { title: t('engagement.voiceTracking.title'), desc: t('engagement.voiceTracking.desc') },
          { title: t('engagement.messageTracking.title'), desc: t('engagement.messageTracking.desc') },
          { title: t('engagement.rewards.title'), desc: t('engagement.rewards.desc') }
        ]}
        visual={<DashboardScreenshot src="/screenshots/engagement/social-feed.png" alt="Engagement Dashboard" />}
      />

      {/* 7. Custom Commands */}
      <FeatureSection
        index={6}
        title={t('customCommands.title')}
        description={t('customCommands.description')}
        moduleLink="/module/custom-commands"
        moduleLinkText={tCommon('learnMore')}
        features={[
          { title: t('customCommands.autoResponders.title'), desc: t('customCommands.autoResponders.desc') },
          { title: t('customCommands.variables.title'), desc: t('customCommands.variables.desc', { user: '{user}', server: '{server}' }) },
          { title: t('customCommands.embeds.title'), desc: t('customCommands.embeds.desc') }
        ]}
        visual={<DashboardScreenshot src="/screenshots/custom-commands/custom-commands.png" alt="Custom Commands Dashboard" />}
      />

      {/* 8. Role Management */}
      <FeatureSection
        index={7}
        title={t('roles.title')}
        description={t('roles.description')}
        reverse={true}
        moduleLink="/module/roles"
        moduleLinkText={tCommon('learnMore')}
        features={[
          { title: t('roles.reactionRoles.title'), desc: t('roles.reactionRoles.desc') },
          { title: t('roles.stickyRoles.title'), desc: t('roles.stickyRoles.desc') },
          { title: t('roles.temporaryRoles.title'), desc: t('roles.temporaryRoles.desc') }
        ]}
        visual={<DashboardScreenshot src="/screenshots/reaction-roles/example-config.png" alt="Role Management Dashboard" />}
      />

    </div>
  );
}
