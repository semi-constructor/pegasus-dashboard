import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hostedInstanceGuilds, hostedInstances } from 'schemas/billing';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Authenticate and derive instanceId
    const instances = await db.select({ id: hostedInstances.id })
      .from(hostedInstances)
      .where(eq(hostedInstances.controlTokenHash, tokenHash))
      .limit(1);

    if (instances.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const instanceId = instances[0].id;

    const body = await req.json();
    const { guildId, action } = body;

    if (!guildId || !['add', 'remove'].includes(action)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (action === 'add') {
      await db.insert(hostedInstanceGuilds)
        .values({ instanceId, guildId })
        .onConflictDoNothing();
    } else if (action === 'remove') {
      await db.delete(hostedInstanceGuilds)
        .where(
          and(
            eq(hostedInstanceGuilds.instanceId, instanceId),
            eq(hostedInstanceGuilds.guildId, guildId)
          )
        );
    }

    return NextResponse.json({ success: true, instanceId });
  } catch (error) {
    console.error('[CONTROL_API] Guild register failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
