import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { giveaways, giveawayEntries, users } from '../../../../../schemas';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ gwId: string }> }) {
  try {
    const { gwId } = await params;
    const gw = await db.select().from(giveaways).where(eq(giveaways.messageId, gwId));

    if (!gw.length) {
      return NextResponse.json({ error: 'Giveaway not found' }, { status: 404 });
    }

    const entries = await db.select({
      userId: giveawayEntries.userId,
      username: users.username,
      avatar: users.avatarUrl,
      entries: giveawayEntries.entries
    })
    .from(giveawayEntries)
    .innerJoin(users, eq(giveawayEntries.userId, users.id))
    .where(eq(giveawayEntries.giveawayId, gw[0].giveawayId));

    return NextResponse.json({ giveaway: gw[0], participants: entries });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
