# Pegasus Dashboard Architecture

## The Immutability Protocol
This monorepo operates under a strict principle: **The Database Schemas are the Laws of Physics.** 
Located in `schemas/`, these files (`guilds.ts`, `users.ts`, `moderation.ts`, etc.) are entirely immutable. The frontend application, UI components, and API boundaries have been architected to map 1:1 against these structures without ever requesting an alteration to the schema.

## Monorepo Structure
```text
pegasus-dashboard/
├── schemas/                # The Immutable Source of Truth (Drizzle DB schemas)
├── apps/
│   └── web/                # Next.js 16 (App Router, React 19) Dashboard Shell
├── docs/                   # Architectural Documentation
└── package.json            # Root workspace configuration
```

## Performance & Data Strategy
- **Framework:** Next.js (App Router) leveraging React 19.
- **RSC (React Server Components):** Reads are executed server-side using Drizzle ORM directly connected to the database schema. This bypasses the need for an intermediate REST API layer and removes client-side loading waterfalls.
- **Mutations & Cache Invalidations:** Handled via Server Actions combined with `revalidatePath('/dashboard')` or `revalidateTag` to execute structural state updates instantly.
- **Real-Time Data:** For highly volatile data (like metric counters or real-time logs), Server-Sent Events (SSE) or WebSockets polling (via SWR) push state directly to the client layer without triggering full component remounts.
- **N+1 Mitigation:** Drizzle's relational query methods (`db.query...`) are used to execute tightly packed joins based strictly on the schemas in the root.

## Aesthetic Protocol
The design aesthetic is strictly dictated by the **Design Critic** agent.
- **Theme:** Pristine, enterprise gray/white. **No dark mode. No vibe-coding.**
- **Color Palette:** 
  - Backgrounds: `#ffffff`, `#f9fafb`
  - Borders: `#e5e7eb` (sharp, 1px)
  - Text: `#111827`, `#6b7280`
- **Typography:** 
  - Structural/Readability: `Geist Sans`
  - Metrics/Data/IDs: `Geist Mono`
- **Motion Strategy:**
  - `Framer Motion`: Used strictly for structural page layout transitions (entering views, sidebars).
  - `Anime.js`: Reserved for complex data visualizations, precisely timed counter updates, or graph rendering.

## Setup Instructions
```bash
npm install
npm run dev --workspace=@pegasus/web
```
