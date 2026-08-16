import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { hostedInstances } from 'schemas/billing';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Activity, Cpu, Server } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function InstancesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const t = await getTranslations('Pricing'); // Reusing some strings or just English for now

  const instances = await db.select().from(hostedInstances)
    .where(eq(hostedInstances.userId, session.user.id));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Pegasus Hosted</h2>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/profile/billing">
            <Button variant="outline">Billing & Invoices</Button>
          </Link>
          <Link href="/pricing">
            <Button>New Instance</Button>
          </Link>
        </div>
      </div>

      {instances.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4 border rounded-xl bg-card border-dashed p-8 text-center">
          <Bot className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold">No Pegasus Hosted instances</h2>
          <p className="text-muted-foreground max-w-md">
            You don't have any hosted bots yet. Get a Pegasus Hosted instance to run your own white-labeled version of Pegasus.
          </p>
          <Link href="/pricing">
            <Button size="lg" className="mt-4">Get Pegasus Hosted</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {instances.map((instance) => (
            <Card key={instance.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {instance.name || 'My Community Bot'}
                      </CardTitle>
                      <CardDescription>Pegasus Hosted</CardDescription>
                    </div>
                  </div>
                  <StatusBadge status={instance.status} />
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Server className="h-4 w-4" />
                      <span>{instance.version || 'v1.0.0'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="h-4 w-4" />
                      <span className="capitalize">{instance.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
                
                <Link href={`/dashboard/instances/${instance.id}`} className="mt-auto">
                  <Button variant="secondary" className="w-full">Manage Instance</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let color = 'bg-secondary text-secondary-foreground';
  let label = status;

  switch (status) {
    case 'active':
      color = 'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25';
      label = 'Online';
      break;
    case 'pending_setup':
      color = 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/25';
      label = 'Setup Required';
      break;
    case 'provisioning':
    case 'deploying':
    case 'starting':
      color = 'bg-blue-500/15 text-blue-500 hover:bg-blue-500/25';
      label = 'Deploying';
      break;
    case 'failed':
      color = 'bg-red-500/15 text-red-500 hover:bg-red-500/25';
      label = 'Failed';
      break;
  }

  return (
    <Badge variant="outline" className={`${color} border-0 font-medium`}>
      {label}
    </Badge>
  );
}
