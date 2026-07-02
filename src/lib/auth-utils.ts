import { auth } from "@/auth";
import { getUserAdminGuilds } from "@/lib/api";

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
