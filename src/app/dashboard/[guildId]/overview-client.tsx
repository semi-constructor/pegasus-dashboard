"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowRight, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

export function OverviewClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="p-1 sm:p-4 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8"
    >
      {children}
    </motion.div>
  );
}

export function StatCard({ stat, i }: { stat: any, i: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative group h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-foreground/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <Card className="relative h-full bg-foreground/5 border-border backdrop-blur-md hover:bg-foreground/10 transition-all duration-300 overflow-hidden shadow-2xl shadow-black/20 group-hover:border-border">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 transform origin-top-right">
          {React.cloneElement(stat.icon, { className: "w-16 h-16 sm:w-24 sm:h-24 text-foreground" })}
        </div>
        <CardContent className="p-4 sm:p-6 relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">{stat.label}</p>
          </div>
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight mt-auto drop-shadow-md">
            {stat.value}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ModulesCard({ modules, guildId }: { modules: any[], guildId: string }) {
  const t = useTranslations('guild');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="lg:col-span-2"
    >
      <Card className="bg-foreground/5 border-border backdrop-blur-md shadow-2xl shadow-black/20 overflow-hidden">
        <CardHeader className="border-b border-border pb-4 sm:pb-6 bg-foreground/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-foreground/10 text-foreground/80 shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl font-bold text-foreground">{t('moduleStatus')}</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-foreground/50">{t('moduleStatusDesc')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {modules.map((mod, i) => (
              <Link href={`/dashboard/${guildId}/${mod.path}`} key={i} className="block">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.05) }}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-background/20 border border-border hover:bg-foreground/5 hover:cursor-pointer transition-colors group gap-2 h-full"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    {mod.enabled ? (
                      <CheckCircle2 className="w-5 h-5 text-foreground/80 shrink-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500/80 shrink-0 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]" />
                    )}
                    <span className="font-semibold text-foreground/90 text-sm sm:text-base truncate">{mod.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={mod.enabled ? "default" : "secondary"} className={mod.enabled ? "bg-foreground/20 text-foreground hover:bg-foreground/30 border-border text-xs px-2 py-0.5" : "bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20 text-xs px-2 py-0.5"}>
                      {mod.enabled ? t('active') : t('disabled')}
                    </Badge>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-foreground/70 sm:text-foreground/50 hover:text-foreground hover:bg-foreground/10 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all sm:-translate-x-2 sm:group-hover:translate-x-0" asChild>
                      <span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
