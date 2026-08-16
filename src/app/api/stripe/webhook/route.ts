import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { subscriptions, hostedInstances } from 'schemas/billing';
import { eq, and } from 'drizzle-orm';
import { CoolifyService } from '@/lib/coolify';

function extractSubscriptionDates(sub: any) {
  const item = sub.items?.data?.[0];
  const rawStart = sub.current_period_start || item?.current_period_start || sub.start_date || sub.created || Math.floor(Date.now() / 1000);
  const rawEnd = sub.current_period_end || item?.current_period_end || (typeof rawStart === 'number' ? rawStart + 30 * 24 * 60 * 60 : Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60);

  const start = new Date(typeof rawStart === 'number' ? rawStart * 1000 : rawStart);
  const end = new Date(typeof rawEnd === 'number' ? rawEnd * 1000 : rawEnd);

  return {
    start: isNaN(start.getTime()) ? new Date() : start,
    end: isNaN(end.getTime()) ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : end,
  };
}

export async function POST(req: Request) {
  if (process.env.ENABLE_BILLING !== 'true') {
    return NextResponse.json({ error: 'Billing is disabled' }, { status: 403 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook secret missing' }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription') {
          const subscriptionId = session.subscription as string;
          const customerId = session.customer as string;
          const userId = session.metadata?.userId;

          if (!userId) {
            console.error('Checkout session completed without userId metadata');
            break;
          }

          const subscription: any = await stripe.subscriptions.retrieve(subscriptionId);
          const dates = extractSubscriptionDates(subscription);
          
          await db.insert(subscriptions).values({
            id: subscriptionId,
            userId,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: subscription.items?.data?.[0]?.price?.id || (session as any).line_items?.data?.[0]?.price?.id || 'price_default',
            status: (subscription.status as any) || 'active',
            currentPeriodStart: dates.start,
            currentPeriodEnd: dates.end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
          }).onConflictDoUpdate({
            target: subscriptions.stripeSubscriptionId,
            set: {
              status: (subscription.status as any) || 'active',
              currentPeriodStart: dates.start,
              currentPeriodEnd: dates.end,
              cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
            }
          });

          // Check if instance already exists for this subscription to avoid duplicates
          const existingInstances = await db.select().from(hostedInstances).where(eq(hostedInstances.subscriptionId, subscriptionId));
          
          if (existingInstances.length === 0) {
            await db.insert(hostedInstances).values({
              userId,
              subscriptionId,
              status: 'pending_setup',
            });
          }
        }
        break;
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'customer.subscription.paused':
      case 'customer.subscription.resumed': {
        const subscription: any = event.data.object;
        const dates = extractSubscriptionDates(subscription);
        
        await db.update(subscriptions)
          .set({
            status: subscription.status as any,
            stripePriceId: subscription.items?.data?.[0]?.price?.id,
            currentPeriodStart: dates.start,
            currentPeriodEnd: dates.end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
          })
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

        // If subscription was deleted or canceled, permanently delete linked instances
        if (event.type === 'customer.subscription.deleted' || subscription.status === 'canceled' || subscription.status === 'unpaid') {
          // Find instances to delete
          const instancesToDelete = await db.select().from(hostedInstances)
            .where(eq(hostedInstances.subscriptionId, subscription.id));
            
          for (const instance of instancesToDelete) {
            if (instance.coolifyServiceUuid) {
              try {
                await CoolifyService.delete(instance.coolifyServiceUuid);
              } catch (err) {
                console.error(`Failed to delete Coolify service for instance ${instance.id}`, err);
              }
            }
          }

          await db.delete(hostedInstances)
            .where(eq(hostedInstances.subscriptionId, subscription.id));
        }
        break;
      }
      
      case 'invoice.payment_succeeded':
      case 'invoice.paid': {
        const invoice: any = event.data.object;
        if (invoice.subscription) {
          const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id;
          await db.update(subscriptions)
            .set({ status: 'active' })
            .where(eq(subscriptions.stripeSubscriptionId, subId));
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice: any = event.data.object;
        if (invoice.subscription) {
          const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id;
          await db.update(subscriptions)
            .set({ status: 'past_due' })
            .where(eq(subscriptions.stripeSubscriptionId, subId));
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`[WEBHOOK_ERROR] ${event.type}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
