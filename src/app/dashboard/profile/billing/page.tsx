import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { subscriptions, hostedInstances } from 'schemas/billing';
import { eq, desc } from 'drizzle-orm';
import { BillingClient } from './BillingClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Billing & Invoices | Pegasus Dashboard',
  description: 'Manage your Pegasus subscriptions, view invoices, and payment methods.',
};

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  // Fetch user's subscriptions
  const userSubscriptions = await db.select().from(subscriptions)
    .where(eq(subscriptions.userId, session.user.id))
    .orderBy(desc(subscriptions.createdAt));

  // Count active hosted instances
  const instances = await db.select().from(hostedInstances)
    .where(eq(hostedInstances.userId, session.user.id));

  return (
    <BillingClient
      subscriptions={userSubscriptions}
      instanceCount={instances.length}
    />
  );
}
