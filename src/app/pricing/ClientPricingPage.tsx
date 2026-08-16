"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function ClientPricingPage({ billingEnabled }: { billingEnabled: boolean }) {
  const t = useTranslations('pricing');
  const [isYearly, setIsYearly] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (!billingEnabled) {
      toast.error(t('billingDisabled'));
      return;
    }

    setLoading(true);
    try {
      // First attempt real Stripe checkout session
      let res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: isYearly ? 'yearly' : 'monthly' }),
      });

      if (!res.ok) {
        throw new Error('Failed to create checkout session. Please check your Stripe keys and configuration.');
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error(t('checkoutError'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-6xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className={`text-sm ${!isYearly ? 'font-bold' : 'text-muted-foreground'}`}>{t('monthly')} €4.99</span>
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className="w-14 h-7 rounded-full bg-primary/20 flex items-center px-1 cursor-pointer transition-colors"
          >
            <div className={`w-5 h-5 rounded-full bg-primary transition-transform ${isYearly ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
          <span className={`text-sm ${isYearly ? 'font-bold' : 'text-muted-foreground'}`}>
            {t('yearly')} €49.99 <span className="text-green-500 ml-1">({t('saveMonths')})</span>
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12 text-left">
          {/* Free Tier */}
          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl uppercase tracking-wider text-muted-foreground">{t('freeTier.title')}</CardTitle>
              <div className="text-4xl font-bold mt-4">{t('freeTier.price')}</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2"><Check className="text-green-500" /> {t('freeTier.feature1')}</div>
              <div className="flex items-center gap-2"><Check className="text-green-500" /> {t('freeTier.feature2')}</div>
              <div className="flex items-center gap-2"><Check className="text-green-500" /> {t('freeTier.feature3')}</div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://github.com/semi-constructor/pegasus-dashboard" target="_blank" rel="noreferrer">
                  {t('freeTier.cta')}
                </a>
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Tier */}
          <Card className="border-2 border-primary relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
              {t('premiumTier.recommended')}
            </div>
            <CardHeader>
              <CardTitle className="text-2xl uppercase tracking-wider text-primary">{t('premiumTier.title')}</CardTitle>
              <div className="text-4xl font-bold mt-4">
                €{isYearly ? '49.99' : '4.99'}<span className="text-lg text-muted-foreground font-normal">/{isYearly ? 'yr' : 'mo'}</span>
              </div>
              {isYearly && (
                <div className="text-sm text-green-500 font-medium mt-1">
                  {t('premiumTier.saveAmount')}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2"><Check className="text-primary" /> {t('premiumTier.feature1')}</div>
              <div className="flex items-center gap-2"><Check className="text-primary" /> {t('premiumTier.feature2')}</div>
              <div className="flex items-center gap-2"><Check className="text-primary" /> {t('premiumTier.feature3')}</div>
              <div className="flex items-center gap-2"><Check className="text-primary" /> {t('premiumTier.feature4')}</div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCheckout}
                disabled={loading || !billingEnabled}
              >
                {loading ? t('premiumTier.processing') : t('premiumTier.cta')}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="max-w-2xl mx-auto mt-16 p-8 bg-card rounded-xl border border-border/50 text-left">
          <h3 className="text-2xl font-bold mb-4">{t('bringYourOwn.title')}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {t('bringYourOwn.description')}
          </p>
        </div>
      </div>
    </div>
  );
}
