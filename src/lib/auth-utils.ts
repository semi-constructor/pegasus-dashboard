import { auth } from "@/auth";
import { getUserAdminGuilds } from "@/lib/api";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function requireGlobalAdmin() {
  const session = await auth();
  
  if (!session || !session.user) {
    throw new Error("Unauthorized: You must be logged in");
  }

  let internalUserId = session.user.id as string;
  let discordId: string | null = null;

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("discord_user")?.value;
  if (userCookie) {
    try {
      discordId = JSON.parse(userCookie).id;
    } catch (e) {}
  }

  if (!internalUserId || internalUserId === "undefined") {
    if (discordId) {
      const account = await db.query.accounts.findFirst({
        where: (accounts, { eq, and }) =>
          and(
            eq(accounts.providerAccountId, discordId!),
            eq(accounts.provider, "discord"),
          ),
      });
      if (account) {
        internalUserId = account.userId;
      }
    }
  } else {
    if (!discordId) {
      const account = await db.query.accounts.findFirst({
        where: (accounts, { eq, and }) =>
          and(
            eq(accounts.userId, internalUserId),
            eq(accounts.provider, "discord"),
          ),
      });
      discordId = account?.providerAccountId || null;
    }
  }

  let adminIds: string[] = [];
  try {
    if (process.env.ADMIN) {
      adminIds = JSON.parse(process.env.ADMIN);
    }
  } catch (e) {
    adminIds = [process.env.ADMIN || ""];
  }

  if (!discordId || !adminIds.includes(discordId)) {
    throw new Error("Forbidden: You do not have global admin permissions");
  }

  const webauthnVerifiedCookie = cookieStore.get("webauthn_verified")?.value;
  const isWebAuthnVerified = webauthnVerifiedCookie === internalUserId;

  if (!isWebAuthnVerified) {
    throw new Error("Unauthorized: WebAuthn verification required");
  }

  return session;
}

export async function requireGuildAdmin(guildId: string) {
  const session = await auth();
  
  if (!session || !session.user) {
    throw new Error("Unauthorized: You must be logged in");
  }

  // @ts-ignore
  const accessToken = session.accessToken as string;
  
  if (!accessToken) {
    throw new Error("Unauthorized: No access token available");
  }

  // Fetch user's guilds and check permissions
  const adminGuilds = await getUserAdminGuilds(accessToken);
  const targetGuild = adminGuilds ? adminGuilds.find((g) => g.id === guildId) : null;

  if (!targetGuild || !targetGuild.isAdmin) {
    throw new Error("Forbidden: You do not have admin permissions for this server");
  }

  return session;
}
