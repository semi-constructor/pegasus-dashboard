# Pegasus Discord Bot - Commands Documentation

This document provides a comprehensive guide to all slash commands available in the Pegasus Discord Bot. Commands are organized by category and include detailed descriptions of their subcommands, subcommand groups, and options (required `<option>` vs optional `[option]`).

---

## Table of Contents

1. [Admin](#1-admin)
2. [Configuration](#2-configuration)
3. [Economy](#3-economy)
4. [Fun](#4-fun)
5. [Giveaways](#5-giveaways)
6. [Moderation & AutoMod](#6-moderation--automod)
7. [Tickets](#7-tickets)
8. [Utility](#8-utility)
9. [XP & Engagement](#9-xp--engagement)

---

## 1. Admin

Administrative commands for managing bot security, modules, blacklists, and server pruning.

### `/auditlog`
View security audit logs for the server.
* **Subcommands:**
  * `view`: View audit logs.
    * `[user]` (User): Filter logs by a specific user.
    * `[action_type]` (String): Filter logs by action type (e.g., `BAN`, `KICK`, `TIMEOUT`).
    * `[limit]` (Integer): Number of logs to fetch (1-50, default: 10).

### `/blacklist`
Manage the bot's global user blacklist (prevents blacklisted users from using any commands).
* **Subcommands:**
  * `add`: Add a user to the blacklist.
    * `<user>` (User): The user to blacklist.
    * `[reason]` (String): Reason for blacklisting.
  * `remove`: Remove a user from the blacklist.
    * `<user>` (User): The user to unblacklist.
    * `[reason]` (String): Reason for removal.
  * `check`: Check if a user is currently blacklisted.
    * `<user>` (User): The user to check.

### `/module`
Enable or disable specific bot modules dynamically per server.
* **Subcommands:**
  * `enable`: Enable a bot module.
    * `<module>` (String): Choices: `economy`, `tickets`, `fun`, `moderation`, `xp`, `giveaways`, `jtc`, `automod`.
  * `disable`: Disable a bot module.
    * `<module>` (String): Choices: `economy`, `tickets`, `fun`, `moderation`, `xp`, `giveaways`, `jtc`, `automod`.
  * `status`: View the active/inactive status of all modules in the server.

### `/prune`
Prune inactive members from the server.
* **Options:**
  * `<days>` (Integer): Number of days of inactivity (1-30).
  * `[dry_run]` (Boolean): If true, simulates the prune and returns the count without kicking members.
  * `[roles]` (Role): Only prune members with this specific role.
  * `[reason]` (String): Audit log reason for the prune.

---

## 2. Configuration

Configure server-specific settings, custom embeds, and reaction roles.

### `/config`
Manage server configuration settings.
* **Subcommands:**
  * `view`: View all current server configurations.
  * `set`: Set a specific configuration key.
    * `<setting>` (String): Setting to change. Choices: `prefix`, `log_channel`, `welcome_channel`, `mute_role`, `max_warnings`.
    * `<value>` (String): The new value (Channel ID, Role ID, or text/number depending on the setting).

### `/embed`
Create and send fully customizable rich embeds.
* **Subcommands:**
  * `create`: Create a custom embed.
    * `<channel>` (Channel): The channel where the embed will be sent (Text/Announcement channels).
    * `<title>` (String): Embed title (max 256 characters).
    * `<description>` (String): Embed description (max 4096 characters).
    * `[color]` (String): Hex color code (e.g., `#5865F2`).
    * `[url]` (String): Title clickable URL.
    * `[author_name]` (String): Author text.
    * `[author_icon]` (String): Author icon image URL.
    * `[thumbnail]` (String): Thumbnail image URL.
    * `[image]` (String): Main large image URL.
    * `[footer_text]` (String): Footer text.
    * `[footer_icon]` (String): Footer icon image URL.
    * `[timestamp]` (Boolean): Whether to include the current timestamp.

### `/reactionrole`
Manage reaction-based role assignment.
* **Subcommands:**
  * `add`: Add a reaction role to a message.
    * `<message_id>` (String): The target message ID.
    * `<emoji>` (String): The emoji to react with.
    * `<role>` (Role): The role to assign upon reacting.
    * `[channel]` (Channel): The channel where the message is located.
  * `remove`: Remove a reaction role from a message.
    * `<message_id>` (String): The target message ID.
    * `<emoji>` (String): The emoji to remove.
  * `list`: List all configured reaction roles.
    * `[channel]` (Channel): Filter reaction roles by a specific channel.

---

## 3. Economy

Engage users with a feature-rich economy system, including daily rewards, jobs, gambling, and a server item shop.

### `/eco`
Parent command for all economy operations.
* **Subcommands & Groups:**
  * `balance`: View current coin balance.
    * `[user]` (User): The user whose balance you want to check.
  * `daily`: Claim your daily coin reward.
  * `work`: Perform a job to earn coins (subject to cooldown).
  * `rob`: Attempt to steal coins from another user.
    * `<user>` (User): The target user to rob.
  * **`gamble` (Subcommand Group):**
    * `dice`: Roll a dice to double or lose your bet.
      * `<amount>` (Integer): Amount of coins to bet.
    * `flip`: Flip a coin (heads/tails).
      * `<amount>` (Integer): Amount of coins to bet.
      * `<choice>` (String): Choices: `Heads`, `Tails`.
    * `slots`: Play the slot machine.
      * `<amount>` (Integer): Amount of coins to bet.
  * **`shop` (Subcommand Group):**
    * `list`: List all available items in the server shop.
    * `buy`: Buy an item from the shop.
      * `<item_id>` (String): The ID of the item to purchase.
    * `info`: Get detailed information about a shop item.
      * `<item_id>` (String): The ID of the item.
    * `use`: Use an item from your inventory.
      * `<item_id>` (String): The ID of the item to use.
    * `inventory`: View item inventory.
      * `[user]` (User): The user whose inventory you want to check.

---

## 4. Fun

Interactive entertainment commands for server members.

### `/fun`
* **Subcommands:**
  * `meme`: Fetch a random popular meme from Reddit/Imgflip.
  * `fact`: Receive a random interesting fact.
  * `quote`: Receive a random inspiring quote.
  * `joke`: Get a general random joke.
  * `dadjoke`: Get a classic dad joke.

---

## 5. Giveaways

Easily host, configure, and manage server giveaways.

### `/gw`
* **Subcommands:**
  * `start`: Start a giveaway with an advanced interactive modal (allows setting description, requirements, and bonus entries).
    * `<prize>` (String): The prize description (max 255 characters).
    * `<duration>` (String): Duration (e.g., `10m`, `2h`, `1d`).
    * `[winners]` (Integer): Number of winners (1-20, default: 1).
    * `[channel]` (Channel): Text channel to host the giveaway in.
  * `simple`: Quickly start a simple giveaway directly in the current channel.
    * `<prize>` (String): The prize description.
    * `<duration>` (String): Duration (e.g., `10m`, `2h`, `1d`).
    * `<winners>` (Integer): Number of winners (1-20).
  * `end`: Immediately end an active giveaway and roll winners.
    * `<giveaway_id>` (String): The message ID / giveaway ID.
  * `reroll`: Reroll winners for a finished giveaway.
    * `<giveaway_id>` (String): The message ID / giveaway ID.
    * `[winners]` (Integer): Number of new winners to select.
  * `configure`: Open the configuration modal for an existing giveaway.
    * `<giveaway_id>` (String): The message ID / giveaway ID.

---

## 6. Moderation & AutoMod

Powerful moderation capabilities, AutoMod V2 rules, Quarantine Vault, word filtering, and advanced warning automation.

### `/automod`
Manage AutoMod V2 rules and Quarantine Vault.
* **Subcommands:**
  * `add_rule`: Add a new automated rule.
    * `<name>` (String): Rule name.
    * `<trigger_type>` (String): Trigger condition. Choices: `Keyword Match`, `Regex Match`, `Mention Spam`, `Attachment Spam`.
    * `<action_type>` (String): Action to execute. Choices: `Delete Message`, `Warn User`, `Timeout User`, `Add Infraction Points`.
    * `[keywords]` (String): Comma-separated keywords (required if trigger is Keyword).
    * `[regex_pattern]` (String): Regex pattern (required if trigger is Regex).
    * `[limit]` (Integer): Threshold limit for mention/attachment spam.
    * `[points]` (Integer): Infraction points to add (if action is Add Infraction Points).
  * `list_rules`: List all configured AutoMod V2 rules in the server.
  * `remove_rule`: Delete an AutoMod V2 rule.
    * `<rule_id>` (String): UUID of the rule to remove.
  * `quarantine_list`: List all users currently held in the Quarantine Vault.
  * `quarantine_release`: Release a user from the Quarantine Vault.
    * `<user>` (User): The user to release.

### `/filter`
Manage automated word filtering rules.
* **Subcommands:**
  * `add`: Add a word filter rule.
    * `<pattern>` (String): The word or regex pattern to filter.
    * `[match_type]` (String): Choices: `Literal`, `Regex`.
    * `[case_sensitive]` (Boolean): Whether matching should be case-sensitive.
    * `[whole_word]` (Boolean): Whether to match only whole words.
    * `[severity]` (String): Choices: `Low`, `Medium`, `High`, `Critical`.
    * `[auto_delete]` (Boolean): Whether to automatically delete matching messages.
    * `[notify_channel]` (Channel): Target channel for filter violation alerts.
  * `remove`: Remove a word filter rule.
    * `<rule_id>` (Integer): ID of the filter rule.
  * `list`: List all active word filter rules.

### `/moderation`
Core staff moderation commands.
* **Subcommands & Groups:**
  * `ban`: Ban a user from the server.
    * `<user>` (User): User to ban.
    * `[reason]` (String): Reason for banning.
    * `[delete_days]` (Integer): Number of days of messages to delete (0-7).
  * `kick`: Kick a user from the server.
    * `<user>` (User): User to kick.
    * `[reason]` (String): Reason for kicking.
  * `timeout`: Temporarily timeout (mute) a user.
    * `<user>` (User): User to timeout.
    * `<duration>` (Integer): Choices range from `60 seconds` to `4 weeks`.
    * `[reason]` (String): Reason for timeout.
  * `mute`: Assign the server mute role to a user.
    * `<user>` (User): User to mute.
    * `[duration]` (Integer): Duration in minutes (1-10080).
    * `[reason]` (String): Reason for mute.
  * `unmute`: Remove the server mute role from a user.
    * `<user>` (User): User to unmute.
    * `[reason]` (String): Reason for unmute.
  * `unban`: Unban a user by their Snowflake ID.
    * `<user_id>` (String): Discord User ID to unban.
    * `[reason]` (String): Reason for unban.
  * `purge`: Delete multiple messages rapidly.
    * `<amount>` (Integer): Number of messages to delete (2-100).
    * `[user]` (User): Only delete messages sent by this user.
    * `[channel]` (Channel): Target channel to purge in.
  * `lock`: Lock a channel (prevents regular members from sending messages).
    * `[channel]` (Channel): Target channel to lock.
    * `[reason]` (String): Reason for locking.
  * `unlock`: Unlock a locked channel.
    * `[channel]` (Channel): Target channel to unlock.
    * `[reason]` (String): Reason for unlocking.
  * `slowmode`: Set slowmode delay in a channel.
    * `<duration>` (Integer): Slowmode delay in seconds (0-21600). `0` disables slowmode.
    * `[channel]` (Channel): Target channel.
    * `[reason]` (String): Reason for slowmode change.
  * `modlog`: View moderation history logs.
    * `[user]` (User): Filter logs by user.
    * `[limit]` (Integer): Number of logs to show (1-25).
  * **`case` (Subcommand Group):**
    * `view`: View details of a specific moderation case.
      * `<id>` (Integer): Case ID.
    * `delete`: Delete a specific moderation case.
      * `<id>` (Integer): Case ID.
  * `reset-xp`: Reset a user's XP progression.
    * `<user>` (User): Target user.
    * `<confirm>` (Boolean): Confirmation flag.

### `/warn`
Advanced warning management and automated penalty triggers.
* **Subcommands & Groups:**
  * `create`: Issue a warning to a user.
    * `<user>` (User): The user to warn.
    * `<title>` (String): Summary/title of the warning.
    * `[description]` (String): Detailed description/context.
    * `[level]` (Integer): Severity level (1-10).
    * `[proof]` (Attachment): Supporting screenshot/attachment.
  * `edit`: Edit an existing warning.
    * `<warnid>` (String): Warning ID to edit.
  * `lookup`: Look up details of a specific warning.
    * `<warnid>` (String): Warning ID.
  * `delete`: Delete a specific warning.
    * `<warnid>` (String): Warning ID.
  * `view`: View all warnings for a user.
    * `<user>` (User): Target user.
  * `purge`: Remove all warnings for a user.
    * `<user>` (User): Target user.
  * **`automation` (Subcommand Group):**
    * `create`: Create an automation trigger (e.g., timeout/ban when warn count or level is reached).
      * `<trigger_type>` (String): Choices: `Warn Count`, `Warn Level`.
      * `<trigger_value>` (Integer): Threshold number that activates the trigger (1-100).
      * `[notify_channel]` (Channel): Channel to send alert when automation triggers.
    * `view`: View all active warning automations in the server.
    * `delete`: Delete a warning automation.
      * `<automation_id>` (String): Automation ID to delete.

---

## 7. Tickets

Manage ticket panels, multi-department support setups, and active ticket workflows.

### `/ticket`
* **Subcommands & Groups:**
  * `claim`: Claim an active ticket (for support staff).
  * `close`: Close an active ticket.
    * `[reason]` (String): Reason for closing the ticket.
  * `stats`: View ticket system statistics for the server.
  * **`panel` (Subcommand Group):**
    * `create`: Create a new ticket panel configuration.
      * `<panel_id>` (String): Unique ID for the panel (3-20 chars).
      * `<title>` (String): Panel title.
      * `<description>` (String): Panel description.
      * `[button_label]` (String): Text on the open ticket button.
      * `[button_style]` (Integer): Choices: `Primary (Blue)`, `Secondary (Gray)`, `Success (Green)`, `Danger (Red)`.
      * `[category]` (Channel): Discord Category where tickets will be created.
      * `[support_role]` (Role): Staff role granted access to tickets.
      * `[max_tickets]` (Integer): Max concurrent tickets per user (1-10).
      * `[welcome_message]` (String): Initial message sent when a ticket opens.
    * `load`: Send an existing ticket panel to a specific channel.
      * `<panel_id>` (String): ID of the panel to load.
      * `<channel>` (Channel): Text channel to post the panel in.
    * `delete`: Delete a ticket panel configuration.
      * `<panel_id>` (String): ID of the panel to delete.
    * `list`: List all configured ticket panels in the server.
    * `edit`: Open interactive editor for a ticket panel.
      * `<panel_id>` (String): ID of the panel to edit.
    * `add_dept`: Add a specific department choice to a ticket panel.
      * `<panel_id>` (String): Target panel ID.
      * `<dept_id>` (String): Unique department ID.
      * `<name>` (String): Department display name.
      * `<description>` (String): Department description.
      * `[support_role]` (Role): Specific support role for this department.
      * `[category]` (Channel): Specific category channel for this department.
      * `[welcome_message]` (String): Specific welcome message for this department.
    * `list_depts`: List all departments configured on a panel.
      * `<panel_id>` (String): Target panel ID.
    * `remove_dept`: Remove a department from a panel.
      * `<panel_id>` (String): Target panel ID.
      * `<dept_id>` (String): Department ID to remove.

---

## 8. Utility

General server utility, Join-to-Create voice management, localization, and information lookups.

### `/jtc`
Manage Join-to-Create (J2C/JTC) dynamic voice channels.
* **Subcommands:**
  * `setup`: Initial configuration for JTC.
    * `<base_voice>` (Channel): The master voice channel users join to create their own room.
    * `<category>` (Channel): Category where dynamic voice channels will be created.
    * `<panel_channel>` (Channel): Text channel where the JTC management panel will be sent.
    * `[name_format]` (String): Custom naming template for created channels.
  * `disable`: Disable JTC functionality and clear configuration.
  * `panel`: Send or update the JTC management UI panel in the configured channel.

### `/language`
Manage multi-language preferences per user or server.
* **Subcommands:**
  * `available`: List all supported languages (`en`, `de`, `es`, `fr`).
  * `current`: Show your active language setting.
  * `set`: Change your language preference.
    * `<language>` (String): Choices: `English`, `Deutsch`, `Español`, `Français`.

### `/ping`
Check bot websocket latency and Discord API response times.

### `/utils`
Comprehensive lookup tools and bot statistics.
* **Subcommands:**
  * `avatar`: View a user's full-size avatar.
    * `[user]` (User): Target user.
  * `banner`: View a user's profile banner.
    * `[user]` (User): Target user.
  * `steam`: Look up a Steam user profile.
    * `<username>` (String): Steam username or custom profile URL.
  * `userinfo`: View detailed Discord account and guild member info.
    * `[user]` (User): Target user.
  * `whois`: Look up any Discord user by their ID.
    * `<user_id>` (String): Discord User ID.
  * `roleinfo`: View detailed information about a server role.
    * `<role>` (Role): Target role.
  * `serverinfo`: View detailed server statistics, boost status, and info.
  * `help`: View interactive command help.
    * `[command]` (String): Specific command name (supports autocomplete).
  * `support`: Get the official bot support server invite link.
  * `stats`: View bot uptime, memory usage, and global system statistics.

---

## 9. XP & Engagement

Gamification features, leveling, quests, achievements, and peer recognition.

### `/achievements`
View your unlocked achievements and available server achievements.

### `/prestige`
Trade in your max level to gain a prestige rank and exclusive perks/rewards.

### `/quests`
View active engagement quests (e.g., message goals, voice time goals) and track your current progress.

### `/thanks`
Give thanks and reputation points to another user for being helpful.
* **Options:**
  * `<user>` (User): The user to thank.
  * `[reason]` (String): Reason for thanking them.

### `/xp`
Check levels, leaderboards, and configure rank cards.
* **Subcommands:**
  * `rank`: View your or another user's visual XP rank card.
    * `[user]` (User): Target user.
  * `leaderboard`: View the server's top XP leaderboard.
    * `[page]` (Integer): Page number to view.
  * `configuration`: View the server's XP multipliers, voice XP rates, and role rewards.
  * `card`: Customize the visual colors and aesthetics of your rank card.
