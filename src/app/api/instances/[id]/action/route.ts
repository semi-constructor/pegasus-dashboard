import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { hostedInstances } from 'schemas/billing';
import { eq, and } from 'drizzle-orm';
import { CoolifyService } from '@/lib/coolify';
import { runProvisioningWorkflow } from '@/lib/provisioning-worker';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const action = body.action; // 'start' | 'stop' | 'restart' | 'redeploy'
    
    if (!['start', 'stop', 'restart', 'redeploy'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const instances = await db.select().from(hostedInstances)
      .where(
        and(
          eq(hostedInstances.id, id),
          eq(hostedInstances.userId, session.user.id)
        )
      )
      .limit(1);

    if (instances.length === 0) {
      return NextResponse.json({ error: 'Instance not found or unauthorized' }, { status: 404 });
    }

    const instance = instances[0];
    if (!instance.coolifyServiceUuid) {
      return NextResponse.json({ error: 'Instance not yet provisioned' }, { status: 400 });
    }

    if (action === 'start') {
      await CoolifyService.start(instance.coolifyServiceUuid);
    } else if (action === 'stop') {
      await CoolifyService.stop(instance.coolifyServiceUuid);
    } else if (action === 'restart') {
      await CoolifyService.restart(instance.coolifyServiceUuid);
    } else if (action === 'redeploy') {
      await db.update(hostedInstances).set({ status: 'deploying' }).where(eq(hostedInstances.id, instance.id));
      await CoolifyService.deploy(instance.coolifyServiceUuid);
      // Optional: Polling could be started here similar to provisioning
    }
    
    return NextResponse.json({ success: true, action });
  } catch (error) {
    console.error('[ACTION_POST_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
