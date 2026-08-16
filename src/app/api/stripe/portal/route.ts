import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { subscriptions } from 'schemas/billing';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (process.env.ENABLE_BILLING !== 'true') {
      return NextResponse.json({ error: 'Billing is disabled' }, { status: 403 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 });
    }

    // Find customer's active or existing subscription
    const userSubscriptions = await db.select().from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))
      .limit(1);

    if (userSubscriptions.length === 0 || !userSubscriptions[0].stripeCustomerId) {
      return NextResponse.json({ error: 'No active billing customer found' }, { status: 404 });
    }

    const customerId = userSubscriptions[0].stripeCustomerId;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/dashboard/profile/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error('[STRIPE_PORTAL_ERROR]', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
