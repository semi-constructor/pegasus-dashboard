"use client";

import React from "react";
import { motion } from "framer-motion";

interface GlassVisualFallbackProps {
  index: number;
}

const FALLBACK_CONFIGS = [
  {
    // 0. Warning Sign
    color: "#ff3333",
    glowClass: "from-red-500/20 via-orange-500/10 to-transparent",
    borderClass: "border-red-500/30",
    badge: "MODERATION",
    icon: (
      <svg className="w-24 h-24 text-red-400 drop-shadow-[0_0_15px_rgba(255,51,51,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    // 1. Coin / Economy
    color: "#00ff66",
    glowClass: "from-emerald-500/20 via-green-500/10 to-transparent",
    borderClass: "border-emerald-500/30",
    badge: "ECONOMY",
    icon: (
      <svg className="w-24 h-24 text-emerald-400 drop-shadow-[0_0_15px_rgba(0,255,102,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v12M15 9.5a2.5 2.5 0 0 0-5 0c0 1.5 1.5 2 2.5 2.5s2.5 1 2.5 2.5a2.5 2.5 0 0 1-5 0" />
      </svg>
    ),
  },
  {
    // 2. Ticket
    color: "#a020f0",
    glowClass: "from-purple-500/20 via-violet-500/10 to-transparent",
    borderClass: "border-purple-500/30",
    badge: "TICKETS",
    icon: (
      <svg className="w-24 h-24 text-purple-400 drop-shadow-[0_0_15px_rgba(160,32,240,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
        <path d="M13 5v2M13 11v2M13 17v2" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    // 3. Gift
    color: "#0088ff",
    glowClass: "from-blue-500/20 via-sky-500/10 to-transparent",
    borderClass: "border-blue-500/30",
    badge: "GIVEAWAYS",
    icon: (
      <svg className="w-24 h-24 text-blue-400 drop-shadow-[0_0_15px_rgba(0,136,255,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
  },
  {
    // 4. Server Element
    color: "#ffff00",
    glowClass: "from-amber-500/20 via-yellow-500/10 to-transparent",
    borderClass: "border-amber-500/30",
    badge: "INFRASTRUCTURE",
    icon: (
      <svg className="w-24 h-24 text-amber-400 drop-shadow-[0_0_15px_rgba(255,255,0,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
  },
  {
    // 5. Smiley Face / Engagement
    color: "#ffffff",
    glowClass: "from-white/20 via-slate-300/10 to-transparent",
    borderClass: "border-border/30",
    badge: "ENGAGEMENT",
    icon: (
      <svg className="w-24 h-24 text-foreground drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    // 6. Code
    color: "#00f0ff",
    glowClass: "from-cyan-500/20 via-teal-500/10 to-transparent",
    borderClass: "border-cyan-500/30",
    badge: "CUSTOM COMMANDS",
    icon: (
      <svg className="w-24 h-24 text-cyan-400 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    // 7. Member Icon
    color: "#ff00ff",
    glowClass: "from-pink-500/20 via-fuchsia-500/10 to-transparent",
    borderClass: "border-pink-500/30",
    badge: "ROLES",
    icon: (
      <svg className="w-24 h-24 text-pink-400 drop-shadow-[0_0_15px_rgba(255,0,255,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export function GlassVisualFallback({ index }: GlassVisualFallbackProps) {
  const config = FALLBACK_CONFIGS[index % FALLBACK_CONFIGS.length];

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
      {/* Background ambient radial glow matching component color */}
      <div
        className={`absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-tr ${config.glowClass} blur-3xl opacity-40`}
      />

      {/* Floating glass container mimicking 3D float motion */}
      <motion.div
        animate={{
          y: [-8, 8, -8],
          rotate: [-1, 1, -1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`relative w-64 h-64 md:w-80 md:h-80 rounded-3xl bg-foreground/[0.03] backdrop-blur-xl border ${config.borderClass} shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex flex-col items-center justify-center p-8 overflow-hidden`}
      >
        {/* Specular glare reflection across the glass surface */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-full blur-lg pointer-events-none" />

        {/* Content inside static glass shape */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-4">
          <div className="p-4 rounded-2xl bg-background/40 border border-border backdrop-blur-md">
            {config.icon}
          </div>
          <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-foreground/50 bg-background/60 px-3 py-1 rounded-full border border-border">
            {config.badge}
          </span>
        </div>

        {/* Subtle glass edge highlight */}
        <div className="absolute inset-0 rounded-3xl border border-border pointer-events-none" />
      </motion.div>
    </div>
  );
}
