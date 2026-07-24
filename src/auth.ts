import NextAuth, { DefaultSession } from "next-auth";
import Discord from "next-auth/providers/discord";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./lib/db";
import { eq, and } from "drizzle-orm";
import {
  authUsers,
  accounts,
  sessions,
  verificationTokens,
  authenticators,
} from "../schemas";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      discordId: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: authUsers,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }),
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization:
        "https://discord.com/api/oauth2/authorize?scope=identify+email+guilds",
    }),
  ],
  pages: {
    // We can add custom pages here later if needed
  },
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        
        const [account] = await db
          .select({ providerAccountId: accounts.providerAccountId })
          .from(accounts)
          .where(and(eq(accounts.userId, user.id), eq(accounts.provider, 'discord')))
          .limit(1);
          
        if (account) {
          session.user.discordId = account.providerAccountId;
        }
      }
      return session;
    },
  },
});
