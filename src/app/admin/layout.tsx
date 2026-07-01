import React from 'react';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AdminLoginPortal from '@/components/AdminLoginPortal';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { accounts, authenticators } from '../../../schemas/auth';
import { eq } from 'drizzle-orm';

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

  // If session.user.id is missing or undefined (due to custom NextAuth callbacks),
  // we look up the internal database userId using the verified discordId.
  let internalUserId = session.user.id as string;
  let discordId: string | null = null;
  
  const cookieStore = await import('next/headers').then(m => m.cookies());
  const userCookie = cookieStore.get('discord_user')?.value;
  if (userCookie) {
    try {
      discordId = JSON.parse(userCookie).id;
    } catch(e) {}
  }

  if (!internalUserId || internalUserId === 'undefined') {
    if (discordId) {
      const account = await db.query.accounts.findFirst({
        where: (accounts, { eq, and }) => and(
          eq(accounts.providerAccountId, discordId!),
          eq(accounts.provider, 'discord')
        )
      });
      if (account) {
        internalUserId = account.userId;
      }
    }
  } else {
    // If we have internalUserId, we can fetch discordId if we don't have it
    if (!discordId) {
      const account = await db.query.accounts.findFirst({
        where: (accounts, { eq, and }) => and(
          eq(accounts.userId, internalUserId),
          eq(accounts.provider, 'discord')
        )
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
    adminIds = [process.env.ADMIN || ''];
  }

  // Logged in, but not admin -> redirect to /dashboard
  if (!discordId || !adminIds.includes(discordId)) {
    redirect('/dashboard');
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

  // @ts-ignore
  const isWebAuthnSession = session.provider === 'webauthn';

  // Prompt to verify passkey if they have one but haven't verified in this session
  if (!isWebAuthnSession) {
    return <AdminLoginPortal state="verify-passkey" />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black text-neutral-100">
      <AdminSidebar user={{ username: session.user.name || discordId, id: discordId }} />
      <div className="flex-1 min-w-0 flex flex-col bg-black">
        {children}
      </div>
    </div>
  );
}
