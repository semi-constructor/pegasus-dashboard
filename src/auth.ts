import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import WebAuthn from "next-auth/providers/webauthn"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { authUsers, accounts, sessions, verificationTokens, authenticators } from "../schemas/auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
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
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify+guilds",
    }),
    WebAuthn({
      relayingParty: {
        name: "Pegasus Dashboard",
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.accessToken = token.accessToken;
      // @ts-ignore
      session.provider = token.provider;
      return session;
    },
  },
  experimental: {
    enableWebAuthn: true,
  },
})
