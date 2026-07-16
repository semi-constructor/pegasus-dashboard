import { auth } from "@/auth";
import { getUserAdminGuilds } from "@/lib/api";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function requireGlobalAdmin() {
  const session = await auth();
  
  if (!session || !session.user) {
    throw new Error("Unauthorized: You must be logged in");
  }

  const internalUserId = session.user.id as string;
  let discordId: string | null = null;

  const account = await db.query.accounts.findFirst({
    where: (accounts, { eq, and }) =>
      and(
        eq(accounts.userId, internalUserId),
        eq(accounts.provider, "discord"),
      ),
  });
  discordId = account?.providerAccountId || null;

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

  const cookieStore = await cookies();
  const webauthnVerifiedCookie = cookieStore.get("webauthn_verified")?.value;
  if (!webauthnVerifiedCookie) {
    throw new Error("Unauthorized: WebAuthn verification required");
  }
  const [cookieUserId, cookieSig] = webauthnVerifiedCookie.split('.');
  const expectedSignature = crypto.createHmac('sha256', process.env.AUTH_SECRET!)
    .update(internalUserId)
    .digest('hex');
  const isWebAuthnVerified = cookieUserId === internalUserId && cookieSig === expectedSignature;

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

  // Check if system admin
  const discordId = (session as any).discordId as string | undefined;
  let isSystemAdmin = false;
  if (discordId) {
    let adminIds: string[] = [];
    try {
      if (process.env.ADMIN) {
        adminIds = JSON.parse(process.env.ADMIN);
      }
    } catch {
      adminIds = [process.env.ADMIN || ""];
    }
    isSystemAdmin = adminIds.includes(discordId);
  }

  if (isSystemAdmin) {
    return session;
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
