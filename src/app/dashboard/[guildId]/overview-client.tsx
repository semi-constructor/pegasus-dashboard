"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowRight, Server } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OverviewClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8"
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
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <Card className="relative h-full bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 overflow-hidden shadow-2xl shadow-black/20 group-hover:border-white/20">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 transform origin-top-right">
          {React.cloneElement(stat.icon, { className: "w-24 h-24 text-white" })}
        </div>
        <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-white/50 uppercase tracking-widest">{stat.label}</p>
          </div>
          <p className="text-4xl md:text-5xl font-black text-white tracking-tight mt-auto drop-shadow-md">
            {stat.value}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ModulesCard({ modules, guildId }: { modules: any[], guildId: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="lg:col-span-2"
    >
      <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-2xl shadow-black/20 overflow-hidden">
        <CardHeader className="border-b border-white/5 pb-6 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10 text-white/80">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Module Status</CardTitle>
              <CardDescription className="text-white/50">Overview of currently enabled and disabled features.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((mod, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.05) }}
                key={i} 
                className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  {mod.enabled ? (
                    <CheckCircle2 className="w-5 h-5 text-white/80 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500/80 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]" />
                  )}
                  <span className="font-semibold text-white/90">{mod.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={mod.enabled ? "default" : "secondary"} className={mod.enabled ? "bg-white/20 text-white hover:bg-white/30 border-white/20" : "bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20"}>
                    {mod.enabled ? "Active" : "Disabled"}
                  </Badge>
                  <Link href={`/dashboard/${guildId}/${mod.path}`}>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
