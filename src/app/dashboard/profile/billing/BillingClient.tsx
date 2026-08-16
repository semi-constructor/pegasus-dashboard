"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ExternalLink, ShieldCheck, Receipt, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface SubscriptionData {
  id: string;
  status: string;
  stripePriceId: string | null;
  currentPeriodStart: Date | string;
  currentPeriodEnd: Date | string;
  cancelAtPeriodEnd: boolean | null;
}

interface BillingClientProps {
  subscriptions: SubscriptionData[];
  instanceCount: number;
}

export function BillingClient({ subscriptions, instanceCount }: BillingClientProps) {
  const [loadingPortal, setLoadingPortal] = useState(false);

  const handleOpenPortal = async () => {
    setLoadingPortal(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to open billing portal');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast.error(err.message || 'Error redirecting to Stripe Billing Portal');
    } finally {
      setLoadingPortal(false);
    }
  };

  const formatDate = (dateValue: Date | string) => {
    try {
      return new Date(dateValue).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  const getPlanName = (priceId: string | null) => {
    if (!priceId || priceId === 'price_default') return 'Pegasus Hosted Dedicated Tier';
    return `Pegasus Plan (${priceId})`;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Invoices</h1>
          <p className="text-muted-foreground mt-2">
            Manage your Pegasus subscriptions, view payment history, and download tax invoices.
          </p>
        </div>
        <div className="bg-muted/50 border px-4 py-2 rounded-lg text-sm flex flex-col">
          <span className="text-muted-foreground">Active Hosted Bot Stacks</span>
          <span className="font-bold text-lg">{instanceCount} instance{instanceCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Subscription Status Cards */}
        <div className="md:col-span-2 space-y-6">
          {subscriptions.length > 0 ? (
            subscriptions.map((subscription) => (
              <Card key={subscription.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Current Plan</CardTitle>
                      <CardDescription>{getPlanName(subscription.stripePriceId)}</CardDescription>
                    </div>
                    <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'} className="capitalize">
                      {subscription.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Current Billing Cycle
                      </span>
                      <span className="text-sm font-medium">
                        {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Renewal Status
                      </span>
                      <span className="text-sm font-medium">
                        {subscription.cancelAtPeriodEnd
                          ? `Cancels on ${formatDate(subscription.currentPeriodEnd)}`
                          : `Auto-renews on ${formatDate(subscription.currentPeriodEnd)}`}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 flex flex-col sm:flex-row gap-3 justify-between items-center border-t pt-4">
                  <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>Payments and invoices are securely processed by Stripe</span>
                  </div>
                  <Button onClick={handleOpenPortal} disabled={loadingPortal} className="w-full sm:w-auto gap-2">
                    {loadingPortal ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                    Manage Invoices & Payment Methods
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent>
                <div className="py-8 text-center text-muted-foreground space-y-4 mt-4">
                  <p>You currently do not have an active Pegasus Hosted subscription.</p>
                  <Link href="/pricing">
                    <Button variant="outline" className="gap-2">
                      View Pricing Plans <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Invoices & Tax Actions */}
        <div>
          <Card className="flex flex-col h-full">
            <CardHeader>
              <div className="p-3 bg-primary/10 w-fit rounded-lg mb-2">
                <Receipt className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Invoices & Receipts</CardTitle>
              <CardDescription>
                Access PDF invoices, receipt downloads, and VAT/tax information.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Stripe Customer Portal allows you to download historical billing receipts, update your company billing address, and manage payment cards.
              </p>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleOpenPortal}
                disabled={loadingPortal || subscriptions.length === 0}
              >
                {loadingPortal ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                Open Stripe Portal
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
