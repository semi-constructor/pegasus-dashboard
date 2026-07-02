export const commands = [
  {
    category: "Admin",
    description: "Administrative commands for managing bot security, modules, blacklists, and server pruning.",
    items: [
      { name: "/auditlog", description: "View security audit logs for the server.", options: "view [user] [action_type] [limit]" },
      { name: "/blacklist", description: "Manage the bot's global user blacklist.", options: "add <user> [reason] | remove <user> | check <user>" },
      { name: "/module", description: "Enable or disable specific bot modules dynamically.", options: "enable <module> | disable <module> | status" },
      { name: "/prune", description: "Prune inactive members from the server.", options: "<days> [dry_run] [roles] [reason]" }
    ]
  },
  {
    category: "Configuration",
    description: "Configure server-specific settings, custom embeds, and reaction roles.",
    items: [
      { name: "/config", description: "Manage server configuration settings.", options: "view | set <setting> <value>" },
      { name: "/embed", description: "Create and send fully customizable rich embeds.", options: "create <channel> <title> <description> [color] [url] [image] ..." },
      { name: "/reactionrole", description: "Manage reaction-based role assignment.", options: "add <message_id> <emoji> <role> | remove | list" }
    ]
  },
  {
    category: "Economy",
    description: "Engage users with a feature-rich economy system, including daily rewards, jobs, gambling, and a server item shop.",
    items: [
      { name: "/eco balance", description: "View current coin balance.", options: "[user]" },
      { name: "/eco daily", description: "Claim your daily coin reward.", options: "" },
      { name: "/eco work", description: "Perform a job to earn coins.", options: "" },
      { name: "/eco rob", description: "Attempt to steal coins from another user.", options: "<user>" },
      { name: "/eco gamble", description: "Gamble coins via dice, flip, or slots.", options: "dice <amount> | flip <amount> <choice> | slots <amount>" },
      { name: "/eco shop", description: "Interact with the server item shop.", options: "list | buy <item_id> | info <item_id> | use <item_id> | inventory" }
    ]
  },
  {
    category: "Fun",
    description: "Interactive entertainment commands for server members.",
    items: [
      { name: "/fun meme", description: "Fetch a random popular meme.", options: "" },
      { name: "/fun fact", description: "Receive a random interesting fact.", options: "" },
      { name: "/fun quote", description: "Receive a random inspiring quote.", options: "" },
      { name: "/fun joke", description: "Get a general random joke.", options: "" },
      { name: "/fun dadjoke", description: "Get a classic dad joke.", options: "" }
    ]
  },
  {
    category: "Giveaways",
    description: "Easily host, configure, and manage server giveaways.",
    items: [
      { name: "/gw start", description: "Start a giveaway with an advanced interactive modal.", options: "<prize> <duration> [winners] [channel] [embed_title] ..." },
      { name: "/gw simple", description: "Quickly start a simple giveaway directly.", options: "<prize> <duration> <winners> ..." },
      { name: "/gw end", description: "Immediately end an active giveaway.", options: "<giveaway_id>" },
      { name: "/gw reroll", description: "Reroll winners for a finished giveaway.", options: "<giveaway_id> [winners]" },
      { name: "/gw configure", description: "Open the configuration modal for an existing giveaway.", options: "<giveaway_id> ..." }
    ]
  },
  {
    category: "Moderation & AutoMod",
    description: "Powerful moderation capabilities, AutoMod V2 rules, Quarantine Vault, word filtering, and warnings.",
    items: [
      { name: "/automod", description: "Manage AutoMod V2 rules and Quarantine Vault.", options: "add_rule <name> <trigger> <action> | list_rules | remove_rule | quarantine_list | quarantine_release" },
      { name: "/filter", description: "Manage automated word filtering rules.", options: "add <pattern> [type] [severity] | remove <rule_id> | list" },
      { name: "/moderation", description: "Core staff moderation commands.", options: "ban <user> | kick <user> | timeout <user> <duration> | mute <user> | purge <amount> | lock | slowmode ..." },
      { name: "/warn", description: "Advanced warning management and automated penalty triggers.", options: "create <user> <title> | edit | lookup | delete | view | purge | automation" }
    ]
  },
  {
    category: "Tickets",
    description: "Manage ticket panels, multi-department support setups, and active ticket workflows.",
    items: [
      { name: "/ticket claim", description: "Claim an active ticket.", options: "" },
      { name: "/ticket close", description: "Close an active ticket.", options: "[reason]" },
      { name: "/ticket stats", description: "View ticket system statistics.", options: "" },
      { name: "/ticket panel", description: "Manage ticket panel configurations.", options: "create <id> <title> <desc> | load <id> <channel> | delete | list | edit | add_dept | list_depts | remove_dept" }
    ]
  },
  {
    category: "Utility",
    description: "General server utility, Join-to-Create voice management, localization, and lookups.",
    items: [
      { name: "/jtc", description: "Manage Join-to-Create (J2C) voice channels.", options: "setup <base_voice> <category> <panel> | disable | panel" },
      { name: "/language", description: "Manage multi-language preferences.", options: "available | current | set <language>" },
      { name: "/ping", description: "Check bot latency.", options: "" },
      { name: "/utils", description: "Comprehensive lookup tools.", options: "avatar | banner | steam <username> | userinfo | whois <id> | roleinfo | serverinfo | help | support | stats" }
    ]
  },
  {
    category: "XP & Engagement",
    description: "Gamification features, leveling, quests, achievements, and peer recognition.",
    items: [
      { name: "/achievements", description: "View your unlocked achievements.", options: "" },
      { name: "/prestige", description: "Trade in your max level to gain a prestige rank.", options: "" },
      { name: "/quests", description: "View active engagement quests and track progress.", options: "" },
      { name: "/thanks", description: "Give thanks and reputation points to another user.", options: "<user> [reason]" },
      { name: "/xp", description: "Check levels, leaderboards, and rank cards.", options: "rank [user] | leaderboard [page] | configuration | card" }
    ]
  }
];
