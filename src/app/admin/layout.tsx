import React from "react";
import { redirect } from "next/navigation";
import { AdminTopNav } from "@/components/AdminTopNav";
import AdminLoginPortal from "@/components/AdminLoginPortal";
import { AmbientBackground } from "@/components/AmbientBackground";
import { ScrollHeader } from "@/components/ScrollHeader";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { authenticators } from "../../../schemas/auth";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Not Logged In -> Ask to login with Discord
  if (!session?.user) {
    return <AdminLoginPortal state="discord" />;
  }

  const internalUserId = session.user.id as string;
  let discordId: string | null = null;

  const cookieStore = await import("next/headers").then((m) => m.cookies());

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

  // Logged in, but not admin -> redirect to /dashboard
  if (!discordId || !adminIds.includes(discordId)) {
    redirect("/dashboard");
  }

  // Admin Verified. Check for Passkeys using the internal userId
  let userAuthenticators: any[] = [];
  if (internalUserId) {
    userAuthenticators = await db.query.authenticators.findMany({
      where: eq(authenticators.userId, internalUserId),
    });
  }

  // Prompt to add passkey if they don't have any.
  // This correctly kicks them out of the admin UI if they delete their last passkey.
  if (userAuthenticators.length === 0) {
    return <AdminLoginPortal state="register-passkey" />;
  }

  const webauthnVerifiedCookie: string | undefined =
    cookieStore.get("webauthn_verified")?.value;
    
  let isWebAuthnVerified = false;
  if (webauthnVerifiedCookie) {
    const [cookieUserId, cookieSig] = webauthnVerifiedCookie.split('.');
    if (cookieUserId && cookieSig) {
      const expectedSignature = crypto.createHmac('sha256', process.env.AUTH_SECRET!)
        .update(internalUserId)
        .digest('hex');
      isWebAuthnVerified = cookieUserId === internalUserId && cookieSig === expectedSignature;
    }
  }

  if (!isWebAuthnVerified) {
    return <AdminLoginPortal state="verify-passkey" />;
  }

  const user = {
    username: session.user.name || discordId,
    id: discordId,
  };

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 flex flex-col w-full relative selection:bg-[#5E5CE6]/30 selection:text-white">
      <AmbientBackground />
      <ScrollHeader
        user={{ username: session.user.name, id: session.user.id }}
      />
      <div className="flex-1 flex flex-col min-h-screen bg-transparent relative z-10 pt-16">
        <AdminTopNav user={user} />
        {children}
      </div>
    </div>
  );
}
