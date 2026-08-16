import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { accounts } from "../../schemas/auth";
import { eq, and } from "drizzle-orm";
import { getCachedData } from "@/lib/redis";
import { getGuild } from "@/lib/discord-api";

const DISCORD_API = "https://discord.com/api/v10";

export interface AuthResult {
  session: {
    user: {
      id: string;
      discordId: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  };
  discordId: string;
}

/**
 * Verifies the current session user has MANAGE_GUILD or ADMINISTRATOR
 * on the specified guild. Redirects to sign-in if no session, throws
 * a 403 redirect if the user lacks permission.
 */
export async function requireGuildAdmin(guildId: string): Promise<AuthResult> {
  if (!/^\d{17,20}$/.test(guildId)) {
    redirect("/dashboard");
  }

  const guildInfo = await getGuild(guildId);
  if (!guildInfo) {
    redirect("/dashboard");
  }

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const discordId = (session.user as any).discordId;

  if (!discordId) {
    redirect("/api/auth/signin");
  }

  // Get user's access token to check guild permissions
  const [account] = await db
    .select({ access_token: accounts.access_token })
    .from(accounts)
    .where(and(eq(accounts.userId, session.user.id), eq(accounts.provider, "discord")))
    .limit(1);

  if (!account?.access_token) {
    redirect("/api/auth/signin");
  }

  // Check if the user is a bot admin
  let adminIds: string[] = [];
  try {
    adminIds = JSON.parse(process.env.ADMIN || "[]");
  } catch {
    adminIds = (process.env.ADMIN_DISCORD_IDS || "").split(",").map((id) => id.trim());
  }

  // Filter out empty strings in case ADMIN=[""]
  adminIds = adminIds.filter(id => id.trim() !== "");

  const isBotAdmin = adminIds.length > 0 && adminIds.includes(discordId);

  // Check if user has MANAGE_GUILD or ADMINISTRATOR on this specific guild
  const hasPermission = await getCachedData(
    `guild_perm:${discordId}:${guildId}`,
    async () => {
      const res = await fetch(`${DISCORD_API}/users/@me/guilds`, {
        headers: {
          Authorization: `Bearer ${account.access_token}`,
        },
      });

      if (!res.ok) return false;

      const guilds = await res.json();
      const guild = guilds.find((g: any) => g.id === guildId);

      if (!guild) return false;

      const perms = BigInt(guild.permissions);
      // MANAGE_GUILD = 0x20, ADMINISTRATOR = 0x8
      return guild.owner || (perms & BigInt(0x20)) === BigInt(0x20) || (perms & BigInt(0x8)) === BigInt(0x8);
    },
    30 // Cache for 30 seconds
  );

  if (!hasPermission && !isBotAdmin) {
    redirect("/dashboard");
  }

  return {
    session: session as AuthResult["session"],
    discordId,
  };
}

/**
 * Checks if the current user is a bot owner/staff member.
 * Used to gate the security module and admin panel.
 */
export async function requireBotOwner(): Promise<AuthResult> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const discordId = (session.user as any).discordId;

  if (!discordId) {
    redirect("/api/auth/signin");
  }

  let adminIds: string[] = [];
  try {
    adminIds = JSON.parse(process.env.ADMIN || "[]");
  } catch {
    adminIds = (process.env.ADMIN_DISCORD_IDS || "").split(",").map((id) => id.trim());
  }

  adminIds = adminIds.filter(id => id.trim() !== "");

  if (adminIds.length === 0 || !adminIds.includes(discordId)) {
    redirect("/dashboard");
  }

  return {
    session: session as AuthResult["session"],
    discordId,
  };
}
