import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { economyBalances, economySettings, users } from '../../../../schemas';
import { desc, eq, inArray } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const leaderboard = await db.select({
      userId: economyBalances.userId,
      guildId: economyBalances.guildId,
      balance: economyBalances.balance,
      bankBalance: economyBalances.bankBalance,
      username: users.username,
      avatar: users.avatarUrl
    })
    .from(economyBalances)
    .innerJoin(users, eq(economyBalances.userId, users.id))
    .innerJoin(economySettings, eq(economyBalances.guildId, economySettings.guildId))
    .where(eq(economySettings.isPublic, true))
    .orderBy(desc(economyBalances.balance))
    .limit(100);

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
