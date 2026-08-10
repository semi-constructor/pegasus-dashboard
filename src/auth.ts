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
  secret: process.env.AUTH_SECRET,
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
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    signIn: async ({ account }) => {
      if (account) {
        await db
          .update(accounts)
          .set({
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
          })
          .where(
            and(
              eq(accounts.provider, account.provider),
              eq(accounts.providerAccountId, account.providerAccountId)
            )
          );
      }
      return true;
    },
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.providerAccountId = account.providerAccountId;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.discordId = token.providerAccountId as string;
      }
      return session;
    },
  },
});
