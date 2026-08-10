import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const authorId = "931870926797160538";

const blogData = [
  {
    title: "Welcome to Pegasus: The Ultimate Discord Manager",
    slug: "welcome-to-pegasus",
    shortDescription: "Discover how Pegasus is revolutionizing Discord server management with its all-in-one dashboard and feature-rich bot.",
    content: "# Welcome to Pegasus\n\nManaging a Discord server can be challenging, but Pegasus makes it a breeze. Our new dashboard brings everything into one place. From economy to moderation, you can configure it all instantly.\n\n## Why Pegasus?\n\n- **Next-Gen Dashboard:** Manage settings instantly without typing endless commands.\n- **All-in-One:** Stop relying on 10 different bots. Pegasus does it all.\n- **Open Source:** Self-host or contribute directly!\n\nStay tuned for more updates as we roll out features!"
  },
  {
    title: "Setting up Pegasus Dashboard from Source",
    slug: "setting-up-dashboard-source",
    shortDescription: "A complete guide on cloning, configuring, and running the Pegasus Next.js dashboard locally or in production.",
    content: "# Running the Pegasus Dashboard\n\nThe dashboard is built using **Next.js 16**, **Tailwind CSS v4**, and **Drizzle ORM**. Here is how to get it running.\n\n### Prerequisites\n\n- Node.js v20+\n- A PostgreSQL database (we recommend Neon)\n\n### Steps\n\n1. Clone the repository.\n2. Navigate to `/dashboard` and run `npm install`.\n3. Copy `.env.example` to `.env.local` and fill in your Discord OAuth and Database URLs.\n4. Run `npm run dev` to start the development server.\n\n```bash\ncp .env.example .env.local\nnpm run dev\n```\n\nThat's it! You're ready to start managing servers."
  },
  {
    title: "Deploying the Discord Bot: The Deploy Directory",
    slug: "deploying-discord-bot",
    shortDescription: "Learn how to use the `deploy` directory to effortlessly push your bot to production using Docker or PM2.",
    content: "# Deploying the Pegasus Bot\n\nInside the `/bot` folder, you will notice a `deploy` directory. This is designed to make production deployments seamless.\n\n## Using Docker\n\nThe easiest way to run the bot is via Docker. \n\n```yaml\nversion: '3.8'\nservices:\n  pegasus-bot:\n    build: .\n    env_file: .env\n    restart: unless-stopped\n```\n\nSimply run `docker-compose up -d` and the bot will connect to Discord and sync its slash commands automatically. Remember to set your `DISCORD_TOKEN` in the `.env` file first!"
  },
  {
    title: "Mastering the Engagement Hub",
    slug: "mastering-engagement-hub",
    shortDescription: "Keep your community active and rewarded using the Pegasus Engagement Hub.",
    content: "# Engagement Hub\n\nActivity is the lifeblood of any Discord server. The **Engagement Hub** tracks user activity and rewards them accordingly.\n\n## Features\n\n- **Message Tracking:** Monitor who is keeping the chat alive.\n- **Voice Tracking:** Reward users for hanging out in voice channels.\n- **Social Feeds:** Automatically post updates from YouTube, Twitter, and Reddit to keep discussions flowing.\n\nConfigure all of this directly from the dashboard under your server's Engagement tab."
  },
  {
    title: "Automating Moderation with Pegasus AutoMod",
    slug: "automating-moderation",
    shortDescription: "Protect your server from spam, phishing, and toxicity using our advanced AutoMod features.",
    content: "# Pegasus AutoMod\n\nKeeping a server safe shouldn't require a 24/7 moderation team. With Pegasus AutoMod, you can set rules and let the bot handle the rest.\n\n### Available Filters\n\n1. **Anti-Spam:** Prevent rapid-fire messaging.\n2. **Anti-Phishing:** Automatically detect and delete known malicious links.\n3. **Word Filters:** Block profanity or specific phrases.\n4. **Anti-Caps:** Warn users who shout in chat.\n\nYou can set automated punishments (warn, mute, kick, ban) based on the severity of the infraction."
  },
  {
    title: "Creating Powerful Custom Commands",
    slug: "creating-custom-commands",
    shortDescription: "Tailor the bot to your community's needs by creating your own slash commands directly from the dashboard.",
    content: "# Custom Commands\n\nWhy wait for developers to add a command when you can build it yourself? The Custom Commands module allows server admins to create text-based or rich embed responses.\n\n## How it works\n\n1. Go to **Custom Commands** in the dashboard.\n2. Click **Create New**.\n3. Define the command name (e.g., `/rules`).\n4. Write the response. You can use markdown and placeholders like `{user.mention}`!\n5. Save, and the command is instantly available in your server."
  },
  {
    title: "Deep Dive: Pegasus Economy System",
    slug: "pegasus-economy-system",
    shortDescription: "Build a thriving virtual economy with shops, trading, and daily rewards.",
    content: "# The Pegasus Economy\n\nEngage your users with a fully-fledged virtual economy.\n\n## Earning Coins\n\nUsers can earn currency by:\n- Chatting (configurable payout rates)\n- Using `/daily`, `/weekly`, and `/work` commands\n- Winning giveaways\n\n## The Shop\n\nYou can configure a custom server shop where users can buy roles, special permissions, or even real-world prizes (handled via tickets). It's entirely up to you!"
  },
  {
    title: "Running Giveaways like a Pro",
    slug: "running-giveaways",
    shortDescription: "Boost server growth and engagement by hosting automated giveaways with requirements.",
    content: "# Hosting Giveaways\n\nGiveaways are a proven way to boost engagement. Pegasus makes running them effortless.\n\n### Configuration Options\n\n- **Prize & Duration:** Set what you are giving away and for how long.\n- **Winners:** Choose how many users will win.\n- **Requirements:** Require users to have a specific role or a certain level in the XP system to enter!\n\nThe bot automatically handles drawing winners and notifying them when the timer ends."
  },
  {
    title: "The Ultimate Guide to the Ticket System",
    slug: "ticket-system-guide",
    shortDescription: "Provide top-tier support to your members using ticket categories and transcripts.",
    content: "# Support Tickets\n\nStop using messy DMs for support. The Pegasus Ticket system organizes help requests into clean, private channels.\n\n## Setup\n\n1. Create a **Ticket Panel** in the dashboard.\n2. Define **Categories** (e.g., General Support, Player Reports, Billing).\n3. Assign roles that can view tickets in each category.\n\nWhen a ticket is closed, Pegasus automatically generates a web-based transcript that admins can review later."
  },
  {
    title: "Setting up Leveling and XP",
    slug: "setting-up-leveling",
    shortDescription: "Reward your most active members with levels and role rewards.",
    content: "# Leveling and XP\n\nGamify your server by enabling the XP system.\n\n## How it works\n\nUsers gain XP for sending messages (with anti-spam cooldowns). As they level up, you can configure the bot to automatically assign them **Role Rewards**.\n\n### Customization\n\nYou can tweak the XP rate, set multiplier roles (e.g., give Server Boosters 1.5x XP), and even customize the rank card background!"
  },
  {
    title: "Advanced Reaction Roles",
    slug: "advanced-reaction-roles",
    shortDescription: "Let users self-assign roles using interactive buttons and dropdowns.",
    content: "# Reaction Roles (Now with Buttons!)\n\nReaction roles are a thing of the past. Pegasus uses modern Discord UI components like Buttons and Select Menus for role assignment.\n\n## Creating a Menu\n\nIn the dashboard, navigate to Reaction Roles. Create a new menu, add your roles, and customize the button colors and emojis. Once saved, the bot will post the interactive menu in your designated channel. Users just click to get the role!"
  },
  {
    title: "Using the Control Panel Effectively",
    slug: "using-control-panel",
    shortDescription: "Send announcements and embeds directly to your server from the web dashboard.",
    content: "# The Control Panel\n\nNeed to make a server-wide announcement? Don't mess around with JSON embed generators. \n\nThe **Control Panel** allows you to construct beautiful rich embeds using a WYSIWYG editor and send them directly to any channel in your server as the bot. You can even edit existing bot messages!"
  },
  {
    title: "Setting up Join-to-Create Voice Channels",
    slug: "join-to-create-voice",
    shortDescription: "Keep your server clean by using dynamic, temporary voice channels.",
    content: "# Join-to-Create (JTC)\n\nInstead of having 50 empty voice channels cluttering your server, use JTC.\n\n## Setup\n\n1. Designate a \"Hub\" voice channel.\n2. When a user joins the Hub, the bot instantly creates a private, temporary voice channel just for them and moves them into it.\n3. The user has full control over their channel (rename, limit users, lock, kick).\n4. When everyone leaves, the channel is automatically deleted."
  },
  {
    title: "Understanding API Metrics",
    slug: "understanding-api-metrics",
    shortDescription: "A look into the Admin Dashboard's performance tracking and API metrics.",
    content: "# API Metrics\n\nFor those self-hosting Pegasus, keeping an eye on performance is crucial. The Admin Dashboard includes an API Metrics page.\n\nHere you can view:\n- Average response times\n- Database query latency\n- Request volumes per endpoint\n- Error rates\n\nThis data is invaluable for scaling your bot as it grows to thousands of servers."
  },
  {
    title: "Security Center and Passkeys",
    slug: "security-center-passkeys",
    shortDescription: "How Pegasus secures admin routes using WebAuthn and Passkeys.",
    content: "# WebAuthn & Security\n\nAdmin routes require extra protection. Passwords can be stolen, but hardware keys and biometrics cannot.\n\nPegasus uses **WebAuthn** to secure the `/admin` routes. Before accessing sensitive data, admins must register a Passkey (like TouchID, Windows Hello, or a YubiKey). This ensures that even if a Discord account is compromised, the dashboard remains secure."
  },
  {
    title: "Gathering Feedback with Surveys",
    slug: "gathering-feedback-surveys",
    shortDescription: "Create dynamic forms and surveys to gather feedback from your community.",
    content: "# Server Surveys\n\nWant to know what your community thinks about a recent change? Use the Surveys module.\n\nBuild forms with multiple-choice, text, and rating questions directly in the dashboard. Share the link in your server, and view all the responses and statistics aggregated in a beautiful, analytical view."
  },
  {
    title: "Automating Server Operations with Schedule",
    slug: "automating-operations-schedule",
    shortDescription: "Schedule recurring announcements and tasks effortlessly.",
    content: "# Scheduled Tasks\n\nNeed to remind your server about a weekly event? The Schedule module allows you to create cron-like tasks.\n\nSet a message, choose a channel, and define the interval (e.g., Every Friday at 5 PM). The bot will handle the rest, ensuring your community never misses an update."
  },
  {
    title: "Configuring the Starboard",
    slug: "configuring-starboard",
    shortDescription: "Highlight your community's best moments with a starboard.",
    content: "# Starboard\n\nThe Starboard is a hall of fame for your server. When a message receives a certain amount of ⭐ reactions, the bot copies it to a dedicated Starboard channel.\n\nIn the dashboard, you can configure the threshold (how many stars are needed), the channel, and even which emoji triggers it (it doesn't have to be a star!)."
  },
  {
    title: "Managing Bug Reports and Feedback",
    slug: "managing-bug-reports",
    shortDescription: "How the Pegasus team manages user feedback directly inside the dashboard.",
    content: "# Internal Bug Reporting\n\nPegasus includes a built-in bug reporting tool for users to submit issues they encounter on the dashboard. \n\nAdmins can view these reports in the Admin Dashboard, categorize them, and mark them as resolved. It's a closed-loop system that keeps the development team focused on what matters most."
  },
  {
    title: "Creating Ticket Workflows",
    slug: "creating-ticket-workflows",
    shortDescription: "Advanced support management with custom ticket workflows.",
    content: "# Advanced Ticket Workflows\n\nFor large servers, standard tickets aren't enough. You need workflows.\n\nWith Pegasus, you can create multi-step ticket forms. When a user clicks \"Open Ticket\", the bot can ask them a series of questions (e.g., \"What is your username?\", \"Describe the issue\") *before* the ticket is created. This ensures your support team has all the necessary information upfront."
  },
  {
    title: "Understanding Discord Bot Intents",
    slug: "understanding-discord-intents",
    shortDescription: "A technical explanation of which Privileged Intents Pegasus requires and why.",
    content: "# Discord Intents\n\nTo function properly, the Pegasus bot requires specific Privileged Intents from the Discord Developer Portal.\n\n- **Server Members Intent:** Required to track member joins/leaves and manage roles.\n- **Message Content Intent:** Required for AutoMod, custom text commands, and XP tracking.\n\nEnsure these are toggled ON before starting your bot!"
  },
  {
    title: "The Technology Stack behind Pegasus",
    slug: "technology-stack-pegasus",
    shortDescription: "A deep dive into Next.js, Drizzle ORM, and the tools that power Pegasus.",
    content: "# Our Tech Stack\n\nPegasus is built for speed and scalability.\n\n- **Frontend:** Next.js App Router with React 19.\n- **Styling:** Tailwind CSS v4 and Shadcn UI for beautiful components.\n- **Database:** PostgreSQL accessed via Drizzle ORM for type-safe queries.\n- **Bot:** Built with discord.js, utilizing a custom scalable architecture.\n\nThis stack allows us to iterate incredibly fast while maintaining high performance."
  },
  {
    title: "Integrating Pegasus with Neon Serverless Postgres",
    slug: "integrating-neon-postgres",
    shortDescription: "Why we chose Neon for our database and how to set it up.",
    content: "# Neon Serverless Postgres\n\nWe recommend using [Neon](https://neon.tech) for hosting the Pegasus database. \n\nNeon separates storage and compute, allowing it to scale instantly to zero when not in use, making it incredibly cost-effective for self-hosting. Plus, its branching feature is perfect for testing new schema changes locally before pushing them to production!"
  },
  {
    title: "Using Next-Intl for a Multilingual Dashboard",
    slug: "multilingual-dashboard-next-intl",
    shortDescription: "How we implemented internationalization (i18n) to support multiple languages.",
    content: "# Internationalization (i18n)\n\nPegasus is used globally, which is why the dashboard is fully localized using `next-intl`.\n\nLanguage files are stored in the `/messages` directory. Adding a new language is as simple as translating a JSON file. The dashboard automatically detects the user's preferred browser language and routes them accordingly, while allowing manual overrides via the footer dropdown."
  },
  {
    title: "How Pegasus Handles Caching and Revalidation",
    slug: "caching-and-revalidation",
    shortDescription: "Optimizing dashboard performance with Next.js caching strategies.",
    content: "# Caching Strategies\n\nTo make the dashboard feel instantaneous, we aggressively cache database queries.\n\nWhen a user updates a setting (e.g., changes the server prefix), we use Next.js's `revalidatePath` to instantly clear the cache for that specific server. This ensures that the user always sees the most up-to-date information without having to constantly hammer the database on every page load."
  },
  {
    title: "Tips for Managing Large Discord Communities",
    slug: "managing-large-communities",
    shortDescription: "Best practices for scaling your server and keeping moderation manageable.",
    content: "# Scaling Your Community\n\nWhen your server hits 10,000+ members, moderation changes.\n\n1. **Automate everything:** Rely heavily on Pegasus AutoMod to filter the noise.\n2. **Use robust ticket categories:** Don't let support requests overwhelm general chat.\n3. **Empower your community:** Use Starboards and Engagement Hubs to let users highlight good content organically."
  },
  {
    title: "Troubleshooting Common Deployment Issues",
    slug: "troubleshooting-deployment",
    shortDescription: "Solutions to the most common issues faced when self-hosting Pegasus.",
    content: "# Deployment Troubleshooting\n\nRunning into issues? Here are the most common fixes:\n\n- **Bot is offline but process is running:** Check your `DISCORD_TOKEN` and ensure Privileged Intents are enabled.\n- **Database connection failed:** Ensure your Neon connection string is correct and your IP is whitelisted.\n- **Dashboard 500 errors:** Run `npx drizzle-kit push` to ensure your database schema is fully up to date with the codebase."
  },
  {
    title: "Customizing the Bot's Appearance and Presence",
    slug: "customizing-bot-presence",
    shortDescription: "How to change the bot's status, activity, and avatar.",
    content: "# Bot Customization\n\nA custom bot should feel like *your* bot.\n\nIn the bot's configuration files, you can easily change the activity status (e.g., \"Watching 500 servers\" or \"Playing a game\"). To change the avatar and name, you'll need to do that directly through the Discord Developer Portal. The dashboard will automatically sync and display the new avatar!"
  },
  {
    title: "Optimizing Postgres Queries with Drizzle",
    slug: "optimizing-postgres-drizzle",
    shortDescription: "A developer's guide to writing efficient queries for the dashboard.",
    content: "# Drizzle ORM Optimization\n\nWhen building the dashboard, we chose Drizzle ORM for its SQL-like syntax and incredible performance. \n\nBy carefully defining indexes on columns that are frequently queried (like `guild_id` or `user_id`), we ensure that even servers with millions of logged messages load their analytics in milliseconds. Always remember to run `drizzle-kit generate` when adding new indexes!"
  },
  {
    title: "The Future of Pegasus: Roadmap and Upcoming Features",
    slug: "pegasus-future-roadmap",
    shortDescription: "A sneak peek into what we are building next for the Pegasus ecosystem.",
    content: "# The Roadmap\n\nWe are never done building. Here is a sneak peek at what's coming next:\n\n- **Music Features:** High-quality voice channel music playback.\n- **Advanced Webhooks:** Trigger external APIs when events happen in your server.\n- **Custom Dashboard Themes:** Allow users to build custom CSS themes for their public server pages.\n\nStay tuned, and keep providing feedback via the bug report system!"
  }
];

async function seed() {
  console.log("Seeding 30 blogs...");
  const { db } = await import("../src/lib/db");
  const { blogs } = await import("../schemas/blogs");
  const { authUsers } = await import("../schemas/auth");

  console.log("Ensuring author exists...");
  await db.insert(authUsers).values({
    id: authorId,
    name: "Pegasus Admin",
  }).onConflictDoNothing();
  
  // Calculate start date (30 days ago to today, or today to 30 days in the future?)
  // The prompt says "scheduled 1 per day for the next 30 days"
  const now = new Date();
  
  for (let i = 0; i < blogData.length; i++) {
    const publishDate = new Date(now);
    publishDate.setDate(publishDate.getDate() + i); // Schedule starting from today to 30 days from now
    
    await db.insert(blogs).values({
      title: blogData[i].title,
      slug: blogData[i].slug,
      shortDescription: blogData[i].shortDescription,
      content: blogData[i].content,
      publishedAt: publishDate,
      authorId: authorId,
    });
    
    console.log(`Inserted: ${blogData[i].title} - Scheduled for ${publishDate.toDateString()}`);
  }
  
  console.log("Done!");
  process.exit(0);
}

seed().catch(console.error);
