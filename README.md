# Pegasus Dashboard
https://pegasus.cptcr.uk
![Pegasus Dashboard](public/pegasus-icon.png)

**Pegasus Dashboard** is the powerful, modern web dashboard designed for managing and monitoring the **Pegasus Discord Bot**. Built with Next.js, TypeScript, TailwindCSS, and Drizzle ORM, the dashboard seamlessly integrates with Pegasus's built-in Express REST API to provide real-time guild analytics, system diagnostics, and direct module management.

---

## ✨ Key Features

- **📊 Real-Time Monitoring & Analytics**: Track live guild analytics, database query profiling, cache metrics, and hardware health directly from the bot's Express API server.
- **⚙️ Dynamic Module Management**: Configure and toggle core bot modules on the fly, including:
  - **Join to Create (J2C)**: Manage dynamic voice channels, lock/unlock status, and user limits.
  - **AutoMod V2 & Moderation**: Set up keyword/regex filtering, spam thresholds, quarantine vaults, and warning automations.
  - **Economy & Marketplace**: Manage custom server item shops, currency settings, and inventory items.
  - **Tickets Support Panels**: Configure multi-department ticketing panels, claim/freeze/lock actions, and routing.
  - **XP & Engagement**: Track leveling progression, configure visual rank cards, manage role rewards, and view leaderboards.
  - **Giveaways**: Host and manage giveaways with custom entry requirements and bonus multipliers.
- **🔐 Secure Authentication**: Integrated with Discord OAuth2 via NextAuth. Assign developer admin access to specific user IDs for complete control over database records and server configurations.

---

## 🚀 Tech Stack & Infrastructure

The Pegasus Dashboard is engineered for performance, type safety, and scalability using modern web standards:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/)
- **ORM & Database**: [Drizzle ORM](https://orm.drizzle.team/) connected to a serverless [Neon PostgreSQL Database](https://neon.tech/)
- **Bot Communication**: Secure HTTP REST API powered by Express with Bearer token authentication and in-memory caching.
- **Infrastructure**: Configured for deployment across Cloudflare and Vercel.

For a full deep-dive into the underlying infrastructure and technologies, check out [TECH.md](TECH.md).

---

## 📖 Complete Documentation

Pegasus maintains comprehensive internal documentation covering every aspect of the ecosystem:

- 📄 **[Tech & Infrastructure Guide (TECH.md)](TECH.md)**: Detailed overview of our cloud infrastructure, database architecture, and technology choices.
- 🤖 **[Bot Systems Architecture (BOT.md)](BOT.md)**: High-level architectural overview of the core features, automation systems, and module capabilities built into the Pegasus Discord Bot.
- 🔌 **[REST API Specification (API_DOC.md)](API_DOC.md)**: Exhaustive documentation of all HTTP REST endpoints, request/response schemas, rate limits, caching policies, and error handling.
- slash **[Commands Documentation (COMMANDS_DOC.md)](COMMANDS_DOC.md)**: Complete reference guide to all slash commands, subcommands, and parameter options available in the bot.

---

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed and configured before starting local development:
- **Node.js 20+**
- A **Neon PostgreSQL** database (or any PostgreSQL instance)
- A **Discord Application** configured with OAuth2 credentials

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/semi-constructor/pegasus-dashboard.git
cd pegasus-dashboard
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory (you can use `.env.example` as a template):

```env
# API Configuration
API_URL=http://localhost:2000
BOT_API_TOKEN=your_bot_api_bearer_token

# Database Configuration
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/dbname?sslmode=require"

# Discord OAuth2 & Bot Settings
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_BOT_TOKEN=your_discord_bot_token
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_discord_client_id

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=a_secure_random_secret

# Application Settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Administrators (Array of Discord User IDs with full DB access)
ADMIN=["123456789012345678"]
```

### 3. Running the Development Server

Start the local development server:

```bash
npm run dev
# or
npm run local
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the dashboard.

### 4. Building for Production

To create a production build and test it locally:

```bash
npm run build
npm run start
# or use the combined script
npm run prod
```

---

## 🛡️ License & Contributing

Contributions, feature requests, and bug reports are welcome! Feel free to check out the issues page or submit a pull request.
