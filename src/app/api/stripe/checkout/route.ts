import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    if (process.env.ENABLE_BILLING !== 'true') {
      return NextResponse.json({ error: 'Billing is disabled' }, { status: 403 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { plan } = body;

    let priceId = '';
    if (plan === 'monthly') {
      priceId = process.env.STRIPE_MONTHLY_PRICE_ID || '';
    } else if (plan === 'yearly') {
      priceId = process.env.STRIPE_YEARLY_PRICE_ID || '';
    } else {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID not configured on server' }, { status: 500 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard/instances/new?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
      metadata: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
