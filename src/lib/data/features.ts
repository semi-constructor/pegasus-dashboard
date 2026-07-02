export const features = [
  {
    id: "jtc",
    title: "Join to Create (JTC) System",
    description: "Dynamic voice channel management where users join a master base channel to instantly spawn their own temporary voice room.",
    mechanics: "Includes custom channel name formatting templates, automatic channel cleanup upon the last user leaving, and dedicated interactive UI management panels allowing room owners to lock/unlock rooms and set maximum user limits.",
    icon: "headset"
  },
  {
    id: "automod",
    title: "AutoMod V2 & Quarantine Vault",
    description: "Automated server security, proactive message scanning, and user isolation.",
    mechanics: "Supports flexible trigger conditions including Keyword Match, Regex Match, Mention Spam, and Attachment Spam thresholds. Action options include automatic message deletion, user warnings, temporary timeouts, or assigning infraction points. Includes a Quarantine Vault that automatically isolates suspicious accounts by stripping their original roles until manually reviewed and released by staff.",
    icon: "shield"
  },
  {
    id: "moderation",
    title: "Advanced Moderation & Warning Automation",
    description: "Comprehensive staff moderation workflows and automated penalty escalation.",
    mechanics: "Provides core staff execution commands (ban, kick, mute, timeout, purge, lock, slowmode). Features an advanced warning engine with automated penalty triggers. Supported by rich moderation history and audit logging.",
    icon: "gavel"
  },
  {
    id: "economy",
    title: "Economy & Marketplace System",
    description: "Feature-rich server economy encouraging active member engagement.",
    mechanics: "Members earn currency through daily rewards, performing structured jobs, attempting robberies on peer accounts, and participating in gambling minigames. Includes a fully customizable server item shop where users can purchase, inspect, and consume inventory items.",
    icon: "coins"
  },
  {
    id: "xp",
    title: "XP, Leveling & Engagement Gamification",
    description: "Member activity tracking, leveling progression, and peer recognition.",
    mechanics: "Tracks text activity and voice channel participation with configurable XP multipliers. Features customizable visual rank cards, paginated server leaderboards, automated role rewards at specific level milestones, engagement quests, unlockable achievements, a prestige ranking system, and a peer reputation/thanks system.",
    icon: "trending-up"
  },
  {
    id: "tickets",
    title: "Ticket Support & Multi-Department Panels",
    description: "Professional user ticketing workflows and modular support management.",
    mechanics: "Operates via interactive support panels with options to define multiple specialized departments. Each department can be configured with dedicated staff support roles, custom welcome messages, and specific category channel routing. Staff management options include claiming, freezing, locking, and closing tickets with optional logged reasons.",
    icon: "ticket"
  },
  {
    id: "giveaways",
    title: "Automated Giveaways System",
    description: "Hosting, managing, and resolving server giveaways via advanced interactive modals.",
    mechanics: "Provides configuration options for custom prize descriptions, multi-winner selections, precise end durations, entry requirements, and bonus entry multipliers. Supports immediate ending, winner rerolling, and automated post-giveaway winner announcements.",
    icon: "gift"
  },
  {
    id: "filter",
    title: "Automated Word Filtering",
    description: "Proactive, automated content filtering across server text channels.",
    mechanics: "Filters messages using literal substring or regex pattern matching. Configuration options include case sensitivity, whole-word matching rules, severity classifications, automatic message deletion, and dedicated alert notifications to designated staff log channels.",
    icon: "message-square-off"
  },
  {
    id: "utility",
    title: "Utility & Multi-Language System",
    description: "General server utility, account diagnostics, and dynamic localization.",
    mechanics: "Includes comprehensive lookup tools for user profiles, server roles, full-size avatars, profile banners, Steam accounts, and websocket latency checks. Features a robust localization engine allowing individual users and servers to dynamically switch between multiple supported languages.",
    icon: "globe"
  },
  {
    id: "embeds",
    title: "Custom Rich Embeds & Reaction Roles",
    description: "Creating professional, visually stunning announcements and automated role management.",
    mechanics: "Empowers staff to construct custom rich embeds with configurable titles, descriptions, hex colors, clickable URLs, author fields, thumbnail/image attachments, and footers. Includes a reaction role system for automated role assignment/removal.",
    icon: "layout-template"
  },
  {
    id: "api",
    title: "REST API & Real-Time Monitoring",
    description: "Secure, built-in Express REST API server providing real-time data feeds.",
    mechanics: "Exposes protected endpoints for live guild analytics, database query profiling, cache metrics, and direct module mutations. Secured via Bearer token authentication and optimized with multi-tier rate limiting, in-memory caching, and batch query aggregation to power external web dashboards.",
    icon: "activity"
  }
];
