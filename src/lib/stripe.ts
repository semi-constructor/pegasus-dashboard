import Stripe from 'stripe';

export const getStripe = (): Stripe | null => {
  if (process.env.ENABLE_BILLING !== 'true' || !process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    appInfo: { name: 'Pegasus Dashboard' },
  });
};
