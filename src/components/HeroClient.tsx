"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThreeBackground } from "./ThreeBackground";

export const HeroClient = ({ stats }: { stats: { users: number, guilds: number, shards: number } }) => {
  const t = useTranslations('landing');
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[150vh] flex flex-col items-center pt-48 bg-black overflow-hidden"
    >
      <ThreeBackground />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.06] mix-blend-overlay pointer-events-none" />

      <div className="container px-6 mx-auto relative z-10 flex flex-col items-center">
        
        <motion.div 
          style={{ y: yText, opacity: opacityText }}
          className="text-center w-full max-w-5xl mx-auto flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="px-4 py-1.5 border border-white/10 rounded-full text-xs tracking-widest uppercase text-white/50 mb-12"
          >
            {t('badge')}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl font-medium tracking-tighter text-white leading-[0.9] mb-8"
          >
            {t('heroTitle1')}
            <br />
            <span className="text-white/40">{t('heroTitle2')}</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto mb-16 tracking-tight font-light"
          >
            {t('heroDescription')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-6 w-full justify-center"
          >
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-14 px-10 rounded-none bg-white text-black hover:bg-white/90 text-sm tracking-wider uppercase font-medium transition-all">
                {t('openDashboard')}
              </Button>
            </Link>
            <Link href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=872320742191095&integration_type=0&scope=bot+applications.commands`} target="_blank" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-14 px-10 rounded-none border-white/20 text-white bg-transparent hover:bg-white/5 text-sm tracking-wider uppercase font-medium transition-all">
                {t('inviteToServer')}
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
           style={{ scale: scaleImage, y: yImage }}
           initial={{ opacity: 0, y: 100 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="w-full max-w-[1400px] mt-32 relative z-30"
        >
          <div className="relative border border-white/10 bg-black p-2">
            <Image 
              src="/screenshots/overview/overview.png" 
              alt="Pegasus Dashboard Overview" 
              width={1920} 
              height={1080} 
              className="w-full h-auto object-cover opacity-90 filter contrast-125 saturate-50"
              priority
              quality={100}
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};
