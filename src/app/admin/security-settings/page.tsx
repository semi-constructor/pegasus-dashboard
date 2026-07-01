import React from 'react';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { authenticators } from '../../../../schemas/auth';
import { eq } from 'drizzle-orm';
import { Shield, Lock } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/StaggerAnimations';
import PasskeyManager from '@/components/PasskeyManager';

export default async function SecuritySettingsPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Look up the internal database userId using Discord ID from cookie if session.user.id is missing
  let internalUserId = session.user.id as string;
  if (!internalUserId || internalUserId === 'undefined') {
    const cookieStore = await import('next/headers').then(m => m.cookies());
    const userCookie = cookieStore.get('discord_user')?.value;
    if (userCookie) {
      try {
        const discordId = JSON.parse(userCookie).id;
        const account = await db.query.accounts.findFirst({
          where: (accounts, { eq, and }) => and(
            eq(accounts.providerAccountId, discordId),
            eq(accounts.provider, 'discord')
          )
        });
        if (account) {
          internalUserId = account.userId;
        }
      } catch(e) {}
    }
  }

  if (!internalUserId) return null;

  // Fetch registered authenticators for the user
  const userAuthenticators = await db.query.authenticators.findMany({
    where: eq(authenticators.userId, internalUserId),
  });

  return (
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 font-mono">
      <StaggerContainer>
        {/* Header */}
        <StaggerItem>
          <div className="border-b border-white/5 pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 border border-[#5E5CE6]/30 bg-[#5E5CE6]/10 px-3 py-1 mb-4 text-xs font-mono text-[#5E5CE6]">
                <Shield className="w-3.5 h-3.5" />
                <span>Security Configuration</span>
              </div>
              <h1 className="text-4xl font-light tracking-tight text-white mb-2 font-sans uppercase">
                Access & Authentication
              </h1>
              <p className="text-sm text-neutral-400 font-mono tracking-wide">
                Manage your hardware security keys and authentication devices for the master control plane.
              </p>
            </div>
            <div className="border border-white/5 bg-white/[0.02] p-4 shrink-0 flex items-center gap-4">
              <Lock className="w-6 h-6 text-neutral-500" />
              <div>
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold mb-1">Passkey Enforced</p>
                <p className="text-xs text-white">Strict WebAuthn Mode</p>
              </div>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <PasskeyManager authenticators={userAuthenticators} />
        </StaggerItem>
      </StaggerContainer>
    </main>
  );
}
