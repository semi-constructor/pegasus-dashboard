import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import WebAuthn from "next-auth/providers/webauthn"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { authUsers, accounts, sessions, verificationTokens, authenticators } from "../schemas/auth"

console.log('DISCORD_CLIENT_ID:', process.env.DISCORD_CLIENT_ID);
console.log('DISCORD_CLIENT_SECRET:', process.env.DISCORD_CLIENT_SECRET ? 'SET' : 'MISSING');
console.log('AUTH_URL:', process.env.AUTH_URL);

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
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
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.accessToken = token.accessToken;
      // @ts-ignore
      session.provider = token.provider;
      // @ts-ignore
      session.discordId = token.providerAccountId;
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  experimental: {
    enableWebAuthn: true,
  },
})
