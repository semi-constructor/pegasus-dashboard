import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { hostedInstances } from 'schemas/billing';
import { eq, and } from 'drizzle-orm';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    let liveStatus = instance.status;
    let coolifyDetail: any = null;

    if (instance.coolifyServiceUuid) {
      try {
        const coolifyUrl = process.env.COOLIFY_API_URL;
        const token = process.env.COOLIFY_API_TOKEN;
        if (coolifyUrl && token) {
          const res = await fetch(`${coolifyUrl}/api/v1/services/${instance.coolifyServiceUuid}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            coolifyDetail = await res.json();
            const botApp = coolifyDetail.applications?.find((a: any) => a.name === 'bot') || coolifyDetail.applications?.[0];
            const rawStatus = botApp?.status || coolifyDetail.status || '';

            if (rawStatus.startsWith('running:healthy') || rawStatus === 'running') {
              liveStatus = 'active';
            } else if (rawStatus.startsWith('running:unknown')) {
              // Service is running but health check is still verifying
              liveStatus = 'active';
            } else if (rawStatus.startsWith('exited') || rawStatus.startsWith('stopped')) {
              // Ignore 'stopped' if we are currently deploying, as Coolify returns 'stopped' initially
              if (instance.status !== 'deploying') {
                liveStatus = 'stopped';
              }
            } else if (rawStatus.startsWith('restarting') || rawStatus.startsWith('degraded') || rawStatus.startsWith('unhealthy') || rawStatus.startsWith('starting:unhealthy') || rawStatus.includes('unhealthy')) {
              liveStatus = 'error';
            } else if (rawStatus.startsWith('in_progress') || rawStatus.startsWith('building') || rawStatus.startsWith('queued') || rawStatus.startsWith('starting')) {
              liveStatus = 'deploying';
            }

            // Sync database if status changed
            if (liveStatus !== instance.status && ['active', 'stopped', 'error', 'deploying'].includes(liveStatus)) {
              await db.update(hostedInstances)
                .set({ status: liveStatus as any })
                .where(eq(hostedInstances.id, id));
            }
          }
        }
      } catch (coolifyErr) {
        console.error('[STATUS_COOLIFY_FETCH_ERROR]', coolifyErr);
      }
    }

    return NextResponse.json({ 
      status: liveStatus,
      rawCoolifyStatus: coolifyDetail?.status,
      version: instance.version || 'v1.0.0',
      commitSha: instance.commitSha || 'main',
      discordBotId: instance.discordBotId,
      containers: [
        ...(coolifyDetail?.applications || []).map((a: any) => ({ name: a.name, status: a.status })),
        ...(coolifyDetail?.databases || []).map((d: any) => ({ name: d.name, status: d.status })),
      ]
    });
  } catch (error) {
    console.error('[STATUS_GET_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
