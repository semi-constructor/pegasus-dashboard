"use client";

import { motion } from"framer-motion";
import { Activity, AlertCircle } from"lucide-react";
import Link from"next/link";
import React from"react";

export function OverviewClientWrapper({ children }: { children: React.ReactNode }) {
 return (
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in"
 >
 {children}
 </motion.div>
 );
}

export function StatCard({ stat, i }: { stat: any, i: number }) {
 return (
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: i * 0.1, duration: 0.4 }}
 className="bg-card border border-border p-6 transition-all duration-300 shadow-sm hover:shadow-sm rounded-xl group"
 >
 <div className="flex items-center justify-between">
 <p className="text-sm font-bold text-muted-foreground uppercase group-hover:text-primary transition-colors tracking-widest">{stat.label}</p>
 <div className="p-2 border border-border bg-primary/10 rounded-md transform group-hover:scale-110 transition-transform">
 {stat.icon}
 </div>
 </div>
 <p className="text-4xl font-black text-primary mt-6 tracking-tighter">{stat.value}</p>
 </motion.div>
 );
}
