export interface BotFeature {
  id: string;
  title: string;
  description: string;
  mechanics: string;
}

export const botFeatures: BotFeature[] = [
  {
    id: "1",
    title: "Join to Create (JTC / J2C) System",
    description: "Covers dynamic voice channel management where users join a master base channel to instantly spawn their own temporary voice room.",
    mechanics: "Includes custom channel name formatting templates, automatic channel cleanup upon the last user leaving, and dedicated interactive UI management panels allowing room owners to lock/unlock rooms and set maximum user limits."
  },
  {
    id: "2",
    title: "AutoMod V2 & Quarantine Vault System",
    description: "Covers automated server security, proactive message scanning, and user isolation.",
    mechanics: "Supports flexible trigger conditions including Keyword Match, Regex Match, Mention Spam, and Attachment Spam thresholds. Action options include automatic message deletion, user warnings, temporary timeouts, or assigning infraction points. Includes a Quarantine Vault that automatically isolates suspicious accounts by stripping their original roles until manually reviewed and released by staff."
  },
  {
    id: "3",
    title: "Advanced Moderation & Warning Automation",
    description: "Covers comprehensive staff moderation workflows and automated penalty escalation.",
    mechanics: "Provides core staff execution commands (ban, unban, kick, mute, unmute, timeout, purge, channel lock, slowmode). Features an advanced warning engine with automated penalty triggers (e.g., automatically issuing a timeout or ban when a user reaches a specific warning count or severity level threshold). Supported by rich moderation history and audit logging."
  },
  {
    id: "4",
    title: "Comprehensive Economy & Marketplace System",
    description: "Covers a feature-rich server economy encouraging active member engagement.",
    mechanics: "Members earn currency through daily rewards, performing structured jobs (`work`), attempting robberies on peer accounts, and participating in gambling minigames (dice rolls, coin flips, slot machines). Includes a fully customizable server item shop where users can purchase, inspect, and consume inventory items."
  },
  {
    id: "5",
    title: "XP, Leveling & Engagement Gamification",
    description: "Covers member activity tracking, leveling progression, and peer recognition.",
    mechanics: "Tracks text activity and voice channel participation with configurable XP multipliers. Features customizable visual rank cards, paginated server leaderboards, automated role rewards at specific level milestones, engagement quests (daily message/voice goals), unlockable achievements, a prestige ranking system, and a peer reputation/thanks system."
  },
  {
    id: "6",
    title: "Ticket Support & Multi-Department Panels",
    description: "Covers professional user ticketing workflows and modular support management.",
    mechanics: "Operates via interactive support panels with options to define multiple specialized departments. Each department can be configured with dedicated staff support roles, custom welcome messages, and specific category channel routing. Staff management options include claiming, freezing, locking, and closing tickets with optional logged reasons."
  },
  {
    id: "7",
    title: "Automated Giveaways System",
    description: "Covers hosting, managing, and resolving server giveaways via advanced interactive modals.",
    mechanics: "Provides configuration options for custom prize descriptions, multi-winner selections, precise end durations, entry requirements (required roles, minimum XP level, minimum time in server), and bonus entry multipliers (for specific roles or server boosters). Supports immediate ending, winner rerolling, and automated post-giveaway winner announcements."
  },
  {
    id: "8",
    title: "Automated Word Filtering",
    description: "Covers proactive, automated content filtering across server text channels.",
    mechanics: "Filters messages using literal substring or regex pattern matching. Configuration options include case sensitivity, whole-word matching rules, severity classifications (Low, Medium, High, Critical), automatic message deletion, and dedicated alert notifications to designated staff log channels."
  },
  {
    id: "9",
    title: "Utility & Multi-Language System",
    description: "Covers general server utility, account diagnostics, and dynamic localization.",
    mechanics: "Includes comprehensive lookup tools for user profiles, server roles, full-size avatars, profile banners, Steam accounts, and websocket latency checks. Features a robust localization engine allowing individual users and servers to dynamically switch between multiple supported languages (`en`, `de`, `es`, `fr`)."
  },
  {
    id: "10",
    title: "Custom Rich Embeds & Reaction Roles",
    description: "Covers creating professional, visually stunning announcements and automated role management.",
    mechanics: "Empowers staff to construct custom rich embeds with configurable titles, descriptions, hex colors, clickable URLs, author fields, thumbnail/image attachments, and footers. Includes a reaction role system for automated role assignment/removal upon reacting to configured messages."
  },
  {
    id: "11",
    title: "REST API & Real-Time Monitoring Dashboard",
    description: "Covers a secure, built-in Express REST API server providing real-time data feeds, hardware diagnostics, and remote module management.",
    mechanics: "Exposes protected endpoints for live guild analytics, database query profiling, cache metrics, and direct module mutations. Secured via Bearer token authentication and optimized with multi-tier rate limiting, in-memory caching, and batch query aggregation to power external web dashboards."
  }
];
