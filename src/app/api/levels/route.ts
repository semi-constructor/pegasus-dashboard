import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userXp, xpSettings, users } from '../../../../schemas';
import { desc, eq, inArray } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const leaderboard = await db.select({
      userId: userXp.userId,
      guildId: userXp.guildId,
      level: userXp.level,
      xp: userXp.xp,
      username: users.username,
      avatar: users.avatarUrl
    })
    .from(userXp)
    .innerJoin(users, eq(userXp.userId, users.id))
    .innerJoin(xpSettings, eq(userXp.guildId, xpSettings.guildId))
    .where(eq(xpSettings.isPublic, true))
    .orderBy(desc(userXp.xp))
    .limit(100);

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
