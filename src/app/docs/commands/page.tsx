"use client";

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Terminal, 
  Shield, 
  Settings, 
  Coins, 
  Sparkles, 
  Gift, 
  Gavel, 
  Ticket as TicketIcon, 
  Wrench, 
  Award,
  Hash
} from 'lucide-react';

interface CommandOption {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Command {
  name: string;
  description: string;
  subcommandGroup?: string;
  options: CommandOption[];
  permissions: string;
}

interface CommandCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
  commands: Command[];
}

const COMMAND_CATEGORIES: CommandCategory[] = [
  {
    id: 'admin',
    name: 'Admin',
    icon: Shield,
    description: 'Administrative commands for managing bot security, modules, blacklists, and server pruning.',
    commands: [
      {
        name: '/auditlog view',
        description: 'View security audit logs for the server.',
        permissions: 'Admin / Server Manager',
        options: [
          { name: 'user', type: 'User', required: false, description: 'Filter logs by a specific user.' },
          { name: 'action_type', type: 'String', required: false, description: 'Filter logs by action type (e.g., BAN, KICK, TIMEOUT).' },
          { name: 'limit', type: 'Integer', required: false, description: 'Number of logs to fetch (1-50, default: 10).' }
        ]
      },
      {
        name: '/blacklist add',
        description: "Add a user to the bot's global blacklist (prevents command usage).",
        permissions: 'Bot Admin / Owner',
        options: [
          { name: 'user', type: 'User', required: true, description: 'The user to blacklist.' },
          { name: 'reason', type: 'String', required: false, description: 'Reason for blacklisting.' }
        ]
      },
      {
        name: '/blacklist remove',
        description: 'Remove a user from the global blacklist.',
        permissions: 'Bot Admin / Owner',
        options: [
          { name: 'user', type: 'User', required: true, description: 'The user to unblacklist.' },
          { name: 'reason', type: 'String', required: false, description: 'Reason for removal.' }
        ]
      },
      {
        name: '/blacklist check',
        description: 'Check if a user is currently blacklisted.',
        permissions: 'Bot Admin / Owner',
        options: [
          { name: 'user', type: 'User', required: true, description: 'The user to check.' }
        ]
      },
      {
        name: '/module enable',
        description: 'Enable a specific bot module dynamically per server.',
        permissions: 'Server Admin',
        options: [
          { name: 'module', type: 'String', required: true, description: 'Choices: economy, tickets, fun, moderation, xp, giveaways, jtc, automod.' }
        ]
      },
      {
        name: '/module disable',
        description: 'Disable a specific bot module dynamically per server.',
        permissions: 'Server Admin',
        options: [
          { name: 'module', type: 'String', required: true, description: 'Choices: economy, tickets, fun, moderation, xp, giveaways, jtc, automod.' }
        ]
      },
      {
        name: '/module status',
        description: 'View the active/inactive status of all modules in the server.',
        permissions: 'Server Admin',
        options: []
      },
      {
        name: '/prune',
        description: 'Prune inactive members from the server.',
        permissions: 'Server Admin / Manage Server',
        options: [
          { name: 'days', type: 'Integer', required: true, description: 'Number of days of inactivity (1-30).' },
          { name: 'dry_run', type: 'Boolean', required: false, description: 'If true, simulates the prune and returns count without kicking.' },
          { name: 'roles', type: 'Role', required: false, description: 'Only prune members with this specific role.' },
          { name: 'reason', type: 'String', required: false, description: 'Audit log reason for the prune.' }
        ]
      }
    ]
  },
  {
    id: 'config',
    name: 'Configuration',
    icon: Settings,
    description: 'Configure server-specific settings, custom embeds, and reaction roles.',
    commands: [
      {
        name: '/config view',
        description: 'View all current server configurations.',
        permissions: 'Manage Server',
        options: []
      },
      {
        name: '/config set',
        description: 'Set a specific configuration key.',
        permissions: 'Manage Server',
        options: [
          { name: 'setting', type: 'String', required: true, description: 'Setting to change: prefix, log_channel, welcome_channel, mute_role, max_warnings.' },
          { name: 'value', type: 'String', required: true, description: 'The new value (Channel ID, Role ID, or text/number).' }
        ]
      },
      {
        name: '/embed create',
        description: 'Create and send fully customizable rich embeds.',
        permissions: 'Manage Messages / Manage Server',
        options: [
          { name: 'channel', type: 'Channel', required: true, description: 'The channel where the embed will be sent.' },
          { name: 'title', type: 'String', required: true, description: 'Embed title (max 256 characters).' },
          { name: 'description', type: 'String', required: true, description: 'Embed description (max 4096 characters).' },
          { name: 'color', type: 'String', required: false, description: 'Hex color code (e.g., #5865F2).' },
          { name: 'url', type: 'String', required: false, description: 'Title clickable URL.' },
          { name: 'author_name', type: 'String', required: false, description: 'Author text.' },
          { name: 'author_icon', type: 'String', required: false, description: 'Author icon image URL.' },
          { name: 'thumbnail', type: 'String', required: false, description: 'Thumbnail image URL.' },
          { name: 'image', type: 'String', required: false, description: 'Main large image URL.' },
          { name: 'footer_text', type: 'String', required: false, description: 'Footer text.' },
          { name: 'footer_icon', type: 'String', required: false, description: 'Footer icon image URL.' },
          { name: 'timestamp', type: 'Boolean', required: false, description: 'Whether to include the current timestamp.' }
        ]
      },
      {
        name: '/reactionrole add',
        description: 'Add a reaction role to a message.',
        permissions: 'Manage Roles / Manage Server',
        options: [
          { name: 'message_id', type: 'String', required: true, description: 'The target message ID.' },
          { name: 'emoji', type: 'String', required: true, description: 'The emoji to react with.' },
          { name: 'role', type: 'Role', required: true, description: 'The role to assign upon reacting.' },
          { name: 'channel', type: 'Channel', required: false, description: 'The channel where the message is located.' }
        ]
      },
      {
        name: '/reactionrole remove',
        description: 'Remove a reaction role from a message.',
        permissions: 'Manage Roles / Manage Server',
        options: [
          { name: 'message_id', type: 'String', required: true, description: 'The target message ID.' },
          { name: 'emoji', type: 'String', required: true, description: 'The emoji to remove.' }
        ]
      },
      {
        name: '/reactionrole list',
        description: 'List all configured reaction roles.',
        permissions: 'Manage Roles / Manage Server',
        options: [
          { name: 'channel', type: 'Channel', required: false, description: 'Filter reaction roles by a specific channel.' }
        ]
      }
    ]
  },
  {
    id: 'economy',
    name: 'Economy',
    icon: Coins,
    description: 'Engage users with a feature-rich economy system, including daily rewards, jobs, gambling, and a server item shop.',
    commands: [
      {
        name: '/eco balance',
        description: 'View current coin balance.',
        permissions: 'Everyone',
        options: [
          { name: 'user', type: 'User', required: false, description: 'The user whose balance you want to check.' }
        ]
      },
      {
        name: '/eco daily',
        description: 'Claim your daily coin reward.',
        permissions: 'Everyone',
        options: []
      },
      {
        name: '/eco work',
        description: 'Perform a job to earn coins (subject to cooldown).',
        permissions: 'Everyone',
        options: []
      },
      {
        name: '/eco rob',
        description: 'Attempt to steal coins from another user.',
        permissions: 'Everyone',
        options: [
          { name: 'user', type: 'User', required: true, description: 'The target user to rob.' }
        ]
      },
      {
        name: '/eco gamble dice',
        description: 'Roll a dice to double or lose your bet.',
        subcommandGroup: 'gamble',
        permissions: 'Everyone',
        options: [
          { name: 'amount', type: 'Integer', required: true, description: 'Amount of coins to bet.' }
        ]
      },
      {
        name: '/eco gamble flip',
        description: 'Flip a coin (heads/tails).',
        subcommandGroup: 'gamble',
        permissions: 'Everyone',
        options: [
          { name: 'amount', type: 'Integer', required: true, description: 'Amount of coins to bet.' },
          { name: 'choice', type: 'String', required: true, description: 'Choices: Heads, Tails.' }
        ]
      },
      {
        name: '/eco gamble slots',
        description: 'Play the slot machine.',
        subcommandGroup: 'gamble',
        permissions: 'Everyone',
        options: [
          { name: 'amount', type: 'Integer', required: true, description: 'Amount of coins to bet.' }
        ]
      },
      {
        name: '/eco shop list',
        description: 'List all available items in the server shop.',
        subcommandGroup: 'shop',
        permissions: 'Everyone',
        options: []
      },
      {
        name: '/eco shop buy',
        description: 'Buy an item from the shop.',
        subcommandGroup: 'shop',
        permissions: 'Everyone',
        options: [
          { name: 'item_id', type: 'String', required: true, description: 'The ID of the item to purchase.' }
        ]
      },
      {
        name: '/eco shop info',
        description: 'Get detailed information about a shop item.',
        subcommandGroup: 'shop',
        permissions: 'Everyone',
        options: [
          { name: 'item_id', type: 'String', required: true, description: 'The ID of the item.' }
        ]
      },
      {
        name: '/eco shop use',
        description: 'Use an item from your inventory.',
        subcommandGroup: 'shop',
        permissions: 'Everyone',
        options: [
          { name: 'item_id', type: 'String', required: true, description: 'The ID of the item to use.' }
        ]
      },
      {
        name: '/eco shop inventory',
        description: 'View item inventory.',
        subcommandGroup: 'shop',
        permissions: 'Everyone',
        options: [
          { name: 'user', type: 'User', required: false, description: 'The user whose inventory you want to check.' }
        ]
      }
    ]
  },
  {
    id: 'fun',
    name: 'Fun',
    icon: Sparkles,
    description: 'Interactive entertainment commands for server members.',
    commands: [
      {
        name: '/fun meme',
        description: 'Fetch a random popular meme from Reddit/Imgflip.',
        permissions: 'Everyone',
        options: []
      },
      {
        name: '/fun fact',
        description: 'Receive a random interesting fact.',
        permissions: 'Everyone',
        options: []
      },
      {
        name: '/fun quote',
        description: 'Receive a random inspiring quote.',
        permissions: 'Everyone',
        options: []
      },
      {
        name: '/fun joke',
        description: 'Get a general random joke.',
        permissions: 'Everyone',
        options: []
      },
      {
        name: '/fun dadjoke',
        description: 'Get a classic dad joke.',
        permissions: 'Everyone',
        options: []
      }
    ]
  },
  {
    id: 'giveaways',
    name: 'Giveaways',
    icon: Gift,
    description: 'Easily host, configure, and manage server giveaways.',
    commands: [
      {
        name: '/gw start',
        description: 'Start a giveaway with an advanced interactive modal (allows setting description, requirements, and bonus entries).',
        permissions: 'Manage Events / Manage Server',
        options: [
          { name: 'prize', type: 'String', required: true, description: 'The prize description (max 255 characters).' },
          { name: 'duration', type: 'String', required: true, description: 'Duration (e.g., 10m, 2h, 1d).' },
          { name: 'winners', type: 'Integer', required: false, description: 'Number of winners (1-20, default: 1).' },
          { name: 'channel', type: 'Channel', required: false, description: 'Text channel to host the giveaway in.' }
        ]
      },
      {
        name: '/gw simple',
        description: 'Quickly start a simple giveaway directly in the current channel.',
        permissions: 'Manage Events / Manage Server',
        options: [
          { name: 'prize', type: 'String', required: true, description: 'The prize description.' },
          { name: 'duration', type: 'String', required: true, description: 'Duration (e.g., 10m, 2h, 1d).' },
          { name: 'winners', type: 'Integer', required: true, description: 'Number of winners (1-20).' }
        ]
      },
      {
        name: '/gw end',
        description: 'Immediately end an active giveaway and roll winners.',
        permissions: 'Manage Events / Manage Server',
        options: [
          { name: 'giveaway_id', type: 'String', required: true, description: 'The message ID / giveaway ID.' }
        ]
      },
      {
        name: '/gw reroll',
        description: 'Reroll winners for a finished giveaway.',
        permissions: 'Manage Events / Manage Server',
        options: [
          { name: 'giveaway_id', type: 'String', required: true, description: 'The message ID / giveaway ID.' },
          { name: 'winners', type: 'Integer', required: false, description: 'Number of new winners to select.' }
        ]
      },
      {
        name: '/gw configure',
        description: 'Open the configuration modal for an existing giveaway.',
        permissions: 'Manage Events / Manage Server',
        options: [
          { name: 'giveaway_id', type: 'String', required: true, description: 'The message ID / giveaway ID.' }
        ]
      }
    ]
  },
  {
    id: 'moderation',
    name: 'Moderation & AutoMod',
    icon: Gavel,
    description: 'Powerful moderation capabilities, AutoMod V2 rules, Quarantine Vault, word filtering, and advanced warning automation.',
    commands: [
      {
        name: '/automod add_rule',
        description: 'Add a new automated rule.',
        permissions: 'Manage Server / Admin',
        options: [
          { name: 'name', type: 'String', required: true, description: 'Rule name.' },
          { name: 'trigger_type', type: 'String', required: true, description: 'Trigger condition: Keyword Match, Regex Match, Mention Spam, Attachment Spam.' },
          { name: 'action_type', type: 'String', required: true, description: 'Action to execute: Delete Message, Warn User, Timeout User, Add Infraction Points.' },
          { name: 'keywords', type: 'String', required: false, description: 'Comma-separated keywords (required if trigger is Keyword).' },
          { name: 'regex_pattern', type: 'String', required: false, description: 'Regex pattern (required if trigger is Regex).' },
          { name: 'limit', type: 'Integer', required: false, description: 'Threshold limit for mention/attachment spam.' },
          { name: 'points', type: 'Integer', required: false, description: 'Infraction points to add (if action is Add Infraction Points).' }
        ]
      },
      {
        name: '/automod list_rules',
        description: 'List all configured AutoMod V2 rules in the server.',
        permissions: 'Manage Server / Admin',
        options: []
      },
      {
        name: '/automod remove_rule',
        description: 'Delete an AutoMod V2 rule.',
        permissions: 'Manage Server / Admin',
        options: [
          { name: 'rule_id', type: 'String', required: true, description: 'UUID of the rule to remove.' }
        ]
      },
      {
        name: '/automod quarantine_list',
        description: 'List all users currently held in the Quarantine Vault.',
        permissions: 'Moderate Members / Manage Server',
        options: []
      },
      {
        name: '/automod quarantine_release',
        description: 'Release a user from the Quarantine Vault.',
        permissions: 'Moderate Members / Manage Server',
        options: [
          { name: 'user', type: 'User', required: true, description: 'The user to release.' }
        ]
      },
      {
        name: '/filter add',
        description: 'Add a word filter rule.',
        permissions: 'Manage Server / Admin',
        options: [
          { name: 'pattern', type: 'String', required: true, description: 'The word or regex pattern to filter.' },
          { name: 'match_type', type: 'String', required: false, description: 'Choices: Literal, Regex.' },
          { name: 'case_sensitive', type: 'Boolean', required: false, description: 'Whether matching should be case-sensitive.' },
          { name: 'whole_word', type: 'Boolean', required: false, description: 'Whether to match only whole words.' },
          { name: 'severity', type: 'String', required: false, description: 'Choices: Low, Medium, High, Critical.' },
          { name: 'auto_delete', type: 'Boolean', required: false, description: 'Whether to automatically delete matching messages.' },
          { name: 'notify_channel', type: 'Channel', required: false, description: 'Target channel for filter violation alerts.' }
        ]
      },
      {
        name: '/filter remove',
        description: 'Remove a word filter rule.',
        permissions: 'Manage Server / Admin',
        options: [
          { name: 'rule_id', type: 'Integer', required: true, description: 'ID of the filter rule.' }
        ]
      },
      {
        name: '/filter list',
        description: 'List all active word filter rules.',
        permissions: 'Manage Server / Admin',
        options: []
      },
      {
        name: '/moderation ban',
        description: 'Ban a user from the server.',
        permissions: 'Ban Members',
        options: [
          { name: 'user', type: 'User', required: true, description: 'User to ban.' },
          { name: 'reason', type: 'String', required: false, description: 'Reason for banning.' },
          { name: 'delete_days', type: 'Integer', required: false, description: 'Number of days of messages to delete (0-7).' }
        ]
      },
      {
        name: '/moderation kick',
        description: 'Kick a user from the server.',
        permissions: 'Kick Members',
        options: [
          { name: 'user', type: 'User', required: true, description: 'User to kick.' },
          { name: 'reason', type: 'String', required: false, description: 'Reason for kicking.' }
        ]
      },
      {
        name: '/moderation timeout',
        description: 'Temporarily timeout (mute) a user.',
        permissions: 'Moderate Members',
        options: [
          { name: 'user', type: 'User', required: true, description: 'User to timeout.' },
          { name: 'duration', type: 'Integer', required: true, description: 'Choices range from 60 seconds to 4 weeks.' },
          { name: 'reason', type: 'String', required: false, description: 'Reason for timeout.' }
        ]
      },
      {
        name: '/moderation mute',
        description: 'Assign the server mute role to a user.',
        permissions: 'Moderate Members / Manage Roles',
        options: [
          { name: 'user', type: 'User', required: true, description: 'User to mute.' },
          { name: 'duration', type: 'Integer', required: false, description: 'Duration in minutes (1-10080).' },
          { name: 'reason', type: 'String', required: false, description: 'Reason for mute.' }
        ]
      },
      {
        name: '/moderation unmute',
        description: 'Remove the server mute role from a user.',
        permissions: 'Moderate Members / Manage Roles',
        options: [
          { name: 'user', type: 'User', required: true, description: 'User to unmute.' },
          { name: 'reason', type: 'String', required: false, description: 'Reason for unmute.' }
        ]
      },
      {
        name: '/moderation unban',
        description: 'Unban a user by their Snowflake ID.',
        permissions: 'Ban Members',
        options: [
          { name: 'user_id', type: 'String', required: true, description: 'Discord User ID to unban.' },
          { name: 'reason', type: 'String', required: false, description: 'Reason for unban.' }
        ]
      },
      {
        name: '/moderation purge',
        description: 'Delete multiple messages rapidly.',
        permissions: 'Manage Messages',
        options: [
          { name: 'amount', type: 'Integer', required: true, description: 'Number of messages to delete (2-100).' },
          { name: 'user', type: 'User', required: false, description: 'Only delete messages sent by this user.' },
          { name: 'channel', type: 'Channel', required: false, description: 'Target channel to purge in.' }
        ]
      },
      {
        name: '/moderation lock',
        description: 'Lock a channel (prevents regular members from sending messages).',
        permissions: 'Manage Channels',
        options: [
          { name: 'channel', type: 'Channel', required: false, description: 'Target channel to lock.' },
          { name: 'reason', type: 'String', required: false, description: 'Reason for locking.' }
        ]
      },
      {
        name: '/moderation unlock',
        description: 'Unlock a locked channel.',
        permissions: 'Manage Channels',
        options: [
          { name: 'channel', type: 'Channel', required: false, description: 'Target channel to unlock.' },
          { name: 'reason', type: 'String', required: false, description: 'Reason for unlocking.' }
        ]
      },
      {
        name: '/moderation slowmode',
        description: 'Set slowmode delay in a channel.',
        permissions: 'Manage Channels',
        options: [
          { name: 'duration', type: 'Integer', required: true, description: 'Slowmode delay in seconds (0-21600). 0 disables slowmode.' },
          { name: 'channel', type: 'Channel', required: false, description: 'Target channel.' },
          { name: 'reason', type: 'String', required: false, description: 'Reason for slowmode change.' }
        ]
      },
      {
        name: '/moderation modlog',
        description: 'View moderation history logs.',
        permissions: 'Moderate Members',
        options: [
          { name: 'user', type: 'User', required: false, description: 'Filter logs by user.' },
          { name: 'limit', type: 'Integer', required: false, description: 'Number of logs to show (1-25).' }
        ]
      },
      {
        name: '/moderation case view',
        description: 'View details of a specific moderation case.',
        subcommandGroup: 'case',
        permissions: 'Moderate Members',
        options: [
          { name: 'id', type: 'Integer', required: true, description: 'Case ID.' }
        ]
      },
      {
        name: '/moderation case delete',
        description: 'Delete a specific moderation case.',
        subcommandGroup: 'case',
        permissions: 'Manage Server / Admin',
        options: [
          { name: 'id', type: 'Integer', required: true, description: 'Case ID.' }
        ]
      },
      {
        name: '/moderation reset-xp',
        description: "Reset a user's XP progression.",
        permissions: 'Manage Server / Admin',
        options: [
          { name: 'user', type: 'User', required: true, description: 'Target user.' },
          { name: 'confirm', type: 'Boolean', required: true, description: 'Confirmation flag.' }
        ]
      },
      {
        name: '/warn create',
        description: 'Issue a warning to a user.',
        permissions: 'Moderate Members',
        options: [
          { name: 'user', type: 'User', required: true, description: 'The user to warn.' },
          { name: 'title', type: 'String', required: true, description: 'Summary/title of the warning.' },
          { name: 'description', type: 'String', required: false, description: 'Detailed description/context.' },
          { name: 'level', type: 'Integer', required: false, description: 'Severity level (1-10).' },
          { name: 'proof', type: 'Attachment', required: false, description: 'Supporting screenshot/attachment.' }
        ]
      },
      {
        name: '/warn edit',
        description: 'Edit an existing warning.',
        permissions: 'Moderate Members',
        options: [
          { name: 'warnid', type: 'String', required: true, description: 'Warning ID to edit.' }
        ]
      },
      {
        name: '/warn lookup',
        description: 'Look up details of a specific warning.',
        permissions: 'Moderate Members',
        options: [
          { name: 'warnid', type: 'String', required: true, description: 'Warning ID.' }
        ]
      },
      {
        name: '/warn delete',
        description: 'Delete a specific warning.',
        permissions: 'Manage Server / Admin',
        options: [
          { name: 'warnid', type: 'String', required: true, description: 'Warning ID.' }
        ]
      },
      {
        name: '/warn view',
        description: 'View all warnings for a user.',
        permissions: 'Moderate Members',
        options: [
          { name: 'user', type: 'User', required: true, description: 'Target user.' }
        ]
      },
      {
        name: '/warn purge',
        description: 'Remove all warnings for a user.',
        permissions: 'Manage Server / Admin',
        options: [
          { name: 'user', type: 'User', required: true, description: 'Target user.' }
        ]
      },
      {
        name: '/warn automation create',
        description: 'Create an automation trigger (e.g., timeout/ban when warn count or level is reached).',
        subcommandGroup: 'automation',
        permissions: 'Manage Server / Admin',
        options: [
          { name: 'trigger_type', type: 'String', required: true, description: 'Choices: Warn Count, Warn Level.' },
          { name: 'trigger_value', type: 'Integer', required: true, description: 'Threshold number that activates the trigger (1-100).' },
          { name: 'notify_channel', type: 'Channel', required: false, description: 'Channel to send alert when automation triggers.' }
        ]
      },
      {
        name: '/warn automation view',
        description: 'View all active warning automations in the server.',
        subcommandGroup: 'automation',
        permissions: 'Manage Server / Admin',
        options: []
      },
      {
        name: '/warn automation delete',
        description: 'Delete a warning automation.',
        subcommandGroup: 'automation',
        permissions: 'Manage Server / Admin',
        options: [
          { name: 'automation_id', type: 'String', required: true, description: 'Automation ID to delete.' }
        ]
      }
    ]
  },
  {
    id: 'tickets',
    name: 'Tickets',
    icon: TicketIcon,
    description: 'Manage ticket panels, multi-department support setups, and active ticket workflows.',
    commands: [
      {
        name: '/ticket claim',
        description: 'Claim an active ticket (for support staff).',
        permissions: 'Support Staff / Manage Channels',
        options: []
      },
      {
        name: '/ticket close',
        description: 'Close an active ticket.',
        permissions: 'Support Staff / Ticket Owner',
        options: [
          { name: 'reason', type: 'String', required: false, description: 'Reason for closing the ticket.' }
        ]
      },
      {
        name: '/ticket stats',
        description: 'View ticket system statistics for the server.',
        permissions: 'Manage Server / Admin',
        options: []
      },
      {
        name: '/ticket panel create',
        description: 'Create a new ticket panel configuration.',
        subcommandGroup: 'panel',
        permissions: 'Manage Server / Admin',
        options: [
          { name: 'panel_id', type: 'String', required: true, description: 'Unique ID for the panel (3-20 chars).' },
          { name: 'title', type: 'String', required: true, description: 'Panel title.' },
          { name: 'description', type: 'String', required: true, description: 'Panel description.' },
          { name: 'button_label', type: 'String', required: false, description: 'Text on the open ticket button.' },
          { name: 'button_style', type: 'Integer', required: false, description: 'Choices: Primary (Blue), Secondary (Gray), Success (Green), Danger (Red).' },
          { name: 'category', type: 'Channel', required: false, description: 'Discord Category where tickets will be created.' },
          { name: 'support_role', type: 'Role', required: false, description: 'Staff role granted access to tickets.' },
          { name: 'max_tickets', type: 'Integer', required: false, description: 'Max concurrent tickets per user (1-10).' },
          { name: 'welcome_message', type: 'String', required: false, description: 'Initial message sent when a ticket opens.' }
        ]
      },
      {
        name: '/ticket panel load',
        description: 'Send an existing ticket panel to a specific channel.',
        subcommandGroup: 'panel',
        permissions: 'Manage Server / Admin',
        options: [
          { name: 'panel_id', type: 'String', required: true, description: 'ID of the panel to load.' },
          { name: 'channel', type: 'Channel', required: true, description: 'Text channel to post the panel in.' }
        ]
      },
      {
        name: '/ticket panel delete',
        description: 'Delete a ticket panel configuration.',
        subcommandGroup: 'panel',
        permissions: 'Manage Server / Admin',
        options: [
          { name: 'panel_id', type: 'String', required: true, description: 'ID of the panel to delete.' }
        ]
      },
      {
        name: '/ticket panel list',
        description: 'List all configured ticket panels in the server.',
        subcommandGroup: 'panel',
        permissions: 'Manage Server / Admin',
        options: []
      },
      {
        name: '/ticket panel edit',
        description: 'Open interactive editor for a ticket panel.',
        subcommandGroup: 'panel',
        permissions: 'Manage Server / Admin',
        options: [
          { name: 'panel_id', type: 'String', required: true, description: 'ID of the panel to edit.' }
        ]
      },
      {
        name: '/ticket panel add_dept',
        description: 'Add a specific department choice to a ticket panel.',
        subcommandGroup: 'panel',
        permissions: 'Manage Server / Admin',
        options: [
          { name: 'panel_id', type: 'String', required: true, description: 'Target panel ID.' },
          { name: 'dept_id', type: 'String', required: true, description: 'Unique department ID.' },
          { name: 'name', type: 'String', required: true, description: 'Department display name.' },
          { name: 'description', type: 'String', required: true, description: 'Department description.' },
          { name: 'support_role', type: 'Role', required: false, description: 'Specific support role for this department.' },
          { name: 'category', type: 'Channel', required: false, description: 'Specific category channel for this department.' },
          { name: 'welcome_message', type: 'String', required: false, description: 'Specific welcome message for this department.' }
        ]
      },
      {
        name: '/ticket panel list_depts',
        description: 'List all departments configured on a panel.',
        subcommandGroup: 'panel',
        permissions: 'Manage Server / Admin',
        options: [
          { name: 'panel_id', type: 'String', required: true, description: 'Target panel ID.' }
        ]
      },
      {
        name: '/ticket panel remove_dept',
        description: 'Remove a department from a panel.',
        subcommandGroup: 'panel',
        permissions: 'Manage Server / Admin',
        options: [
          { name: 'panel_id', type: 'String', required: true, description: 'Target panel ID.' },
          { name: 'dept_id', type: 'String', required: true, description: 'Department ID to remove.' }
        ]
      }
    ]
  },
  {
    id: 'utility',
    name: 'Utility & JTC',
    icon: Wrench,
    description: 'General server utility, Join-to-Create voice management, localization, and information lookups.',
    commands: [
      {
        name: '/jtc setup',
        description: 'Initial configuration for Join-to-Create dynamic voice channels.',
        permissions: 'Manage Channels / Manage Server',
        options: [
          { name: 'base_voice', type: 'Channel', required: true, description: 'The master voice channel users join to create their own room.' },
          { name: 'category', type: 'Channel', required: true, description: 'Category where dynamic voice channels will be created.' },
          { name: 'panel_channel', type: 'Channel', required: true, description: 'Text channel where the JTC management panel will be sent.' },
          { name: 'name_format', type: 'String', required: false, description: 'Custom naming template for created channels.' }
        ]
      },
      {
        name: '/jtc disable',
        description: 'Disable JTC functionality and clear configuration.',
        permissions: 'Manage Channels / Manage Server',
        options: []
      },
      {
        name: '/jtc panel',
        description: 'Send or update the JTC management UI panel in the configured channel.',
        permissions: 'Manage Channels / Manage Server',
        options: []
      },
      {
        name: '/language available',
        description: 'List all supported languages (en, de, es, fr).',
        permissions: 'Everyone',
        options: []
      },
      {
        name: '/language current',
        description: 'Show your active language setting.',
        permissions: 'Everyone',
        options: []
      },
      {
        name: '/language set',
        description: 'Change your language preference.',
        permissions: 'Everyone (User) / Manage Server (Server)',
        options: [
          { name: 'language', type: 'String', required: true, description: 'Choices: English, Deutsch, Español, Français.' }
        ]
      },
      {
        name: '/ping',
        description: 'Check bot websocket latency and Discord API response times.',
        permissions: 'Everyone',
        options: []
      },
      {
        name: '/utils avatar',
        description: "View a user's full-size avatar.",
        permissions: 'Everyone',
        options: [
          { name: 'user', type: 'User', required: false, description: 'Target user.' }
        ]
      },
      {
        name: '/utils banner',
        description: "View a user's profile banner.",
        permissions: 'Everyone',
        options: [
          { name: 'user', type: 'User', required: false, description: 'Target user.' }
        ]
      },
      {
        name: '/utils steam',
        description: 'Look up a Steam user profile.',
        permissions: 'Everyone',
        options: [
          { name: 'username', type: 'String', required: true, description: 'Steam username or custom profile URL.' }
        ]
      },
      {
        name: '/utils userinfo',
        description: 'View detailed Discord account and guild member info.',
        permissions: 'Everyone',
        options: [
          { name: 'user', type: 'User', required: false, description: 'Target user.' }
        ]
      },
      {
        name: '/utils whois',
        description: 'Look up any Discord user by their ID.',
        permissions: 'Everyone',
        options: [
          { name: 'user_id', type: 'String', required: true, description: 'Discord User ID.' }
        ]
      },
      {
        name: '/utils roleinfo',
        description: 'View detailed information about a server role.',
        permissions: 'Everyone',
        options: [
          { name: 'role', type: 'Role', required: true, description: 'Target role.' }
        ]
      },
      {
        name: '/utils serverinfo',
        description: 'View detailed server statistics, boost status, and info.',
        permissions: 'Everyone',
        options: []
      },
      {
        name: '/utils help',
        description: 'View interactive command help.',
        permissions: 'Everyone',
        options: [
          { name: 'command', type: 'String', required: false, description: 'Specific command name (supports autocomplete).' }
        ]
      },
      {
        name: '/utils support',
        description: 'Get the official bot support server invite link.',
        permissions: 'Everyone',
        options: []
      },
      {
        name: '/utils stats',
        description: 'View bot uptime, memory usage, and global system statistics.',
        permissions: 'Everyone',
        options: []
      }
    ]
  },
  {
    id: 'xp',
    name: 'XP & Engagement',
    icon: Award,
    description: 'Gamification features, leveling, quests, achievements, and peer recognition.',
    commands: [
      {
        name: '/achievements',
        description: 'View your unlocked achievements and available server achievements.',
        permissions: 'Everyone',
        options: []
      },
      {
        name: '/prestige',
        description: 'Trade in your max level to gain a prestige rank and exclusive perks/rewards.',
        permissions: 'Everyone',
        options: []
      },
      {
        name: '/quests',
        description: 'View active engagement quests (e.g., message goals, voice time goals) and track your current progress.',
        permissions: 'Everyone',
        options: []
      },
      {
        name: '/thanks',
        description: 'Give thanks and reputation points to another user for being helpful.',
        permissions: 'Everyone',
        options: [
          { name: 'user', type: 'User', required: true, description: 'The user to thank.' },
          { name: 'reason', type: 'String', required: false, description: 'Reason for thanking them.' }
        ]
      },
      {
        name: '/xp rank',
        description: "View your or another user's visual XP rank card.",
        permissions: 'Everyone',
        options: [
          { name: 'user', type: 'User', required: false, description: 'Target user.' }
        ]
      },
      {
        name: '/xp leaderboard',
        description: "View the server's top XP leaderboard.",
        permissions: 'Everyone',
        options: [
          { name: 'page', type: 'Integer', required: false, description: 'Page number to view.' }
        ]
      },
      {
        name: '/xp configuration',
        description: "View the server's XP multipliers, voice XP rates, and role rewards.",
        permissions: 'Everyone',
        options: []
      },
      {
        name: '/xp card',
        description: 'Customize the visual colors and aesthetics of your rank card.',
        permissions: 'Everyone',
        options: []
      }
    ]
  }
];

export default function CommandsPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCategories = useMemo(() => {
    return COMMAND_CATEGORIES.map(category => {
      const filteredCommands = category.commands.filter(cmd => {
        const matchesSearch = searchQuery === '' || 
          cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cmd.permissions.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      });

      return {
        ...category,
        commands: filteredCommands
      };
    }).filter(category => {
      if (activeTab !== 'all' && category.id !== activeTab) return false;
      return category.commands.length > 0;
    });
  }, [activeTab, searchQuery]);

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 flex flex-col gap-12">
      {/* Header Section */}
      <div className="flex flex-col gap-4 border-b border-white/5 pb-12">
        <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase">
          // KNOWLEDGEBASE // COMMAND MATRIX
        </div>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
          System Commands Documentation
        </h1>
        <p className="text-base text-neutral-400 max-w-3xl font-light leading-relaxed">
          Comprehensive execution matrix for the Pegasus Discord Bot. Review required syntax, optional argument parameters, and permission levels across all operational submodules.
        </p>
      </div>

      {/* Navigation & Filtering Controls */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-white/5 pb-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-white/[0.01] border border-white/5 p-1 rounded-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all rounded-none border-l-2 ${
              activeTab === 'all'
                ? 'bg-white/[0.05] text-white border-l-[#5E5CE6]'
                : 'text-neutral-400 hover:text-white border-l-transparent'
            }`}
          >
            All Commands
          </button>
          {COMMAND_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all rounded-none border-l-2 ${
                  isActive
                    ? 'bg-white/[0.05] text-white border-l-[#5E5CE6]'
                    : 'text-neutral-400 hover:text-white border-l-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search command matrix..."
            className="w-full pl-10 pr-4 py-2 bg-white/[0.01] border border-white/5 text-white placeholder-neutral-500 text-xs font-mono tracking-wider focus:outline-none focus:border-[#5E5CE6] transition-colors rounded-none"
          />
        </div>
      </div>

      {/* Command Tables Matrix */}
      <div className="flex flex-col gap-16">
        {filteredCategories.length === 0 ? (
          <div className="border border-white/5 p-12 text-center bg-white/[0.01]">
            <p className="text-sm font-mono text-neutral-400">
              No commands matched your query parameters.
            </p>
          </div>
        ) : (
          filteredCategories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <section key={category.id} className="flex flex-col gap-6">
                {/* Category Header */}
                <div className="flex flex-col gap-2 border-l-2 border-l-[#5E5CE6] pl-4 py-1">
                  <div className="flex items-center gap-2 text-white">
                    <CategoryIcon className="w-5 h-5 text-[#5E5CE6]" />
                    <h2 className="text-2xl font-light tracking-tight">{category.name}</h2>
                  </div>
                  <p className="text-sm text-neutral-400 font-light max-w-4xl">
                    {category.description}
                  </p>
                </div>

                {/* Data Table */}
                <div className="border border-white/5 bg-white/[0.01] overflow-x-auto rounded-none">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02] text-xs font-mono uppercase text-neutral-400 tracking-wider">
                        <th className="p-4 font-semibold">Command / Syntax</th>
                        <th className="p-4 font-semibold">Description</th>
                        <th className="p-4 font-semibold">Arguments / Parameters</th>
                        <th className="p-4 font-semibold">Required Permissions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm font-light">
                      {category.commands.map((cmd, idx) => (
                        <tr key={idx} className="bg-transparent">
                          {/* Command Syntax */}
                          <td className="p-4 align-top w-1/4">
                            <div className="flex items-center gap-1.5 font-mono text-xs text-[#5E5CE6] bg-white/[0.03] border border-white/5 px-2.5 py-1 w-fit rounded-none">
                              <Terminal className="w-3 h-3" />
                              <span className="font-semibold">{cmd.name}</span>
                            </div>
                            {cmd.subcommandGroup && (
                              <div className="mt-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                                Group: {cmd.subcommandGroup}
                              </div>
                            )}
                          </td>

                          {/* Description */}
                          <td className="p-4 align-top text-neutral-300 w-1/4 leading-relaxed">
                            {cmd.description}
                          </td>

                          {/* Arguments */}
                          <td className="p-4 align-top w-1/4">
                            {cmd.options.length === 0 ? (
                              <span className="text-xs font-mono text-neutral-600 italic">None required</span>
                            ) : (
                              <div className="flex flex-col gap-2">
                                {cmd.options.map((opt, optIdx) => (
                                  <div key={optIdx} className="flex flex-col gap-0.5 border-l border-white/10 pl-2.5 py-0.5">
                                    <div className="flex items-center gap-2 font-mono text-xs">
                                      <span className="text-white font-medium">
                                        {opt.required ? `<${opt.name}>` : `[${opt.name}]`}
                                      </span>
                                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider px-1.5 py-0.5 bg-white/[0.02] border border-white/5">
                                        {opt.type}
                                      </span>
                                      {opt.required && (
                                        <span className="text-[10px] text-[#5E5CE6] font-semibold uppercase tracking-wider">
                                          Required
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-xs text-neutral-400 font-light">
                                      {opt.description}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Permissions */}
                          <td className="p-4 align-top w-1/4 font-mono text-xs text-neutral-400">
                            <div className="flex items-center gap-1.5">
                              <Hash className="w-3.5 h-3.5 text-neutral-500" />
                              <span>{cmd.permissions}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })
        )}
      </div>
    </main>
  );
}
