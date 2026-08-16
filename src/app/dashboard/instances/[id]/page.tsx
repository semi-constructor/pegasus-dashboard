import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { hostedInstances } from 'schemas/billing';
import { eq, and } from 'drizzle-orm';
import InstanceClient from './InstanceClient';

export default async function InstancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const instances = await db.select().from(hostedInstances)
    .where(
      and(
        eq(hostedInstances.id, id),
        eq(hostedInstances.userId, session.user.id)
      )
    ).limit(1);

  if (instances.length === 0) {
    redirect('/dashboard/instances');
  }

  const instance = instances[0];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-7xl mx-auto">
      <InstanceClient initialInstance={instance} />
    </div>
  );
}
