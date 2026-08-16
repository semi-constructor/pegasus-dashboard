import { Metadata } from 'next';
import ClientPricingPage from './ClientPricingPage';
import { MarketingLayout } from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Pricing | Pegasus Hosted',
  description: 'Run Pegasus under your own Discord identity with VaultScope managed hosting.',
};

export default function PricingPage() {
  const billingEnabled = true; // Forced for testing process.env.STRIPE_SECRET_KEY ? true : false;

  return (
    <MarketingLayout>
      <ClientPricingPage billingEnabled={billingEnabled} />
    </MarketingLayout>
  );
}
