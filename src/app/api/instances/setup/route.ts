import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { hostedInstances } from 'schemas/billing';
import { eq, and } from 'drizzle-orm';
import { encryptToken } from '@/lib/encryption';
import { runProvisioningWorkflow } from '@/lib/provisioning-worker';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token, sessionId } = await req.json();
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Find a pending setup instance for this user
    let instances = await db.select().from(hostedInstances)
      .where(
        and(
          eq(hostedInstances.userId, session.user.id),
          eq(hostedInstances.status, 'pending_setup')
        )
      )
      .limit(1);

    // Fallback: If webhook didn't insert yet or had signature mismatch, verify directly with Stripe
    if (instances.length === 0 && sessionId && typeof sessionId === 'string') {
      try {
        const { getStripe } = await import('@/lib/stripe');
        const stripe = getStripe();
        if (stripe) {
          const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
          if (
            checkoutSession &&
            checkoutSession.payment_status === 'paid' &&
            checkoutSession.mode === 'subscription' &&
            checkoutSession.subscription
          ) {
            const subId = typeof checkoutSession.subscription === 'string' ? checkoutSession.subscription : checkoutSession.subscription.id;
            const customerId = typeof checkoutSession.customer === 'string' ? checkoutSession.customer : checkoutSession.customer?.id;
            const stripeSub: any = await stripe.subscriptions.retrieve(subId);

            const { subscriptions } = await import('schemas/billing');
            const item = stripeSub.items?.data?.[0];
            const rawStart = stripeSub.current_period_start || item?.current_period_start || stripeSub.start_date || stripeSub.created || Math.floor(Date.now() / 1000);
            const rawEnd = stripeSub.current_period_end || item?.current_period_end || (typeof rawStart === 'number' ? rawStart + 30 * 24 * 60 * 60 : Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60);

            const pStart = new Date(typeof rawStart === 'number' ? rawStart * 1000 : rawStart);
            const pEnd = new Date(typeof rawEnd === 'number' ? rawEnd * 1000 : rawEnd);

            const currentPeriodStart = isNaN(pStart.getTime()) ? new Date() : pStart;
            const currentPeriodEnd = isNaN(pEnd.getTime()) ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : pEnd;

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

            const newInstanceId = (await import('crypto')).randomUUID();
            await db.insert(hostedInstances).values({
              id: newInstanceId,
              userId: session.user.id,
              subscriptionId: subId,
              status: 'pending_setup',
            });

            instances = await db.select().from(hostedInstances)
              .where(eq(hostedInstances.id, newInstanceId))
              .limit(1);
          }
        }
      } catch (reconError) {
        console.error('Failed to reconcile Stripe session:', reconError);
      }
    }

    if (instances.length === 0) {
      return NextResponse.json({ error: 'No pending instance found for this account. Please complete a purchase first.' }, { status: 404 });
    }

    const instance = instances[0];

    // Verify token with Discord
    const discordRes = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bot ${token}`
      }
    });

    if (!discordRes.ok) {
      return NextResponse.json({ error: 'Invalid Discord Bot Token' }, { status: 400 });
    }

    const discordUser = await discordRes.json();
    if (!discordUser.bot) {
      return NextResponse.json({ error: 'Token belongs to a user account, not a bot account' }, { status: 400 });
    }

    // Encrypt the token securely
    const encryptedToken = encryptToken(token);

    // Update the instance
    await db.update(hostedInstances)
      .set({
        discordBotId: discordUser.id,
        encryptedBotToken: encryptedToken,
        status: 'provisioning', // Transition to provisioning
      })
      .where(eq(hostedInstances.id, instance.id));

    // Get the Discord provider account ID for the user
    const { accounts } = await import('schemas/auth');
    const userAccounts = await db.select().from(accounts)
      .where(and(eq(accounts.userId, session.user.id), eq(accounts.provider, 'discord')))
      .limit(1);
    
    let ownerDiscordId = userAccounts.length > 0 ? userAccounts[0].providerAccountId : session.user.id;
    if (!/^\d{17,19}$/.test(ownerDiscordId)) {
      ownerDiscordId = undefined as any;
    }

    // Fire and forget background provisioning task with complete metadata
    runProvisioningWorkflow(instance.id, token, discordUser.id, ownerDiscordId).catch(console.error);

    return NextResponse.json({ success: true, botName: discordUser.username });
  } catch (error) {
    console.error('[INSTANCE_SETUP_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
