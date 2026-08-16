import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { hostedInstances, subscriptions } from 'schemas/billing';
import { eq, and } from 'drizzle-orm';
import { getStripe } from '@/lib/stripe';
import { InstanceSetupClient } from './InstanceSetupClient';
import crypto from 'crypto';

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SetupInstancePage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const { session_id: sessionId } = await searchParams;

  // 1. Check if user already has a pending_setup instance in the database
  let pendingInstances = await db.select().from(hostedInstances)
    .where(
      and(
        eq(hostedInstances.userId, session.user.id),
        eq(hostedInstances.status, 'pending_setup')
      )
    )
    .limit(1);

  // 2. If no pending instance found, check if a valid Stripe session_id was passed
  if (pendingInstances.length === 0 && sessionId) {
    try {
      const stripe = getStripe();
      if (stripe) {
        const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
        
        // Verify session was paid and is in subscription mode
        if (
          checkoutSession &&
          checkoutSession.payment_status === 'paid' &&
          checkoutSession.mode === 'subscription' &&
          checkoutSession.subscription
        ) {
          const subId = typeof checkoutSession.subscription === 'string' 
            ? checkoutSession.subscription 
            : checkoutSession.subscription.id;
          const customerId = typeof checkoutSession.customer === 'string' 
            ? checkoutSession.customer 
            : checkoutSession.customer?.id;

          const stripeSub: any = await stripe.subscriptions.retrieve(subId);
          const item = stripeSub.items?.data?.[0];
          const rawStart = stripeSub.current_period_start || item?.current_period_start || stripeSub.start_date || stripeSub.created || Math.floor(Date.now() / 1000);
          const rawEnd = stripeSub.current_period_end || item?.current_period_end || (typeof rawStart === 'number' ? rawStart + 30 * 24 * 60 * 60 : Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60);

          const pStart = new Date(typeof rawStart === 'number' ? rawStart * 1000 : rawStart);
          const pEnd = new Date(typeof rawEnd === 'number' ? rawEnd * 1000 : rawEnd);

          const currentPeriodStart = isNaN(pStart.getTime()) ? new Date() : pStart;
          const currentPeriodEnd = isNaN(pEnd.getTime()) ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : pEnd;

          // Upsert subscription
          await db.insert(subscriptions).values({
            id: subId,
            userId: session.user.id,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subId,
            stripePriceId: stripeSub.items?.data?.[0]?.price?.id || 'price_default',
            status: (stripeSub.status as any) || 'active',
            currentPeriodStart,
            currentPeriodEnd,
            cancelAtPeriodEnd: stripeSub.cancel_at_period_end || false,
          }).onConflictDoUpdate({
            target: subscriptions.stripeSubscriptionId,
            set: {
              status: (stripeSub.status as any) || 'active',
              currentPeriodStart,
              currentPeriodEnd,
              cancelAtPeriodEnd: stripeSub.cancel_at_period_end || false,
            }
          });

          // Create pending instance
          const newInstanceId = crypto.randomUUID();
          await db.insert(hostedInstances).values({
            id: newInstanceId,
            userId: session.user.id,
            subscriptionId: subId,
            status: 'pending_setup',
          });

          pendingInstances = await db.select().from(hostedInstances)
            .where(eq(hostedInstances.id, newInstanceId))
            .limit(1);
        }
      }
    } catch (err) {
      console.error('Error verifying Stripe session on setup page:', err);
    }
  }

  // 3. If still no pending instance exists, user does not have an unconfigured purchase
  if (pendingInstances.length === 0) {
    // Check if user has active instances already configured
    const userInstances = await db.select().from(hostedInstances)
      .where(eq(hostedInstances.userId, session.user.id));

    if (userInstances.length > 0) {
      // User already set up their instance(s), redirect to instances management
      redirect('/dashboard/instances');
    } else {
      // User has not paid yet, redirect to pricing
      redirect('/pricing');
    }
  }

  return (
    <InstanceSetupClient
      sessionId={sessionId}
      instanceId={pendingInstances[0].id}
    />
  );
}
