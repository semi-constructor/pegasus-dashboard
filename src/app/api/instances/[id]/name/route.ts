import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { hostedInstances } from 'schemas/billing';
import { eq, and } from 'drizzle-orm';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Valid name is required' }, { status: 400 });
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

    await db.update(hostedInstances)
      .set({ name })
      .where(eq(hostedInstances.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[INSTANCE_NAME_PATCH_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
