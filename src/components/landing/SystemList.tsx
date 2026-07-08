'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/app/page.module.css';

type System = {
  id: string;
  title: string;
  description: string;
  mechanics: string;
};

const systemsData: System[] = [
  {
    id: "01",
    title: "Join to Create (JTC)",
    description: "Dynamic voice channel management. Users join a master base channel to instantly spawn their own temporary voice room.",
    mechanics: "Includes custom channel name formatting templates, automatic channel cleanup upon the last user leaving, and dedicated interactive UI management panels allowing room owners to lock/unlock rooms and set maximum user limits."
  },
  {
    id: "02",
    title: "AutoMod V2 & Quarantine",
    description: "Automated server security, proactive message scanning, and user isolation.",
    mechanics: "Supports Keyword Match, Regex Match, Mention/Attachment Spam thresholds. Actions include deletion, warnings, timeouts. Quarantine Vault isolates suspicious accounts by stripping roles until manually reviewed."
  },
  {
    id: "03",
    title: "Advanced Moderation",
    description: "Comprehensive staff moderation workflows and automated penalty escalation.",
    mechanics: "Provides core staff commands (ban, kick, mute, purge, slowmode). Advanced warning engine with automated penalty triggers based on warning count/severity. Supported by rich audit logging."
  },
  {
    id: "04",
    title: "Economy & Marketplace",
    description: "A feature-rich server economy encouraging active member engagement.",
    mechanics: "Earn currency through daily rewards, jobs, robberies, and gambling (dice, coin flips, slots). Fully customizable server item shop for users to purchase, inspect, and consume inventory items."
  },
  {
    id: "05",
    title: "XP & Engagement",
    description: "Member activity tracking, leveling progression, and peer recognition.",
    mechanics: "Tracks text/voice participation with multipliers. Features visual rank cards, leaderboards, automated role rewards, daily quests, unlockable achievements, prestige ranking, and peer reputation systems."
  },
  {
    id: "06",
    title: "Ticket Support",
    description: "Professional user ticketing workflows and modular support management.",
    mechanics: "Interactive panels with specialized departments. Configure staff roles, welcome messages, and category routing. Staff can claim, freeze, lock, and close tickets with logged reasons."
  },
  {
    id: "07",
    title: "Automated Giveaways",
    description: "Hosting, managing, and resolving server giveaways via advanced interactive modals.",
    mechanics: "Custom prize descriptions, multi-winner selections, entry requirements (roles, minimum XP/time), bonus entry multipliers. Supports immediate ending, rerolling, and post-giveaway announcements."
  },
  {
    id: "08",
    title: "Automated Word Filtering",
    description: "Proactive, automated content filtering across server text channels.",
    mechanics: "Literal substring or regex matching. Configurable case sensitivity, whole-word rules, severity classifications. Automatic message deletion and designated staff log channel alerts."
  },
  {
    id: "09",
    title: "Utility & Multi-Language",
    description: "General server utility, account diagnostics, and dynamic localization.",
    mechanics: "Lookup tools for profiles, roles, avatars, banners, Steam accounts, and websocket latency. Robust localization engine allowing users/servers to switch languages (en, de, es, fr)."
  },
  {
    id: "10",
    title: "Rich Embeds & Reaction Roles",
    description: "Professional announcements and automated role management.",
    mechanics: "Construct custom rich embeds with configurable titles, hex colors, URLs, images. Reaction role system for automated role assignment/removal upon reacting to messages."
  },
  {
    id: "11",
    title: "REST API & Dashboard",
    description: "Built-in Express REST API server providing real-time data feeds and diagnostics.",
    mechanics: "Protected endpoints for live guild analytics, database query profiling, cache metrics. Secured via Bearer token authentication, rate limiting, and in-memory caching."
  }
];

export default function SystemList() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className={styles.systems}>
      <h2 className={styles.systemsHeader}>CORE SYSTEMS</h2>
      <div>
        {systemsData.map((system, index) => {
          const isActive = activeIndex === index;
          return (
            <div 
              key={system.id} 
              className={styles.systemItem}
              onClick={() => setActiveIndex(isActive ? null : index)}
            >
              <div className={styles.systemHeader}>
                <span className={styles.systemIndex}>{system.id}</span>
                <h3 className={styles.systemTitle}>{system.title}</h3>
              </div>
              
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: 'auto', 
                      opacity: 1,
                      transition: { 
                        height: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.4, delay: 0.1 }
                      }
                    }}
                    exit={{ 
                      height: 0, 
                      opacity: 0,
                      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                    }}
                    className={styles.systemBody}
                  >
                    <div className={styles.systemContent}>
                      <p className={styles.systemDesc}>{system.description}</p>
                      <div className={styles.systemMechanics}>
                        <span className={styles.mechanicsLabel}>OPTIONS_&_MECHANICS</span>
                        <p>{system.mechanics}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
