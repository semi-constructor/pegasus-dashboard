import NextAuth from "next-auth"
import type { Session } from "next-auth"
import Discord from "next-auth/providers/discord"
import WebAuthn from "next-auth/providers/webauthn"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { authUsers, accounts, sessions, verificationTokens, authenticators } from "../schemas/auth"
import { eq } from "drizzle-orm"

console.log('DISCORD_CLIENT_ID:', process.env.DISCORD_CLIENT_ID);
console.log('DISCORD_CLIENT_SECRET:', process.env.DISCORD_CLIENT_SECRET ? 'SET' : 'MISSING');
console.log('AUTH_URL:', process.env.AUTH_URL);

interface ExtendedSession extends Session {
  accessToken?: string;
  provider?: string;
  discordId?: string;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: true,
  logger: {
    error(error: Error): void {
      console.error("[AUTH FULL ERROR]", error.name, error.message);
      console.error("[AUTH STACK]", error.stack);
      if ("cause" in error) {
        console.error("[AUTH CAUSE]", error.cause);
      }
    },
    warn(code: string): void {
      console.warn("[AUTH WARN]", code);
    },
    debug(code: string, metadata?: unknown): void {
      console.debug("[AUTH DEBUG]", code, metadata);
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: authUsers as any,
    accountsTable: accounts as any,
    sessionsTable: sessions as any,
    verificationTokensTable: verificationTokens as any,
    authenticatorsTable: authenticators as any,
  }),
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: "identify guilds" } },
    }),
    WebAuthn({
      relayingParty: {
        id: process.env.NODE_ENV === "development" ? "localhost" : "pegasus.cptcr.uk",
        name: "Pegasus Dashboard",
        origin: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://pegasus.cptcr.uk",
      },
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }: { session: Session; user: { id: string } }): Promise<ExtendedSession> {
      const extendedSession = session as ExtendedSession;

      if (session.user) {
        session.user.id = user.id;
      }

      // Database sessions don't carry account info by default,
      // so pull the linked Discord account manually
      const [discordAccount] = await db
        .select({
          access_token: accounts.access_token,
          provider: accounts.provider,
          providerAccountId: accounts.providerAccountId,
        })
        .from(accounts)
        .where(eq(accounts.userId, user.id))
        .limit(1);

      if (discordAccount) {
        extendedSession.accessToken = discordAccount.access_token ?? undefined;
        extendedSession.provider = discordAccount.provider;
        extendedSession.discordId = discordAccount.providerAccountId;
      }

      return extendedSession;
    },
  },
  experimental: {
    enableWebAuthn: true,
  },
})