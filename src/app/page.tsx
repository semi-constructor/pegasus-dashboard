"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MarketingLayout } from "@/components/MarketingLayout";
import { LandingFeatures } from "@/components/LandingFeatures";

const Hero = () => {
  return (
    <section 
      aria-labelledby="hero-heading" 
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-background -z-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10 opacity-60 animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10" />

      <div className="container px-4 md:px-6 mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8 backdrop-blur-md shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" aria-hidden="true"></span>
          Pegasus v2.0 is now live
        </motion.div>
        
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 mb-6 leading-tight"
        >
          Open-Source <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
            Discord Bot
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Pegasus is a free, open-source Discord bot for moderation, economy, and community tools. Nine systems. No paywall.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link href="/dashboard" className="w-full sm:w-auto" tabIndex={-1}>
            <Button size="lg" className="w-full text-base group rounded-xl shadow-lg hover:shadow-primary/25 transition-all focus-visible:ring-2 focus-visible:ring-primary">
              Open Dashboard
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
          </Link>
          <Link 
            href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=872320742191095&integration_type=0&scope=bot+applications.commands`} 
            target="_blank" 
            rel="noopener noreferrer"
            tabIndex={-1}
          >
            <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base rounded-xl border border-border hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-primary">
              <Shield className="w-5 h-5 mr-2" aria-hidden="true" />
              Invite to Server
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <MarketingLayout>
      <Hero />
      <LandingFeatures />
    </MarketingLayout>
  );
}
