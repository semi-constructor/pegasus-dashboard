import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { economyBalances, economySettings, users, guildSettings } from '../../../../../schemas';
import { desc, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  try {
    const { guildId } = await params;
    const settings = await db.select().from(guildSettings).where(eq(guildSettings.guildId, guildId));

    if (!settings.length || !settings[0].publicEco) {
      return NextResponse.json({ error: 'Leaderboard is not public for this guild' }, { status: 403 });
    }

    const leaderboard = await db.select({
      userId: economyBalances.userId,
      balance: economyBalances.balance,
      bankBalance: economyBalances.bankBalance,
      username: users.username,
      avatar: users.avatarUrl
    })
    .from(economyBalances)
    .innerJoin(users, eq(economyBalances.userId, users.id))
    .where(eq(economyBalances.guildId, guildId))
    .orderBy(desc(economyBalances.balance))
    .limit(100);

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
